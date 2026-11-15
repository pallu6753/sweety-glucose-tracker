import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ReadingFormModal } from '../components/readings/ReadingFormModal';
import { DeleteConfirmModal } from '../components/readings/DeleteConfirmModal';
import { TIME_SLOT_LABELS } from '../utils/constants';
import { Plus, Calendar, Edit2, Trash2, Filter, Activity } from 'lucide-react';

export const ReadingsPage = () => {
  const [readings, setReadings] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [deletingReading, setDeletingReading] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getReadings(filterDate || undefined);
      if (res.success) {
        setReadings(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load readings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [filterDate]);

  const handleSaveReading = async (readingData) => {
    if (editingReading?.id) {
      await api.updateReading(editingReading.id, readingData);
    } else {
      await api.createReading(readingData);
    }
    await fetchReadings();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReading) return;
    try {
      setIsDeleting(true);
      await api.deleteReading(deletingReading.id);
      setDeletingReading(null);
      await fetchReadings();
    } catch (err) {
      alert(err.message || 'Failed to delete reading');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Glucose History & Management</h1>
          <p className="text-sm text-slate-500">Record, update, and manage your full blood glucose entries</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter */}
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold ml-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Add Reading Button */}
          <button
            onClick={() => {
              setEditingReading(null);
              setIsFormOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reading</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Readings Table Card */}
      <div className="bg-white rounded-3xl border border-purple-50 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading readings...</div>
        ) : readings.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-brand-400 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              {filterDate ? `No readings found for ${filterDate}` : 'No readings recorded yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {filterDate
                ? 'Try selecting a different date or clearing the filter.'
                : 'Click "+ Add Reading" to record your first blood glucose value.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time Slot</th>
                  <th className="px-6 py-4">Glucose Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {readings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-brand-500" />
                        <span>{r.reading_date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                        {r.time_slot_label || TIME_SLOT_LABELS[r.time_slot] || r.time_slot}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-slate-900">{r.glucose_value}</span>
                      <span className="text-xs text-slate-400 ml-1">mg/dL</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingReading(r);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingReading(r)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete entry"
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
