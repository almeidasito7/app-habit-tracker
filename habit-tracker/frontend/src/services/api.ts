import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Habits API
export const habitsApi = {
  getAll: () => api.get('/habits').then(r => r.data.habits),
  create: (data: Record<string, unknown>) => api.post('/habits', data).then(r => r.data.habit),
  update: (id: string, data: Record<string, unknown>) => api.put(`/habits/${id}`, data).then(r => r.data.habit),
  delete: (id: string) => api.delete(`/habits/${id}`),
  complete: (id: string) => api.post(`/habits/${id}/complete`).then(r => r.data),
  getStreak: (id: string) => api.get(`/habits/${id}/streak`).then(r => r.data.streak),
  getActivity: (weeks?: number) => api.get('/offensive/activity', { params: { weeks } }).then(r => r.data),
};

// Goals API
export const goalsApi = {
  getAll: () => api.get('/goals').then(r => r.data.goals),
  create: (data: Record<string, unknown>) => api.post('/goals', data).then(r => r.data.goal),
  update: (id: string, data: Record<string, unknown>) => api.put(`/goals/${id}`, data).then(r => r.data.goal),
  delete: (id: string) => api.delete(`/goals/${id}`),
};

// AI API
export const aiApi = {
  chat: (message: string, context?: Record<string, unknown>) => api.post('/ai/chat', { message, context }).then(r => r.data),
  suggestHabits: (goals: string[], currentHabits: string[]) =>
    api.post('/ai/suggest-habits', { goals, currentHabits }).then(r => r.data.suggestions),
  generateSchedule: (habits: string[], preferences: Record<string, unknown>) =>
    api.post('/ai/generate-schedule', { habits, preferences }).then(r => r.data.schedule),
};

// Profile API
export const profileApi = {
  get: () => api.get('/profile').then(r => r.data.user),
  update: (data: Record<string, unknown>) => api.put('/profile', data).then(r => r.data.user),
};

// Plans API
export const plansApi = {
  getAll: () => api.get('/plans').then(r => r.data.plans),
  createCheckout: (priceId: string) => api.post('/payment/create-checkout', { priceId }).then(r => r.data),
};
