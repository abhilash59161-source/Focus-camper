import { StudentProfile, StudySession, Subject, WeeklyPerformanceReport } from '../types';
import { calculateCurrentWeekStats, calculateSubjectBreakdown, formatMinutesToHoursMinutes } from './storage';

export const generateWeeklyReport = (
  sessions: StudySession[],
  profile: StudentProfile,
  subjects: Subject[]
): WeeklyPerformanceReport => {
  const weekStats = calculateCurrentWeekStats(sessions);
  const subjectBreakdown = calculateSubjectBreakdown(weekStats.weekSessions, subjects);

  const totalMinutes = weekStats.totalMinutes;
  const targetWeeklyMinutes = (profile.weeklyGoalHours || 18) * 60;
  const activeDays = weekStats.activeDaysCount;
  const consistencyScore = Math.min(100, Math.round((activeDays / 7) * 100));

  // Determine top subject
  const topSub = subjectBreakdown[0] || {
    subjectName: 'None logged yet',
    hoursFormatted: '0.0',
    percentage: 0,
    colorHex: '#64748b',
  };

  // Grade calculation
  const goalAttainmentRate = targetWeeklyMinutes > 0 ? (totalMinutes / targetWeeklyMinutes) * 100 : 0;
  let performanceGrade: 'A+' | 'A' | 'B+' | 'B' | 'Needs Focus' = 'B';
  if (goalAttainmentRate >= 100 && activeDays >= 5) {
    performanceGrade = 'A+';
  } else if (goalAttainmentRate >= 85 && activeDays >= 4) {
    performanceGrade = 'A';
  } else if (goalAttainmentRate >= 70 && activeDays >= 3) {
    performanceGrade = 'B+';
  } else if (goalAttainmentRate >= 50) {
    performanceGrade = 'B';
  } else {
    performanceGrade = 'Needs Focus';
  }

  // Daily breakdown for this week
  const [startY, startM, startD] = weekStats.startDateStr.split('-').map(Number);
  const monday = new Date(startY, startM - 1, startD);
  const dailyBreakdown = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    const dateStr = currentDay.toISOString().split('T')[0];

    const dayMinutes = weekStats.weekSessions
      .filter((s) => s.date === dateStr)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    dailyBreakdown.push({
      dayName: currentDay.toLocaleDateString('en-US', { weekday: 'short' }),
      date: dateStr,
      minutes: dayMinutes,
      hours: (dayMinutes / 60).toFixed(1),
      hitGoal: profile.dailyGoalMinutes > 0 && dayMinutes >= profile.dailyGoalMinutes,
    });
  }

  // Generate automated study insights
  const keyInsights: string[] = [];
  if (totalMinutes >= targetWeeklyMinutes) {
    keyInsights.push(`Met and exceeded weekly objective (${(totalMinutes / 60).toFixed(1)} hrs logged vs ${profile.weeklyGoalHours} hrs target).`);
  } else {
    const diff = ((targetWeeklyMinutes - totalMinutes) / 60).toFixed(1);
    keyInsights.push(`Recorded ${(totalMinutes / 60).toFixed(1)} hrs this week. Only ${diff} hrs remaining to hit weekly benchmark.`);
  }

  if (activeDays >= 5) {
    keyInsights.push(`Outstanding study cadence: logged sessions across ${activeDays} out of 7 days this week.`);
  } else {
    keyInsights.push(`Active on ${activeDays} days this week. Distributing study time over 5+ days enhances long-term retention.`);
  }

  if (topSub.percentage > 0) {
    keyInsights.push(`Dominant focus was ${topSub.subjectName}, comprising ${topSub.percentage}% of weekly study time.`);
  }

  // Actionable recommendations
  const recommendations: string[] = [];
  if (subjectBreakdown.length > 0 && subjectBreakdown.length < 3) {
    recommendations.push('Consider interleaved study: incorporate 25-minute review sessions for secondary subjects.');
  }
  const avgMins = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;
  if (avgMins >= 120) {
    recommendations.push('Strong endurance: ensure you schedule 5-10 minute breaks every 50 minutes to avoid mental fatigue.');
  } else {
    recommendations.push('Utilize 25-minute Pomodoro sprints between lectures to steadily compound daily study hours.');
  }
  recommendations.push('Review automated session logs before upcoming midterms to identify under-reviewed subject areas.');

  return {
    weekRange: weekStats.formattedRange,
    studentName: profile.name,
    studentId: profile.studentId,
    totalHours: weekStats.totalHours,
    totalMinutes,
    sessionsCount: weekStats.sessionsCount,
    averageDailyMinutes: avgMins,
    activeDays,
    topSubject: {
      name: topSub.subjectName,
      hours: topSub.hoursFormatted,
      percentage: topSub.percentage,
      colorHex: topSub.colorHex,
    },
    subjectBreakdown: subjectBreakdown.map((s) => ({
      subjectName: s.subjectName,
      minutes: s.minutes,
      hours: s.hoursFormatted,
      percentage: s.percentage,
      colorHex: s.colorHex,
      badgeBg: s.bgLight,
      badgeText: s.textDark,
    })),
    dailyBreakdown,
    consistencyScore,
    performanceGrade,
    keyInsights,
    recommendations,
  };
};
