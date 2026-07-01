/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverWaking, setServerWaking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    // Retry up to 3 times with increasing timeouts for Render cold starts
    const attempts = [
      { timeout: 10000, delay: 0 },
      { timeout: 20000, delay: 2000 },
      { timeout: 30000, delay: 3000 },
    ];

    for (let i = 0; i < attempts.length; i++) {
      const { timeout: ms, delay } = attempts[i];
      if (delay > 0) {
        setServerWaking(true);
        await new Promise(r => setTimeout(r, delay));
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        const { data } = await api.get('/auth/me', { signal: controller.signal });
        clearTimeout(timer);
        setUser(data.user);
        setServerWaking(false);
        setLoading(false);
        return;
      } catch (error) {
        // If it's not a timeout/network error, don't retry (e.g. 401 = bad token)
        if (error.response?.status === 401) break;
        if (i === attempts.length - 1) break; // last attempt
        // Otherwise retry
      }
    }

    // All attempts failed — clear token
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setServerWaking(false);
    setLoading(false);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cr_partner_slug');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    serverWaking,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    hasSubscription: ['active', 'trial', 'lifetime', 'paused'].includes(user?.subscription?.status)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
