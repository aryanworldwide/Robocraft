// Deterministic lesson-content parser — derives the new structured lesson
// sections (Concept, How It Works, Insight, Mistake, Exam Point, Thinking
// question) from existing curriculum theory text. Zero AI.

function splitRaw(theory) {
  if (!theory) return [];
  return theory.split(/\n\n+/).map(c => c.trim()).filter(c => c.length > 15);
}

function parseSection(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;
  let heading = null;
  let rest = lines;
  // First line is a heading if it ends with ':' or is short title-like
  const first = lines[0];
  if (first.endsWith(':') || first.length <= 45) {
    heading = first.replace(/:$/, '');
    rest = lines.slice(1);
  }
  const bullets = [];
  const paragraphs = [];
  let para = [];
  for (const l of rest) {
    if (/^[•-]/.test(l)) {
      if (para.length) { paragraphs.push(para.join(' ')); para = []; }
      bullets.push(l.replace(/^[•-]\s*/, ''));
    } else if (l.endsWith(':')) {
      if (para.length) { paragraphs.push(para.join(' ')); para = []; }
      paragraphs.push(l); // sub-heading line
    } else {
      para.push(l);
    }
  }
  if (para.length) paragraphs.push(para.join(' '));
  return { heading: heading || firstSentence(first), paragraphs, bullets };
}

function firstSentence(text) {
  const m = text.split(/(?<=[.!?])\s+/)[0];
  return m && m.length <= 70 ? m : text.split(/\s+/).slice(0, 8).join(' ') + '…';
}

export function splitSections(theory) {
  return splitRaw(theory).map(parseSection).filter(Boolean);
}

// Short concept intro: first paragraph of first section, trimmed to ~2 sentences
export function getConceptIntro(lesson) {
  const sections = splitSections(lesson.theory);
  if (!sections.length) return lesson.summary || '';
  const sec = sections[0];
  let p = sec.paragraphs[0] || '';
  // A line like "Python has two modes you can work in:" is a heading, not
  // content — always pull in what follows so the intro never ends with a
  // bare colon and empty content.
  if (!p || /:\s*$/.test(p) || p.length < 20) {
    const follow = sec.paragraphs[1] || sec.bullets.slice(0, 3).join(' · ');
    if (follow) p = `${p.replace(/:\s*$/, ':')} ${follow}`.trim();
  }
  const sents = p.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  return sents.slice(0, 2).join(' ') || p.slice(0, 220);
}

// "How it works" — remaining sections (skip the first concept section)
export function getHowItWorks(lesson) {
  return splitSections(lesson.theory).slice(1);
}

// Key points — curriculum keyConcepts + any "Key Points:" bullet block
export function getKeyPoints(lesson) {
  const out = [...(lesson.keyConcepts || [])];
  const raw = lesson.theory || '';
  const kpIdx = raw.search(/key\s*points\s*:/i);
  if (kpIdx >= 0) {
    const block = raw.slice(kpIdx).split(/\n\n/)[0];
    block.split('\n').forEach(l => {
      const t = l.trim();
      if (/^[•-]/.test(t)) {
        const c = t.replace(/^[•-]\s*/, '');
        if (!out.includes(c)) out.push(c);
      }
    });
  }
  return out.slice(0, 10);
}

// Extract a "Key Takeaway" line if present
export function getTakeaway(lesson) {
  const m = (lesson.theory || '').match(/key\s*takeaway\s*:?\s*([^\n]+)/i);
  return m ? m[1].trim() : lesson.summary || '';
}

// Whole-word keyword match (substring matching made 'can' hit almost every lesson)
const hasKw = (blob, k) => new RegExp(`(^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`).test(blob);

// Engineering insight — try to derive from content, else use curated fallback
const INSIGHT_MAP = [
  { kw: ['ultrasonic', 'ir sensor', 'sensor fusion', 'calibration'], text: 'In real systems, sensor readings are rarely perfect — noise, surface angle, distance and environmental conditions all affect measurements, so filtering and calibration are essential.' },
  { kw: ['motor', 'pwm', 'servo', 'stepper'], text: 'Equal PWM values do not guarantee equal wheel speeds — motors differ in characteristics, so closed-loop feedback or per-motor calibration is usually required.' },
  { kw: ['pid', 'control system', 'closed-loop'], text: 'Tuning PID is a trade-off: high P responds fast but overshoots; D dampens oscillation; I removes steady-state error but can cause wind-up. Real systems are tuned empirically.' },
  { kw: ['battery', 'li-po', 'power supply'], text: 'Power integrity is a hidden failure mode — voltage sag from motor inrush can brown-out the controller, so separate motor and logic rails and add decoupling capacitors.' },
  { kw: ['kinematics', 'dh parameters'], text: 'Forward kinematics always has one solution; inverse kinematics may have none, one, or many — and singularities are configurations where the robot loses the ability to move in a direction.' },
  { kw: ['communication protocol', 'i2c', 'spi', 'uart', 'can bus'], text: 'Protocol choice is a trade-off between speed, wire count, noise immunity and device count — CAN’s differential signalling survives the electrical noise of motors where I2C would corrupt.' },
  { kw: ['boolean', 'logic', 'gate'], text: 'De Morgan’s theorem lets you convert AND to OR with NOT — real hardware often has only one gate type, so algebraic transformation is a practical design skill, not just theory.' },
  { kw: ['microcontroller', 'mcu', 'interrupt'], text: 'ISRs must be kept short — long interrupt handlers block other time-critical events, so defer heavy work to the main loop and only set flags in the ISR.' },
  { kw: ['frame', 'structural', 'rigidity'], text: 'A frame that is too flexible wastes motor torque on deflection; one that is too heavy wastes payload capacity — FEA lets you find the stiffness-to-weight balance before manufacturing.' },
  { kw: ['dof', 'degree of freedom', 'mobility'], text: 'DOF is not the same as number of actuators — underactuated robots have fewer actuators than DOF, and overconstrained mechanisms can still move due to special geometry.' },
  { kw: ['drone', 'uav', 'quadcopter'], text: 'Flight stability is entirely a real-time control problem — the IMU rate and PID loop frequency (often 400Hz+) determine how quickly the drone can reject disturbances.' },
  { kw: ['mobile robot', 'navigation', 'slam'], text: 'Dead reckoning drifts over time because small velocity errors accumulate — SLAM corrects this by tying position estimates to observed landmarks.' },
];

