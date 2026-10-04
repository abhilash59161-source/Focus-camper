import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { PomodoroTimer } from './components/PomodoroTimer';
import { SessionsTable } from './components/SessionsTable';
import { SessionLogModal } from './components/SessionLogModal';
import { EditSessionModal } from './components/EditSessionModal';
import { WeeklyReportModal } from './components/WeeklyReportModal';
import { CelebrationModal } from './components/CelebrationModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { SubjectManagerModal } from './components/SubjectManagerModal';
import { StudentProfile, StudySession, Subject } from './types';
import {
  getStoredProfile,
  saveProfile,
  clearProfile,
  getStoredSessions,
  saveSession,
  updateSession,
  deleteSession,
  getStoredSubjects,
  saveCustomSubject,
  deleteSubject,
  addTopicToSubject,
  removeTopicFromSubject,
  seedBranchSuggestedSubjects,
  bulkImportSubjects,
  getTodayDateString,
  calculateTodayStats,
  calculateStreak,
  hasCelebratedToday,
  markCelebratedToday,
  INDIAN_UNIVERSITY_BRANCHES,
  SUBJECT_COLOR_PRESETS,
} from './utils/storage';
import {
  Sparkles,
  Check,
  Database,
  ArrowLeft,
  Layers,
  Plus,
  BookOpen,
  Tag,
  GraduationCap,
  Hash,
  Palette,
  Trash2,
  Clock,
  PlusCircle,
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => getStoredProfile());
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(() => getStoredSubjects());

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'timer' | 'sessions' | 'subjects' | 'report'>('dashboard');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isWeeklyReportModalOpen, setIsWeeklyReportModalOpen] = useState(false);
  const [isSubjectManagerOpen, setIsSubjectManagerOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);

  // Pre-fill states for logging session
  const [logPreFill, setLogPreFill] = useState<{
    subjectId?: string;
    durationMinutes?: number;
    topic?: string;
  }>({});

  // Active subject for timer
  const [activeTimerSubjectId, setActiveTimerSubjectId] = useState<string>('');

  // Celebration state
  const [celebrationState, setCelebrationState] = useState<{
    isOpen: boolean;
    todayMinutes: number;
    dailyGoalMinutes: number;
    streakCount: number;
  }>({
    isOpen: false,
    todayMinutes: 0,
    dailyGoalMinutes: 180,
    streakCount: 1,
  });

  // Dedicated inline form state for 'subjects' tab
  const [tabSubjectName, setTabSubjectName] = useState('');
  const [tabSubjectBranch, setTabSubjectBranch] = useState(profile?.major || INDIAN_UNIVERSITY_BRANCHES[0]);
  const [tabSubjectCode, setTabSubjectCode] = useState('');
  const [tabSubjectSemester, setTabSubjectSemester] = useState('Semester 3');
  const [tabSubjectColorIdx, setTabSubjectColorIdx] = useState(0);
  const [tabTopicInput, setTabTopicInput] = useState('');
  const [tabTopicsList, setTabTopicsList] = useState<string[]>([]);
  const [tabInlineTopicInputs, setTabInlineTopicInputs] = useState<Record<string, string>>({});
  const [tabSubjectError, setTabSubjectError] = useState<string | null>(null);

  // Cloud sync status indicator toast
  const [cloudSyncToast, setCloudSyncToast] = useState<string | null>(null);

  const showCloudNotification = (msg: string) => {
    setCloudSyncToast(msg);
    setTimeout(() => setCloudSyncToast(null), 3000);
  };

  // Load sessions once profile is ready
  useEffect(() => {
    if (!profile) {
      // Trigger student login modal if no profile exists
      setIsAuthModalOpen(true);
    } else {
      const stored = getStoredSessions(profile.email);
      setSessions(stored);
      if (profile.major) {
        setTabSubjectBranch(profile.major);
      }
    }
  }, [profile]);

  // Sync activeTimerSubjectId when subjects load
  useEffect(() => {
    if (subjects.length > 0 && (!activeTimerSubjectId || !subjects.some((s) => s.id === activeTimerSubjectId))) {
      setActiveTimerSubjectId(subjects[0].id);
    }
  }, [subjects, activeTimerSubjectId]);

  // Handle Login / Profile updates
  const handleLogin = (newProfile: StudentProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    setIsAuthModalOpen(false);
    const stored = getStoredSessions(newProfile.email);
    setSessions(stored);
    setTabSubjectBranch(newProfile.major);
    showCloudNotification(`Welcome ${newProfile.name} (${newProfile.major})`);
  };

  const handleLogout = () => {
    clearProfile();
    setProfile(null);
    setIsProfileDrawerOpen(false);
    setIsAuthModalOpen(true);
  };

  // Milestone Celebration Check
  const checkMilestoneCelebration = useCallback(
    (currentSessions: StudySession[], userProfile: StudentProfile) => {
      const today = getTodayDateString();
      const stats = calculateTodayStats(currentSessions, userProfile.dailyGoalMinutes);

      // Milestone condition: goal reached (e.g. 180 min or user defined goal)
      if (stats.goalReached && !hasCelebratedToday(today)) {
        markCelebratedToday(today);
        setCelebrationState({
          isOpen: true,
          todayMinutes: stats.totalMinutes,
          dailyGoalMinutes: userProfile.dailyGoalMinutes,
          streakCount: calculateStreak(currentSessions),
        });
      }
    },
    []
  );

  // Subject Management Handlers
  const handleSaveSubject = (newSubject: Subject) => {
    const updated = saveCustomSubject(newSubject);
    setSubjects(updated);
    showCloudNotification(`Subject "${newSubject.name}" saved for ${newSubject.branch}`);
  };

  const handleDeleteSubject = (subjectId: string) => {
    const updated = deleteSubject(subjectId);
    setSubjects(updated);
    showCloudNotification('Subject deleted');
  };

  const handleAddTopic = (subjectId: string, topicName: string) => {
    const updated = addTopicToSubject(subjectId, topicName);
    setSubjects(updated);
    showCloudNotification(`Topic "${topicName}" added to syllabus`);
  };

  const handleRemoveTopic = (subjectId: string, topicName: string) => {
    const updated = removeTopicFromSubject(subjectId, topicName);
    setSubjects(updated);
  };

  const handleSeedBranchSuggestions = (branchName: string) => {
    const updated = seedBranchSuggestedSubjects(branchName);
    setSubjects(updated);
    showCloudNotification(`Added suggested subjects & syllabus topics for ${branchName}`);
  };

  const handleBulkImportSubjects = (importedSubjects: Subject[]) => {
    const updated = bulkImportSubjects(importedSubjects);
    setSubjects(updated);
    showCloudNotification(`Bulk-imported ${importedSubjects.length} subjects to academic ledger`);
  };

  // Handler for creating subject in dedicated 'subjects' tab
  const handleCreateSubjectFromTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabSubjectName.trim()) {
      setTabSubjectError('Please enter a subject title (e.g., Data Structures & Algorithms).');
      return;
    }
    if (!tabSubjectBranch.trim()) {
      setTabSubjectError('Please select or enter the branch for this subject.');
      return;
    }

    const colorConfig = SUBJECT_COLOR_PRESETS[tabSubjectColorIdx] || SUBJECT_COLOR_PRESETS[0];
    const finalTopics = [...tabTopicsList];
    if (tabTopicInput.trim() && !finalTopics.includes(tabTopicInput.trim())) {
      finalTopics.push(tabTopicInput.trim());
    }

    const newSub: Subject = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: tabSubjectName.trim(),
      branch: tabSubjectBranch.trim(),
      topics: finalTopics,
      code: tabSubjectCode.trim().toUpperCase() || undefined,
      semester: tabSubjectSemester.trim() || undefined,
      colorName: colorConfig.name,
      bgLight: colorConfig.bgLight,
      textDark: colorConfig.textDark,
      borderLight: colorConfig.borderLight,
      badgeBg: colorConfig.badgeBg,
      badgeText: colorConfig.badgeText,
      hex: colorConfig.hex,
    };

    handleSaveSubject(newSub);
    setTabSubjectName('');
    setTabSubjectCode('');
    setTabTopicInput('');
    setTabTopicsList([]);
    setTabSubjectError(null);
  };

  // Add Session Handler
  const handleSaveSession = (newSessionData: Omit<StudySession, 'id' | 'createdAt' | 'cloudSynced'>) => {
    const saved = saveSession(newSessionData);
    const updated = [saved, ...sessions.filter((s) => s.id !== saved.id)];
    setSessions(updated);
    showCloudNotification(`Saved "${saved.topic}" to cloud database`);

    if (profile) {
      checkMilestoneCelebration(updated, profile);
    }
  };

  // Update Existing Record Handler
  const handleUpdateSession = (updatedSession: StudySession) => {
    const updated = updateSession(updatedSession);
    setSessions(updated);
    showCloudNotification('Record updated successfully');

    if (profile) {
      checkMilestoneCelebration(updated, profile);
    }
  };

  // Delete Record Handler
  const handleDeleteSession = (sessionId: string) => {
    const updated = deleteSession(sessionId);
    setSessions(updated);
    showCloudNotification('Session record deleted');
  };

  // Timer Completed Callback -> Trigger prefilled log modal
  const handleLogFromTimer = (subjectId: string, durationMinutes: number, topic: string) => {
    setLogPreFill({
      subjectId,
      durationMinutes,
      topic,
    });
    setIsLogModalOpen(true);
  };

  const handleStartTimerWithSubject = (subjectId: string, topic?: string) => {
    setActiveTimerSubjectId(subjectId);
    if (topic) {
      setLogPreFill((prev) => ({ ...prev, topic }));
    }
    setCurrentTab('timer');
  };

  // Manual Trigger Celebration for user demo testing
  const handleTestCelebration = () => {
    const todayStats = calculateTodayStats(sessions, profile?.dailyGoalMinutes || 180);
    setCelebrationState({
      isOpen: true,
      todayMinutes: todayStats.totalMinutes || profile?.dailyGoalMinutes || 180,
      dailyGoalMinutes: profile?.dailyGoalMinutes || 180,
      streakCount: Math.max(1, calculateStreak(sessions)),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'report') {
            setIsWeeklyReportModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenLogModal={() => {
          setLogPreFill({});
          setIsLogModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileDrawerOpen(true)}
        profile={profile}
      />

      {/* Cloud Persistence Status Toast */}
      {cloudSyncToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>{cloudSyncToast}</span>
          <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        </div>
      )}

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* If Tab: Dashboard */}
        {currentTab === 'dashboard' && profile && (
          <DashboardOverview
            sessions={sessions}
            profile={profile}
            subjects={subjects}
            onOpenLogModal={() => {
              setLogPreFill({});
              setIsLogModalOpen(true);
            }}
            onOpenReportModal={() => setIsWeeklyReportModalOpen(true)}
            onOpenSubjectManager={() => setIsSubjectManagerOpen(true)}
            onStartTimerWithSubject={handleStartTimerWithSubject}
            onTabChange={setCurrentTab}
          />
        )}

        {/* If Tab: Pomodoro Timer */}
        {currentTab === 'timer' && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Back button breadcrumb */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Focus Mode & Pomodoro Timer
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Alternate between uninterrupted study blocks and restorative breaks. Select your subject & syllabus topics below.
              </p>
            </div>

            <PomodoroTimer
              subjects={subjects}
              onLogCompletedSession={handleLogFromTimer}
              activeSubjectId={activeTimerSubjectId}
              onSelectSubject={setActiveTimerSubjectId}
              onBackToDashboard={() => setCurrentTab('dashboard')}
              onOpenSubjectManager={() => setIsSubjectManagerOpen(true)}
              onAddTopicToSubject={handleAddTopic}
            />

            {/* Quick Helper Tips */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs text-xs text-slate-600 space-y-2">
              <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>The Science of Spaced Retention for Indian Universities</span>
              </h3>
              <p className="leading-relaxed">
                Break complex semester coursework (such as DSA, Digital Circuits, or Thermodynamics) into bite-sized 25m or 50m intervals.
                When the timer chimes, your focused minutes can be saved directly to your cloud history.
              </p>
            </div>
          </div>
        )}

        {/* If Tab: Subjects & Topics Management */}
        {currentTab === 'subjects' && profile && (
          <div className="space-y-6">
            {/* Back button breadcrumb */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Subjects, Branch & Topics
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Create and organize your semester subjects, assign engineering branches, and build topic syllabi.
                </p>
              </div>

              {subjects.length === 0 && (
                <button
                  type="button"
                  onClick={() => handleSeedBranchSuggestions(profile.major)}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Load Suggested {profile.major.split(' ')[0]} Subjects</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Create New Subject Form */}
              <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Create Subject</h3>
                    <span className="text-[11px] text-slate-500">With Branch & Topics</span>
                  </div>
                </div>

                {tabSubjectError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {tabSubjectError}
                  </div>
                )}

                <form onSubmit={handleCreateSubjectFromTab} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Subject Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={tabSubjectName}
                        onChange={(e) => {
                          setTabSubjectName(e.target.value);
                          if (tabSubjectError) setTabSubjectError(null);
                        }}
                        placeholder="e.g., Computer Networks, Digital Signals"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Course Code
                      </label>
                      <div className="relative">
                        <Hash className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={tabSubjectCode}
                          onChange={(e) => setTabSubjectCode(e.target.value)}
                          placeholder="e.g., CS301"
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Semester
                      </label>
                      <select
                        value={tabSubjectSemester}
                        onChange={(e) => setTabSubjectSemester(e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="Semester 1">Sem 1</option>
                        <option value="Semester 2">Sem 2</option>
                        <option value="Semester 3">Sem 3</option>
                        <option value="Semester 4">Sem 4</option>
                        <option value="Semester 5">Sem 5</option>
                        <option value="Semester 6">Sem 6</option>
                        <option value="Semester 7">Sem 7</option>
                        <option value="Semester 8">Sem 8</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Branch / Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={tabSubjectBranch}
                        onChange={(e) => setTabSubjectBranch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        {INDIAN_UNIVERSITY_BRANCHES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Add Topics */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="text-[11px] font-semibold text-slate-700 uppercase flex items-center gap-1">
                      <Tag className="w-3 h-3 text-blue-600" />
                      <span>Syllabus Topics</span>
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={tabTopicInput}
                        onChange={(e) => setTabTopicInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tabTopicInput.trim() && !tabTopicsList.includes(tabTopicInput.trim())) {
                              setTabTopicsList((prev) => [...prev, tabTopicInput.trim()]);
                              setTabTopicInput('');
                            }
                          }
                        }}
                        placeholder="Type topic & press Enter"
                        className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tabTopicInput.trim() && !tabTopicsList.includes(tabTopicInput.trim())) {
                            setTabTopicsList((prev) => [...prev, tabTopicInput.trim()]);
                            setTabTopicInput('');
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {tabTopicsList.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tabTopicsList.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px]"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => setTabTopicsList((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-blue-400 hover:text-red-600 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Color Palette */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-slate-400" />
                      <span>Palette</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SUBJECT_COLOR_PRESETS.map((color, idx) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setTabSubjectColorIdx(idx)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            tabSubjectColorIdx === idx
                              ? 'ring-2 ring-offset-2 ring-slate-900 scale-110 shadow-xs'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {tabSubjectColorIdx === idx && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Subject & Topics</span>
                  </button>
                </form>
              </div>

              {/* Right Column: List of Subjects with Topics and Branches */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Registered Academic Subjects ({subjects.length})
                      </h3>
                      <span className="text-xs text-slate-500">
                        Mapped to Indian university branches with custom topic syllabi
                      </span>
                    </div>
                  </div>

                  {subjects.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl my-4 space-y-3">
                      <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                      <div>
                        <p className="font-semibold text-sm text-slate-800">All plans initialized at zero!</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Use the form on the left to create your first subject and topics, or click below for {profile.major} starter topics.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSeedBranchSuggestions(profile.major)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        + Import Suggested {profile.major.split(' ')[0]} Subjects & Topics
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 mt-4">
                      {subjects.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <span
                                className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                                style={{ backgroundColor: sub.hex }}
                              />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900">
                                    {sub.name}
                                  </h4>
                                  {sub.code && (
                                    <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                      {sub.code}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                    {sub.branch}
                                  </span>
                                  {sub.semester && (
                                    <span className="text-[10px] text-slate-500">
                                      {sub.semester}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartTimerWithSubject(sub.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Clock className="w-3 h-3" />
                                <span>Focus</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubject(sub.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Subject"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Topics List & Quick Adder */}
                          <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-1.5">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3 text-slate-400" />
                                <span>Topics ({sub.topics ? sub.topics.length : 0})</span>
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                              {sub.topics && sub.topics.length > 0 ? (
                                sub.topics.map((top, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[11px]"
                                  >
                                    <span>{top}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTopic(sub.id, top)}
                                      className="text-slate-400 hover:text-red-600 ml-0.5 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  No topics added yet. Add one below:
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 max-w-sm">
                              <input
                                type="text"
                                value={tabInlineTopicInputs[sub.id] || ''}
                                onChange={(e) =>
                                  setTabInlineTopicInputs((prev) => ({
                                    ...prev,
                                    [sub.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const text = (tabInlineTopicInputs[sub.id] || '').trim();
                                    if (text) {
                                      handleAddTopic(sub.id, text);
                                      setTabInlineTopicInputs((prev) => ({ ...prev, [sub.id]: '' }));
                                    }
                                  }
                                }}
                                placeholder={`Add topic to ${sub.name}...`}
                                className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const text = (tabInlineTopicInputs[sub.id] || '').trim();
                                  if (text) {
                                    handleAddTopic(sub.id, text);
                                    setTabInlineTopicInputs((prev) => ({ ...prev, [sub.id]: '' }));
                                  }
                                }}
                                className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If Tab: Sessions Table */}
        {currentTab === 'sessions' && (
          <div className="space-y-5">
            {/* Back button breadcrumb */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Study Log Ledger
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect, filter by branch, subject, or date range, update, or remove verified study records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestCelebration}
                  title="Simulate Celebratory Popup"
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Preview</span> Milestone Celebration
                </button>

                <button
                  onClick={() => {
                    setLogPreFill({});
                    setIsLogModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  + Add New Session
                </button>
              </div>
            </div>

            <SessionsTable
              sessions={sessions}
              subjects={subjects}
              onEdit={(session) => setEditingSession(session)}
              onDelete={handleDeleteSession}
              onAddSessionClick={() => {
                setLogPreFill({});
                setIsLogModalOpen(true);
              }}
              onBackToDashboard={() => setCurrentTab('dashboard')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">FocusCampus</span>
            <span>· Indian Universities Focus Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Local Storage Persistence</span>
            <span>·</span>
            <span>Zero-Initial Academic Plans</span>
            <span>·</span>
            <span>Branch & Syllabus Topic Tracking</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}

      {/* 1. Student Auth / Switch Profile Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onLogin={handleLogin}
        currentProfile={profile}
        onClose={() => setIsAuthModalOpen(false)}
        isSwitchingAccount={!!profile}
      />

      {/* 2. Add Session Modal */}
      <SessionLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveSession}
        subjects={subjects}
        userEmail={profile?.email || 'student@university.edu'}
        initialSubjectId={logPreFill.subjectId}
        initialDurationMinutes={logPreFill.durationMinutes}
        initialTopic={logPreFill.topic}
        onOpenSubjectManager={() => setIsSubjectManagerOpen(true)}
      />

      {/* 3. Edit Session Modal */}
      <EditSessionModal
        isOpen={!!editingSession}
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onUpdate={handleUpdateSession}
        subjects={subjects}
      />

      {/* 4. Automated Weekly Performance Report Modal */}
      {profile && (
        <WeeklyReportModal
          isOpen={isWeeklyReportModalOpen}
          onClose={() => setIsWeeklyReportModalOpen(false)}
          sessions={sessions}
          profile={profile}
          subjects={subjects}
        />
      )}

      {/* 5. Celebratory Milestone Modal */}
      <CelebrationModal
        isOpen={celebrationState.isOpen}
        onClose={() => setCelebrationState((prev) => ({ ...prev, isOpen: false }))}
        todayMinutes={celebrationState.todayMinutes}
        dailyGoalMinutes={celebrationState.dailyGoalMinutes}
        streakCount={celebrationState.streakCount}
        studentName={profile?.name || 'Student'}
      />

      {/* 6. Subject Manager Modal */}
      <SubjectManagerModal
        isOpen={isSubjectManagerOpen}
        onClose={() => setIsSubjectManagerOpen(false)}
        subjects={subjects}
        onSaveSubject={handleSaveSubject}
        onDeleteSubject={handleDeleteSubject}
        onAddTopicToSubject={handleAddTopic}
        onRemoveTopicFromSubject={handleRemoveTopic}
        onBulkImportSubjects={handleBulkImportSubjects}
        userBranch={profile?.major}
        onStartTimerWithSubject={handleStartTimerWithSubject}
      />

      {/* 7. Profile Settings Drawer */}
      {profile && (
        <ProfileDrawer
          isOpen={isProfileDrawerOpen}
          onClose={() => setIsProfileDrawerOpen(false)}
          profile={profile}
          onUpdateProfile={(updated) => {
            saveProfile(updated);
            setProfile(updated);
          }}
          onLogout={handleLogout}
          onEditStudentDetails={() => {
            setIsProfileDrawerOpen(false);
            setIsAuthModalOpen(true);
          }}
          sessions={sessions}
        />
      )}
    </div>
  );
}
