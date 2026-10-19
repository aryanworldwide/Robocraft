// Experiment definitions for the Tinkercad-like lab.
// Each experiment has: required components, required connections (exact pins),
// a local code template (no AI), and a simulation type.
// Required connections use component TYPE ids and pin ids. '*' = any pin on that
// component (used for symmetric resistor terminals). 'GND'/'5V' match any pin of
// that electrical type.

export const LAB_EXPERIMENTS = [
  {
    id: 'led_blink', title: 'LED Blink', icon: '💡', difficulty: 'Beginner',
    description: 'Blink an LED on pin D13 — the classic Arduino hello-world.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'led', 'resistor'],
    required: [
      { from: { comp: 'arduino_uno', pin: 'D13' }, to: { comp: 'resistor', pin: '*' } },
      { from: { comp: 'resistor', pin: '*' }, to: { comp: 'led', pin: 'anode' } },
      { from: { comp: 'led', pin: 'cathode' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { ledPin: { trace: 'led', pin: 'anode' } },
    sim: 'led_blink',
    objective: 'Make an LED blink: 500ms ON, 500ms OFF.',
    learn: [
      'Drag an Arduino Uno onto the workbench.',
      'Add a 220Ω resistor and an LED.',
      'Connect Arduino D13 → resistor → LED anode → LED cathode → GND.',
      'Check the circuit, then program and run the simulation.',
    ],
  },
  {
    id: 'push_button', title: 'Push Button + LED', icon: '🔘', difficulty: 'Beginner',
    description: 'Turn an LED on while a push button is pressed.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'push_button', 'led', 'resistor'],
    required: [
      { from: { comp: 'arduino_uno', pin: 'D2' }, to: { comp: 'push_button', pin: 'a' } },
      { from: { comp: 'push_button', pin: 'b' }, to: { comp: 'arduino_uno', pin: 'GND' } },
      { from: { comp: 'arduino_uno', pin: 'D13' }, to: { comp: 'resistor', pin: '*' } },
      { from: { comp: 'resistor', pin: '*' }, to: { comp: 'led', pin: 'anode' } },
      { from: { comp: 'led', pin: 'cathode' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { buttonPin: { trace: 'push_button', pin: 'a' }, ledPin: { trace: 'led', pin: 'anode' } },
    sim: 'push_button',
    objective: 'Press the button → LED turns ON. Release → LED OFF.',
    learn: [
      'Place an Arduino Uno, a push button, a resistor and an LED.',
      'Connect D2 → button → GND (uses INPUT_PULLUP).',
      'Connect D13 → resistor → LED anode → GND.',
      'Check, program, then press the button during simulation.',
    ],
  },
  {
    id: 'servo_sweep', title: 'Servo Sweep', icon: '⚙️', difficulty: 'Beginner',
    description: 'Sweep a servo motor back and forth from 0° to 180°.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'servo'],
    required: [
      { from: { comp: 'arduino_uno', pin: '5V' }, to: { comp: 'servo', pin: 'VCC' } },
      { from: { comp: 'arduino_uno', pin: 'GND' }, to: { comp: 'servo', pin: 'GND' } },
      { from: { comp: 'arduino_uno', pin: 'D9' }, to: { comp: 'servo', pin: 'SIG' } },
    ],
    codePins: { servoPin: { trace: 'servo', pin: 'SIG' } },
    sim: 'servo_sweep',
    objective: 'Servo sweeps 0° → 180° → 0° continuously.',
    learn: [
      'Place an Arduino Uno and a Servo.',
      'Connect Servo VCC → 5V, GND → GND, Signal → D9.',
      'Check, program and watch the servo rotate.',
    ],
  },
  {
    id: 'ir_sensor', title: 'IR Obstacle Detection', icon: '👁️', difficulty: 'Intermediate',
    description: 'Detect an object with an IR sensor and light an LED.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'ir_sensor', 'led', 'resistor'],
    required: [
      { from: { comp: 'arduino_uno', pin: '5V' }, to: { comp: 'ir_sensor', pin: 'VCC' } },
      { from: { comp: 'arduino_uno', pin: 'GND' }, to: { comp: 'ir_sensor', pin: 'GND' } },
      { from: { comp: 'arduino_uno', pin: 'D2' }, to: { comp: 'ir_sensor', pin: 'OUT' } },
      { from: { comp: 'arduino_uno', pin: 'D13' }, to: { comp: 'resistor', pin: '*' } },
      { from: { comp: 'resistor', pin: '*' }, to: { comp: 'led', pin: 'anode' } },
      { from: { comp: 'led', pin: 'cathode' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { irPin: { trace: 'ir_sensor', pin: 'OUT' }, ledPin: { trace: 'led', pin: 'anode' } },
    sim: 'ir_sensor',
    objective: 'Move an object near the IR sensor → LED lights up.',
    learn: [
      'Place an Arduino Uno, IR sensor, LED and resistor.',
      'Power the IR sensor: 5V, GND. Connect OUT → D2.',
      'Build the LED indicator: D13 → resistor → LED → GND.',
      'Run the sim and slide the object toward the sensor.',
    ],
  },
  {
    id: 'ultrasonic', title: 'Ultrasonic Distance', icon: '📡', difficulty: 'Intermediate',
    description: 'Measure distance with HC-SR04 and print it to the Serial Monitor.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'ultrasonic', 'led', 'resistor'],
    required: [
      { from: { comp: 'arduino_uno', pin: '5V' }, to: { comp: 'ultrasonic', pin: 'VCC' } },
      { from: { comp: 'arduino_uno', pin: 'GND' }, to: { comp: 'ultrasonic', pin: 'GND' } },
      { from: { comp: 'arduino_uno', pin: 'D9' }, to: { comp: 'ultrasonic', pin: 'TRIG' } },
      { from: { comp: 'arduino_uno', pin: 'D10' }, to: { comp: 'ultrasonic', pin: 'ECHO' } },
      { from: { comp: 'arduino_uno', pin: 'D13' }, to: { comp: 'resistor', pin: '*' } },
      { from: { comp: 'resistor', pin: '*' }, to: { comp: 'led', pin: 'anode' } },
      { from: { comp: 'led', pin: 'cathode' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { trigPin: { trace: 'ultrasonic', pin: 'TRIG' }, echoPin: { trace: 'ultrasonic', pin: 'ECHO' }, ledPin: { trace: 'led', pin: 'anode' } },
    sim: 'ultrasonic',
    objective: 'Distance prints live to Serial Monitor; LED turns ON below 10 cm.',
    learn: [
      'Place an Arduino Uno, HC-SR04, LED and resistor.',
      'Power the sensor: 5V, GND. TRIG → D9, ECHO → D10.',
      'Build the LED indicator: D13 → resistor → LED → GND.',
      'Run the sim and move the object to see the distance change.',
    ],
  },
];

export function getExperiment(id) { return LAB_EXPERIMENTS.find(e => e.id === id); }

// Pin id → code literal (D13 -> 13, A0 -> A0).
export function pinToCode(pinId) {
  if (!pinId) return '0';
  if (pinId.startsWith('D')) return pinId.slice(1);
  if (pinId.startsWith('A')) return pinId;
  return pinId;
}

export function generateCode(experiment, pins) {
  const p = {};
  for (const k of Object.keys(experiment.codePins || {})) p[k] = pinToCode(pins[k]);
  switch (experiment.sim) {
    case 'led_blink':
      return `// LED Blink — RoboCraft
#define LED_PIN ${p.ledPin}

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED: ON");
  delay(500);
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED: OFF");
  delay(500);
}`;
    case 'push_button':
      return `// Push Button + LED — RoboCraft
#define BUTTON_PIN ${p.buttonPin}
#define LED_PIN ${p.ledPin}

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int pressed = (digitalRead(BUTTON_PIN) == LOW);
  digitalWrite(LED_PIN, pressed ? HIGH : LOW);
  if (pressed) Serial.println("Button: PRESSED  -> LED ON");
  else Serial.println("Button: released -> LED OFF");
  delay(100);
}`;
    case 'servo_sweep':
      return `// Servo Sweep — RoboCraft
#include <Servo.h>
Servo myservo;

void setup() {
  myservo.attach(${p.servoPin});
  Serial.begin(9600);
}

void loop() {
  for (int angle = 0; angle <= 180; angle++) {
    myservo.write(angle);
    Serial.print("Servo angle: "); Serial.println(angle);
    delay(15);
  }
  for (int angle = 180; angle >= 0; angle--) {
    myservo.write(angle);
    delay(15);
  }
}`;
    case 'ir_sensor':
      return `// IR Obstacle Detection — RoboCraft
#define IR_PIN ${p.irPin}
#define LED_PIN ${p.ledPin}

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int detected = (digitalRead(IR_PIN) == LOW);
  digitalWrite(LED_PIN, detected ? HIGH : LOW);
  if (detected) Serial.println("IR: Object detected  -> LED ON");
  else Serial.println("IR: Clear            -> LED OFF");
  delay(100);
}`;
    case 'ultrasonic':
      return `// Ultrasonic Distance — RoboCraft
#define TRIG ${p.trigPin}
#define ECHO ${p.echoPin}
#define LED_PIN ${p.ledPin}

long readDistance() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long dur = pulseIn(ECHO, HIGH);
  return dur * 0.034 / 2;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  long cm = readDistance();
  digitalWrite(LED_PIN, (cm < 10) ? HIGH : LOW);
  Serial.print("Distance: "); Serial.print(cm); Serial.println(" cm");
  delay(200);
}`;
    default:
      return '// No template available for this experiment.';
  }
}