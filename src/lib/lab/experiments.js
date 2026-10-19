// ─────────────────────────────────────────────────────────────────────────────
// Build With Me — experiment definitions (SINGLE SOURCE OF TRUTH).
// Every experiment defines: components, exact required pin-to-pin connections,
// matching Arduino code, simulation config, and voice guidance steps.
// ZERO AI / integration credits — all local and deterministic.
// ─────────────────────────────────────────────────────────────────────────────

export const EXPERIMENTS = [
  {
    id: 'led_blink',
    title: 'LED Blink',
    description: 'Make an LED turn on and off every second using Arduino.',
    difficulty: 'Beginner',
    icon: '💡',
    board: 'arduino_uno',
    components: [
      { id: 'resistor', role: '220Ω Resistor' },
      { id: 'led', role: 'LED' },
    ],
    requiredConnections: [
      { from: 'arduino_uno_0:D13', to: 'resistor_0:A', purpose: 'Digital output to resistor', signalType: 'Digital' },
      { from: 'resistor_0:B', to: 'led_0:A', purpose: 'Current limiting for LED', signalType: 'Signal' },
      { from: 'led_0:C', to: 'arduino_uno_0:GND', purpose: 'Ground return', signalType: 'Ground' },
    ],
    code: `// LED Blink - Arduino Uno
#define LED_PIN 13

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // LED ON
  delay(1000);                  // wait 1 second
  digitalWrite(LED_PIN, LOW);    // LED OFF
  delay(1000);                  // wait 1 second
}`,
    codeExplanation: 'LED_PIN 13 is set as OUTPUT. In loop(), digitalWrite(HIGH) turns the LED on and digitalWrite(LOW) turns it off. delay(1000) waits 1000 ms (1 second) between each state, so the LED blinks.',
    sim: { type: 'led', onMs: 1000, offMs: 1000 },
    voiceSteps: [
      'First, place the Arduino Uno.',
      'Now place the 220 ohm resistor.',
      'Place the LED next to the resistor.',
      'Connect Arduino pin D13 to the resistor.',
      'Good. Now connect the other end of the resistor to the LED anode.',
      'Finally connect the LED cathode to Arduino GND.',
      'All wiring is correct. Now lets program and simulate.',
    ],
  },
  {
    id: 'push_button',
    title: 'Push Button LED',
    description: 'Turn an LED on while a button is pressed.',
    difficulty: 'Beginner',
    icon: '🔘',
    board: 'arduino_uno',
    components: [
      { id: 'push_button', role: 'Push Button' },
      { id: 'resistor', role: '220Ω Resistor' },
      { id: 'led', role: 'LED' },
    ],
    requiredConnections: [
      { from: 'arduino_uno_0:D2', to: 'push_button_0:A', purpose: 'Digital input (INPUT_PULLUP)', signalType: 'Digital' },
      { from: 'push_button_0:B', to: 'arduino_uno_0:GND', purpose: 'Button to ground', signalType: 'Ground' },
      { from: 'arduino_uno_0:D13', to: 'resistor_0:A', purpose: 'Digital output to resistor', signalType: 'Digital' },
      { from: 'resistor_0:B', to: 'led_0:A', purpose: 'Current limiting for LED', signalType: 'Signal' },
      { from: 'led_0:C', to: 'arduino_uno_0:GND', purpose: 'Ground return', signalType: 'Ground' },
    ],
    code: `// Push Button controls LED - Arduino Uno
#define BUTTON_PIN 2
#define LED_PIN 13

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_PIN, HIGH);   // pressed -> LED ON
  } else {
    digitalWrite(LED_PIN, LOW);    // released -> LED OFF
  }
}`,
    codeExplanation: 'BUTTON_PIN 2 uses INPUT_PULLUP, so it reads HIGH when released and LOW when pressed. When pressed (LOW), the LED turns on; when released (HIGH), it turns off.',
    sim: { type: 'button' },
    voiceSteps: [
      'Place the Arduino Uno.',
      'Place the push button.',
      'Connect Arduino pin D2 to button pin A.',
      'Connect button pin B to Arduino GND.',
      'Place the resistor and LED for the output.',
      'Connect D13 to the resistor, resistor to LED anode, LED cathode to GND.',
      'Wiring done. Press the virtual button in simulation to light the LED.',
    ],
  },
  {
    id: 'servo_sweep',
    title: 'Servo Sweep',
    description: 'Sweep a servo motor back and forth like a radar.',
    difficulty: 'Beginner',
    icon: '⚙️',
    board: 'arduino_uno',
    components: [{ id: 'servo', role: 'Servo Motor' }],
    requiredConnections: [
      { from: 'arduino_uno_0:5V', to: 'servo_0:VCC', purpose: 'Servo power', signalType: 'Power' },
      { from: 'arduino_uno_0:GND', to: 'servo_0:GND', purpose: 'Servo ground', signalType: 'Ground' },
      { from: 'arduino_uno_0:D9', to: 'servo_0:SIG', purpose: 'PWM control signal', signalType: 'PWM' },
    ],
    code: `// Servo Sweep - Arduino Uno
#include <Servo.h>
#define SERVO_PIN 9

Servo myServo;
int pos = 0;

void setup() {
  myServo.attach(SERVO_PIN);
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
    codeExplanation: 'The servo is attached to pin 9. The first for-loop moves it from 0 to 180 degrees, the second from 180 back to 0. delay(15) slows the sweep so it looks smooth.',
    sim: { type: 'servo', min: 0, max: 180, stepMs: 15 },
    voiceSteps: [
      'Place the Arduino Uno.',
      'Place the servo motor.',
      'Connect servo VCC to Arduino 5V.',
      'Connect servo GND to Arduino GND.',
      'Connect servo signal to Arduino pin D9.',
      'Wiring complete. Run the simulation to watch the servo sweep.',
    ],
  },
  {
    id: 'ir_sensor',
    title: 'IR Sensor Detector',
    description: 'Detect an object near an IR sensor and light an LED.',
    difficulty: 'Intermediate',
    icon: '👁️',
    board: 'arduino_uno',
    components: [
      { id: 'ir_sensor', role: 'IR Sensor' },
      { id: 'resistor', role: '220Ω Resistor' },
      { id: 'led', role: 'LED' },
    ],
    requiredConnections: [
      { from: 'arduino_uno_0:5V', to: 'ir_sensor_0:VCC', purpose: 'Sensor power', signalType: 'Power' },
      { from: 'arduino_uno_0:GND', to: 'ir_sensor_0:GND', purpose: 'Sensor ground', signalType: 'Ground' },
      { from: 'ir_sensor_0:OUT', to: 'arduino_uno_0:D2', purpose: 'Detection signal to input', signalType: 'Signal' },
      { from: 'arduino_uno_0:D13', to: 'resistor_0:A', purpose: 'Digital output to resistor', signalType: 'Digital' },
      { from: 'resistor_0:B', to: 'led_0:A', purpose: 'Current limiting for LED', signalType: 'Signal' },
      { from: 'led_0:C', to: 'arduino_uno_0:GND', purpose: 'Ground return', signalType: 'Ground' },
    ],
    code: `// IR Sensor controls LED - Arduino Uno
#define IR_PIN 2
#define LED_PIN 13

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(IR_PIN) == LOW) {   // object detected
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`,
    codeExplanation: 'The IR sensor output is LOW when an object is near. When IR_PIN reads LOW, the LED turns on; otherwise it stays off. This shows INPUT -> SENSOR -> CODE -> OUTPUT.',
    sim: { type: 'ir' },
    voiceSteps: [
      'Place the Arduino Uno.',
      'Place the IR sensor.',
      'Connect IR sensor VCC to Arduino 5V and GND to GND.',
      'Connect IR sensor OUT to Arduino pin D2.',
      'Add the resistor and LED for the output.',
      'Wire D13 to resistor, resistor to LED anode, LED cathode to GND.',
      'Wiring done. Move the object near the sensor in simulation to detect it.',
    ],
  },
  {
    id: 'ultrasonic',
    title: 'Ultrasonic Distance',
    description: 'Measure distance to an object with the HC-SR04 sensor.',
    difficulty: 'Intermediate',
    icon: '📡',
    board: 'arduino_uno',
    components: [{ id: 'ultrasonic', role: 'HC-SR04 Ultrasonic' }],
    requiredConnections: [
      { from: 'arduino_uno_0:5V', to: 'ultrasonic_0:VCC', purpose: 'Sensor power', signalType: 'Power' },
      { from: 'arduino_uno_0:GND', to: 'ultrasonic_0:GND', purpose: 'Sensor ground', signalType: 'Ground' },
      { from: 'arduino_uno_0:D9', to: 'ultrasonic_0:TRIG', purpose: 'Trigger pulse output', signalType: 'Digital' },
      { from: 'ultrasonic_0:ECHO', to: 'arduino_uno_0:D10', purpose: 'Echo pulse input', signalType: 'Signal' },
    ],
    code: `// Ultrasonic Distance Sensor - HC-SR04
#define TRIG_PIN 9
#define ECHO_PIN 10

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(300);
}`,
    codeExplanation: 'A 10 microsecond pulse on TRIG sends a sound wave. pulseIn on ECHO measures how long the echo takes to return. distance = duration * 0.034 / 2 converts that time to centimeters.',
    sim: { type: 'ultrasonic' },
    voiceSteps: [
      'Place the Arduino Uno.',
      'Place the HC-SR04 ultrasonic sensor.',
      'Connect VCC to 5V and GND to GND.',
      'Connect TRIG to Arduino pin D9.',
      'Connect ECHO to Arduino pin D10.',
      'Wiring done. Move the object in simulation to read the distance.',
    ],
  },
  {
    id: 'line_follower',
    title: 'Line Follower Robot',
    description: 'Follow a black line using two IR sensors and a motor driver.',
    difficulty: 'Advanced',
    icon: '🤖',
    board: 'arduino_uno',
    components: [
      { id: 'ir_sensor', role: 'IR Sensor (Left)' },
      { id: 'ir_sensor', role: 'IR Sensor (Right)' },
      { id: 'motor_driver', role: 'L298N Driver' },
      { id: 'dc_motor', role: 'DC Motor (Left)' },
      { id: 'dc_motor', role: 'DC Motor (Right)' },
    ],
    requiredConnections: [
      { from: 'arduino_uno_0:5V', to: 'ir_sensor_0:VCC', purpose: 'Left sensor power', signalType: 'Power' },
      { from: 'arduino_uno_0:GND', to: 'ir_sensor_0:GND', purpose: 'Left sensor ground', signalType: 'Ground' },
      { from: 'ir_sensor_0:OUT', to: 'arduino_uno_0:D2', purpose: 'Left detection input', signalType: 'Signal' },
      { from: 'arduino_uno_0:5V', to: 'ir_sensor_1:VCC', purpose: 'Right sensor power', signalType: 'Power' },
      { from: 'arduino_uno_0:GND', to: 'ir_sensor_1:GND', purpose: 'Right sensor ground', signalType: 'Ground' },
      { from: 'ir_sensor_1:OUT', to: 'arduino_uno_0:D13', purpose: 'Right detection input', signalType: 'Signal' },
      { from: 'arduino_uno_0:D9', to: 'motor_driver_0:IN1', purpose: 'Motor direction A', signalType: 'Digital' },
      { from: 'arduino_uno_0:D10', to: 'motor_driver_0:IN2', purpose: 'Motor direction B', signalType: 'Digital' },
      { from: 'arduino_uno_0:D11', to: 'motor_driver_0:ENA', purpose: 'Motor speed (PWM)', signalType: 'PWM' },
      { from: 'arduino_uno_0:GND', to: 'motor_driver_0:GND', purpose: 'Driver ground', signalType: 'Ground' },
      { from: 'motor_driver_0:OUT1', to: 'dc_motor_0:P', purpose: 'Left motor drive +', signalType: 'Power' },
      { from: 'motor_driver_0:OUT2', to: 'dc_motor_0:N', purpose: 'Left motor drive -', signalType: 'Ground' },
      { from: 'motor_driver_0:OUT1', to: 'dc_motor_1:P', purpose: 'Right motor drive +', signalType: 'Power' },
      { from: 'motor_driver_0:OUT2', to: 'dc_motor_1:N', purpose: 'Right motor drive -', signalType: 'Ground' },
    ],
    code: `// Line Follower Robot - Arduino Uno
#define LEFT_PIN 2
#define RIGHT_PIN 13
#define IN1 9
#define IN2 10
#define ENA 11

void setup() {
  pinMode(LEFT_PIN, INPUT);
  pinMode(RIGHT_PIN, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
}

void loop() {
  int left = digitalRead(LEFT_PIN);    // LOW = on the line
  int right = digitalRead(RIGHT_PIN);

  if (left == LOW && right == LOW) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, 180);              // forward
  } else if (left == LOW && right == HIGH) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, 140);             // turn left
  } else if (left == HIGH && right == LOW) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(ENA, 140);             // turn right
  } else {
    analogWrite(ENA, 0);               // off line -> stop
  }
  delay(100);
}`,
    codeExplanation: 'Both sensors LOW means both are on the line, so the robot drives forward. If only the left sensor is on the line, it turns left; if only the right, it turns right. If both are off, it stops.',
    sim: { type: 'line_follower' },
    voiceSteps: [
      'Place the Arduino Uno.',
      'Place both IR sensors and the L298N motor driver.',
      'Place the two DC motors.',
      'Wire both IR sensors: VCC to 5V, GND to GND, OUT to D2 and D13.',
      'Wire the motor driver: IN1 to D9, IN2 to D10, ENA to D11, GND to GND.',
      'Connect the motors to driver OUT1 and OUT2.',
      'Wiring complete. Run the simulation to follow the line.',
    ],
  },
  {
    id: 'obstacle_avoider',
    title: 'Obstacle Avoider',
    description: 'A robot that reverses when it detects an obstacle ahead.',
    difficulty: 'Advanced',
    icon: '🚧',
    board: 'arduino_uno',
    components: [
      { id: 'ultrasonic', role: 'HC-SR04 Ultrasonic' },
      { id: 'motor_driver', role: 'L298N Driver' },
      { id: 'dc_motor', role: 'DC Motor' },
    ],
    requiredConnections: [
      { from: 'arduino_uno_0:5V', to: 'ultrasonic_0:VCC', purpose: 'Sensor power', signalType: 'Power' },
      { from: 'arduino_uno_0:GND', to: 'ultrasonic_0:GND', purpose: 'Sensor ground', signalType: 'Ground' },
      { from: 'arduino_uno_0:D2', to: 'ultrasonic_0:TRIG', purpose: 'Trigger pulse output', signalType: 'Digital' },
      { from: 'ultrasonic_0:ECHO', to: 'arduino_uno_0:D13', purpose: 'Echo pulse input', signalType: 'Signal' },
      { from: 'arduino_uno_0:GND', to: 'motor_driver_0:GND', purpose: 'Driver ground', signalType: 'Ground' },
      { from: 'arduino_uno_0:D10', to: 'motor_driver_0:IN1', purpose: 'Motor direction A', signalType: 'Digital' },
      { from: 'arduino_uno_0:D11', to: 'motor_driver_0:IN2', purpose: 'Motor direction B', signalType: 'Digital' },
      { from: 'arduino_uno_0:D9', to: 'motor_driver_0:ENA', purpose: 'Motor speed (PWM)', signalType: 'PWM' },
      { from: 'motor_driver_0:OUT1', to: 'dc_motor_0:P', purpose: 'Motor drive +', signalType: 'Power' },
      { from: 'motor_driver_0:OUT2', to: 'dc_motor_0:N', purpose: 'Motor drive -', signalType: 'Ground' },
    ],
    code: `// Obstacle Avoiding Robot - Arduino Uno
