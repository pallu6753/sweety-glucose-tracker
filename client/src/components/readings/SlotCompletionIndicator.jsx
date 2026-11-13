import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { TIME_SLOTS } from '../../utils/constants';

export const SlotCompletionIndicator = ({ readings = [], onSlotClick }) => {
  const readingsMap = {};
  readings.forEach((r) => {
    readingsMap[r.time_slot] = r;
  });

  const completedCount = Object.keys(readingsMap).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-50 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Daily Slots Progress</h3>
          <p className="text-xs text-slate-500">Track all 4 daily blood glucose time slots</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
          {completedCount} of 4 Recorded
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TIME_SLOTS.map((slot) => {
          const reading = readingsMap[slot.id];
          const isDone = !!reading;

          return (
            <div
              key={slot.id}
              onClick={() => onSlotClick && onSlotClick(slot.id, reading)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-gradient-to-br from-brand-50/50 to-purple-50/20 border-brand-200 hover:border-brand-300'
                  : 'bg-slate-50/50 border-dashed border-slate-200 hover:border-brand-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">{slot.label}</span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                {isDone ? (
                  <div>
                    <span className="text-xl font-bold text-slate-900">{reading.glucose_value}</span>
                    <span className="text-[11px] text-slate-500 ml-1">mg/dL</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">+ Add reading</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
