// Gamification system — levels, badges, streaks, coins, missions, mystery boxes

export const LEVELS = [
  { level: 1, title: 'Rookie Builder', xpRequired: 0, color: '#94A3B8' },
  { level: 2, title: 'Tinkerer', xpRequired: 100, color: '#60A5FA' },
  { level: 3, title: 'Circuit Apprentice', xpRequired: 300, color: '#22D3EE' },
  { level: 4, title: 'Code Warrior', xpRequired: 600, color: '#4ADE80' },
  { level: 5, title: 'Robot Pilot', xpRequired: 1000, color: '#A78BFA' },
  { level: 6, title: 'Sensor Specialist', xpRequired: 1500, color: '#F59E0B' },
  { level: 7, title: 'AI Strategist', xpRequired: 2200, color: '#EC4899' },
  { level: 8, title: 'Robotics Engineer', xpRequired: 3000, color: '#F97316' },
  { level: 9, title: 'Master Roboticist', xpRequired: 4000, color: '#EF4444' },
  { level: 10, title: 'Robotics Genius', xpRequired: 5500, color: '#FBBF24' },
];

export function getLevel(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const progressInLevel = next ? xp - current.xpRequired : 0;
  const xpForLevel = next ? next.xpRequired - current.xpRequired : 1;
  const levelProgress = next ? Math.min(100, (progressInLevel / xpForLevel) * 100) : 100;
  const xpToNext = next ? next.xpRequired - xp : 0;
  return { current, next, levelProgress, xpToNext, levelNumber: current.level };
}

export const BADGES = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: 'Footprints', color: '#60A5FA' },
  { id: 'first_quiz', name: 'Quiz Rookie', description: 'Complete your first quiz', icon: 'Target', color: '#22D3EE' },
  { id: 'five_lessons', name: 'Robotics Beginner', description: 'Complete 5 lessons', icon: 'Bot', color: '#4ADE80' },
  { id: 'ten_lessons', name: 'Python Explorer', description: 'Complete 10 lessons', icon: 'Code', color: '#A78BFA' },
  { id: 'perfect_quiz', name: 'Quiz Champion', description: 'Get 100% on a quiz', icon: 'Crown', color: '#FBBF24' },
  { id: 'streak_3', name: 'On Fire', description: '3-day learning streak', icon: 'Flame', color: '#F97316' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', icon: 'Flame', color: '#EF4444' },
  { id: 'streak_30', name: 'Unstoppable', description: '30-day learning streak', icon: 'Flame', color: '#DC2626' },
  { id: 'all_flashcards', name: 'Card Master', description: 'Review a full deck of flash cards', icon: 'Layers', color: '#06B6D4' },
  { id: 'activity_complete', name: 'Game On', description: 'Complete your first interactive activity', icon: 'Gamepad2', color: '#8B5CF6' },
  { id: 'fast_learner', name: 'Fast Learner', description: 'Complete 3 lessons in one day', icon: 'Zap', color: '#F59E0B' },
  { id: 'circuit_master', name: 'Circuit Master', description: 'Complete all Computing lessons in a class', icon: 'Cpu', color: '#10B981' },
  { id: 'sensor_expert', name: 'Sensor Expert', description: 'Complete all Robotics lessons in a class', icon: 'Radar', color: '#3B82F6' },
  { id: 'robotics_genius', name: 'Robotics Genius', description: 'Complete all lessons in a class', icon: 'Brain', color: '#FBBF24' },
];

export function checkBadges(progress, classId, allLessons) {
  const earned = new Set(progress.achievements || []);
  const newBadges = [];
  const completed = progress.completedLessons || [];
  const quizScores = progress.quizScores || {};
  const streak = progress.streak || 0;
  const flashcardReviews = progress.flashcardReviews || {};

  const tryAdd = (id) => {
    if (!earned.has(id)) {
      earned.add(id);
      const badge = BADGES.find(b => b.id === id);
      if (badge) newBadges.push(badge);
    }
  };

  if (completed.length >= 1) tryAdd('first_lesson');
  if (completed.length >= 5) tryAdd('five_lessons');
  if (completed.length >= 10) tryAdd('ten_lessons');
  if (Object.keys(quizScores).length >= 1) tryAdd('first_quiz');
  if (Object.values(quizScores).some(scores => scores.some(s => s.percentage === 100))) tryAdd('perfect_quiz');
  if (streak >= 3) tryAdd('streak_3');
  if (streak >= 7) tryAdd('streak_7');
  if (streak >= 30) tryAdd('streak_30');
  if (Object.keys(flashcardReviews).length >= 1) tryAdd('all_flashcards');
  if ((progress.activitiesCompleted || []).length > 0) tryAdd('activity_complete');
  const today = localDay();
  const doneToday = Object.values(progress.lessonDates || {}).filter(d => d === today).length;
  if (doneToday >= 3) tryAdd('fast_learner');

  if (allLessons && allLessons.length > 0) {
    const roboticsLessons = allLessons.filter(l => l.subject === 'Robotics');
    const computingLessons = allLessons.filter(l => l.subject === 'Computing Fundamentals' || l.subject === 'Computing');
    if (roboticsLessons.length > 0 && roboticsLessons.every(l => completed.includes(l.id))) tryAdd('sensor_expert');
    if (computingLessons.length > 0 && computingLessons.every(l => completed.includes(l.id))) tryAdd('circuit_master');
    if (allLessons.every(l => completed.includes(l.id))) tryAdd('robotics_genius');
  }

  return { achievements: Array.from(earned), newBadges };
}

