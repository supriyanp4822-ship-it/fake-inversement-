import https from 'https';
import http from 'http';
import dns from 'dns';
import { URL } from 'url';
import Report from '../models/Report';

/* ──────────────────────────────────────────────────────────────────────────────
 *  Types
 * ────────────────────────────────────────────────────────────────────────────── */

export interface WebsiteAnalysisResult {
  domain: string;
  url: string;
  httpsStatus: {
    isSecure: boolean;
    certificateValid: boolean;
    details: string;
  };
  websiteAge: {
    registrationDate: string | null;
    ageText: string;
    ageInDays: number | null;
  };
  companyInfo: {
    detected: boolean;
    details: string[];
  };
  contactInfo: {
    detected: boolean;
    details: string[];
  };
  suspiciousIndicators: {
    indicator: string;
    severity: 'low' | 'medium' | 'high';
    explanation: string;
  }[];
  previousReports: {
    count: number;
    details: string;
  };
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskExplanation: string;
  analysisTimestamp: string;
}

/* ──────────────────────────────────────────────────────────────────────────────
 *  Helpers
 * ────────────────────────────────────────────────────────────────────────────── */

/**
 * Perform an HTTP(S) HEAD request and return status code + headers.
 * Resolves even on error so we can treat it as a signal rather than a crash.
 */
const headRequest = (
  targetUrl: string,
  timeoutMs = 8000,
): Promise<{ ok: boolean; statusCode?: number; headers?: http.IncomingHttpHeaders; error?: string }> =>
  new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const requester = parsed.protocol === 'https:' ? https : http;

      const req = requester.request(
        targetUrl,
        { method: 'HEAD', timeout: timeoutMs, headers: { 'User-Agent': 'FraudDetection-Bot/1.0' } },
        (res) => {
          resolve({ ok: true, statusCode: res.statusCode, headers: res.headers });
        },
      );

      req.on('error', (err) => resolve({ ok: false, error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'Request timed out' });
      });
      req.end();
    } catch (err: any) {
      resolve({ ok: false, error: err.message });
    }
  });

/**
 * Resolve DNS A records for a hostname.
 */
const resolveDns = (hostname: string): Promise<string[]> =>
  new Promise((resolve) => {
    dns.resolve4(hostname, (err, addresses) => {
      resolve(err ? [] : addresses);
    });
  });

/**
 * Attempt to fetch RDAP / WHOIS data for a domain via public RDAP.
 * Returns the registration date string or null.
 */
const fetchRdapRegistration = (domain: string): Promise<string | null> =>
  new Promise((resolve) => {
    // Extract the registrable domain (last two parts)
    const parts = domain.split('.');
    const registrable = parts.length >= 2 ? parts.slice(-2).join('.') : domain;

    const rdapUrl = `https://rdap.org/domain/${registrable}`;

    https
      .get(rdapUrl, { timeout: 8000, headers: { Accept: 'application/rdap+json' } }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            // Look for the registration event
            const events = json.events || [];
            const regEvent = events.find(
              (e: any) => e.eventAction === 'registration' || e.eventAction === 'registrationDate',
            );
            if (regEvent?.eventDate) {
              resolve(regEvent.eventDate);
            } else {
              // Fallback: try to find any date
              const anyEvent = events.find((e: any) => e.eventDate);
              resolve(anyEvent?.eventDate || null);
            }
          } catch {
            resolve(null);
          }
        });
      })
      .on('error', () => resolve(null))
      .on('timeout', function (this: http.ClientRequest) {
        this.destroy();
        resolve(null);
      });
  });

/**
 * Calculate human-readable age from a date string.
 */
const calculateAge = (dateStr: string): { ageText: string; ageInDays: number } => {
  const regDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - regDate.getTime();
  const ageInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (ageInDays < 0) return { ageText: 'Unknown', ageInDays: 0 };

  const years = Math.floor(ageInDays / 365);
  const months = Math.floor((ageInDays % 365) / 30);
  const days = ageInDays % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

  return { ageText: parts.join(', '), ageInDays };
};

/* ──────────────────────────────────────────────────────────────────────────────
 *  Suspicious pattern lists
 * ────────────────────────────────────────────────────────────────────────────── */

