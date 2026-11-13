import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { getTodayDateString, TIME_SLOT_LABELS } from '../utils/constants';
import { Calendar, TrendingUp, ArrowUp, ArrowDown, Activity, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ReportsPage = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [activeReportTab, setActiveReportTab] = useState('daily'); // 'daily' | 'month-to-date' | 'monthly'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (activeReportTab === 'daily') {
        res = await api.getDailyReport(selectedDate);
      } else if (activeReportTab === 'month-to-date') {
        res = await api.getMonthToDateReport(selectedDate);
      } else if (activeReportTab === 'monthly') {
        res = await api.getMonthlyReport(selectedDate);
      }

      if (res && res.success) {
        setReportData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedDate, activeReportTab]);

  const stats = reportData?.statistics || { highest: null, lowest: null, average: null, count: 0 };
  const period = reportData?.period || { start: selectedDate, end: selectedDate };
  const hasData = stats.count > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Health & Glucose Reports</h1>
          <p className="text-sm text-slate-500">
            Comprehensive statistical summaries for daily, month-to-date, and full monthly periods
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-semibold uppercase text-slate-400">Reference Date:</span>
          <input
            type="date"
            max={getTodayDateString()}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex p-1 bg-slate-100/80 rounded-2xl max-w-lg">
        <button
          onClick={() => setActiveReportTab('daily')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeReportTab === 'daily'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Daily Report
        </button>
        <button
          onClick={() => setActiveReportTab('month-to-date')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeReportTab === 'month-to-date'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Month-to-Date
        </button>
        <button
          onClick={() => setActiveReportTab('monthly')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeReportTab === 'monthly'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Previous Month
        </button>
      </div>

      {/* Period Description Banner */}
      <div className="bg-purple-50/50 border border-purple-100 rounded-2xl px-5 py-3 flex items-center justify-between text-xs text-purple-900">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-brand-600" />
          <span>
            <strong>Report Period:</strong> {period.start} {period.start !== period.end && `through ${period.end}`} (Inclusive)
          </span>
        </div>
        <span className="font-semibold text-brand-700">
          {activeReportTab === 'daily' && 'Selected Calendar Day'}
          {activeReportTab === 'month-to-date' && '1st of Month to Date'}
          {activeReportTab === 'monthly' && 'Full Previous Calendar Month'}
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Glucose"
          value={stats.average}
          icon={TrendingUp}
          color="brand"
          subtitle={hasData ? 'Rounded to 1 decimal place' : 'No data in period'}
        />
        <StatCard
          title="Highest Reading"
          value={stats.highest}
          icon={ArrowUp}
          color="rose"
          subtitle={hasData ? 'Peak measured level' : '—'}
        />
        <StatCard
          title="Lowest Reading"
          value={stats.lowest}
          icon={ArrowDown}
          color="emerald"
          subtitle={hasData ? 'Lowest measured level' : '—'}
        />
        <StatCard
          title="Total Readings"
          value={stats.count}
          unit="readings"
          icon={Activity}
          color="blue"
          subtitle={hasData ? 'Sample size recorded' : 'Zero readings'}
        />
      </div>

      {/* Daily Report Breakdown (if daily report selected) */}
      {activeReportTab === 'daily' && (
        <div className="bg-white rounded-3xl border border-purple-50 shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Daily Readings Breakdown</h3>
            <p className="text-xs text-slate-500">Ordered chronologically by standard daily mealtime slots</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">Loading daily details...</div>
          ) : !hasData || !reportData?.readings?.length ? (
            <div className="py-12 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-brand-400 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">No readings recorded for {selectedDate}</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No blood glucose measurements were logged on this date.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Time Slot</th>
                    <th className="px-6 py-3.5">Glucose Value</th>
                    <th className="px-6 py-3.5">Recorded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.readings.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                          {r.time_slot_label || TIME_SLOT_LABELS[r.time_slot] || r.time_slot}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-slate-900">{r.glucose_value}</span>
                        <span className="text-xs text-slate-400 ml-1">mg/dL</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Aggregated Period Empty State (for month-to-date and monthly when empty) */}
      {activeReportTab !== 'daily' && !hasData && !loading && (
        <div className="bg-white rounded-3xl border border-purple-50 shadow-soft py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-brand-400 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-800">
            No readings found for {period.start} to {period.end}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are no glucose readings stored for this period. As you record daily readings, statistical trends will automatically appear here.
          </p>
        </div>
      )}

      {/* Bonus Visualization Chart when data is available in daily breakdown */}
      {activeReportTab === 'daily' && hasData && reportData?.readings?.length > 0 && (
        <div className="bg-white rounded-3xl border border-purple-50 p-6 shadow-soft">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Daily Glucose Profile</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData.readings.map((r) => ({
                  name: r.time_slot_label || r.time_slot,
                  value: r.glucose_value,
                }))}
                margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 200]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val} mg/dL`, 'Glucose Level']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #ede9fe', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
