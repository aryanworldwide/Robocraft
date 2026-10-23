import { class9Data } from './class9';
import { class10Data } from './class10';
import { class11Data } from './class11';
import { generateQuizForLesson } from './quizGenerator';
import { shuffle, getRandomQuiz } from './helpers';
import { LESSON_VIDEOS } from './videos';
import { class9ExtraProjects, class10ExtraProjects, class11ExtraProjects } from './extraProjects';
import { NEW_LESSONS, NEW_QUIZZES } from './newLessons';
import { TEXTBOOK } from './textbook';
import { MCQ_BANK } from './mcqBank';

export { shuffle, getRandomQuiz };

// Merge extra projects into curriculum data
const class9Merged = { ...class9Data, projects: [...(class9Data.projects || []), ...class9ExtraProjects] };
const class10Merged = { ...class10Data, projects: [...(class10Data.projects || []), ...class10ExtraProjects] };
const class11Merged = { ...class11Data, projects: [...(class11Data.projects || []), ...class11ExtraProjects] };

const TITLE_FIXES = { c9_r_12: 'Using Links and Joints to Create Specific Motion' };

// Reading time from the full lesson + textbook notes (≈150 words a minute).
function readingMinutes(l) {
  const book = TEXTBOOK[l.id];
  let words = (l.theory || '').split(/\s+/).length;
  if (book) {
    for (const s of book.sections || []) words += s.b.split(/\s+/).length;
    for (const q of [...(book.exam?.short || []), ...(book.exam?.long || [])]) words += (q.q + ' ' + q.a).split(/\s+/).length * 0.5;
  }
  return Math.max(l.readingTime || 0, Math.round(words / 150));
}

// Add the new syllabus chapters, swap in verified videos, fix titles and reading times.
function finalise(classId, data) {
  const extra = NEW_LESSONS[classId] || {};
  return {
    ...data,
    quizzes: Object.fromEntries([...new Set([...Object.keys(data.quizzes || {}), ...Object.keys(NEW_QUIZZES), ...Object.keys(MCQ_BANK)])]
      .map(id => [id, [...((data.quizzes || {})[id] || []), ...(NEW_QUIZZES[id] || []), ...(MCQ_BANK[id] || [])]])),
    subjects: data.subjects.map(s => ({
      ...s,
      lessons: [...s.lessons, ...(extra[s.id] || [])].map(l => {
        const v = LESSON_VIDEOS[l.id];
        const out = { ...l, title: TITLE_FIXES[l.id] || l.title, hasTextbook: !!TEXTBOOK[l.id] };
        out.readingTime = readingMinutes(out);
        return v ? { ...out, videoUrl: `https://www.youtube.com/watch?v=${v.id}`, videoTitle: v.title } : out;
      }),
    })),
  };
}

export const curricula = {
  class_9: finalise('class_9', class9Merged),
  class_10: finalise('class_10', class10Merged),
  class_11: finalise('class_11', class11Merged)
};

export function getCurriculum(classId) {
  return curricula[classId];
}

export function getAllLessons(classId) {
  const curriculum = curricula[classId];
  if (!curriculum) return [];
  return curriculum.subjects.flatMap(s => s.lessons);
}

export function getLesson(classId, lessonId) {
  const lessons = getAllLessons(classId);
  return lessons.find(l => l.id === lessonId);
}

// Which class a lesson belongs to. Links between classes (and an old bookmark
// saved before the student switched class) would otherwise dead-end.
export function findLessonAnywhere(lessonId) {
  for (const classId of Object.keys(curricula)) {
    const lesson = getAllLessons(classId).find(l => l.id === lessonId);
    if (lesson) return { classId, lesson };
  }
  return null;
}

export function getQuizForLesson(classId, lessonId) {
  const curriculum = curricula[classId];
  const hand = (curriculum && curriculum.quizzes && curriculum.quizzes[lessonId]) || [];
  const lesson = getLesson(classId, lessonId);
  if (!lesson) return hand;
  // Fill the gap: hand-written questions first, then deterministic questions
  // generated from this lesson's own content — so every lesson has a quiz.
  const generated = generateQuizForLesson(lesson, getAllLessons(classId));
  const seen = new Set(hand.map(q => (q.q || '').toLowerCase().trim()));
  const merged = [...hand];
  for (const q of generated) {
    if (merged.length >= 10) break;
    const key = (q.q || '').toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(q);
  }
  return merged;
}

// Only the hand-written questions (used for exam papers).
export function getHandQuiz(classId, lessonId) {
  return (curricula[classId]?.quizzes || {})[lessonId] || [];
}

export function getProjects(classId) {
  const curriculum = curricula[classId];
  return curriculum ? curriculum.projects || [] : [];
}

export function getProject(classId, projectId) {
  const projects = getProjects(classId);
  return projects.find(p => p.id === projectId);
}

export function getSubjects(classId) {
  const curriculum = curricula[classId];
  return curriculum ? curriculum.subjects : [];
}

export function searchContent(classId, query) {
  if (!query || query.trim().length < 2) return { lessons: [], projects: [] };
  const q = query.toLowerCase();
  const lessons = getAllLessons(classId).filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.subject.toLowerCase().includes(q) ||
    (l.theory && l.theory.toLowerCase().includes(q)) ||
    (TEXTBOOK[l.id] && TEXTBOOK[l.id].sections.some(sec => (sec.h + ' ' + sec.b).toLowerCase().includes(q))) ||
    (l.keyConcepts && l.keyConcepts.some(c => c.toLowerCase().includes(q)))
  );
  const projects = getProjects(classId).filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.components && p.components.some(c => c.toLowerCase().includes(q)))
  );
  return { lessons, projects };
}

export function getRecommendedLessons(classId, completedLessons = []) {
  const all = getAllLessons(classId);
  const incomplete = all.filter(l => !completedLessons.includes(l.id));
  // Recommend lessons not yet completed, prioritizing beginner lessons
  return incomplete
    .sort((a, b) => {
      const diff = { Beginner: 0, Intermediate: 1, Advanced: 2 };
      return (diff[a.difficulty] || 1) - (diff[b.difficulty] || 1);
    })
    .slice(0, 4);
}

export function getRecommendedProjects(classId) {
  const projects = getProjects(classId);
  return projects.slice(0, 3);
}

export function getTotalLessons(classId) {
  return getAllLessons(classId).length;
}