export function getEngineeringInsight(lesson) {
  // Lesson-specific first: the curriculum's own notes are unique to this lesson
  // and always on-topic, so they beat any keyword-matched generic insight.
  if (lesson.notes && lesson.notes.trim().length > 20) return lesson.notes.trim();
  const blob = `${lesson.title} ${lesson.subject} ${lesson.theory || ''}`.toLowerCase();
  for (const { kw, text } of INSIGHT_MAP) {
    if (kw.some(k => hasKw(blob, k))) return text;
  }
  return getTakeaway(lesson);
}

// Common mistake — scan theory, else derive from insight map
const MISTAKE_MAP = [
  { kw: ['kinematics'], text: 'Do not confuse forward and inverse kinematics: Forward = joints → position; Inverse = position → joints.' },
  { kw: ['gear', 'torque'], text: 'Gear reduction decreases speed but INCREASES torque — it does not increase speed.' },
  { kw: ['battery'], text: 'Series connection increases voltage; parallel increases capacity. Mixing them up leads to wrong pack design.' },
  { kw: ['accuracy', 'repeatability'], text: 'Repeatability is consistency, accuracy is closeness to target — they are not the same specification.' },
  { kw: ['pid'], text: 'Adding more I does not always help — integral wind-up from sustained error can cause large overshoot.' },
  { kw: ['floating', 'pull-up'], text: 'Leaving an input pin unconnected (floating) reads random noise — always use pull-up or pull-down resistors.' },
  { kw: ['boolean'], text: 'Confusing AND with OR: AND needs BOTH true; OR needs AT LEAST ONE true.' },
];

export function getCommonMistake(lesson) {
  const blob = `${lesson.title} ${lesson.theory || ''}`.toLowerCase();
  const cm = (lesson.theory || '').match(/common\s*mistake\s*:?\s*([^\n]+)/i);
  if (cm && cm[1].length > 15) return cm[1].trim();
  for (const { kw, text } of MISTAKE_MAP) {
    if (kw.some(k => hasKw(blob, k))) return text;
  }
  return null;
}

// Exam point — the single thing to remember
export function getExamPoint(lesson) {
  const kp = getKeyPoints(lesson);
  return kp[0] || getTakeaway(lesson);
}

// "Try thinking" reasoning question — curated by keyword, else generic
const THINKING_MAP = [
  { kw: ['ultrasonic', 'ir sensor'], q: 'A robot’s ultrasonic sensor suddenly reports wrong distances. What could be causing it, and how would you confirm?' },
  { kw: ['motor', 'pwm', 'differential'], q: 'Two motors receive the same PWM command but the robot drifts left. What could be happening?' },
  { kw: ['pid', 'control'], q: 'A PID-controlled drone oscillates up and down around its target altitude. Which term would you adjust, and how?' },
  { kw: ['battery', 'power supply'], q: 'A robot resets when its motors accelerate hard. What part of the power system is failing, and why?' },
  { kw: ['kinematics'], q: 'You command a robot arm to a reachable position but inverse kinematics returns no solution. What might be wrong?' },
  { kw: ['communication', 'i2c'], q: 'An I2C sensor works on the bench but gives garbage data once motors run. Why, and how do you fix it?' },
  { kw: ['boolean', 'logic'], q: 'Using only NOT and OR gates, how would you build an AND function? (Hint: De Morgan.)' },
  { kw: ['dof'], q: 'A mechanism has Grübler DOF = 0 yet still moves. How is that possible?' },
  { kw: ['drone', 'uav'], q: 'A quadcopter drifts in wind despite GPS lock. Which controller is responsible, and why is it struggling?' },
];

export function getThinkingQuestion(lesson) {
  // Lesson-specific first: the curriculum's own activity for this lesson is a
  // unique, on-topic thinking exercise.
  if (lesson.activity && lesson.activity.trim().length > 15) return lesson.activity.trim();
  const blob = `${lesson.title} ${lesson.subject} ${lesson.theory || ''}`.toLowerCase();
  for (const { kw, q } of THINKING_MAP) {
    if (kw.some(k => hasKw(blob, k))) return q;
  }
  return `If you had to explain "${lesson.title}" to a teammate in one sentence, what would you say — and what would you warn them about?`;
}