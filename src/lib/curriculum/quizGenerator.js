// Deterministic quiz generator — builds a 10-question quiz for ANY lesson from
// that lesson's own content (theory sections, key concepts, examples, summary).
// Zero AI credits. Hand-written quizzes (curriculum.quizzes) always win;
// this fills the gaps so no lesson shows "0 Qs".

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const firstSentences = (text, max = 2) => {
  const sents = clean(text).split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
  return sents.slice(0, max).join(' ');
};
const shorten = (s, n = 130) => {
  const t = clean(s);
  return t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
};
const normKey = (q) => clean(q).toLowerCase();

// Split theory into {heading, body, bullets} blocks
function theoryBlocks(lesson) {
  return clean(lesson.theory || '')
    .split(/\n\n+/)
    .map(raw => {
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) return null;
      let heading = null;
      let rest = lines;
      const first = lines[0];
      if ((first.endsWith(':') && first.length < 80) || (first.length <= 60 && !/[.!?]$/.test(first))) {
        heading = clean(first.replace(/:$/, ''));
        rest = lines.slice(1);
      }
      const bullets = [];
      const body = [];
      rest.forEach(l => {
        if (/^[•\-\d]/.test(l)) bullets.push(clean(l.replace(/^[•\-\d]+[.)]?\s*/, '')));
        else if (!l.endsWith(':')) body.push(l);
      });
      return { heading, body: body.join(' '), bullets };
    })
    .filter(Boolean);
}

function pickDistractors(correct, pool, count) {
  const out = [];
  const seen = new Set([normKey(correct)]);
  for (const cand of pool) {
    if (out.length >= count) break;
    const k = normKey(cand);
    if (!k || seen.has(k) || cand.length < 12 || cand.length > 140) continue;
    seen.add(k);
    out.push(cand);
  }
  return out;
}

export function generateQuizForLesson(lesson, allLessons = []) {
  const questions = [];
  const blocks = theoryBlocks(lesson);

  // ── 1. Definition MCQs from question-style headings ("What is a robot?") ──
  const answerPool = blocks.map(b => shorten(firstSentences(b.body || b.bullets.join(' '), 2))).filter(s => s.length > 20);
  const crossPool = allLessons
    .filter(l => l.id !== lesson.id && l.subject === lesson.subject)
    .map(l => shorten(l.summary || '', 1));

  let defQs = 0;
  for (const b of blocks) {
    if (defQs >= 4) break;
    if (!b.heading || !/\?$/.test(b.heading)) continue;
    const answer = shorten(firstSentences(b.body || b.bullets.join(' '), 2));
    if (!answer || answer.length < 20) continue;
    const distractors = pickDistractors(answer, [...answerPool, ...crossPool], 3);
    if (distractors.length < 3) continue;
    questions.push({
      q: clean(b.heading),
      type: 'mcq',
      options: [answer, ...distractors],
      answer: 0,
      explanation: `From the lesson "${lesson.title}": ${answer}`,
    });
    defQs++;
  }

  // ── 2. Example MCQ: which of these is an example from this lesson ──
  if ((lesson.examples || []).length > 0) {
    const correct = clean(lesson.examples[0]);
    const others = allLessons
      .filter(l => l.id !== lesson.id)
      .flatMap(l => l.examples || [])
      .slice(0, 12);
    const distractors = pickDistractors(correct, others, 3);
    if (distractors.length >= 3) {
      questions.push({
        q: `Which of these is a real-world example of "${lesson.title}" covered in this lesson?`,
        type: 'mcq',
        options: [correct, ...distractors],
        answer: 0,
        explanation: `${correct} — as covered in "${lesson.title}".`,
      });
    }
  }

  // ── 3. Key-concept MCQs from summary statements ──
  if (defQs < 3 && lesson.summary) {
    const summarySents = clean(lesson.summary).split(/(?<=[.!?])\s+/).filter(s => s.length > 25);
    for (const sent of summarySents.slice(0, 2)) {
      const distractors = pickDistractors(sent, [...answerPool, ...crossPool], 3);
      if (distractors.length < 3) continue;
      questions.push({
        q: `According to this lesson, which statement is correct?`,
        type: 'mcq',
        options: [shorten(sent), ...distractors],
        answer: 0,
        explanation: `Key idea from "${lesson.title}": ${shorten(sent)}`,
      });
    }
  }

  // ── 4. Fill-in-the-blank from key concepts appearing in the theory ──
  const theoryText = clean(lesson.theory || '');
  const fillUsed = new Set();
  for (const concept of (lesson.keyConcepts || [])) {
    if (questions.filter(q => q.type === 'fill').length >= 3) break;
    const term = clean(concept);
    if (!term || term.length < 4 || term.length > 24 || fillUsed.has(normKey(term))) continue;
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const sent = theoryText.split(/(?<=[.!?])\s+/).find(s => re.test(s) && s.length > 30 && s.length < 160);
    if (!sent) continue;
    fillUsed.add(normKey(term));
    questions.push({
      q: `Complete: ${shorten(sent).replace(re, '_____')}`,
      type: 'fill',
      answer: term,
      explanation: `The lesson "${lesson.title}" covers: ${term}.`,
    });
  }

  // ── 5. True/False from "X → Y" mapping bullets ──
  const pairBullets = [];
  blocks.forEach(b => b.bullets.forEach(bl => {
    const m = bl.match(/^(.{2,40}?)\s*→\s*(.{2,60})$/);
    if (m) pairBullets.push([clean(m[1]), clean(m[2])]);
  }));
  pairBullets.slice(0, 2).forEach(([l, r]) => {
    questions.push({
      q: `True or false: in "${lesson.title}", ${l} → ${r}.`,
      type: 'tf',
      answer: true,
      explanation: `Correct — the lesson maps ${l} to ${r}.`,
    });
  });
  if (pairBullets.length >= 2) {
    const [[l1, r1], [l2, r2]] = pairBullets;
    questions.push({
      q: `True or false: in "${lesson.title}", ${l1} → ${r2}.`,
      type: 'tf',
      answer: false,
      explanation: `Not quite — ${l1} → ${r1}, and ${l2} → ${r2}.`,
    });
  }

  // ── 6. True/False from explicit "is NOT" facts ──
  const notSent = theoryText.split(/(?<=[.!?])\s+/).find(s =>
    /\bis not\b|\bare not a part of\b|\bis NOT\b/i.test(s) && s.length > 30 && s.length < 150);
  if (notSent) {
    const positive = shorten(notSent.replace(/\bare not\b/i, 'are').replace(/\bis not\b/i, 'is').replace(/\bNOT\b/g, ''));
    if (positive.length > 25) {
      questions.push({
        q: `True or false: ${positive}`,
        type: 'tf',
        answer: false,
        explanation: `This is stated the opposite way in the lesson: ${shorten(notSent)}`,
      });
    }
  }

  // Deduplicate by question text, then take the first 10 (definitions and
  // content questions first — they are the highest quality).
  const seen = new Set();
  return questions.filter(q => {
    const k = normKey(q.q);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 10);
}