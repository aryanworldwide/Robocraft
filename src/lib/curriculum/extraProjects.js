// Comprehensive robotics projects for Classes 9, 10, 11
// All code is clean, compilable Arduino C++ with simple variable names for students.

export const class9ExtraProjects = [
  {
    id: 'c9_proj_led_blink',
    title: 'LED Blink',
    subject: 'Robotics',
    difficulty: 'Beginner',
    estimatedTime: '30 minutes',
    estimatedCost: '₹50-100',
    description: 'The "Hello World" of electronics! Make an LED blink on and off every second using Arduino.',
    components: ['Arduino Uno', 'LED (any color)', '220Ω Resistor', 'Breadboard', '2× Jumper Wires'],
    steps: [
      'Insert the LED into the breadboard — longer leg (anode) on one row, shorter leg (cathode) on the next row.',
      'Connect the 220Ω resistor from the LED anode to another row on the breadboard.',
      'Connect a jumper wire from Arduino Pin 13 to the free end of the resistor.',
      'Connect a jumper wire from Arduino GND to the LED cathode.',
      'Upload the code and watch the LED blink!'
    ],
    arduinoCode: `// LED Blink - Make an LED turn on and off
void setup() {
  // Set Pin 13 as an output pin
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);  // Turn LED ON
  delay(1000);             // Wait 1 second (1000 ms)
  digitalWrite(13, LOW);   // Turn LED OFF
  delay(1000);             // Wait 1 second
}`,
    testingChecklist: [
      'LED turns on for 1 second and off for 1 second',
      'No smoke or burning smell',
      'Resistor is warm but not hot',
      'Code uploads without errors'
    ],
    troubleshooting: [
      'LED not lighting up: Check polarity — the longer leg should connect to Pin 13 via the resistor',
      'LED too dim: You may be using a resistor that is too high — try 220Ω',
      'Upload fails: Make sure the correct board (Arduino Uno) and port are selected'
    ]
  },
  {
    id: 'c9_proj_traffic_light',
    title: 'Traffic Light System',
    subject: 'Robotics',
    difficulty: 'Beginner',
    estimatedTime: '1 hour',
    estimatedCost: '₹100-150',
    description: 'Build a working traffic light with Red, Yellow, and Green LEDs that turn on in sequence — just like real traffic signals!',
    components: ['Arduino Uno', 'Red LED', 'Yellow LED', 'Green LED', '3× 220Ω Resistors', 'Breadboard', '6× Jumper Wires'],
    steps: [
      'Place the Red, Yellow, and Green LEDs on the breadboard in a vertical column.',
      'Connect a 220Ω resistor from each LED anode to separate rows.',
      'Connect Red LED resistor to Arduino Pin 13, Yellow to Pin 12, Green to Pin 11.',
      'Connect all three LED cathodes to Arduino GND.',
      'Upload the code and watch the traffic light cycle!'
    ],
    arduinoCode: `// Traffic Light System
#define RED 13
#define YELLOW 12
#define GREEN 11

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void loop() {
  // RED light - Stop
  digitalWrite(RED, HIGH);
  digitalWrite(YELLOW, LOW);
  digitalWrite(GREEN, LOW);
  delay(3000);  // Red for 3 seconds

  // GREEN light - Go
  digitalWrite(RED, LOW);
  digitalWrite(YELLOW, LOW);
  digitalWrite(GREEN, HIGH);
  delay(3000);  // Green for 3 seconds

  // YELLOW light - Get ready to stop
  digitalWrite(RED, LOW);
  digitalWrite(YELLOW, HIGH);
  digitalWrite(GREEN, LOW);
  delay(1000);  // Yellow for 1 second
}`,
    testingChecklist: [
      'Red LED turns on for 3 seconds',
      'Green LED turns on for 3 seconds after Red',
      'Yellow LED turns on for 1 second after Green',
      'Only one LED is on at a time'
    ],
    troubleshooting: [
      'Wrong LED color order: Swap the pin numbers in the #define section',
      'LED not working: Check that the 220Ω resistor is connected to the correct pin',
      'All LEDs off: Verify GND wire is connected properly'
    ]
  },
  {
    id: 'c9_proj_ultrasonic_distance',
    title: 'Ultrasonic Distance Detector',
    subject: 'Robotics',
    difficulty: 'Intermediate',
    estimatedTime: '1.5 hours',
    estimatedCost: '₹200-300',
    description: 'Build a distance measurement device using the HC-SR04 ultrasonic sensor — the same technology used in car parking sensors!',
    components: ['Arduino Uno', 'HC-SR04 Ultrasonic Sensor', 'Breadboard', '4× Jumper Wires'],
    steps: [
      'Place the HC-SR04 sensor on the breadboard.',
      'Connect VCC to Arduino 5V pin.',
      'Connect GND to Arduino GND.',
      'Connect TRIG to Arduino Pin 9.',
      'Connect ECHO to Arduino Pin 10.',
      'Upload the code and open Serial Monitor at 9600 baud to see distances!'
    ],
    arduinoCode: `// Ultrasonic Distance Detector using HC-SR04
#define TRIG 9
#define ECHO 10

void setup() {
  Serial.begin(9600);      // Start serial communication
  pinMode(TRIG, OUTPUT);   // TRIG sends sound pulses
  pinMode(ECHO, INPUT);    // ECHO receives the echo
}

void loop() {
  // Send a short pulse to TRIG
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  // Measure how long ECHO stays HIGH
  long duration = pulseIn(ECHO, HIGH);

  // Convert time to distance (cm)
  // Sound travels at 343 m/s = 0.0343 cm/microsecond
  // Divide by 2 because sound goes there and back
  float distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);  // Wait half a second
}`,
    testingChecklist: [
      'Serial Monitor shows distance in cm',
      'Moving hand closer decreases the distance value',
      'Moving hand farther increases the distance value',
      'Readings are stable when nothing is moving'
    ],
    troubleshooting: [
      'Reading 0 cm: Check TRIG and ECHO wires are not swapped',
      'Reading always the same: Make sure VCC is connected to 5V, not 3.3V',
      'No reading in Serial Monitor: Set baud rate to 9600 in the Serial Monitor'
    ]
  },
  {
    id: 'c9_proj_smart_dustbin',
    title: 'Smart Dustbin',
    subject: 'Robotics',
    difficulty: 'Intermediate',
    estimatedTime: '2 hours',
    estimatedCost: '₹500-800',
    description: 'Build a dustbin that opens automatically when you bring your hand near it — using an ultrasonic sensor and a servo motor!',
    components: ['Arduino Uno', 'HC-SR04 Ultrasonic Sensor', 'Servo Motor (SG90)', 'Breadboard', 'Jumper Wires', 'Small dustbin/lid'],
    steps: [
      'Mount the servo motor on the dustbin lid using tape or glue.',
      'Connect Servo VCC (red) to Arduino 5V.',
      'Connect Servo GND (brown) to Arduino GND.',
      'Connect Servo Signal (orange) to Arduino Pin 6.',
      'Connect Ultrasonic VCC to 5V, GND to GND, TRIG to Pin 9, ECHO to Pin 10.',
      'Upload the code. The lid opens when your hand is within 20 cm!'
    ],
    arduinoCode: `// Smart Dustbin - Opens when hand is near
#include <Servo.h>

#define TRIG 9
#define ECHO 10
#define SERVO_PIN 6

Servo lidServo;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  lidServo.attach(SERVO_PIN);
  lidServo.write(0);  // Lid closed
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
    lidServo.write(90);   // Open lid
    delay(3000);          // Keep open for 3 seconds
    lidServo.write(0);    // Close lid
    delay(500);
  }
  delay(200);
}`,
    testingChecklist: [
      'Lid opens when hand is within 20 cm',
      'Lid closes after 3 seconds',
      'Servo moves smoothly without jerking',
      'Distance readings show in Serial Monitor'
    ],
    troubleshooting: [
      'Servo not moving: Check 5V supply — servo needs more power than a weak battery can provide',
      'Lid opens randomly: Adjust the distance threshold in the code (change 20 to a higher/lower value)',
      'Servo jerks: Add a small delay between servo movements'
    ]
  },
  {
    id: 'c9_proj_auto_street_light',
    title: 'Automatic Street Light',
    subject: 'Robotics',
    difficulty: 'Beginner',
    estimatedTime: '1 hour',
    estimatedCost: '₹100-200',
    description: 'Build a street light that turns ON automatically when it gets dark and turns OFF when it is bright — using an LDR (light sensor)!',
    components: ['Arduino Uno', 'LDR (Light Sensor)', '10kΩ Resistor', 'LED', '220Ω Resistor', 'Breadboard', 'Jumper Wires'],
    steps: [
      'Connect the LDR and 10kΩ resistor as a voltage divider to Arduino Pin A0.',
      'Connect the LED with a 220Ω resistor to Arduino Pin 13.',
      'LDR one leg to 5V, other leg to A0 and to 10kΩ resistor.',
      '10kΩ resistor other end to GND.',
      'Upload the code. The LED turns on when you cover the LDR (darkness)!'
    ],
    arduinoCode: `// Automatic Street Light using LDR
#define LDR_PIN A0
#define LED_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int lightValue = analogRead(LDR_PIN);  // Read light level (0-1023)
  Serial.print("Light: ");
  Serial.println(lightValue);

  // If light value is low, it is dark -> turn on LED
  if (lightValue < 500) {
    digitalWrite(LED_PIN, HIGH);  // Street light ON
  } else {
    digitalWrite(LED_PIN, LOW);   // Street light OFF
  }
  delay(200);
}`,
    testingChecklist: [
      'LED turns ON when LDR is covered (dark)',
      'LED turns OFF when light shines on LDR',
      'Light value changes in Serial Monitor',
      'Transition is smooth without flickering'
    ],
    troubleshooting: [
      'LED always on: Try changing the threshold value (500) to a higher number',
      'LED always off: Try lowering the threshold value',
      'Readings not changing: Check the LDR voltage divider connections'
    ]
  },
];

