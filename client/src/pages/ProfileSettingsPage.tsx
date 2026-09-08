import { useAuthStore } from '../context/authStore';
import { Card, Button } from '../components/ui';

export const ProfileSettingsPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
          <span>👤</span> User Account & Security Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your personal profile, security preferences, and evaluation history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Stats & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6 pb-2 border-b border-slate-700/60">Profile Information</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-cyan-500/20 shrink-0">
                {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-white font-bold text-base">{user?.fullName || 'Platform User'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Role</span>
                    <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold px-2.5 py-1 rounded inline-block mt-0.5 uppercase">
                      {user?.role || 'user'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-slate-200 font-semibold">{user?.email || 'user@example.com'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Account Status</span>
                    <span className="text-emerald-400 font-bold flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active & Verified
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="secondary" className="text-xs">Edit Profile Information</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Activity Stats */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6 pb-2 border-b border-slate-700/60">Account Security Activity</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-2xl font-black text-cyan-400 font-mono mb-0.5">24</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Scans</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-2xl font-black text-emerald-400 font-mono mb-0.5">15</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Safe</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-2xl font-black text-rose-500 font-mono mb-0.5">6</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">High Risk</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-2xl font-black text-amber-400 font-mono mb-0.5">3</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Reports Logged</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Settings & Security */}
        <div className="space-y-8">
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-700/60 pb-2">Security Controls</h2>
            <div className="space-y-3 text-xs">
              <button className="w-full flex justify-between items-center p-3 bg-slate-950/40 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors text-left font-semibold text-slate-200">
                <span>Change Account Password</span>
                <span>→</span>
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-slate-950/40 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors text-left font-semibold text-slate-200">
                <span>Session Logins & IP History</span>
                <span>→</span>
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-slate-950/40 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors text-left font-semibold text-slate-200">
                <span>Download My Account Dossier</span>
                <span>→</span>
              </button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-700/60 pb-2">Session Security</h2>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 font-extrabold uppercase block mb-1">Current IP Location</span>
                <span className="font-semibold text-white">Active Session (Current Device)</span>
              </div>
              <div className="pt-2">
                <Button variant="danger" className="w-full text-xs py-2">Terminate All Other Sessions</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