const SUSPICIOUS_HOSTNAME_KEYWORDS = [
  'crypto', 'bitcoin', 'forex', 'trading-bot', 'guaranteed', 'profit',
  'scam', 'fast-cash', 'double-money', 'get-rich', 'quantum', 'ai-trading',
  'instant-profit', 'high-returns', 'no-risk',
];

const HIGH_RISK_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.top', '.work', '.click', '.loan', '.racing'];

/* ──────────────────────────────────────────────────────────────────────────────
 *  Main Analysis Function
 * ────────────────────────────────────────────────────────────────────────────── */

export const analyzeWebsite = async (rawUrl: string): Promise<WebsiteAnalysisResult> => {
  // ── Normalise URL ──────────────────────────────────────────────────────────
  let normalised = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalised)) {
    normalised = `https://${normalised}`;
  }

  const parsed = new URL(normalised); // will throw on truly malformed URLs
  const domain = parsed.hostname;

  const indicators: WebsiteAnalysisResult['suspiciousIndicators'] = [];
  let scoreComponents: { label: string; points: number; max: number }[] = [];

  // ── 1. HTTPS & Certificate Check ──────────────────────────────────────────
  const httpsUrl = `https://${domain}`;
  const httpsResult = await headRequest(httpsUrl);

  const isSecure = parsed.protocol === 'https:';
  const certValid = httpsResult.ok && !httpsResult.error?.includes('certificate');

  const httpsStatus = {
    isSecure,
    certificateValid: certValid,
    details: isSecure
      ? certValid
        ? 'Website uses HTTPS with a valid SSL certificate'
        : 'Website uses HTTPS but the certificate may have issues'
      : 'Website does not use HTTPS — data transmitted in plain text',
  };

  if (!isSecure) {
    indicators.push({
      indicator: 'No HTTPS',
      severity: 'medium',
      explanation: 'The website does not use encrypted HTTPS connections. This alone is not proof of fraud but is below modern security standards.',
    });
    scoreComponents.push({ label: 'No HTTPS', points: 8, max: 15 });
  } else if (!certValid) {
    indicators.push({
      indicator: 'SSL Certificate Issue',
      severity: 'medium',
      explanation: 'The SSL certificate could not be fully validated. This may indicate a misconfigured or expired certificate.',
    });
    scoreComponents.push({ label: 'SSL issue', points: 5, max: 15 });
  }

  // ── 2. DNS Resolution ─────────────────────────────────────────────────────
  const dnsRecords = await resolveDns(domain);
  if (dnsRecords.length === 0) {
    indicators.push({
      indicator: 'DNS Resolution Failed',
      severity: 'high',
      explanation: 'The domain could not be resolved to an IP address. The website may not exist or may have been taken down.',
    });
    scoreComponents.push({ label: 'DNS failure', points: 20, max: 20 });
  }

  // ── 3. Domain Age ─────────────────────────────────────────────────────────
  const registrationDate = await fetchRdapRegistration(domain);
  let websiteAge: WebsiteAnalysisResult['websiteAge'];

  if (registrationDate) {
    const { ageText, ageInDays } = calculateAge(registrationDate);
    websiteAge = {
      registrationDate,
      ageText,
      ageInDays,
    };

    if (ageInDays < 90) {
      indicators.push({
        indicator: 'Very New Domain',
        severity: 'medium',
        explanation: `This domain was registered less than 90 days ago (${ageText}). Newly registered domains are more commonly used for scams, though many legitimate sites are also new.`,
      });
      scoreComponents.push({ label: 'New domain (<90 days)', points: 12, max: 15 });
    } else if (ageInDays < 365) {
      indicators.push({
        indicator: 'Recently Registered Domain',
        severity: 'low',
        explanation: `This domain was registered less than a year ago (${ageText}). Consider verifying the company's track record.`,
      });
      scoreComponents.push({ label: 'Domain <1 year', points: 5, max: 15 });
    }
  } else {
    websiteAge = {
      registrationDate: null,
      ageText: 'Unknown — WHOIS data unavailable',
      ageInDays: null,
    };
  }

  // ── 4. Hostname Heuristics ────────────────────────────────────────────────
  const lowerHost = domain.toLowerCase();

  // Excessive hyphens
  if ((lowerHost.match(/-/g) || []).length >= 3) {
    indicators.push({
      indicator: 'Excessive Hyphens in Domain',
      severity: 'low',
      explanation: 'The domain name contains many hyphens, which is sometimes used to mimic legitimate brand names.',
    });
    scoreComponents.push({ label: 'Excessive hyphens', points: 5, max: 10 });
  }

  // Numeric strings (IP-like or random numbers)
  if (/\d{4,}/.test(lowerHost)) {
    indicators.push({
      indicator: 'Long Numeric Sequence in Domain',
      severity: 'low',
      explanation: 'The domain contains a long sequence of numbers, which is unusual for legitimate investment companies.',
    });
    scoreComponents.push({ label: 'Numeric hostname', points: 5, max: 10 });
  }

  // Suspicious keywords
  const matchedKeywords = SUSPICIOUS_HOSTNAME_KEYWORDS.filter((kw) => lowerHost.includes(kw));
  if (matchedKeywords.length > 0) {
    indicators.push({
      indicator: 'Suspicious Keywords in Domain',
      severity: 'medium',
      explanation: `The domain contains potentially suspicious keywords: ${matchedKeywords.join(', ')}. These are commonly found in fraudulent investment websites.`,
    });
    scoreComponents.push({ label: 'Suspicious keywords', points: Math.min(matchedKeywords.length * 5, 15), max: 15 });
  }

  // ── 5. TLD Risk ───────────────────────────────────────────────────────────
  const tld = '.' + domain.split('.').pop()!.toLowerCase();
  if (HIGH_RISK_TLDS.includes(tld)) {
    indicators.push({
      indicator: 'High-Risk TLD',
      severity: 'medium',
      explanation: `The domain uses the "${tld}" top-level domain, which is associated with a higher prevalence of fraudulent websites. This does not automatically mean the site is malicious.`,
    });
    scoreComponents.push({ label: 'High-risk TLD', points: 10, max: 10 });
  }

  // ── 6. Company & Contact Information Probes ───────────────────────────────
  const companyPaths = ['/about', '/about-us', '/company', '/team', '/our-story'];
  const contactPaths = ['/contact', '/contact-us', '/support', '/help'];
  const legalPaths = ['/privacy', '/privacy-policy', '/terms', '/terms-of-service'];

  const baseUrl = `${parsed.protocol}//${domain}`;

  const probePages = async (paths: string[]): Promise<string[]> => {
    const found: string[] = [];
    for (const p of paths) {
      const result = await headRequest(`${baseUrl}${p}`, 5000);
      if (result.ok && result.statusCode && result.statusCode >= 200 && result.statusCode < 400) {
        found.push(p);
      }
    }
    return found;
  };

  const [companyPages, contactPages, legalPages] = await Promise.all([
    probePages(companyPaths),
    probePages(contactPaths),
    probePages(legalPaths),
  ]);

  const companyInfo: WebsiteAnalysisResult['companyInfo'] = {
    detected: companyPages.length > 0 || legalPages.length > 0,
    details: [],
  };
  if (companyPages.length > 0) companyInfo.details.push(`Found company pages: ${companyPages.join(', ')}`);
  if (legalPages.length > 0) companyInfo.details.push(`Found legal pages: ${legalPages.join(', ')}`);
  if (companyInfo.details.length === 0) companyInfo.details.push('No company or legal pages detected');

  const contactInfo: WebsiteAnalysisResult['contactInfo'] = {
    detected: contactPages.length > 0,
    details: contactPages.length > 0
      ? [`Found contact pages: ${contactPages.join(', ')}`]
      : ['No contact pages detected'],
  };

  // Missing pages contribute to score
  if (companyPages.length === 0 && legalPages.length === 0) {
    indicators.push({
      indicator: 'No Company / Legal Pages',
      severity: 'low',
      explanation: 'No about, team, privacy policy, or terms of service pages were found. Legitimate investment companies typically provide this information.',
    });
    scoreComponents.push({ label: 'No company pages', points: 8, max: 10 });
  }
  if (contactPages.length === 0) {
    indicators.push({
      indicator: 'No Contact Page',
      severity: 'low',
      explanation: 'No contact or support page was detected. Lack of contact information can be a warning sign.',
    });
    scoreComponents.push({ label: 'No contact page', points: 5, max: 10 });
  }

  // ── 7. Previous Reports in Our Database ───────────────────────────────────
  let previousReportCount = 0;
  try {
    // Search reports that reference this domain in their description / investment data
    previousReportCount = await Report.countDocuments({
      $or: [
        { 'comments': { $regex: domain, $options: 'i' } },
        { 'location': { $regex: domain, $options: 'i' } },
      ],
    });
  } catch {
    // DB query failure is non-fatal
  }

  const previousReports: WebsiteAnalysisResult['previousReports'] = {
    count: previousReportCount,
    details: previousReportCount > 0
      ? `This domain has been referenced in ${previousReportCount} fraud report${previousReportCount > 1 ? 's' : ''} in our database.`
      : 'No previous fraud reports found for this domain.',
  };

  if (previousReportCount > 0) {
    const severity = previousReportCount >= 3 ? 'high' : previousReportCount >= 1 ? 'medium' : 'low';
    indicators.push({
      indicator: 'Previously Reported',
      severity,
      explanation: `This domain appears in ${previousReportCount} existing fraud report${previousReportCount > 1 ? 's' : ''}.`,
    });
    scoreComponents.push({
      label: 'Previous reports',
      points: Math.min(previousReportCount * 8, 20),
      max: 20,
    });
  }

  // ── 8. Composite Risk Score ───────────────────────────────────────────────
  const rawScore = scoreComponents.reduce((sum, c) => sum + c.points, 0);
  const riskScore = Math.min(100, Math.max(0, rawScore));

  let riskLevel: 'low' | 'medium' | 'high';
  if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 25) riskLevel = 'medium';
  else riskLevel = 'low';

  // Build explanation
  const riskExplanation = buildRiskExplanation(riskLevel, riskScore, indicators, scoreComponents);

  return {
    domain,
    url: normalised,
    httpsStatus,
    websiteAge,
    companyInfo,
    contactInfo,
    suspiciousIndicators: indicators,
    previousReports,
    riskScore,
    riskLevel,
    riskExplanation,
    analysisTimestamp: new Date().toISOString(),
  };
};

