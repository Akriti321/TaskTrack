import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('task-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('task-token');
      localStorage.removeItem('task-user');
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  signup: (payload) => api.post('/api/auth/signup', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  me: () => api.get('/api/auth/me'),
  updateProfile: (payload) => api.put('/api/auth/profile', payload),
  changePassword: (payload) => api.put('/api/auth/change-password', payload),
  logout: () => api.post('/api/auth/logout'),
};

export const taskApi = {
  getAll: (params = {}) => api.get('/api/tasks', { params }),
  getById: (id) => api.get(`/api/tasks/${id}`),
  create: (task) => api.post('/api/tasks', task),
  update: (id, task) => api.put(`/api/tasks/${id}`, task),
  remove: (id) => api.delete(`/api/tasks/${id}`),
};

export default api;
