import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if JWT token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('herbtrace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for graceful error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Network communication error';
    return Promise.reject(new Error(message));
  }
);

export default api;
