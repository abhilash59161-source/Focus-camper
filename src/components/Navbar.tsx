import React from 'react';
import {
  GraduationCap,
  PlusCircle,
  User,
  BarChart3,
  Timer,
  TableProperties,
  FileCheck,
  Layers,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'timer' | 'sessions' | 'subjects' | 'report';
  onTabChange: (tab: 'dashboard' | 'timer' | 'sessions' | 'subjects' | 'report') => void;
  onOpenLogModal: () => void;
  onOpenProfile: () => void;
  profile: StudentProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenLogModal,
  onOpenProfile,
  profile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              FocusCampus
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange('timer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'timer'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Pomodoro Focus</span>
          </button>

          <button
            onClick={() => onTabChange('subjects')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'subjects'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>Subjects & Topics</span>
          </button>

          <button
            onClick={() => onTabChange('sessions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'sessions'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>Session History</span>
          </button>

          <button
            onClick={() => onTabChange('report')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'report'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Weekly Report</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLogModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Session</span>
          </button>

          {profile && (
            <button
              onClick={onOpenProfile}
              title={`Logged in as ${profile.name} (${profile.email})`}
              className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-left transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight max-w-[110px] truncate">
                  {profile.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block leading-tight max-w-[110px] truncate">
                  {profile.studentId}
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-200 bg-white px-2 py-1 justify-around text-xs">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`py-1 px-2 font-medium flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Dashboard</span>
        </button>
        <button
          onClick={() => onTabChange('timer')}
          className={`py-1 px-2 font-medium flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'timer' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span className="text-[10px]">Timer</span>
        </button>
        <button
          onClick={() => onTabChange('subjects')}
          className={`py-1 px-2 font-medium flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'subjects' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Subjects</span>
        </button>
        <button
          onClick={() => onTabChange('sessions')}
          className={`py-1 px-2 font-medium flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'sessions' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <TableProperties className="w-4 h-4" />
          <span className="text-[10px]">Sessions</span>
        </button>
        <button
          onClick={() => onTabChange('report')}
          className={`py-1 px-2 font-medium flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'report' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span className="text-[10px]">Report</span>
        </button>
      </div>
    </header>
  );
};
