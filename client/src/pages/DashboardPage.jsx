import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { SlotCompletionIndicator } from '../components/readings/SlotCompletionIndicator';
import { ReadingFormModal } from '../components/readings/ReadingFormModal';
import { DeleteConfirmModal } from '../components/readings/DeleteConfirmModal';
import { getTodayDateString, TIME_SLOT_LABELS } from '../utils/constants';
import { Plus, TrendingUp, ArrowDown, ArrowUp, Activity, Calendar, Edit2, Trash2, BarChart2, History, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage = ({ onNavigateToReadings, onNavigateToReports }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [readings, setReadings] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [deletingReading, setDeletingReading] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch daily readings and daily report in parallel
      const [readingsRes, reportRes] = await Promise.all([
        api.getReadings(selectedDate),
        api.getDailyReport(selectedDate),
      ]);

      if (readingsRes.success) {
        setReadings(readingsRes.data || []);
      }
      if (reportRes.success) {
        setReport(reportRes.data || null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const handleSaveReading = async (readingData) => {
    if (editingReading?.id) {
      await api.updateReading(editingReading.id, readingData);
    } else {
      await api.createReading(readingData);
    }
    await fetchDashboardData();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReading) return;
    try {
      setIsDeleting(true);
      await api.deleteReading(deletingReading.id);
      setDeletingReading(null);
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete reading');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenAddModal = (presetSlot = null) => {
    setEditingReading(presetSlot ? { reading_date: selectedDate, time_slot: presetSlot } : { reading_date: selectedDate });
    setIsFormOpen(true);
  };

  const handleEdit = (reading) => {
    setEditingReading(reading);
    setIsFormOpen(true);
  };

  const stats = report?.statistics || { highest: null, lowest: null, average: null, count: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm mb-2">
            Healthcare Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p className="mt-1 text-sm text-purple-100 max-w-xl">
            Monitor your glucose metrics and maintain balanced health. Every measurement counts.
          </p>
        </div>

        {/* Date Selector & Add Reading Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
            <Calendar className="w-4 h-4 text-purple-200" />
            <input
              type="date"
              max={getTodayDateString()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white text-brand-700 hover:bg-purple-50 font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Log Reading</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Average"
          value={stats.average}
          icon={TrendingUp}
          color="brand"
          subtitle={stats.count > 0 ? 'Rounded to 1 decimal' : 'No readings yet'}
        />
        <StatCard
          title="Highest Reading"
          value={stats.highest}
          icon={ArrowUp}
          color="rose"
          subtitle={stats.highest ? 'Peak glucose level' : '—'}
        />
        <StatCard
          title="Lowest Reading"
          value={stats.lowest}
          icon={ArrowDown}
          color="emerald"
          subtitle={stats.lowest ? 'Minimum glucose level' : '—'}
        />
        <StatCard
          title="Total Readings"
          value={stats.count}
          unit="/ 4 slots"
          icon={Activity}
          color="blue"
          subtitle={stats.count === 4 ? 'All slots completed' : `${4 - stats.count} slots remaining`}
        />
      </div>

      {/* 4-Slot Visual Progress Indicator */}
      <SlotCompletionIndicator
        readings={readings}
        onSlotClick={(slotId, existing) => {
          if (existing) {
            handleEdit(existing);
          } else {
            handleOpenAddModal(slotId);
          }
        }}
      />

      {/* Quick Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-purple-50 shadow-soft">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Quick Actions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reading</span>
          </button>
          <button
            onClick={onNavigateToReports}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-brand-700 border border-slate-200 transition-colors cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-brand-600" />
            <span>View Reports</span>
          </button>
          <button
            onClick={onNavigateToReadings}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-brand-700 border border-slate-200 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-brand-600" />
            <span>Reading History</span>
          </button>
        </div>
      </div>

      {/* Daily Glucose Progression Chart */}
      {readings.length > 0 && (
        <div className="bg-white rounded-3xl border border-purple-50 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Glucose Curve</h3>
              <p className="text-xs text-slate-500">Visual glucose values across daily mealtime slots</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
              Target: 70–140 mg/dL
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={readings.map((r) => ({
                  slot: r.time_slot_label || TIME_SLOT_LABELS[r.time_slot] || r.time_slot,
                  glucose: r.glucose_value,
                }))}
                margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="slot" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 200]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val} mg/dL`, 'Blood Glucose']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #ede9fe', fontSize: '12px' }}
                />
                <Bar dataKey="glucose" fill="#8b5cf6" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Today's Readings Detailed Table */}
      <div className="bg-white rounded-3xl border border-purple-50 shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Readings for {selectedDate}</h2>
            <p className="text-xs text-slate-500">Ordered by standard mealtime schedule</p>
          </div>
          <button
            onClick={onNavigateToReadings}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
          >
            View Full History →
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">Loading daily readings...</div>
        ) : readings.length === 0 ? (
          <div className="py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-brand-400 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No readings logged for this date</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start monitoring today's health by recording your fasting or post-meal glucose level.
            </p>
            <button
              onClick={() => handleOpenAddModal()}
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Reading</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Time Slot</th>
                  <th className="px-6 py-3.5">Glucose Level</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {readings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                        {r.time_slot_label || TIME_SLOT_LABELS[r.time_slot] || r.time_slot}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-slate-900">{r.glucose_value}</span>
                      <span className="text-xs text-slate-400 ml-1">mg/dL</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(r)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit reading"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingReading(r)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete reading"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReadingFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReading(null);
        }}
        onSubmit={handleSaveReading}
        initialData={editingReading}
        existingReadings={readings}
      />

      <DeleteConfirmModal
        isOpen={!!deletingReading}
        onClose={() => setDeletingReading(null)}
        onConfirm={handleDeleteConfirm}
        reading={deletingReading}
        deleting={isDeleting}
      />
    </div>
  );
};
