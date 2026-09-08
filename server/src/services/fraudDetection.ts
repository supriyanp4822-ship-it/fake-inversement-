export interface FraudResult {
  score: number;
  reasons: string[];
}

/**
 * Helper to check if a text contains any of the supplied phrases (case‑insensitive).
 */
const containsPhrase = (text: string, phrases: string[]) =>
  phrases.some((p) => new RegExp(`\\b${p}\\b`, 'i').test(text));

/**
 * Analyse an investment and produce a fraud score (0‑100) together with detection reasons.
 * The scoring follows the specification:
 *   - Expected return ranges contribute up to 25 points.
 *   - Guaranteed‑return phrases add 25 points.
 *   - Suspicious promotional language adds up to 20 points.
 *   - URL risk adds up to 15 points.
 *   - Missing description, investor name, or supporting documents add points.
 *   - Large investment amounts add modest points.
 * Scores are capped at 100.
 */
export const analyzeInvestment = (investment: any): FraudResult => {
  let score = 0;
  const reasons: string[] = [];

  // 1️⃣ Expected Return
  const exp = Number(investment.expectedReturn) || 0;
  if (exp > 50) {
    score += 25;
    reasons.push('Unusually high expected return (>50%)');
  } else if (exp > 25) {
    score += 20;
    reasons.push('High expected return (25‑50%)');
  } else if (exp > 10) {
    score += 10;
    reasons.push('Moderate expected return (10‑25%)');
  }

  // 2️⃣ Guaranteed Returns language
  const guaranteedPhrases = [
    'guaranteed profit',
    'guaranteed returns',
    '100% guaranteed',
    'risk free',
    'guaranteed income',
    'no risk',
    'guaranteed',
  ];
  if (containsPhrase(investment.description || '', guaranteedPhrases)) {
    score += 25;
    reasons.push('Uses guaranteed‑return language');
  }

  // 3️⃣ Suspicious promotional phrases
  const suspiciousPhrases = [
    'get rich quick',
    'double your money',
    'instant profit',
    'limited time',
    'act now',
    'secret strategy',
    'exclusive opportunity',
    'high returns',
    'fast cash',
    'no risk',
  ];
  if (containsPhrase(investment.description || '', suspiciousPhrases)) {
    score += 20;
    reasons.push('Contains suspicious promotional language');
  }

  // 4️⃣ Website / URL risk
  if (investment.websiteUrl) {
    const url = investment.websiteUrl.trim().toLowerCase();
    try {
      const parsed = new URL(url);
      // missing HTTPS
      if (parsed.protocol !== 'https:') {
        score += 5;
        reasons.push('Website URL is not HTTPS');
      }
      // excessive hyphens or suspicious keywords in hostname
      const host = parsed.hostname;
      if (/\-\-/.test(host) || /\d{4,}/.test(host) || /crypto|quantum|bot|scam|investment/.test(host)) {
        score += 10;
        reasons.push('Website hostname looks suspicious');
      }
    } catch {
      // malformed URL
      score += 10;
      reasons.push('Website URL is malformed');
    }
  } else {
    // No website is not necessarily a risk, but we note it
    reasons.push('No website URL provided');
  }

  // 5️⃣ Description length / detail
  const desc = (investment.description || '').trim();
  if (!desc || desc.length < 30) {
    score += 15;
    reasons.push('Insufficient investment description');
  }

  // 6️⃣ Investor information missing
  if (!investment.investorName) {
    score += 10;
    reasons.push('Missing investor name');
  }

  // 7️⃣ Supporting documents missing
  if (!investment.documents || investment.documents.length === 0) {
    score += 10;
    reasons.push('No supporting documentation provided');
  }

  // 8️⃣ Large investment amount (as a modest indicator)
  if (Number(investment.amount) > 1000000) {
    score += 5;
    reasons.push('Very large investment amount');
  }

  // Clamp score to 0‑100
  score = Math.min(100, Math.max(0, score));

  return { score, reasons };
};

/**
 * Convert a numeric fraud score into a status string used in the DB.
 */
export const getStatus = (fraudScore: number): 'safe' | 'flagged' | 'high_risk' => {
  if (fraudScore >= 60) return 'high_risk';
  if (fraudScore >= 30) return 'flagged';
  return 'safe';
};
