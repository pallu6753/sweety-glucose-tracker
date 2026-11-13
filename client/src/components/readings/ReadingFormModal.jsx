import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { TIME_SLOTS, TIME_SLOT_LABELS, VALIDATION_MESSAGES, getTodayDateString } from '../../utils/constants';

export const ReadingFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  existingReadings = [], // Used for frontend duplicate checks
}) => {
  const [readingDate, setReadingDate] = useState(getTodayDateString());
  const [timeSlot, setTimeSlot] = useState('morning');
  const [glucoseValue, setGlucoseValue] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setReadingDate(initialData.reading_date || getTodayDateString());
      setTimeSlot(initialData.time_slot || 'morning');
      setGlucoseValue(String(initialData.glucose_value || ''));
    } else {
      setReadingDate(getTodayDateString());
      setTimeSlot('morning');
      setGlucoseValue('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const validate = () => {
    // Rule 1: Value required
    if (glucoseValue === '' || glucoseValue === null || glucoseValue === undefined) {
      return VALIDATION_MESSAGES.REQUIRED_VALUE;
    }

    // Rule 2: Whole number between 40 and 600 mg/dL
    const isInteger = /^-?\d+$/.test(glucoseValue.trim());
    const val = Number(glucoseValue);
    if (!isInteger || isNaN(val) || val < 40 || val > 600) {
      return VALIDATION_MESSAGES.INVALID_RANGE;
    }

    // Rule 5: Date cannot be in the future
    const today = getTodayDateString();
    if (readingDate > today) {
      return VALIDATION_MESSAGES.FUTURE_DATE;
    }

    // Rule 3: Duplicate slot per user per date
    const isDuplicate = existingReadings.some(
      (r) =>
        r.reading_date === readingDate &&
        r.time_slot === timeSlot &&
        (!initialData || r.id !== initialData.id)
    );
    if (isDuplicate) {
      const slotLabel = TIME_SLOT_LABELS[timeSlot] || timeSlot;
      return VALIDATION_MESSAGES.DUPLICATE_SLOT(slotLabel);
    }

    // Rule 4: Maximum four readings per day
    if (!initialData) {
      const dayReadings = existingReadings.filter((r) => r.reading_date === readingDate);
      if (dayReadings.length >= 4) {
        return VALIDATION_MESSAGES.DAILY_LIMIT;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        reading_date: readingDate,
        time_slot: timeSlot,
        glucose_value: parseInt(glucoseValue, 10),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save reading');
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = !!initialData?.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Glucose Reading' : 'Log Blood Glucose Reading'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Date Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Reading Date
          </label>
          <input
            type="date"
            max={getTodayDateString()}
            value={readingDate}
            onChange={(e) => setReadingDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all bg-white"
            required
          />
        </div>

        {/* Time Slot Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Time Slot
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all bg-white"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        {/* Glucose Value Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Glucose Level (mg/dL)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 110"
              value={glucoseValue}
              onChange={(e) => setGlucoseValue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all bg-white pr-16"
              required
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400">
              mg/dL
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Whole number between 40 and 600 mg/dL
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Reading' : 'Save Reading'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
