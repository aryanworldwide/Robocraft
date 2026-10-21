import React from 'react';
import { K, Svg, T, Box, Arrow, Line, Circle, ArcArrow, Pivot, Ground, Gear } from './kit';

export function RobotFields() {
  return (
    <Svg w={340} h={210} label="Robotics combines mechanical, electrical and computer engineering">
      <Circle x={130} y={80} r={62} c={K.orange} fo={0.12} />
      <Circle x={210} y={80} r={62} c={K.amber} fo={0.12} />
      <Circle x={170} y={140} r={62} c={K.purple} fo={0.12} />
      <T x={100} y={58} b s={11}>Mechanical</T><T x={100} y={73} s={9} o={0.75}>body, joints,{'\n'}gears</T>
      <T x={242} y={58} b s={11}>Electrical</T><T x={242} y={73} s={9} o={0.75}>motors, power,{'\n'}circuits</T>
      <T x={170} y={175} b s={11}>Computer Science</T><T x={170} y={190} s={9} o={0.75}>code, AI, control</T>
      <T x={170} y={102} b s={12} c={K.cyan}>ROBOTICS</T>
    </Svg>
  );
}

export function SensePlanAct() {
  return (
    <Svg w={340} h={210} label="Sense, plan, act cycle">
      <Box x={20} y={80} w={86} h={50} label="SENSE" sub="sensors read" c={K.green} />
      <Box x={127} y={18} w={86} h={50} label="PLAN" sub="controller decides" c={K.purple} />
      <Box x={234} y={80} w={86} h={50} label="ACT" sub="motors move" c={K.orange} />
      <Arrow x1={70} y1={78} x2={127} y2={50} />
      <Arrow x1={213} y1={50} x2={270} y2={78} />
      <Box x={110} y={150} w={120} h={42} label="ENVIRONMENT" sub="the world changes" c={K.grey} />
      <Arrow x1={275} y1={132} x2={232} y2={165} />
      <Arrow x1={110} y1={168} x2={66} y2={132} />
      <T x={170} y={110} s={9} o={0.7} i>repeats many times{'\n'}every second</T>
    </Svg>
  );
}

export function RobotBlock() {
  return (
    <Svg w={340} h={228} label="General block diagram of a robot">
      <Box x={8} y={85} w={74} h={46} label="Sensors" sub="input" c={K.green} />
      <Box x={120} y={78} w={92} h={60} label="Controller" sub="the brain (MCU/SBC)" c={K.purple} />
      <Box x={252} y={85} w={80} h={46} label="Actuators" sub="motors, servos" c={K.orange} />
      <Box x={124} y={10} w={84} h={36} label="Power supply" c={K.amber} s={9} />
      <Box x={124} y={172} w={84} h={36} label="Communication" sub="Bluetooth/Wi-Fi" c={K.blue} s={9} />
      <Box x={252} y={172} w={80} h={36} label="Mechanism" sub="links, end-effector" c={K.cyan} s={9} />
      <Arrow x1={82} y1={108} x2={120} y2={108} label="data" />
      <Arrow x1={212} y1={108} x2={252} y2={108} label="commands" />
      <Arrow x1={166} y1={46} x2={166} y2={78} />
      <Arrow x1={166} y1={172} x2={166} y2={138} both />
      <Arrow x1={292} y1={131} x2={292} y2={172} />
      <Line x1={292} y1={208} x2={292} y2={218} dash="4 3" c={K.grey} />
      <Line x1={292} y1={218} x2={45} y2={218} dash="4 3" c={K.grey} />
      <Arrow x1={45} y1={218} x2={45} y2={131} dash="4 3" c={K.grey} label="feedback (sensors see the result)" lx={95} ly={160} />
    </Svg>
  );
}

export function RobotTimeline() {
  const ev = [
    ['250 BC', 'Ctesibius\nwater clock'], ['1495', 'Da Vinci\nknight'], ['1920', '"Robot" in\nR.U.R.'],
    ['1942', 'Asimov\'s\nlaws'], ['1961', 'Unimate\n(GM)'], ['2002', 'Roomba'], ['2013', 'Atlas'], ['2021', 'Perseverance\non Mars'],
  ];
  return (
    <Svg w={360} h={150} label="Timeline of robots">
      <Line x1={14} y1={70} x2={348} y2={70} w={2} />
      {ev.map(([yr, name], i) => {
        const x = 26 + i * 44;
        const up = i % 2 === 0;
        return (
          <g key={i}>
            <Circle x={x} y={70} r={5} c={K.cyan} fo={0.8} />
            <T x={x} y={up ? 52 : 88} s={9} b c={K.cyan}>{yr}</T>
            <T x={x} y={up ? 26 : 116} s={8.5}>{name}</T>
          </g>
        );
      })}
    </Svg>
  );
}

export function RobotClassification() {
  return (
    <Svg w={350} h={230} label="Ways to classify robots">
      <Box x={130} y={6} w={90} h={30} label="ROBOTS" c={K.cyan} />
      {[
        ['Field / terrain', ['Ground (wheeled,\nlegged)', 'Aerial (drones)', 'Underwater', 'Space'], K.green, 6],
        ['Control', ['Manual /\nteleoperated', 'Automatic', 'Autonomous'], K.purple, 124],
        ['Application', ['Industrial', 'Medical', 'Domestic', 'Defence, farm,\nentertainment'], K.orange, 238],
      ].map(([h, items, c, x]) => (
        <g key={h}>
          <Line x1={175} y1={36} x2={x + 52} y2={56} o={0.5} />
          <Box x={x} y={56} w={104} h={26} label={h} c={c} s={9.5} />
          {items.map((it, k) => <T key={k} x={x + 52} y={102 + k * 30} s={8.5}>{it}</T>)}
        </g>
      ))}
      <Box x={60} y={204} w={230} h={22} label="Bio-inspired: copy animals (snake, fish, gecko, insect)" c={K.pink} s={8.5} r={6} />
    </Svg>
  );
}

