import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { Card, Button } from '../components/ui';
import { investmentService } from '../services/api';
import { formatCurrency } from '../constants';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await investmentService.getAll();
        setInvestments(response.data.data);
      } catch (err: any) {
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const total = investments.length;
  const safe = investments.filter((i) => i.status === 'safe').length;
  const suspicious = investments.filter((i) => i.status === 'flagged').length;
  const highRisk = investments.filter((i) => i.status === 'high_risk').length;

  const totalValue = investments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const safePercent = total > 0 ? Math.round((safe / total) * 100) : 0;
  const suspiciousPercent = total > 0 ? Math.round((suspicious / total) * 100) : 0;
  const highRiskPercent = total > 0 ? Math.round((highRisk / total) * 100) : 0;

  if (loading) return <p className="text-slate-400 py-20 text-center font-semibold">Loading Security Command Center...</p>;
  if (error) return <p className="text-rose-400 py-20 text-center font-semibold">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-800 to-indigo-900/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span>👤</span> Authenticated Session
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Welcome Back, {user?.fullName}!</h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1">
              Your centralized command center for fake investment analysis and fraud risk scoring.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link to="/investments" className="w-full sm:w-auto">
              <Button variant="cyan" className="w-full sm:w-auto">
                <span>➕</span> Analyze Opportunity
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Evaluated</p>
              <h3 className="text-3xl font-black text-white mt-1">{total}</h3>
              <p className="text-xs text-slate-400 mt-1">Value: <span className="font-semibold text-slate-200">{formatCurrency(totalValue)}</span></p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              💰
            </div>
          </div>
        </Card>

        <Card className="border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Safe Investments</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">{safe}</h3>
              <p className="text-xs text-emerald-400/80 font-semibold mt-1">{safePercent}% of total</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              ✅
            </div>
          </div>
        </Card>

        <Card className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Suspicious</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">{suspicious}</h3>
              <p className="text-xs text-amber-400/80 font-semibold mt-1">{suspiciousPercent}% of total</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              ⚠️
            </div>
          </div>
        </Card>

        <Card className="border-rose-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">High Risk / Fraud</p>
              <h3 className="text-3xl font-black text-rose-500 mt-1">{highRisk}</h3>
              <p className="text-xs text-rose-400/80 font-semibold mt-1">{highRiskPercent}% of total</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
              🚨
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700/60">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link to="/investments">
                <Button variant="cyan" className="w-full">Analyze New Investment</Button>
              </Link>
              <Link to="/reports">
                <Button variant="secondary" className="w-full">View Generated Reports</Button>
              </Link>
              <Link to="/website-check">
                <Button variant="ghost" className="w-full border border-slate-700">Check Website URL</Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700/60">Risk Distribution</h2>
            {total === 0 ? (
              <p className="text-slate-400 text-sm">No investment data logged yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="w-full h-3.5 bg-slate-950/80 rounded-full overflow-hidden flex border border-slate-800">
                  <div style={{ width: `${safePercent}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${suspiciousPercent}%` }} className="bg-amber-400 h-full" />
                  <div style={{ width: `${highRiskPercent}%` }} className="bg-rose-500 h-full" />
                </div>
                
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-slate-300">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2" /> Safe
                    </span>
                    <span className="text-white">{safe} ({safePercent}%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-slate-300">
                      <span className="w-2.5 h-2.5 bg-amber-400 rounded-full mr-2" /> Suspicious
                    </span>
                    <span className="text-white">{suspicious} ({suspiciousPercent}%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-slate-300">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mr-2" /> High Risk
                    </span>
                    <span className="text-white">{highRisk} ({highRiskPercent}%)</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Recent Evaluations */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700/60">Recent Evaluations</h2>
            {investments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <p>No investments submitted yet.</p>
                <Link to="/investments">
                  <Button variant="cyan">Analyze Your First Opportunity →</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/40 max-h-[420px] overflow-y-auto pr-1">
                {investments.slice(0, 6).map((inv) => (
                  <div key={inv._id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{inv.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Amount: {formatCurrency(inv.amount)} | Return: {inv.expectedReturn}%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase border ${
                        inv.status === 'safe' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : inv.status === 'flagged' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {inv.status}
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-200">{inv.fraudScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
