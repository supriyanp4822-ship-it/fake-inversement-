import { useState } from 'react';
import { investmentService } from '../services/api';
import { Button, Input } from './ui';
import { ReportFormModal } from './ReportFormModal';

interface InvestmentFormProps {
  onSuccess?: () => void;
}

export const InvestmentForm = ({ onSuccess }: InvestmentFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    investorName: '',
    websiteUrl: '',
    type: 'Crypto & Forex',
    amount: 1000,
    expectedReturn: 15,
    duration: '1 Month',
    description: '',
    riskLevel: 'medium',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activePreset, setActivePreset] = useState<'safe' | 'fraud' | null>(null);

  const [analysisResult, setAnalysisResult] = useState<{
    _id?: string;
    score: number;
    status: string;
    name: string;
    investorName?: string;
    websiteUrl?: string;
    amount?: number;
    expectedReturn?: number;
    reasons?: string[];
  } | null>({
    // Pre-populated default result for 16:9 presentation fidelity
    score: 82,
    status: 'high_risk',
    name: 'Crypto Quantum AI Trading Bot',
    investorName: 'Quantum AI Global Ltd',
    websiteUrl: 'http://scam-crypto-quantum-bot.net',
    amount: 5000,
    expectedReturn: 500,
    reasons: [
      'Unusually high expected return (>50%)',
      'Uses guaranteed-return language ("100% risk free")',
      'Contains suspicious promotional language ("double your money", "instant profit")',
      'Website URL is not HTTPS (Insecure connection)',
      'Website hostname looks suspicious',
      'Lack of verified company regulatory registration',
    ],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' || name === 'expectedReturn' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await investmentService.create(formData);
      const newInv = response.data.data;
      setAnalysisResult({
        _id: newInv._id,
        score: newInv.fraudScore,
        status: newInv.status,
        name: newInv.name,
        investorName: newInv.investorName,
        websiteUrl: newInv.websiteUrl,
        amount: newInv.amount,
        expectedReturn: newInv.expectedReturn,
        reasons: newInv.detectionReasons,
      });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze investment');
    } finally {
      setLoading(false);
    }
  };

  const loadSafeExample = () => {
    setActivePreset('safe');
    setFormData({
      name: 'Vanguard S&P 500 ETF',
      investorName: 'Vanguard Group Inc',
      websiteUrl: 'https://investor.vanguard.com',
      type: 'Stocks & ETFs',
      amount: 2500,
      expectedReturn: 8.5,
      duration: '1 Year',
      description: 'Standard regulated index fund tracking the S&P 500, offering steady long-term market average growth.',
      riskLevel: 'low',
    });
  };

  const loadFraudExample = () => {
    setActivePreset('fraud');
    setFormData({
      name: 'Crypto Quantum AI Trading Bot',
      investorName: 'Quantum AI Global Ltd',
      websiteUrl: 'http://scam-crypto-quantum-bot.net',
      type: 'Crypto & Forex',
      amount: 5000,
      expectedReturn: 500,
      duration: '1 Month',
      description: 'Guaranteed 500% monthly returns using proprietary AI quantum algorithms. Instant profit with 100% risk free double your money feature! Act now!',
      riskLevel: 'high',
    });
  };

  // Helper for score gauge color
  const getScoreColor = (score: number) => {
    if (score >= 70) return { text: 'text-rose-600', bg: 'bg-rose-500', border: 'border-rose-200', gradient: 'from-rose-500 to-red-600', ring: '#e11d48' };
    if (score >= 31) return { text: 'text-amber-600', bg: 'bg-amber-500', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-600', ring: '#d97706' };
    return { text: 'text-emerald-600', bg: 'bg-emerald-500', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-600', ring: '#059669' };
  };

  const currentScore = analysisResult ? analysisResult.score : 0;
  const scoreStyle = getScoreColor(currentScore);
  const strokeDashoffset = 283 - (283 * currentScore) / 100;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analyze Investment</h2>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-1">Fill in opportunity parameters for instant AI scam risk scoring</p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={loadSafeExample}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activePreset === 'safe'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>🛡️</span> Safe Example
              </button>
              <button
                type="button"
                onClick={loadFraudExample}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activePreset === 'fraud'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>⚠️</span> Fraud Example
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Investment Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Crypto Quantum AI Trading Bot"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company / Investor Name
                </label>
                <input
                  type="text"
                  name="investorName"
                  value={formData.investorName}
                  onChange={handleChange}
                  placeholder="e.g. Quantum AI Global Ltd"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="http://scam-crypto-quantum-bot.net"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Investment Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value="Crypto & Forex">Crypto & Forex Trading</option>
                  <option value="High-Yield Staking">High-Yield Staking / Bot</option>
                  <option value="Stocks & ETFs">Stocks & Index ETFs</option>
                  <option value="Real Estate">Real Estate Crowdfunding</option>
                  <option value="Peer-to-Peer Lending">Peer-to-Peer Lending</option>
                  <option value="Ponzi / Other">Other / Unregistered Platform</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Amount ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Expected Return (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="expectedReturn"
                    value={formData.expectedReturn}
                    onChange={handleChange}
                    className="w-full pr-8 pl-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 text-sm font-semibold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="Indefinite">Indefinite / Perpetual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Description / Offer Text <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Paste promotional description, claim details, or pitch text..."
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 hover:from-indigo-700 hover:via-blue-700 hover:to-violet-700 text-white font-bold text-sm tracking-wide shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Running AI Risk Analysis...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Analyze Investment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Analysis Result Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Analysis Result</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Live Output
              </span>
            </div>

            {analysisResult ? (
              <div className="space-y-6">
                {/* Score Gauge Circle */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50/60 rounded-2xl border border-slate-150">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={scoreStyle.ring}
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className={`text-3xl font-black ${scoreStyle.text}`}>{analysisResult.score}</span>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">/ 100 Risk</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                        analysisResult.score >= 70
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : analysisResult.score >= 31
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {analysisResult.score >= 70 ? 'HIGH RISK' : analysisResult.score >= 31 ? 'MEDIUM RISK' : 'SAFE'}
                    </span>
                  </div>

                  <p className="text-xs text-center text-slate-500 font-medium mt-2 px-2">
                    {analysisResult.score >= 70
                      ? 'Critical Warning: High probability of scam or Ponzi structure.'
                      : analysisResult.score >= 31
                      ? 'Caution Advised: Moderate fraud risk indicators detected.'
                      : 'Verified: Low risk pattern matching standard legitimate assets.'}
                  </p>
                </div>

                {/* Target Name Details */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{analysisResult.name}</h4>
                  {analysisResult.websiteUrl && (
                    <a
                      href={analysisResult.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline truncate block mt-0.5"
                    >
                      {analysisResult.websiteUrl}
                    </a>
                  )}
                </div>

                {/* Detection Reasons */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Detection Reasons ({analysisResult.reasons?.length || 0})
                  </h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                    {analysisResult.reasons && analysisResult.reasons.length > 0 ? (
                      analysisResult.reasons.map((reason, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex items-start gap-2">
                          <span className="text-rose-500 mt-0.5 font-bold">•</span>
                          <span className="font-medium">{reason}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No specific risk triggers recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-semibold text-slate-600">No Analysis Output Yet</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Submit the form or click "Fraud Example" above to view full risk scores.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {analysisResult && (
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={() => alert(`Full Analysis Report:\nTarget: ${analysisResult.name}\nRisk Score: ${analysisResult.score}/100\nStatus: ${analysisResult.status.toUpperCase()}\nReasons: ${analysisResult.reasons?.join(', ')}`)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Full Report
              </button>

              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm shadow-rose-200 transition-all flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Scam
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report Scam Modal */}
      {showReportModal && analysisResult && (
        <ReportFormModal
          investment={analysisResult}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {
            setShowReportModal(false);
            alert('Scam report submitted successfully! Our verification team will review this entry.');
          }}
        />
      )}
    </>
  );
};
