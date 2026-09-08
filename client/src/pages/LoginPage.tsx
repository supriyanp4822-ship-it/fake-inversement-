import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../context/authStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setAuth(response.data.data.user, response.data.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1b4c 0%, #1a3a8f 40%, #0d2060 70%, #091540 100%)',
        }}
      >
        {/* Animated background blobs */}
        <div
          className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4f8ef7, transparent)' }}
        />
        <div
          className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}
        />
        <div
          className="absolute top-1/3 right-[-40px] w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #93c5fd, transparent)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <div className="mb-6 flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg leading-tight">Fake Investment</p>
              <p className="text-blue-300 font-semibold text-sm leading-tight">Detection</p>
            </div>
          </div>

          {/* Shield Illustration */}
          <div className="relative mb-8">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
                transform: 'scale(1.4)',
              }}
            />
            <svg
              viewBox="0 0 200 220"
              className="w-56 h-56 relative z-10 drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.5))' }}
            >
              {/* Outer shield */}
              <path
                d="M100 8 L185 40 L185 110 C185 155 148 190 100 205 C52 190 15 155 15 110 L15 40 Z"
                fill="url(#shieldGrad)"
                stroke="rgba(147,197,253,0.4)"
                strokeWidth="1.5"
              />
              {/* Inner shield highlight */}
              <path
                d="M100 22 L170 48 L170 110 C170 146 141 175 100 188 C59 175 30 146 30 110 L30 48 Z"
                fill="url(#shieldInner)"
                opacity="0.6"
              />
              {/* Lock body */}
              <rect x="78" y="100" width="44" height="38" rx="6" fill="white" opacity="0.95" />
              {/* Lock shackle */}
              <path
                d="M88 100 L88 88 C88 76 112 76 112 88 L112 100"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.95"
              />
              {/* Keyhole */}
              <circle cx="100" cy="116" r="5" fill="#1d4ed8" />
              <rect x="97.5" y="119" width="5" height="9" rx="2" fill="#1d4ed8" />
              {/* Checkmark accent */}
              <circle cx="140" cy="65" r="14" fill="#10b981" />
              <path d="M133 65 L138 70 L148 58" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="shieldInner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Text content */}
          <h2 className="text-white text-2xl font-bold mb-2 leading-tight">
            Secure Your Investments,<br />Secure Your Future
          </h2>
          <p className="text-blue-200 text-sm max-w-xs leading-relaxed mt-2">
            Our AI-powered platform helps you identify suspicious investment opportunities and
            protect your hard-earned money.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mt-8">
            {[
              { value: '25,000+', label: 'Active Users' },
              { value: '12,540+', label: 'Frauds Reported' },
              { value: '150+', label: 'Articles' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-white font-bold text-base">{stat.value}</p>
                <p className="text-blue-300 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative"
        style={{ background: '#f0f4ff' }}
      >
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span className="text-gray-800 font-bold text-lg">Fake Investment Detection</span>
        </div>

        <div
          className="w-full max-w-[420px] rounded-2xl p-8 shadow-xl relative"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246,0.1)',
          }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h1>
            <p className="text-gray-500 text-sm">Login to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="flex items-start gap-3 p-3 mb-5 rounded-xl text-sm"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-200"
                  style={{
                    border: '1.5px solid #e2e8f0',
                    background: '#f8faff',
                    color: '#1e293b',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Phone Number field (matching design) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="login-phone">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="login-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-200"
                  style={{
                    border: '1.5px solid #e2e8f0',
                    background: '#f8faff',
                    color: '#1e293b',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl outline-none transition-all duration-200"
                  style={{
                    border: '1.5px solid #e2e8f0',
                    background: '#f8faff',
                    color: '#1e293b',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                    style={{
                      background: rememberMe ? '#3b82f6' : 'white',
                      border: rememberMe ? '1.5px solid #3b82f6' : '1.5px solid #cbd5e1',
                    }}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 select-none">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold transition-colors"
                style={{ color: '#3b82f6' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#3b82f6')}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 relative overflow-hidden mt-2"
              style={{
                background: loading
                  ? '#93c5fd'
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(59,130,246,0.4)',
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget.style.transform = 'translateY(-1px)');
              }}
              onMouseLeave={(e) => {
                (e.currentTarget.style.transform = 'translateY(0)');
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs text-gray-400 font-medium">Or Login with</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          {/* Google Login */}
          <button
            id="google-login"
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              border: '1.5px solid #e2e8f0',
              background: 'white',
              color: '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.background = '#f0f7ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = 'white';
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login with Google
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors"
              style={{ color: '#3b82f6' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3b82f6')}
            >
              Register
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          © 2024 Fake Investment Detection. All rights reserved.
        </p>
      </div>
    </div>
  );
};
