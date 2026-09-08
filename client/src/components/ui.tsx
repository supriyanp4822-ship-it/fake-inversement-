import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyan';
  loading?: boolean;
}

export const Button = ({ children, variant = 'primary', loading, className = '', ...props }: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/20',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white',
  };

  return (
    <button
      className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all ${
          error ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-rose-400 text-xs font-medium">{error}</span>}
    </div>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-950/40 ${className}`}>
      {children}
    </div>
  );
};

export const RiskBadge = ({ score }: { score: number }) => {
  if (score >= 70) {
    return (
      <span className="risk-badge-high">
        <span>🚨</span> High Risk ({score}/100)
      </span>
    );
  }
  if (score >= 31) {
    return (
      <span className="risk-badge-medium">
        <span>⚠️</span> Medium Risk ({score}/100)
      </span>
    );
  }
  return (
    <span className="risk-badge-low">
      <span>✅</span> Low Risk ({score}/100)
    </span>
  );
};
