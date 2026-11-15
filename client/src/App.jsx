import React, { useState, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Activity } from 'lucide-react';

// Code-split pages via React.lazy dynamic imports
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ReadingsPage = lazy(() => import('./pages/ReadingsPage').then(m => ({ default: m.ReadingsPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-pink flex items-center justify-center text-white shadow-md animate-pulse">
      <Activity className="w-4 h-4" />
    </div>
    <p className="text-xs font-medium text-slate-400">Loading view...</p>
  </div>
);

const AppContent = () => {
  const { user, loading, login } = useAuth();
  const [publicView, setPublicView] = useState('landing'); // 'landing' | 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'readings' | 'reports'

  const handleTryDemo = async () => {
    try {
      const res = await login('demo@sweety.com', 'SweetyDemo2026!');
      if (!res?.success) {
        setPublicView('login');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setPublicView('login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-pink flex items-center justify-center text-white shadow-xl animate-pulse">
          <Activity className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-500">Loading Sweety Glucose Tracker...</p>
      </div>
    );
  }

  // Unauthenticated view: Public Landing Page, Login, or Register
  if (!user) {
    return (
      <Suspense fallback={<PageLoader />}>
        {publicView === 'landing' && (
          <LandingPage
            onGetStarted={() => setPublicView('register')}
            onSignIn={() => setPublicView('login')}
            onTryDemo={handleTryDemo}
            onExploreDashboard={handleTryDemo}
          />
        )}
        {publicView === 'register' && (
          <RegisterPage
            onNavigateToLogin={() => setPublicView('login')}
            onNavigateToHome={() => setPublicView('landing')}
            onTryDemo={handleTryDemo}
          />
        )}
        {publicView === 'login' && (
          <LoginPage
            onNavigateToRegister={() => setPublicView('register')}
            onNavigateToHome={() => setPublicView('landing')}
          />
        )}
      </Suspense>
    );
  }

  // Authenticated view
  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigateToReadings={() => setActiveTab('readings')}
              onNavigateToReports={() => setActiveTab('reports')}
            />
          )}
          {activeTab === 'readings' && <ReadingsPage />}
          {activeTab === 'reports' && <ReportsPage />}
        </Suspense>
      </main>

      <footer className="border-t border-purple-50 bg-white/50 py-6 text-center text-xs text-slate-400">
        Sweety Blood Glucose Tracker &copy; 2026 Kenpath. Built for precision daily health monitoring.
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