export function RobotArmAnatomy() {
  return (
    <Svg w={350} h={230} label="Anatomy of an industrial robot arm">
      <rect x={60} y={190} width={70} height={18} rx={3} fill={K.grey} fillOpacity={0.25} stroke={K.grey} />
      <rect x={78} y={168} width={34} height={22} rx={3} fill={K.cyan} fillOpacity={0.2} stroke={K.cyan} />
      {/* upper arm */}
      <line x1={95} y1={168} x2={150} y2={90} stroke={K.cyan} strokeWidth={12} strokeLinecap="round" opacity={0.35} />
      <line x1={150} y1={90} x2={235} y2={78} stroke={K.purple} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
      <line x1={235} y1={78} x2={258} y2={95} stroke={K.orange} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
      <Pivot x={95} y={168} /><Pivot x={150} y={90} /><Pivot x={235} y={78} />
      {/* gripper */}
      <path d="M258 95 l14 2 M258 95 l8 13" stroke={K.orange} strokeWidth={3} strokeLinecap="round" />
      <T x={95} y={218} s={9} b>Base (fixed)</T>
      <Arrow x1={40} y1={170} x2={76} y2={176} /><T x={22} y={162} s={8.5} a="start">Waist</T>
      <Arrow x1={60} y1={120} x2={88} y2={160} /><T x={30} y={112} s={8.5} a="start">Shoulder joint</T>
      <T x={130} y={140} s={8.5} a="start">Upper arm{'\n'}(link 1)</T>
      <Arrow x1={160} y1={40} x2={150} y2={84} /><T x={160} y={30} s={8.5}>Elbow joint</T>
      <T x={195} y={66} s={8.5}>Forearm (link 2)</T>
      <Arrow x1={260} y1={45} x2={238} y2={72} /><T x={270} y={36} s={8.5}>Wrist (roll/pitch/yaw)</T>
      <Arrow x1={300} y1={120} x2={268} y2={102} /><T x={305} y={130} s={8.5}>End-effector{'\n'}(gripper/tool)</T>
      <Box x={230} y={170} w={100} h={40} label="Controller" sub="+ teach pendant" c={K.purple} s={9} />
      <Line x1={230} y1={190} x2={130} y2={199} dash="3 3" o={0.5} />
    </Svg>
  );
}

export function JointTypes() {
  return (
    <Svg w={360} h={170} label="Types of joints">
      {/* revolute */}
      <g>
        <rect x={20} y={70} width={60} height={12} rx={4} fill={K.cyan} fillOpacity={0.3} stroke={K.cyan} />
        <Pivot x={26} y={76} /><ArcArrow x={26} y={76} r={22} from={-80} to={40} c={K.cyan} />
        <T x={50} y={130} b s={10}>Revolute (R)</T><T x={50} y={146} s={8.5} o={0.75}>rotates — hinge,{'\n'}elbow</T>
      </g>
      {/* prismatic */}
      <g>
        <rect x={105} y={66} width={70} height={20} rx={3} fill="none" stroke={K.green} />
        <rect x={130} y={70} width={60} height={12} rx={3} fill={K.green} fillOpacity={0.3} stroke={K.green} />
        <Arrow x1={140} y1={52} x2={180} y2={52} c={K.green} both />
        <T x={145} y={130} b s={10}>Prismatic (P)</T><T x={145} y={146} s={8.5} o={0.75}>slides — drawer,{'\n'}lift</T>
      </g>
      {/* spherical */}
      <g>
        <path d="M222 92 a22 22 0 0 1 44 0" fill="none" stroke={K.purple} strokeWidth={3} />
        <circle cx={244} cy={84} r={11} fill={K.purple} fillOpacity={0.3} stroke={K.purple} />
        <line x1={244} y1={84} x2={262} y2={50} stroke={K.purple} strokeWidth={6} opacity={0.4} strokeLinecap="round" />
        <ArcArrow x={244} y={84} r={30} from={200} to={330} c={K.purple} />
        <T x={244} y={130} b s={10}>Spherical (S)</T><T x={244} y={146} s={8.5} o={0.75}>ball &amp; socket —{'\n'}shoulder, hip</T>
      </g>
      {/* cylindrical */}
      <g>
        <rect x={300} y={50} width={14} height={60} rx={3} fill="none" stroke={K.orange} />
        <rect x={303} y={60} width={8} height={36} rx={2} fill={K.orange} fillOpacity={0.35} />
        <Arrow x1={330} y1={58} x2={330} y2={100} c={K.orange} both />
        <ArcArrow x={307} y={44} r={12} from={160} to={20} c={K.orange} />
        <T x={318} y={130} b s={10}>Cylindrical</T><T x={318} y={146} s={8.5} o={0.75}>rotate + slide</T>
      </g>
    </Svg>
  );
}

