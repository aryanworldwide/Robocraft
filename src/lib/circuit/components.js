export const PIN_COLORS = {
  power: '#EF4444', vcc: '#EF4444',
  ground: '#94A3B8', gnd: '#94A3B8',
  digital: '#00D2FF', pwm: '#3B82F6',
  analog: '#A78BFA', signal: '#4ADE80',
};

export const CIRCUIT_COMPONENTS = [
  // ── Microcontrollers ──
  { id: 'arduino_uno', name: 'Arduino Uno', icon: '🔧', category: 'Microcontroller', color: '#00979D', width: 160, height: 200,
    pins: [
      { id: 'D2', label: 'D2', type: 'digital', x: 0, y: 25 }, { id: 'D9', label: 'D9', type: 'pwm', x: 0, y: 50 },
      { id: 'D10', label: 'D10', type: 'pwm', x: 0, y: 75 }, { id: 'D11', label: 'D11', type: 'pwm', x: 0, y: 100 },
      { id: 'D13', label: 'D13', type: 'digital', x: 0, y: 125 }, { id: 'A0', label: 'A0', type: 'analog', x: 0, y: 150 },
      { id: '5V', label: '5V', type: 'power', x: 160, y: 25 }, { id: '3V3', label: '3.3V', type: 'power', x: 160, y: 50 },
      { id: 'GND', label: 'GND', type: 'ground', x: 160, y: 75 }, { id: 'A4', label: 'SDA', type: 'analog', x: 160, y: 100 },
      { id: 'A5', label: 'SCL', type: 'analog', x: 160, y: 125 },
    ] },
  { id: 'arduino_nano', name: 'Arduino Nano', icon: '🔩', category: 'Microcontroller', color: '#00979D', width: 120, height: 200,
    pins: [
      { id: 'D2', label: 'D2', type: 'digital', x: 0, y: 25 }, { id: 'D9', label: 'D9', type: 'pwm', x: 0, y: 50 },
      { id: 'D10', label: 'D10', type: 'pwm', x: 0, y: 75 }, { id: 'D13', label: 'D13', type: 'digital', x: 0, y: 100 },
      { id: '5V', label: '5V', type: 'power', x: 120, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 120, y: 50 },
      { id: 'A0', label: 'A0', type: 'analog', x: 120, y: 75 }, { id: 'A4', label: 'SDA', type: 'analog', x: 120, y: 100 },
    ] },
  { id: 'esp32', name: 'ESP32', icon: '📱', category: 'Microcontroller', color: '#E63946', width: 130, height: 200,
    pins: [
      { id: 'D2', label: 'GPIO2', type: 'digital', x: 0, y: 25 }, { id: 'D4', label: 'GPIO4', type: 'digital', x: 0, y: 50 },
      { id: 'D5', label: 'GPIO5', type: 'pwm', x: 0, y: 75 }, { id: 'D13', label: 'GPIO13', type: 'digital', x: 0, y: 100 },
      { id: '3V3', label: '3.3V', type: 'power', x: 130, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 130, y: 50 },
      { id: 'A0', label: 'A0', type: 'analog', x: 130, y: 75 }, { id: 'D14', label: 'SDA', type: 'analog', x: 130, y: 100 },
    ] },
  { id: 'esp8266', name: 'ESP8266', icon: '📡', category: 'Microcontroller', color: '#457B9D', width: 110, height: 200,
    pins: [
      { id: 'D1', label: 'D1', type: 'digital', x: 0, y: 25 }, { id: 'D2', label: 'D2', type: 'digital', x: 0, y: 50 },
      { id: 'D5', label: 'D5', type: 'pwm', x: 0, y: 75 }, { id: 'D6', label: 'D6', type: 'pwm', x: 0, y: 100 },
      { id: '3V3', label: '3.3V', type: 'power', x: 110, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 110, y: 50 },
      { id: 'A0', label: 'A0', type: 'analog', x: 110, y: 75 },
    ] },
  // ── Basic ──
  { id: 'breadboard', name: 'Breadboard', icon: '🔌', category: 'Basic', color: '#64748B', width: 200, height: 100,
    pins: [
      { id: 'plus1', label: '+', type: 'power', x: 20, y: 10 }, { id: 'plus2', label: '+', type: 'power', x: 180, y: 10 },
      { id: 'minus1', label: '−', type: 'ground', x: 20, y: 90 }, { id: 'minus2', label: '−', type: 'ground', x: 180, y: 90 },
    ] },
  { id: 'led', name: 'LED', icon: '💡', category: 'Basic', color: '#FBBF24', width: 100, height: 100,
    pins: [{ id: 'A', label: 'Anode (+)', type: 'power', x: 0, y: 30 }, { id: 'C', label: 'Cathode (−)', type: 'ground', x: 0, y: 70 }] },
  { id: 'rgb_led', name: 'RGB LED', icon: '🌈', category: 'Basic', color: '#EC4899', width: 100, height: 120,
    pins: [
      { id: 'R', label: 'Red', type: 'pwm', x: 0, y: 20 }, { id: 'G', label: 'Green', type: 'pwm', x: 0, y: 45 },
      { id: 'B', label: 'Blue', type: 'pwm', x: 0, y: 70 }, { id: 'C', label: 'Common (−)', type: 'ground', x: 0, y: 95 },
    ] },
  { id: 'resistor', name: 'Resistor', icon: '🎯', category: 'Basic', color: '#94A3B8', width: 100, height: 50,
    pins: [{ id: 'A', label: 'Pin 1', type: 'signal', x: 0, y: 25 }, { id: 'B', label: 'Pin 2', type: 'signal', x: 100, y: 25 }] },
  { id: 'push_button', name: 'Push Button', icon: '🔘', category: 'Basic', color: '#A78BFA', width: 100, height: 100,
    pins: [{ id: 'A', label: 'Pin A', type: 'signal', x: 0, y: 30 }, { id: 'B', label: 'Pin B', type: 'signal', x: 0, y: 70 }] },
  { id: 'buzzer', name: 'Buzzer', icon: '🔊', category: 'Basic', color: '#F97316', width: 100, height: 100,
    pins: [{ id: 'P', label: 'Positive (+)', type: 'signal', x: 0, y: 30 }, { id: 'N', label: 'Negative (−)', type: 'ground', x: 0, y: 70 }] },
  // ── Actuators ──
  { id: 'servo', name: 'Servo Motor', icon: '⚙️', category: 'Actuator', color: '#4ADE80', width: 130, height: 140,
    pins: [
      { id: 'VCC', label: 'VCC (Red)', type: 'power', x: 0, y: 25 }, { id: 'GND', label: 'GND (Brown)', type: 'ground', x: 0, y: 60 },
      { id: 'SIG', label: 'Signal (Orange)', type: 'pwm', x: 0, y: 95 },
    ] },
  { id: 'dc_motor', name: 'DC Motor', icon: '🌀', category: 'Actuator', color: '#22D3EE', width: 120, height: 100,
    pins: [{ id: 'P', label: 'Terminal (+)', type: 'power', x: 0, y: 30 }, { id: 'N', label: 'Terminal (−)', type: 'ground', x: 0, y: 70 }] },
  { id: 'stepper', name: 'Stepper Motor', icon: '🔄', category: 'Actuator', color: '#C084FC', width: 130, height: 140,
    pins: [
      { id: 'A1', label: 'A+', type: 'signal', x: 0, y: 20 }, { id: 'A2', label: 'A−', type: 'signal', x: 0, y: 45 },
      { id: 'B1', label: 'B+', type: 'signal', x: 0, y: 70 }, { id: 'B2', label: 'B−', type: 'signal', x: 0, y: 95 },
    ] },
  // ── Sensors ──
  { id: 'ultrasonic', name: 'Ultrasonic Sensor', icon: '📡', category: 'Sensor', color: '#A78BFA', width: 140, height: 150,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 55 },
      { id: 'TRIG', label: 'TRIG', type: 'signal', x: 0, y: 85 }, { id: 'ECHO', label: 'ECHO', type: 'signal', x: 0, y: 115 },
    ] },
  { id: 'ir_sensor', name: 'IR Sensor', icon: '👁️', category: 'Sensor', color: '#F472B6', width: 130, height: 120,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 55 },
      { id: 'OUT', label: 'OUT', type: 'signal', x: 0, y: 85 },
    ] },
  { id: 'ldr', name: 'LDR', icon: '🔅', category: 'Sensor', color: '#FCD34D', width: 100, height: 100,
    pins: [{ id: 'A', label: 'Pin A', type: 'analog', x: 0, y: 30 }, { id: 'C', label: 'Pin C', type: 'ground', x: 0, y: 70 }] },
  { id: 'temp_sensor', name: 'Temp Sensor', icon: '🌡️', category: 'Sensor', color: '#FB7185', width: 110, height: 120,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 55 },
      { id: 'OUT', label: 'DATA', type: 'signal', x: 0, y: 85 },
    ] },
  { id: 'gas_sensor', name: 'Gas Sensor', icon: '💨', category: 'Sensor', color: '#94A3B8', width: 130, height: 120,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 55 },
      { id: 'OUT', label: 'AOUT', type: 'analog', x: 0, y: 85 },
    ] },
  // ── Display ──
  { id: 'lcd', name: 'LCD 16×2', icon: '📟', category: 'Display', color: '#38BDF8', width: 180, height: 120,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 20 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 45 },
      { id: 'SDA', label: 'SDA', type: 'analog', x: 0, y: 70 }, { id: 'SCL', label: 'SCL', type: 'analog', x: 0, y: 95 },
    ] },
  { id: 'oled', name: 'OLED Display', icon: '🖥️', category: 'Display', color: '#818CF8', width: 140, height: 100,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 20 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 45 },
      { id: 'SDA', label: 'SDA', type: 'analog', x: 0, y: 70 }, { id: 'SCL', label: 'SCL', type: 'analog', x: 0, y: 95 },
    ] },
  // ── Power ──
  { id: 'battery', name: 'Battery 9V', icon: '🔋', category: 'Power', color: '#22C55E', width: 80, height: 100,
    pins: [{ id: 'P', label: '+', type: 'power', x: 0, y: 30 }, { id: 'N', label: '−', type: 'ground', x: 0, y: 70 }] },
  { id: 'power_supply', name: 'Power Supply', icon: '⚡', category: 'Power', color: '#EAB308', width: 100, height: 100,
    pins: [{ id: 'V', label: 'V+', type: 'power', x: 0, y: 30 }, { id: 'G', label: 'V−', type: 'ground', x: 0, y: 70 }] },
  // ── Modules ──
  { id: 'motor_driver', name: 'Motor Driver L298N', icon: '🚗', category: 'Module', color: '#DC2626', width: 160, height: 180,
    pins: [
      { id: 'IN1', label: 'IN1', type: 'digital', x: 0, y: 25 }, { id: 'IN2', label: 'IN2', type: 'digital', x: 0, y: 50 },
      { id: 'ENA', label: 'ENA', type: 'pwm', x: 0, y: 75 },
      { id: 'OUT1', label: 'OUT1', type: 'power', x: 160, y: 25 }, { id: 'OUT2', label: 'OUT2', type: 'ground', x: 160, y: 50 },
      { id: '12V', label: '12V', type: 'power', x: 160, y: 75 }, { id: 'GND', label: 'GND', type: 'ground', x: 160, y: 100 },
    ] },
  { id: 'bluetooth', name: 'Bluetooth HC-05', icon: '📶', category: 'Module', color: '#3B82F6', width: 140, height: 140,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 55 },
      { id: 'TX', label: 'TX', type: 'signal', x: 0, y: 85 }, { id: 'RX', label: 'RX', type: 'signal', x: 0, y: 115 },
    ] },
  { id: 'relay', name: 'Relay Module', icon: '🔀', category: 'Module', color: '#F59E0B', width: 120, height: 120,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 25 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 55 },
      { id: 'IN', label: 'IN', type: 'signal', x: 0, y: 85 },
    ] },
  { id: 'joystick', name: 'Joystick Module', icon: '🕹️', category: 'Module', color: '#10B981', width: 130, height: 140,
    pins: [
      { id: 'VCC', label: 'VCC', type: 'power', x: 0, y: 20 }, { id: 'GND', label: 'GND', type: 'ground', x: 0, y: 45 },
      { id: 'VRX', label: 'VRX', type: 'analog', x: 0, y: 70 }, { id: 'VRY', label: 'VRY', type: 'analog', x: 0, y: 95 },
      { id: 'SW', label: 'SW', type: 'digital', x: 0, y: 120 },
    ] },
];

export function getComponentById(id) {
  return CIRCUIT_COMPONENTS.find(c => c.id === id);
}

export const COMPONENT_CATEGORIES = ['Microcontroller', 'Basic', 'Actuator', 'Sensor', 'Display', 'Power', 'Module'];