export const class10ExtraProjects = [
  {
    id: 'c10_proj_line_follower',
    title: 'Line Follower Robot',
    subject: 'Robotics',
    difficulty: 'Intermediate',
    estimatedTime: '3 hours',
    estimatedCost: '₹800-1200',
    description: 'Build a robot that follows a black line on the floor using IR sensors. A classic robotics project!',
    components: ['Arduino Uno', '2× IR Sensors (TCRT5000)', 'L298N Motor Driver', '2× DC Motors with wheels', 'Robot Chassis', 'Battery Pack (6V)', 'Jumper Wires', 'Black tape for line'],
    steps: [
      'Assemble the robot chassis with motors and wheels.',
      'Mount two IR sensors at the front, pointing down at the floor.',
      'Connect L298N: IN1 to D7, IN2 to D6, ENA to D5, GND to GND.',
      'Connect left IR sensor OUT to D2, right IR sensor OUT to D3.',
      'Connect motors to L298N output terminals.',
      'Upload the code and place the robot on a black line!'
    ],
    arduinoCode: `// Line Follower Robot
#define LEFT_SENSOR 2
#define RIGHT_SENSOR 3
#define IN1 7
#define IN2 6
#define ENA 5  // Left motor speed (PWM)

void setup() {
  pinMode(LEFT_SENSOR, INPUT);
  pinMode(RIGHT_SENSOR, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
}

void forward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 150);
}

void turnRight() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 120);
}

void turnLeft() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 80);
}

void stop() {
  analogWrite(ENA, 0);
}

void loop() {
  int left = digitalRead(LEFT_SENSOR);
  int right = digitalRead(RIGHT_SENSOR);

  // IR sensor reads LOW when on black line
  if (left == LOW && right == LOW) {
    forward();       // Both sensors on line -> go straight
  } else if (left == LOW && right == HIGH) {
    turnLeft();      // Only left sensor on line -> turn left
  } else if (left == HIGH && right == LOW) {
    turnRight();     // Only right sensor on line -> turn right
  } else {
    stop();          // Both sensors off line -> stop
  }
}`,
    testingChecklist: [
      'Robot follows a straight black line',
      'Robot turns left when line curves left',
      'Robot turns right when line curves right',
      'Robot stops when both sensors leave the line'
    ],
    troubleshooting: [
      'Robot goes in circles: Swap the left and right motor wires',
      'Robot ignores the line: Adjust sensor height — sensors should be 5mm above the floor',
      'Motors not turning: Check L298N battery is connected and ENA jumper is removed'
    ]
  },
  {
    id: 'c10_proj_obstacle_avoid',
    title: 'Obstacle Avoiding Robot',
    subject: 'Robotics',
    difficulty: 'Intermediate',
    estimatedTime: '3 hours',
    estimatedCost: '₹900-1300',
    description: 'Build a robot that detects obstacles with an ultrasonic sensor and automatically turns to avoid them!',
    components: ['Arduino Uno', 'HC-SR04 Ultrasonic Sensor', 'L298N Motor Driver', '2× DC Motors with wheels', 'Robot Chassis', 'Battery Pack (6V)', 'Jumper Wires'],
    steps: [
      'Assemble the robot chassis with motors and wheels.',
      'Mount the ultrasonic sensor on the front of the robot.',
      'Connect L298N: IN1 to D7, IN2 to D6, ENA to D5, GND to GND.',
      'Connect Ultrasonic: VCC to 5V, GND to GND, TRIG to D9, ECHO to D10.',
      'Connect motors to L298N output terminals.',
      'Upload the code. The robot avoids obstacles automatically!'
    ],
    arduinoCode: `// Obstacle Avoiding Robot
#define TRIG 9
#define ECHO 10
#define IN1 7
#define IN2 6
#define ENA 5

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
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

void forward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 200);
}

void back() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 200);
}

void turn() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 180);
}

void stopRobot() {
  analogWrite(ENA, 0);
}

void loop() {
  float dist = getDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");

  if (dist < 15) {
    // Obstacle ahead - back up and turn
    stopRobot();
    delay(300);
    back();
    delay(500);
    turn();
    delay(400);
  } else {
    // Path is clear - go forward
    forward();
  }
  delay(100);
}`,
    testingChecklist: [
      'Robot moves forward when path is clear',
      'Robot stops when an obstacle is within 15 cm',
      'Robot reverses, then turns to avoid the obstacle',
      'Distance readings show in Serial Monitor'
    ],
    troubleshooting: [
      'Robot crashes into obstacles: Lower the threshold distance from 15 to 10 cm',
      'Robot always reverses: Check ultrasonic sensor wiring — TRIG and ECHO may be swapped',
      'Motors weak: Ensure the L298N has a separate 6V battery, not powered from Arduino 5V'
    ]
  },
  {
    id: 'c10_proj_fire_fighting',
    title: 'Fire Fighting Robot',
    subject: 'Robotics',
    difficulty: 'Advanced',
    estimatedTime: '4 hours',
    estimatedCost: '₹1000-1500',
    description: 'Build a robot that detects fire using a flame sensor and sprays water to extinguish it — a life-saving robot!',
    components: ['Arduino Uno', 'Flame Sensor (KY-026)', 'Small Water Pump (3-6V)', 'L298N Motor Driver', '2× DC Motors with wheels', 'Robot Chassis', 'Battery Pack (9V)', 'Relay Module', 'Small water container', 'Jumper Wires'],
    steps: [
      'Assemble the robot chassis with motors.',
      'Mount the flame sensor at the front, pointing forward.',
      'Connect flame sensor: VCC to 5V, GND to GND, D0 to Pin 2.',
      'Connect relay: VCC to 5V, GND to GND, IN to Pin 8.',
      'Connect the water pump through the relay module.',
      'Connect L298N motors: IN1 to D7, IN2 to D6, ENA to D5.',
      'Upload the code. The robot moves and sprays water when fire is detected!'
    ],
    arduinoCode: `// Fire Fighting Robot
#define FLAME_SENSOR 2
#define PUMP_RELAY 8
#define IN1 7
#define IN2 6
#define ENA 5

void setup() {
  pinMode(FLAME_SENSOR, INPUT);
  pinMode(PUMP_RELAY, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
  digitalWrite(PUMP_RELAY, LOW);  // Pump OFF
}

void forward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 180);
}

void stopRobot() {
  analogWrite(ENA, 0);
}

void loop() {
  int fire = digitalRead(FLAME_SENSOR);

  if (fire == LOW) {
    // Fire detected!
    stopRobot();
    digitalWrite(PUMP_RELAY, HIGH);  // Turn pump ON
    delay(2000);                     // Spray for 2 seconds
    digitalWrite(PUMP_RELAY, LOW);   // Turn pump OFF
    delay(1000);                     // Wait 1 second
  } else {
    // No fire - keep searching
    forward();
  }
  delay(100);
}`,
    testingChecklist: [
      'Robot moves forward when no fire is detected',
      'Robot stops when flame sensor detects fire',
      'Water pump turns on for 2 seconds when fire is detected',
      'Robot resumes searching after fire is out'
    ],
    troubleshooting: [
      'Sensor never detects: Flame sensor needs to be very close to fire (within 30 cm)',
      'Pump not running: Check relay wiring — pump power goes through the relay contacts',
      'Robot does not stop: Adjust flame sensor sensitivity using the potentiometer on the module'
    ]
  },
  {
    id: 'c10_proj_home_automation',
    title: 'Home Automation System',
    subject: 'Robotics',
    difficulty: 'Intermediate',
    estimatedTime: '2.5 hours',
    estimatedCost: '₹300-500',
    description: 'Control home appliances (like a light or fan) using your voice or an app via Bluetooth — a smart home starter kit!',
    components: ['Arduino Uno', 'HC-05 Bluetooth Module', 'Relay Module (2-channel)', 'LED or small lamp', 'Breadboard', 'Jumper Wires'],
    steps: [
      'Connect HC-05: VCC to 5V, GND to GND, TX to Arduino Pin 2 (RX), RX to Arduino Pin 3 (TX) via voltage divider.',
      'Connect relay module: VCC to 5V, GND to GND, IN1 to Pin 8, IN2 to Pin 9.',
      'Connect an LED to relay channel 1 to simulate a lamp.',
      'Download a Bluetooth terminal app on your phone.',
      'Pair with HC-05 (password: 1234 or 0000).',
      'Upload the code. Send "1" to turn ON, "0" to turn OFF!'
    ],
    arduinoCode: `// Home Automation via Bluetooth
#define RELAY1 8
#define RELAY2 9

char command;

void setup() {
  Serial.begin(9600);  // Bluetooth uses Serial
  pinMode(RELAY1, OUTPUT);
  pinMode(RELAY2, OUTPUT);
  digitalWrite(RELAY1, HIGH);  // Relay OFF (active LOW)
  digitalWrite(RELAY2, HIGH);
}

void loop() {
  if (Serial.available()) {
    command = Serial.read();

    if (command == '1') {
      digitalWrite(RELAY1, LOW);  // Turn ON appliance 1
    } else if (command == '0') {
      digitalWrite(RELAY1, HIGH); // Turn OFF appliance 1
    } else if (command == '3') {
      digitalWrite(RELAY2, LOW);  // Turn ON appliance 2
    } else if (command == '2') {
      digitalWrite(RELAY2, HIGH); // Turn OFF appliance 2
    }
  }
}`,
    testingChecklist: [
      'Sending "1" turns ON the first appliance',
      'Sending "0" turns OFF the first appliance',
      'Bluetooth pairs successfully with HC-05',
      'Commands are received quickly'
    ],
    troubleshooting: [
      'Cannot pair: Default password is 1234 or 0000 — try both',
      'Commands not received: Make sure TX and RX are NOT swapped (HC-05 TX to Arduino RX)',
      'Relay does not switch: Some relays are active LOW — try inverting HIGH/LOW in the code'
    ]
  },
  {
    id: 'c10_proj_robotic_arm',
    title: 'Robotic Arm',
    subject: 'Robotics',
    difficulty: 'Advanced',
    estimatedTime: '4 hours',
    estimatedCost: '₹800-1200',
    description: 'Build a robotic arm using servo motors that can pick and place objects — a mini industrial robot!',
    components: ['Arduino Uno', '3× Servo Motors (SG90)', 'Robotic arm frame (cardboard/3D printed)', 'Breadboard', 'Jumper Wires', 'External 5V power supply'],
    steps: [
      'Build or assemble the robotic arm frame with 3 servo motors: base, arm, and gripper.',
      'Connect each servo: VCC (red) to external 5V, GND (brown) to GND, Signal (orange) to Pins 5, 6, 7.',
      'Connect Arduino GND to the external power supply GND (common ground).',
      'Upload the code. The arm will move through a sequence of positions!'
    ],
    arduinoCode: `// Robotic Arm with 3 Servo Motors
#include <Servo.h>

#define BASE_PIN 5
#define ARM_PIN 6
#define GRIPPER_PIN 7

Servo baseServo;
Servo armServo;
Servo gripperServo;

void setup() {
  baseServo.attach(BASE_PIN);
  armServo.attach(ARM_PIN);
  gripperServo.attach(GRIPPER_PIN);

  // Start at home position
  baseServo.write(90);
  armServo.write(90);
  gripperServo.write(0);  // Gripper open
  delay(1000);
}

void loop() {
  // Move to pick up position
  baseServo.write(45);
  armServo.write(120);
  delay(500);
  gripperServo.write(60);  // Close gripper
  delay(500);

  // Lift
  armServo.write(60);
  delay(500);

  // Move to drop position
  baseServo.write(135);
  delay(500);
  armServo.write(120);
  delay(500);
  gripperServo.write(0);  // Open gripper
  delay(500);

  // Return home
  armServo.write(90);
  baseServo.write(90);
  delay(2000);
}`,
    testingChecklist: [
      'Base servo rotates left and right',
      'Arm servo lifts and lowers',
      'Gripper opens and closes',
      'Arm completes the pick-and-place cycle'
    ],
    troubleshooting: [
      'Servos jitter: Use an external 5V power supply — Arduino cannot power 3 servos',
      'Servos not moving: Ensure all GND wires (Arduino and power supply) are connected together',
      'Arm falls: Increase the delay between movements to give servos time to reach position'
    ]
  },
];

