import React from 'react';
import { K, Svg, T, Box, Arrow, Line } from './kit';

const mono = { fontFamily: 'ui-monospace, Menlo, Consolas, monospace' };

function Diamond({ x, y, w, h, label, c = K.amber }) {
  return (
    <g>
      <polygon points={`${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`} fill={c} fillOpacity={0.15} stroke={c} strokeWidth={1.5} />
      <T x={x} y={y} s={8.5} b>{label}</T>
    </g>
  );
}

function Oval({ x, y, w, h, label, c = K.grey }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={c} fillOpacity={0.15} stroke={c} strokeWidth={1.5} />
      <T x={x} y={y} s={9} b>{label}</T>
    </g>
  );
}

export function IfElseFlow() {
  return (
    <Svg w={340} h={230} label="if-elif-else flowchart">
      <Oval x={170} y={16} w={90} h={24} label="Start" />
      <Arrow x1={170} y1={28} x2={170} y2={42} />
      <Box x={110} y={42} w={120} h={24} label="read distance" c={K.cyan} s={9} />
      <Arrow x1={170} y1={66} x2={170} y2={78} />
      <Diamond x={170} y={100} w={120} h={44} label="distance < 20?" />
      <Arrow x1={230} y1={100} x2={262} y2={100} label="True" />
      <Box x={262} y={88} w={70} h={24} label="stop()" c={K.red} s={9} />
      <Arrow x1={170} y1={122} x2={170} y2={136} label="False" lx={194} ly={128} />
      <Diamond x={170} y={158} w={120} h={44} label="battery < 10?" />
      <Arrow x1={230} y1={158} x2={262} y2={158} label="True" />
      <Box x={262} y={146} w={70} h={24} label="charge()" c={K.amber} s={9} />
      <Arrow x1={110} y1={158} x2={78} y2={158} label="False" />
      <Box x={8} y={146} w={70} h={24} label="forward()" c={K.green} s={9} />
      <T x={170} y={212} s={8.5} o={0.75}>Only ONE branch runs — the first condition that is True</T>
    </Svg>
  );
}

export function LoopFlow() {
  return (
    <Svg w={340} h={210} label="while loop flowchart">
      <Box x={100} y={8} w={140} h={24} label="count = 1" c={K.cyan} s={9} />
      <Arrow x1={170} y1={32} x2={170} y2={50} />
      <Diamond x={170} y={74} w={130} h={46} label="count <= 5 ?" />
      <Arrow x1={170} y1={97} x2={170} y2={114} label="True" lx={190} ly={104} />
      <Box x={100} y={114} w={140} h={24} label="print(count)" c={K.purple} s={9} />
      <Arrow x1={170} y1={138} x2={170} y2={150} />
      <Box x={100} y={150} w={140} h={24} label="count += 1" c={K.purple} s={9} />
      <Line x1={100} y1={162} x2={60} y2={162} /><Line x1={60} y1={162} x2={60} y2={74} /><Arrow x1={60} y1={74} x2={105} y2={74} />
      <Arrow x1={235} y1={74} x2={290} y2={74} label="False" />
      <Box x={290} y={62} w={46} h={24} label="end" c={K.grey} s={9} />
      <T x={170} y={196} s={8.5} o={0.75}>Forget "count += 1" and the loop never ends (infinite loop)</T>
    </Svg>
  );
}

export function PythonMemory() {
  const v = [['robot_name', "'Atlas'", 'str', K.green], ['speed', '120', 'int', K.cyan], ['battery', '87.5', 'float', K.amber], ['is_on', 'True', 'bool', K.purple]];
  return (
    <Svg w={340} h={190} label="Variables are labelled boxes holding values">
      {v.map(([n, val, t, c], i) => (
        <g key={n}>
          <T x={70} y={26 + i * 42} s={9.5} b a="end" c={c} >{n}</T>
          <Arrow x1={78} y1={26 + i * 42} x2={128} y2={26 + i * 42} />
          <Box x={128} y={10 + i * 42} w={100} h={32} c={c} />
          <g style={mono}><T x={178} y={26 + i * 42} s={10}>{val}</T></g>
          <T x={262} y={26 + i * 42} s={9} o={0.75}>type: {t}</T>
        </g>
      ))}
      <T x={170} y={182} s={8.5} o={0.75}>name = value   (the = sign means "store", not "equals")</T>
    </Svg>
  );
}

