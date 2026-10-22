// Spaced repetition (Leitner boxes) over the hand-written MCQs of each chapter.
// A card moves up a box when answered correctly and back to box 1 when wrong;
// higher boxes come back after longer gaps, so revision time goes to weak points.
import { getAllLessons, getHandQuiz } from '@/lib/curriculum';

export const BOX_DAYS = [0, 1, 3, 7, 16, 35]; // box 0 = new
const DAY = 86400000;
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

function cardsFor(classId, lessonIds) {
  const out = [];
  for (const id of lessonIds) {
    getHandQuiz(classId, id).forEach((q, i) => {
      if (q.type === 'mcq' && Array.isArray(q.options) && q.options.length >= 2) out.push({ id: `${id}#${i}`, lessonId: id, q });
      else if (q.type === 'tf') out.push({ id: `${id}#${i}`, lessonId: id, q: { ...q, options: ['True', 'False'], answer: q.answer ? 0 : 1 } });
    });
  }
  return out;
}

/**
 * Today's queue: all due cards (oldest first) + up to `newPerDay` new cards from
 * chapters the student has completed (or, if none, the first chapters).
 */
export function dueCards(classId, progress, { limit = 20, newPerDay = 8 } = {}) {
  const srs = progress.srs || {};
  const done = progress.completedLessons || [];
  const lessons = getAllLessons(classId).map(l => l.id);
  const pool = done.length ? lessons.filter(id => done.includes(id)) : lessons.slice(0, 3);
  const all = cardsFor(classId, pool);
  const now = Date.now();
  const due = all.filter(c => srs[c.id] && srs[c.id].due <= now).sort((a, b) => srs[a.id].due - srs[b.id].due);
  const fresh = all.filter(c => !srs[c.id]);
  // spread new cards across chapters
  const byLesson = {};
  fresh.forEach(c => { (byLesson[c.lessonId] = byLesson[c.lessonId] || []).push(c); });
  const mixed = [];
  const keys = Object.keys(byLesson);
  for (let i = 0; mixed.length < newPerDay && keys.some(k => byLesson[k][i]); i++) keys.forEach(k => { if (byLesson[k][i] && mixed.length < newPerDay) mixed.push(byLesson[k][i]); });
  return { cards: [...due, ...mixed].slice(0, limit), dueCount: due.length, newCount: mixed.length, total: all.length };
}

export function reviewCard(srs, cardId, correct) {
  const cur = srs[cardId] || { box: 0, seen: 0, right: 0 };
  const box = correct ? Math.min(BOX_DAYS.length - 1, cur.box + 1) : 1;
  return { ...srs, [cardId]: { box, seen: cur.seen + 1, right: cur.right + (correct ? 1 : 0), due: today0() + BOX_DAYS[box] * DAY, last: Date.now() } };
}

/** How many cards are in each box (for the progress bar). */
export function boxStats(progress) {
  const counts = BOX_DAYS.map(() => 0);
  Object.values(progress.srs || {}).forEach(c => { counts[c.box] = (counts[c.box] || 0) + 1; });
  return counts;
}
