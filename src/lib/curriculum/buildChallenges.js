// Component definitions for the Build With Me virtual robotics lab

export const COMPONENTS = [
  {
    id: 'arduino_uno',
    name: 'Arduino Uno',
    icon: '🔧',
    color: '#00D2FF',
    pins: [
      { id: '5V', label: '5V', type: 'power', x: 85, y: 30 },
      { id: 'GND', label: 'GND', type: 'ground', x: 85, y: 55 },
      { id: 'D9', label: 'Pin 9', type: 'digital', x: 85, y: 80 },
      { id: 'D10', label: 'Pin 10', type: 'digital', x: 85, y: 105 },
      { id: 'D11', label: 'Pin 11', type: 'digital', x: 85, y: 130 },
      { id: 'D13', label: 'Pin 13', type: 'digital', x: 85, y: 155 },
    ],
    width: 200,
    height: 200,
  },
  {
    id: 'led',
    name: 'LED',
    icon: '💡',
    color: '#FBBF24',
    pins: [
      { id: 'A', label: 'Anode (+)', type: 'power', x: 10, y: 40 },
      { id: 'C', label: 'Cathode (−)', type: 'ground', x: 10, y: 80 },
    ],
    width: 120,
    height: 120,
  },
  {
    id: 'buzzer',
    name: 'Buzzer',
    icon: '🔊',
    color: '#F97316',
    pins: [
      { id: '+', label: 'Positive (+)', type: 'power', x: 10, y: 40 },
      { id: '-', label: 'Negative (−)', type: 'ground', x: 10, y: 80 },
    ],
    width: 120,
    height: 120,
  },
  {
    id: 'ultrasonic',
    name: 'Ultrasonic Sensor',
    icon: '📡',
    color: '#A78BFA',
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 10, y: 25 },
      { id: 'GND', label: 'GND', type: 'ground', x: 10, y: 55 },
      { id: 'TRIG', label: 'TRIG', type: 'signal', x: 10, y: 85 },
      { id: 'ECHO', label: 'ECHO', type: 'signal', x: 10, y: 115 },
    ],
    width: 140,
    height: 150,
  },
  {
    id: 'servo',
    name: 'Servo Motor',
    icon: '⚙️',
    color: '#4ADE80',
    pins: [
      { id: 'VCC', label: 'VCC (Red)', type: 'power', x: 10, y: 30 },
      { id: 'GND', label: 'GND (Brown)', type: 'ground', x: 10, y: 65 },
      { id: 'SIG', label: 'Signal (Orange)', type: 'signal', x: 10, y: 100 },
    ],
    width: 130,
    height: 140,
  },
];

export function getComponentById(id) {
  return COMPONENTS.find(c => c.id === id);
}