export function StringIndex() {
  const s = 'PYTHON';
  return (
    <Svg w={340} h={170} label="String indexing and slicing">
      <T x={170} y={14} s={9.5} b>word = "PYTHON"</T>
      {s.split('').map((ch, i) => (
        <g key={i}>
          <rect x={50 + i * 40} y={50} width={40} height={36} fill={K.cyan} fillOpacity={0.15} stroke={K.cyan} />
          <T x={70 + i * 40} y={68} s={14} b>{ch}</T>
          <T x={70 + i * 40} y={38} s={9} c={K.green}>{i}</T>
          <T x={70 + i * 40} y={98} s={9} c={K.pink}>{i - 6}</T>
        </g>
      ))}
      <T x={30} y={38} s={8} a="end" c={K.green}>+</T><T x={30} y={98} s={8} a="end" c={K.pink}>−</T>
      <g style={mono}>
        <T x={20} y={124} s={9} a="start">word[0] → 'P'     word[-1] → 'N'</T>
        <T x={20} y={142} s={9} a="start">word[1:4] → 'YTH' (stop index not included)</T>
        <T x={20} y={160} s={9} a="start">len(word) → 6     word[::-1] → 'NOHTYP'</T>
      </g>
    </Svg>
  );
}

export function ListVsTuple() {
  return (
    <Svg w={340} h={170} label="List versus tuple">
      <Box x={6} y={6} w={160} h={158} c={K.green} />
      <T x={86} y={22} b s={10}>List  [ ]</T>
      {['10', '20', '30'].map((v, i) => <g key={i}><rect x={30 + i * 38} y={36} width={36} height={28} fill={K.green} fillOpacity={0.2} stroke={K.green} /><T x={48 + i * 38} y={50}>{v}</T><T x={48 + i * 38} y={74} s={8} o={0.7}>{i}</T></g>)}
      <g style={mono}><T x={86} y={98} s={8.5}>marks[1] = 25  ✓</T><T x={86} y={114} s={8.5}>marks.append(40)  ✓</T></g>
      <T x={86} y={144} s={8.5}>MUTABLE — can change{'\n'}(sensor readings)</T>
      <Box x={174} y={6} w={160} h={158} c={K.purple} />
      <T x={254} y={22} b s={10}>Tuple  ( )  🔒</T>
      {['12.97', '77.59'].map((v, i) => <g key={i}><rect x={204 + i * 52} y={36} width={50} height={28} fill={K.purple} fillOpacity={0.2} stroke={K.purple} /><T x={229 + i * 52} y={50}>{v}</T><T x={229 + i * 52} y={74} s={8} o={0.7}>{i}</T></g>)}
      <g style={mono}><T x={254} y={98} s={8.5}>pos[0] = 13  ✗ Error</T><T x={254} y={114} s={8.5}>faster, safer</T></g>
      <T x={254} y={144} s={8.5}>IMMUTABLE — fixed{'\n'}(GPS point, RGB colour)</T>
    </Svg>
  );
}

