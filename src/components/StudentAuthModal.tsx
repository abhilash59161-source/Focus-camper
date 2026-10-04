import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  User,
  Hash,
  School,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { INDIAN_UNIVERSITY_BRANCHES } from '../utils/storage';

interface StudentAuthModalProps {
  isOpen: boolean;
  onLogin: (profile: StudentProfile) => void;
  currentProfile?: StudentProfile | null;
  onClose?: () => void;
  isSwitchingAccount?: boolean;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onLogin,
  currentProfile,
  onClose,
  isSwitchingAccount = false,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Student Details (Step 1)
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [name, setName] = useState(currentProfile?.name || '');
  const [studentId, setStudentId] = useState(currentProfile?.studentId || '');
  const [institution, setInstitution] = useState(currentProfile?.institution || '');

  // Academic Preferences (Step 2)
  const [major, setMajor] = useState(
    currentProfile?.major || INDIAN_UNIVERSITY_BRANCHES[0]
  );
  const [dailyGoalHours, setDailyGoalHours] = useState(
    currentProfile ? (currentProfile.dailyGoalMinutes / 60).toString() : '3'
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Validation for Step 1: Student Details
  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      setError('Please enter your full student name.');
      return false;
    }
    if (!studentId.trim()) {
      setError('Please enter your Roll Number / USN / Enrollment ID.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid college or university email address (e.g. student@iitb.ac.in).');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNextFromStep1 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    const hours = parseFloat(dailyGoalHours) || 3;
    const profile: StudentProfile = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      studentId: studentId.trim().toUpperCase(),
      institution: institution.trim() || 'Indian Institute of Technology / State Technical University',
      major: major.trim() || INDIAN_UNIVERSITY_BRANCHES[0],
      dailyGoalMinutes: Math.round(hours * 60),
      weeklyGoalHours: Math.round(hours * 6),
      joinedDate: currentProfile?.joinedDate || new Date().toISOString(),
    };

    onLogin(profile);
  };

  const handleQuickDemo = (sample: 'iitb' | 'bits' | 'nitt' | 'du') => {
    if (sample === 'iitb') {
      setEmail('rohit.sharma@iitb.ac.in');
      setName('Rohit Sharma');
      setStudentId('22B0941');
      setInstitution('IIT Bombay');
      setMajor('Computer Science & Engineering (CSE)');
      setDailyGoalHours('3.5');
    } else if (sample === 'bits') {
      setEmail('aditi.verma@pilani.bits-pilani.ac.in');
      setName('Aditi Verma');
      setStudentId('2022A7PS0042P');
      setInstitution('BITS Pilani');
      setMajor('Electronics & Communication Engineering (ECE)');
      setDailyGoalHours('3');
    } else if (sample === 'nitt') {
      setEmail('arjun.kumar@nitt.edu');
      setName('Arjun Kumar');
      setStudentId('111121048');
      setInstitution('NIT Trichy');
      setMajor('Mechanical Engineering (ME)');
      setDailyGoalHours('3');
    } else {
      setEmail('pooja.iyer@du.ac.in');
      setName('Pooja Iyer');
      setStudentId('21058504012');
      setInstitution('University of Delhi');
      setMajor('Mathematics & Computing');
      setDailyGoalHours('3');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-1.5 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  title="Back to Step 1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : onClose && isSwitchingAccount ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  title="Back to Workspace"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : null}

              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white leading-tight">FocusCampus India</h2>
                <span className="text-[11px] text-slate-400">Indian Universities & Institutes Academic Focus</span>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] font-mono">
              <span className={step === 1 ? 'text-orange-400 font-bold' : 'text-slate-400'}>1. Details</span>
              <span className="text-slate-600">→</span>
              <span className={step === 2 ? 'text-orange-400 font-bold' : 'text-slate-400'}>2. Branch & Goal</span>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            {step === 1
              ? 'Enter student details below, then click Next to go forward into the app.'
              : 'Confirm your engineering branch and set your target daily study goal.'}
          </p>
        </div>

        {/* Quick Demo Pre-fill Pills (Available on Step 1) */}
        {step === 1 && (
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">1-Click Indian College Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('iitb')}
                className="px-2 py-0.5 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 rounded-md border border-slate-200 transition-colors shadow-2xs font-medium text-[11px]"
              >
                IIT Bombay (CSE)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('bits')}
                className="px-2 py-0.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md border border-slate-200 transition-colors shadow-2xs font-medium text-[11px]"
              >
                BITS Pilani (ECE)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('nitt')}
                className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-md border border-slate-200 transition-colors shadow-2xs font-medium text-[11px]"
              >
                NIT Trichy (ME)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('du')}
                className="px-2 py-0.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-md border border-slate-200 transition-colors shadow-2xs font-medium text-[11px]"
              >
                Delhi Univ
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: STUDENT DETAILS */}
        {step === 1 && (
          <form onSubmit={handleNextFromStep1} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Student Name & Roll Number / USN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., Rohit Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Roll No. / USN / Enrollment <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., 22B0941, 1MS21CS045"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* University / College Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College / University Email ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g., rohit.sharma@iitb.ac.in, student@college.edu.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Session history will be synced to your Indian college identity. All study plans start at zero.
              </span>
            </div>

            {/* University / Institution */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                University / College / Institute Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <School className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g., IIT Bombay, BITS Pilani, Anna University, VTU, Delhi University"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Privacy & Sync Notice */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Details remain securely saved in localStorage across refreshes.</span>
            </div>

            {/* Action Buttons: Back and Next */}
            <div className="pt-2 flex items-center gap-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm group cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: BRANCH & STUDY GOAL */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="p-6 space-y-4">
            {/* Verified Student ID Preview Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{name}</h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                    <span>Roll: {studentId}</span>
                    <span>·</span>
                    <span className="truncate max-w-[150px]">{institution || 'Indian University'}</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            {/* Branch of Study */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Branch / Academic Stream <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer font-medium"
                >
                  {INDIAN_UNIVERSITY_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Subjects you create will be automatically associated with your engineering branch.
              </span>
            </div>

            {/* Target Daily Study Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Daily Study Goal <span className="text-slate-400 font-normal lowercase">(plans start at zero)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <select
                  value={dailyGoalHours}
                  onChange={(e) => setDailyGoalHours(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer font-medium"
                >
                  <option value="2">2 Hours / Day (120 min)</option>
                  <option value="2.5">2.5 Hours / Day (150 min)</option>
                  <option value="3">3 Hours / Day (180 min - Standard Academic Target)</option>
                  <option value="3.5">3.5 Hours / Day (210 min)</option>
                  <option value="4">4 Hours / Day (240 min - Intensive / Gate / Placements)</option>
                  <option value="5">5 Hours / Day (300 min - Semester Exams / Finals Prep)</option>
                </select>
              </div>
            </div>

            {/* Navigation Buttons: Back and Go Forward */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Student Details</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm group cursor-pointer"
              >
                <span>Go Forward to App</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
