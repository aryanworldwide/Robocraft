// Generates flash cards and interactive activities from lesson data

// ── Finding a real answer in the lesson's own words ─────────────────────────
// Key concepts are written as short labels ("Robotics definition", "Karel
// Capek"), while the theory is written as "Question?\nAnswer" blocks. Matching
// the label against the text literally almost never hits, which is why every
// card used to flip over to "Review the theory section".

const STOP = new Set(['definition', 'definitions', 'meaning', 'concept', 'concepts', 'basics', 'introduction',
  'intro', 'overview', 'types', 'type', 'field', 'fields', 'modern', 'applications', 'application',
  'examples', 'example', 'vs', 'and', 'or', 'the', 'of', 'a', 'an', 'in', 'to', 'for', 'its', 'it',
  'what', 'is', 'are', 'how', 'why', 'with', 'using', 'use', 'uses']);

const words = (s) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
const keywords = (s) => words(s).filter(w => w.length > 2 && !STOP.has(w));

// First one or two whole sentences, never a slice through the middle of a word.
function firstSentences(text, max = 240) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  return (stop > 60 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, '')) + (stop > 60 ? '' : '…');
}

// The paragraph of theory that actually explains this concept, or null.
function theoryBlockFor(lesson, concept) {
  const theory = lesson?.theory;
  if (!theory) return null;
  const keys = keywords(concept);
  if (keys.length === 0) return null;

  let best = null, bestScore = 0;
  for (const block of theory.split(/\n{2,}/)) {
    const lines = block.split('\n');
    const heading = lines.length > 1 && (lines[0].trim().endsWith('?') || lines[0].trim().length < 60) ? lines[0] : '';
    const body = (heading ? lines.slice(1) : lines).join(' ').trim();
    if (body.length < 40) continue;

    const headWords = new Set(words(heading));
    const bodyWords = new Set(words(body));
    let score = 0;
    for (const k of keys) {
      if (headWords.has(k)) score += 3;
      else if (bodyWords.has(k)) score += 1;
    }
    // The whole label appearing verbatim is as strong a signal as there is.
    if (String(concept).length > 4 && (heading + ' ' + body).toLowerCase().includes(String(concept).toLowerCase())) score += 4;
    if (score > bestScore) { bestScore = score; best = body; }
  }
  return bestScore >= 2 ? { text: best, score: bestScore } : null;
}

// A sentence from the summary or an objective that mentions the concept.
function otherMentionOf(lesson, concept) {
  const keys = keywords(concept);
  if (!keys.length) return null;
  const pool = [];
  if (lesson?.summary) pool.push(...(String(lesson.summary).match(/[^.!?]+[.!?]*/g) || []));
  if (Array.isArray(lesson?.objectives)) pool.push(...lesson.objectives);
  for (const line of pool) {
    const w = new Set(words(line));
    if (keys.some(k => w.has(k)) && String(line).trim().length > 25) return String(line).trim();
  }
  return null;
}

// The explanation a student should see on the back of a card.
function explain(lesson, concept) {
  return theoryBlockFor(lesson, concept)?.text || otherMentionOf(lesson, concept) || null;
}

export function generateFlashCards(lesson) {
  if (!lesson) return [];
  const cards = [];

  // Key concepts. A card with nothing real on the back teaches nothing, so a
  // concept the lesson never explains is left out rather than padded.
  if (Array.isArray(lesson.keyConcepts)) {
    lesson.keyConcepts.forEach((concept) => {
      const back = explain(lesson, concept);
      if (!back) return;
      cards.push({ front: concept, back: firstSentences(back), category: 'Key Concept', hint: true });
    });
  }

  // Objectives, answered from the theory for the same reason.
  if (Array.isArray(lesson.objectives)) {
    lesson.objectives.forEach(obj => {
      const back = theoryBlockFor(lesson, obj)?.text;
      if (!back) return;
      cards.push({ front: '🎯 ' + obj, back: firstSentences(back), category: 'Objective', hint: true });
    });
  }

  // Examples
  if (Array.isArray(lesson.examples)) {
    lesson.examples.forEach(ex => {
      cards.push({ front: '📍 Example', back: ex, category: 'Real-World Example', hint: true });
    });
  }

  // Summary
  if (lesson.summary) {
    cards.push({ front: '📝 Summary', back: lesson.summary, category: 'Summary', hint: true });
  }

  return cards;
}

