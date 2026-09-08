import { useState } from 'react';
import { Card, Button } from '../components/ui';

export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🔔</span> Security Alerts & Notifications
          </h1>
          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold px-2.5 py-1 rounded-full">
            5 Unread
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs py-2 px-3">Mark All Read</Button>
          <Button variant="ghost" className="text-xs py-2 px-3 border border-slate-700">Clear All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'all', label: 'All Alerts (12)' },
              { id: 'high-risk', label: 'High Risk (3)' },
              { id: 'scam-alerts', label: 'Scam Intelligence (5)' },
              { id: 'updates', label: 'Report Status (4)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feed Items */}
          <div className="space-y-4">
            {/* Prominent High Risk Alert */}
            <Card className="border-rose-500/40 bg-rose-950/20 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚨</span>
                  <h3 className="font-bold text-white text-base">Critical Fraud Alert: CryptoGain Investment Fund</h3>
                </div>
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  High Risk (9.5/10)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Warning:</strong> Ponzi structure flagged by automated engine. Features unregistered overseas domain, non-verifiable claims of 45% monthly guaranteed returns, and aggressive multi-level referral fees.
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-rose-500/20 text-xs">
                <span className="text-slate-400">Oct 26, 2026 11:32 AM</span>
                <Button variant="danger" className="text-xs py-1.5 px-4">Inspect Dossier →</Button>
              </div>
            </Card>

            {/* Standard Alert */}
            <Card className="hover:border-slate-600 transition-colors space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">Risk Score: 7.2/10</span>
                  <h3 className="font-bold text-white text-base">Apex Forex Advisory Group</h3>
                </div>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Scam Alert
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unregistered investment advisor offering unauthorized portfolio management in commodity futures with zero regulator registration.
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700/40 text-xs">
                <span className="text-slate-400">Oct 25, 2026 09:15 AM</span>
                <Button variant="secondary" className="text-xs py-1.5 px-3">View Details</Button>
              </div>
            </Card>

            {/* Report Update */}
            <Card className="hover:border-slate-600 transition-colors space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-base">Report Status Updated: Capital Growth Partners</h3>
                </div>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Status Change
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your report ID <span className="font-mono text-cyan-400 font-bold">FID-2026-8472</span> status changed from <strong>Pending</strong> to <strong>Under Review</strong> by verification administrator.
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700/40 text-xs">
                <span className="text-slate-400">Oct 24, 2026 03:45 PM</span>
                <Button variant="ghost" className="text-xs py-1.5 px-3 border border-slate-700">Track Progress</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Preferences */}
        <div className="lg:col-span-1">
          <Card className="space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-700/60 pb-2">Notification Settings</h3>
            <div className="space-y-3 text-xs font-semibold text-slate-300">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Email Instant Alerts</span>
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-cyan-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>High Risk Push Alerts</span>
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-cyan-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Report Status Updates</span>
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-cyan-500" />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
