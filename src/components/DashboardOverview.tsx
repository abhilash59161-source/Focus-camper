import React from 'react';
import {
  Clock,
  Calendar,
  Flame,
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  FileText,
  BarChart2,
  CheckCircle2,
  Layers,
  Plus,
} from 'lucide-react';
import { StudentProfile, StudySession, Subject } from '../types';
import {
  calculateTodayStats,
  calculateCurrentWeekStats,
  calculateCurrentMonthStats,
  calculateSubjectBreakdown,
  calculateLast7DaysActivity,
  calculateStreak,
  formatMinutesToHoursMinutes,
} from '../utils/storage';

interface DashboardOverviewProps {
  sessions: StudySession[];
  profile: StudentProfile;
  subjects: Subject[];
  onOpenLogModal: () => void;
  onOpenReportModal: () => void;
  onOpenSubjectManager: () => void;
  onStartTimerWithSubject: (subjectId: string) => void;
  onTabChange: (tab: 'dashboard' | 'timer' | 'sessions' | 'report') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sessions,
  profile,
  subjects,
  onOpenLogModal,
  onOpenReportModal,
  onOpenSubjectManager,
  onStartTimerWithSubject,
  onTabChange,
}) => {
  const todayStats = calculateTodayStats(sessions, profile.dailyGoalMinutes);
  const weekStats = calculateCurrentWeekStats(sessions);
  const monthStats = calculateCurrentMonthStats(sessions);
  const subjectBreakdown = calculateSubjectBreakdown(sessions, subjects);
  const last7Days = calculateLast7DaysActivity(sessions, profile.dailyGoalMinutes);
  const currentStreak = calculateStreak(sessions);

  // Maximum value for weekly chart normalization
  const maxDayMinutes = Math.max(...last7Days.map((d) => d.minutes), profile.dailyGoalMinutes, 120);

  return (
    <div className="space-y-6">
      {/* 1. PROMINENT DASHBOARD WIDGET: Total Study Time for Current Week and Month */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-600/10 via-blue-600/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Student Welcome & Identity Lockup */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1.5">
              <span>{profile.institution}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">Roll: {profile.studentId}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-300">{profile.major}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Namaste, {profile.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              All study plans initialized at zero. Create your semester subjects, track focused Pomodoros, and build academic consistency.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenSubjectManager}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Subjects & Branches</span>
            </button>
            <button
              onClick={() => onTabChange('timer')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Launch Focus Timer</span>
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Weekly Report</span>
            </button>
          </div>
        </div>

        {/* The Two Prominent Cumulative Metric Blocks: Current Week & Current Month */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7 pt-6 border-t border-slate-800/80">
          {/* Prominent Current Week Study Time */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-blue-300">Current Week</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                {weekStats.totalHours}
              </span>
              <span className="text-sm font-medium text-slate-400">hours</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{weekStats.totalMinutes} total minutes</span>
              <span className="text-emerald-400 font-medium">{weekStats.activeDaysCount}/7 active days</span>
            </div>
          </div>

          {/* Prominent Current Month Study Time */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-emerald-300">
                Current Month ({monthStats.monthName.split(' ')[0]})
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                {monthStats.totalHours}
              </span>
              <span className="text-sm font-medium text-slate-400">hours</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{monthStats.totalMinutes} total minutes</span>
              <span className="text-blue-300 font-medium">{monthStats.sessionsCount} sessions</span>
            </div>
          </div>

          {/* Daily Goal Status Widget */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-amber-300">Today's Focus</span>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                {todayStats.totalHoursFormatted}
              </span>
              <span className="text-sm font-medium text-slate-400">/ {Math.round(profile.dailyGoalMinutes / 60)}h target</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{todayStats.totalMinutes} min logged</span>
              <span className={todayStats.goalReached ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
                {todayStats.percentageGoal}% achieved
              </span>
            </div>
          </div>

          {/* Active Study Streak */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-rose-300">Study Streak</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                {currentStreak}
              </span>
              <span className="text-sm font-medium text-slate-400">consecutive days</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>Habit Consistency</span>
              <span className={currentStreak > 0 ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                {currentStreak > 0 ? 'Active' : 'Starts today'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DAILY GOAL PROGRESS BAR SECTION */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Today's Daily Goal Progress</h3>
                {todayStats.goalReached && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Milestone Met!
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">
                Target: {Math.round(profile.dailyGoalMinutes / 60)} hours ({profile.dailyGoalMinutes} min) per day · Branch: {profile.major}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
                {todayStats.percentageGoal}%
              </span>
              <span className="text-xs text-slate-400 block">of daily goal</span>
            </div>
            <button
              onClick={onOpenLogModal}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              + Log Today
            </button>
          </div>
        </div>

        {/* The Animated Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              todayStats.percentageGoal >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, todayStats.percentageGoal))}%` }}
          />
        </div>

        {/* Goal Context Footnote */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>{todayStats.totalMinutes} minutes studied today across {todayStats.sessionsCount} session(s)</span>
          {todayStats.goalReached ? (
            <span className="text-emerald-600 font-semibold">
              Great job! You reached today's target.
            </span>
          ) : (
            <span>{todayStats.remainingMinutes} minutes remaining to reach daily milestone</span>
          )}
        </div>
      </div>

      {/* 3. TWO COLUMN METRIC SPLIT: 7-Day Velocity Chart & Subject Color Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Activity Velocity Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">7-Day Study Cadence</h3>
              <span className="text-xs text-slate-500">Daily logged minutes vs daily goal threshold</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" /> Studied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400" /> Daily Goal ({Math.round(profile.dailyGoalMinutes / 60)}h)
              </span>
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1 border-b border-slate-100">
            {last7Days.map((day) => {
              const heightPct = Math.min(100, Math.round((day.minutes / maxDayMinutes) * 100));
              const goalPct = Math.min(100, Math.round((profile.dailyGoalMinutes / maxDayMinutes) * 100));

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                    {day.dayName}: {day.minutes} min ({formatMinutesToHoursMinutes(day.minutes)})
                  </div>

                  {/* Goal Reference Line Marker */}
                  <div
                    className="absolute w-full border-t border-dashed border-amber-300 pointer-events-none opacity-40 z-10"
                    style={{ bottom: `${goalPct}%` }}
                  />

                  {/* Bar */}
                  <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        day.isToday
                          ? day.minutes >= profile.dailyGoalMinutes
                            ? 'bg-emerald-500'
                            : 'bg-blue-600'
                          : day.minutes >= profile.dailyGoalMinutes
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ height: `${Math.max(day.minutes > 0 ? 8 : 0, heightPct)}%` }}
                    />
                  </div>

                  {/* Labels */}
                  <span
                    className={`text-[11px] font-medium mt-2 ${
                      day.isToday ? 'text-blue-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-slate-400">
                    {day.minutes > 0 ? `${day.minutes}m` : '-'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>All plans zero first. Log your first study session to see your 7-day velocity chart build up.</span>
            <span className="font-semibold text-slate-700">7-Day Total: {weekStats.totalHours} hrs</span>
          </div>
        </div>

        {/* Subject Categorization & Visual Color Distribution */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Branch & Subjects</h3>
                <span className="text-xs text-slate-500">Your created academic courses</span>
              </div>
              <button
                type="button"
                onClick={onOpenSubjectManager}
                className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Manage</span>
              </button>
            </div>

            {/* Visual Subject Stack Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden my-4 border border-slate-200/60">
              {subjectBreakdown.length === 0 ? (
                <div className="w-full h-full bg-slate-200" title="Zero sessions logged" />
              ) : (
                subjectBreakdown.map((item) => (
                  <div
                    key={item.subjectId}
                    title={`${item.subjectName}: ${item.percentage}%`}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.colorHex,
                    }}
                    className="h-full transition-all"
                  />
                ))
              )}
            </div>

            {/* Subject List with Distinct Colors & Branch */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {subjects.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 space-y-2">
                  <p>No subjects created yet for your branch.</p>
                  <button
                    onClick={onOpenSubjectManager}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                  >
                    + Create Your First Subject & Branch
                  </button>
                </div>
              ) : (
                subjects.map((sub) => {
                  const loggedStats = subjectBreakdown.find((b) => b.subjectId === sub.id);
                  const hoursFormatted = loggedStats?.hoursFormatted || '0.0';
                  const percentage = loggedStats?.percentage || 0;

                  return (
                    <div
                      key={sub.id}
                      className="p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs border border-slate-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: sub.hex }}
                          />
                          <div className="truncate">
                            <span className="font-semibold text-slate-800 truncate block">
                              {sub.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {sub.branch}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono tabular-nums text-slate-900 font-semibold">
                            {hoursFormatted}h
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-slate-400 w-7 text-right">
                            {percentage}%
                          </span>
                          <button
                            onClick={() => {
                              onStartTimerWithSubject(sub.id);
                              onTabChange('timer');
                            }}
                            title={`Start Pomodoro for ${sub.name}`}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold p-1 hover:bg-blue-50 rounded cursor-pointer"
                          >
                            Focus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Active Subjects:</span>
            <span className="font-semibold text-slate-900">{subjects.length} courses registered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

