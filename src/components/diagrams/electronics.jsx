import React from 'react';
import { K, Svg, T, Box, Arrow, Line, Circle } from './kit';

export function LedCircuit() {
  return (
    <Svg w={340} h={200} label="LED with a current-limiting resistor">
      <rect x={30} y={60} width={12} height={70} fill="none" stroke="currentColor" />
      <Line x1={24} y1={60} x2={48} y2={60} w={3} /><T x={58} y={56} s={9} a="start">+5 V</T>
      <Line x1={36} y1={60} x2={36} y2={30} /><Line x1={36} y1={30} x2={110} y2={30} />
      <path d="M110 30 l6 -7 l8 14 l8 -14 l8 14 l8 -14 l8 14 l6 -7" fill="none" stroke={K.amber} strokeWidth={2} />
      <T x={140} y={12} s={9} b c={K.amber}>R = 220 Ω</T>
      <Line x1={162} y1={30} x2={220} y2={30} />
      <polygon points="220,18 220,42 242,30" fill={K.red} fillOpacity={0.35} stroke={K.red} />
      <Line x1={242} y1={18} x2={242} y2={42} c={K.red} w={2} />
      <Arrow x1={236} y1={12} x2={250} y2={0} c={K.red} head={4} /><Arrow x1={244} y1={14} x2={258} y2={2} c={K.red} head={4} />
      <T x={231} y={52} s={8.5}>LED</T><T x={218} y={66} s={7.5} o={0.75}>long leg (+)</T>
      <Line x1={242} y1={30} x2={290} y2={30} /><Line x1={290} y1={30} x2={290} y2={150} />
      <Line x1={290} y1={150} x2={36} y2={150} /><Line x1={36} y1={150} x2={36} y2={130} />
      <T x={170} y={162} s={9}>GND (0 V)</T>
      <Box x={70} y={86} w={190} h={44} c={K.purple} r={6} />
      <T x={165} y={98} s={8.5}>R = (V supply − V LED) ÷ I</T>
      <T x={165} y={116} s={8.5}>= (5 − 2) ÷ 0.015 ≈ 200 Ω → use 220 Ω</T>
      <T x={170} y={186} s={8.5} o={0.8} c={K.red}>No resistor = too much current = burnt LED or pin</T>
    </Svg>
  );
}

export function OhmTriangle() {
  return (
    <Svg w={340} h={170} label="Ohm's law triangle">
      <polygon points="90,12 20,140 160,140" fill={K.cyan} fillOpacity={0.12} stroke={K.cyan} strokeWidth={1.5} />
      <Line x1={52} y1={82} x2={128} y2={82} c={K.cyan} />
      <Line x1={90} y1={82} x2={90} y2={140} c={K.cyan} />
      <T x={90} y={58} s={20} b c={K.purple}>V</T><T x={60} y={112} s={18} b c={K.amber}>I</T><T x={120} y={112} s={18} b c={K.green}>R</T>
      <T x={250} y={36} s={10}>V = I × R</T><T x={250} y={66} s={10}>I = V ÷ R</T><T x={250} y={96} s={10}>R = V ÷ I</T>
      <T x={250} y={130} s={8.5} o={0.8}>V volts · I amps · R ohms{'\n'}P (watts) = V × I</T>
    </Svg>
  );
}

export function Pwm() {
  const wave = (y, duty, label) => {
    let d = `M 30 ${y + 24}`;
    for (let k = 0; k < 4; k++) {
      const x0 = 30 + k * 60, on = 60 * duty;
      d += ` L ${x0} ${y} L ${x0 + on} ${y} L ${x0 + on} ${y + 24} L ${x0 + 60} ${y + 24}`;
    }
    return (
      <g>
        <path d={d} fill="none" stroke={K.cyan} strokeWidth={2} />
        <T x={286} y={y + 6} s={9} b a="start">{label}</T>
        <T x={286} y={y + 20} s={8} a="start" o={0.75}>avg {(5 * duty).toFixed(2)} V</T>
      </g>
    );
  };
  return (
    <Svg w={350} h={180} label="PWM duty cycles">
      {wave(8, 0.25, '25% duty')}
      {wave(62, 0.5, '50% duty')}
      {wave(116, 0.75, '75% duty')}
      <T x={160} y={170} s={8.5} o={0.8}>Same 5 V pulses, different ON-time → motor runs slow / medium / fast</T>
    </Svg>
  );
}

