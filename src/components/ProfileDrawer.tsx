import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Hash,
  School,
  Clock,
  LogOut,
  Download,
  Upload,
  CloudCheck,
  CheckCircle2,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { StudentProfile, StudySession } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onLogout: () => void;
  onEditStudentDetails?: () => void;
  sessions: StudySession[];
  onImportSessions?: (sessions: StudySession[]) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogout,
  onEditStudentDetails,
  sessions,
  onImportSessions,
}) => {
  const [goalHours, setGoalHours] = useState((profile.dailyGoalMinutes / 60).toString());
  const [institution, setInstitution] = useState(profile.institution);
  const [major, setMajor] = useState(profile.major);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(goalHours) || 3;
    const updated: StudentProfile = {
      ...profile,
      dailyGoalMinutes: Math.round(hours * 60),
      weeklyGoalHours: Math.round(hours * 6),
      institution: institution.trim(),
      major: major.trim(),
    };
    onUpdateProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleExportData = () => {
    const backupData = {
      profile,
      sessions,
      exportedAt: new Date().toISOString(),
      app: 'FocusCampus',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focuscampus_backup_${profile.studentId}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
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
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Student Profile & Settings</h3>
              <span className="text-xs text-slate-500">Verified academic credentials</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Identity Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{profile.name}</h4>
                <span className="text-slate-500 font-mono text-[11px] block">{profile.email}</span>
                <span className="text-blue-600 font-mono text-[11px] font-semibold">
                  ID: {profile.studentId}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-500">
              <span>Account Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synced to Database
              </span>
            </div>

            {onEditStudentDetails && (
              <button
                type="button"
                onClick={onEditStudentDetails}
                className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Student Details & University ID</span>
              </button>
            )}
          </div>

          {/* Edit Goals & Academics */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Study Targets & Department
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Daily Study Goal
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={goalHours}
                  onChange={(e) => setGoalHours(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="2">2 Hours / Day (120m)</option>
                  <option value="2.5">2.5 Hours / Day (150m)</option>
                  <option value="3">3 Hours / Day (180m - Standard)</option>
                  <option value="3.5">3.5 Hours / Day (210m)</option>
                  <option value="4">4 Hours / Day (240m - Honors)</option>
                  <option value="5">5 Hours / Day (300m - Pre-exam)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Major / Field of Study
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Adjustments</span>
            </button>

            {isSavedNotice && (
              <p className="text-center text-xs font-medium text-emerald-600 animate-in fade-in">
                Profile updated successfully!
              </p>
            )}
          </form>

          {/* Backup / Export */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Data Management & Portability
            </h4>

            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Session History (JSON Backup)</span>
            </button>
          </div>

          {/* Back to Dashboard & Switch Account */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Student Account / Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
