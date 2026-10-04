import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Sparkles, X, Flame, ArrowLeft } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayMinutes: number;
  dailyGoalMinutes: number;
  streakCount: number;
  studentName: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  todayMinutes,
  dailyGoalMinutes,
  streakCount,
  studentName,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Play synthesized celebratory fanfare
      soundManager.playCelebrationSound();

      // Fire vibrant confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        });

        // Secondary delayed burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#3b82f6', '#10b981', '#f59e0b'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#8b5cf6', '#ec4899', '#10b981'],
          });
        }, 250);
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hoursStudied = (todayMinutes / 60).toFixed(1);
  const wholeHours = Math.floor(todayMinutes / 60);
  const remainingMins = todayMinutes % 60;
  
  // Format matching requirement: "Great job! You studied for 3 hours today."
  const celebrationMessage =
    wholeHours > 0
      ? `Great job! You studied for ${wholeHours === 1 && remainingMins === 0 ? '1 hour' : wholeHours + ' hours'} today.`
      : `Great job! You studied for ${todayMinutes} minutes today.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 px-6 py-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
            aria-label="Close celebration popup"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-inner border border-white/30">
            <Award className="w-9 h-9 text-amber-300 animate-bounce" />
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Daily Milestone Achieved</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          
          <h3 className="text-xl font-bold tracking-tight text-white">
            Daily Goal Complete, {studentName.split(' ')[0]}!
          </h3>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-5">
          {/* Celebratory Quote Requirement */}
          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-100 text-slate-800">
            <p className="text-lg font-semibold text-emerald-950">
              “{celebrationMessage}”
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              Your dedication today is laying the foundation for academic mastery.
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Today's Focus</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold tabular-nums text-slate-900">{hoursStudied}</span>
                <span className="text-xs text-slate-500">hours</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% of {Math.round(dailyGoalMinutes / 60)}h goal
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Current Streak</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold tabular-nums text-slate-900">{Math.max(1, streakCount)}</span>
                <span className="text-xs text-slate-500">days</span>
              </div>
              <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                <Flame className="w-3.5 h-3.5" /> Study streak active
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="py-2.5 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-sm focus:outline-hidden text-xs cursor-pointer"
            >
              Keep Up the Great Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