export function generateMatchGame(lesson, quizQuestions) {
  if (!lesson) return [];
  const pairs = [];

  // From key concepts
  if (lesson.keyConcepts) {
    const conceptDefs = {
      'Robotics': 'The branch of engineering combining mechanical, electrical, and computer science',
      'Sense-Plan-Act': 'The fundamental cycle: sense environment, plan action, then act',
      'Python': 'A programming language created by Guido van Rossum in 1991',
      'print()': 'The function used to output text in Python',
      'Binary': 'Base-2 number system using only 0 and 1',
      'AND gate': 'Outputs 1 only when ALL inputs are 1',
      'OR gate': 'Outputs 1 when ANY input is 1',
      'NOT gate': 'Inverts the input (also called inverter)',
      'XOR gate': 'Outputs 1 when inputs are different',
      'Degree of Freedom': 'Number of independent ways a system can move',
      'Servo motor': 'Precise angular positioning with built-in feedback',
      'Stepper motor': 'Moves in precise, fixed steps',
      'BLDC': 'Brushless DC motor, more efficient than brushed',
      'ADC': 'Analog-to-Digital Converter',
      'I2C': '2-wire communication protocol for sensors',
      'SPI': '4-wire high-speed communication protocol',
      'UART': '2-wire serial communication (TX/RX)',
      'PID': 'Proportional-Integral-Derivative controller',
      'Closed-loop': 'Control system that uses feedback',
      'Open-loop': 'Control system without feedback',
      'Cobot': 'Collaborative Robot designed to work alongside humans',
      'Li-Po': 'Lithium-Polymer battery, high discharge rate',
      'BMS': 'Battery Management System for safety',
      'Forward kinematics': 'Calculate end-effector position from joint angles',
      'Inverse kinematics': 'Calculate joint angles from desired position',
      'DH parameters': 'Denavit-Hartenberg convention for assigning frames',
      'SLAM': 'Simultaneous Localization and Mapping',
      'Drone': 'Unmanned Aerial Vehicle (UAV)',
      'Supervised learning': 'ML type that learns from labeled data',
      'Unsupervised learning': 'ML type that finds patterns in unlabeled data',
      'Reinforcement learning': 'ML type using trial and error with rewards',
      'Machine Learning': 'Computers learning from data without explicit programming',
      'Deep Learning': 'Uses many-layered neural networks',
      'NLP': 'Natural Language Processing - computers understanding language',
      'Computer Vision': 'AI interpreting and understanding images',
      'Moore\'s Law': 'Transistors on a chip double roughly every two years',
      'Asimov\'s Laws': 'Three rules for robot safety proposed in 1942',
      'Workspace': 'The volume a robot\'s end-effector can reach',
      'Payload': 'Maximum weight a robot can carry',
      'Repeatability': 'How consistently a robot returns to the same position',
      'Accuracy': 'How close a robot gets to a target position',
      'Grashof\'s condition': 'Determines if a link can rotate fully in a 4-bar linkage',
    };

    // A pair is only a question if the right-hand side says something the
    // left-hand side does not. "Robotics definition → A key concept: Robotics
    // definition" is not a matching exercise, so a concept the lesson never
    // defines is dropped instead of echoed back.
    const usedRight = new Set();
    lesson.keyConcepts.forEach(concept => {
      // A matching game needs a definite answer, so only a strong match counts
      // here: the hand-written definition, or a paragraph whose own heading is
      // about this concept.
      const hit = theoryBlockFor(lesson, concept);
      const explanation = conceptDefs[concept] || (hit && hit.score >= 3 ? hit.text : null);
      if (!explanation) return;
      const right = firstSentences(explanation, 110);
      // Reject an echo of the label, a bare heading, and anything already used
      // for another concept — two identical answers make the game unsolvable.
      if (!right || right.length < 25 || right.endsWith(':')) return;
      if (right.toLowerCase().includes(String(concept).toLowerCase()) && right.length < String(concept).length + 25) return;
      const fingerprint = right.toLowerCase().slice(0, 50);
      if (usedRight.has(fingerprint)) return;
      usedRight.add(fingerprint);
      pairs.push({ left: concept, right });
    });
  }

  // Top up from the quiz so there is always a game worth playing.
  if (pairs.length < 4 && Array.isArray(quizQuestions)) {
    quizQuestions.forEach(q => {
      if (q.type === 'mcq' && pairs.length < 6 && Array.isArray(q.options)) {
        const correct = q.options[q.answer];
        if (!correct) return;
        pairs.push({ left: firstSentences(q.q, 60), right: String(correct) });
      }
    });
  }

  return pairs.slice(0, 6);
}

