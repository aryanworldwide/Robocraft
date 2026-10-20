import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { backend } from '@/api/client';
import { getLevel, checkBadges, XP_REWARDS, DAILY_MISSIONS, WEEKLY_MISSIONS, recordMission, openMysteryBox, MYSTERY_BOXES, localDay, REWARD_SHOP, equippedItems } from '@/lib/gamification';
import { getAllLessons } from '@/lib/curriculum';
import { useAuth } from '@/lib/AuthContext';
import { scheduleReminders } from '@/lib/reminders';

const AppContext = createContext();

const localDayOf = (iso) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export const AppProvider = ({ children }) => {
  const { user, isGuest, authChecked, logout: authLogout } = useAuth();
  const [selectedClass, setSelectedClass] = useState(null);
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [badgePopup, setBadgePopup] = useState(null);
  const [levelPopup, setLevelPopup] = useState(null);
  const syncTimeoutRef = useRef(null);
  // Always-current progress. Several updates run back-to-back in one action
  // (XP, lesson, streak, mission); reading React state would give each one the
  // same stale copy and only the last write would survive.
  const progressRef = useRef({});

  const storageKey = (uid) => `robocraft_progress_${uid || 'guest'}`;
  const classKey = (uid) => `robocraft_class_${uid || 'guest'}`;

  // Load progress when auth state is resolved
  useEffect(() => {
    if (!authChecked) return;

    const uid = user?.id || 'guest';
    let loadedClass = null;
    let loadedProgress = {};

    // For authenticated users, prefer server-synced data
    if (user && !isGuest && user.robocraft_data) {
      loadedClass = user.robocraft_data.selectedClass || null;
      loadedProgress = user.robocraft_data.progress || {};
    }

    // Fall back to localStorage
    if (!loadedClass) {
      loadedClass = localStorage.getItem(classKey(uid));
    }
    if (Object.keys(loadedProgress).length === 0) {
      const stored = localStorage.getItem(storageKey(uid));
      if (stored) {
        try { loadedProgress = JSON.parse(stored); } catch {}
      }
    }

    setSelectedClass(loadedClass);
    progressRef.current = loadedProgress;
    setProgress(loadedProgress);
    setIsLoading(false);
  }, [user, isGuest, authChecked]);

  // Debounced server sync for authenticated users (cross-device persistence)
  useEffect(() => {
    if (isLoading || !user || isGuest) return;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await backend.auth.updateMe({
          robocraft_data: { selectedClass, progress }
        });
      } catch {}
    }, 3000);

    return () => { if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current); };
  }, [progress, selectedClass, isLoading, user, isGuest]);

  // Reward Shop colour theme for the current class.
  const currentProgress = selectedClass ? progress[selectedClass] : null;
  const accentValue = equippedItems(currentProgress).accent?.value || 'cyan';
  useEffect(() => {
    const root = document.documentElement;
    if (accentValue === 'cyan') root.removeAttribute('data-accent');
    else root.setAttribute('data-accent', accentValue);
  }, [accentValue]);

  // Daily reminders (Android app): reschedule on open and once the student has
  // studied today, so today's reminder is skipped after they've done a lesson.
  const studiedToday = !!currentProgress && (currentProgress.lastStreakDate === localDay() || (currentProgress.xpDay === localDay() && (currentProgress.xpToday || 0) > 0));
  useEffect(() => {
    if (isLoading) return;
    scheduleReminders(studiedToday);
  }, [studiedToday, isLoading]);

  const selectClass = (classId) => {
    const uid = user?.id || 'guest';
    setSelectedClass(classId);
    localStorage.setItem(classKey(uid), classId);
  };

  const getProgressForClass = (classId) => {
    return progressRef.current[classId] || {
      completedLessons: [],
      quizScores: {},
      xp: 0,
      coins: 0,
      streak: 0,
      bookmarks: [],
      notes: {},
      achievements: [],
      recentlyViewed: [],
      flashcardReviews: {},
      activitiesCompleted: [],
      dailyMissions: {},
      weeklyMissions: {},
      lastActiveDate: null,
      lastStreakDate: null,
    };
  };

  const updateProgress = (classId, updates) => {
    const classProgress = getProgressForClass(classId);
    const newClassProgress = { ...classProgress, ...updates };
    const newProgress = { ...progressRef.current, [classId]: newClassProgress };
    progressRef.current = newProgress;
    setProgress(newProgress);
    const uid = user?.id || 'guest';
    localStorage.setItem(storageKey(uid), JSON.stringify(newProgress));
    return newClassProgress;
  };

  const addXP = (classId, amount) => {
    const classProgress = getProgressForClass(classId);
    const oldXp = classProgress.xp || 0;
    const oldLevel = getLevel(oldXp);
    const newXp = oldXp + amount;
    const newLevel = getLevel(newXp);
    const day = localDay();
    const xpToday = (classProgress.xpDay === day ? classProgress.xpToday || 0 : 0) + amount;
    updateProgress(classId, { xp: newXp, xpDay: day, xpToday });
    if (newLevel.levelNumber > oldLevel.levelNumber) {
      setLevelPopup(newLevel.current);
    }
    return newXp;
  };

  const checkAndAwardBadges = (classId) => {
    const classProgress = getProgressForClass(classId);
    const allLessons = getAllLessons(classId);
    const { achievements, newBadges } = checkBadges(classProgress, classId, allLessons);
    if (newBadges.length > 0) {
      updateProgress(classId, { achievements });
      addXP(classId, XP_REWARDS.BADGE_EARN * newBadges.length);
      setBadgePopup(newBadges);
    }
  };

  const updateStreak = (classId) => {
    const classProgress = getProgressForClass(classId);
    const today = localDay();
    if (classProgress.lastStreakDate === today) return;
    const yesterday = localDay(-1);
    const newStreak = classProgress.lastStreakDate === yesterday ? (classProgress.streak || 0) + 1 : 1;
    updateProgress(classId, { streak: newStreak, lastStreakDate: today });
  };

  const recordDailyMission = (classId, missionId) => {
    let classProgress = getProgressForClass(classId);
    const { progress: updated, awarded } = recordMission(classProgress, missionId, 'daily');
    if (awarded) {
      const mission = DAILY_MISSIONS.find(m => m.id === missionId);
      if (mission) {
        updateProgress(classId, updated);
        addXP(classId, mission.xp);
        updateProgress(classId, { coins: (getProgressForClass(classId).coins || 0) + mission.coins });
      }
    }
    // Check earn_100_xp
    classProgress = getProgressForClass(classId);
    if (classProgress.xpDay === localDay() && (classProgress.xpToday || 0) >= 100) {
      const { progress: u2, awarded: a2 } = recordMission(classProgress, 'earn_100_xp', 'daily');
      if (a2) {
        const m = DAILY_MISSIONS.find(x => x.id === 'earn_100_xp');
        if (m) {
          updateProgress(classId, u2);
          addXP(classId, m.xp);
          updateProgress(classId, { coins: (getProgressForClass(classId).coins || 0) + m.coins });
        }
      }
    }
  };

  const recordWeeklyMission = (classId, missionId) => {
    const classProgress = getProgressForClass(classId);
    const { progress: updated, awarded } = recordMission(classProgress, missionId, 'weekly');
    if (awarded) {
      const mission = WEEKLY_MISSIONS.find(m => m.id === missionId);
      if (mission) {
        updateProgress(classId, updated);
        addXP(classId, mission.xp);
        updateProgress(classId, { coins: (getProgressForClass(classId).coins || 0) + mission.coins });
      }
    }
  };

  // Weekly missions: 5 lessons this week, a 7-day streak, three 100% quizzes this week.
  const checkWeeklyMissions = (classId) => {
    const cp = getProgressForClass(classId);
    const weekStart = localDay(-((new Date().getDay() + 6) % 7)); // Monday
    const lessonsThisWeek = Object.values(cp.lessonDates || {}).filter(d => d >= weekStart).length;
    const perfectThisWeek = Object.values(cp.quizScores || {}).flat()
      .filter(s => s.percentage === 100 && s.date && localDayOf(s.date) >= weekStart).length;
    if (lessonsThisWeek >= 5) recordWeeklyMission(classId, 'w_complete_5');
    if ((cp.streak || 0) >= 7) recordWeeklyMission(classId, 'w_7_day_streak');
    if (perfectThisWeek >= 3) recordWeeklyMission(classId, 'w_perfect_3');
  };

  const markLessonComplete = (classId, lessonId) => {
    const classProgress = getProgressForClass(classId);
    if (!classProgress.completedLessons.includes(lessonId)) {
      addXP(classId, XP_REWARDS.LESSON_COMPLETE);
      const coins = (classProgress.coins || 0) + 10;
      updateProgress(classId, {
        completedLessons: [...classProgress.completedLessons, lessonId],
        lessonDates: { ...(classProgress.lessonDates || {}), [lessonId]: localDay() },
        coins,
        lastActiveDate: new Date().toISOString()
      });
      updateStreak(classId);
      recordDailyMission(classId, 'complete_lesson');
      checkWeeklyMissions(classId);
      setTimeout(() => checkAndAwardBadges(classId), 100);
    }
  };

  const toggleBookmark = (classId, lessonId) => {
    const classProgress = getProgressForClass(classId);
    const bookmarks = classProgress.bookmarks.includes(lessonId)
      ? classProgress.bookmarks.filter(id => id !== lessonId)
      : [...classProgress.bookmarks, lessonId];
    updateProgress(classId, { bookmarks });
  };

  const saveNote = (classId, lessonId, note) => {
    const classProgress = getProgressForClass(classId);
    updateProgress(classId, { notes: { ...classProgress.notes, [lessonId]: note } });
  };

  const recordQuizScore = (classId, lessonId, score, total) => {
    const classProgress = getProgressForClass(classId);
    const percentage = Math.round((score / total) * 100);
    const prevScores = classProgress.quizScores[lessonId] || [];
    const xpGain = score * XP_REWARDS.QUIZ_QUESTION + (percentage === 100 ? XP_REWARDS.QUIZ_PERFECT : 0);
    addXP(classId, xpGain);
    const coins = (classProgress.coins || 0) + score * 2;
    updateProgress(classId, {
      quizScores: { ...classProgress.quizScores, [lessonId]: [...prevScores, { score, total, percentage, date: new Date().toISOString() }] },
      coins,
      lastActiveDate: new Date().toISOString()
    });
    updateStreak(classId);
    recordDailyMission(classId, 'take_quiz');
    checkWeeklyMissions(classId);
    setTimeout(() => checkAndAwardBadges(classId), 100);
  };

  const addRecentlyViewed = (classId, lessonId) => {
    const classProgress = getProgressForClass(classId);
    const recent = [lessonId, ...classProgress.recentlyViewed.filter(id => id !== lessonId)].slice(0, 10);
    updateProgress(classId, { recentlyViewed: recent });
  };

  const recordFlashcardReview = (classId, lessonId) => {
    const classProgress = getProgressForClass(classId);
    const reviews = { ...(classProgress.flashcardReviews || {}) };
    if (!reviews[lessonId]) {
      reviews[lessonId] = true;
      addXP(classId, XP_REWARDS.FLASHCARD_REVIEW);
      const coins = (classProgress.coins || 0) + 5;
      updateProgress(classId, { flashcardReviews: reviews, coins });
      recordDailyMission(classId, 'review_flashcards');
      setTimeout(() => checkAndAwardBadges(classId), 100);
    }
  };

  const recordActivityComplete = (classId, lessonId, activityType) => {
    const classProgress = getProgressForClass(classId);
    const activityKey = `${lessonId}_${activityType}`;
    const activities = classProgress.activitiesCompleted || [];
    if (!activities.includes(activityKey)) {
      addXP(classId, XP_REWARDS.ACTIVITY_COMPLETE);
      const coins = (classProgress.coins || 0) + 8;
      updateProgress(classId, { activitiesCompleted: [...activities, activityKey], coins });
      recordDailyMission(classId, 'play_activity');
      setTimeout(() => checkAndAwardBadges(classId), 100);
    }
  };

  const spendCoins = (classId, amount) => {
    const classProgress = getProgressForClass(classId);
    if ((classProgress.coins || 0) >= amount) {
      updateProgress(classId, { coins: classProgress.coins - amount });
      return true;
    }
    return false;
  };

  const buyMysteryBox = (classId, boxId) => {
    const classProgress = getProgressForClass(classId);
    const coins = classProgress.coins || 0;
    const box = MYSTERY_BOXES.find(b => b.id === boxId);
    if (!box || coins < box.cost) return null;
    updateProgress(classId, { coins: coins - box.cost });
    const rewards = openMysteryBox(boxId);
    if (!rewards) return null;
    let xpGain = 0;
    let coinGain = 0;
    rewards.forEach(r => {
      if (r.type === 'xp') xpGain += r.amount;
      if (r.type === 'coins') coinGain += r.amount;
    });
    if (xpGain > 0) addXP(classId, xpGain);
    if (coinGain > 0) {
      const cp = getProgressForClass(classId);
      updateProgress(classId, { coins: (cp.coins || 0) + coinGain });
    }
    return { rewards, box };
  };

  // Reward Shop: buy (if needed) and equip an item. Returns 'equipped' | 'bought' | null.
  const buyOrEquipItem = (classId, itemId) => {
    const item = REWARD_SHOP.find(i => i.id === itemId);
    if (!item) return null;
    const cp = getProgressForClass(classId);
    const shop = cp.shop || {};
    const owned = shop.owned || [];
    const isOwned = item.cost === 0 || owned.includes(itemId);
    if (!isOwned) {
      if ((cp.coins || 0) < item.cost) return null;
      updateProgress(classId, { coins: (cp.coins || 0) - item.cost, shop: { ...shop, owned: [...owned, itemId], [item.type]: itemId } });
      return 'bought';
    }
    updateProgress(classId, { shop: { ...shop, [item.type]: itemId } });
    return 'equipped';
  };

  const getDailyMissions = (classId) => {
    const classProgress = getProgressForClass(classId);
    const today = localDay();
    const todayMissions = (classProgress.dailyMissions && classProgress.dailyMissions[today]) || { completed: [] };
    return DAILY_MISSIONS.map(m => ({ ...m, done: todayMissions.completed.includes(m.id) }));
  };

  const getWeeklyMissions = (classId) => {
    const classProgress = getProgressForClass(classId);
    const d = new Date();
    const y = d.getFullYear();
    const start = new Date(y, 0, 1);
    const week = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
    const weekId = `${y}_W${week}`;
    const weekMissions = (classProgress.weeklyMissions && classProgress.weeklyMissions[weekId]) || { completed: [] };
    return WEEKLY_MISSIONS.map(m => ({ ...m, done: weekMissions.completed.includes(m.id) }));
  };

  const logout = () => {
    setSelectedClass(null);
    progressRef.current = {};
    setProgress({});
    setIsLoading(true);
    authLogout();
  };

  return (
    <AppContext.Provider value={{
      user, isGuest, selectedClass, isLoading,
      selectClass, getProgressForClass, updateProgress,
      markLessonComplete, toggleBookmark, saveNote,
      recordQuizScore, addRecentlyViewed, logout,
      recordFlashcardReview, recordActivityComplete, addXP, spendCoins,
      badgePopup, setBadgePopup, levelPopup, setLevelPopup,
      checkAndAwardBadges, getDailyMissions, getWeeklyMissions, buyMysteryBox, buyOrEquipItem,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};