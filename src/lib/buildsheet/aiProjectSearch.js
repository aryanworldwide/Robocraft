import { backend } from '@/api/client';
import { sanitizeCode, validateArduinoCode } from './sanitizeCode';
import { getProjects } from '@/lib/curriculum';
import { asList, asText } from '@/lib/aiShape';

// Search existing projects across ALL classes for a match
export function searchExistingProjects(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const allClasses = ['class_9', 'class_10', 'class_11'];
  const results = [];

  allClasses.forEach(classId => {
    const projects = getProjects(classId);
    projects.forEach(p => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const compMatch = p.components && p.components.some(c => c.toLowerCase().includes(q));
      if (titleMatch || descMatch || compMatch) {
        results.push({ ...p, _classId: classId, _matchScore: titleMatch ? 3 : descMatch ? 2 : 1 });
      }
    });
  });

  return results.sort((a, b) => b._matchScore - a._matchScore);
}

// Known project keywords → quick suggestions
const KNOWN_PROJECTS = [
  'Bluetooth Car', 'Automatic Plant Watering', 'Smart Dustbin', 'Face Tracking Robot',
  'Voice Controlled Robot', 'Smart Door Lock', 'Mars Rover', 'Drone',
  'Smart Home', 'Gesture Controlled Robot', 'Robotic Arm', 'Maze Solver',
  'Line Follower', 'Obstacle Avoider', 'Fire Fighting Robot', 'Traffic Light',
  'Ultrasonic Distance', 'LED Blink', 'Home Automation', 'Weather Station',
  'Password Lock', 'Digital Clock', 'Thermometer', 'Gas Leak Detector',
  'Water Level Indicator', 'Auto Street Light', 'PIR Motion Detector',
  'RFID Door Lock', 'Android Control Robot', 'Pick and Place Robot',
  'Self Balancing Robot', 'Solar Tracker', 'Automatic Door',
  'Color Detector', 'Soil Moisture Monitor', 'Smart Mirror',
];

export function getSearchSuggestions(query) {
  if (!query || query.trim().length < 1) return KNOWN_PROJECTS.slice(0, 8);
  const q = query.toLowerCase().trim();
  return KNOWN_PROJECTS.filter(p => p.toLowerCase().includes(q)).slice(0, 6);
}


// A last check on what the model returned. Students follow this table with real
// wires, so a pin that cannot do the job is flagged on screen rather than
// quietly handed over.
const PWM_PINS = ['D3', 'D5', 'D6', 'D9', 'D10', 'D11'];
export function validatePinConnections(pins, controller = 'Arduino Uno') {
  const issues = [];
  const uno = !/esp32/i.test(controller || '');
  const used = new Map();
  for (const p of (pins || [])) {
    const pin = String(p?.controllerPin || '').toUpperCase().trim();
    const part = p?.component || 'a component';
    if (!pin) continue;
    if (uno && (pin === 'D0' || pin === 'D1' || pin === '0' || pin === '1')) {
      issues.push(`${part} is wired to ${pin}. On an Uno those are the USB serial pins — move it to D2-D12 or uploading will fail.`);
    }
    if (pin === '5V' || pin === '3V3' || pin === '3.3V' || pin === 'GND' || pin === 'VIN') continue;
    if (used.has(pin)) issues.push(`${pin} is used twice (${used.get(pin)} and ${part}). Each signal pin drives one connection.`);
    else used.set(pin, part);
    const cp = String(p?.componentPin || '').toUpperCase();
    if (uno && /^A[0-5]$/.test(pin) === false && /ANALOG|SIG|AOUT/.test(cp) && /LDR|POTENT|MOISTURE|LM35|FLEX/i.test(part)) {
      issues.push(`${part} is an analog sensor but is wired to ${pin}. It needs A0-A5.`);
    }
    if (uno && /SERVO/i.test(part) && !PWM_PINS.includes(pin)) {
      issues.push(`The servo on ${pin} needs a PWM pin: ${PWM_PINS.join(', ')}.`);
    }
  }
  return issues;
}