export function HBridge() {
  const sw = (x, y, l, on) => (
    <g><rect x={x} y={y} width={36} height={22} rx={4} fill={on ? K.green : K.grey} fillOpacity={on ? 0.35 : 0.1} stroke={on ? K.green : K.grey} /><T x={x + 18} y={y + 11} s={9} b>{l}</T></g>
  );
  return (
    <Svg w={340} h={210} label="H-bridge motor driver">
      <Line x1={60} y1={20} x2={280} y2={20} w={2} /><T x={170} y={10} s={9}>+V (battery)</T>
      <Line x1={60} y1={190} x2={280} y2={190} w={2} /><T x={170} y={202} s={9}>GND</T>
      <Line x1={80} y1={20} x2={80} y2={40} /><Line x1={260} y1={20} x2={260} y2={40} />
      {sw(62, 40, 'S1', true)}{sw(242, 40, 'S2', false)}
      <Line x1={80} y1={62} x2={80} y2={140} /><Line x1={260} y1={62} x2={260} y2={140} />
      {sw(62, 140, 'S3', false)}{sw(242, 140, 'S4', true)}
      <Line x1={80} y1={162} x2={80} y2={190} /><Line x1={260} y1={162} x2={260} y2={190} />
      <Line x1={80} y1={100} x2={150} y2={100} /><Line x1={190} y1={100} x2={260} y2={100} />
      <Circle x={170} y={100} r={20} c={K.cyan} label="M" />
      <Arrow x1={96} y1={70} x2={140} y2={90} c={K.green} /><Arrow x1={200} y1={110} x2={244} y2={130} c={K.green} />
      <T x={170} y={136} s={8.5} c={K.green}>S1 + S4 ON → forward</T>
      <T x={170} y={70} s={8.5} c={K.purple}>S2 + S3 ON → reverse</T>
      <T x={330} y={100} s={8} a="end" o={0.7}>never S1+S3{'\n'}(short!)</T>
    </Svg>
  );
}

export function Ultrasonic() {
  return (
    <Svg w={340} h={170} label="Ultrasonic distance sensor">
      <rect x={10} y={50} width={60} height={50} rx={6} fill={K.cyan} fillOpacity={0.15} stroke={K.cyan} />
      <circle cx={28} cy={75} r={11} fill="none" stroke={K.cyan} /><circle cx={52} cy={75} r={11} fill="none" stroke={K.cyan} />
      <T x={28} y={110} s={8}>Trig</T><T x={52} y={110} s={8}>Echo</T>
      {[0, 1, 2].map(i => <path key={i} d={`M${86 + i * 14} 58 q10 12 0 26`} fill="none" stroke={K.green} strokeWidth={1.5} />)}
      <Arrow x1={130} y1={64} x2={248} y2={64} c={K.green} label="40 kHz pulse →" />
      <Arrow x1={248} y1={88} x2={130} y2={88} c={K.amber} label="← echo" ly={102} />
      <rect x={254} y={36} width={22} height={80} fill={K.grey} fillOpacity={0.3} stroke={K.grey} />
      <T x={300} y={76} s={9}>object</T>
      <Box x={20} y={128} w={300} h={34} c={K.purple} r={6} />
      <T x={170} y={145} s={9}>distance = (speed of sound × time) ÷ 2 = 0.0343 cm/µs × t ÷ 2</T>
    </Svg>
  );
}