// Predefined build challenges
export const BUILD_CHALLENGES = [
  {
    id: 'led_blink',
    title: 'Blink an LED',
    description: 'Connect an LED to Arduino and make it blink!',
    difficulty: 'Beginner',
    components: ['arduino_uno', 'led'],
    steps: [
      { instruction: 'Place the Arduino Uno on the workspace', hint: 'Drag the Arduino from the component palette' },
      { instruction: 'Place the LED next to the Arduino', hint: 'Drag the LED component' },
      { instruction: 'Connect LED Anode (+) to Arduino Pin 13', hint: 'Click the Anode pin, then click Pin 13' },
      { instruction: 'Connect LED Cathode (−) to Arduino GND', hint: 'Click the Cathode pin, then click GND' },
      { instruction: 'Upload code and watch the LED blink!', hint: 'Click the Upload & Simulate button' },
    ],
    correctWiring: [
      { from: 'led:A', to: 'arduino_uno:D13' },
      { from: 'led:C', to: 'arduino_uno:GND' },
    ],
    code: `// LED Blink - Arduino Uno
void setup() {
  pinMode(13, OUTPUT);  // Pin 13 as output
}

void loop() {
  digitalWrite(13, HIGH);  // Turn LED ON
  delay(1000);             // Wait 1 second
  digitalWrite(13, LOW);   // Turn LED OFF
  delay(1000);             // Wait 1 second
}`,
    realWorld: {
      parts: ['Arduino Uno', 'LED', '220Ω Resistor', 'Breadboard', 'Jumper wires'],
      cost: '₹300-500',
      safety: 'Always use a 220Ω resistor with LEDs to prevent burning out.',
      testing: 'The LED should blink once every second. If it stays on or off, check your wiring.',
      troubleshooting: 'LED not blinking? Check: 1) Correct pin (13), 2) Anode to Pin, Cathode to GND, 3) Resistor in series.',
    },
  },
  {
    id: 'ultrasonic_distance',
    title: 'Ultrasonic Distance Sensor',
    description: 'Build a distance measurement system with HC-SR04!',
    difficulty: 'Intermediate',
    components: ['arduino_uno', 'ultrasonic'],
    steps: [
      { instruction: 'Place the Arduino Uno on the workspace', hint: 'Drag the Arduino from the component palette' },
      { instruction: 'Place the Ultrasonic Sensor', hint: 'Drag the ultrasonic sensor component' },
      { instruction: 'Connect VCC to Arduino 5V', hint: 'Click VCC pin, then click 5V' },
      { instruction: 'Connect GND to Arduino GND', hint: 'Click GND pin, then click Arduino GND' },
      { instruction: 'Connect TRIG to Arduino Pin 9', hint: 'Click TRIG, then click Pin 9' },
      { instruction: 'Connect ECHO to Arduino Pin 10', hint: 'Click ECHO, then click Pin 10' },
      { instruction: 'Upload code and measure distances!', hint: 'Click the Upload & Simulate button' },
    ],
    correctWiring: [
      { from: 'ultrasonic:VCC', to: 'arduino_uno:5V' },
      { from: 'ultrasonic:GND', to: 'arduino_uno:GND' },
      { from: 'ultrasonic:TRIG', to: 'arduino_uno:D9' },
      { from: 'ultrasonic:ECHO', to: 'arduino_uno:D10' },
    ],
    code: `// Ultrasonic Distance Sensor - HC-SR04
#define TRIG 9
#define ECHO 10

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long duration = pulseIn(ECHO, HIGH);
  float distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);
}`,
    realWorld: {
      parts: ['Arduino Uno', 'HC-SR04 Ultrasonic Sensor', 'Breadboard', 'Jumper wires'],
      cost: '₹400-600',
      safety: 'Do not exceed 5V on the sensor. Always double-check VCC and GND connections.',
      testing: 'Open Serial Monitor. Move your hand closer/farther — distance values should change.',
      troubleshooting: 'No readings? Check: 1) VCC to 5V not 3.3V, 2) TRIG and ECHO not swapped, 3) Serial Monitor at 9600 baud.',
    },
  },
  {
    id: 'servo_control',
    title: 'Servo Motor Control',
    description: 'Control a servo motor to rotate precisely!',
    difficulty: 'Intermediate',
    components: ['arduino_uno', 'servo'],
    steps: [
      { instruction: 'Place the Arduino Uno on the workspace', hint: 'Drag the Arduino from the component palette' },
      { instruction: 'Place the Servo Motor', hint: 'Drag the servo component' },
      { instruction: 'Connect Servo VCC to Arduino 5V', hint: 'Click VCC, then click 5V' },
      { instruction: 'Connect Servo GND to Arduino GND', hint: 'Click GND, then click Arduino GND' },
      { instruction: 'Connect Servo Signal to Arduino Pin 9', hint: 'Click Signal, then click Pin 9' },
      { instruction: 'Upload code and watch the servo move!', hint: 'Click the Upload & Simulate button' },
    ],
    correctWiring: [
      { from: 'servo:VCC', to: 'arduino_uno:5V' },
      { from: 'servo:GND', to: 'arduino_uno:GND' },
      { from: 'servo:SIG', to: 'arduino_uno:D9' },
    ],
    code: `// Servo Motor Control
#include <Servo.h>

Servo myServo;
int pos = 0;

void setup() {
  myServo.attach(9);  // Attach servo to Pin 9
}

void loop() {
  for (pos = 0; pos <= 180; pos++) {
    myServo.write(pos);
    delay(15);
  }
  for (pos = 180; pos >= 0; pos--) {
    myServo.write(pos);
    delay(15);
  }
}`,
    realWorld: {
      parts: ['Arduino Uno', 'SG90 Servo Motor', 'Breadboard', 'Jumper wires'],
      cost: '₹350-550',
      safety: 'Servos can draw high current. Use external power for multiple servos.',
      testing: 'The servo should sweep from 0° to 180° and back continuously.',
      troubleshooting: 'Servo not moving? Check: 1) 5V connected properly, 2) Signal on Pin 9, 3) Servo library installed.',
    },
  },
];

export function getBuildChallenge(id) {
  return BUILD_CHALLENGES.find(c => c.id === id);
}