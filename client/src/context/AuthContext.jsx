import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await api.getCurrentUser();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res && res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true };
      }
      const msg = res?.message || 'Invalid response from server. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } catch (err) {
      const msg = err.message === 'Failed to fetch'
        ? 'Unable to connect to the backend server. Please verify the service is running.'
        : err.message;
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.register(name, email, password);
      if (res && res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true };
      }
      const msg = res?.message || 'Invalid response from server. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } catch (err) {
      const msg = err.message === 'Failed to fetch'
        ? 'Unable to connect to the backend server. Please verify the service is running.'
        : err.message;
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