export function Dof6() {
  return (
    <Svg w={340} h={210} label="Six degrees of freedom">
      <Arrow x1={170} y1={110} x2={290} y2={110} c={K.red} w={2} /><T x={300} y={110} b c={K.red}>X</T>
      <Arrow x1={170} y1={110} x2={170} y2={18} c={K.green} w={2} /><T x={170} y={10} b c={K.green}>Z</T>
      <Arrow x1={170} y1={110} x2={95} y2={175} c={K.blue} w={2} /><T x={86} y={184} b c={K.blue}>Y</T>
      <ArcArrow x={240} y={110} r={14} from={200} to={500} c={K.red} />
      <ArcArrow x={170} y={50} r={14} from={120} to={420} c={K.green} />
      <ArcArrow x={125} y={149} r={14} from={250} to={550} c={K.blue} />
      <T x={245} y={140} s={9}>roll</T><T x={196} y={46} s={9} a="start">yaw</T><T x={98} y={140} s={9}>pitch</T>
      <Box x={10} y={10} w={120} h={58} c={K.cyan} />
      <T x={70} y={24} s={9} b>3 translations</T><T x={70} y={37} s={8.5}>move along X, Y, Z</T>
      <T x={70} y={51} s={9} b>3 rotations</T><T x={70} y={62} s={8.5}>roll, pitch, yaw</T>
      <T x={260} y={190} s={10} b c={K.cyan}>Total = 6 DOF</T>
    </Svg>
  );
}

export function MotionTypes() {
  return (
    <Svg w={360} h={160} label="Types of motion">
      <g>
        <rect x={18} y={64} width={26} height={20} rx={3} fill={K.cyan} fillOpacity={0.3} stroke={K.cyan} />
        <Arrow x1={50} y1={74} x2={100} y2={74} c={K.cyan} w={2} />
        <Line x1={10} y1={88} x2={110} y2={88} dash="3 3" o={0.4} />
        <T x={60} y={118} b>Linear</T><T x={60} y={134} s={8.5} o={0.75}>straight line —{'\n'}lift, conveyor</T>
      </g>
      <g>
        <Pivot x={180} y={80} />
        <line x1={180} y1={80} x2={220} y2={58} stroke={K.purple} strokeWidth={6} opacity={0.4} strokeLinecap="round" />
        <ArcArrow x={180} y={80} r={34} from={-20} to={-80} c={K.purple} />
        <T x={196} y={74} s={8} a="start">θ</T>
        <T x={180} y={118} b>Angular</T><T x={180} y={134} s={8.5} o={0.75}>turns through an{'\n'}angle — robot joint</T>
      </g>
      <g>
        <circle cx={300} cy={72} r={30} fill="none" stroke={K.orange} strokeDasharray="4 3" />
        <Pivot x={300} y={72} />
        <circle cx={330} cy={72} r={6} fill={K.orange} />
        <ArcArrow x={300} y={72} r={38} from={-30} to={60} c={K.orange} />
        <T x={300} y={118} b>Circular</T><T x={300} y={134} s={8.5} o={0.75}>moves round a{'\n'}centre — wheel</T>
      </g>
    </Svg>
  );
}

export function FourBar() {
  return (
    <Svg w={340} h={190} label="Four-bar linkage">
      <Ground x={80} y={150} w={40} /><Ground x={250} y={150} w={40} />
      <Line x1={80} y1={146} x2={250} y2={146} c={K.grey} w={3} dash="6 4" />
      <Line x1={80} y1={146} x2={110} y2={80} c={K.cyan} w={6} o={0.6} />
      <Line x1={110} y1={80} x2={235} y2={55} c={K.purple} w={6} o={0.6} />
      <Line x1={235} y1={55} x2={250} y2={146} c={K.orange} w={6} o={0.6} />
      <Pivot x={80} y={146} /><Pivot x={110} y={80} /><Pivot x={235} y={55} /><Pivot x={250} y={146} />
      <ArcArrow x={80} y={146} r={26} from={-130} to={-40} c={K.cyan} />
      <T x={70} y={100} s={9} a="end">Crank{'\n'}(input)</T>
      <T x={170} y={52} s={9}>Coupler</T>
      <T x={262} y={100} s={9} a="start">Rocker{'\n'}(output)</T>
      <T x={165} y={165} s={9}>Fixed link (ground)</T>
      <T x={170} y={182} s={8.5} o={0.75}>4 links + 4 revolute joints → 1 DOF</T>
    </Svg>
  );
}

export function ActuatorTypes() {
  const col = (x, title, c, lines, icon) => (
    <g>
      <Box x={x} y={10} w={104} h={150} c={c} />
      <T x={x + 52} y={26} b>{title}</T>
      {icon}
      {lines.map((l, i) => <T key={i} x={x + 52} y={110 + i * 14} s={8.5}>{l}</T>)}
    </g>
  );
  return (
    <Svg w={340} h={170} label="Electric, hydraulic and pneumatic actuators">
      {col(6, 'Electric', K.cyan, ['DC, servo, stepper', 'precise, clean', 'medium force'],
        <g><circle cx={58} cy={66} r={22} fill="none" stroke={K.cyan} strokeWidth={2} /><T x={58} y={66} b c={K.cyan}>M</T></g>)}
      {col(118, 'Hydraulic', K.orange, ['oil under pressure', 'HUGE force', 'heavy, can leak'],
        <g><rect x={140} y={56} width={50} height={22} rx={3} fill={K.orange} fillOpacity={0.35} stroke={K.orange} /><line x1={190} y1={67} x2={208} y2={67} stroke={K.orange} strokeWidth={4} /></g>)}
      {col(230, 'Pneumatic', K.green, ['compressed air', 'fast, light', 'less precise'],
        <g><rect x={252} y={56} width={50} height={22} rx={3} fill="none" stroke={K.green} />{[0, 1, 2].map(i => <circle key={i} cx={262 + i * 12} cy={67} r={3} fill={K.green} opacity={0.6} />)}<line x1={302} y1={67} x2={320} y2={67} stroke={K.green} strokeWidth={4} /></g>)}
    </Svg>
  );
}

