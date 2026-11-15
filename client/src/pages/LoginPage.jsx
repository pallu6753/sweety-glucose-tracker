import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, ArrowLeft, Info } from 'lucide-react';

export const LoginPage = ({ onNavigateToRegister, onNavigateToHome }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    const res = await login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setEmail('demo@sweety.com');
    setPassword('SweetyDemo2026!');
    setDemoLoading(true);
    const res = await login('demo@sweety.com', 'SweetyDemo2026!');
    setDemoLoading(false);
    if (!res.success) {
      setError(res.message || 'Demo login failed. Please verify credentials or register.');
    }
  };

  const handleForgotClick = () => {
    setForgotNotice(!forgotNotice);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation Back to Landing */}
      {onNavigateToHome && (
        <div className="absolute top-6 left-6">
          <button
            onClick={onNavigateToHome}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-pink flex items-center justify-center text-white shadow-xl shadow-brand-500/25">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Sweety
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Your daily health, one reading at a time.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-soft-lg rounded-3xl border border-purple-100 sm:px-10">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Welcome back</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage and review your blood glucose readings.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed">
              {error}
            </div>
          )}

          {forgotNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs leading-relaxed space-y-1">
              <p className="font-semibold flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-brand-600" />
                <span>Password Recovery Notice</span>
              </p>
              <p className="text-[11px] text-purple-700">
                Automated password reset requires an SMTP provider (e.g. SendGrid or Resend). In this environment, use your registered credentials or click the 1-click Demo Account below to access the application immediately.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. demo@sweety.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all bg-white"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotClick}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-100" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-3 text-slate-400 font-semibold">Or evaluate with</span>
            </div>
          </div>

          {/* Instant 1-Click Demo Button */}
          <button
            type="button"
            disabled={loading || demoLoading}
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 disabled:opacity-50 border border-brand-200 hover:border-brand-300 transition-all cursor-pointer shadow-sm"
          >
            {demoLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Demo Account...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>⚡ Try Demo Account (1-Click)</span>
              </>
            )}
          </button>

          {/* Registration Redirect Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
