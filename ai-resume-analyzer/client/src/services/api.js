import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Resume
export const uploadResume = (formData, onProgress) =>
  api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  });

export const analyzeResume = (id, jobRole) =>
  api.post(`/resume/analyze/${id}`, { jobRole });

export const parseResume = (id) => api.post(`/resume/parse/${id}`);
export const extractSkills = (id) => api.post(`/resume/extract-skills/${id}`);
export const getATSScore = (id) => api.post(`/resume/ats/${id}`);
export const getKeywords = (id, jobRole) => api.post(`/resume/keywords/${id}`, { jobRole });
export const getSuggestions = (id) => api.post(`/resume/suggestions/${id}`);
export const getResume = (id) => api.get(`/resume/${id}`);
export const getJobRoles = () => api.get('/resume/meta/job-roles');
export const downloadReport = (id) =>
  api.get(`/resume/${id}/report`, { responseType: 'blob' });

// History
export const getHistory = () => api.get('/history');
export const deleteResume = (id) => api.delete(`/history/${id}`);

export default api;
