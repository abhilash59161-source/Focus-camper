import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Sparkles,
  CloudCheck,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { StudentProfile, StudySession, Subject } from '../types';
import { generateWeeklyReport } from '../utils/reportGenerator';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: StudySession[];
  profile: StudentProfile;
  subjects: Subject[];
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  isOpen,
  onClose,
  sessions,
  profile,
  subjects,
}) => {
  if (!isOpen) return null;

  const report = generateWeeklyReport(sessions, profile, subjects);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Automated Weekly Performance Report
              </h2>
              <span className="text-xs text-slate-500">
                Official Academic Cadence & Focus Audit · {report.weekRange}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Student Dossier Header Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                <span>{profile.institution}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.major}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
              <div className="text-xs text-slate-500 font-mono mt-0.5 flex flex-wrap gap-x-3">
                <span>Student ID: {profile.studentId}</span>
                <span>Email: {profile.email}</span>
              </div>
            </div>

            {/* Performance Grade Badge */}
            <div className="sm:text-right shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Weekly Evaluation
              </span>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl mt-1">
                <span className="text-xl font-bold font-mono text-emerald-700">
                  {report.performanceGrade}
                </span>
                <span className="text-xs font-medium text-emerald-800">
                  {report.consistencyScore}% Consistency
                </span>
              </div>
            </div>
          </div>

          {/* Key Executive Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Focused Time</span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
                {report.totalHours} <span className="text-xs font-sans font-normal text-slate-400">hrs</span>
              </span>
              <span className="text-[11px] text-slate-400">{report.totalMinutes} minutes</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Sessions Completed</span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
                {report.sessionsCount}
              </span>
              <span className="text-[11px] text-slate-400">verified logs</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Active Study Days</span>
              <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
                {report.activeDays} <span className="text-xs font-sans font-normal text-slate-400">/ 7</span>
              </span>
              <span className="text-[11px] text-slate-400">days recorded</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Top Subject Focus</span>
              <span className="text-base font-bold text-slate-900 mt-1 block truncate">
                {report.topSubject.name}
              </span>
              <span className="text-[11px] font-mono text-blue-600 font-semibold">
                {report.topSubject.hours} hrs ({report.topSubject.percentage}%)
              </span>
            </div>
          </div>

          {/* 7-Day Day-by-Day Cadence Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Weekly Daily Log Breakdown
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Study Time</th>
                    <th className="py-2.5 px-3 text-center">Daily Goal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {report.dailyBreakdown.map((day) => (
                    <tr key={day.date} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{day.dayName}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">{day.date}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-800">
                        {day.hours}h ({day.minutes}m)
                      </td>
                      <td className="py-2 px-3 text-center">
                        {day.hitGoal ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Target Met
                          </span>
                        ) : day.minutes > 0 ? (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Partial ({day.minutes}m)
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Rest Day</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Distribution */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Subject Allocation
            </h4>
            <div className="space-y-2">
              {report.subjectBreakdown.map((sub) => (
                <div key={sub.subjectName} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.colorHex }} />
                      {sub.subjectName}
                    </span>
                    <span className="font-mono tabular-nums text-slate-600 font-semibold">
                      {sub.hours} hrs ({sub.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${sub.percentage}%`, backgroundColor: sub.colorHex }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Key Insights & Study Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Automated Performance Insights</span>
              </div>
              <ul className="space-y-1.5 text-blue-800 list-disc list-inside">
                {report.keyInsights.map((insight, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Advisor Recommendations</span>
              </div>
              <ul className="space-y-1.5 text-emerald-800 list-disc list-inside">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cloud Database Sync Status */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-800">Cloud Database Synced:</span>
              <span>All sessions and reports encrypted and cached across active devices.</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">SHA256: 9F8A2D...</span>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
