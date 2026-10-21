import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('herbtrace_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('herbtrace_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('herbtrace_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: loggedInUser, token: authToken } = res.data;
    localStorage.setItem('herbtrace_token', authToken);
    setToken(authToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { user: registeredUser, token: authToken } = res.data;
    if (authToken) {
      localStorage.setItem('herbtrace_token', authToken);
      setToken(authToken);
      setUser(registeredUser);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('herbtrace_token');
    setToken(null);
    setUser(null);
  };

  // Instant 1-Click Demo Login for presentations
  const demoLogin = async (role) => {
    const demoCredentials = {
      admin: { email: 'admin@herbtrace.com', password: 'admin123' },
      farmer: { email: 'farmer@herbtrace.com', password: 'farmer123' },
      collector: { email: 'collector@herbtrace.com', password: 'collector123' },
      inspector: { email: 'inspector@herbtrace.com', password: 'inspector123' },
      processor: { email: 'processor@herbtrace.com', password: 'processor123' },
      manufacturer: { email: 'manufacturer@herbtrace.com', password: 'manufacturer123' },
    };

    const creds = demoCredentials[role];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