export function OpenClosedLoop() {
  return (
    <Svg w={350} h={210} label="Open-loop and closed-loop control">
      <T x={10} y={14} a="start" b s={10}>Open loop (no checking)</T>
      <Box x={8} y={26} w={60} h={30} label="Input" c={K.grey} s={9} />
      <Box x={92} y={26} w={74} h={30} label="Controller" c={K.purple} s={9} />
      <Box x={190} y={26} w={68} h={30} label="Actuator" c={K.orange} s={9} />
      <Box x={282} y={26} w={60} h={30} label="Output" c={K.green} s={9} />
      <Arrow x1={68} y1={41} x2={92} y2={41} /><Arrow x1={166} y1={41} x2={190} y2={41} /><Arrow x1={258} y1={41} x2={282} y2={41} />
      <T x={175} y={70} s={8.5} o={0.7} i>e.g. toaster timer, fixed-speed conveyor</T>
      <T x={10} y={96} a="start" b s={10}>Closed loop (feedback)</T>
      <Box x={8} y={110} w={56} h={30} label="Set point" c={K.grey} s={9} />
      <Circle x={86} y={125} r={11} c={K.cyan} label="Σ" />
      <Box x={112} y={110} w={70} h={30} label="Controller" c={K.purple} s={9} />
      <Box x={200} y={110} w={64} h={30} label="Actuator" c={K.orange} s={9} />
      <Box x={282} y={110} w={60} h={30} label="Output" c={K.green} s={9} />
      <Box x={200} y={164} w={64} h={28} label="Sensor" c={K.blue} s={9} />
      <Arrow x1={64} y1={125} x2={75} y2={125} /><Arrow x1={97} y1={125} x2={112} y2={125} label="error" />
      <Arrow x1={182} y1={125} x2={200} y2={125} /><Arrow x1={264} y1={125} x2={282} y2={125} />
      <Line x1={312} y1={140} x2={312} y2={178} /><Arrow x1={312} y1={178} x2={264} y2={178} />
      <Line x1={200} y1={178} x2={86} y2={178} /><Arrow x1={86} y1={178} x2={86} y2={136} />
      <T x={76} y={150} s={9} a="end" c={K.red}>−</T>
      <T x={150} y={198} s={8.5} o={0.7} i>e.g. AC thermostat, line follower, cruise control</T>
    </Svg>
  );
}

export function GearRatio() {
  return (
    <Svg w={340} h={200} label="Gear ratio">
      <Gear x={95} y={95} r={30} teeth={12} c={K.cyan} />
      <Gear x={196} y={95} r={66} teeth={36} c={K.orange} rot={0.09} />
      <ArcArrow x={95} y={95} r={44} from={200} to={300} c={K.cyan} />
      <ArcArrow x={196} y={95} r={80} from={300} to={250} c={K.orange} />
      <T x={95} y={150} s={9} b>Driver: 12 teeth</T><T x={95} y={164} s={8.5} o={0.75}>(on the motor)</T>
      <T x={290} y={36} s={9} b>Driven: 36 teeth</T>
      <Box x={10} y={172} w={320} h={24} c={K.purple} r={6} />
      <T x={170} y={184} s={9}>Gear ratio = 36 ÷ 12 = 3 : 1 → output 3× slower, 3× more torque</T>
    </Svg>
  );
}

export function GearTypes() {
  return (
    <Svg w={360} h={160} label="Types of gears">
      <Gear x={42} y={60} r={18} teeth={10} c={K.cyan} /><Gear x={85} y={60} r={22} teeth={12} c={K.cyan} rot={0.13} />
      <T x={62} y={108} b>Spur</T><T x={62} y={124} s={8.5} o={0.75}>parallel shafts</T>
      <polygon points="140,40 180,52 180,80 140,92" fill={K.purple} fillOpacity={0.25} stroke={K.purple} />
      <polygon points="150,96 162,60 190,60 202,96" fill={K.purple} fillOpacity={0.15} stroke={K.purple} />
      <T x={170} y={108} b>Bevel</T><T x={170} y={124} s={8.5} o={0.75}>turns 90°</T>
      <rect x={222} y={52} width={46} height={16} rx={6} fill={K.orange} fillOpacity={0.25} stroke={K.orange} />
      {[0, 1, 2, 3, 4].map(i => <line key={i} x1={226 + i * 9} y1={52} x2={232 + i * 9} y2={68} stroke={K.orange} />)}
      <Gear x={245} y={86} r={14} teeth={10} c={K.orange} />
      <T x={248} y={116} b>Worm</T><T x={248} y={132} s={8.5} o={0.75}>huge reduction,{'\n'}self-locking</T>
      <rect x={290} y={78} width={62} height={10} fill={K.green} fillOpacity={0.3} stroke={K.green} />
      {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={293 + i * 10} y={72} width={5} height={6} fill={K.green} opacity={0.6} />)}
      <Gear x={320} y={54} r={13} teeth={9} c={K.green} />
      <T x={322} y={108} b>Rack &amp; pinion</T><T x={322} y={124} s={8.5} o={0.75}>rotation → line</T>
    </Svg>
  );
}