export function PidLoop() {
  return (
    <Svg w={350} h={200} label="PID control loop">
      <Box x={4} y={70} w={56} h={30} label="Target" c={K.grey} s={9} />
      <Circle x={80} y={85} r={11} c={K.cyan} label="Σ" />
      <Arrow x1={60} y1={85} x2={69} y2={85} />
      <Box x={110} y={14} w={80} h={30} label="P × error" c={K.cyan} s={9} />
      <Box x={110} y={70} w={80} h={30} label="I × Σ error" c={K.purple} s={9} />
      <Box x={110} y={126} w={80} h={30} label="D × Δerror" c={K.amber} s={9} />
      <Line x1={91} y1={85} x2={100} y2={85} /><Line x1={100} y1={29} x2={100} y2={141} />
      <Arrow x1={100} y1={29} x2={110} y2={29} head={4} /><Arrow x1={100} y1={85} x2={110} y2={85} head={4} /><Arrow x1={100} y1={141} x2={110} y2={141} head={4} />
      <Circle x={214} y={85} r={11} c={K.green} label="+" />
      <Arrow x1={190} y1={29} x2={206} y2={77} head={5} /><Arrow x1={190} y1={85} x2={203} y2={85} head={5} /><Arrow x1={190} y1={141} x2={206} y2={93} head={5} />
      <Box x={240} y={70} w={56} h={30} label="Motor" c={K.orange} s={9} />
      <Arrow x1={225} y1={85} x2={240} y2={85} />
      <Arrow x1={296} y1={85} x2={340} y2={85} /><T x={330} y={74} s={8.5}>output</T>
      <Box x={240} y={160} w={56} h={26} label="Sensor" c={K.blue} s={9} />
      <Line x1={318} y1={85} x2={318} y2={173} /><Arrow x1={318} y1={173} x2={296} y2={173} />
      <Line x1={240} y1={173} x2={80} y2={173} /><Arrow x1={80} y1={173} x2={80} y2={96} /><T x={70} y={110} s={10} c={K.red}>−</T>
      <T x={150} y={192} s={8} o={0.75}>P reacts to now · I fixes steady error · D damps overshoot</T>
    </Svg>
  );
}

export function CommProtocols() {
  return (
    <Svg w={360} h={240} label="UART, I2C, SPI and CAN wiring">
      <T x={10} y={12} a="start" b s={9.5} c={K.cyan}>UART — 2 wires, point-to-point</T>
      <Box x={10} y={22} w={60} h={34} label="Device A" c={K.cyan} s={8.5} />
      <Box x={120} y={22} w={60} h={34} label="Device B" c={K.cyan} s={8.5} />
      <Arrow x1={70} y1={31} x2={120} y2={47} head={5} /><Arrow x1={120} y1={31} x2={70} y2={47} head={5} />
      <T x={95} y={64} s={7.5} o={0.8}>TX→RX crossed, no clock</T>
      <T x={190} y={12} a="start" b s={9.5} c={K.green}>I2C — 2 wires, many devices</T>
      <Line x1={196} y1={30} x2={354} y2={30} c={K.green} /><Line x1={196} y1={44} x2={354} y2={44} c={K.amber} />
      <T x={198} y={24} s={7.5} a="start" c={K.green}>SDA data</T><T x={198} y={52} s={7.5} a="start" c={K.amber}>SCL clock</T>
      {[250, 290, 330].map((x, i) => <g key={x}><Line x1={x} y1={30} x2={x} y2={60} o={0.5} /><Box x={x - 16} y={60} w={32} h={16} label={['0x3C', '0x68', '0x76'][i]} c={K.green} s={7} r={3} /></g>)}
      <T x={10} y={104} a="start" b s={9.5} c={K.purple}>SPI — 4 wires, fastest</T>
      <Box x={10} y={114} w={60} h={70} label="Master" c={K.purple} s={8.5} />
      <Box x={130} y={114} w={56} h={70} label="Slave" c={K.purple} s={8.5} />
      {['MOSI', 'MISO', 'SCK', 'CS'].map((n, i) => <g key={n}><Arrow x1={i === 1 ? 130 : 70} y1={124 + i * 16} x2={i === 1 ? 70 : 130} y2={124 + i * 16} head={4} /><T x={100} y={119 + i * 16} s={7}>{n}</T></g>)}
      <T x={200} y={104} a="start" b s={9.5} c={K.red}>CAN — differential bus (cars)</T>
      <Line x1={206} y1={124} x2={354} y2={124} c={K.red} /><Line x1={206} y1={136} x2={354} y2={136} c={K.blue} />
      <T x={210} y={116} s={7.5} a="start" c={K.red}>CAN-H</T><T x={210} y={146} s={7.5} a="start" c={K.blue}>CAN-L</T>
      {[250, 300].map(x => <g key={x}><Line x1={x} y1={136} x2={x} y2={156} o={0.5} /><Box x={x - 18} y={156} w={36} h={16} label="ECU" c={K.red} s={7} r={3} /></g>)}
      <rect x={344} y={124} width={8} height={12} fill={K.grey} opacity={0.5} /><T x={330} y={160} s={7} o={0.7}>120 Ω</T>
      <T x={180} y={204} s={8.5} o={0.85}>Speed: UART ≈ 115 kbps · I2C 100–400 kbps · SPI 10+ Mbps · CAN 1 Mbps</T>
      <T x={180} y={222} s={8.5} o={0.85}>Error checks: UART parity · I2C ACK · SPI none · CAN CRC (very reliable)</T>
    </Svg>
  );
}

