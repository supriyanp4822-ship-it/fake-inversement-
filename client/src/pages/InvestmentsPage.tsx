import { useState } from 'react';
import { InvestmentForm } from '../components/InvestmentForm';
import { InvestmentsList } from '../components/InvestmentsList';

export const InvestmentsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-40 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold tracking-wide uppercase mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              AI Detection Engine Active
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              Investment Fraud Risk Analysis
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Analyze investment offers, websites, and high-yield opportunities before committing capital. Our multi-vector AI detector flags Ponzi schemes, fake brokers, and unverified platforms.
            </p>
          </div>
        </div>

        {/* 1. Main Two-Column Analysis Section */}
        <InvestmentForm onSuccess={handleRefresh} />

        {/* 2. Risk Level Guide (Three Cards) */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Risk Level Classification Guide</h2>
              <p className="text-xs text-slate-500 mt-0.5">Scoring methodology used by our fraud evaluation algorithms</p>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600">
              Standard 0–100 Scale
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Low Risk Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
              <div className="w-1.5 h-full bg-emerald-500 absolute left-0 top-0"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    🟢
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">Low Risk</h3>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  0 – 30 Score
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Verified financial institutions, SEC/FCA registered brokers, and market index ETFs with realistic, variable return parameters.
              </p>
              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> Realistic returns (4% – 12% APR)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> Transparent regulation & audit trail
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> Valid SSL/HTTPS domain authority
                </div>
              </div>
            </div>

            {/* Medium Risk Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
              <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                    🟡
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">Medium Risk</h3>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  31 – 69 Score
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Unregistered private ventures, high-yield staking pools, or platforms with missing corporate registration details.
              </p>
              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">⚠</span> Above-average return claims (15% – 45%)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">⚠</span> Unverified corporate entity address
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">⚠</span> Domain registered within 12 months
                </div>
              </div>
            </div>

            {/* High Risk Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
              <div className="w-1.5 h-full bg-rose-500 absolute left-0 top-0"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                    🔴
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">High Risk</h3>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  70 – 100 Score
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Classic Ponzi structures, guaranteed return language, high-pressure countdowns, and blacklisted domains.
              </p>
              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-rose-500">✕</span> Unrealistic yield claims (&gt; 50% monthly)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-rose-500">✕</span> "100% Risk Free / Guaranteed Profit" phrasing
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-rose-500">✕</span> Flagged by prior scam database reports
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Recent Investment Checks Table */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Investment Checks</h2>
              <p className="text-xs text-slate-500 mt-0.5">History of analyzed investment submissions and verification statuses</p>
            </div>
          </div>

          <InvestmentsList refresh={refreshKey > 0} />
        </div>
      </div>
    </div>
  );
};
