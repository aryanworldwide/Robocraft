export const LAB_PROJECTS = [
  {
    id: 'led_blink',
    title: 'Blink an LED',
    description: 'Connect an LED to Arduino and make it blink every second!',
    difficulty: 'Beginner',
    icon: '💡',
    requiredComponents: ['arduino_uno', 'led'],
    simulationType: 'led',
    steps: [
      { instruction: 'Welcome! Today we will build a simple LED Blink circuit. Tap Next to begin!', hint: 'This is your first robotics project!' },
      { instruction: 'Place the Arduino Uno on the workspace. It is the brain of our circuit.', hint: 'Tap Arduino Uno in the component palette below' },
      { instruction: 'Place the LED next to the Arduino.', hint: 'Tap LED in the component palette' },
      { instruction: 'Connect LED Anode (+) to Arduino Pin D13.', hint: 'Tap the Anode pin first, then tap D13' },
      { instruction: 'Connect LED Cathode (−) to Arduino GND.', hint: 'Tap the Cathode pin first, then tap GND' },
      { instruction: 'All wires connected! Now tap Simulate to see your LED blink!', hint: 'Press the green Simulate button' },
    ],
    correctWiring: [
      { from: 'led_0:A', to: 'arduino_uno_0:D13' },
      { from: 'led_0:C', to: 'arduino_uno_0:GND' },
    ],
    code: `// LED Blink - Arduino Uno
void setup() {
  pinMode(13, OUTPUT);  // Set Pin 13 as output
}

void loop() {
  digitalWrite(13, HIGH);  // Turn LED ON
  delay(1000);             // Wait 1 second
  digitalWrite(13, LOW);   // Turn LED OFF
  delay(1000);             // Wait 1 second
}`,
  },
  {
    id: 'servo_sweep',
    title: 'Servo Motor Sweep',
    description: 'Control a servo motor to sweep back and forth like a radar!',
    difficulty: 'Beginner',
    icon: '⚙️',
    requiredComponents: ['arduino_uno', 'servo'],
    simulationType: 'servo',
    steps: [
      { instruction: 'Today we will control a Servo Motor — used in robot arms and drones!', hint: 'Servos can rotate to any angle 0° to 180°' },
      { instruction: 'Place the Arduino Uno on the workspace.', hint: 'Tap Arduino Uno in the palette' },
      { instruction: 'Place the Servo Motor next to it.', hint: 'Tap Servo Motor in the palette' },
      { instruction: 'Connect Servo VCC (Red) to Arduino 5V.', hint: 'Tap VCC pin, then tap 5V' },
      { instruction: 'Connect Servo GND (Brown) to Arduino GND.', hint: 'Tap GND pin, then tap Arduino GND' },
      { instruction: 'Connect Servo Signal (Orange) to Arduino Pin D9.', hint: 'Tap Signal pin, then tap D9' },
      { instruction: 'All wired up! Tap Simulate to watch the servo sweep!', hint: 'Press the green Simulate button' },
    ],
    correctWiring: [
      { from: 'servo_0:VCC', to: 'arduino_uno_0:5V' },
      { from: 'servo_0:GND', to: 'arduino_uno_0:GND' },
      { from: 'servo_0:SIG', to: 'arduino_uno_0:D9' },
    ],
    code: `// Servo Motor Sweep
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
  },
  {
    id: 'buzzer_melody',
    title: 'Buzzer Melody',
    description: 'Make a buzzer play musical notes and alerts!',
    difficulty: 'Beginner',
    icon: '🔊',
    requiredComponents: ['arduino_uno', 'buzzer'],
    simulationType: 'buzzer',
    steps: [
      { instruction: 'Let us build a Buzzer circuit to play sounds!', hint: 'Buzzers convert electrical signals into sound' },
      { instruction: 'Place the Arduino Uno.', hint: 'Tap Arduino Uno in the palette' },
      { instruction: 'Place the Buzzer.', hint: 'Tap Buzzer in the palette' },
      { instruction: 'Connect Buzzer Positive (+) to Arduino Pin D9.', hint: 'Tap the + pin, then tap D9' },
      { instruction: 'Connect Buzzer Negative (−) to Arduino GND.', hint: 'Tap the − pin, then tap GND' },
      { instruction: 'Tap Simulate to hear the buzzer!', hint: 'Press the green Simulate button' },
    ],
    correctWiring: [
      { from: 'buzzer_0:P', to: 'arduino_uno_0:D9' },
      { from: 'buzzer_0:N', to: 'arduino_uno_0:GND' },
    ],
    code: `// Buzzer Melody
#define BUZZER 9

void setup() {
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  tone(BUZZER, 523);  // Note C5
  delay(300);
  tone(BUZZER, 587);  // Note D5
  delay(300);
  tone(BUZZER, 659);  // Note E5
  delay(300);
  noTone(BUZZER);
  delay(1000);
}`,
  },
  {
    id: 'ultrasonic_distance',
    title: 'Ultrasonic Distance Sensor',
    description: 'Build a distance measurement system with HC-SR04!',
    difficulty: 'Intermediate',
    icon: '📡',
    requiredComponents: ['arduino_uno', 'ultrasonic'],
    simulationType: 'ultrasonic',
    steps: [
      { instruction: 'Today we will build a distance sensor — the same technology used in parking sensors!', hint: 'Ultrasonic sends sound waves to measure distance' },
      { instruction: 'Place the Arduino Uno.', hint: 'Tap Arduino Uno in the palette' },
      { instruction: 'Place the Ultrasonic Sensor.', hint: 'Tap Ultrasonic Sensor in the palette' },
      { instruction: 'Connect VCC to Arduino 5V.', hint: 'Tap VCC pin, then tap 5V' },
      { instruction: 'Connect GND to Arduino GND.', hint: 'Tap GND pin, then tap Arduino GND' },
      { instruction: 'Connect TRIG to Arduino Pin D9.', hint: 'Tap TRIG, then tap D9' },
      { instruction: 'Connect ECHO to Arduino Pin D10.', hint: 'Tap ECHO, then tap D10' },
      { instruction: 'All connected! Tap Simulate to measure distances!', hint: 'Press the green Simulate button' },
    ],
    correctWiring: [
      { from: 'ultrasonic_0:VCC', to: 'arduino_uno_0:5V' },
      { from: 'ultrasonic_0:GND', to: 'arduino_uno_0:GND' },
      { from: 'ultrasonic_0:TRIG', to: 'arduino_uno_0:D9' },
      { from: 'ultrasonic_0:ECHO', to: 'arduino_uno_0:D10' },
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
  },
  {
    id: 'motor_control',
    title: 'DC Motor Control',
    description: 'Control a DC motor with an L298N motor driver!',
    difficulty: 'Intermediate',
    icon: '🚗',
    requiredComponents: ['arduino_uno', 'motor_driver', 'dc_motor'],
    simulationType: 'motor',
    steps: [
      { instruction: 'Let us build a motor control circuit — used in robots and RC cars!', hint: 'The L298N motor driver controls motor speed and direction' },
      { instruction: 'Place the Arduino Uno.', hint: 'Tap Arduino Uno in the palette' },
      { instruction: 'Place the Motor Driver L298N.', hint: 'Tap Motor Driver in the palette' },
      { instruction: 'Place the DC Motor.', hint: 'Tap DC Motor in the palette' },
      { instruction: 'Connect Motor Driver IN1 to Arduino D9.', hint: 'Tap IN1, then tap D9' },
      { instruction: 'Connect Motor Driver ENA to Arduino D10.', hint: 'Tap ENA, then tap D10' },
      { instruction: 'Connect Motor Driver GND to Arduino GND.', hint: 'Tap GND, then tap Arduino GND' },
      { instruction: 'Connect Motor Driver OUT1 to DC Motor Terminal (+).', hint: 'Tap OUT1, then tap Motor +' },
      { instruction: 'Connect Motor Driver OUT2 to DC Motor Terminal (−).', hint: 'Tap OUT2, then tap Motor −' },
      { instruction: 'All wired! Tap Simulate to see the motor spin!', hint: 'Press the green Simulate button' },
    ],
    correctWiring: [
      { from: 'motor_driver_0:IN1', to: 'arduino_uno_0:D9' },
      { from: 'motor_driver_0:ENA', to: 'arduino_uno_0:D10' },
      { from: 'motor_driver_0:GND', to: 'arduino_uno_0:GND' },
      { from: 'motor_driver_0:OUT1', to: 'dc_motor_0:P' },
      { from: 'motor_driver_0:OUT2', to: 'dc_motor_0:N' },
    ],
    code: `// DC Motor Control with L298N
#define IN1 9
#define ENA 10

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(ENA, OUTPUT);
}

void loop() {
  digitalWrite(IN1, HIGH);     // Forward direction
  analogWrite(ENA, 200);       // Speed: 0-255
  delay(2000);

  analogWrite(ENA, 0);         // Stop
  delay(500);

  digitalWrite(IN1, LOW);      // Reverse direction
  analogWrite(ENA, 200);
  delay(2000);
}`,
  },
  {
    id: 'obstacle_robot',
    title: 'Obstacle Avoiding Robot',
    description: 'Build a robot that detects obstacles and avoids them!',
    difficulty: 'Advanced',
    icon: '🤖',
    requiredComponents: ['arduino_uno', 'ultrasonic', 'motor_driver', 'dc_motor'],
    simulationType: 'motor',
    steps: [
      { instruction: 'Today we build an Obstacle Avoiding Robot — the foundation of autonomous navigation!', hint: 'This combines sensors and motors' },
      { instruction: 'Place the Arduino Uno, Motor Driver, Ultrasonic Sensor, and DC Motor.', hint: 'Add all four components from the palette' },
      { instruction: 'Wire the Ultrasonic Sensor: VCC→5V, GND→GND, TRIG→D9, ECHO→D10.', hint: 'Connect all four sensor wires' },
      { instruction: 'Wire the Motor Driver: IN1→D2, ENA→D10, GND→GND.', hint: 'Connect motor driver to Arduino' },
      { instruction: 'Wire the Motor: OUT1→Motor+, OUT2→Motor−.', hint: 'Connect motor driver to DC motor' },
      { instruction: 'All connected! Tap Simulate to see the robot avoid obstacles!', hint: 'Press the green Simulate button' },
    ],
    correctWiring: [
      { from: 'ultrasonic_0:VCC', to: 'arduino_uno_0:5V' },
      { from: 'ultrasonic_0:GND', to: 'arduino_uno_0:GND' },
      { from: 'ultrasonic_0:TRIG', to: 'arduino_uno_0:D9' },
      { from: 'ultrasonic_0:ECHO', to: 'arduino_uno_0:D10' },
      { from: 'motor_driver_0:IN1', to: 'arduino_uno_0:D2' },
      { from: 'motor_driver_0:ENA', to: 'arduino_uno_0:D11' },
      { from: 'motor_driver_0:GND', to: 'arduino_uno_0:GND' },
      { from: 'motor_driver_0:OUT1', to: 'dc_motor_0:P' },
      { from: 'motor_driver_0:OUT2', to: 'dc_motor_0:N' },
    ],
    code: `// Obstacle Avoiding Robot
#define TRIG 9
#define ECHO 10
#define IN1 2
#define ENA 11

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(ENA, OUTPUT);
}

float getDistance() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long dur = pulseIn(ECHO, HIGH);
  return dur * 0.034 / 2;
}

void loop() {
  float dist = getDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");

  if (dist < 20) {
    // Obstacle detected — stop
    analogWrite(ENA, 0);
    delay(500);
    digitalWrite(IN1, LOW);  // Reverse
    analogWrite(ENA, 150);
    delay(1000);
  } else {
    // Path clear — move forward
    digitalWrite(IN1, HIGH);
    analogWrite(ENA, 200);
  }
  delay(100);
}`,
  },
];

export function getLabProject(id) {
  return LAB_PROJECTS.find(p => p.id === id);
}