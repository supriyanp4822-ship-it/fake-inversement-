export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const RISK_LEVELS = ['low', 'medium', 'high'];

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Analysis',
  flagged: 'Flagged',
  safe: 'Safe',
  high_risk: 'High Risk',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  flagged: 'bg-orange-100 text-orange-800',
  safe: 'bg-green-100 text-green-800',
  high_risk: 'bg-red-100 text-red-800',
};
