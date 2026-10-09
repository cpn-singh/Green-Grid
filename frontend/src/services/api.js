import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getMe: () => api.get('/auth/me/'),
};

export const dcAPI = {
  getProfile: () => api.get('/dc/profile/'),
  saveProfile: (data) => api.post('/dc/profile/', data),
  getAnalysis: () => api.get('/dc/analysis/'),
};

export const supplierAPI = {
  getProfile: () => api.get('/supplier/profile/'),
  saveProfile: (data) => api.post('/supplier/profile/', data),
  getPublicList: () => api.get('/supplier/public/'),
};

export const matchAPI = {
  getMyMatches: () => api.get('/matches/'),
  getMatchDetail: (id) => api.get(`/matches/${id}/`),
  actOnMatch: (id, action) => api.post(`/matches/${id}/${action}/`),
  getPublicTopMatches: () => api.get('/matches/public/'),
};

export const mapAPI = {
  getMarkers: () => api.get('/map/markers/'),
  getStats: () => api.get('/map/stats/'),
};

export default api;
