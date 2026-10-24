// Procedural robots for the 3D studio.
//
// Nothing here is a canned model file or a picture: each robot is assembled
// from the same primitives a student places by hand, at real sizes in
// millimetres, so every part can be selected, moved, measured and exported.
// The description decides which robot is built and how it is proportioned.

import { makeGroup } from './shapes';

const P = (type, size, pos, extra = {}) => ({ type, size, pos, rot: [0, 0, 0], hole: false, ...extra });

const STEEL = '#94a3b8';
const DARK = '#334155';
const ACCENT = '#0ea5e9';
const MOTOR = '#1f2937';
const RUBBER = '#111827';
const PCB = '#0f766e';

// A hobby servo, the part every one of these robots is jointed with.
function servo(pos, color = MOTOR) {
  return makeGroup([
    P('box', [40, 20, 36], [0, 0, 0], { color }),
    P('box', [54, 20, 3], [0, 26, 0], { color }),            // mounting flanges
    P('cylinder', [12, 12, 6], [11, 38, 0], { color: STEEL }), // output horn
  ], { name: 'Servo (SG90/MG996R)', pos, color });
}

// ── Robotic arm ────────────────────────────────────────────────────────────
function roboticArm({ reach = 1 } = {}) {
  const upper = 110 * reach, fore = 95 * reach;
  const parts = [
    makeGroup([
      P('cylinder', [96, 96, 14], [0, 0, 0], { color: DARK }),
      P('cylinder', [70, 70, 10], [0, 14, 0], { color: STEEL }),
      P('cylinder', [3.4, 3.4, 16], [36, 0, 0], { hole: true }),
      P('cylinder', [3.4, 3.4, 16], [-36, 0, 0], { hole: true }),
    ], { name: 'Base plate', pos: [0, 0, 0], color: DARK }),

    servo([0, 24, 0]),                                        // base rotation

    makeGroup([
      P('box', [46, 40, 56], [0, 0, 0], { color: ACCENT }),
      P('cylinder', [16, 16, 48], [0, 44, 0], { color: STEEL, rot: [90, 0, 0] }),
    ], { name: 'Shoulder bracket', pos: [0, 62, 0], color: ACCENT }),

    makeGroup([
      P('box', [26, 18, upper], [0, 0, 0], { color: STEEL }),
      P('cylinder', [18, 18, 22], [0, upper / 2, 0], { color: DARK, rot: [90, 0, 0] }),
      P('cylinder', [18, 18, 22], [0, -upper / 2, 0], { color: DARK, rot: [90, 0, 0] }),
    ], { name: 'Upper arm', pos: [0, 62 + 56 / 2 + upper / 2, 0], color: STEEL }),

    servo([0, 62 + 56 / 2 + upper + 10, 0]),                  // elbow

    makeGroup([
      P('box', [22, 16, fore], [0, 0, 0], { color: STEEL }),
      P('cylinder', [16, 16, 20], [0, fore / 2, 0], { color: DARK, rot: [90, 0, 0] }),
    ], { name: 'Forearm', pos: [0, 62 + 56 / 2 + upper + 36 + fore / 2, 0], color: STEEL }),

    makeGroup([
      P('box', [34, 22, 16], [0, 0, 0], { color: ACCENT }),
      P('box', [8, 7, 46], [11, 0, 30], { color: STEEL }),     // finger
      P('box', [8, 7, 46], [-11, 0, 30], { color: STEEL }),    // finger
      P('box', [8, 7, 14], [13, 0, 56], { color: RUBBER, rot: [0, 0, -18] }),
      P('box', [8, 7, 14], [-13, 0, 56], { color: RUBBER, rot: [0, 0, 18] }),
    ], { name: 'Gripper', pos: [0, 62 + 56 / 2 + upper + 36 + fore + 20, 0], color: ACCENT }),
  ];

  return {
    parts,
    joints: [
      { name: 'Base rotation', part: 'Servo (SG90/MG996R)', axis: 'Y', range: '0–180°', driver: 'Servo on D9' },
      { name: 'Shoulder', part: 'Shoulder bracket', axis: 'X', range: '15–165°', driver: 'Servo on D10' },
      { name: 'Elbow', part: 'Forearm', axis: 'X', range: '0–150°', driver: 'Servo on D11' },
      { name: 'Gripper', part: 'Gripper', axis: 'open/close', range: '20–90°', driver: 'Servo on D6' },
    ],
    bom: [
      ['Arduino Uno', 1, 'Runs the sketch and drives the servos'],
      ['MG996R servo', 3, 'Base, shoulder and elbow joints — these carry the load'],
      ['SG90 servo', 1, 'Gripper, which only has to pinch'],
      ['5V 3A supply', 1, 'Servos must not be powered from the Arduino\'s 5V pin'],
      ['M3 bolts and nuts', 12, 'Joining the printed links'],
    ],
    wiring: [
      ['Base servo signal', 'D9'],
      ['Shoulder servo signal', 'D10'],
      ['Elbow servo signal', 'D11'],
      ['Gripper servo signal', 'D6'],
      ['All servo V+', 'External 5V supply, NOT the Arduino 5V pin'],
      ['All servo GND', 'Joined to the supply ground AND the Arduino GND'],
    ],
    code: `#include <Servo.h>

Servo base, shoulder, elbow, grip;

void setup() {
  base.attach(9);
  shoulder.attach(10);
  elbow.attach(11);
  grip.attach(6);
  home();
}

void home() {
  base.write(90); shoulder.write(90); elbow.write(90); grip.write(60);
}

// Move a joint slowly so the arm does not jerk under its own weight.
void sweep(Servo &j, int from, int to, int stepMs) {
  int dir = (to > from) ? 1 : -1;
  for (int a = from; a != to; a += dir) { j.write(a); delay(stepMs); }
}

void loop() {
  sweep(grip, 60, 20, 12);        // open
  sweep(shoulder, 90, 60, 15);    // reach down
  sweep(grip, 20, 70, 12);        // close on the object
  sweep(shoulder, 60, 110, 15);   // lift
  sweep(base, 90, 20, 15);        // swing across
  sweep(grip, 70, 20, 12);        // release
  sweep(base, 20, 90, 15);
  home();
  delay(1000);
}`,
    notes: [
      'The joints are modelled as separate parts so you can see what rotates where; the studio does not animate them yet.',
      'Servos are shown at MG996R size (40 × 20 × 36 mm) so the brackets you design around them will fit the real thing.',
    ],
  };
}

