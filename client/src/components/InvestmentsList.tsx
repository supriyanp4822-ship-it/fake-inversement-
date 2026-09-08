import { useState, useEffect } from 'react';
import { investmentService } from '../services/api';
import { STATUS_COLORS, STATUS_LABELS, formatCurrency, formatDate } from '../constants';
import { ReportFormModal } from './ReportFormModal';

export const InvestmentsList = ({ refresh }: { refresh: boolean }) => {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    loadInvestments();
  }, [refresh]);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const response = await investmentService.getAll();
      setInvestments(response.data.data);
    } catch (err: any) {
      setError('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this investment check?')) {
      try {
        await investmentService.delete(id);
        loadInvestments();
      } catch (err: any) {
        setError('Failed to delete investment');
      }
    }
  };

  // Filter and Sort investments
  const filteredInvestments = investments
    .filter((inv) => {
      const matchesSearch =
        inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.description && inv.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (inv.websiteUrl && inv.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (inv.investorName && inv.investorName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortKey === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortKey === 'fraudScore') {
        comparison = (a.fraudScore || 0) - (b.fraudScore || 0);
      }
      return sortDesc ? -comparison : comparison;
    });

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400">
        <svg className="animate-spin h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-semibold">Loading recent investment checks...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-500 text-sm py-4">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by investment name, investor, website..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="all">All Statuses</option>
            <option value="safe">Safe (0-30)</option>
            <option value="flagged">Suspicious (31-69)</option>
            <option value="high_risk">High Risk (70-100)</option>
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="createdAt">Sort: Date Checked</option>
            <option value="amount">Sort: Amount</option>
            <option value="fraudScore">Sort: Risk Score</option>
          </select>

          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            title={sortDesc ? "Descending" : "Ascending"}
          >
            {sortDesc ? "↓ Newest" : "↑ Oldest"}
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredInvestments.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <svg className="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm font-semibold text-slate-600">No investment checks found</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing filters or analyze a new investment above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Investment Name</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount / Return</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvestments.map((inv) => {
                const score = inv.fraudScore || 0;
                const isHigh = score >= 70;
                const isMed = score >= 31 && score < 70;

                return (
                  <tr key={inv._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900">{inv.name}</span>
                        {inv.investorName && (
                          <span className="text-[11px] text-slate-500 font-normal">{inv.investorName}</span>
                        )}
                        {inv.websiteUrl && (
                          <a
                            href={inv.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-indigo-600 hover:underline truncate max-w-xs mt-0.5 font-normal"
                          >
                            {inv.websiteUrl}
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(inv.createdAt)}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      <div>{formatCurrency(inv.amount)}</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {inv.expectedReturn ? `Return: ${inv.expectedReturn}%` : 'Standard Return'}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-black text-xs ${
                          isHigh
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : isMed
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        }`}
                      >
                        {score}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          STATUS_COLORS[inv.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {STATUS_LABELS[inv.status] || inv.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {score >= 31 && (
                          <button
                            type="button"
                            onClick={() => setSelectedInvestment(inv)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition flex items-center gap-1"
                          >
                            🚨 Report
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(inv._id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-semibold text-[11px] transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report Form Modal */}
      {selectedInvestment && (
        <ReportFormModal
          investment={selectedInvestment}
          onClose={() => setSelectedInvestment(null)}
          onSuccess={() => {
            setSelectedInvestment(null);
            alert('Scam report successfully submitted and logged in database.');
          }}
        />
      )}
    </div>
  );
};