export function SensorTypes() {
  return (
    <Svg w={350} h={210} label="Classification of sensors">
      <Box x={135} y={6} w={80} h={28} label="SENSORS" c={K.cyan} />
      <Line x1={175} y1={34} x2={85} y2={50} o={0.5} /><Line x1={175} y1={34} x2={262} y2={50} o={0.5} />
      <Box x={20} y={50} w={130} h={28} label="Internal (proprioceptive)" c={K.purple} s={9} />
      <Box x={198} y={50} w={130} h={28} label="External (exteroceptive)" c={K.green} s={9} />
      {['Encoder — wheel/joint angle', 'IMU — tilt, acceleration', 'Current — motor load', 'Battery voltage'].map((t, i) =>
        <T key={i} x={85} y={96 + i * 18} s={8.5}>{t}</T>)}
      {['Vision — camera', 'Tactile — touch, force', 'Temperature', 'Range/proximity — IR, ultrasonic', 'Motion — PIR', 'Navigation — GPS, compass', 'Speech — microphone'].map((t, i) =>
        <T key={i} x={263} y={92 + i * 16} s={8.5}>{t}</T>)}
      <T x={85} y={180} s={8.5} o={0.7} i>measure the robot itself</T>
      <T x={263} y={204} s={8.5} o={0.7} i>measure the world around it</T>
    </Svg>
  );
}

export function RRMechanism() {
  const a1 = -0.95, a2 = 0.85, L1 = 90, L2 = 70;
  const x0 = 80, y0 = 170;
  const x1 = x0 + L1 * Math.cos(a1), y1 = y0 + L1 * Math.sin(a1);
  const x2 = x1 + L2 * Math.cos(a1 + a2), y2 = y1 + L2 * Math.sin(a1 + a2);
  return (
    <Svg w={340} h={210} label="RR (two revolute joint) mechanism">
      <Arrow x1={60} y1={170} x2={320} y2={170} c={K.grey} /><T x={326} y={170} s={9}>x</T>
      <Arrow x1={80} y1={190} x2={80} y2={14} c={K.grey} /><T x={80} y={8} s={9}>y</T>
      <Line x1={x0} y1={y0} x2={x1} y2={y1} c={K.cyan} w={7} o={0.55} />
      <Line x1={x1} y1={y1} x2={x2} y2={y2} c={K.purple} w={7} o={0.55} />
      <Pivot x={x0} y={y0} /><Pivot x={x1} y={y1} />
      <circle cx={x2} cy={y2} r={5} fill={K.orange} />
      <ArcArrow x={x0} y={y0} r={28} from={0} to={-54} c={K.cyan} /><T x={118} y={152} s={9}>θ₁</T>
      <Line x1={x1} y1={y1} x2={x1 + 40 * Math.cos(a1)} y2={y1 + 40 * Math.sin(a1)} dash="3 3" o={0.4} />
      <T x={x1 + 26} y={y1 - 2} s={9}>θ₂</T>
      <T x={(x0 + x1) / 2 - 16} y={(y0 + y1) / 2} s={9}>L₁</T><T x={(x1 + x2) / 2 + 4} y={(y1 + y2) / 2 - 10} s={9}>L₂</T>
      <T x={x2 + 8} y={y2 - 8} s={9} a="start" b>(x, y)</T>
      <Box x={196} y={112} w={140} h={48} c={K.amber} r={6} />
      <T x={266} y={126} s={8.5}>x = L₁cosθ₁ + L₂cos(θ₁+θ₂)</T>
      <T x={266} y={146} s={8.5}>y = L₁sinθ₁ + L₂sin(θ₁+θ₂)</T>
    </Svg>
  );
}

export function RobotIdentify() {
  const rows = [
    ['Roomba', '✓', '✓', '✓', '✓', 'Robot'],
    ['Autonomous drone', '✓', '✓', '✓', '✓', 'Robot'],
    ['Vending machine', '✗', '~', '✓', '✗', 'Machine'],
    ['RC toy car', '✗', '✗', '✓', '✗', 'Machine'],
    ['Washing machine', '~', '~', '✓', '~', 'Automated'],
  ];
  const cols = ['Device', 'Sense', 'Decide', 'Act', 'Autonomy', 'Verdict'];
  const xs = [10, 128, 170, 212, 250, 296];
  return (
    <Svg w={350} h={150} label="Is it a robot? checklist">
      {cols.map((c, i) => <T key={c} x={xs[i] + (i === 0 ? 0 : 16)} y={14} s={9} b a={i === 0 ? 'start' : 'middle'}>{c}</T>)}
      <Line x1={8} y1={24} x2={344} y2={24} o={0.4} />
      {rows.map((r, j) => r.map((cell, i) => (
        <T key={`${j}-${i}`} x={xs[i] + (i === 0 ? 0 : 16)} y={40 + j * 22} s={9} a={i === 0 ? 'start' : 'middle'}
          c={cell === '✓' ? K.green : cell === '✗' ? K.red : cell === 'Robot' ? K.cyan : 'currentColor'} b={i === 5}>{cell}</T>
      )))}
      <T x={175} y={146} s={8.5} o={0.7} i>A robot needs all four: sense → decide → act → on its own</T>
    </Svg>
  );
}

