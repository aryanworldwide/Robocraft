// Engineering challenges — reasoning-based, no single "correct" answer.
// Each challenge has 4 difficulty levels and deterministic feedback:
// approach points, common misses (keyword-checked), and an engineering insight.

export const ENGINEERING_CHALLENGES = [
  {
    id: 'ch_ultrasonic_drift',
    area: 'Sensors',
    title: 'Ultrasonic Distance Drift',
    scenario: "A robot's ultrasonic sensor suddenly starts reporting incorrect, fluctuating distances.",
    levels: [
      { level: 1, type: 'mcq', question: 'Which sensor measures distance using sound waves?',
        options: ['Thermistor', 'HC-SR04 Ultrasonic', 'MPU6050', 'LM35'], answer: 1 },
      { level: 2, type: 'reason', question: 'Why can an ultrasonic sensor give inaccurate readings?' },
      { level: 3, type: 'reason', question: 'Diagnose a robot whose ultrasonic sensor readings fluctuate. List the most likely causes.' },
      { level: 4, type: 'reason', question: 'Design a reliable sensing approach for a robot that must hold a stable 30 cm following distance in a noisy environment.' },
    ],
    approach: [
      'Confirm whether the issue is hardware (wiring, sensor, power) or software (timing, units).',
      'Check the power supply — brownouts and noise from motors corrupt analog/digital readings.',
      'Verify TRIG pulse timing and ECHO capture; sensor needs a clean 10µs trigger and a timeout.',
      'Look for environmental causes: soft/angled surfaces, multiple echoes, temperature drift.',
      'Apply filtering (median/low-pass) and outlier rejection in firmware.',
    ],
    missed: [
      { point: 'Separate motor power from sensor logic and add decoupling capacitors', keywords: ['power', 'decoupl', 'capacitor', 'brownout', 'noise', 'rail'] },
      { point: 'Temperature affects the speed of sound — calibrate for it', keywords: ['temperature', 'speed of sound', 'calibrat'] },
      { point: 'Use median/Kalman filtering instead of raw single readings', keywords: ['median', 'kalman', 'filter', 'average', 'smooth'] },
      { point: 'Check the trigger pulse width and echo timeout in code', keywords: ['trigger', 'trig', 'echo', 'timeout', 'pulse', 'pulsein'] },
    ],
    insight: 'Sensor data is never raw truth. A robust robotic system treats every sensor reading as a noisy estimate and combines electrical integrity (clean power, decoupling), correct timing, and algorithmic filtering to extract a trustworthy signal.',
    relatedLessonId: 'c11_e_2',
  },
  {
    id: 'ch_pwm_turn',
    area: 'Motors',
    title: 'Equal PWM, Robot Turns',
    scenario: 'Two drive motors receive the same PWM value, but the robot curves to the left instead of going straight.',
    levels: [
      { level: 1, type: 'mcq', question: 'PWM controls which property of a DC motor?',
        options: ['Direction only', 'Average voltage / speed', 'Torque constant', 'Gear ratio'], answer: 1 },
      { level: 2, type: 'reason', question: 'Why might two motors with identical PWM commands behave differently?' },
      { level: 3, type: 'reason', question: 'What would you investigate to fix a robot that turns left even with equal PWM on both motors?' },
      { level: 4, type: 'reason', question: 'Design a closed-loop control scheme so a differential-drive robot maintains a straight heading despite motor mismatch.' },
    ],
    approach: [
      'Isolate mechanical vs electrical causes before changing code.',
      'Measure each motor\u2019s actual speed (encoder or tachometer) under the same PWM.',
      'Check for friction, uneven tyre size, or a dragging side.',
      'Compare battery voltage under load and motor driver (H-bridge) health.',
      'Introduce closed-loop correction using encoder feedback and a PID per wheel.',
    ],
    missed: [
      { point: 'Motors are never perfectly matched — manufacturing tolerance causes RPM differences', keywords: ['tolerance', 'mismatch', 'match', 'manufactur', 'variation'] },
      { point: 'Friction, tyre diameter, or a dragging side bias the robot mechanically', keywords: ['friction', 'tyre', 'tire', 'drag', 'wheel', 'alignment'] },
      { point: 'Use encoder feedback + PID to correct each wheel independently', keywords: ['encoder', 'pid', 'closed-loop', 'feedback', 'closed loop'] },
      { point: 'The H-bridge or wiring may have different voltage drops per channel', keywords: ['h-bridge', 'h bridge', 'driver', 'voltage drop', 'wiring', 'resistance'] },
    ],
    insight: 'Open-loop commands assume identical actuators. Real robots rely on closed-loop control: measure what each wheel actually does and correct the difference, so the system is robust to mechanical and electrical mismatch.',
    relatedLessonId: 'c11_e_1',
  },
  {
    id: 'ch_motor_reset',
    area: 'Power Systems',
    title: 'Brownout on Motor Start',
    scenario: 'The robot\u2019s controller resets every time the motors start up.',
    levels: [
      { level: 1, type: 'mcq', question: 'A sudden voltage drop that resets a microcontroller is called a:',
        options: ['Short circuit', 'Brownout', 'Overflow', 'Singularity'], answer: 1 },
      { level: 2, type: 'reason', question: 'Why would starting a motor cause the controller to reset?' },
      { level: 3, type: 'reason', question: 'Diagnose the system-level problem that causes a robot to reset whenever motors start.' },
      { level: 4, type: 'reason', question: 'Design a power architecture that prevents motor start-up transients from affecting the controller.' },
    ],
    approach: [
      'Calculate the inrush (start-up) current of the motors vs the supply\u2019s capability.',
      'Inspect the shared power rail between motors and logic.',
      'Check battery health, internal resistance, and wiring gauge.',
      'Add decoupling/bulk capacitance and consider separate power rails.',
      'Use soft-start (ramp PWM) to limit inrush current.',
    ],
    missed: [
      { point: 'Separate motor power from logic power into independent rails', keywords: ['separate', 'rail', 'isolat', 'split', 'independent'] },
      { point: 'Add bulk/decoupling capacitors near the motor driver and MCU', keywords: ['capacitor', 'decoupl', 'bulk', 'capacitance'] },
      { point: 'Motors draw high inrush current at start-up — size the supply for it', keywords: ['inrush', 'start-up', 'startup', 'stall current', 'current spike'] },
      { point: 'Soft-start the motor by ramping the PWM duty cycle', keywords: ['soft-start', 'soft start', 'ramp', 'gradual'] },
    ],
    insight: 'A power system is a signal-integrity problem. Motors are aggressive loads that inject voltage transients into shared rails. Reliable design isolates dirty (motor) and clean (logic) power and provides enough stored energy to ride through transients.',
    relatedLessonId: 'c11_e_5',
  },
  {
    id: 'ch_servo_jitter',
    area: 'Control Systems',
    title: 'Servo Jitter Despite Correct Code',
    scenario: 'A servo moves unpredictably even though the control code appears correct.',
    levels: [
      { level: 1, type: 'mcq', question: 'A servo motor knows its exact angle using built-in:',
        options: ['Thermistor', 'Position feedback (potentiometer)', 'GPS', 'Ultrasonic'], answer: 1 },
      { level: 2, type: 'reason', question: 'What hardware factors could make a servo jitter even with correct code?' },
      { level: 3, type: 'reason', question: 'List the hardware and software factors to check when a servo behaves unpredictably.' },
      { level: 4, type: 'reason', question: 'Design a reliable servo control subsystem that minimises jitter in a precision mechanism.' },
    ],
    approach: [
      'Check the servo power supply — servos need a dedicated, stiff 5/6 V rail.',
      'Verify signal integrity of the PWM line (50 Hz, 1\u20132 ms pulse) and grounding.',
      'Inspect for mechanical binding or excess load stalling the servo.',
      'Review software: timer conflicts, interrupts delaying the PWM, or shared timers.',
      'Rule out a worn internal potentiometer causing noisy feedback.',
    ],
    missed: [
      { point: 'Power the servo from a separate supply, not the MCU 5V pin', keywords: ['separate', 'power', 'supply', 'rail', 'dedicated'] },
      { point: 'A shared/common ground between servo and controller is required', keywords: ['ground', 'common ground', 'gnd'] },
      { point: 'Timer/interrupt latency in code can distort the PWM pulse', keywords: ['timer', 'interrupt', 'latency', 'pwm', 'pulse', 'jitter'] },
      { point: 'Mechanical binding or overload causes the servo to hunt', keywords: ['binding', 'load', 'overload', 'mechanical', 'stall', 'hunt'] },
    ],
    insight: 'Actuator behaviour is the product of power, signal, mechanics and software. When an actuator misbehaves, an engineer checks the weakest of these first rather than assuming the code is the whole system.',
    relatedLessonId: 'c11_e_6',
  },
  {
    id: 'ch_indoor_nav_sensors',
    area: 'System Design',
    title: 'Indoor Navigation Sensor Selection',
    scenario: 'You need to design a mobile robot for indoor navigation in a cluttered environment.',
    levels: [
      { level: 1, type: 'mcq', question: 'Which combination is most useful for indoor robot navigation?',
        options: ['GPS only', 'IMU + encoders + distance sensors', 'Temperature + gas sensor', 'Thermistor only'], answer: 1 },
      { level: 2, type: 'reason', question: 'Which sensors would you choose for indoor navigation and why?' },
      { level: 3, type: 'reason', question: 'Justify a sensor suite for a robot that must navigate a cluttered indoor environment reliably.' },
      { level: 4, type: 'reason', question: 'Design a multi-sensor indoor localisation architecture, explaining what each sensor contributes and how their data is fused.' },
    ],
    approach: [
      'Identify the failure modes of indoor navigation (no GPS, glass, dynamic obstacles).',
      'Select complementary sensors: odometry (encoders), orientation (IMU), perception (LiDAR/ultrasonic/time-of-flight), vision.',
      'Explain sensor fusion (e.g. Kalman filter) to combine noisy sources.',
      'Trade off cost, power, compute and reliability.',
      'Plan for redundancy and failure detection.',
    ],
    missed: [
      { point: 'GPS is unreliable indoors — rely on odometry, IMU and local perception', keywords: ['gps', 'indoor', 'odometry', 'encoder', 'imu'] },
      { point: 'Fuse sensors with a Kalman filter for a robust position estimate', keywords: ['kalman', 'fuse', 'fusion', 'filter', 'combine'] },
      { point: 'LiDAR or time-of-flight sensors handle cluttered spaces better than ultrasonic alone', keywords: ['lidar', 'tof', 'time-of-flight', 'time of flight', 'depth'] },
      { point: 'Account for sensor limitations and redundancy (no single sensor is enough)', keywords: ['redundan', 'limitation', 'fallback', 'failure'] },
    ],
    insight: 'Good system design starts from requirements and failure modes, then selects complementary sensors whose weaknesses cancel out through fusion. No single sensor solves indoor navigation.',
    relatedLessonId: 'c11_e_2',
  },
  {
    id: 'ch_pid_overshoot',
    area: 'Control Systems',
    title: 'PID Overshoot & Oscillation',
    scenario: 'A PID-controlled robot arm overshoots the target position and oscillates before settling.',
    levels: [
      { level: 1, type: 'mcq', question: 'The PID term that predicts future error from its rate of change is:',
        options: ['P (Proportional)', 'I (Integral)', 'D (Derivative)', 'G (Gain)'], answer: 2 },
      { level: 2, type: 'reason', question: 'Which PID term would you reduce to limit overshoot, and why?' },
      { level: 3, type: 'reason', question: 'Diagnose and tune a PID controller that overshoots and oscillates around the setpoint.' },
      { level: 4, type: 'reason', question: 'Design a tuning strategy for a PID controller on a non-linear plant, justifying each adjustment.' },
    ],
    approach: [
      'Identify which term dominates the oscillation (usually too-high P, too-high I, or insufficient D).',
      'Reduce proportional gain to lower overshoot, then reintroduce derivative to damp it.',
      'Watch integral wind-up — limit integral action or add anti-windup.',
      'Use a systematic method (Ziegler\u2013Nichols) or step-response tuning.',
      'Validate stability with a Bode plot or pole analysis if modelling is available.',
    ],
    missed: [
      { point: 'Too much proportional gain causes overshoot and oscillation', keywords: ['proportional', 'p gain', 'kp', 'too high'] },
      { point: 'Derivative term adds damping to reduce overshoot', keywords: ['derivative', 'd gain', 'kd', 'damping', 'damp'] },
      { point: 'Integral wind-up causes persistent oscillation — add anti-windup', keywords: ['integral', 'wind-up', 'windup', 'anti-windup', 'ki'] },
      { point: 'Use Ziegler\u2013Nichols or step-response tuning instead of blind guessing', keywords: ['ziegler', 'nichols', 'step response', 'tuning method'] },
    ],
    insight: 'PID tuning is a trade-off between responsiveness, stability and steady-state error. Engineers tune systematically — changing one term at a time and observing the response — rather than guessing three numbers at once.',
    relatedLessonId: 'c11_e_6',
  },
];

export function getChallengesByArea(area) {
  return ENGINEERING_CHALLENGES.filter(c => c.area === area);
}

export function getChallenge(id) {
  return ENGINEERING_CHALLENGES.find(c => c.id === id);
}