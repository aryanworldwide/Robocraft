// Approximate Indian retail prices (₹) for common school robotics parts, based on
// typical 2026 online-store prices (Robu, Amazon.in, local electronics markets).
// Prices vary by seller and quality — shown as a range for budgeting only.
const PRICE_TABLE = [
  [/arduino uno/i, 450, 750], [/arduino nano/i, 300, 450], [/arduino mega/i, 900, 1400], [/esp32/i, 380, 600], [/esp8266|nodemcu/i, 250, 380],
  [/raspberry pi pico/i, 400, 550], [/raspberry pi/i, 4500, 7000],
  [/tcrt5000|ir sensor|ir obstacle|ir module/i, 45, 80], [/line sensor array|5.channel|qtr/i, 250, 450], [/hc-?sr04|ultrasonic/i, 70, 130],
  [/dht22|am2302/i, 220, 320], [/dht11/i, 90, 150], [/bmp280|bme280/i, 110, 350], [/mpu.?6050|imu|gyro/i, 140, 220], [/ldr|photoresistor/i, 5, 15],
  [/pir/i, 70, 120], [/soil moisture/i, 60, 110], [/gas sensor|mq-?\d/i, 120, 200], [/rain sensor/i, 60, 100], [/flame sensor/i, 40, 80],
  [/l298n|motor driver/i, 140, 220], [/tb6612/i, 180, 280], [/pca9685/i, 280, 380],
  [/hc-?05|hc-?06|bluetooth/i, 240, 350], [/oled/i, 180, 280], [/16x2|lcd/i, 120, 250], [/i2c (module|adapter)/i, 60, 100], [/7.segment/i, 15, 40],
  [/mg996r/i, 300, 450], [/mg90s/i, 180, 260], [/sg90|servo/i, 90, 150],
  [/n20/i, 250, 400], [/bo motor|dc motor|tt motor|gear motor|geared motor/i, 70, 130], [/stepper|28byj/i, 140, 220],
  [/chassis/i, 280, 550], [/wheel/i, 40, 90], [/caster/i, 40, 80], [/robot arm kit|acrylic arm/i, 600, 1200],
  [/18650/i, 180, 300], [/9\s?v battery/i, 40, 90], [/aa\b|battery pack|battery holder/i, 60, 150], [/li-?po/i, 500, 1100], [/power bank/i, 500, 900],
  [/buck|lm2596|regulator/i, 60, 120], [/breadboard/i, 70, 150], [/jumper|wires/i, 60, 120], [/resistor/i, 2, 5], [/led/i, 2, 6], [/push button|switch/i, 5, 25],
  [/buzzer/i, 15, 40], [/relay/i, 60, 120], [/potentiometer/i, 15, 35], [/capacitor/i, 3, 10], [/usb cable/i, 60, 150],
  [/power supply|adapter/i, 150, 300], [/water pump|mini pump/i, 80, 160], [/transistor/i, 2, 6], [/dustbin|container|bottle/i, 50, 150], [/drone frame/i, 350, 700],
  [/tape/i, 30, 60], [/screws|nuts|standoff/i, 50, 120], [/glue/i, 40, 120], [/cardboard|foam board/i, 30, 80],
];

export function priceOf(component) {
  const qty = Number((String(component).match(/^(\d+)\s*x\b/i) || [])[1] || (String(component).match(/\((\d+)\)/) || [])[1] || 1);
  for (const [re, lo, hi] of PRICE_TABLE) if (re.test(component)) return { lo: lo * qty, hi: hi * qty, qty };
  return null;
}

export function estimateBOM(components = []) {
  const rows = components.map(c => ({ name: c, price: priceOf(c) }));
  const known = rows.filter(r => r.price);
  return { rows, lo: known.reduce((s, r) => s + r.price.lo, 0), hi: known.reduce((s, r) => s + r.price.hi, 0), unknown: rows.length - known.length };
}

export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