export function CobotVsRobot() {
  return (
    <Svg w={350} h={180} label="Industrial robot versus cobot">
      <Box x={8} y={8} w={160} h={164} c={K.red} dash="5 4" />
      <T x={88} y={22} b s={10}>Industrial robot</T>
      <line x1={60} y1={130} x2={90} y2={80} stroke={K.red} strokeWidth={9} opacity={0.4} strokeLinecap="round" />
      <line x1={90} y1={80} x2={130} y2={92} stroke={K.red} strokeWidth={7} opacity={0.4} strokeLinecap="round" />
      <rect x={45} y={130} width={30} height={12} fill={K.grey} opacity={0.4} />
      <T x={88} y={155} s={8.5}>works inside a safety cage,{'\n'}fast &amp; strong, stops if gate opens</T>
      <Box x={182} y={8} w={160} h={164} c={K.green} />
      <T x={262} y={22} b s={10}>Cobot</T>
      <line x1={215} y1={130} x2={235} y2={90} stroke={K.green} strokeWidth={7} opacity={0.45} strokeLinecap="round" />
      <line x1={235} y1={90} x2={262} y2={98} stroke={K.green} strokeWidth={6} opacity={0.45} strokeLinecap="round" />
      <circle cx={305} cy={70} r={9} fill="none" stroke="currentColor" />
      <line x1={305} y1={79} x2={305} y2={118} stroke="currentColor" /><line x1={305} y1={90} x2={272} y2={98} stroke="currentColor" />
      <line x1={305} y1={118} x2={296} y2={138} stroke="currentColor" /><line x1={305} y1={118} x2={314} y2={138} stroke="currentColor" />
      <T x={262} y={155} s={8.5}>shares space with people, senses{'\n'}touch &amp; force, slows near humans</T>
    </Svg>
  );
}

export function FourWheelRobot() {
  return (
    <Svg w={340} h={230} label="Four-wheeled mobile robot, top view">
      <rect x={90} y={30} width={160} height={170} rx={14} fill={K.grey} fillOpacity={0.12} stroke={K.grey} />
      {[[70, 46], [250, 46], [70, 154], [250, 154]].map(([x, y], i) => (
        <g key={i}><rect x={x} y={y} width={20} height={34} rx={4} fill="currentColor" opacity={0.6} />
          <rect x={x < 100 ? 92 : 222} y={y + 8} width={26} height={18} rx={3} fill={K.orange} fillOpacity={0.3} stroke={K.orange} /></g>
      ))}
      <T x={40} y={63} s={8.5}>motor</T>
      <Box x={128} y={42} w={84} h={26} label="Ultrasonic" c={K.green} s={8.5} />
      <Box x={130} y={84} w={80} h={34} label="Controller" sub="Arduino / Pi" c={K.purple} s={9} />
      <Box x={130} y={128} w={80} h={26} label="Motor driver" c={K.orange} s={8.5} />
      <Box x={130} y={162} w={80} h={26} label="Battery pack" c={K.amber} s={8.5} />
      <Box x={110} y={10} w={34} h={16} label="IR" c={K.green} s={8} r={4} /><Box x={196} y={10} w={34} h={16} label="IR" c={K.green} s={8} r={4} />
      <Arrow x1={170} y1={68} x2={170} y2={84} /><Arrow x1={170} y1={118} x2={170} y2={128} />
      <Arrow x1={300} y1={115} x2={300} y2={40} c={K.cyan} /><T x={312} y={78} s={8.5} a="start">front</T>
      <T x={170} y={215} s={8.5} o={0.75}>Skid steering: left wheels vs right wheels at different speeds to turn</T>
    </Svg>
  );
}

export function Workspace() {
  return (
    <Svg w={340} h={200} label="Workspace of a two-link arm">
      <circle cx={170} cy={110} r={85} fill={K.cyan} fillOpacity={0.12} stroke={K.cyan} strokeDasharray="5 4" />
      <circle cx={170} cy={110} r={25} fill="hsl(var(--background))" stroke={K.red} strokeDasharray="3 3" />
      <Line x1={170} y1={110} x2={215} y2={80} c={K.purple} w={6} o={0.55} />
      <Line x1={215} y1={80} x2={240} y2={66} c={K.orange} w={5} o={0.55} />
      <Pivot x={170} y={110} /><Pivot x={215} y={80} />
      <T x={290} y={30} s={9} a="middle">outer edge = L₁ + L₂</T>
      <T x={170} y={150} s={8.5} c={K.red}>can't reach{'\n'}(|L₁ − L₂|)</T>
      <T x={170} y={190} s={9} b>Workspace = all points the end-effector can reach</T>
    </Svg>
  );
}

export function AccuracyRepeat() {
  const target = (x, label, pts, good) => (
    <g>
      {[30, 20, 10].map(r => <circle key={r} cx={x} cy={70} r={r} fill="none" stroke="currentColor" opacity={0.3} />)}
      <circle cx={x} cy={70} r={2} fill={K.red} />
      {pts.map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={70 + dy} r={3} fill={K.cyan} />)}
      <T x={x} y={118} s={8.5}>{label}</T>
      <T x={x} y={134} s={8.5} c={good ? K.green : K.amber} b>{good ? '✓ ideal' : ''}</T>
    </g>
  );
  return (
    <Svg w={360} h={145} label="Accuracy versus repeatability">
      {target(45, 'accurate +\nrepeatable', [[1, 1], [-2, 0], [0, -2], [2, -1]], true)}
      {target(135, 'repeatable,\nnot accurate', [[18, -14], [20, -12], [17, -11], [19, -15]])}
      {target(225, 'accurate on avg,\nnot repeatable', [[-15, 8], [14, -12], [6, 16], [-10, -14]])}
      {target(315, 'neither', [[20, 14], [-24, 6], [8, -24], [-6, 22]])}
    </Svg>
  );
}

