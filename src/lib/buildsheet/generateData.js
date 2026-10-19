import { getComponentById, PIN_COLORS } from '@/lib/circuit/components';
import { sanitizeCode } from './sanitizeCode';
import { generateLocalBuildSheet } from './localPinConnections';

const COMPONENT_ICON_MAP = {
  arduino: '🔧', esp32: '📱', esp8266: '📡', uno: '🔧', nano: '🔩',
  led: '💡', rgb: '🌈', resistor: '🎯', button: '🔘', buzzer: '🔊',
  servo: '⚙️', motor: '🌀', stepper: '🔄', dc: '🌀',
  ultrasonic: '📡', ir: '👁️', ldr: '🔅', temp: '🌡️', gas: '💨', sensor: '📡',
  lcd: '📟', oled: '🖥️', display: '🖥️',
  battery: '🔋', power: '⚡', breadboard: '🔌',
  relay: '🔀', bluetooth: '📶', joystick: '🕹️', motor_driver: '🚗', driver: '🚗',
  chassis: '🤖', wire: ' wire', jumper: ' wire', wheel: '⚙️',
};

export function getComponentIcon(name) {
  const lower = (name || '').toLowerCase();
  for (const key in COMPONENT_ICON_MAP) {
    if (lower.includes(key)) return COMPONENT_ICON_MAP[key];
  }
  return '📦';
}

const WIRE_COLOR_MAP = {
  red: '#EF4444', black: '#1E293B', blue: '#3B82F6',
  green: '#22C55E', purple: '#A78BFA', yellow: '#F59E0B', cyan: '#06B6D4',
  power: '#EF4444', ground: '#1E293B', digital: '#3B82F6',
  pwm: '#06B6D4', analog: '#A78BFA', signal: '#22C55E',
};

function resolveWireColor(color) {
  if (!color) return '#64748B';
  return WIRE_COLOR_MAP[color.toLowerCase()] || WIRE_COLOR_MAP[color] || color;
}

function wireColorName(pinType) {
  const map = { power: 'red', vcc: 'red', ground: 'black', gnd: 'black', digital: 'blue', pwm: 'yellow', analog: 'purple', signal: 'green' };
  return map[pinType] || 'green';
}

export function generateLabBuildSheet(project) {
  const components = project.requiredComponents.map(id => {
    const c = getComponentById(id);
    if (!c) return { name: id, quantity: 1, description: '', icon: '📦' };
    return { name: c.name, quantity: 1, description: c.category, icon: c.icon };
  });

  const pinConnections = project.correctWiring.map(w => {
    const [fromInst, fromPin] = w.from.split(':');
    const [toInst, toPin] = w.to.split(':');
    const fromComp = getComponentById(fromInst.split('_')[0]);
    const toComp = getComponentById(toInst.split('_')[0]);
    const fromPinDef = fromComp?.pins.find(p => p.id === fromPin);
    const toPinDef = toComp?.pins.find(p => p.id === toPin);

    const fromIsCtrl = fromComp?.category === 'Microcontroller';
    const ctrlComp = fromIsCtrl ? fromComp : toComp;
    const otherComp = fromIsCtrl ? toComp : fromComp;
    const ctrlPinLabel = fromIsCtrl ? fromPinDef?.label : toPinDef?.label;
    const otherPinLabel = fromIsCtrl ? toPinDef?.label : fromPinDef?.label;
    const ctrlPinId = fromIsCtrl ? fromPin : toPin;
    const otherPinId = fromIsCtrl ? toPin : fromPin;
    const pinType = (fromPinDef || toPinDef)?.type;

    return {
      controllerPin: ctrlPinLabel || '?',
      component: otherComp?.name || '?',
      componentPin: otherPinLabel || '?',
      color: PIN_COLORS[pinType] || '#64748B',
      controllerId: ctrlComp?.id || '',
      componentId: otherComp?.id || '',
      controllerPinId: ctrlPinId || '',
      componentPinId: otherPinId || '',
      wireColor: wireColorName(pinType),
    };
  });

  return {
    projectName: project.title,
    classLabel: 'Virtual Robotics Lab',
    difficulty: project.difficulty,
    estimatedTime: '1-2 hours',
    estimatedCost: '₹200-500',
    objectives: [],
    components,
    pinConnections,
    buildSteps: project.steps.map((s, i) => ({ title: `Step ${i + 1}`, description: s.instruction })),
    arduinoCode: project.code || '',
    esp32Code: '',
    codeExplanation: '',
    testingChecklist: ['All wires connected securely', 'Code uploaded successfully', 'Simulation runs correctly', 'Component responds as expected'],
    troubleshooting: [{ problem: 'Circuit not working', causes: ['Incorrect wiring', 'Loose connection', 'Wrong pin'], solutions: ['Double-check all connections', 'Verify pin assignments', 'Ensure components are properly placed'] }],
    realWorldApplications: '',
    futureImprovements: '',
  };
}

export async function generateBuildSheetData(project, projectType, classId) {
  if (projectType === 'lab') {
    return generateLabBuildSheet(project);
  }
  // If project already has pre-built pin connections (AI-generated), use directly — ZERO AI
  if (projectType === 'prebuilt' || (project.pinConnections && project.pinConnections.length > 0)) {
    return prebuiltToBuildSheet(project);
  }
  // Curriculum projects: derive everything locally from code + steps + components — ZERO AI
  return generateLocalBuildSheet(project, classId);
}

function prebuiltToBuildSheet(project) {
  const components = (project.components || []).map(c => {
    const name = typeof c === 'string' ? c : c.name;
    return { name, quantity: 1, description: '', icon: getComponentIcon(name) };
  });
  return {
    projectName: project.title || project.name,
    classLabel: project.isAIGenerated ? 'AI Generated Project' : (project.classLabel || 'Custom Project'),
    difficulty: project.difficulty || 'Beginner',
    estimatedTime: project.estimatedTime || '2-3 hours',
    estimatedCost: project.estimatedCost || '₹500-800',
    objectives: project.objectives || [],
    components,
    pinConnections: project.pinConnections || [],
    buildSteps: (project.buildSteps || project.steps || []).map((s, i) => {
      if (typeof s === 'string') return { title: `Step ${i + 1}`, description: s };
      return { title: s.title || `Step ${i + 1}`, description: s.description || s.instruction || '' };
    }),
    arduinoCode: sanitizeCode(project.arduinoCode || project.code || ''),
    esp32Code: sanitizeCode(project.esp32Code || ''),
    codeExplanation: project.codeExplanation || '',
    testingChecklist: project.testingChecklist || [],
    troubleshooting: (project.troubleshooting || []).map(t => {
      if (typeof t === 'string') {
        const parts = t.split(/[:.]/);
        return { problem: parts[0] || t, causes: [], solutions: parts.slice(1).join('').trim() || '' };
      }
      return { problem: t.problem || '', causes: t.causes || [], solutions: t.solution || t.solutions || '' };
    }),
    realWorldApplications: project.realWorldApplications || '',
    futureImprovements: project.futureImprovements || '',
    aiExplain: project.codeExplanation || '',
  };
}