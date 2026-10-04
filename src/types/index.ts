export interface StudentProfile {
  name: string;
  email: string;
  studentId: string;
  institution: string;
  major: string;
  dailyGoalMinutes: number; // e.g., 180 min (3 hours)
  weeklyGoalHours: number; // e.g., 18 hours
  joinedDate: string;
  avatarSeed?: string;
}

export interface Subject {
  id: string;
  name: string;
  branch: string; // Indian University Branch / Department e.g., CSE, ECE, Mechanical, Civil, etc.
  topics: string[]; // Custom topics created by the student for this subject
  code?: string; // Subject Code e.g. CS301, MA201
  semester?: string; // e.g. Sem 3, Sem 5
  colorName: string;
  bgLight: string;
  textDark: string;
  borderLight: string;
  badgeBg: string;
  badgeText: string;
  hex: string;
}

export type StudyTechnique = 'pomodoro' | 'deep_work' | 'revision' | 'practice_problems' | 'reading' | 'group_prep';

export interface StudySession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  subjectId: string;
  subjectName: string;
  subjectBranch?: string; // Branch of subject
  topic: string;
  notes?: string;
  technique: StudyTechnique;
  createdAt: string;
  cloudSynced: boolean;
}

export type TimerMode = 'pomodoro' | 'short_break' | 'long_break';

export interface DailyStats {
  date: string;
  totalMinutes: number;
  percentageGoal: number;
  sessionsCount: number;
  completedGoal: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalMinutes: number;
  totalHours: number;
  percentageGoal: number;
  dailyAverageMinutes: number;
  activeDaysCount: number;
}

export interface MonthlyStats {
  monthName: string;
  year: number;
  totalMinutes: number;
  totalHours: number;
  sessionsCount: number;
  dailyAverageMinutes: number;
}

export interface WeeklyPerformanceReport {
  weekRange: string;
  studentName: string;
  studentId: string;
  totalHours: string;
  totalMinutes: number;
  sessionsCount: number;
  averageDailyMinutes: number;
  activeDays: number;
  topSubject: {
    name: string;
    hours: string;
    percentage: number;
    colorHex: string;
  };
  subjectBreakdown: {
    subjectName: string;
    minutes: number;
    hours: string;
    percentage: number;
    colorHex: string;
    badgeBg: string;
    badgeText: string;
  }[];
  dailyBreakdown: {
    dayName: string;
    date: string;
    minutes: number;
    hours: string;
    hitGoal: boolean;
  }[];
  consistencyScore: number;
  performanceGrade: 'A+' | 'A' | 'B+' | 'B' | 'Needs Focus';
  keyInsights: string[];
  recommendations: string[];
}
