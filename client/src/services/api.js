/**
 * Centralized API Service Layer
 * Supports dual-mode authentication:
 * 1. HttpOnly cookie authentication via credentials: 'include'
 * 2. Bearer Authorization header fallback for cross-origin deployments
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('sweety_auth_token') : null;

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      credentials: 'include', // Ensures cookies are automatically sent and received
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.code = data.code || 'UNKNOWN_ERROR';
        error.errors = data.errors || [];
        throw error;
      }

      return data;
    } catch (err) {
      if (!err.status) {
        // Network or offline error
        const networkError = new Error('Network error. Unable to reach Sweety API server.');
        networkError.status = 0;
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      throw err;
    }
  }

  // --- Auth Endpoints ---
  async register(name, email, password) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (res?.data?.token) {
      localStorage.setItem('sweety_auth_token', res.data.token);
    }
    return res;
  }

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res?.data?.token) {
      localStorage.setItem('sweety_auth_token', res.data.token);
    }
    return res;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sweety_auth_token');
      }
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  // --- Reading Endpoints ---
  async getReadings(date) {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.request(`/readings${query}`, { method: 'GET' });
  }

  async getReading(id) {
    if (!id || id === 'undefined') {
      throw new Error('Valid reading ID is required.');
    }
    return this.request(`/readings/${id}`, { method: 'GET' });
  }

  async createReading(readingData) {
    return this.request('/readings', {
      method: 'POST',
      body: JSON.stringify(readingData),
    });
  }

  async updateReading(id, readingData) {
    if (!id || id === 'undefined') {
      throw new Error('Valid reading ID is required to update a reading.');
    }
    return this.request(`/readings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(readingData),
    });
  }

  async deleteReading(id) {
    if (!id || id === 'undefined') {
      throw new Error('Valid reading ID is required to delete a reading.');
    }
    return this.request(`/readings/${id}`, { method: 'DELETE' });
  }

  // --- Reports Endpoints ---
  async getDailyReport(date) {
    return this.request(`/reports/daily?date=${encodeURIComponent(date)}`, { method: 'GET' });
  }

  async getMonthToDateReport(date) {
    return this.request(`/reports/month-to-date?date=${encodeURIComponent(date)}`, { method: 'GET' });
  }

  async getMonthlyReport(date) {
    return this.request(`/reports/monthly?date=${encodeURIComponent(date)}`, { method: 'GET' });
  }

  async checkHealth() {
    return this.request('/health', { method: 'GET' });
  }
}

export const api = new ApiClient();