export function generateArrangeSteps(lesson) {
  if (!lesson) return [];
  // Use project steps or lesson activities as arrange steps
  if (lesson.activity) {
    // Create steps from the lesson's content
    const steps = [
      { id: 1, text: 'Read the theory carefully', correctOrder: 0 },
      { id: 2, text: 'Review the key concepts', correctOrder: 1 },
      { id: 3, text: 'Understand the examples', correctOrder: 2 },
      { id: 4, text: 'Complete the practical activity', correctOrder: 3 },
    ];
    return steps.sort(() => Math.random() - 0.5);
  }

  // Default steps for any lesson
  const steps = [
    { id: 1, text: 'Understand the key concepts', correctOrder: 0 },
    { id: 2, text: 'Study the theory', correctOrder: 1 },
    { id: 3, text: 'Review real-world examples', correctOrder: 2 },
    { id: 4, text: 'Complete the quiz', correctOrder: 3 },
  ];
  return steps.sort(() => Math.random() - 0.5);
}

export function generateFillBlank(quizQuestions) {
  if (!quizQuestions || quizQuestions.length === 0) return [];
  const questions = [];

  quizQuestions.forEach(q => {
    if (q.type === 'fill') {
      questions.push({
        prompt: q.q,
        answer: q.answer,
        explanation: q.explanation,
        hint: 'Check the theory section',
      });
    } else if (q.type === 'tf') {
      questions.push({
        prompt: q.q + ' (Answer: True or False)',
        answer: q.answer ? 'true' : 'false',
        explanation: q.explanation,
        hint: 'Think about what you learned',
      });
    } else if (q.type === 'mcq') {
      // Convert MCQ to fill-in-the-blank by asking for the correct answer
      questions.push({
        prompt: `${q.q} (Type the correct answer)`,
        answer: q.options[q.answer],
        explanation: q.explanation,
        hint: 'One of the options from the original question',
      });
    }
  });

  return questions.slice(0, 5);
}

export function generateDidYouKnow(lesson) {
  const facts = {
    'c9_r_1': 'The word "robot" comes from the Czech word "robota" meaning forced labor!',
    'c9_r_2': 'The Sense-Plan-Act cycle is inspired by how humans process information!',
    'c9_r_3': 'Leonardo da Vinci designed a mechanical knight in 1495 — over 500 years ago!',
    'c9_r_4': 'Isaac Asimov wrote the Three Laws of Robotics in 1942, before any real robots existed!',
    'c9_r_5': 'Boston Dynamics\' Spot robot can dance better than most humans!',
    'c9_r_6': 'Amazon uses over 200,000 robots in their warehouses worldwide!',
    'c9_r_7': 'A modern smartphone has more computing power than the computers that sent humans to the Moon!',
    'c9_r_8': 'The Arduino Uno can process 16 million instructions per second!',
    'c9_r_9': 'A Roomba is a robot, but a vending machine is NOT — it lacks sensing and autonomy!',
    'c9_r_11': 'Hydraulic actuators can produce more force than any electric motor!',
    'c9_r_13': 'Your arm has 7 degrees of freedom — more than most industrial robots!',
    'c9_p_1': 'Python is named after Monty Python\'s Flying Circus, not the snake!',
    'c9_p_3': 'In Python, you can store any type of data in a variable without declaring its type!',
    'c9_p_5': 'In Python, 2 ** 8 = 256 — the ** operator means "to the power of"!',
    'c9_c_3': 'Every digital device — phones, computers, calculators — is built from logic gates!',
    'c9_c_5': 'Computers use binary because electronic circuits have only two states: ON and OFF!',
    'c9_c_6': 'The color #00D2FF in hex is the exact cyan color used in RoboCraft!',
    'c9_a_1': 'Alan Turing asked "Can machines think?" in 1950 — we\'re still debating the answer!',
    'c9_a_7': 'ChatGPT uses a type of neural network called a Transformer!',
  };
  return facts[lesson.id] || `Did you know? ${lesson.title} is a fascinating topic that connects to many areas of robotics and technology!`;
}