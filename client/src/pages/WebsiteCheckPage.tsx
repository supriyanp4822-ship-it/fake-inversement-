import React, { useState } from 'react';
import { websiteCheckService } from '../services/api';
import { Card, Button } from '../components/ui';

interface Indicator {
  indicator: string;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

interface WebsiteAnalysisResult {
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
  suspiciousIndicators: Indicator[];
  previousReports: {
    count: number;
    details: string;
  };
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskExplanation: string;
}

export const WebsiteCheckPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<WebsiteAnalysisResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await websiteCheckService.check(url);
      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <span>🌐</span> Real-Time URL Inspector
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Website Security & Fraud Analysis
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Inspect investment URLs for SSL certificates, RDAP domain registration age, legal entity credentials, and community scam reports.
          </p>

          {/* Form Input */}
          <form onSubmit={handleCheck} className="mt-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-800/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-700/60 shadow-2xl">
              <input
                type="url"
                required
                placeholder="https://example-investment.com"
                className="w-full px-4 py-3 bg-slate-950/80 text-white rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm sm:text-base font-medium placeholder-slate-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button
                type="submit"
                variant="cyan"
                loading={loading}
                className="w-full sm:w-auto shrink-0 py-3 px-6 text-base"
              >
                Scan Website
              </Button>
            </div>
          </form>
          {error && <p className="text-rose-400 font-semibold text-sm mt-3">{error}</p>}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Verdict Card */}
            <Card className={`border-l-8 ${
              result.riskLevel === 'low' ? 'border-l-emerald-500 bg-slate-800/90' :
              result.riskLevel === 'medium' ? 'border-l-amber-500 bg-slate-800/90' :
              'border-l-rose-500 bg-rose-950/20'
            }`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Circular Risk Score Display */}
                <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center bg-slate-950 rounded-full border-4 border-slate-800 shadow-inner">
                  <div className="text-center">
                    <span className={`text-4xl font-black ${
                      result.riskLevel === 'low' ? 'text-emerald-400' :
                      result.riskLevel === 'medium' ? 'text-amber-400' : 'text-rose-500'
                    }`}>
                      {result.riskScore}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">/ 100 Risk</span>
                  </div>
                </div>

                <div className="space-y-2 text-center md:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      {result.riskLevel} Risk Verdict
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      result.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      result.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      Verified
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.riskExplanation}</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Domain Information */}
              <Card>
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700/60 flex items-center gap-2">
                  <span>🌐</span> Domain Infrastructure
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block">Target URL</span>
                    <span className="font-semibold text-cyan-400 break-all">{result.url}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700/40">
                    <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block">Domain Name</span>
                    <span className="font-bold text-white">{result.domain}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700/40 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block">Domain Age</span>
                      <span className="font-semibold text-slate-200">{result.websiteAge.ageText}</span>
                    </div>
                    {result.websiteAge.ageInDays !== null && result.websiteAge.ageInDays < 180 && (
                      <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded font-bold border border-amber-500/30">Newly Registered</span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Security & Credentials */}
              <Card>
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700/60 flex items-center gap-2">
                  <span>🔒</span> SSL & Discovery Indicators
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{result.httpsStatus.isSecure ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-bold text-white">HTTPS Certificate</p>
                      <p className="text-xs text-slate-400">{result.httpsStatus.details}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700/40 flex items-start gap-3">
                    <span className="text-lg">{result.companyInfo.detected ? '✅' : '⚠️'}</span>
                    <div>
                      <p className="font-bold text-white">Company Registration / Legal Pages</p>
                      <p className="text-xs text-slate-400">{result.companyInfo.details[0]}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700/40 flex items-start gap-3">
                    <span className="text-lg">{result.contactInfo.detected ? '✅' : '⚠️'}</span>
                    <div>
                      <p className="font-bold text-white">Contact & Support Details</p>
                      <p className="text-xs text-slate-400">{result.contactInfo.details[0]}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Red Flags List */}
            <Card>
              <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700/60 flex items-center gap-2">
                <span>⚠️</span> Flagged Suspicious Indicators ({result.suspiciousIndicators.length})
              </h3>
              {result.suspiciousIndicators.length === 0 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl text-sm font-semibold">
                  No automated technical red flags were flagged during website scanning.
                </div>
              ) : (
                <div className="space-y-3">
                  {result.suspiciousIndicators.map((ind, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          ind.severity === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {ind.severity}
                        </span>
                        <h4 className="font-bold text-white text-sm">{ind.indicator}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{ind.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