export function BatteryCompare() {
  const rows = [['', 'Lithium-ion / LiPo', 'Lead-acid'], ['Energy per kg', 'High (150–250 Wh/kg)', 'Low (30–40 Wh/kg)'], ['Weight', 'Light', 'Very heavy'], ['Cost', 'Higher', 'Cheap'], ['Life', '500–1500 cycles', '200–500 cycles'], ['Risk', 'Fire if punctured/overcharged', 'Acid, heavy metals'], ['Used in', 'Drones, phones, small robots', 'UPS, cars, big AGVs']];
  return (
    <Svg w={350} h={170} label="Lithium-ion versus lead-acid batteries">
      {rows.map((r, j) => r.map((c, i) => (
        <T key={`${j}${i}`} x={[6, 150, 280][i]} y={12 + j * 23} s={8.5} a={i === 0 ? 'start' : 'middle'} b={j === 0 || i === 0} c={j === 0 ? (i === 1 ? K.cyan : K.amber) : 'currentColor'}>{c}</T>
      )))}
      <Line x1={4} y1={22} x2={346} y2={22} o={0.4} />
    </Svg>
  );
}

export function PowerBudget() {
  const rows = [['Arduino Uno', '5 V', '50 mA'], ['2 × DC gear motors', '6 V', '2 × 250 mA'], ['Servo (moving)', '5 V', '500 mA'], ['Ultrasonic sensor', '5 V', '15 mA'], ['Bluetooth HC-05', '5 V', '40 mA']];
  return (
    <Svg w={340} h={180} label="Power budget table">
      {['Part', 'Voltage', 'Current'].map((h, i) => <T key={h} x={[10, 200, 290][i]} y={12} b s={9} a={i ? 'middle' : 'start'}>{h}</T>)}
      <Line x1={6} y1={22} x2={334} y2={22} o={0.4} />
      {rows.map((r, j) => r.map((c, i) => <T key={`${j}${i}`} x={[10, 200, 290][i]} y={36 + j * 18} s={9} a={i ? 'middle' : 'start'}>{c}</T>))}
      <Line x1={6} y1={128} x2={334} y2={128} o={0.4} />
      <T x={10} y={142} s={9} b a="start">Total ≈ 1.1 A → add 25–50% margin → 1.5 A supply</T>
      <T x={10} y={162} s={8.5} a="start" o={0.8}>2000 mAh battery ÷ 1.1 A ≈ 1.8 hours run time</T>
    </Svg>
  );
}
