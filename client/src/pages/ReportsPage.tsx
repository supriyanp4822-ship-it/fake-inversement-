import { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { Card, RiskBadge } from '../components/ui';
import { formatDate } from '../utils';
import { Link } from 'react-router-dom';

export const ReportsPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortKey, setSortKey] = useState('generatedAt');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getAll();
      setReports(response.data.data);
    } catch (err: any) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const getRiskStatus = (score: number) => {
    if (score >= 60) return 'high_risk';
    if (score >= 30) return 'suspicious';
    return 'safe';
  };

  const filteredReports = reports
    .filter((report) => {
      const investmentName = report.investmentId?.name || '';
      const summary = report.summary || '';
      const location = report.reporterLocation || '';
      const comments = report.additionalComments || '';
      
      const matchesSearch =
        investmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.fraudIndicators && report.fraudIndicators.some((ind: string) => ind.toLowerCase().includes(searchTerm.toLowerCase())));

      const riskStatus = getRiskStatus(report.riskScore);
      const matchesRisk = filterRisk === 'all' || riskStatus === filterRisk;

      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'generatedAt') {
        comparison = new Date(a.generatedAt || a.createdAt).getTime() - new Date(b.generatedAt || b.createdAt).getTime();
      } else if (sortKey === 'riskScore') {
        comparison = (a.riskScore || 0) - (b.riskScore || 0);
      } else if (sortKey === 'investmentName') {
        const nameA = a.investmentId?.name || '';
        const nameB = b.investmentId?.name || '';
        comparison = nameA.localeCompare(nameB);
      }

      return sortDesc ? -comparison : comparison;
    });

  if (loading) return <p className="text-slate-400 py-20 text-center font-semibold">Loading Investigation Dossiers...</p>;
  if (error) return <p className="text-rose-400 py-20 text-center font-semibold">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
          <span>📄</span> Fraud Investigation Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review, filter, and export generated algorithmic risk reports and evidence packages.
        </p>
      </div>

      {/* Search and Filters bar */}
      <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by investment name, indicators, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
          <div className="absolute left-3 top-3 text-slate-400">
            🔍
          </div>
        </div>

        <div className="w-full md:w-48">
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <option value="all">All Risk Levels</option>
            <option value="safe">Safe (0-29)</option>
            <option value="suspicious">Suspicious (30-59)</option>
            <option value="high_risk">High Risk (60-100)</option>
          </select>
        </div>

        <div className="w-full md:w-60 flex gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <option value="generatedAt">Date Generated</option>
            <option value="riskScore">Risk Score</option>
            <option value="investmentName">Investment Name</option>
          </select>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white font-bold transition-colors"
            title={sortDesc ? "Descending" : "Ascending"}
          >
            {sortDesc ? "↓" : "↑"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card className="text-center py-12 text-slate-400">
            <p>No investment reports match your current filter parameters.</p>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report._id} className="hover:border-slate-600 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/60 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
                      {report.reportId || 'FID-REPORT'}
                    </span>
                    <h3 className="font-bold text-lg text-white">{report.investmentId?.name || 'Target Entity'}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Generated: {formatDate(report.generatedAt || report.createdAt)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <RiskBadge score={report.riskScore} />
                  <Link
                    to={`/report-preview/${report._id || report.reportId}`}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>📄</span> Download PDF
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-slate-300 text-sm italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  "{report.summary}"
                </p>

                {report.fraudIndicators && report.fraudIndicators.length > 0 && (
                  <div>
                    <h4 className="font-extrabold text-xs text-rose-400 uppercase tracking-wider mb-1">Identified Red Flags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.fraudIndicators.map((indicator: string, idx: number) => (
                        <span key={idx} className="bg-rose-500/10 text-rose-300 text-xs px-2.5 py-1 rounded-md border border-rose-500/20">
                          ⚠️ {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(report.reporterLocation || report.additionalComments) && (
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex flex-col sm:flex-row gap-4">
                    {report.reporterLocation && (
                      <p><strong className="text-slate-400">Location:</strong> {report.reporterLocation}</p>
                    )}
                    {report.additionalComments && (
                      <p><strong className="text-slate-400">Comments:</strong> {report.additionalComments}</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
