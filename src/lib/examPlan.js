// Exam-season planner: given the exam date, spread the chapters that still need
// work over the days left, keep the last week for full papers, and build a short
// checklist for today.
import { getAllLessons } from '@/lib/curriculum';
import { lessonMastery } from '@/lib/adaptive';
import { dueCards } from '@/lib/srs';

const DAY = 86400000;
export const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function daysLeft(examDate) {
  if (!examDate) return null;
  const a = new Date(); a.setHours(0, 0, 0, 0);
  const b = new Date(examDate + 'T00:00:00');
  return Math.round((b - a) / DAY);
}

export function todaysPlan(classId, progress) {
  const exam = progress.examSeason;
  const left = daysLeft(exam?.date);
  if (left === null || left < 0) return null;
  const lessons = getAllLessons(classId);
  // chapters ordered weakest first
  const ranked = lessons.map(l => ({ l, m: lessonMastery(l, progress) })).sort((a, b) => a.m - b.m);
  const toRevise = ranked.filter(x => x.m < 0.7);
  const studyDays = Math.max(1, left - 6); // the last 7 days are for papers
  const perDay = left <= 6 ? 0 : Math.ceil(toRevise.length / studyDays);
  const tasks = [];
  toRevise.slice(0, Math.min(3, perDay)).forEach(({ l }) => tasks.push({ id: `rev_${l.id}`, kind: 'chapter', label: `Revise: ${l.title}`, to: `/lesson/${l.id}` }));
  const due = dueCards(classId, progress).cards.length;
  if (due) tasks.push({ id: 'srs', kind: 'srs', label: `Spaced review (${due} cards)`, to: '/revision' });
  if (left <= 14) {
    if (left <= 6 || left % 2 === 0) tasks.push({ id: 'paper', kind: 'paper', label: left <= 6 ? 'Full sample paper (timed)' : 'Section A practice paper', to: '/exam' });
  } else {
    tasks.push({ id: 'questions', kind: 'questions', label: 'Write 3 long answers from the question bank', to: '/exam' });
  }
  if (classId !== 'class_9' && left > 6 && left % 3 === 0) tasks.push({ id: 'numericals', kind: 'numericals', label: '10 numericals', to: '/problems' });
  const done = (progress.examPlanDone || {})[localDay()] || [];
  return { left, exam, tasks: tasks.map(t => ({ ...t, done: done.includes(t.id) })), remaining: toRevise.length, perDay };
}