// ── Two-wheel rover: obstacle avoider, line follower, maze solver ──────────
function rover({ sensor = 'ultrasonic' } = {}) {
  const W = 160, D = 110;
  const parts = [
    makeGroup([
      P('box', [W, D, 4], [0, 0, 0], { color: DARK }),
      P('cylinder', [3.2, 3.2, 8], [W / 2 - 12, 0, D / 2 - 12], { hole: true }),
      P('cylinder', [3.2, 3.2, 8], [-W / 2 + 12, 0, D / 2 - 12], { hole: true }),
      P('cylinder', [3.2, 3.2, 8], [W / 2 - 12, 0, -D / 2 + 12], { hole: true }),
      P('cylinder', [3.2, 3.2, 8], [-W / 2 + 12, 0, -D / 2 + 12], { hole: true }),
    ], { name: 'Chassis plate', pos: [0, 30, 0], color: DARK }),

    makeGroup([P('box', [70, 22, 22], [0, 0, 0], { color: MOTOR }),
               P('cylinder', [10, 10, 14], [40, 0, 0], { color: STEEL, rot: [0, 0, 90] })],
      { name: 'TT gear motor (left)', pos: [-W / 2 + 10, 20, 34], color: MOTOR }),
    makeGroup([P('box', [70, 22, 22], [0, 0, 0], { color: MOTOR }),
               P('cylinder', [10, 10, 14], [-40, 0, 0], { color: STEEL, rot: [0, 0, 90] })],
      { name: 'TT gear motor (right)', pos: [W / 2 - 10, 20, 34], color: MOTOR }),

    makeGroup([P('cylinder', [66, 66, 26], [0, 0, 0], { color: RUBBER, rot: [0, 0, 90] }),
               P('cylinder', [40, 40, 28], [0, 0, 0], { color: '#fbbf24', rot: [0, 0, 90] })],
      { name: 'Wheel (left)', pos: [-W / 2 - 14, 33, 34], color: RUBBER }),
    makeGroup([P('cylinder', [66, 66, 26], [0, 0, 0], { color: RUBBER, rot: [0, 0, 90] }),
               P('cylinder', [40, 40, 28], [0, 0, 0], { color: '#fbbf24', rot: [0, 0, 90] })],
      { name: 'Wheel (right)', pos: [W / 2 + 14, 33, 34], color: RUBBER }),

    makeGroup([P('sphere', [24, 24, 24], [0, 0, 0], { color: STEEL }),
               P('box', [26, 26, 10], [0, 16, 0], { color: DARK })],
      { name: 'Caster ball', pos: [0, 16, -D / 2 + 16], color: STEEL }),

    makeGroup([P('box', [68.6, 53.4, 1.6], [0, 0, 0], { color: PCB }),
               P('box', [32, 16, 8], [-14, 5, 0], { color: '#111418' })],
      { name: 'Arduino Uno', pos: [0, 36, -10], color: PCB }),

    makeGroup([P('box', [43, 20, 20], [0, 0, 0], { color: '#1e3a8a' }),
               P('box', [30, 12, 4], [0, 12, 0], { color: STEEL })],
      { name: 'L298N motor driver', pos: [0, 36, 34], color: '#1e3a8a' }),

    makeGroup([P('box', [70, 26, 56], [0, 0, 0], { color: '#1f2937' })],
      { name: '6×AA battery pack', pos: [0, 50, 6], color: '#1f2937' }),
  ];

  if (sensor === 'ultrasonic') {
    parts.push(makeGroup([
      P('box', [45, 20, 16], [0, 0, 0], { color: '#1e40af' }),
      P('cylinder', [16, 16, 12], [-11, 0, 0], { color: STEEL, rot: [90, 0, 0] }),
      P('cylinder', [16, 16, 12], [11, 0, 0], { color: STEEL, rot: [90, 0, 0] }),
    ], { name: 'HC-SR04 ultrasonic sensor', pos: [0, 44, D / 2 + 6], color: '#1e40af' }));
  } else {
    parts.push(makeGroup([
      P('box', [60, 14, 10], [0, 0, 0], { color: '#1e40af' }),
      P('cylinder', [6, 6, 5], [-18, -6, 0], { color: RUBBER }),
      P('cylinder', [6, 6, 5], [18, -6, 0], { color: RUBBER }),
    ], { name: 'IR line sensors', pos: [0, 14, D / 2 - 6], color: '#1e40af' }));
  }

  const avoider = sensor === 'ultrasonic';
  return {
    parts,
    joints: [
      { name: 'Left wheel', part: 'Wheel (left)', axis: 'Z', range: 'continuous', driver: 'L298N OUT1/OUT2, speed on ENA (D5)' },
      { name: 'Right wheel', part: 'Wheel (right)', axis: 'Z', range: 'continuous', driver: 'L298N OUT3/OUT4, speed on ENB (D6)' },
    ],
    bom: [
      ['Arduino Uno', 1, 'Reads the sensor and drives the motor driver'],
      ['L298N motor driver', 1, 'Motors must never be wired straight to the Arduino'],
      ['TT gear motor + wheel', 2, 'Differential drive — steering comes from the speed difference'],
      ['Caster ball', 1, 'The third point of contact'],
      [avoider ? 'HC-SR04 ultrasonic sensor' : 'IR line sensor', avoider ? 1 : 2, avoider ? 'Distance to whatever is ahead' : 'Tells black line from white floor'],
      ['6×AA battery pack', 1, 'Motors need their own supply, not the USB port'],
    ],
    wiring: avoider
      ? [['HC-SR04 VCC', '5V'], ['HC-SR04 GND', 'GND'], ['HC-SR04 TRIG', 'D9'], ['HC-SR04 ECHO', 'D10'],
         ['L298N IN1 / IN2', 'D2 / D3'], ['L298N IN3 / IN4', 'D4 / D7'], ['L298N ENA / ENB', 'D5 / D6 (PWM)'],
         ['L298N 12V / GND', 'Battery + / −, with GND also joined to the Arduino GND']]
      : [['Left IR OUT', 'D2'], ['Right IR OUT', 'D3'], ['IR VCC / GND', '5V / GND'],
         ['L298N IN1 / IN2', 'D4 / D7'], ['L298N IN3 / IN4', 'D8 / D12'], ['L298N ENA / ENB', 'D5 / D6 (PWM)'],
         ['L298N 12V / GND', 'Battery + / −, with GND also joined to the Arduino GND']],
    code: avoider
      ? `// Obstacle avoider: drive on, and turn when something is close.
const int TRIG = 9, ECHO = 10;
const int IN1 = 2, IN2 = 3, IN3 = 4, IN4 = 7, ENA = 5, ENB = 6;

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  int outs[] = {IN1, IN2, IN3, IN4, ENA, ENB};
  for (int i = 0; i < 6; i++) pinMode(outs[i], OUTPUT);
  Serial.begin(9600);
}

long distanceCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 30000);   // times out at about 5 m
  return us == 0 ? 400 : us / 58;
}

void drive(int l, int r) {
  digitalWrite(IN1, l > 0); digitalWrite(IN2, l < 0); analogWrite(ENA, abs(l));
  digitalWrite(IN3, r > 0); digitalWrite(IN4, r < 0); analogWrite(ENB, abs(r));
}

void loop() {
  long d = distanceCm();
  Serial.println(d);
  if (d < 20) { drive(-150, 150); delay(350); }   // spin away
  else        { drive(180, 180); }
  delay(50);
}`
      : `// Line follower: keep the black line between the two sensors.
const int LEFT = 2, RIGHT = 3;
const int IN1 = 4, IN2 = 7, IN3 = 8, IN4 = 12, ENA = 5, ENB = 6;

void setup() {
  pinMode(LEFT, INPUT); pinMode(RIGHT, INPUT);
  int outs[] = {IN1, IN2, IN3, IN4, ENA, ENB};
  for (int i = 0; i < 6; i++) pinMode(outs[i], OUTPUT);
}

void drive(int l, int r) {
  digitalWrite(IN1, l > 0); digitalWrite(IN2, l < 0); analogWrite(ENA, abs(l));
  digitalWrite(IN3, r > 0); digitalWrite(IN4, r < 0); analogWrite(ENB, abs(r));
}

void loop() {
  bool onLineL = digitalRead(LEFT) == LOW;    // LOW over black on most modules
  bool onLineR = digitalRead(RIGHT) == LOW;
  if (onLineL && onLineR)      drive(160, 160);
  else if (onLineL)            drive(80, 180);
  else if (onLineR)            drive(180, 80);
  else                         drive(120, -120);  // lost it: hunt
  delay(20);
}`,
    notes: [
      avoider
        ? 'The maze-solving version is this robot with wall-following logic added; the hardware does not change.'
        : 'Set the sensor height about 8 mm above the floor, or it reads the wrong thing.',
      'The wheels are drawn at 66 mm diameter — change that and the speed in your code changes with it.',
    ],
  };
}

