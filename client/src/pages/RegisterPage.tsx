import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../context/authStore';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Enter a valid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) errors.terms = 'You must agree to the Terms & Conditions';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const response = await authService.register(
        formData.email,
        formData.password,
        formData.fullName
      );
      setAuth(response.data.data.user, response.data.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: '', width: '0%' };
    if (pwd.length < 6) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (pwd.length < 8) return { label: 'Fair', color: '#f97316', width: '50%' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
      return { label: 'Strong', color: '#22c55e', width: '100%' };
    return { label: 'Good', color: '#3b82f6', width: '75%' };
  };
  const strength = getPasswordStrength(formData.password);

  const inputBase =
    'w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-200';
  const inputStyle = {
    border: '1.5px solid #e2e8f0',
    background: '#f8faff',
    color: '#1e293b',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#3b82f6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>, hasError?: boolean) => {
    e.target.style.borderColor = hasError ? '#ef4444' : '#e2e8f0';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[42%] relative flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #0f1b4c 0%, #1a3a8f 40%, #0d2060 70%, #091540 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4f8ef7, transparent)' }}
        />
        <div
          className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          {/* Logo */}
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

          {/* Illustration */}
          <div className="relative mb-7">
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
                transform: 'scale(1.4)',
              }}
            />
            <svg
              viewBox="0 0 200 220"
              className="w-52 h-52 relative z-10"
              style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.5))' }}
            >
              {/* Shield body */}
              <path
                d="M100 8 L185 40 L185 110 C185 155 148 190 100 205 C52 190 15 155 15 110 L15 40 Z"
                fill="url(#shieldGrad2)"
                stroke="rgba(147,197,253,0.4)"
                strokeWidth="1.5"
              />
              <path
                d="M100 22 L170 48 L170 110 C170 146 141 175 100 188 C59 175 30 146 30 110 L30 48 Z"
                fill="url(#shieldInner2)"
                opacity="0.5"
              />
              {/* User icon */}
              <circle cx="100" cy="100" r="18" fill="white" opacity="0.9" />
              <circle cx="100" cy="93" r="8" fill="#1d4ed8" />
              <path
                d="M76 118 C76 106 84 100 100 100 C116 100 124 106 124 118"
                fill="#1d4ed8"
                opacity="0.9"
              />
              {/* Plus badge */}
              <circle cx="140" cy="65" r="14" fill="#10b981" />
              <rect x="134" y="63" width="12" height="4" rx="2" fill="white" />
              <rect x="138" y="59" width="4" height="12" rx="2" fill="white" />
              {/* Star accents */}
              <circle cx="45" cy="70" r="4" fill="#fbbf24" opacity="0.8" />
              <circle cx="158" cy="140" r="3" fill="#60a5fa" opacity="0.7" />
              <circle cx="35" cy="150" r="3" fill="#a78bfa" opacity="0.6" />
              <defs>
                <linearGradient id="shieldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="shieldInner2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 className="text-white text-2xl font-bold mb-2 leading-tight">
            Start Your Journey to<br />Safe Investments
          </h2>
          <p className="text-blue-200 text-sm max-w-xs leading-relaxed mt-2">
            Join thousands of users who trust us to verify investments and protect their financial
            future.
          </p>

          {/* Features list */}
          <div className="mt-7 space-y-3 w-full max-w-xs">
            {[
              { icon: '🔍', text: 'AI-powered investment analysis' },
              { icon: '🛡️', text: 'Real-time scam detection alerts' },
              { icon: '📊', text: 'Comprehensive risk scoring' },
              { icon: '🔒', text: '100% secure & private' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  {f.icon}
                </div>
                <span className="text-blue-100 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto"
        style={{ background: '#f0f4ff' }}
      >
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-6">
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
          className="w-full max-w-[440px] rounded-2xl p-7 shadow-xl"
          style={{
            background: 'rgba(255,255,255,0.93)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246,0.1)',
          }}
        >
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm">Begin to get started</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="flex items-start gap-3 p-3 mb-4 rounded-xl text-sm"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="reg-name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="reg-name"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputBase}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.fullName ? '#ef4444' : '#e2e8f0',
                  }}
                  onFocus={focusStyle}
                  onBlur={(e) => blurStyle(e, !!fieldErrors.fullName)}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={inputBase}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.email ? '#ef4444' : '#e2e8f0',
                  }}
                  onFocus={focusStyle}
                  onBlur={(e) => blurStyle(e, !!fieldErrors.email)}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="reg-phone">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={(e) => blurStyle(e)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`${inputBase} pr-10`}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.password ? '#ef4444' : '#e2e8f0',
                  }}
                  onFocus={focusStyle}
                  onBlur={(e) => blurStyle(e, !!fieldErrors.password)}
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
              {/* Password strength bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength</span>
                    <span className="text-xs font-semibold" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                </div>
              )}
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="reg-confirm">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`${inputBase} pr-10`}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.confirmPassword ? '#ef4444' : '#e2e8f0',
                  }}
                  onFocus={focusStyle}
                  onBlur={(e) => blurStyle(e, !!fieldErrors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? (
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
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <div className="relative mt-0.5 flex-shrink-0">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                    style={{
                      background: agreedToTerms ? '#3b82f6' : 'white',
                      border: agreedToTerms
                        ? '1.5px solid #3b82f6'
                        : fieldErrors.terms
                        ? '1.5px solid #ef4444'
                        : '1.5px solid #cbd5e1',
                    }}
                    onClick={() => {
                      setAgreedToTerms(!agreedToTerms);
                      if (fieldErrors.terms) setFieldErrors({ ...fieldErrors, terms: '' });
                    }}
                  >
                    {agreedToTerms && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 select-none leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="font-semibold" style={{ color: '#3b82f6' }}>
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-semibold" style={{ color: '#3b82f6' }}>
                    Privacy Policy
                  </a>
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="text-xs text-red-500 mt-1 ml-6">{fieldErrors.terms}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 mt-1"
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
                  Creating Account...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs text-gray-400 font-medium">Or Register with</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          {/* Google Register */}
          <button
            id="google-register"
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ border: '1.5px solid #e2e8f0', background: 'white', color: '#374151' }}
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
            Register with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors"
              style={{ color: '#3b82f6' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3b82f6')}
            >
              Login
            </Link>
          </p>
        </div>

        <p className="text-xs text-gray-400 mt-5 text-center">
          © 2024 Fake Investment Detection. All rights reserved.
        </p>
      </div>
    </div>
  );
};
