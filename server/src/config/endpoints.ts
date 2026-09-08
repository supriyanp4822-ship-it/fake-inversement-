export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  INVESTMENTS: {
    LIST: '/investments',
    CREATE: '/investments',
    GET: (id: string) => `/investments/${id}`,
    UPDATE: (id: string) => `/investments/${id}`,
    DELETE: (id: string) => `/investments/${id}`,
  },
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id: string) => `/reports/${id}`,
  },
};