// ── Five-finger robotic hand ───────────────────────────────────────────────
function roboticHand() {
  const finger = (x, len, name) => makeGroup([
    P('box', [16, 14, len * 0.45], [0, 0, len * 0.22], { color: STEEL }),
    P('cylinder', [14, 14, 16], [0, 0, len * 0.45], { color: DARK, rot: [0, 90, 0] }),
    P('box', [14, 12, len * 0.33], [0, 0, len * 0.62], { color: STEEL }),
    P('cylinder', [12, 12, 14], [0, 0, len * 0.79], { color: DARK, rot: [0, 90, 0] }),
    P('box', [12, 11, len * 0.22], [0, 0, len * 0.9], { color: ACCENT }),
  ], { name, pos: [x, 96, 10], color: STEEL });

  return {
    parts: [
      makeGroup([
        P('box', [96, 26, 86], [0, 0, 0], { color: DARK }),
        P('box', [80, 6, 70], [0, 15, 0], { color: ACCENT }),
      ], { name: 'Palm', pos: [0, 40, 0], color: DARK }),
      makeGroup([P('cylinder', [70, 70, 40], [0, 0, 0], { color: STEEL })], { name: 'Wrist', pos: [0, 10, 0], color: STEEL }),
      finger(-34, 78, 'Index finger'),
      finger(-11, 86, 'Middle finger'),
      finger(12, 80, 'Ring finger'),
      finger(35, 66, 'Little finger'),
      makeGroup([
        P('box', [18, 16, 34], [0, 0, 0], { color: STEEL }),
        P('cylinder', [14, 14, 16], [0, 0, 18], { color: DARK, rot: [0, 90, 0] }),
        P('box', [14, 13, 28], [0, 0, 34], { color: ACCENT }),
      ], { name: 'Thumb', pos: [-52, 54, 24], color: STEEL, rot: [0, 0, -35] }),
      servo([0, -24, -40]),
    ],
    joints: [
      { name: 'Index', part: 'Index finger', axis: 'curl', range: '0–90°', driver: 'Servo on D3, pulled by tendon' },
      { name: 'Middle', part: 'Middle finger', axis: 'curl', range: '0–90°', driver: 'Servo on D5' },
      { name: 'Ring', part: 'Ring finger', axis: 'curl', range: '0–90°', driver: 'Servo on D6' },
      { name: 'Little', part: 'Little finger', axis: 'curl', range: '0–90°', driver: 'Servo on D9' },
      { name: 'Thumb', part: 'Thumb', axis: 'curl', range: '0–80°', driver: 'Servo on D10' },
    ],
    bom: [
      ['Arduino Uno', 1, 'Drives the five servos'],
      ['SG90 servo', 5, 'One per finger, pulling a tendon'],
      ['Fishing line or Bowden cable', 5, 'The tendon that curls each finger'],
      ['Elastic cord', 5, 'Pulls the finger straight again when the tendon slackens'],
      ['5V 3A supply', 1, 'Five servos at once will brown out a USB port'],
    ],
    wiring: [
      ['Index / Middle / Ring servo signal', 'D3 / D5 / D6'],
      ['Little / Thumb servo signal', 'D9 / D10'],
      ['Servo V+', 'External 5V supply'],
      ['Servo GND', 'Supply ground, joined to the Arduino GND'],
    ],
    code: `#include <Servo.h>

Servo finger[5];
const int PINS[5] = {3, 5, 6, 9, 10};   // index, middle, ring, little, thumb
const int OPEN_ANGLE = 10, CLOSED_ANGLE = 90;

void setup() {
  for (int i = 0; i < 5; i++) { finger[i].attach(PINS[i]); finger[i].write(OPEN_ANGLE); }
}

void curl(int i, int angle) { finger[i].write(constrain(angle, OPEN_ANGLE, CLOSED_ANGLE)); }

void loop() {
  for (int i = 0; i < 5; i++) { curl(i, CLOSED_ANGLE); delay(200); }   // make a fist
  delay(600);
  for (int i = 4; i >= 0; i--) { curl(i, OPEN_ANGLE); delay(200); }    // open again
  delay(900);
}`,
    notes: [
      'Tendon-driven fingers: the servo pulls a line that curls the finger, and the elastic straightens it.',
      'Print the finger segments with the joints solid and drill them out, or the hinges fuse together.',
    ],
  };
}

