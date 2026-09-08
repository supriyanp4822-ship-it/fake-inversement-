import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

export const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <span className="text-white font-black tracking-tight">FAKEDETECT</span>
            <span className="text-cyan-400 text-xs block font-mono font-normal tracking-widest uppercase">Security Intelligence</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          <Link 
            to="/website-check" 
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              isActive('/website-check') ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🌐</span> Website Security Check
          </Link>
          <Link 
            to="/track" 
            className={`px-3 py-2 rounded-lg transition-all ${
              isActive('/track') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Track Report
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-lg transition-all ${
                  isActive('/dashboard') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/investments" 
                className={`px-3 py-2 rounded-lg transition-all ${
                  isActive('/investments') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Investments
              </Link>
              <Link 
                to="/reports" 
                className={`px-3 py-2 rounded-lg transition-all ${
                  isActive('/reports') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Reports
              </Link>
              <Link 
                to="/notifications" 
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${
                  isActive('/notifications') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🔔</span> Notifications
              </Link>
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${
                  isActive('/profile') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>👤</span> Profile
              </Link>

              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5"
                >
                  <span>🛡️</span> Admin Panel
                </Link>
              )}

              <button 
                onClick={handleLogout} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-4 py-2 rounded-lg transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-4 py-2 rounded-lg font-bold shadow-md shadow-cyan-500/20 transition-all">
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/website-check"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-semibold"
          >
            🌐 Website Security Check
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
          >
            🔍 Track Report
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/investments"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                💰 Investments
              </Link>
              <Link
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                📄 Reports
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                🔔 Notifications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                👤 Profile Settings
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30"
                >
                  🛡️ Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold border border-slate-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 mt-20 border-t border-slate-800/80">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-black text-white tracking-tight">FAKE INVESTMENT DETECTION</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Automated heuristic risk detection platform analyzing investment parameters, SSL certificates, RDAP domain registrations, and user complaint signals to protect investors against fraudulent schemes.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/website-check" className="hover:text-cyan-400 transition-colors">Website Security Check</Link></li>
            <li><Link to="/track" className="hover:text-cyan-400 transition-colors">Track Report Status</Link></li>
            <li><Link to="/report-government" className="hover:text-cyan-400 transition-colors">Government Portals</Link></li>
            <li><Link to="/notifications" className="hover:text-cyan-400 transition-colors">Scam Awareness Alerts</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">Emergency Helplines</h4>
          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
            <p className="text-xs text-rose-300 font-semibold">National Cyber Crime Helpline</p>
            <p className="text-lg font-black text-white tracking-wider font-mono">1930</p>
            <p className="text-[10px] text-rose-400/80 mt-1">Request immediate bank payment block</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Fake Investment Detection Platform. All rights reserved.</p>
        <p className="text-[11px]">Designed for high-frequency fraud analysis & regulatory reporting assistance.</p>
      </div>
    </footer>
  );
};
