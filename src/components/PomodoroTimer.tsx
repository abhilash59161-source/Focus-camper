import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Flame,
  CheckCircle,
  PlusCircle,
  ArrowLeft,
  Layers,
  Tag,
  BookOpen,
} from 'lucide-react';
import { Subject, TimerMode } from '../types';
import { soundManager } from '../utils/audio';

interface PomodoroTimerProps {
  subjects: Subject[];
  onLogCompletedSession: (subjectId: string, durationMinutes: number, topic: string) => void;
  activeSubjectId?: string;
  onSelectSubject?: (subjectId: string) => void;
  onBackToDashboard?: () => void;
  onOpenSubjectManager?: () => void;
  onAddTopicToSubject?: (subjectId: string, topicName: string) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  subjects,
  onLogCompletedSession,
  activeSubjectId,
  onSelectSubject,
  onBackToDashboard,
  onOpenSubjectManager,
  onAddTopicToSubject,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    activeSubjectId || subjects[0]?.id || ''
  );
  const [topicInput, setTopicInput] = useState('');
  const [newTopicQuickAdd, setNewTopicQuickAdd] = useState('');
  const [showQuickAddTopic, setShowQuickAddTopic] = useState(false);

  // Keep selected subject synced if subjects change
  useEffect(() => {
    if (activeSubjectId && subjects.some((s) => s.id === activeSubjectId)) {
      setSelectedSubjectId(activeSubjectId);
    } else if (subjects.length > 0 && !subjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [activeSubjectId, subjects, selectedSubjectId]);

  // Durations in seconds
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [shortBreakDuration] = useState(5 * 60);
  const [longBreakDuration] = useState(15 * 60);

  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whitenoise' | 'binaural'>('none');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const totalTimeForMode =
    mode === 'pomodoro' ? focusDuration : mode === 'short_break' ? shortBreakDuration : longBreakDuration;

  // Handle mode changes
  const switchMode = (newMode: TimerMode, newFocusDuration?: number) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);

    if (newMode === 'pomodoro') {
      const dur = newFocusDuration || focusDuration;
      setTimeLeft(dur);
    } else if (newMode === 'short_break') {
      setTimeLeft(shortBreakDuration);
    } else {
      setTimeLeft(longBreakDuration);
    }
  };

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer Finished!
            clearInterval(timerRef.current!);
            setIsRunning(false);

            if (soundEnabled) {
              soundManager.playCompletionChime();
            }

            if (mode === 'pomodoro') {
              const minutesCompleted = Math.round(focusDuration / 60);
              setCompletedSessionsCount((c) => c + 1);
              setSessionCompletedNotice(minutesCompleted);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, focusDuration, soundEnabled]);

  // Ambient sound controller
  const toggleAmbient = (type: 'rain' | 'whitenoise' | 'binaural') => {
    if (ambientSound === type) {
      soundManager.stopAmbient();
      setAmbientSound('none');
    } else {
      soundManager.startAmbient(type);
      setAmbientSound(type);
    }
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTimeForMode);
  };

  const handleAddFiveMinutes = () => {
    setTimeLeft((prev) => prev + 300);
  };

  const handleSkip = () => {
    if (mode === 'pomodoro') {
      switchMode('short_break');
    } else {
      switchMode('pomodoro');
    }
  };

  const handleLogNow = () => {
    if (!currentSubject) return;
    const minutesToLog = sessionCompletedNotice || Math.max(1, Math.round((focusDuration - timeLeft) / 60));
    onLogCompletedSession(
      currentSubject.id,
      minutesToLog,
      topicInput.trim() || `${currentSubject.name} Focus Session`
    );
    setSessionCompletedNotice(null);
  };

  const handleQuickSaveTopic = () => {
    const trimmed = newTopicQuickAdd.trim();
    if (!trimmed || !currentSubject) return;
    if (onAddTopicToSubject) {
      onAddTopicToSubject(currentSubject.id, trimmed);
    }
    setTopicInput(trimmed);
    setNewTopicQuickAdd('');
    setShowQuickAddTopic(false);
  };

  // Calculations for circular progress ring
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = totalTimeForMode > 0 ? ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100 : 0;
  const strokeDashoffset = 100 - progressPercent;

  // Empty state if zero subjects exist
  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 text-center space-y-4">
        {onBackToDashboard && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        )}
        <div className="w-14 h-14 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center text-orange-600 mx-auto">
          <Layers className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">All Plans Initialized at Zero</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You don't have any subjects or topics created yet. Create your college subjects and syllabus topics for your branch to start focused Pomodoro sessions.
          </p>
        </div>
        {onOpenSubjectManager && (
          <button
            type="button"
            onClick={onOpenSubjectManager}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Subjects & Topics</span>
          </button>
        )}
      </div>
    );
  }

  const activeColorHex = currentSubject?.hex || '#2563eb';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Banner / Subject & Mode Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Mode Selector & Back Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
            <button
              onClick={() => switchMode('pomodoro', 25 * 60)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'pomodoro' && focusDuration === 25 * 60
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Focus 25m
            </button>
            <button
              onClick={() => {
                setFocusDuration(50 * 60);
                switchMode('pomodoro', 50 * 60);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'pomodoro' && focusDuration === 50 * 60
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deep 50m
            </button>
            <button
              onClick={() => switchMode('short_break')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'short_break'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => switchMode('long_break')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'long_break'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Long Break (15m)
            </button>
          </div>
        </div>

        {/* Ambient Sound & Audio Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 p-1 rounded-xl text-xs">
            <span className="text-slate-400 pl-1 text-[11px] font-medium hidden md:inline">Ambient:</span>
            <button
              onClick={() => toggleAmbient('rain')}
              title="Rain Soundscape"
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                ambientSound === 'rain'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rain</span>
            </button>
            <button
              onClick={() => toggleAmbient('whitenoise')}
              title="White Noise"
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                ambientSound === 'whitenoise'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Noise</span>
            </button>
            <button
              onClick={() => toggleAmbient('binaural')}
              title="Binaural Alpha Waves"
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                ambientSound === 'binaural'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Alpha</span>
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Completion Chime' : 'Unmute Completion Chime'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Timer Dial Content */}
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
        {/* Subject Selection Pill & Branch Tag */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Subject:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              if (onSelectSubject) onSelectSubject(e.target.value);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} {sub.code ? `(${sub.code})` : ''}
              </option>
            ))}
          </select>

          {currentSubject && (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              {currentSubject.branch}
            </span>
          )}

          {onOpenSubjectManager && (
            <button
              type="button"
              onClick={onOpenSubjectManager}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline ml-1 cursor-pointer"
            >
              + Manage Subjects
            </button>
          )}
        </div>

        {/* Circular Dial Display */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={activeColorHex}
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={2.7646 * strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Center Digital Reading */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-bold font-mono tabular-nums tracking-tight text-slate-900">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              {mode === 'pomodoro' ? 'Focus Interval' : 'Rest & Recharge'}
            </span>
            {completedSessionsCount > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{completedSessionsCount} Pomodoros today</span>
              </div>
            )}
          </div>
        </div>

        {/* Focus Target / Topic Input & Subject Topics Chips */}
        <div className="w-full max-w-md my-4 space-y-2">
          <div className="relative">
            <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="What topic are you studying right now?"
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clickable Topics for the selected subject */}
          {currentSubject && (
            <div className="text-left pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>Select topic for {currentSubject.name}:</span>
                <button
                  type="button"
                  onClick={() => setShowQuickAddTopic(!showQuickAddTopic)}
                  className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  {showQuickAddTopic ? 'Cancel' : '+ New Topic'}
                </button>
              </div>

              {/* Quick Add Topic Input */}
              {showQuickAddTopic && (
                <div className="flex gap-1.5 mb-2">
                  <input
                    type="text"
                    value={newTopicQuickAdd}
                    onChange={(e) => setNewTopicQuickAdd(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuickSaveTopic();
                      }
                    }}
                    placeholder={`Add topic to ${currentSubject.name}...`}
                    className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleQuickSaveTopic}
                    className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}

              {currentSubject.topics && currentSubject.topics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {currentSubject.topics.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopicInput(t)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        topicInput === t
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  No topics saved for this subject yet. Type a topic above or click "+ New Topic".
                </p>
              )}
            </div>
          )}
        </div>

        {/* Milestone Session Completed Toast banner inside timer */}
        {sessionCompletedNotice && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between gap-3 animate-in fade-in max-w-sm w-full">
            <span>Focus session completed! (+{sessionCompletedNotice} min)</span>
            <button
              onClick={handleLogNow}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Log to History
            </button>
          </div>
        )}

        {/* Control Buttons Group */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleReset}
            title="Reset Timer"
            className="p-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleAddFiveMinutes}
            title="Add 5 Minutes"
            className="p-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleSkip}
            title="Skip to next phase"
            className="p-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Manual Instant Log Link */}
        <div className="mt-5 text-xs text-slate-400">
          Want to log time right away?{' '}
          <button
            onClick={handleLogNow}
            className="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Save progress now
          </button>
        </div>
      </div>
    </div>
  );
};
