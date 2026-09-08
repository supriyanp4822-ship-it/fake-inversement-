import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';

// ─── Static Data ───────────────────────────────────────────────────────────────

const STATS = [
  { value: '₹8,200 Cr+', label: 'Fraud Prevented (Est.)', color: 'text-cyan-400' },
  { value: '15,000+', label: 'Scam Patterns Cataloged', color: 'text-blue-400' },
  { value: '99.4%', label: 'Detection Accuracy', color: 'text-indigo-400' },
  { value: '3 sec', label: 'Real-Time Analysis', color: 'text-emerald-400' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter Investment Details',
    desc: 'Provide the investment name, promised returns, company details, or paste the website URL.',
    icon: '📋',
    color: 'from-cyan-600 to-blue-700',
  },
  {
    step: '02',
    title: 'AI-Powered Risk Scoring',
    desc: 'Our system cross-references 40+ fraud indicators including return rates, registration status, WHOIS age, and SSL certificate validity.',
    icon: '⚡',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    step: '03',
    title: 'Get Your Risk Report',
    desc: 'Receive a detailed risk dossier with fraud indicators, recommendations, and a downloadable PDF investigation report.',
    icon: '📄',
    color: 'from-indigo-600 to-violet-700',
  },
  {
    step: '04',
    title: 'Report to Authorities',
    desc: 'One-click guidance to file with I4C (cybercrime.gov.in) or SEBI SCORES — with emergency 1930 helpline integration.',
    icon: '🏛️',
    color: 'from-violet-600 to-purple-700',
  },
];

const FEATURES = [
  {
    icon: '🔍',
    title: 'Heuristic Fraud Analysis',
    desc: 'Analyses guaranteed returns, pressure tactics, unregistered entities, and Ponzi structure patterns against 40+ risk indicators.',
    color: 'border-cyan-500/30 hover:border-cyan-400/60',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  },
  {
    icon: '🌐',
    title: 'Website Security Inspector',
    desc: 'Real-time RDAP WHOIS lookup, SSL certificate validation, domain age analysis, and company credential detection.',
    color: 'border-blue-500/30 hover:border-blue-400/60',
    iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  },
  {
    icon: '📄',
    title: 'PDF Investigation Reports',
    desc: 'Generate formatted downloadable dossiers with evidence, geolocation, risk score, fraud indicators, and legal disclaimer.',
    color: 'border-indigo-500/30 hover:border-indigo-400/60',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  },
  {
    icon: '📍',
    title: 'Location Intelligence',
    desc: 'Geotag fraud reports with browser location data for geographic clustering and inter-agency coordination.',
    color: 'border-violet-500/30 hover:border-violet-400/60',
    iconBg: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  },
  {
    icon: '🔐',
    title: 'Secure Authentication',
    desc: 'JWT-protected accounts with bcrypt password hashing, rate limiting, and MongoDB NoSQL injection protection.',
    color: 'border-emerald-500/30 hover:border-emerald-400/60',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    icon: '🏛️',
    title: 'Government Portal Guidance',
    desc: 'Direct links to National Cyber Crime (I4C) and SEBI SCORES with preserved dossier for manual submission.',
    color: 'border-rose-500/30 hover:border-rose-400/60',
    iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  },
];

