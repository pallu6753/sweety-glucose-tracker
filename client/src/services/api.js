/**
 * Centralized API Service Layer
 * Supports HttpOnly cookie authentication via credentials: 'include'
 */

const API_BASE_URL = '/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
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
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
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
    return this.request(`/readings/${id}`, { method: 'GET' });
  }

  async createReading(readingData) {
    return this.request('/readings', {
      method: 'POST',
      body: JSON.stringify(readingData),
    });
  }

  async updateReading(id, readingData) {
    return this.request(`/readings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(readingData),
    });
  }

  async deleteReading(id) {
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
