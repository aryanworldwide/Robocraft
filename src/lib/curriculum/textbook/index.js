// Full textbook notes, diagrams and board-style exam questions for every lesson.
import c9r from './c9_robotics';
import c9p from './c9_python';
import c9a from './c9_ai';
import c10 from './c10';
import c11 from './c11';
import added from './new_lessons';
import GLOSSARY from './glossary';

const ALL = { ...c9r, ...c9p, ...c9a, ...c10, ...c11, ...added };
export const TEXTBOOK = Object.fromEntries(Object.entries(ALL).map(([id, b]) => [id, b.glossary ? b : { ...b, glossary: GLOSSARY[id] || [] }]));

export function getTextbook(lessonId) {
  return TEXTBOOK[lessonId] || null;
}

export function getExamQuestions(lessonId) {
  return TEXTBOOK[lessonId]?.exam || { short: [], long: [] };
}