export const ROBOT_KINDS = [
  { id: 'arm', title: 'Robotic arm', match: /\b(arm|manipulator|gantry|gripper|claw)\b|\bpick(s|ing)?\b/i, build: roboticArm },
  { id: 'hand', title: 'Robotic hand', match: /\b(hand|finger|prosthe)/i, build: roboticHand },
  { id: 'line', title: 'Line-following robot', match: /\b(line|track|follow)/i, build: () => rover({ sensor: 'ir' }) },
  { id: 'rover', title: 'Obstacle-avoiding robot', match: /\b(obstacle|avoid|maze|car|rover|vehicle|drive|wheel|bot)\b/i, build: () => rover({ sensor: 'ultrasonic' }) },
];

/** Which robot a description asks for. Falls back to the rover. */
export function classifyRobot(prompt) {
  const text = String(prompt || '');
  for (const kind of ROBOT_KINDS) if (kind.match.test(text)) return kind;
  return ROBOT_KINDS[3];
}

/**
 * Build a robot from a plain-English description.
 * Returns { kind, parts, joints, bom, wiring, code, notes }.
 */
export function buildRobot(prompt) {
  const kind = classifyRobot(prompt);
  const longReach = /\b(long|tall|big|large|reach)\b/i.test(String(prompt || ''));
  const built = kind.id === 'arm' ? kind.build({ reach: longReach ? 1.35 : 1 }) : kind.build();
  return { kind: kind.id, title: kind.title, ...built };
}