export function FunctionAnatomy() {
  return (
    <Svg w={350} h={190} label="Parts of a Python function">
      <rect x={10} y={20} width={250} height={110} rx={8} fill={K.grey} fillOpacity={0.08} stroke={K.grey} />
      <g style={mono}>
        <T x={20} y={38} s={10} a="start"><tspan fill={K.purple} fontWeight="700">def</tspan> <tspan fill={K.cyan} fontWeight="700">area</tspan>(<tspan fill={K.green}>l</tspan>, <tspan fill={K.green}>b=1</tspan>):</T>
        <T x={36} y={60} s={10} a="start" c={K.grey}>"""Area of a rectangle"""</T>
        <T x={36} y={82} s={10} a="start">result = l * b</T>
        <T x={36} y={104} s={10} a="start"><tspan fill={K.pink} fontWeight="700">return</tspan> result</T>
        <T x={20} y={160} s={10} a="start">a = area(<tspan fill={K.amber}>5</tspan>, <tspan fill={K.amber}>3</tspan>)   # a = 15</T>
      </g>
      <T x={300} y={30} s={8.5} c={K.purple}>keyword</T>
      <T x={300} y={46} s={8.5} c={K.cyan}>name</T>
      <T x={300} y={62} s={8.5} c={K.green}>parameters{'\n'}(b has default)</T>
      <T x={300} y={92} s={8.5}>indented body</T>
      <T x={300} y={110} s={8.5} c={K.pink}>sends value back</T>
      <T x={300} y={160} s={8.5} c={K.amber}>arguments{'\n'}(the call)</T>
    </Svg>
  );
}

export function PythonTypes() {
  const t = [
    ['Numeric', 'int    7\nfloat  3.14\ncomplex 2+3j', K.cyan],
    ['Text', "str  'robot'", K.green],
    ['Boolean', 'bool  True / False', K.purple],
    ['Sequence', 'list   [1, 2]\ntuple  (1, 2)\nrange(5)', K.amber],
    ['Mapping', "dict  {'a': 1}", K.pink],
    ['Set', 'set  {1, 2, 3}', K.orange],
  ];
  return (
    <Svg w={350} h={230} label="Python data types">
      <Box x={130} y={4} w={90} h={24} label="Data types" c={K.cyan} s={9.5} />
      {t.map(([h, ex, c], i) => {
        const x = 6 + (i % 3) * 114, y = 40 + Math.floor(i / 3) * 86;
        return (
          <g key={h}>
            <Box x={x} y={y} w={108} h={22} label={h} c={c} s={9} r={4} />
            <g style={mono}><T x={x + 54} y={y + 48} s={8.5}>{ex}</T></g>
          </g>
        );
      })}
      <g style={mono}><T x={175} y={218} s={8.5}>type(3.0) → &lt;class 'float'&gt;   int('42') → 42</T></g>
    </Svg>
  );
}

export function OperatorPrecedence() {
  const rows = [['( )', 'brackets — always first'], ['**', 'power'], ['*  /  //  %', 'multiply, divide, floor, remainder'], ['+  −', 'add, subtract'], ['==  !=  <  >  <=  >=', 'compare'], ['not', ''], ['and', ''], ['or', 'last']];
  return (
    <Svg w={340} h={200} label="Operator precedence">
      {rows.map(([op, d], i) => (
        <g key={i}>
          <rect x={34 + i * 6} y={6 + i * 23} width={290 - i * 12} height={20} rx={4} fill={K.purple} fillOpacity={0.25 - i * 0.025} stroke={K.purple} strokeOpacity={0.5} />
          <g style={mono}><T x={44 + i * 6} y={16 + i * 23} s={9.5} a="start" b>{op}</T></g>
          <T x={316 - i * 6} y={16 + i * 23} s={8.5} a="end" o={0.8}>{d}</T>
        </g>
      ))}
      <T x={6} y={10} s={8} a="start" c={K.green}>high</T><T x={6} y={180} s={8} a="start" c={K.red}>low</T>
      <g style={mono}><T x={170} y={194} s={8.5}>2 + 3 * 4 → 14      (2 + 3) * 4 → 20</T></g>
    </Svg>
  );
}