#define TRIG_PIN 2
#define ECHO_PIN 13
#define IN1 10
#define IN2 11
#define ENA 9
#define DIST_THRESHOLD 20

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
}

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dur = pulseIn(ECHO_PIN, HIGH);
  return dur * 0.034 / 2;
}

void loop() {
  float dist = getDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");

  if (dist < DIST_THRESHOLD) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(ENA, 180);            // reverse
  } else {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, 200);            // forward
  }
  delay(100);
}`,
    codeExplanation: 'getDistance() measures distance with the ultrasonic sensor. If it is less than 20 cm, the robot reverses (IN1 LOW, IN2 HIGH). Otherwise it drives forward. ENA controls the speed with PWM.',
    sim: { type: 'obstacle_avoider', threshold: 20 },
    voiceSteps: [
      'Place the Arduino Uno.',
      'Place the ultrasonic sensor, motor driver, and DC motor.',
      'Wire the ultrasonic sensor: VCC to 5V, GND to GND, TRIG to D2, ECHO to D13.',
      'Wire the motor driver: IN1 to D10, IN2 to D11, ENA to D9, GND to GND.',
      'Connect the motor to driver OUT1 and OUT2.',
      'Wiring complete. Move the obstacle in simulation to see the robot react.',
    ],
  },
];

export function getExperiment(id) {
  return EXPERIMENTS.find(e => e.id === id);
}