export const DAILY_MISSIONS = [
  { id: 'complete_lesson', name: 'Complete a Lesson', xp: 50, coins: 10, icon: 'BookOpen' },
  { id: 'take_quiz', name: 'Take a Quiz', xp: 30, coins: 5, icon: 'Target' },
  { id: 'review_flashcards', name: 'Review Flash Cards', xp: 20, coins: 5, icon: 'Layers' },
  { id: 'play_activity', name: 'Play an Activity', xp: 25, coins: 5, icon: 'Gamepad2' },
  { id: 'earn_100_xp', name: 'Earn 100 XP Today', xp: 50, coins: 15, icon: 'Zap' },
];

export const WEEKLY_MISSIONS = [
  { id: 'w_complete_5', name: 'Complete 5 Lessons This Week', xp: 200, coins: 50, icon: 'Trophy' },
  { id: 'w_7_day_streak', name: 'Maintain a 7-Day Streak', xp: 300, coins: 75, icon: 'Flame' },
  { id: 'w_perfect_3', name: 'Get 100% on 3 Quizzes', xp: 250, coins: 60, icon: 'Crown' },
];

// Local calendar day (not UTC) so streaks and daily missions reset at the
// student's own midnight.
export function localDay(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function getToday() { return localDay(); }
function getWeekId() { const d = new Date(); const y = d.getFullYear(); const start = new Date(y, 0, 1); const week = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7); return `${y}_W${week}`; }

export function getDailyMissionsStatus(progress) {
  const today = getToday();
  const todayMissions = (progress.dailyMissions && progress.dailyMissions[today]) || { completed: [] };
  return DAILY_MISSIONS.map(m => ({
    ...m,
    done: todayMissions.completed.includes(m.id),
  }));
}

export function getWeeklyMissionsStatus(progress) {
  const weekId = getWeekId();
  const weekMissions = (progress.weeklyMissions && progress.weeklyMissions[weekId]) || { completed: [] };
  return WEEKLY_MISSIONS.map(m => ({
    ...m,
    done: weekMissions.completed.includes(m.id),
  }));
}

export function recordMission(oldProgress, missionId, type) {
  const dateKey = type === 'weekly' ? getWeekId() : getToday();
  const field = type === 'weekly' ? 'weeklyMissions' : 'dailyMissions';
  const existing = (oldProgress[field] && oldProgress[field][dateKey]) || { completed: [] };
  if (existing.completed.includes(missionId)) return { progress: oldProgress, awarded: false };
  const completed = [...existing.completed, missionId];
  const updated = { ...oldProgress, [field]: { ...oldProgress[field], [dateKey]: { completed } } };
  return { progress: updated, awarded: true };
}

export const MYSTERY_BOXES = [
  {
    id: 'small',
    name: 'Small Mystery Box',
    cost: 50,
    rewards: [
      { type: 'coins', min: 10, max: 30 },
      { type: 'xp', min: 20, max: 50 },
    ],
    color: '#60A5FA',
  },
  {
    id: 'medium',
    name: 'Golden Mystery Box',
    cost: 150,
    rewards: [
      { type: 'coins', min: 40, max: 100 },
      { type: 'xp', min: 50, max: 150 },
    ],
    color: '#FBBF24',
  },
  {
    id: 'large',
    name: 'Legendary Mystery Box',
    cost: 300,
    rewards: [
      { type: 'coins', min: 100, max: 250 },
      { type: 'xp', min: 150, max: 400 },
    ],
    color: '#A78BFA',
  },
];

export function openMysteryBox(boxId) {
  const box = MYSTERY_BOXES.find(b => b.id === boxId);
  if (!box) return null;
  return box.rewards.map(r => ({
    type: r.type,
    amount: Math.floor(Math.random() * (r.max - r.min + 1)) + r.min,
  }));
}

export const REWARD_SHOP = [
  { id: 'avatar_1', name: 'Neon Bot Avatar', cost: 100, type: 'avatar', icon: 'Bot' },
  { id: 'avatar_2', name: 'Circuit Bot Avatar', cost: 150, type: 'avatar', icon: 'Cpu' },
  { id: 'avatar_3', name: 'AI Bot Avatar', cost: 200, type: 'avatar', icon: 'Brain' },
  { id: 'avatar_4', name: 'Drone Avatar', cost: 250, type: 'avatar', icon: 'Plane' },
  { id: 'theme_1', name: 'Purple Theme', cost: 300, type: 'theme' },
  { id: 'mystery_1', name: 'Mystery Box', cost: 500, type: 'mystery' },
  { id: 'certificate', name: 'Course Certificate', cost: 1000, type: 'certificate' },
];

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 100,
  QUIZ_PASS: 50,
  QUIZ_QUESTION: 10,
  FLASHCARD_REVIEW: 15,
  ACTIVITY_COMPLETE: 30,
  DAILY_MISSION: 50,
  STREAK_BONUS: 20,
  BADGE_EARN: 100,
};