// Generate a complete robotics project with AI, including pin connections for circuit rendering
export async function generateAIProject(userPrompt) {
  const idea = (userPrompt || '').trim();
  if (!idea) throw new Error('Please describe the project you want to build');

  const prompt = `You are an expert robotics engineer generating a COMPLETE Arduino project for Indian school students (classes 9-11).
A student wants to build: "${idea}"

IMPORTANT RULES:
1. Generate REALISTIC, BUILDABLE projects only. Do NOT invent impossible circuits.
2. Use standard Arduino components (Uno R3, breadboard, LEDs, resistors, servo, DC motor, ultrasonic HC-SR04, IR sensor, L298N motor driver, HC-05 Bluetooth, LCD, OLED, relay, buzzer, push button, battery, jumper wires).
3. Use only ESP32 if the project REQUIRES WiFi/Bluetooth IoT connectivity. Otherwise use Arduino Uno.
4. The Arduino code MUST be clean, compilable C++. NO HTML tags, NO CSS, NO markdown fences. Just pure Arduino code.
5. Pin connections MUST match the code exactly. Every pin used in code must appear in pinConnections.
6. Wire colors: "red" = power/VCC, "black" = ground/GND, "blue" = digital, "green" = analog, "orange" = PWM, "yellow" = signal/data.
7. PIN RULES (a wrong pin wastes a student's whole afternoon):
   - NEVER use D0 or D1 on an Arduino Uno. They are the USB serial pins, and anything wired there stops the sketch uploading.
   - Analog inputs (LDR, potentiometer, soil moisture, LM35) go on A0-A5. Digital-only pins cannot read them.
   - Servos and any analogWrite() output must be on a PWM pin: D3, D5, D6, D9, D10 or D11.
   - I2C (LCD/OLED backpack, MPU6050) is A4 = SDA and A5 = SCL on an Uno. Never anywhere else.
   - Every pin may appear ONCE. Two components must never share a signal pin (5V and GND are the only shared rails).
8. The sensor MUST actually measure what the project is about: distance -> HC-SR04, light -> LDR, temperature -> DHT11 or LM35, soil water -> moisture sensor, motion -> PIR, line following -> IR sensors, tilt/orientation -> MPU6050. Do not substitute a sensor that cannot sense the thing being asked for.

Return a JSON object with EXACTLY these fields:
- name: short catchy project name (max 40 chars)
- overview: 2-3 sentence description in simple language
- difficulty: "Beginner", "Intermediate", or "Advanced"
- estimatedTime: e.g. "2-3 hours"
- estimatedCost: e.g. "₹500-800"
- components: array of component names (strings, include quantities in name like "2× LED")
- controller: "Arduino Uno" or "ESP32" depending on project
- pinConnections: array of {controllerPin, component, componentPin, wireColor}. Map every wire. controllerPin = Arduino/ESP32 pin label (e.g. "D13", "D9", "5V", "GND", "A0"). component = component name. componentPin = component's pin label (e.g. "Anode", "Cathode", "VCC", "GND", "TRIG", "ECHO", "IN1", "IN2", "ENA", "OUT1", "OUT2", "TX", "RX", "SDA", "SCL"). wireColor = one of "red","black","blue","green","purple","yellow".
- buildSteps: array of {title, description} (6-10 steps)
- arduinoCode: complete working Arduino C++ code (pure text, no HTML, no markdown). Include comments.
- esp32Code: ESP32 code ONLY if project uses ESP32/IoT, otherwise empty string ""
- codeExplanation: line-by-line explanation in simple English (3-5 paragraphs)
- testingInstructions: how to test (2-4 sentences)
- troubleshooting: array of {problem, solution} (3-5 items)
- realWorldApplications: where this is used in real life (2-3 sentences)
- safetyTips: 3-5 safety tips for students
- futureImprovements: possible upgrades (2-3 bullet points)`;

  const res = await backend.integrations.Core.InvokeLLM({
    user_input: userPrompt,
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        overview: { type: 'string' },
        difficulty: { type: 'string' },
        estimatedTime: { type: 'string' },
        estimatedCost: { type: 'string' },
        components: { type: 'array', items: { type: 'string' } },
        controller: { type: 'string' },
        pinConnections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              controllerPin: { type: 'string' },
              component: { type: 'string' },
              componentPin: { type: 'string' },
              wireColor: { type: 'string' },
            },
          },
        },
        buildSteps: {
          type: 'array',
          items: {
            type: 'object',
            properties: { title: { type: 'string' }, description: { type: 'string' } },
          },
        },
        arduinoCode: { type: 'string' },
        esp32Code: { type: 'string' },
        codeExplanation: { type: 'string' },
        testingInstructions: { type: 'string' },
        troubleshooting: {
          type: 'array',
          items: {
            type: 'object',
            properties: { problem: { type: 'string' }, solution: { type: 'string' } },
          },
        },
        realWorldApplications: { type: 'string' },
        safetyTips: { type: 'array', items: { type: 'string' } },
        futureImprovements: { type: 'string' },
      },
    },
  });

  // Sanitize code — strip any HTML/markdown contamination
  const cleanArduino = sanitizeCode(res.arduinoCode || '');
  const cleanEsp32 = sanitizeCode(res.esp32Code || '');

  // Validate Arduino code
  const validation = validateArduinoCode(cleanArduino);
  const pinIssues = validatePinConnections(res.pinConnections, res.controller);
  if (pinIssues.length) {
    validation.issues = [...(validation.issues || []), ...pinIssues];
    validation.valid = false;
  }

  // Build the full project object compatible with BuildSheet + ProjectDetail
  const project = {
    id: `ai_${Date.now()}`,
    title: asText(res.name) || idea,
    description: asText(res.overview),
    difficulty: res.difficulty || 'Beginner',
    estimatedTime: res.estimatedTime || '2-3 hours',
    estimatedCost: res.estimatedCost || '₹500-800',
    components: asList(res.components).map(c => (c && typeof c === 'object' ? c : { name: asText(c), quantity: 1 })),
    controller: res.controller || 'Arduino Uno',
    steps: asList(res.buildSteps).map((s, i) => typeof s === 'string' ? s : `${s.title || `Step ${i+1}`}: ${s.description || ''}`),
    buildSteps: asList(res.buildSteps),
    arduinoCode: cleanArduino,
    esp32Code: cleanEsp32,
    codeExplanation: asText(res.codeExplanation),
    testingInstructions: asText(res.testingInstructions),
    testingChecklist: asText(res.testingInstructions).split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 5).slice(0, 5),
    troubleshooting: asList(res.troubleshooting).map(t => typeof t === 'string' ? t : (t.problem ? `${t.problem}: ${t.solution || ''}` : '')),
    realWorldApplications: asText(res.realWorldApplications),
    safetyTips: asList(res.safetyTips),
    futureImprovements: asText(res.futureImprovements),
    pinConnections: asList(res.pinConnections).filter(p => p && typeof p === 'object').map(p => ({
      ...p,
      color: { red: '#DC2626', black: '#171717', blue: '#2563EB', green: '#16A34A', orange: '#EA580C', yellow: '#CA8A04', purple: '#A78BFA' }[p.wireColor] || '#64748B',
    })),
    userPrompt: idea,
    isAIGenerated: true,
    validation,
  };

  return project;
}