export function Quadcopter() {
  return (
    <Svg w={340} h={220} label="Quadcopter layout">
      <Line x1={100} y1={50} x2={240} y2={170} w={5} o={0.4} /><Line x1={240} y1={50} x2={100} y2={170} w={5} o={0.4} />
      {[[100, 50, 'CW', K.cyan], [240, 50, 'CCW', K.orange], [100, 170, 'CCW', K.orange], [240, 170, 'CW', K.cyan]].map(([x, y, d, c], i) => (
        <g key={i}><circle cx={x} cy={y} r={30} fill={c} fillOpacity={0.12} stroke={c} />
          <ArcArrow x={x} y={y} r={22} from={d === 'CW' ? 200 : 340} to={d === 'CW' ? 340 : 200} c={c} />
          <T x={x} y={y} s={9} b>{d}</T></g>
      ))}
      <Box x={135} y={92} w={70} h={36} label="Flight ctrl" sub="IMU + GPS" c={K.purple} s={9} />
      <Arrow x1={170} y1={40} x2={170} y2={8} c={K.green} /><T x={190} y={14} s={9} a="start">front</T>
      <T x={300} y={110} s={8.5}>ESC per{'\n'}motor</T>
      <T x={40} y={110} s={8.5}>LiPo{'\n'}battery</T>
      <T x={170} y={212} s={8.5} o={0.75}>Opposite pairs spin opposite ways so the drone doesn't twist</T>
    </Svg>
  );
}

export function WheelTypes() {
  const wheel = (x, title, sub, inner) => (
    <g>
      <rect x={x - 16} y={30} width={32} height={60} rx={6} fill="currentColor" fillOpacity={0.12} stroke="currentColor" opacity={0.8} />
      {inner}
      <T x={x} y={110} b s={9.5}>{title}</T><T x={x} y={128} s={8} o={0.75}>{sub}</T>
    </g>
  );
  return (
    <Svg w={360} h={145} label="Wheel types for mobile robots">
      {wheel(48, 'Standard', 'rolls fwd/back,\nskid to turn', <Arrow x1={48} y1={80} x2={48} y2={40} c={K.cyan} both />)}
      {wheel(136, 'Castor', 'free swivel,\nsupport only', <g><circle cx={136} cy={22} r={4} fill={K.amber} /><ArcArrow x={136} y={60} r={12} from={0} to={250} c={K.amber} /></g>)}
      {wheel(224, 'Omni', 'rollers at 90°,\nslides sideways', <g>{[38, 52, 66, 80].map(y => <rect key={y} x={213} y={y - 4} width={22} height={7} rx={3} fill={K.green} opacity={0.55} />)}</g>)}
      {wheel(312, 'Mecanum', 'rollers at 45°,\nmoves any way', <g>{[38, 52, 66, 80].map(y => <line key={y} x1={302} y1={y + 5} x2={322} y2={y - 5} stroke={K.purple} strokeWidth={5} opacity={0.6} strokeLinecap="round" />)}</g>)}
    </Svg>
  );
}

export function CoordSystems() {
  return (
    <Svg w={360} h={170} label="Cartesian, polar and cylindrical coordinates">
      <g>
        <Arrow x1={20} y1={120} x2={100} y2={120} c={K.red} /><Arrow x1={20} y1={120} x2={20} y2={40} c={K.green} />
        <Line x1={70} y1={120} x2={70} y2={70} dash="3 3" o={0.5} /><Line x1={20} y1={70} x2={70} y2={70} dash="3 3" o={0.5} />
        <circle cx={70} cy={70} r={4} fill={K.cyan} /><T x={78} y={60} s={9} a="start">(x, y)</T>
        <T x={60} y={150} b s={9.5}>Cartesian</T>
      </g>
      <g>
        <Arrow x1={130} y1={120} x2={210} y2={120} c={K.grey} />
        <Line x1={130} y1={120} x2={185} y2={70} c={K.purple} w={2} />
        <circle cx={185} cy={70} r={4} fill={K.cyan} /><T x={168} y={86} s={9}>r</T>
        <ArcArrow x={130} y={120} r={22} from={0} to={-40} c={K.purple} /><T x={160} y={110} s={9}>θ</T>
        <T x={185} y={58} s={9}>(r, θ)</T>
        <T x={170} y={150} b s={9.5}>Polar</T>
      </g>
      <g>
        <ellipse cx={290} cy={120} rx={46} ry={14} fill="none" stroke="currentColor" opacity={0.4} />
        <Arrow x1={290} y1={120} x2={290} y2={36} c={K.green} /><T x={298} y={36} s={9} a="start">z</T>
        <Line x1={290} y1={120} x2={322} y2={128} c={K.purple} w={2} />
        <Line x1={322} y1={128} x2={322} y2={72} dash="3 3" o={0.6} />
        <circle cx={322} cy={72} r={4} fill={K.cyan} /><T x={322} y={60} s={9}>(r, θ, z)</T>
        <T x={290} y={150} b s={9.5}>Cylindrical</T>
      </g>
    </Svg>
  );
}