export const class11ExtraProjects = [
  {
    id: 'c11_proj_bluetooth_robot',
    title: 'Bluetooth Controlled Robot (ESP32)',
    subject: 'Robotics',
    difficulty: 'Intermediate',
    estimatedTime: '3 hours',
    estimatedCost: '₹1000-1500',
    description: 'Build a WiFi+Bluetooth robot using ESP32 that you can control from your phone — no app needed, just a web browser!',
    components: ['ESP32 DevKit', 'L298N Motor Driver', '2× DC Motors with wheels', 'Robot Chassis', 'Battery Pack (9V)', 'Jumper Wires'],
    steps: [
      'Assemble the robot chassis with motors.',
      'Connect L298N to ESP32: IN1 to GPIO26, IN2 to GPIO27, ENA to GPIO14, GND to GND.',
      'Connect motors to L298N output terminals.',
      'Power the ESP32 via USB or 5V to the VIN pin.',
      'Upload the code. Find the ESP32 WiFi network and connect!',
      'Open a browser and go to 192.168.4.1 to control the robot.'
    ],
    arduinoCode: `// Bluetooth/WiFi Controlled Robot using ESP32
#include <WiFi.h>
#include <WebServer.h>

#define IN1 26
#define IN2 27
#define ENA 14

const char* ssid = "RoboCar";
const char* password = "robot123";

WebServer server(80);

void forward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 200);
}

void backward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 200);
}

void stopRobot() {
  analogWrite(ENA, 0);
}

void setup() {
  Serial.begin(115200);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);

  WiFi.softAP(ssid, password);
  Serial.println("WiFi started!");
  Serial.print("IP: ");
  Serial.println(WiFi.softAPIP());

  server.on("/f", forward);
  server.on("/b", backward);
  server.on("/s", stopRobot);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    esp32Code: `// Same as above - this project uses ESP32`,
    testingChecklist: [
      'ESP32 creates a WiFi network called "RoboCar"',
      'Phone can connect to the WiFi network',
      'Opening 192.168.4.1/f makes the robot go forward',
      'Opening 192.168.4.1/s stops the robot'
    ],
    troubleshooting: [
      'Cannot find WiFi: Wait 30 seconds after upload for the ESP32 to start the network',
      'Wrong board: Select "ESP32 DevKit Module" in the Arduino IDE',
      'Upload fails: Hold the BOOT button on the ESP32 while uploading'
    ]
  },
  {
    id: 'c11_proj_line_follower',
    title: 'Advanced Line Follower (ESP32)',
    subject: 'Robotics',
    difficulty: 'Advanced',
    estimatedTime: '4 hours',
    estimatedCost: '₹1200-1800',
    description: 'A faster, smarter line follower using ESP32 with PID control for smooth line tracking at higher speeds!',
    components: ['ESP32 DevKit', '5-Channel IR Sensor Array', 'L298N Motor Driver', '2× DC Motors with wheels', 'Robot Chassis', 'Battery Pack (9V)', 'Jumper Wires'],
    steps: [
      'Mount the 5-channel IR sensor array at the front of the robot, 5mm above the floor.',
      'Connect sensor array outputs to ESP32: GPIO 34, 35, 32, 33, 25.',
      'Connect L298N: IN1 to GPIO26, IN2 to GPIO27, ENA to GPIO14.',
      'Upload the code. Place the robot on a line and watch it follow smoothly with PID!'
    ],
    arduinoCode: `// Advanced Line Follower with PID using ESP32
#define IN1 26
#define IN2 27
#define ENA 14

// PID variables
float error = 0;
float lastError = 0;
float kp = 0.5;  // Proportional
float kd = 1.0;  // Derivative

void setup() {
  Serial.begin(115200);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
}

int readLine() {
  int s1 = digitalRead(34);
  int s2 = digitalRead(35);
  int s3 = digitalRead(32);
  int s4 = digitalRead(33);
  int s5 = digitalRead(25);

  // Calculate error: center = 0, left = negative, right = positive
  int sum = (s1 * -2) + (s2 * -1) + (s3 * 0) + (s4 * 1) + (s5 * 2);
  return sum;
}

void loop() {
  error = readLine();
  float pid = (kp * error) + (kd * (error - lastError));
  lastError = error;

  int speed = 150 + (int)pid;
  speed = constrain(speed, 0, 255);

  if (error > 0) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, speed);
  } else if (error < 0) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(ENA, 255 - speed);
  } else {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, 180);
  }
  delay(10);
}`,
    esp32Code: `// Same as above - this project uses ESP32`,
    testingChecklist: [
      'Robot follows the line smoothly',
      'Robot does not lose the line on curves',
      'PID values can be adjusted for different speeds',
      'Robot speed increases on straight sections'
    ],
    troubleshooting: [
      'Robot oscillates: Reduce kp value in the code',
      'Robot drifts off the line: Increase kd for faster correction',
      'Sensors not reading: ESP32 ADC pins are GPIO 32-39 — use those for analog'
    ]
  },
  {
    id: 'c11_proj_iot_dashboard',
    title: 'IoT Dashboard (ESP32)',
    subject: 'Artificial Intelligence',
    difficulty: 'Advanced',
    estimatedTime: '4 hours',
    estimatedCost: '₹500-800',
    description: 'Build a cloud-connected IoT dashboard that shows real-time temperature, humidity, and light data in your web browser!',
    components: ['ESP32 DevKit', 'DHT11 Temperature Sensor', 'LDR (Light Sensor)', '10kΩ Resistor', 'Breadboard', 'Jumper Wires'],
    steps: [
      'Connect DHT11: VCC to 3.3V, GND to GND, DATA to GPIO4.',
      'Connect LDR with 10kΩ resistor as voltage divider to GPIO34.',
      'Upload the code and open Serial Monitor to get the IP address.',
      'Open the IP in your browser to see live sensor data!'
    ],
    arduinoCode: `// IoT Dashboard with ESP32
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

#define DHT_PIN 4
#define LDR_PIN 34
#define DHT_TYPE DHT11

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

DHT dht(DHT_PIN, DHT_TYPE);
WebServer server(80);

String getHTML(float temp, float humid, int light) {
  String html = "<!DOCTYPE html><html><head><title>IoT Dashboard</title>";
  html += "<meta http-equiv='refresh' content='5'>";
  html += "<style>body{font-family:Arial;text-align:center;background:#0F172A;color:white;}";
  html += ".card{background:#1E293B;padding:20px;margin:10px;border-radius:10px;display:inline-block;width:200px}";
  html += "h2{color:#06B6D4}</style></head><body>";
  html += "<h1>IoT Dashboard</h1>";
  html += "<div class='card'><h2>Temperature</h2><p style='font-size:30px'>" + String(temp) + " &deg;C</p></div>";
  html += "<div class='card'><h2>Humidity</h2><p style='font-size:30px'>" + String(humid) + " %</p></div>";
  html += "<div class='card'><h2>Light</h2><p style='font-size:30px'>" + String(light) + "</p></div>";
  html += "</body></html>";
  return html;
}

void handleDashboard() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int l = analogRead(LDR_PIN);
  server.send(200, "text/html", getHTML(t, h, l));
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleDashboard);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    esp32Code: `// Same as above - this project uses ESP32`,
    testingChecklist: [
      'ESP32 connects to WiFi and shows IP address',
      'Dashboard shows temperature, humidity, and light values',
      'Values update every 5 seconds',
      'Covering LDR changes the light value'
    ],
    troubleshooting: [
      'Cannot connect to WiFi: Check SSID and password in the code',
      'Temperature shows NaN: DHT11 needs 2 seconds between readings',
      'Page not loading: Make sure your phone/PC is on the same WiFi network'
    ]
  },
  {
    id: 'c11_proj_mobile_robot',
    title: 'Mobile Robot (ESP32 + Phone Control)',
    subject: 'Robotics',
    difficulty: 'Intermediate',
    estimatedTime: '3 hours',
    estimatedCost: '₹1000-1500',
    description: 'A mobile-controlled robot using ESP32 that you steer from your phone over WiFi — like an RC car!',
    components: ['ESP32 DevKit', 'L298N Motor Driver', '2× DC Motors with wheels', 'Robot Chassis', 'Battery Pack (9V)', 'Jumper Wires'],
    steps: [
      'Assemble the robot chassis with motors.',
      'Connect L298N to ESP32: IN1 to GPIO26, IN2 to GPIO27, IN3 to GPIO12, IN4 to GPIO13, ENA to GPIO14, ENB to GPIO15.',
      'Connect motors to L298N output terminals.',
      'Upload the code and find the WiFi network "RoboCar".',
      'Open 192.168.4.1 in your phone browser to control the robot with buttons!'
    ],
    arduinoCode: `// Mobile Robot - Phone Controlled via ESP32
#include <WiFi.h>
#include <WebServer.h>

#define IN1 26
#define IN2 27
#define IN3 12
#define IN4 13
#define ENA 14
#define ENB 15

const char* ssid = "RoboCar";
const char* password = "robot123";

WebServer server(80);

void moveForward() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); analogWrite(ENA, 200);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW); analogWrite(ENB, 200);
}
void moveBackward() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH); analogWrite(ENA, 200);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH); analogWrite(ENB, 200);
}
void turnLeft() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH); analogWrite(ENA, 200);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW); analogWrite(ENB, 200);
}
void turnRight() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); analogWrite(ENA, 200);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH); analogWrite(ENB, 200);
}
void stopRobot() {
  analogWrite(ENA, 0); analogWrite(ENB, 0);
}

String getHTML() {
  String h = "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'>";
  h += "<style>body{text-align:center;font-family:Arial;background:#0F172A;color:white}";
  h += "button{font-size:30px;padding:30px;margin:10px;border-radius:15px;background:#06B6D4;color:white}</style>";
  h += "</head><body><h1>RoboCar</h1>";
  h += "<a href='/f'><button>FWD</button></a><br>";
  h += "<a href='/l'><button>LEFT</button></a>";
  h += "<a href='/s'><button>STOP</button></a>";
  h += "<a href='/r'><button>RIGHT</button></a><br>";
  h += "<a href='/b'><button>BACK</button></a></body></html>";
  return h;
}

void setup() {
  Serial.begin(115200);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);

  WiFi.softAP(ssid, password);
  Serial.println(WiFi.softAPIP());

  server.on("/", []() { server.send(200, "text/html", getHTML()); });
  server.on("/f", moveForward);
  server.on("/b", moveBackward);
  server.on("/l", turnLeft);
  server.on("/r", turnRight);
  server.on("/s", stopRobot);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    esp32Code: `// Same as above - this project uses ESP32`,
    testingChecklist: [
      'Robot moves forward when FWD button is tapped',
      'Robot turns left and right correctly',
      'Robot stops when STOP button is tapped',
      'Controls respond quickly over WiFi'
    ],
    troubleshooting: [
      'Robot goes in wrong direction: Swap IN1/IN2 or IN3/IN4 wires for that motor',
      'Only one motor works: Check ENA and ENB jumper connections',
      'Slow response: Move closer to the ESP32 for better WiFi signal'
    ]
  },
  {
    id: 'c11_proj_simple_drone',
    title: 'Simple Drone Simulator',
    subject: 'Robotics',
    difficulty: 'Advanced',
    estimatedTime: '5 hours',
    estimatedCost: '₹2000-3000',
    description: 'Learn how drones work! Build a drone flight controller simulator with ESP32 that controls 4 motors and reads sensor data for balance.',
    components: ['ESP32 DevKit', 'MPU6050 Gyroscope/Accelerometer', '4× Small DC Motors (coreless)', '4× Motor Controllers (NPN transistors or ESC)', 'Small drone frame', 'Battery Pack (3.7V LiPo)', 'Jumper Wires'],
    steps: [
      'Mount 4 motors on the drone frame in an X pattern.',
      'Connect MPU6050: SCL to GPIO22, SDA to GPIO21, VCC to 3.3V, GND to GND.',
      'Connect each motor to a transistor/ESC controlled by GPIO 25, 26, 27, 14.',
      'Upload the code. Open Serial Monitor to see pitch, roll, and motor speeds!',
      'This is a simulator — real drones need ESCs and more tuning. Start here to learn!'
    ],
    arduinoCode: `// Simple Drone Flight Controller Simulator
#include <Wire.h>

#define MPU6050 0x68

// Motor pins
#define M1 25
#define M2 26
#define M3 27
#define M4 14

float pitch = 0, roll = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Wake up MPU6050
  Wire.beginTransmission(MPU6050);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);

  // Set motor pins as output
  pinMode(M1, OUTPUT); pinMode(M2, OUTPUT);
  pinMode(M3, OUTPUT); pinMode(M4, OUTPUT);
}

void readGyro() {
  Wire.beginTransmission(MPU6050);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU6050, 14, true);

  int ax = Wire.read() << 8 | Wire.read();
  int ay = Wire.read() << 8 | Wire.read();
  int az = Wire.read() << 8 | Wire.read();
  Wire.read(); Wire.read();  // Skip temperature
  int gx = Wire.read() << 8 | Wire.read();
  int gy = Wire.read() << 8 | Wire.read();
  int gz = Wire.read() << 8 | Wire.read();

  // Calculate angles
  pitch = atan2(-ay, az) * 180 / PI;
  roll = atan2(ax, az) * 180 / PI;
}

void loop() {
  readGyro();

  Serial.print("Pitch: "); Serial.print(pitch);
  Serial.print("  Roll: "); Serial.println(roll);

  // Base motor speed
  int baseSpeed = 128;

  // Adjust motor speeds to keep level (simple balance)
  int m1Speed = baseSpeed - (int)(roll * 2) - (int)(pitch * 2);
  int m2Speed = baseSpeed + (int)(roll * 2) - (int)(pitch * 2);
  int m3Speed = baseSpeed + (int)(roll * 2) + (int)(pitch * 2);
  int m4Speed = baseSpeed - (int)(roll * 2) + (int)(pitch * 2);

  // Constrain to valid range
  m1Speed = constrain(m1Speed, 0, 255);
  m2Speed = constrain(m2Speed, 0, 255);
  m3Speed = constrain(m3Speed, 0, 255);
  m4Speed = constrain(m4Speed, 0, 255);

  analogWrite(M1, m1Speed);
  analogWrite(M2, m2Speed);
  analogWrite(M3, m3Speed);
  analogWrite(M4, m4Speed);

  delay(50);
}`,
    esp32Code: `// Same as above - this project uses ESP32`,
    testingChecklist: [
      'Serial Monitor shows pitch and roll angles',
      'Angles change when you tilt the sensor',
      'Motor speeds adjust based on tilt',
      'All 4 motors spin at base speed when level'
    ],
    troubleshooting: [
      'MPU6050 not reading: Check SDA and SCL connections on ESP32 (GPIO 21 and 22)',
      'Motors not spinning: Coreless motors need very low current — use transistors',
      'Angles show 0: Make sure MPU6050 is awake (write 0 to register 0x6B)',
      'WARNING: Real drones are dangerous. Always remove propellers while testing!'
    ]
  },
];