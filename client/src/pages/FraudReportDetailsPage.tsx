import { useEffect, useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { reportService } from '../services/api';
import { formatDate } from '../utils';

export const FraudReportDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) { setError('No report ID provided.'); setLoading(false); return; }

    const load = async () => {
      try {
        setLoading(true);
        const res = await reportService.getById(id);
        setReport(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load report details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <p className="text-slate-400 py-20 text-center font-semibold">Loading Investigation Dossier...</p>;
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center space-y-4">
        <p className="text-rose-400 font-bold text-lg">{error}</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>← Go Back</Button>
      </div>
    );
  }
  if (!report) return null;

  const investment = report.investmentId || {};
  const riskScore = report.riskScore ?? 0;
  const riskLabel = riskScore >= 60 ? 'HIGH RISK' : riskScore >= 30 ? 'SUSPICIOUS' : 'LOW RISK';
  const riskClass = riskScore >= 60
    ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
    : riskScore >= 30
    ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-cyan-400 text-xs font-semibold mb-3 flex items-center gap-1 transition-colors"
          >
            ← Back to Reports
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Fraud Dossier</h1>
            <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${riskClass}`}>
              {riskLabel}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            Report ID: <span className="text-cyan-400 font-bold">{report.reportId || report._id}</span> · Generated: {formatDate(report.generatedAt || report.createdAt)}
          </p>
        </div>

        {/* Risk Score Circle */}
        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg shrink-0">
          <span className={`text-3xl font-black font-mono ${riskScore >= 60 ? 'text-rose-400' : riskScore >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {riskScore}
          </span>
          <span className="text-slate-500 text-[10px] font-extrabold uppercase">/100 Risk</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Investment Info */}
          <Card>
            <h2 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-700/60">Investment Details</h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-extrabold tracking-wider block">Entity Name</span>
                <span className="text-white font-bold">{investment.name || 'Unknown'}</span>
              </div>
              {investment.websiteUrl && (
                <div>
                  <span className="text-slate-400 uppercase font-extrabold tracking-wider block">Website URL</span>
                  <a href={investment.websiteUrl} target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline font-medium break-all">
                    {investment.websiteUrl} ↗
                  </a>
                </div>
              )}
              {investment.investorName && (
                <div>
                  <span className="text-slate-400 uppercase font-extrabold tracking-wider block">Claimed Manager</span>
                  <span className="text-slate-200 font-semibold">{investment.investorName}</span>
                </div>
              )}
              {investment.type && (
                <div>
                  <span className="text-slate-400 uppercase font-extrabold tracking-wider block">Investment Type</span>
                  <span className="text-slate-200 font-semibold">{investment.type}</span>
                </div>
              )}
              <div className="flex gap-4">
                {investment.amount != null && (
                  <div>
                    <span className="text-slate-400 uppercase font-extrabold tracking-wider block">Amount</span>
                    <span className="text-white font-bold">₹{Number(investment.amount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {investment.expectedReturn != null && (
                  <div>
                    <span className="text-slate-400 uppercase font-extrabold tracking-wider block">Promised Return</span>
                    <span className={`font-bold ${investment.expectedReturn > 30 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {investment.expectedReturn}% {investment.expectedReturn > 30 ? '⚠️' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Location */}
          {report.reporterLocation && (
            <Card>
              <h2 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-700/60">Reporter Location</h2>
              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 flex gap-3 items-start">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-white font-semibold text-xs">{report.reporterLocation}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Geolocation recorded at submission time</p>
                </div>
              </div>
            </Card>
          )}

          {/* Status Timeline */}
          <Card>
            <h2 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-700/60">Report Status</h2>
            <div className="space-y-2">
              {(['Pending', 'Under Review', 'Verified'] as const).map((step, i) => {
                const history = report.statusHistory || [];
                const reached = report.status === 'Rejected'
                  ? i === 0
                  : history.some((h: any) => h.status === step) || report.status === step;
                const isCurrent = report.status === step;
                return (
                  <div key={step} className="flex items-center gap-3 text-xs">
                    <div className={`w-3 h-3 rounded-full shrink-0 border-2 ${isCurrent ? 'border-cyan-400 bg-cyan-400' : reached ? 'border-emerald-500 bg-emerald-500' : 'border-slate-700 bg-transparent'}`} />
                    <span className={`font-semibold ${isCurrent ? 'text-cyan-400' : reached ? 'text-slate-300' : 'text-slate-600'}`}>{step}</span>
                  </div>
                );
              })}
              {report.status === 'Rejected' && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full shrink-0 border-2 border-rose-500 bg-rose-500" />
                  <span className="font-semibold text-rose-400">Rejected</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Columns */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Summary */}
          {report.summary && (
            <Card>
              <h2 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-700/60">AI Analysis Summary</h2>
              <p className="text-slate-300 text-sm italic bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                "{report.summary}"
              </p>
            </Card>
          )}

          {/* Fraud Indicators */}
          {report.fraudIndicators?.length > 0 && (
            <Card>
              <h2 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-700/60">
                ⚠️ Fraud Indicators Detected ({report.fraudIndicators.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.fraudIndicators.map((indicator: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                    <span className="text-rose-400 mt-0.5 text-sm shrink-0">🚫</span>
                    <p className="text-rose-200 text-xs font-semibold leading-snug">{indicator}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {report.recommendations?.length > 0 && (
            <Card>
              <h2 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-700/60">
                ✅ Recommendations
              </h2>
              <ul className="space-y-2">
                {report.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 font-black shrink-0 mt-0.5">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* User Notes */}
          {report.additionalComments && (
            <Card>
              <h2 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-700/60">Reporter Notes</h2>
              <p className="text-slate-300 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {report.additionalComments}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <p className="text-slate-400 text-xs font-medium">
          ⚠️ This is an algorithmic risk assessment, not an official government determination.
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <Link to={`/track/${report.reportId || report._id}`}>
            <Button variant="secondary" className="text-xs py-2 px-4">🔍 Track Status</Button>
          </Link>
          <Link to={`/report-preview/${report._id}`}>
            <Button variant="ghost" className="text-xs py-2 px-4 border border-slate-700">📄 Download PDF</Button>
          </Link>
          <Link to={`/report-government/${report._id}`}>
            <Button variant="danger" className="text-xs py-2 px-4">🏛️ Report to Authorities</Button>
          </Link>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-rose-950/30 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs text-center font-semibold">
        🚨 If you have already lost money — call <strong className="text-white font-mono tracking-wider">1930</strong> immediately for emergency payment freeze assistance.
      </div>
    </div>
  );
};

export default FraudReportDetailsPage;
