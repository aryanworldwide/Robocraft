// Local, deterministic simulation engine (zero AI credits).
// Given an experiment, resolved pins, and student inputs, produces component
// visual states + serial monitor lines over time.

export function createSimState() {
  return { t: 0, lastSerial: 0, ledOn: false, servoAngle: 90, motorAngle: 0,
    irDetected: false, distance: 30, buzzerOn: false, prevButton: false };
}

// inputs: { buttonPressed (bool), objectCm (number) }
// dt in milliseconds
// Returns { state, serial (string|null) }
export function stepSim(experiment, pins, state, inputs, dt) {
  const s = { ...state };
  s.t += dt;
  let serial = null;
  const cm = Math.max(0, Math.round(inputs.objectCm ?? 30));

  switch (experiment.sim) {
    case 'led_blink': {
      s.ledOn = Math.floor(s.t / 500) % 2 === 0;
      if (s.t - s.lastSerial >= 500) { serial = `LED: ${s.ledOn ? 'ON' : 'OFF'}`; s.lastSerial = s.t; }
      break;
    }
    case 'push_button': {
      s.ledOn = !!inputs.buttonPressed;
      if (s.ledOn !== s.prevButton) { serial = s.ledOn ? 'Button: PRESSED  -> LED ON' : 'Button: released -> LED OFF'; s.prevButton = s.ledOn; s.lastSerial = s.t; }
      break;
    }
    case 'servo_sweep': {
      s.servoAngle = 90 + 90 * Math.sin(s.t / 700);
      if (s.t - s.lastSerial >= 300) { serial = `Servo angle: ${Math.round(s.servoAngle)}°`; s.lastSerial = s.t; }
      break;
    }
    case 'ir_sensor': {
      s.irDetected = cm < 5;
      s.ledOn = s.irDetected;
      if (s.t - s.lastSerial >= 200) { serial = s.irDetected ? `IR: Object detected -> LED ON (${cm}cm)` : `IR: Clear -> LED OFF (${cm}cm)`; s.lastSerial = s.t; }
      break;
    }
    case 'ultrasonic': {
      s.distance = cm;
      s.ledOn = cm < 10;
      if (s.t - s.lastSerial >= 200) { serial = `Distance: ${cm} cm`; s.lastSerial = s.t; }
      break;
    }
    case 'dc_motor': {
      s.motorAngle = (s.motorAngle + (dt / 1000) * 360 * (inputs.motorSpeed || 0) / 255) % 360;
      break;
    }
    default: break;
  }
  return { state: s, serial };
}

// Which interactive input controls does this experiment need?
export function simInputsFor(experiment) {
  switch (experiment.sim) {
    case 'push_button': return { button: true };
    case 'ir_sensor':
    case 'ultrasonic': return { object: true };
    default: return {};
  }
}