export function Frames() {
  const axes = (x, y, s, label, c) => (
    <g>
      <Arrow x1={x} y1={y} x2={x + s} y2={y} c={K.red} /><Arrow x1={x} y1={y} x2={x} y2={y - s} c={K.green} />
      <Arrow x1={x} y1={y} x2={x - s * 0.6} y2={y + s * 0.5} c={K.blue} />
      <T x={x + 4} y={y + 14} s={8.5} a="start" b c={c}>{label}</T>
    </g>
  );
  return (
    <Svg w={340} h={200} label="Reference frames">
      <rect x={20} y={160} width={300} height={8} fill={K.grey} opacity={0.3} />
      {axes(50, 160, 34, '{World} fixed', K.cyan)}
      <rect x={140} y={120} width={40} height={40} fill={K.cyan} fillOpacity={0.15} stroke={K.cyan} />
      {axes(160, 140, 26, '{Base}', K.purple)}
      <Line x1={160} y1={120} x2={220} y2={70} c={K.purple} w={6} o={0.4} />
      <Line x1={220} y1={70} x2={262} y2={92} c={K.orange} w={5} o={0.4} />
      {axes(262, 92, 22, '{Tool} moves', K.orange)}
      <T x={170} y={20} s={9} o={0.8}>Each part gets its own x-y-z frame; we convert{'\n'}positions between frames with transformations</T>
    </Svg>
  );
}

export function VectorRotation() {
  const th = 0.6, L = 90;
  return (
    <Svg w={340} h={190} label="Rotating a vector with a matrix">
      <Arrow x1={40} y1={160} x2={190} y2={160} c={K.grey} /><Arrow x1={40} y1={170} x2={40} y2={20} c={K.grey} />
      <Arrow x1={40} y1={160} x2={40 + L} y2={160} c={K.cyan} w={2.5} /><T x={95} y={172} s={9} c={K.cyan}>v</T>
      <Arrow x1={40} y1={160} x2={40 + L * Math.cos(th)} y2={160 - L * Math.sin(th)} c={K.orange} w={2.5} />
      <T x={40 + L * Math.cos(th) + 10} y={160 - L * Math.sin(th) - 6} s={9} c={K.orange}>v′</T>
      <ArcArrow x={40} y={160} r={40} from={0} to={-34} c={K.purple} /><T x={92} y={142} s={9}>θ</T>
      <Box x={200} y={60} w={130} h={70} c={K.purple} r={6} />
      <T x={265} y={74} s={9} b>R(θ) =</T>
      <T x={265} y={96} s={9}>[ cosθ  −sinθ ]</T>
      <T x={265} y={114} s={9}>[ sinθ   cosθ ]</T>
      <T x={265} y={150} s={8.5} o={0.8}>v′ = R(θ) · v</T>
    </Svg>
  );
}

export function ProjectLifecycle() {
  const st = [['Initiate', K.grey], ['Plan', K.cyan], ['Execute', K.purple], ['Monitor &\ncontrol', K.amber], ['Close', K.green]];
  return (
    <Svg w={350} h={190} label="Project management lifecycle">
      {st.map(([s, c], i) => (
        <g key={i}><Box x={6 + i * 69} y={10} w={62} h={38} label={s} c={c} s={8.5} />{i < 4 && <Arrow x1={68 + i * 69} y1={29} x2={75 + i * 69} y2={29} head={5} />}</g>
      ))}
      <T x={10} y={70} a="start" b s={9}>Gantt chart (weeks →)</T>
      {[['Research', 0, 2, K.cyan], ['Design & CAD', 1, 3, K.cyan], ['Buy parts', 2, 4, K.purple], ['Build & wire', 3, 6, K.purple], ['Code & test', 4, 8, K.amber], ['Demo', 8, 9, K.green]].map(([n, s, e, c], i) => (
        <g key={i}><T x={10} y={88 + i * 16} s={8.5} a="start">{n}</T>
          <rect x={100 + s * 26} y={82 + i * 16} width={(e - s) * 26} height={11} rx={3} fill={c} opacity={0.5} /></g>
      ))}
    </Svg>
  );
}

export function MechanismPlanarSpatial() {
  return (
    <Svg w={340} h={160} label="Planar and spatial mechanisms">
      <Box x={8} y={8} w={156} h={144} c={K.cyan} />
      <T x={86} y={22} b s={10}>Planar</T>
      <Line x1={30} y1={110} x2={60} y2={60} c={K.cyan} w={4} /><Line x1={60} y1={60} x2={120} y2={52} c={K.cyan} w={4} /><Line x1={120} y1={52} x2={138} y2={110} c={K.cyan} w={4} />
      <Pivot x={30} y={110} /><Pivot x={60} y={60} /><Pivot x={120} y={52} /><Pivot x={138} y={110} />
      <T x={86} y={134} s={8.5}>all links move in one{'\n'}flat plane (wipers, 4-bar)</T>
      <Box x={176} y={8} w={156} h={144} c={K.purple} />
      <T x={254} y={22} b s={10}>Spatial</T>
      <Line x1={210} y1={110} x2={235} y2={60} c={K.purple} w={4} /><Line x1={235} y1={60} x2={290} y2={74} c={K.purple} w={4} /><Line x1={290} y1={74} x2={300} y2={40} c={K.purple} w={4} dash="4 2" />
      <Pivot x={210} y={110} /><Pivot x={235} y={60} /><Pivot x={290} y={74} />
      <T x={254} y={134} s={8.5}>links move in 3-D{'\n'}(Stewart platform, 6-axis arm)</T>
    </Svg>
  );
}
