import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  ArrowUpDown,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { StudySession, Subject } from '../types';
import { formatDateDisplay } from '../utils/storage';

interface SessionsTableProps {
  sessions: StudySession[];
  subjects: Subject[];
  onEdit: (session: StudySession) => void;
  onDelete: (sessionId: string) => void;
  onAddSessionClick: () => void;
  onBackToDashboard?: () => void;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  subjects,
  onEdit,
  onDelete,
  onAddSessionClick,
  onBackToDashboard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortField, setSortField] = useState<'date' | 'duration' | 'subject'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    subjects.forEach((s) => s.branch && set.add(s.branch));
    sessions.forEach((s) => s.subjectBranch && set.add(s.subjectBranch));
    return Array.from(set);
  }, [subjects, sessions]);

  const subjectMap = useMemo(() => {
    const map = new Map<string, Subject>();
    subjects.forEach((s) => map.set(s.id, s));
    return map;
  }, [subjects]);

  // Current date markers
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Week start (Monday)
  const currentDay = now.getDay();
  const distToMon = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distToMon);
  const weekStartStr = monday.toISOString().split('T')[0];

  // Month start
  const monthStartStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  // Filtered & Sorted Sessions
  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTopic = session.topic.toLowerCase().includes(q);
          const matchNotes = session.notes?.toLowerCase().includes(q) || false;
          const matchSub = session.subjectName.toLowerCase().includes(q);
          if (!matchTopic && !matchNotes && !matchSub) return false;
        }

        // Branch filter
        if (selectedBranch !== 'all') {
          const sub = subjectMap.get(session.subjectId);
          const branch = session.subjectBranch || sub?.branch;
          if (branch !== selectedBranch) return false;
        }

        // Subject filter
        if (selectedSubjectId !== 'all' && session.subjectId !== selectedSubjectId) {
          return false;
        }

        // Date range filter
        if (dateFilter === 'today') {
          return session.date === todayStr;
        }
        if (dateFilter === 'week') {
          return session.date >= weekStartStr && session.date <= todayStr;
        }
        if (dateFilter === 'month') {
          return session.date >= monthStartStr && session.date <= todayStr;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'date') {
          cmp = a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
        } else if (sortField === 'duration') {
          cmp = a.durationMinutes - b.durationMinutes;
        } else if (sortField === 'subject') {
          cmp = a.subjectName.localeCompare(b.subjectName);
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [sessions, searchQuery, selectedSubjectId, dateFilter, sortField, sortAsc, todayStr, weekStartStr, monthStartStr]);

  const toggleSort = (field: 'date' | 'duration' | 'subject') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending (newest or highest first)
    }
  };

  const techniqueLabels: Record<string, string> = {
    pomodoro: 'Pomodoro',
    deep_work: 'Deep Work',
    revision: 'Revision',
    practice_problems: 'Problems',
    reading: 'Reading',
    group_prep: 'Group',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Control Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Academic Study Sessions</h2>
            <span className="text-xs text-slate-500">
              {filteredSessions.length} {filteredSessions.length === 1 ? 'entry' : 'entries'} recorded
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or notes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Branch Filter Dropdown */}
          {availableBranches.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-slate-700 text-xs font-medium focus:outline-hidden cursor-pointer max-w-[140px] truncate"
              >
                <option value="all">All Branches</option>
                {availableBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-transparent text-slate-700 text-xs font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
            {(['all', 'today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateFilter(range)}
                className={`px-2.5 py-1 font-medium rounded-lg capitalize transition-colors ${
                  dateFilter === range
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === 'all' ? 'All Time' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'Today'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th
                onClick={() => toggleSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('subject')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Subject</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Topic & Key Takeaways</th>
              <th className="py-3 px-4">Technique</th>
              <th
                onClick={() => toggleSort('duration')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Duration</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <BookOpen className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <p className="text-sm font-medium text-slate-600">No study sessions found</p>
                    <p className="text-xs text-slate-400">
                      {searchQuery || selectedSubjectId !== 'all' || dateFilter !== 'all'
                        ? 'Try clearing the search or changing the filter range.'
                        : 'Start by recording your first focus session.'}
                    </p>
                    <button
                      onClick={onAddSessionClick}
                      className="mt-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                    >
                      + Add Session Now
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => {
                const sub = subjectMap.get(session.subjectId) || {
                  name: session.subjectName,
                  colorName: 'Slate',
                  bgLight: 'bg-slate-50',
                  textDark: 'text-slate-700',
                  borderLight: 'border-slate-200',
                  badgeBg: 'bg-slate-100',
                  badgeText: 'text-slate-800',
                  hex: '#64748b',
                };

                const hours = Math.floor(session.durationMinutes / 60);
                const mins = session.durationMinutes % 60;
                const formattedDuration =
                  hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm' : ''}` : `${mins}m`;

                return (
                  <tr
                    key={session.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono tabular-nums">{formatDateDisplay(session.date)}</span>
                      </div>
                    </td>

                    {/* Subject Categorization with Colors & Branch */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sub.hex }}
                        />
                        <div>
                          <span className={`font-semibold ${sub.textDark} block leading-tight`}>
                            {session.subjectName}
                          </span>
                          {(session.subjectBranch || (sub as Subject).branch) && (
                            <span className="text-[10px] text-slate-400 block font-normal leading-tight">
                              {session.subjectBranch || (sub as Subject).branch}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Topic & Notes */}
                    <td className="py-3 px-4 max-w-xs md:max-w-md">
                      <div className="font-medium text-slate-900 truncate">
                        {session.topic}
                      </div>
                      {session.notes && (
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {session.notes}
                        </div>
                      )}
                    </td>

                    {/* Technique */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {techniqueLabels[session.technique] || session.technique}
                      </span>
                    </td>

                    {/* Duration in Minutes & Hours (tabular) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="font-mono tabular-nums font-bold text-slate-900">
                        {session.durationMinutes} <span className="font-normal text-slate-500 font-sans text-[11px]">min</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {formattedDuration}
                      </div>
                    </td>

                    {/* Edit & Delete Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {deleteConfirmId === session.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              onDelete(session.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEdit(session)}
                            title="Edit study entry"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(session.id)}
                            title="Delete study entry"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