export function FlowchartSymbols() {
  return (
    <Svg w={350} h={150} label="Flowchart symbols">
      <Oval x={50} y={36} w={80} h={28} label="Start/End" />
      <T x={50} y={70} s={8.5} o={0.75}>terminal</T>
      <Box x={110} y={22} w={76} h={28} label="x = x + 1" c={K.cyan} s={9} />
      <T x={148} y={70} s={8.5} o={0.75}>process</T>
      <polygon points="210,22 290,22 276,50 196,50" fill={K.green} fillOpacity={0.15} stroke={K.green} strokeWidth={1.5} />
      <T x={243} y={36} s={9} b>input/print</T>
      <T x={243} y={70} s={8.5} o={0.75}>input / output</T>
      <Diamond x={70} y={112} w={90} h={44} label="x > 5 ?" />
      <T x={70} y={144} s={8.5} o={0.75}>decision (yes/no)</T>
      <Arrow x1={150} y1={112} x2={200} y2={112} /><T x={175} y={130} s={8.5} o={0.75}>flow line</T>
      <circle cx={260} cy={112} r={12} fill="none" stroke="currentColor" /><T x={260} y={112} s={9} b>A</T>
      <T x={260} y={140} s={8.5} o={0.75}>connector</T>
    </Svg>
  );
}

export function LogicGates() {
  const gate = (x, y, name, shape, table, c) => (
    <g>
      {shape}
      <T x={x + 32} y={y + 50} b s={9.5} c={c}>{name}</T>
      <T x={x + 32} y={y + 64} s={8} o={0.8}>{table}</T>
    </g>
  );
  const andShape = (x, y, c, bubble) => (
    <g>
      <path d={`M${x + 10} ${y} h18 a16 16 0 0 1 0 32 h-18 z`} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={1.5} />
      <Line x1={x} y1={y + 9} x2={x + 10} y2={y + 9} /><Line x1={x} y1={y + 23} x2={x + 10} y2={y + 23} />
      {bubble && <circle cx={x + 48} cy={y + 16} r={3} fill="none" stroke={c} strokeWidth={1.5} />}
      <Line x1={x + (bubble ? 51 : 44)} y1={y + 16} x2={x + 58} y2={y + 16} />
    </g>
  );
  const orShape = (x, y, c, bubble, xor) => (
    <g>
      <path d={`M${x + 8} ${y} q30 0 38 16 q-8 16 -38 16 q10 -16 0 -32z`} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={1.5} />
      {xor && <path d={`M${x + 3} ${y} q10 16 0 32`} fill="none" stroke={c} strokeWidth={1.5} />}
      <Line x1={x - 2} y1={y + 9} x2={x + 12} y2={y + 9} /><Line x1={x - 2} y1={y + 23} x2={x + 12} y2={y + 23} />
      {bubble && <circle cx={x + 49} cy={y + 16} r={3} fill="none" stroke={c} strokeWidth={1.5} />}
      <Line x1={x + (bubble ? 52 : 46)} y1={y + 16} x2={x + 58} y2={y + 16} />
    </g>
  );
  return (
    <Svg w={360} h={180} label="Logic gate symbols">
      {gate(30, 8, 'AND', andShape(30, 8, K.cyan), 'Y = A·B  (1 if both 1)', K.cyan)}
      {gate(145, 8, 'OR', orShape(145, 8, K.green), 'Y = A+B  (1 if any 1)', K.green)}
      {gate(260, 8, 'NOT', <g><polygon points="270,8 270,40 300,24" fill={K.amber} fillOpacity={0.18} stroke={K.amber} strokeWidth={1.5} /><circle cx={303} cy={24} r={3} fill="none" stroke={K.amber} strokeWidth={1.5} /><Line x1={260} y1={24} x2={270} y2={24} /><Line x1={306} y1={24} x2={316} y2={24} /></g>, 'Y = Ā  (flips)', K.amber)}
      {gate(30, 96, 'NAND', andShape(30, 96, K.purple, true), 'NOT of AND (universal)', K.purple)}
      {gate(145, 96, 'NOR', orShape(145, 96, K.pink, true), 'NOT of OR (universal)', K.pink)}
      {gate(260, 96, 'XOR', orShape(260, 96, K.orange, false, true), 'Y = A⊕B  (1 if different)', K.orange)}
    </Svg>
  );
}