const RECENT_ALERTS = [
  {
    name: 'CryptoMax Wealth Fund',
    risk: 'High Risk',
    score: 94,
    tags: ['Guaranteed Returns', 'Unregistered', 'Offshore Domain'],
    time: '2 hours ago',
    riskClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  {
    name: 'SureProfit Forex Advisors',
    risk: 'High Risk',
    score: 88,
    tags: ['Unlicensed Broker', 'Pressure Tactics', 'Fake Reviews'],
    time: '5 hours ago',
    riskClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  {
    name: 'GreenField Real Estate MLM',
    risk: 'Suspicious',
    score: 67,
    tags: ['Multi-Level', 'Unverified Address', 'New Domain'],
    time: '1 day ago',
    riskClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    name: 'Alpha Trade International',
    risk: 'High Risk',
    score: 91,
    tags: ['Ponzi Structure', 'No SEBI Registration', 'Clone Website'],
    time: '2 days ago',
    riskClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
];

const FAQS = [
  {
    q: 'Is this an official government tool?',
    a: 'No. This is an independent civilian platform for educational risk assessment. We provide heuristic analysis and guidance for reporting to official authorities — we do not replace official agencies.',
  },
  {
    q: 'How is the Fraud Risk Score calculated?',
    a: 'The score (0–100) is computed across 40+ parameters: promised return rate vs. RBI norms, SEBI registration check, domain registration age, SSL certificate status, presence of legal pages, previous community reports, and more.',
  },
  {
    q: 'Does this tool directly file complaints with the government?',
    a: 'No. We preserve your report and provide direct guidance to file with I4C (cybercrime.gov.in) or SEBI SCORES. No authorized government API integration exists at this time.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Yes. Reports are stored with JWT-authenticated access, IDOR ownership protection, bcrypt-hashed passwords, and MongoDB sanitization. We never expose your credentials.',
  },
  {
    q: 'What should I do if I have already lost money?',
    a: 'Immediately call the national helpline 1930 to request emergency payment freeze. Then report via cybercrime.gov.in and SEBI SCORES. Keep all communication records as evidence.',
  },
  {
    q: 'Can I report a website instead of an investment company?',
    a: 'Yes. Use the Website Security Check tool to inspect any URL — it analyzes HTTPS status, domain age, WHOIS data, and community fraud database hits.',
  },
];

const SCAM_TYPES = [
  { icon: '₿', label: 'Crypto Ponzi Schemes', desc: 'Fake USDT/Bitcoin investment pools with guaranteed daily payouts.' },
  { icon: '📈', label: 'Fake Stock Tips', desc: 'Paid Telegram channels offering 100%+ monthly returns on penny stocks.' },
  { icon: '🏘️', label: 'Real Estate MLMs', desc: 'Multi-level schemes requiring recruits to sell pre-launch land/plots.' },
  { icon: '🤖', label: 'AI Trading Bots', desc: 'Fabricated automated algorithms claiming consistent arbitrage profit.' },
  { icon: '💳', label: 'Chit Fund Fraud', desc: 'Unregistered chit funds collecting money without state RoC approval.' },
  { icon: '🌐', label: 'Clone Investment Sites', desc: 'Fake replicas of SEBI-registered fund managers soliciting money.' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().startsWith('http')) {
      navigate('/website-check');
    } else {
      navigate('/investments');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      {/* ════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-3xl rounded-full" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 blur-3xl rounded-full" />
          <div className="absolute top-10 right-1/4 w-[400px] h-[300px] bg-indigo-500/8 blur-3xl rounded-full" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            Financial Cybersecurity Intelligence Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5">
            Detect Suspicious Investments{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Before You Invest
              </span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 400 12" fill="none">
                <path d="M2 9 Q100 2 200 9 Q300 16 398 9" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="400" y2="0">
                    <stop offset="0%" stopColor="#22d3ee"/>
                    <stop offset="100%" stopColor="#818cf8"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Analyze investment opportunities, identify potential risk indicators, and report suspicious schemes to official Indian government authorities.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-2xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Investment name, company, or website URL..."
                className="flex-1 px-4 py-3.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-medium"
              />
              <div className="flex gap-2 shrink-0">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold px-5 py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-cyan-500/20 whitespace-nowrap"
                >
                  ⚡ Analyze Investment
                </button>
                <Link to="/reports" className="flex-1 sm:flex-none">
                  <button
                    type="button"
                    className="w-full bg-rose-600/80 hover:bg-rose-600 text-white font-extrabold px-5 py-3.5 rounded-xl transition-all text-sm whitespace-nowrap"
                  >
                    🚨 Report Scam
                  </button>
                </Link>
              </div>
            </div>
          </form>

          {/* Quick links */}
          <p className="text-xs text-slate-500 font-medium">
            Or go directly to →{' '}
            <Link to="/website-check" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">Website Inspector</Link>{' · '}
            <Link to="/track" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">Track Report ID</Link>{' · '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">Create Free Account</Link>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          STATISTICS ROW
          ════════════════════════════════════════════ */}
      <section className="bg-slate-950/60 border-y border-slate-800/60 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className={`text-3xl sm:text-4xl font-black font-mono ${s.color}`}>{s.value}</p>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-cyan-400 text-xs font-extrabold uppercase tracking-widest block mb-2">⚙️ Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">How It Works</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">Four simple steps from suspicion to safe action</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector arrow on large screens */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-6 z-10 text-slate-700 text-lg font-bold text-center">→</div>
                )}
                <Card className="h-full space-y-4 hover:border-slate-600 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Step {step.step}</span>
                    <h3 className="text-base font-bold text-white mt-1">{step.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mt-2">{step.desc}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          RISK ANALYSIS + FEATURES GRID
          ════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-400 text-xs font-extrabold uppercase tracking-widest block mb-2">🛡️ Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Comprehensive Risk Analysis Tools</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">Everything you need to evaluate investment safety before committing capital</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Card key={i} className={`space-y-3 transition-all duration-200 ${f.color}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-base">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SCAM REPORTING PANEL
          ════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border border-blue-500/20 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left content */}
              <div className="p-8 sm:p-12 space-y-6">
                <span className="text-indigo-400 text-xs font-extrabold uppercase tracking-widest block">🚨 Scam Reporting</span>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                  Help Protect the Community.<br/>
                  <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Report What You Know.</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your report could prevent hundreds of people from losing their savings. Every submission contributes to our national fraud intelligence database and helps law enforcement track criminal patterns.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link to="/investments">
                    <Button variant="cyan" className="text-sm">File a Fraud Report</Button>
                  </Link>
                  <Link to="/track">
                    <Button variant="secondary" className="text-sm">Track Existing Report</Button>
                  </Link>
                </div>
              </div>

              {/* Right: Reporting authorities */}
              <div className="bg-slate-900/60 p-8 sm:p-12 space-y-4 flex flex-col justify-center">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Official Portals We Guide You To:</p>
                <div className="space-y-3">
                  <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-blue-950/60 border border-blue-500/30 rounded-xl hover:border-blue-400/60 transition-colors">
                    <span className="text-2xl">🇮🇳</span>
                    <div>
                      <p className="font-bold text-white text-sm">I4C — National Cyber Crime Portal</p>
                      <p className="text-xs text-slate-400">cybercrime.gov.in | Ministry of Home Affairs</p>
                    </div>
                    <span className="ml-auto text-slate-400">↗</span>
                  </a>
                  <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-blue-950/60 border border-blue-500/30 rounded-xl hover:border-blue-400/60 transition-colors">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-bold text-white text-sm">SEBI SCORES</p>
                      <p className="text-xs text-slate-400">scores.sebi.gov.in | Securities Regulator</p>
                    </div>
                    <span className="ml-auto text-slate-400">↗</span>
                  </a>
                  <div className="flex items-center gap-3 p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-bold text-rose-300 text-sm">Emergency Helpline: <span className="font-mono text-white tracking-wider">1930</span></p>
                      <p className="text-xs text-slate-400">Immediate bank payment freeze assistance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FRAUD ALERTS — RECENT
          ════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <span className="text-rose-400 text-xs font-extrabold uppercase tracking-widest block mb-1">⚠️ Live Intelligence</span>
              <h2 className="text-3xl font-black text-white tracking-tight">Recent Fraud Alerts</h2>
              <p className="text-slate-400 text-sm mt-1">Latest high-risk entities flagged by our analysis engine</p>
            </div>
            <Link to="/reports">
              <Button variant="ghost" className="text-xs border border-slate-700 shrink-0">View All Reports →</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RECENT_ALERTS.map((alert, i) => (
              <Card key={i} className="space-y-3 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{alert.name}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">{alert.time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${alert.riskClass}`}>
                      {alert.risk}
                    </span>
                    <p className="text-white font-mono font-black text-base mt-1">{alert.score}<span className="text-slate-500 text-xs">/100</span></p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {alert.tags.map((tag, j) => (
                    <span key={j} className="bg-slate-700/60 text-slate-300 text-[10px] px-2 py-0.5 rounded font-semibold border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AWARENESS — SCAM TYPES
          ════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest block mb-2">📚 Investor Awareness</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Know The Most Common Scam Types</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">Awareness is the first line of defense — recognize these patterns before you fall victim</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCAM_TYPES.map((scam, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl hover:border-amber-500/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg font-black text-amber-400 shrink-0">
                  {scam.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{scam.label}</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{scam.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA BANNER
          ════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-900/50 via-blue-900/50 to-indigo-900/50 border border-cyan-500/20 rounded-3xl p-10 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Start Your Free Investment Safety Check
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
                No hidden fees. No registration required for basic checks. Protect your wealth in under 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Link to="/register">
                  <Button variant="cyan" className="text-base py-3.5 px-8">
                    Create Free Account →
                  </Button>
                </Link>
                <Link to="/website-check">
                  <Button variant="secondary" className="text-base py-3.5 px-8">
                    Check a Website URL
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FAQ
          ════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-slate-400 text-xs font-extrabold uppercase tracking-widest block mb-2">❓ FAQ</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-colors cursor-pointer ${
                  openFaq === i ? 'border-cyan-500/40 bg-slate-800/80' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                }`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between p-5 gap-4">
                  <h3 className="font-bold text-white text-sm leading-snug">{faq.q}</h3>
                  <span className={`text-slate-400 text-lg shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-cyan-400' : ''}`}>
                    ↓
                  </span>
                </div>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-slate-700/40 pt-4">
                    <p className="text-slate-300 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════ */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span className="font-black text-white text-base">FakeInvestDetect</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                An independent financial cybersecurity platform helping Indian investors identify and report potential investment fraud.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/investments" className="hover:text-cyan-400 transition-colors">Analyze Investment</Link></li>
                <li><Link to="/website-check" className="hover:text-cyan-400 transition-colors">Website Security Check</Link></li>
                <li><Link to="/track" className="hover:text-cyan-400 transition-colors">Track Report</Link></li>
                <li><Link to="/reports" className="hover:text-cyan-400 transition-colors">My Reports</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-3">Resources</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">I4C — Cyber Crime Portal ↗</a></li>
                <li><a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">SEBI SCORES ↗</a></li>
                <li><a href="https://www.rbi.org.in/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">RBI — Reserve Bank of India ↗</a></li>
                <li><Link to="/notifications" className="hover:text-cyan-400 transition-colors">Fraud Alerts</Link></li>
              </ul>
            </div>

            {/* Emergency */}
            <div>
              <h4 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-3">Emergency Contacts</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="bg-rose-950/40 border border-rose-500/30 p-3 rounded-xl">
                  <p className="font-black text-rose-300 text-base font-mono">1930</p>
                  <p className="text-rose-400/80 text-[11px]">Financial Fraud Helpline (24×7)</p>
                </div>
                <p className="text-[11px] leading-relaxed">
                  For immediate payment freeze requests after financial cyber fraud.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom disclaimer */}
          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-slate-500 text-[11px] max-w-2xl leading-relaxed">
              <strong>Disclaimer:</strong> This platform provides algorithmic risk assessment for informational and educational purposes only. Results do not constitute official government determinations. We are not affiliated with any government agency.
            </p>
            <p className="text-slate-600 text-[11px] shrink-0">© 2026 FakeInvestDetect</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