/* ──────────────────────────────────────────────────────────────────────────────
 *  Explanation Builder
 * ────────────────────────────────────────────────────────────────────────────── */

function buildRiskExplanation(
  level: 'low' | 'medium' | 'high',
  score: number,
  indicators: WebsiteAnalysisResult['suspiciousIndicators'],
  components: { label: string; points: number }[],
): string {
  const highIndicators = indicators.filter((i) => i.severity === 'high');
  const mediumIndicators = indicators.filter((i) => i.severity === 'medium');
  const totalIndicators = indicators.length;

  if (level === 'low') {
    return `This website scored ${score}/100 on our risk assessment. Based on ${totalIndicators === 0 ? 'the absence of' : 'very few'} suspicious indicators, this website appears to have standard security practices. However, always exercise due diligence before making any investment decisions.`;
  }

  if (level === 'medium') {
    const concerns = components
      .filter((c) => c.points > 0)
      .map((c) => c.label)
      .join(', ');
    return `This website scored ${score}/100 on our risk assessment. Several indicators warrant caution: ${concerns}. No single factor is conclusive — this rating reflects a combination of ${totalIndicators} concern${totalIndicators > 1 ? 's' : ''}. We recommend additional research before investing.`;
  }

  // high
  const topConcerns = [...highIndicators, ...mediumIndicators]
    .slice(0, 3)
    .map((i) => i.indicator)
    .join(', ');
  return `This website scored ${score}/100 on our risk assessment — indicating elevated risk. Key concerns: ${topConcerns}. Multiple indicators suggest this website may not meet standard legitimacy criteria. We strongly recommend thorough independent verification before any financial engagement.`;
}
