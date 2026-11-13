import React from 'react';

export const StatCard = ({ title, value, unit = 'mg/dL', icon: Icon, color = 'brand', subtitle }) => {
  const colorMap = {
    brand: {
      bg: 'bg-brand-50',
      text: 'text-brand-600',
      border: 'border-brand-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    blue: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-100',
    },
  };

  const currentTheme = colorMap[color] || colorMap.brand;

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-soft hover:shadow-soft-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl ${currentTheme.bg} ${currentTheme.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline space-x-1.5">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value !== null && value !== undefined ? value : '—'}
        </span>
        {value !== null && value !== undefined && unit && (
          <span className="text-xs font-medium text-slate-400">{unit}</span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};
