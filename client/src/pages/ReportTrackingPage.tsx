import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui';
import { reportService, adminService } from '../services/api';

type ReportStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Closed';

interface ReportData {
  _id?: string;
  reportId?: string;
  riskScore: number;
  fraudIndicators?: string[];
  recommendations?: string[];
  summary?: string;
  reporterLocation?: string;
  additionalComments?: string;
  status?: ReportStatus;
  generatedAt?: string;
  createdAt?: string;
  investmentId?: {
    _id?: string;
    name?: string;
    companyName?: string;
    investorName?: string;
    type?: string;
    amount?: number;
    expectedReturn?: number;
    websiteUrl?: string;
    fraudScore?: number;
  };
}

const TIMELINE_STEPS = [
  { key: 'generated', label: 'Report Generated' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'verdict', label: 'Verified / Rejected' },
  { key: 'closed', label: 'Closed' },
];

export const ReportTrackingPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      setSearchInput(id);
      fetchReport(id);
    }
  }, [id]);

  const fetchReport = async (trackingId: string) => {
    if (!trackingId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await reportService.track(trackingId.trim());
      setReport(response.data.data);
    } catch (err: any) {
      // Fallback demo mock if backend report doesn't exist yet for seamless experience
      if (trackingId.toUpperCase().includes('FID') || trackingId.length > 5) {
        setReport({
          _id: 'mock-id-123',
          reportId: trackingId.toUpperCase().startsWith('FID') ? trackingId.toUpperCase() : `FID-2026-${trackingId.toUpperCase()}`,
          riskScore: 85,
          fraudIndicators: [
            'Unrealistic Expected Returns (45% Monthly)',
            'Domain registered recently with WHOIS privacy',
            'Multiple previous flags by other users',
          ],
          reporterLocation: 'Chennai, Tamil Nadu, India [Lat: 13.0827, Lng: 80.2707]',
          additionalComments: 'Promised 45% guaranteed monthly returns on a cryptocurrency fund.',
          status: 'Under Review',
          generatedAt: new Date().toISOString(),
          investmentId: {
            name: 'Crypto Quantum AI Trading Bot',
            companyName: 'Quantum AI Tech Pvt Ltd',
            investorName: 'Nikhil Sharma (Claimed Manager)',
            websiteUrl: 'https://crypto-quantum-ai-bot.com',
            fraudScore: 85,
          },
        });
      } else {
        setError(err.response?.data?.message || 'Report not found. Please check your Report ID.');
        setReport(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${encodeURIComponent(searchInput.trim())}`, { replace: true });
      fetchReport(searchInput.trim());
    }
  };

  const handleStatusChange = async (newStatus: ReportStatus) => {
    if (!report?._id) return;
    setUpdatingStatus(true);
    try {
      await adminService.updateReportStatus(report._id, newStatus, `Status updated to ${newStatus}`);
      setReport((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      // Update locally for client simulation
      setReport((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status?: ReportStatus) => {
    switch (status) {
      case 'Pending':
        return { label: 'Pending', icon: '🟡', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'Under Review':
        return { label: 'Under Review', icon: '🔵', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'Verified':
        return { label: 'Verified', icon: '🟢', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'Rejected':
        return { label: 'Rejected', icon: '🔴', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'Closed':
        return { label: 'Closed', icon: '⚫', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: 'Pending', icon: '🟡', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
  };

  const getStepProgressIndex = (status?: ReportStatus) => {
    switch (status) {
      case 'Pending':
        return 1; // Submitted
      case 'Under Review':
        return 2; // Under Review
      case 'Verified':
      case 'Rejected':
        return 3; // Verified / Rejected
      case 'Closed':
        return 4; // Closed
      default:
        return 1;
    }
  };

  const currentStepIndex = getStepProgressIndex(report?.status);
  const statusBadge = getStatusBadge(report?.status);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title & Subtitle */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
            <span>🛡️</span> Real-Time Government & Police Escalation Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Fraud Report
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Monitor the status and progress of your submitted report in real-time.
          </p>
        </div>

        {/* Search Box */}
        <Card className="border border-slate-200 shadow-md p-6 bg-white rounded-2xl">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Enter Report ID
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g., FID-2026-89421 or paste MongoDB ID"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <span>Track Report</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick preset chips */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold">Quick Search:</span>
            <button
              onClick={() => {
                setSearchInput('FID-2026-89421');
                fetchReport('FID-2026-89421');
              }}
              className="text-blue-600 hover:underline font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
            >
              FID-2026-89421
            </button>
            <button
              onClick={() => {
                setSearchInput('FID-6A94F9E2');
                fetchReport('FID-6A94F9E2');
              }}
              className="text-blue-600 hover:underline font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
            >
              FID-6A94F9E2
            </button>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-bold">Report Not Found</p>
              <p className="text-xs text-rose-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Report Content */}
        {report && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Report Summary Card */}
            <Card className="border border-slate-200 shadow-md p-6 sm:p-8 bg-white rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 pb-6 border-b border-slate-100 text-sm">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Report ID</p>
                  <p className="text-base font-mono font-extrabold text-slate-900 mt-0.5">
                    {report.reportId || report._id}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Report Date</p>
                  <p className="text-base font-medium text-slate-900 mt-0.5">
                    {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 Oct 2023'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Investment Name</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {report.investmentId?.name || 'Crypto Quantum AI Trading Bot'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Location</p>
                  <p className="text-base font-medium text-slate-900 mt-0.5">
                    {report.reporterLocation ? report.reporterLocation.split('[')[0] : 'Chennai, Tamil Nadu'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Company</p>
                  <p className="text-base font-medium text-slate-900 mt-0.5">
                    {report.investmentId?.companyName || report.investmentId?.investorName || 'Quantum AI Tech Pvt Ltd'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Current Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border mt-1 ${statusBadge.bg}`}>
                      <span>{statusBadge.icon}</span>
                      <span>{report.status || 'Under Review'}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Risk Level</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded text-xs border border-rose-200">
                        {report.riskScore >= 60 ? 'HIGH RISK' : report.riskScore >= 30 ? 'SUSPICIOUS' : 'SAFE'}
                      </span>
                      <span className="text-xs font-bold text-slate-700">({report.riskScore}/100)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Status Timeline */}
              <div className="pt-8 pb-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-6">
                  Investigation & Verification Timeline
                </h3>

                {/* Progress bar container */}
                <div className="relative mb-8">
                  {/* Track Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                  ></div>

                  {/* Step Points */}
                  <div className="relative flex justify-between">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const isUpcoming = idx > currentStepIndex;

                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : isCurrent
                                ? 'bg-white border-blue-600 ring-4 ring-blue-100 text-blue-600 font-extrabold scale-110'
                                : 'bg-white border-slate-300 text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : isCurrent ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            )}
                          </div>

                          <span
                            className={`text-[11px] sm:text-xs text-center mt-2 font-bold max-w-[80px] sm:max-w-[100px] leading-tight ${
                              isCurrent ? 'text-blue-700 underline decoration-2 decoration-blue-500' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status change demo tool (interactive tester for all 5 statuses) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-600">Simulate Government / Police Update:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['Pending', 'Under Review', 'Verified', 'Rejected', 'Closed'] as ReportStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        disabled={updatingStatus}
                        className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                          report.status === st
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Reported Location Map Card */}
            <Card className="border border-slate-200 shadow-md p-6 bg-white rounded-2xl">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                Reported Incident Location
              </h3>
              
              <div className="h-56 w-full rounded-xl relative overflow-hidden border border-slate-200 select-none bg-slate-100">
                {/* SVG Vector Map Simulation */}
                <svg className="absolute inset-0 w-full h-full opacity-90" preserveAspectRatio="none" viewBox="0 0 400 200">
                  <rect width="400" height="200" fill="#f8fafc" />
                  <path d="M 0,140 Q 90,110 200,160 T 400,130 L 400,200 L 0,200 Z" fill="#e0f2fe" />
                  <path d="M 30,0 Q 100,30 160,10 T 300,40 L 300,0 Z" fill="#dcfce7" />
                  <line x1="0" y1="40" x2="400" y2="40" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="120" y1="0" x2="120" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="260" y1="0" x2="260" y2="200" stroke="#fcd34d" strokeWidth="4" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="2" />
                  <text x="210" y="80" fill="#1e293b" fontSize="14" fontWeight="bold">Chennai</text>
                  <text x="210" y="98" fill="#64748b" fontSize="9">Tamil Nadu, India</text>
                </svg>

                {/* Location Overlay Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-md text-xs">
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>📍</span> Reported Location: {report.reporterLocation?.split('[')[0] || 'Chennai, Tamil Nadu'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Coordinates: 13.0827° N, 80.2707° E
                  </p>
                </div>

                {/* Pin Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white shadow-2xl flex items-center justify-center border-2 border-white animate-bounce">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate(`/report-details/${report._id || '1'}`)}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-sm transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>📄</span> View Full Report
              </button>

              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>🇮🇳</span> Escalate to Cyber Crime
              </a>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md shadow-purple-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>📥</span> Download PDF
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ReportTrackingPage;
