// Adaptive experience engine — deterministic, zero AI.
// Switches the app between "gamified" (Class 9-10) and "engineering" (Class 11-12)
// and computes mastery / weak areas / exam readiness / challenge difficulty locally.

import { getSubjects} from '@/lib/curriculum';
import { getUiMode } from '@/lib/uiMode';

// "engineering" = Pro display style (default for Class 11; anyone can switch in Settings).
export function getMode(classId) {
  if (!classId) return 'gamified';
  return getUiMode(classId) === 'pro' ? 'engineering' : 'gamified';
}

// ── Per-lesson mastery (0..1) from completion + quiz + flashcards ────────────
export function lessonMastery(lesson, progress) {
  if (!lesson) return 0;
  const completed = (progress.completedLessons || []).includes(lesson.id) ? 1 : 0;
  const scores = (progress.quizScores || {})[lesson.id] || [];
  const bestPct = scores.length ? Math.max(...scores.map(s => s.percentage || 0)) : 0;
  const quiz = bestPct / 100;
  const flash = (progress.flashcardReviews || {})[lesson.id] ? 1 : 0;
  // No completion and no quiz → unstarted
  if (completed === 0 && scores.length === 0) return 0;
  return Math.min(1, 0.45 * completed + 0.35 * quiz + 0.20 * flash);
}

function statusOf(m) {
  if (m >= 0.70) return 'mastered';
  if (m >= 0.50) return 'review';
  return 'weak';
}

// ── Per-subject mastery + concept breakdown ─────────────────────────────────
export function subjectMastery(subject, progress) {
  const lessons = subject.lessons || [];
  if (lessons.length === 0) {
    return { mastery: 0, mastered: 0, weak: 0, review: 0, concepts: [], totalConcepts: 0 };
  }
  const concepts = [];
  let sum = 0;
  lessons.forEach(lesson => {
    const lm = lessonMastery(lesson, progress);
    sum += lm;
    (lesson.keyConcepts || []).forEach(name => {
      concepts.push({
        name,
        lessonId: lesson.id,
        subjectId: subject.id,
        mastery: Math.round(lm * 100),
        status: statusOf(lm),
      });
    });
  });
  const mastery = Math.round((sum / lessons.length) * 100);
  return {
    mastery,
    concepts,
    mastered: concepts.filter(c => c.status === 'mastered').length,
    review: concepts.filter(c => c.status === 'review').length,
    weak: concepts.filter(c => c.status === 'weak').length,
    totalConcepts: concepts.length,
  };
}

// ── Overall + per-domain mastery ─────────────────────────────────────────────
export function computeMastery(classId, progress) {
  const subjects = getSubjects(classId);
  const domains = subjects.map(s => ({
    id: s.id,
    name: s.name,
    color: s.color,
    icon: s.icon,
    ...subjectMastery(s, progress),
    lessonTotal: s.lessons.length,
    lessonDone: s.lessons.filter(l => (progress.completedLessons || []).includes(l.id)).length,
  }));
  const overall = domains.length
    ? Math.round(domains.reduce((a, d) => a + d.mastery, 0) / domains.length)
    : 0;
  return { overall, domains };
}

// ── Weak areas (concepts with mastery < 50%), sorted worst-first ─────────────
export function weakAreas(classId, progress, limit = 5) {
  const { domains } = computeMastery(classId, progress);
  const all = [];
  domains.forEach(d => d.concepts.filter(c => c.status === 'weak').forEach(c => all.push({ ...c, domain: d.name })));
  all.sort((a, b) => a.mastery - b.mastery);
  return all.slice(0, limit);
}

// ── Exam readiness (mastery-weighted, with strong/weak subject split) ───────
export function examReadiness(classId, progress) {
  const { overall, domains } = computeMastery(classId, progress);
  const strong = domains.filter(d => d.mastery >= 70);
  const needsRevision = domains.filter(d => d.mastery < 70);
  return {
    readiness: overall,
    strong,
    needsRevision,
  };
}

// ── Adaptive challenge difficulty level (1-4), deterministic ─────────────────
export function challengeLevel(classId, progress) {
  const { overall } = computeMastery(classId, progress);
  const quizEntries = Object.values(progress.quizScores || {});
  const avgQuiz = quizEntries.length
    ? Math.round(quizEntries.reduce((a, s) => a + (s[s.length - 1]?.percentage || 0), 0) / quizEntries.length)
    : 0;
  const solved = (progress.engineering?.solved || []).length;
  let base = 1;
  if (avgQuiz >= 85 && overall >= 75) base = 4;
  else if (avgQuiz >= 70) base = 3;
  else if (avgQuiz >= 50) base = 2;
  else base = 1;
  return Math.min(4, base + Math.floor(solved / 3));
}

// ── Record a solved challenge in progress ───────────────────────────────────
export function recordChallengeSolved(classId, progress, updateProgress, challengeId) {
  const eng = progress.engineering || { solved: [] };
  if (eng.solved.includes(challengeId)) return;
  updateProgress(classId, { engineering: { ...eng, solved: [...eng.solved, challengeId] } });
}

// ── Recent progress: completed + next-up lessons ─────────────────────────────
export function recentProgress(classId, progress, showCompleted = 4) {
  const subjects = getSubjects(classId);
  const all = subjects.flatMap(s => s.lessons);
  const completedIds = progress.completedLessons || [];
  const completed = all.filter(l => completedIds.includes(l.id)).slice(-showCompleted).reverse();
  const nextUp = all.filter(l => !completedIds.includes(l.id)).slice(0, 3);
  return { completed, nextUp };
}