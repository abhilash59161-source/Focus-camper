import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  BookOpen,
  Tag,
  PlusCircle,
  Check,
  ArrowLeft,
  ArrowRight,
  Layers,
  Plus,
} from 'lucide-react';
import { StudySession, Subject, StudyTechnique } from '../types';
import { getTodayDateString } from '../utils/storage';

interface SessionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Omit<StudySession, 'id' | 'createdAt' | 'cloudSynced'>) => void;
  subjects: Subject[];
  userEmail: string;
  initialSubjectId?: string;
  initialDurationMinutes?: number;
  initialTopic?: string;
  onOpenSubjectManager?: () => void;
}

export const SessionLogModal: React.FC<SessionLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subjects,
  userEmail,
  initialSubjectId,
  initialDurationMinutes = 50,
  initialTopic = '',
  onOpenSubjectManager,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [date, setDate] = useState(getTodayDateString());
  const [subjectId, setSubjectId] = useState(initialSubjectId || subjects[0]?.id || '');
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes.toString());

  // Step 2 fields
  const [topic, setTopic] = useState(initialTopic);
  const [notes, setNotes] = useState('');
  const [technique, setTechnique] = useState<StudyTechnique>('pomodoro');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDate(getTodayDateString());
      if (initialSubjectId && subjects.some((s) => s.id === initialSubjectId)) {
        setSubjectId(initialSubjectId);
      } else if (subjects.length > 0 && !subjects.some((s) => s.id === subjectId)) {
        setSubjectId(subjects[0].id);
      }
      if (initialDurationMinutes) setDurationMinutes(initialDurationMinutes.toString());
      if (initialTopic) setTopic(initialTopic);
      setError(null);
    }
  }, [isOpen, initialSubjectId, initialDurationMinutes, initialTopic, subjects]);

  if (!isOpen) return null;

  const selectedSubject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.length === 0) {
      setError('Please create at least one subject first before logging a session.');
      return;
    }
    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      setError('Please provide a valid study duration in minutes (e.g., 25, 45, 90).');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) {
      setError('Please select or create a subject first.');
      return;
    }
    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      setError('Please provide a valid study duration in minutes.');
      setStep(1);
      return;
    }
    if (!topic.trim()) {
      setError('Please enter or select a topic for this study session.');
      return;
    }

    onSave({
      userId: userEmail,
      date,
      durationMinutes: duration,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      subjectBranch: selectedSubject.branch,
      topic: topic.trim(),
      notes: notes.trim(),
      technique,
    });

    setTopic('');
    setNotes('');
    onClose();
  };

  const quickDurations = [25, 45, 50, 60, 90, 120];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                title="Back to Step 1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                title="Back / Close"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Add Study Session</h2>
              <span className="text-xs text-slate-500">
                {step === 1 ? 'Step 1 of 2: Subject, Branch & Duration' : 'Step 2 of 2: Topics & Notes'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stepper Pill */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-600">
              <span className={step === 1 ? 'font-bold text-blue-600' : 'text-slate-400'}>1</span>
              <span>/</span>
              <span className={step === 2 ? 'font-bold text-blue-600' : 'text-slate-400'}>2</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: SUBJECT & TIME */}
        {step === 1 && (
          <form onSubmit={handleNextFromStep1} className="p-5 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Date & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Study Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Time (Minutes) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Quick Duration Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Quick:</span>
              {quickDurations.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins.toString())}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                    durationMinutes === mins.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Subject Categorization with Colors and Branch */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Subject & Engineering Branch <span className="text-red-500">*</span>
                </label>
                {onOpenSubjectManager && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSubjectManager();
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Create Subject & Topics</span>
                  </button>
                )}
              </div>

              {subjects.length === 0 ? (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs text-amber-800 space-y-2">
                  <p className="font-semibold">All plans initialized at zero!</p>
                  <p>No subjects created yet for your branch. Create your first subject to proceed.</p>
                  {onOpenSubjectManager && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSubjectManager();
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      + Create Your First Subject & Topics
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {subjects.map((sub) => {
                    const isSelected = sub.id === subjectId;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSubjectId(sub.id)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs ' + sub.bgLight
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                          style={{ backgroundColor: sub.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-semibold text-slate-900">{sub.name}</span>
                            {sub.code && (
                              <span className="text-[10px] font-mono text-slate-500 font-normal">
                                ({sub.code})
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-blue-600 block truncate font-medium">
                            {sub.branch}
                          </span>
                          {sub.topics && sub.topics.length > 0 && (
                            <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                              {sub.topics.length} topic(s) available
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-blue-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation Buttons: Back & Next */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={subjects.length === 0}
                className="flex-1 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs group cursor-pointer"
              >
                <span>Next: Topic & Notes</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: TOPIC & TECHNIQUE */}
        {step === 2 && selectedSubject && (
          <form onSubmit={handleFinalSubmit} className="p-5 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Step Summary Banner */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: selectedSubject.hex }}
                />
                <span className="font-semibold text-slate-800 truncate">{selectedSubject.name}</span>
                <span className="text-slate-400">·</span>
                <span className="text-blue-600 truncate">{selectedSubject.branch}</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-slate-700 font-bold shrink-0">{durationMinutes} min</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600 hover:underline text-[11px] font-semibold flex items-center gap-0.5 shrink-0 ml-2 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic or Syllabus Unit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g., Binary Trees, Dynamic Programming, K-Maps"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Clickable Topics for this Subject */}
              {selectedSubject.topics && selectedSubject.topics.length > 0 && (
                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    Or select created topic for {selectedSubject.name}:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {selectedSubject.topics.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          topic === t
                            ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Study Technique & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Technique
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <select
                    value={technique}
                    onChange={(e) => setTechnique(e.target.value as StudyTechnique)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="pomodoro">Pomodoro Sprint</option>
                    <option value="deep_work">Deep Work Block</option>
                    <option value="revision">Exam Revision</option>
                    <option value="practice_problems">Problem Set Practice</option>
                    <option value="reading">Textbook / Paper Reading</option>
                    <option value="group_prep">Group Study / Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key Notes / Summary
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Completed exercise problems 1-10"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Navigation Buttons: Back & Save */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Study Session</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