// Convert an AI-generated project into BuildSheet-compatible data
export function aiProjectToBuildSheetData(project) {
  return {
    projectName: project.title,
    classLabel: 'AI Generated Project',
    difficulty: project.difficulty,
    estimatedTime: project.estimatedTime,
    estimatedCost: project.estimatedCost,
    objectives: [],
    components: (project.components || []).map(c => ({ name: c, quantity: 1, description: '', icon: '📦' })),
    pinConnections: project.pinConnections || [],
    buildSteps: (project.buildSteps || []).map((s, i) => ({
      title: s.title || `Step ${i + 1}`,
      description: s.description || (typeof s === 'string' ? s : ''),
    })),
    arduinoCode: project.arduinoCode || '',
    esp32Code: project.esp32Code || '',
    codeExplanation: project.codeExplanation || '',
    testingChecklist: project.testingChecklist || [],
    troubleshooting: (project.troubleshooting || []).map(t => {
      if (typeof t === 'string') {
        const [problem, ...rest] = t.split(/[:.]/);
        return { problem: problem.trim(), causes: [], solutions: rest.join('').trim() };
      }
      return { problem: t.problem || '', causes: [], solutions: t.solution || '' };
    }),
    realWorldApplications: project.realWorldApplications || '',
    futureImprovements: project.futureImprovements || '',
    safetyTips: project.safetyTips || [],
    aiExplain: project.codeExplanation || '',
  };
}

// ── Tokenize a prompt for cheap local similarity matching ───────────────────
const STOPWORDS = new Set(['a', 'an', 'the', 'i', 'want', 'to', 'build', 'make', 'create', 'with', 'and', 'or', 'for', 'my', 'me', 'please', 'using', 'system', 'robot', 'project', 'that', 'this', 'is', 'it', 'on', 'in', 'of']);
function tokenize(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .map(t => t.trim()).filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function similarity(a, b) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  ta.forEach(t => { if (tb.has(t)) overlap++; });
  // Jaccard-ish: overlap / smaller set
  return overlap / Math.min(ta.size, tb.size);
}

// ── Cached generate: curriculum first, then DB cache, then ONE AI call ──────
// DB reads do NOT cost integration credits — only InvokeLLM does. So caching
// makes repeat searches for the same/similar project effectively free.
export async function generateOrRetrieveProject(userPrompt) {
  const idea = (userPrompt || '').trim();
  if (!idea) throw new Error('Please describe the project you want to build');

  // 1) Existing curriculum project? → ZERO AI
  const existing = searchExistingProjects(idea);
  if (existing.length > 0 && existing[0]._matchScore >= 3) {
    return { type: 'curriculum', project: existing[0] };
  }

  // 2) One this student generated before? (a free read, no AI call)
  try {
    const recent = await backend.asServiceRole.entities.GeneratedProject.list('-created_date', 50);
    let best = null;
    let bestScore = 0;
    (recent || []).forEach(rec => {
      const score = similarity(idea, rec.user_prompt || '');
      if (score > bestScore) { bestScore = score; best = rec; }
    });
    if (best && bestScore >= 0.6 && best.project_data) {
      return { type: 'cached', project: best.project_data };
    }
  } catch (e) {
    // Cache unavailable — fall through to AI generation (offline-tolerant)
  }

  // 3) Genuinely new project → ONE AI call
  const project = await generateAIProject(idea);

  // 4) Keep it, so this student opening the same idea again is instant and free.
  // Lengths are clamped to what the security rules accept.
  try {
    await backend.entities.GeneratedProject.create({
      user_prompt: idea.slice(0, 300),
      project_name: String(project.title || 'Project').slice(0, 150),
      project_data: project,
      difficulty: String(project.difficulty || 'Beginner'),
    });
  } catch (e) {
    // Save failed — still return the project; just won't be cached
  }

  return { type: 'generated', project };
}