export function BinaryPlace() {
  const bits = [0, 0, 0, 1, 1, 0, 0, 1];
  return (
    <Svg w={340} h={150} label="Binary place values">
      {bits.map((b, i) => {
        const pv = 2 ** (7 - i);
        return (
          <g key={i}>
            <T x={30 + i * 40} y={14} s={8.5} o={0.75}>2^{7 - i}</T>
            <T x={30 + i * 40} y={30} s={9.5} b c={K.purple}>{pv}</T>
            <rect x={12 + i * 40} y={40} width={36} height={34} rx={4} fill={b ? K.cyan : K.grey} fillOpacity={b ? 0.35 : 0.1} stroke={b ? K.cyan : K.grey} />
            <T x={30 + i * 40} y={57} s={15} b>{b}</T>
          </g>
        );
      })}
      <T x={170} y={100} s={10}>00011001₂ = 16 + 8 + 1 = <tspan fontWeight="700" fill={K.green}>25₁₀</tspan></T>
      <T x={170} y={126} s={8.5} o={0.75}>8 bits = 1 byte → 0 to 255 (256 values)</T>
    </Svg>
  );
}

export function DecToBin() {
  const steps = [[25, 12, 1], [12, 6, 0], [6, 3, 0], [3, 1, 1], [1, 0, 1]];
  return (
    <Svg w={340} h={190} label="Decimal to binary by repeated division">
      {steps.map(([n, q, r], i) => (
        <g key={i}>
          <T x={40} y={20 + i * 26} s={10} a="start">2 )</T>
          <T x={80} y={20 + i * 26} s={10} b a="start">{n}</T>
          <T x={130} y={20 + i * 26} s={9} a="start" o={0.7}>= {q} rem</T>
          <T x={200} y={20 + i * 26} s={11} b c={K.cyan}>{r}</T>
        </g>
      ))}
      <Arrow x1={226} y1={124} x2={226} y2={14} c={K.green} w={2} />
      <T x={236} y={70} s={9} a="start" c={K.green}>read{'\n'}bottom → top</T>
      <T x={170} y={168} s={11} b>25₁₀ = 11001₂</T>
    </Svg>
  );
}

export function NumberSystems() {
  const r = [['Decimal', '10', '0–9', '255'], ['Binary', '2', '0, 1', '1111 1111'], ['Octal', '8', '0–7', '377'], ['Hexadecimal', '16', '0–9, A–F', 'FF']];
  return (
    <Svg w={340} h={160} label="Four number systems">
      {['System', 'Base', 'Digits', '255 written as'].map((h, i) => <T key={h} x={[50, 120, 180, 270][i]} y={14} b s={9}>{h}</T>)}
      <Line x1={6} y1={24} x2={334} y2={24} o={0.4} />
      {r.map((row, j) => row.map((c, i) => <T key={`${j}${i}`} x={[50, 120, 180, 270][i]} y={42 + j * 22} s={9} c={i === 3 ? K.cyan : 'currentColor'} b={i === 3}>{c}</T>))}
      <T x={170} y={136} s={8.5} o={0.8}>Binary→Octal: groups of 3 bits · Binary→Hex: groups of 4 bits</T>
      <T x={170} y={152} s={8.5} o={0.8}>1111 1111 → F F       011 111 111 → 3 7 7</T>
    </Svg>
  );
}

export function ComputingGenerations() {
  const g = [['1st', 'Vacuum\ntubes', '1940s', K.grey], ['2nd', 'Transistors', '1950s', K.cyan], ['3rd', 'Integrated\ncircuits', '1960s', K.green], ['4th', 'Micro-\nprocessors', '1971→', K.purple], ['5th', 'AI &\nquantum', 'now→', K.pink]];
  return (
    <Svg w={350} h={150} label="Generations of computers">
      {g.map(([n, t, y, c], i) => (
        <g key={n}>
          <Box x={4 + i * 69} y={30 + (4 - i) * 6} w={62} h={80 - (4 - i) * 6} c={c} />
          <T x={35 + i * 69} y={46 + (4 - i) * 6} b s={10} c={c}>{n}</T>
          <T x={35 + i * 69} y={78 + (4 - i) * 3} s={8.5}>{t}</T>
          <T x={35 + i * 69} y={124} s={8.5} o={0.75}>{y}</T>
        </g>
      ))}
      <T x={175} y={14} s={8.5} o={0.8}>smaller · faster · cheaper · less power each generation →</T>
      <T x={175} y={142} s={8.5} o={0.8}>Moore's law: transistors per chip double ≈ every 2 years</T>
    </Svg>
  );
}

