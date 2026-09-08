import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../constants';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email: string, password: string, fullName: string) =>
    api.post('/auth/register', { email, password, fullName }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

export const investmentService = {
  getAll: () => api.get('/investments'),
  create: (data: any) => api.post('/investments', data),
  getById: (id: string) => api.get(`/investments/${id}`),
  update: (id: string, data: any) => api.put(`/investments/${id}`, data),
  delete: (id: string) => api.delete(`/investments/${id}`),
};

export const reportService = {
  getAll: () => api.get('/reports'),
  create: (investmentId: string, location?: string, comments?: string) => api.post('/reports', { investmentId, location, comments }),
  getById: (id: string) => api.get(`/reports/${id}`),
  track: (trackingId: string) => api.get(`/reports/track/${encodeURIComponent(trackingId)}`),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getReports: (status?: string, search?: string) =>
    api.get('/admin/reports', { params: { status, search } }),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id: string, role: 'user' | 'admin') =>
    api.put(`/admin/users/${id}/role`, { role }),
  toggleUserBlock: (id: string) =>
    api.put(`/admin/users/${id}/block`),
  updateReportStatus: (id: string, status: string, note?: string) =>
    api.patch(`/admin/reports/${id}/status`, { status, note }),
};

export const websiteCheckService = {
  check: (url: string) => api.post('/website-check', { url }),
};

export default api;
