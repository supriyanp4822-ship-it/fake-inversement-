import { useEffect, useState } from 'react';
import { Card, Button } from '../components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { reportService } from '../services/api';

export const ReportGovernmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!!id);

  useEffect(() => {
    if (!id) return;
    
    const fetchReport = async () => {
      try {
        setLoading(true);
        let res;
        if (id.startsWith('FID-') || id.startsWith('REP-')) {
          res = await reportService.track(id);
        } else {
          res = await reportService.getById(id);
        }
        if (res?.data?.data) {
          setReport(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch report for government reporting page', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const investment = report?.investmentId || {};
  const companyName = investment?.name || report?.companyName || 'Suspect Investments Ltd.';
  const websiteUrl = investment?.url || report?.websiteUrl || 'https://example-fraud.com';
  const riskScore = investment?.score !== undefined ? investment?.score : (report?.riskScore || 85);
  const riskLevel = riskScore >= 70 ? 'High Risk' : riskScore >= 31 ? 'Medium Risk' : 'Low Risk';
  const userDescription = report?.comments || report?.description || 'Promised 45% guaranteed monthly returns on a cryptocurrency fund. Asked for network processing fees to withdraw.';
  const location = report?.location || 'Mumbai, Maharashtra, India';
  const reportDate = report?.createdAt ? new Date(report.createdAt).toLocaleString() : new Date().toLocaleString();
  const reportId = report?._id || report?.trackingId || id || 'FID-2026-8472';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
          <span>🏛️</span> Official Government Fraud Reporting
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Submit saved fraud investigation details directly to national regulatory portals.
        </p>
      </div>

      {/* Alert Card */}
      <div className="bg-rose-950/30 border-l-4 border-rose-500 p-6 rounded-r-2xl shadow-xl border-y border-r border-rose-500/20">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🚨</span>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-rose-300">
              {riskScore >= 70 ? 'High-Risk' : 'Medium-Risk'} Case Preserved ({riskScore}/100)
            </h3>
            {loading ? (
              <p className="text-xs text-rose-400">Loading report dossier...</p>
            ) : (
              <div className="text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 font-medium">
                <p><strong className="text-slate-400">Report ID:</strong> <span className="font-mono text-cyan-400 font-bold">{reportId}</span></p>
                <p><strong className="text-slate-400">Target Entity:</strong> {companyName}</p>
                <p><strong className="text-slate-400">Website URL:</strong> <span className="text-cyan-400 break-all">{websiteUrl}</span></p>
                <p><strong className="text-slate-400">Recorded Date:</strong> {reportDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Portals Grid */}
      <h2 className="text-xl font-bold text-white pt-2">Official Reporting Portals</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* I4C Card */}
        <Card className="flex flex-col justify-between border-slate-700/60 hover:border-cyan-500/50 transition-colors">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🇮🇳</span> National Cyber Crime Reporting Portal (I4C)
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Ministry of Home Affairs portal for cyber fraud, fake investment applications, phishing domains, and financial theft.
            </p>
            <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl text-xs text-cyan-300 font-medium">
              <strong>Best Choice for:</strong> Direct financial loss, crypto scams, phishing URLs, fake trading apps.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-6 mt-auto">
            <a 
              href="https://cybercrime.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 text-center"
            >
              <Button variant="cyan" className="w-full text-xs">Report Cyber Crime ↗</Button>
            </a>
            <a 
              href="https://cybercrime.gov.in/Webform/Suspect_Search.aspx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 text-center"
            >
              <Button variant="secondary" className="w-full text-xs">Report Website ↗</Button>
            </a>
          </div>
        </Card>

        {/* SEBI SCORES Card */}
        <Card className="flex flex-col justify-between border-slate-700/60 hover:border-blue-500/50 transition-colors">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> SEBI SCORES Portal
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Securities and Exchange Board of India complaint portal for securities market entities, unauthorized advisors, and stock schemes.
            </p>
            <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl text-xs text-blue-300 font-medium">
              <strong>Best Choice for:</strong> Unregistered brokers, fake SEBI advisors, stock Ponzi schemes, fund fraud.
            </div>
          </div>
          <div className="pt-6 mt-auto">
            <a 
              href="https://scores.sebi.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center"
            >
              <Button variant="primary" className="w-full text-xs">File SEBI Complaint ↗</Button>
            </a>
          </div>
        </Card>
      </div>

      {/* Emergency Card */}
      <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border border-rose-500/40 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🚨</span> Financial Cyber Fraud Emergency Helpline
          </h3>
          <p className="text-rose-200 text-xs mt-1">
            Call <strong className="text-2xl text-white font-mono tracking-wider px-2 font-black">1930</strong> immediately to request urgent payment blocking across participating banks.
          </p>
        </div>
      </div>

      {/* Preserved Summary */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700/60">Preserved Dossier Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 uppercase font-extrabold block">Report ID</span>
            <span className="font-mono font-bold text-cyan-400">{reportId}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-extrabold block">Company / Entity</span>
            <span className="font-semibold text-white">{companyName}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-extrabold block">Website URL</span>
            <span className="font-semibold text-cyan-400 break-all">{websiteUrl}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-extrabold block">Risk Score</span>
            <span className="font-bold text-rose-400">{riskScore}/100 ({riskLevel})</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-extrabold block">Location Recorded</span>
            <span className="font-semibold text-slate-200">{location}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-extrabold block">Recorded At</span>
            <span className="font-semibold text-slate-200">{reportDate}</span>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="text-slate-400 uppercase font-extrabold block mb-1">User Notes / Description</span>
            <p className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-slate-300">{userDescription}</p>
          </div>
        </div>
      </Card>

      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)} className="text-xs px-6">
          ← Back
        </Button>
        <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">
          <Button variant="cyan" className="text-xs px-8">
            Open Official Cyber Crime Portal ↗
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ReportGovernmentPage;
