import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Clock,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Heart,
  BarChart3,
  Layers,
  Lock,
  Menu,
  X,
  Eye,
  Sliders,
  Database,
  UserCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LandingPage = ({ onGetStarted, onSignIn, onTryDemo, onExploreDashboard }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState('today'); // 'today' | 'month-to-date' | 'monthly'

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleExplore = () => {
    if (onExploreDashboard) {
      onExploreDashboard();
    } else if (onTryDemo) {
      onTryDemo();
    } else {
      onGetStarted();
    }
  };

  // Sample data strictly marked as illustrative for the interactive preview
  const todayPreviewData = [
    { slot: 'Morning (fasting)', value: 88, status: 'Fasting Target', fill: '#10b981' },
    { slot: 'After Breakfast', value: 107, status: 'Normal Post-Meal', fill: '#8b5cf6' },
    { slot: 'After Lunch', value: 142, status: 'Peak Recorded', fill: '#f43f5e' },
    { slot: 'After Dinner', value: 115, status: 'Evening Normal', fill: '#8b5cf6' },
  ];

  const mtdPreviewData = [
    { slot: 'Nov 01', value: 112 },
    { slot: 'Nov 03', value: 108 },
    { slot: 'Nov 06', value: 118 },
    { slot: 'Nov 09', value: 104 },
    { slot: 'Nov 12', value: 115 },
    { slot: 'Nov 15', value: 113 },
  ];

  const faqs = [
    {
      q: 'How do I create a Sweety account?',
      a: 'Click "Get Started" anywhere on this page, enter your name, email address, and a secure password (minimum 8 characters with letters and numbers). Your account is created instantly without any waiting period.',
    },
    {
      q: 'What are the 4 designated daily reading slots?',
      a: 'Sweety structures your tracking around four standard clinical mealtime markers: Morning (fasting), After breakfast, After lunch, and After dinner. This provides consistent, comparable daily metrics.',
    },
    {
      q: 'What validation rules apply when entering readings?',
      a: 'Readings must be whole integers between 40 and 600 mg/dL. Sweety enforces that readings cannot have future dates, duplicate slots for the same calendar date are prevented, and a maximum of 4 readings can be logged per day.',
    },
    {
      q: 'How do reports and statistics work?',
      a: 'Sweety automatically calculates your daily average (rounded to 1 decimal place), daily peak (highest), and minimum (lowest) glucose values. You can also view comprehensive Month-to-Date trends and previous full-calendar-month reports.',
    },
    {
      q: 'How is my private health data protected?',
      a: 'All passwords are cryptographically hashed using salted bcrypt. Database connections and authentication sessions use secure HttpOnly cookies, parameterized SQL queries protect against injection, and strict user data isolation ensures only you can access your readings.',
    },
  ];

  const features = [
    {
      icon: Activity,
      title: 'Smart Glucose Tracking',
      desc: 'Simple glucose tracking across four standard daily mealtime slots with instant boundary validation [40–600 mg/dL].',
      badge: '4 Daily Slots',
      gradient: 'from-purple-500/10 to-indigo-500/10 text-brand-700',
    },
    {
      icon: Clock,
      title: 'Daily Reading History',
      desc: 'Daily health insights and complete historical timeline. Filter entries by date, and safely edit or delete past readings.',
      badge: 'Full History',
      gradient: 'from-amber-500/10 to-orange-500/10 text-amber-700',
    },
    {
      icon: BarChart3,
      title: 'Visual Health Reports',
      desc: 'Analyze daily statistics alongside Month-to-Date trajectories and full previous calendar month summaries with automated charts.',
      badge: 'Trend Analytics',
      gradient: 'from-blue-500/10 to-cyan-500/10 text-blue-700',
    },
    {
      icon: TrendingUp,
      title: 'Simple Personal Analytics',
      desc: 'Understand your patterns through daily average (rounded to 1 decimal), lowest, and peak numbers without noisy clinical clutter.',
      badge: 'Zero Jargon',
      gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-700',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create your account',
      desc: 'Sign up in seconds with your name and email, or explore the pre-populated demo account with one click.',
      pill: 'Instant Setup',
    },
    {
      step: '02',
      title: 'Record your readings',
      desc: 'Log fasting or post-meal glucose in less than 15 seconds for morning, breakfast, lunch, and dinner.',
      pill: '< 15 Seconds',
    },
    {
      step: '03',
      title: 'Understand your patterns',
      desc: 'Inspect your daily averages, spot trends, and review multi-week reports with clean, trustworthy charts.',
      pill: 'Clear Trends',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800 flex flex-col selection:bg-purple-200">
      {/* 3. PREMIUM STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-purple-100/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-purple-600 to-accent-pink flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Sweety</span>
                <span className="text-[10px] uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/60 px-2 py-0.5 rounded-full font-bold">
                  Health
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Blood Glucose Tracker</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-brand-600 transition-colors">Dashboard Preview</a>
            <a href="#privacy" className="hover:text-brand-600 transition-colors">Trust &amp; Privacy</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={handleExplore}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 transition-all cursor-pointer shadow-sm"
              title="Open pre-populated demo account"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Explore Demo</span>
            </button>
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-brand-700 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={onSignIn}
              className="px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 rounded-lg cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-6 bg-white/95 border-b border-purple-100 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 pt-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                How It Works
              </a>
              <a
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                Dashboard Preview
              </a>
              <a
                href="#privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                Trust &amp; Privacy
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleExplore();
                }}
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Explore Live Demo</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 shadow-sm"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION — EXCEPTIONAL FIRST IMPRESSION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Organic background ambient glow shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-24 left-1/4 w-[480px] h-[480px] bg-purple-200/45 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-16 right-1/5 w-[420px] h-[420px] bg-rose-200/35 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute top-64 left-1/3 w-[360px] h-[360px] bg-amber-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Health-themed eyebrow badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 text-brand-700 text-xs font-bold tracking-wide shadow-sm">
              <Heart className="w-3.5 h-3.5 text-accent-pink fill-accent-pink" />
              <span>Your daily health, one reading at a time</span>
            </div>

            {/* Large headline with gradient words */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Take control of your health,{' '}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-accent-pink bg-clip-text text-transparent">
                one reading at a time.
              </span>
            </h1>

            {/* Supporting description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Track your daily blood glucose readings, understand your patterns and stay informed with simple, meaningful insights. Purpose-engineered for clarity, discipline, and personal peace of mind.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/35 transition-all cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleExplore}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl text-base font-bold text-brand-700 bg-white hover:bg-purple-50/70 border border-purple-200 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Explore Dashboard</span>
              </button>

              <button
                onClick={onSignIn}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <span>Sign In to your account</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-3 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>No credit card or hardware required</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Strict 4-Slot Daily Integrity</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Private &amp; User-Isolated</span>
              </span>
            </div>
          </div>

          {/* HERO DASHBOARD PREVIEW WITH FLOATING CARDS */}
          <div className="mt-14 sm:mt-20 max-w-5xl mx-auto relative">
            {/* Floating Metric Card 1: Top Right */}
            <div className="hidden md:flex items-center space-x-3 absolute -top-8 -right-6 z-20 bg-white/95 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-purple-100 shadow-soft-lg animate-float-slow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Average</p>
                <p className="text-base font-extrabold text-slate-900">112.3 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
                <span className="text-[10px] text-emerald-600 font-semibold">● In optimal range</span>
              </div>
            </div>

            {/* Floating Metric Card 2: Bottom Left */}
            <div className="hidden md:flex items-center space-x-3 absolute -bottom-8 -left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-purple-100 shadow-soft-lg animate-float-reverse">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Morning Fasting</p>
                <p className="text-base font-extrabold text-slate-900">88 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
                <span className="text-[10px] text-brand-600 font-semibold">✓ Slot verified</span>
              </div>
            </div>

            {/* Main Preview Container Frame */}
            <div className="relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-white/95 to-purple-50/70 border border-purple-200/80 shadow-2xl shadow-purple-500/15">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                {/* Simulated window header bar */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400 font-mono ml-2">sweety.app/dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                      Live Dashboard Simulation
                    </span>
                  </div>
                </div>

                {/* Dashboard Inner UI Preview */}
                <div className="p-5 sm:p-8 space-y-6 bg-[#faf8ff]">
                  {/* Simulated Patient Banner */}
                  <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                        Healthcare Dashboard
                      </span>
                      <h3 className="text-xl font-extrabold mt-1.5">Welcome back, Sarah Jenkins</h3>
                      <p className="text-xs text-purple-100 mt-0.5">
                        You have recorded 4 of 4 mealtime slots for today. Excellent consistency!
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-white/10 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/20 flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Today (Nov 15)</span>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-xl bg-white text-brand-700 text-xs font-bold shadow-sm">
                        + Log Reading
                      </span>
                    </div>
                  </div>

                  {/* 4 Stat Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-purple-100/70 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400">Daily Average</p>
                      <p className="text-2xl font-extrabold text-brand-700 mt-1">112.3 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
                      <p className="text-[10px] text-emerald-600 mt-1 font-semibold">● Optimal target zone</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-purple-100/70 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400">Highest Reading</p>
                      <p className="text-2xl font-extrabold text-rose-600 mt-1">142 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
                      <p className="text-[10px] text-slate-400 mt-1">Post-lunch peak</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-purple-100/70 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400">Lowest Reading</p>
                      <p className="text-2xl font-extrabold text-emerald-600 mt-1">88 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
                      <p className="text-[10px] text-slate-400 mt-1">Fasting morning</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-purple-100/70 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400">Daily Completion</p>
                      <p className="text-2xl font-extrabold text-blue-600 mt-1">4 <span className="text-xs font-normal text-slate-400">/ 4 slots</span></p>
                      <p className="text-[10px] text-brand-600 mt-1 font-semibold">✓ 100% Complete</p>
                    </div>
                  </div>

                  {/* 4 Mealtime Slots Showcase */}
                  <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        Today's Mealtime Schedule &amp; Readings
                      </h4>
                      <span className="text-xs text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full">
                        All 4 Slots Logged
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {todayPreviewData.map((slot, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                          <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                            <span>{slot.slot}</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <p className="text-xl font-extrabold text-emerald-950 mt-1.5">{slot.value} <span className="text-xs font-normal text-emerald-700">mg/dL</span></p>
                          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">{slot.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PRODUCT SHOWCASE SECTION */}
      <section id="preview" className="py-20 bg-white border-y border-purple-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3.5 py-1 rounded-full">
              Interactive Dashboard Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Experience the clarity of Sweety
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Test drive the real application views below. Toggle between daily tracking, month-to-date trajectories, and full monthly summaries.
            </p>
          </div>

          {/* Interactive Mode Selector Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/70 shadow-sm max-w-md w-full">
              <button
                onClick={() => setPreviewTab('today')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  previewTab === 'today'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Daily Schedule
              </button>
              <button
                onClick={() => setPreviewTab('month-to-date')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  previewTab === 'month-to-date'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Month-to-Date
              </button>
              <button
                onClick={() => setPreviewTab('monthly')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  previewTab === 'monthly'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Monthly Summary
              </button>
            </div>
          </div>

          {/* Interactive Chart & Stats Container */}
          <div className="max-w-5xl mx-auto bg-[#faf8ff] rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100/70 pb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {previewTab === 'today' && 'Daily Blood Glucose Curve'}
                  {previewTab === 'month-to-date' && 'Month-to-Date Glucose Trajectory'}
                  {previewTab === 'monthly' && 'Previous Calendar Month Statistical Review'}
                </h3>
                <p className="text-xs text-slate-500">
                  {previewTab === 'today' && 'Progression across today’s 4 clinical mealtime slots.'}
                  {previewTab === 'month-to-date' && 'Historical daily average values from 1st of the month to current date.'}
                  {previewTab === 'monthly' && 'Full 30-day aggregated report with period averages and extreme limits.'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Target Zone: 70–140 mg/dL
                </span>
              </div>
            </div>

            {/* Recharts Interactive Visualizer */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={previewTab === 'today' ? todayPreviewData : mtdPreviewData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede9fe" />
                  <XAxis dataKey="slot" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[0, 200]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val) => [`${val} mg/dL`, 'Blood Glucose']}
                    contentStyle={{ borderRadius: '14px', border: '1px solid #ddd6fe', fontSize: '12px' }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Illustrative Disclaimer Notice */}
            <div className="p-3.5 rounded-2xl bg-white border border-purple-100 flex items-center space-x-3 text-xs text-slate-500">
              <Eye className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>
                <strong>Illustrative Interactive Showcase:</strong> Demonstrates real application charting and statistical views. Your actual personal glucose entries remain completely private and isolated in your account.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3.5 py-1 rounded-full">
              Engineered For You
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything you need for daily glucose peace of mind
            </h2>
            <p className="text-slate-600 text-sm">
              No bloated complications, no subscription paywalls. Just clean, reliable glucose tracking you can depend on every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-white border border-purple-100 hover:border-brand-300 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 space-y-4 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${f.gradient} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      {f.badge}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 pt-1">{f.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-y border-purple-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3.5 py-1 rounded-full">
              Simple 3-Step Routine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How Sweety works</h2>
            <p className="text-slate-600 text-sm">
              Designed to take less than 15 seconds per entry so it seamlessly fits into your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {steps.map((s, i) => (
              <div
                key={i}
                className="bg-[#faf8ff] rounded-3xl p-8 border border-purple-100 shadow-sm relative space-y-4 hover:shadow-soft-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-extrabold text-brand-200 font-mono">{s.step}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                    {s.pill}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRUST AND PRIVACY SECTION */}
      <section id="privacy" className="py-20 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3.5 py-1 rounded-full">
                Security &amp; Patient Privacy
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Health technology built with clinical discipline and uncompromising privacy
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your medical numbers are deeply personal. Sweety is built on a strict zero-compromise security foundation with encrypted storage, user isolation, and zero advertising trackers.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-purple-100">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Secure Account Access</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Passwords hashed with salted bcrypt (10 rounds). Stateless JWT authentication stored in secure HttpOnly cookies.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-purple-100">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Personal Reading Privacy</h4>
                    <p className="text-xs text-slate-500 mt-0.5">User-specific isolation enforced on every PostgreSQL query via verified token payload. No cross-patient data exposure.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-purple-100">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Concurrency &amp; Integrity Locks</h4>
                    <p className="text-xs text-slate-500 mt-0.5">PostgreSQL advisory transaction locks prevent race conditions, stop duplicate slot collisions, and enforce the 4-reading limit.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Promise Card */}
            <div className="bg-gradient-to-br from-brand-50 via-purple-50 to-rose-50 rounded-3xl p-8 sm:p-10 border border-purple-100 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-pink flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/20">
                <Heart className="w-8 h-8 fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Privacy Commitment</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                We will never sell, lease, or monetize your blood glucose records. Sweety is ad-free and tracking-free. You have complete rights to view, modify, and delete your logs at any time.
              </p>
              <div className="pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-7 py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all cursor-pointer"
                >
                  Create Your Free Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ AND FINAL CTA SECTION */}
      <section id="faq" className="py-20 bg-white border-t border-purple-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3.5 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Common questions answered</h2>
            <p className="text-slate-600 text-sm">
              Everything you need to know about setting up and using Sweety.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#faf8ff] rounded-2xl border border-purple-100/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between font-bold text-slate-900 text-sm hover:text-brand-600 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-purple-100/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FINAL CALL TO ACTION BANNER */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white text-center space-y-6 shadow-xl shadow-brand-500/20">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Empower Your Health Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
              Start building a better understanding of your glucose patterns.
            </h2>
            <p className="text-sm text-purple-100 max-w-xl mx-auto">
              Join patients and health-conscious individuals who rely on Sweety for simple, calm daily tracking. Free forever for personal use.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-brand-700 bg-white hover:bg-purple-50 shadow-md transition-all cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
              >
                Explore Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-purple-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-pink flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-900">Sweety</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Your daily health, one reading at a time. A modern, secure, and intuitive blood glucose tracking platform for patients and families.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wider text-slate-800">Product</p>
              <ul className="space-y-1.5 text-slate-500 font-medium">
                <li><a href="#features" className="hover:text-brand-600 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a></li>
                <li><a href="#preview" className="hover:text-brand-600 transition-colors">Dashboard Preview</a></li>
                <li><a href="#privacy" className="hover:text-brand-600 transition-colors">Trust &amp; Privacy</a></li>
                <li><a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wider text-slate-800">Account</p>
              <ul className="space-y-1.5 text-slate-500 font-medium">
                <li>
                  <button onClick={onSignIn} className="hover:text-brand-600 text-left cursor-pointer">
                    Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onGetStarted} className="hover:text-brand-600 text-left cursor-pointer">
                    Create Account
                  </button>
                </li>
                <li>
                  <button onClick={handleExplore} className="hover:text-brand-600 text-left font-bold text-brand-600 cursor-pointer">
                    ⚡ Demo Account (1-Click)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-50 text-[11px] text-slate-400 space-y-3">
            <p className="leading-relaxed">
              <strong>Medical Disclaimer:</strong> Sweety is a personal tracking and self-monitoring application designed to log blood glucose readings. Sweety does not provide clinical diagnoses, medical advice, treatment plans, or emergency healthcare services. Always consult with a licensed physician, endocrinologist, or qualified healthcare professional regarding personal medical conditions or treatment decisions.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <p>&copy; 2026 Sweety Blood Glucose Tracker. Kenpath Full Stack Developer Assignment.</p>
              <div className="flex space-x-4">
                <span>Privacy &amp; Data Security</span>
                <span>Terms of Service</span>
                <span>Clinical Integrity</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
