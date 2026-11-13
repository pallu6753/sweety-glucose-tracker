import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReadingsPage } from './pages/ReadingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { Activity } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'readings' | 'reports'

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

  // Unauthenticated view
  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateToRegister={() => setAuthView('register')} />;
  }

  // Authenticated view
  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToReadings={() => setActiveTab('readings')}
            onNavigateToReports={() => setActiveTab('reports')}
          />
        )}
        {activeTab === 'readings' && <ReadingsPage />}
        {activeTab === 'reports' && <ReportsPage />}
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
