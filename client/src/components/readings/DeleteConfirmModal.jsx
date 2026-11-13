import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, reading, deleting }) => {
  if (!reading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Reading">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-sm">
            Are you sure you want to delete this glucose reading? This action cannot be undone.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl text-sm space-y-1.5 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Date:</span>
            <span className="font-medium">{reading.reading_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Time Slot:</span>
            <span className="font-medium">{reading.time_slot_label || reading.time_slot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Glucose Value:</span>
            <span className="font-bold text-slate-900">{reading.glucose_value} mg/dL</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
          >
            {deleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