export function TruthTable2() {
  const rows = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const cols = [['AND', (a, b) => a & b], ['OR', (a, b) => a | b], ['NAND', (a, b) => 1 - (a & b)], ['NOR', (a, b) => 1 - (a | b)], ['XOR', (a, b) => a ^ b], ['XNOR', (a, b) => 1 - (a ^ b)]];
  return (
    <Svg w={350} h={130} label="Two-input truth table for all gates">
      {['A', 'B', ...cols.map(c => c[0])].map((h, i) => <T key={h} x={20 + i * 40} y={12} b s={9} c={i < 2 ? K.cyan : K.purple}>{h}</T>)}
      <Line x1={4} y1={22} x2={346} y2={22} o={0.4} /><Line x1={80} y1={4} x2={80} y2={124} o={0.4} />
      {rows.map(([a, b], j) => (
        <g key={j}>
          <T x={20} y={38 + j * 24}>{a}</T><T x={60} y={38 + j * 24}>{b}</T>
          {cols.map(([, f], i) => <T key={i} x={100 + i * 40} y={38 + j * 24} b c={f(a, b) ? K.green : 'currentColor'}>{f(a, b)}</T>)}
        </g>
      ))}
    </Svg>
  );
}

export function McuBlock() {
  return (
    <Svg w={350} h={220} label="Microcontroller block diagram">
      <rect x={60} y={24} width={230} height={150} rx={10} fill={K.grey} fillOpacity={0.06} stroke={K.grey} strokeDasharray="5 4" />
      <T x={175} y={14} b s={9.5}>One chip (e.g. ATmega328P on Arduino Uno)</T>
      <Box x={76} y={36} w={70} h={40} label="CPU" sub="ALU + registers" c={K.purple} />
      <Box x={156} y={36} w={56} h={40} label="Flash" sub="program" c={K.cyan} s={9} />
      <Box x={220} y={36} w={56} h={40} label="RAM" sub="variables" c={K.cyan} s={9} />
      <Box x={76} y={120} w={60} h={40} label="Timers" sub="PWM, delay" c={K.amber} s={9} />
      <Box x={144} y={120} w={60} h={40} label="ADC" sub="analog in" c={K.green} s={9} />
      <Box x={212} y={120} w={64} h={40} label="Serial" sub="UART I2C SPI" c={K.pink} s={9} />
      <rect x={76} y={90} width={200} height={16} rx={4} fill={K.purple} opacity={0.25} />
      <T x={176} y={98} s={8.5} b>internal bus (address + data)</T>
      <Line x1={111} y1={76} x2={111} y2={90} /><Line x1={184} y1={76} x2={184} y2={90} /><Line x1={248} y1={76} x2={248} y2={90} />
      <Line x1={106} y1={106} x2={106} y2={120} /><Line x1={174} y1={106} x2={174} y2={120} /><Line x1={244} y1={106} x2={244} y2={120} />
      <Box x={4} y={60} w={48} h={60} label="Clock" sub="16 MHz" c={K.grey} s={8.5} />
      <Box x={298} y={50} w={48} h={90} label="GPIO" sub="digital pins" c={K.green} s={8.5} />
      <Arrow x1={52} y1={90} x2={60} y2={90} /><Arrow x1={290} y1={95} x2={298} y2={95} both />
      <T x={175} y={200} s={8.5} o={0.75}>SBC (Raspberry Pi) = full computer: CPU + GBs RAM + OS + USB/HDMI</T>
    </Svg>
  );
}
