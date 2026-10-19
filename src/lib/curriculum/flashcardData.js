// Generates flash cards and interactive activities from lesson data
import { getQuizForLesson } from './index';

export function generateFlashCards(lesson) {
  if (!lesson) return [];
  const cards = [];

  // Key concepts
  if (lesson.keyConcepts) {
    lesson.keyConcepts.forEach((concept, i) => {
      cards.push({
        front: concept,
        back: extractConceptExplanation(lesson, concept),
        category: 'Key Concept',
        hint: true,
      });
    });
  }

  // Objectives
  if (lesson.objectives) {
    lesson.objectives.forEach(obj => {
      cards.push({
        front: '🎯 ' + obj,
        back: 'This is a learning objective for this lesson. Make sure you understand this concept and can apply it.',
        category: 'Objective',
        hint: true,
      });
    });
  }

  // Examples
  if (lesson.examples) {
    lesson.examples.forEach(ex => {
      cards.push({
        front: '📍 Example',
        back: ex,
        category: 'Real-World Example',
        hint: true,
      });
    });
  }

  // Summary
  if (lesson.summary) {
    cards.push({
      front: '📝 Summary',
      back: lesson.summary,
      category: 'Summary',
      hint: true,
    });
  }

  return cards;
}

function extractConceptExplanation(lesson, concept) {
  if (!lesson.theory) return 'This is a key concept from this lesson. Review the theory section for more details.';
  // Try to find the concept in the theory text
  const lowerTheory = lesson.theory.toLowerCase();
  const lowerConcept = concept.toLowerCase();
  const idx = lowerTheory.indexOf(lowerConcept);
  if (idx !== -1) {
    // Extract surrounding text (200 chars before and after)
    const start = Math.max(0, idx - 50);
    const end = Math.min(lesson.theory.length, idx + concept.length + 200);
    let snippet = lesson.theory.substring(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < lesson.theory.length) snippet = snippet + '...';
    return snippet;
  }
  return `This is a key concept: ${concept}. Review the theory section for more details.`;
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

    lesson.keyConcepts.forEach(concept => {
      const def = conceptDefs[concept] || `A key concept: ${concept}`;
      pairs.push({ left: concept, right: def });
    });
  }

  // If not enough pairs, add from quiz
  if (pairs.length < 4 && quizQuestions) {
    quizQuestions.forEach(q => {
      if (q.type === 'mcq' && pairs.length < 8) {
        const correctAnswer = q.options[q.answer];
        pairs.push({ left: q.q.substring(0, 40) + '...', right: correctAnswer });
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