/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.counselorready.com/api',
  timeout: 30000, // 30s timeout to handle Render cold starts
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token and impersonation header to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const impersonateId = sessionStorage.getItem('cr_impersonate_partner_id');
  if (impersonateId) {
    config.headers['X-Partner-Id'] = impersonateId;
  }
  return config;
});

// Retry on network errors (cold start resilience)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Don't retry if already retried, or if it's a real HTTP error (not network)
    if (config._retried || error.response) {
      return Promise.reject(error);
    }

    // Network error or timeout — retry once after 3s
    config._retried = true;
    await new Promise(r => setTimeout(r, 3000));
    return api(config);
  }
);

export default api;
