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
  {
    id: 'traffic_light', title: 'Traffic Light', icon: '🚦', difficulty: 'Beginner',
    description: 'Red, yellow and green LEDs in a repeating traffic-light cycle.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'led', 'resistor'],
    required: [
      { from: { comp: 'arduino_uno', pin: 'D13' }, to: { comp: 'resistor', pin: '*' } },
      { from: { comp: 'resistor', pin: '*' }, to: { comp: 'led', pin: 'anode' } },
      { from: { comp: 'led', pin: 'cathode' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { ledPin: { trace: 'led', pin: 'anode' } },
    sim: 'led_blink',
    objective: 'Green 5 s -> yellow 2 s -> red 5 s, forever.',
    learn: [
      'Place an Arduino Uno, an LED and a 220Ω resistor.',
      'Wire D13 -> resistor -> LED anode, and LED cathode -> GND.',
      'Add two more LEDs on D11 and D12 the same way for a full traffic light.',
      'Check the circuit, then Run and watch the Serial Monitor.',
    ],
    code: (p) => `// Traffic light - RoboCraft
#define RED 11
#define YELLOW 12
#define GREEN ${p.ledPin}

void show(int r, int y, int g, const char *name, int ms) {
  digitalWrite(RED, r);
  digitalWrite(YELLOW, y);
  digitalWrite(GREEN, g);
  Serial.println(name);
  delay(ms);
}

void setup() {
  pinMode(RED, OUTPUT); pinMode(YELLOW, OUTPUT); pinMode(GREEN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  show(LOW, LOW, HIGH, "GREEN - go", 5000);
  show(LOW, HIGH, LOW, "YELLOW - slow down", 2000);
  show(HIGH, LOW, LOW, "RED - stop", 5000);
}`,
  },
  {
    id: 'ldr_light', title: 'Automatic Street Light', icon: '🌙', difficulty: 'Beginner',
    description: 'An LDR switches the LED on when it gets dark.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'ldr', 'resistor', 'led'],
    required: [
      { from: { comp: 'arduino_uno', pin: '5V' }, to: { comp: 'ldr', pin: 'a' } },
      { from: { comp: 'ldr', pin: 'b' }, to: { comp: 'arduino_uno', pin: 'A0' } },
      { from: { comp: 'ldr', pin: 'b' }, to: { comp: 'resistor', pin: '*' } },
      { from: { comp: 'resistor', pin: '*' }, to: { comp: 'arduino_uno', pin: 'GND' } },
      { from: { comp: 'arduino_uno', pin: 'D13' }, to: { comp: 'led', pin: 'anode' } },
      { from: { comp: 'led', pin: 'cathode' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { ldrPin: { trace: 'ldr', pin: 'b' }, ledPin: { trace: 'led', pin: 'anode' } },
    sim: 'ir_sensor',
    objective: 'Light below the threshold -> LED ON. Move the slider during the simulation.',
    learn: [
      'The LDR and the resistor make a voltage divider: 5V -> LDR -> A0 -> resistor -> GND.',
      'analogRead() gives 0-1023 for the light falling on the LDR.',
      'Choose a threshold and switch the LED with it.',
      'Run, then move the light slider to see the LED change.',
    ],
    code: (p) => `// Automatic street light - RoboCraft
#define LDR ${p.ldrPin}
#define LED_PIN ${p.ledPin}
#define THRESHOLD 400

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(LDR);
  if (light < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
    Serial.print("Dark ("); Serial.print(light); Serial.println(") -> light ON");
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.print("Bright ("); Serial.print(light); Serial.println(") -> light OFF");
  }
  delay(300);
}`,
  },
  {
    id: 'pot_servo', title: 'Knob-Controlled Servo', icon: '🎛️', difficulty: 'Beginner',
    description: 'Turn a potentiometer and the servo follows it (map 0-1023 to 0-180°).',
    board: 'arduino_uno',
    components: ['arduino_uno', 'potentiometer', 'servo'],
    required: [
      { from: { comp: 'arduino_uno', pin: '5V' }, to: { comp: 'potentiometer', pin: 'VCC' } },
      { from: { comp: 'potentiometer', pin: 'GND' }, to: { comp: 'arduino_uno', pin: 'GND' } },
      { from: { comp: 'potentiometer', pin: 'WIPER' }, to: { comp: 'arduino_uno', pin: 'A0' } },
      { from: { comp: 'arduino_uno', pin: '5V' }, to: { comp: 'servo', pin: 'VCC' } },
      { from: { comp: 'servo', pin: 'GND' }, to: { comp: 'arduino_uno', pin: 'GND' } },
      { from: { comp: 'arduino_uno', pin: 'D9' }, to: { comp: 'servo', pin: 'SIG' } },
    ],
    codePins: { potPin: { trace: 'potentiometer', pin: 'WIPER' }, servoPin: { trace: 'servo', pin: 'SIG' } },
    sim: 'servo_sweep',
    objective: 'The servo angle follows the knob from 0° to 180°.',
    learn: [
      'A potentiometer is a voltage divider you can turn: VCC, GND and a wiper.',
      'analogRead() returns 0-1023; map() changes that range to 0-180.',
      'Attach the servo to a PWM pin (D9).',
      'Run, then move the knob slider and watch the servo arm.',
    ],
    code: (p) => `// Knob-controlled servo - RoboCraft
#include <Servo.h>
Servo arm;

void setup() {
  arm.attach(${p.servoPin});
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(${p.potPin});
  int angle = map(raw, 0, 1023, 0, 180);
  arm.write(angle);
  Serial.print("Knob: "); Serial.print(raw);
  Serial.print("  Angle: "); Serial.println(angle);
  delay(100);
}`,
  },
  {
    id: 'parking_sensor', title: 'Reverse Parking Sensor', icon: '🅿️', difficulty: 'Intermediate',
    description: 'The buzzer beeps faster as the obstacle gets closer.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'ultrasonic', 'buzzer'],
    required: [
      { from: { comp: 'arduino_uno', pin: '5V' }, to: { comp: 'ultrasonic', pin: 'VCC' } },
      { from: { comp: 'arduino_uno', pin: 'GND' }, to: { comp: 'ultrasonic', pin: 'GND' } },
      { from: { comp: 'arduino_uno', pin: 'D9' }, to: { comp: 'ultrasonic', pin: 'TRIG' } },
      { from: { comp: 'arduino_uno', pin: 'D10' }, to: { comp: 'ultrasonic', pin: 'ECHO' } },
      { from: { comp: 'arduino_uno', pin: 'D8' }, to: { comp: 'buzzer', pin: 'pos' } },
      { from: { comp: 'buzzer', pin: 'neg' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { trigPin: { trace: 'ultrasonic', pin: 'TRIG' }, echoPin: { trace: 'ultrasonic', pin: 'ECHO' }, buzzerPin: { trace: 'buzzer', pin: 'pos' } },
    sim: 'ultrasonic',
    objective: 'Closer object -> shorter gap between beeps. Below 10 cm the buzzer stays on.',
    learn: [
      'TRIG sends a 10 µs pulse; ECHO returns the travel time of the sound.',
      'distance = time x 0.034 / 2 (speed of sound in cm per µs).',
      'Use the distance to decide the delay between beeps.',
      'Run and move the object slider towards the sensor.',
    ],
    code: (p) => `// Reverse parking sensor - RoboCraft
#define TRIG ${p.trigPin}
#define ECHO ${p.echoPin}
#define BUZZER ${p.buzzerPin}

long readDistance() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);
  if (t == 0) return 400;
  return t * 0.034 / 2;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT); pinMode(BUZZER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  long cm = readDistance();
  Serial.print("Distance: "); Serial.print(cm); Serial.println(" cm");
  if (cm < 10) {
    digitalWrite(BUZZER, HIGH);
    delay(200);
  } else if (cm < 50) {
    digitalWrite(BUZZER, HIGH); delay(60);
    digitalWrite(BUZZER, LOW);  delay(cm * 6);
  } else {
    digitalWrite(BUZZER, LOW);
    delay(200);
  }
}`,
  },
  {
    id: 'motor_speed', title: 'Motor Speed Control (L298N)', icon: '⚡', difficulty: 'Intermediate',
    description: 'Drive a DC motor through an L298N and change its speed with PWM.',
    board: 'arduino_uno',
    components: ['arduino_uno', 'motor_driver', 'dc_motor', 'battery'],
    required: [
      { from: { comp: 'arduino_uno', pin: 'D5' }, to: { comp: 'motor_driver', pin: 'ENA' } },
      { from: { comp: 'arduino_uno', pin: 'D4' }, to: { comp: 'motor_driver', pin: 'IN1' } },
      { from: { comp: 'arduino_uno', pin: 'D7' }, to: { comp: 'motor_driver', pin: 'IN2' } },
      { from: { comp: 'motor_driver', pin: 'OUT1' }, to: { comp: 'dc_motor', pin: 't1' } },
      { from: { comp: 'motor_driver', pin: 'OUT2' }, to: { comp: 'dc_motor', pin: 't2' } },
      { from: { comp: 'battery', pin: 'P' }, to: { comp: 'motor_driver', pin: '12V' } },
      { from: { comp: 'battery', pin: 'N' }, to: { comp: 'motor_driver', pin: 'GND' } },
      { from: { comp: 'motor_driver', pin: 'GND' }, to: { comp: 'arduino_uno', pin: 'GND' } },
    ],
    codePins: { enaPin: { trace: 'motor_driver', pin: 'ENA' }, in1Pin: { trace: 'motor_driver', pin: 'IN1' }, in2Pin: { trace: 'motor_driver', pin: 'IN2' } },
    sim: 'dc_motor',
    objective: 'The motor speeds up, slows down and reverses.',
    learn: [
      'IN1 HIGH + IN2 LOW = forward; swap them to go backwards; both LOW = stop.',
      'ENA takes a PWM value (0-255) which sets the speed.',
      'The motor needs its own battery - never power it from the 5V pin.',
      'Always join the battery GND and the Arduino GND (common ground).',
    ],
    code: (p) => `// Motor speed control with L298N - RoboCraft
#define ENA ${p.enaPin}
#define IN1 ${p.in1Pin}
#define IN2 ${p.in2Pin}

void drive(int speed) {           // -255 .. 255
  digitalWrite(IN1, speed > 0);
  digitalWrite(IN2, speed < 0);
  analogWrite(ENA, abs(speed));
  Serial.print("Speed: "); Serial.println(speed);
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int s = 60; s <= 255; s += 65) { drive(s); delay(1200); }
  drive(0);    delay(800);
  drive(-180); delay(1500);
  drive(0);    delay(800);
}`,
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
  if (typeof experiment.code === 'function') return experiment.code(p);
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