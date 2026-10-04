import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, Tag, Save, ArrowLeft } from 'lucide-react';
import { StudySession, Subject, StudyTechnique } from '../types';

interface EditSessionModalProps {
  session: StudySession | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (session: StudySession) => void;
  subjects: Subject[];
}

export const EditSessionModal: React.FC<EditSessionModalProps> = ({
  session,
  isOpen,
  onClose,
  onUpdate,
  subjects,
}) => {
  const [date, setDate] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [technique, setTechnique] = useState<StudyTechnique>('pomodoro');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setDate(session.date);
      setSubjectId(session.subjectId);
      setDurationMinutes(session.durationMinutes.toString());
      setTopic(session.topic);
      setNotes(session.notes || '');
      setTechnique(session.technique);
      setError(null);
    }
  }, [session]);

  if (!isOpen || !session) return null;

  const selectedSubject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      setError('Please provide a valid study duration in minutes.');
      return;
    }
    if (!topic.trim()) {
      setError('Please provide a topic name.');
      return;
    }

    onUpdate({
      ...session,
      date,
      durationMinutes: duration,
      subjectId: selectedSubject ? selectedSubject.id : session.subjectId,
      subjectName: selectedSubject ? selectedSubject.name : session.subjectName,
      subjectBranch: selectedSubject ? selectedSubject.branch : session.subjectBranch,
      topic: topic.trim(),
      notes: notes.trim(),
      technique,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Back to Sessions Table"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Edit Study Session</h2>
              <span className="text-xs text-slate-500">Modify date, duration, subject, branch, or notes</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Session Date
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
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Duration (Minutes)
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject & Engineering Branch
            </label>
            <div className="relative">
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} — {sub.branch} {sub.code ? `(${sub.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Topic or Syllabus Unit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {selectedSubject?.topics && selectedSubject.topics.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedSubject.topics.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                      topic === t ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-5 font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Session Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
