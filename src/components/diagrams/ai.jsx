import React from 'react';
import { K, Svg, T, Box, Arrow, Line, Circle } from './kit';

export function AiVenn() {
  return (
    <Svg w={340} h={200} label="AI contains machine learning which contains deep learning">
      <ellipse cx={170} cy={104} rx={160} ry={90} fill={K.cyan} fillOpacity={0.1} stroke={K.cyan} />
      <ellipse cx={190} cy={118} rx={112} ry={64} fill={K.purple} fillOpacity={0.12} stroke={K.purple} />
      <ellipse cx={208} cy={130} rx={60} ry={36} fill={K.pink} fillOpacity={0.16} stroke={K.pink} />
      <T x={58} y={60} b s={11} c={K.cyan}>Artificial{'\n'}Intelligence</T>
      <T x={56} y={136} s={8.5} o={0.8}>rules, search,{'\n'}expert systems</T>
      <T x={150} y={84} b s={10} c={K.purple}>Machine Learning</T>
      <T x={120} y={118} s={8.5} o={0.8}>learns from{'\n'}data</T>
      <T x={208} y={124} b s={10} c={K.pink}>Deep{'\n'}Learning</T>
      <T x={208} y={150} s={8} o={0.8}>many-layer NNs</T>
    </Svg>
  );
}

export function AiProjectCycle() {
  const st = [
    ['1. Problem\nScoping', K.cyan], ['2. Data\nAcquisition', K.green], ['3. Data\nExploration', K.amber],
    ['4. Modelling', K.purple], ['5. Evaluation', K.pink],
  ];
  const cx = 170, cy = 112, R = 78;
  return (
    <Svg w={340} h={230} label="AI project cycle">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="currentColor" opacity={0.2} strokeDasharray="4 4" />
      {st.map(([s, c], i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        const a2 = a + (2 * Math.PI) / 5;
        const mx = cx + (R) * Math.cos((a + a2) / 2), my = cy + (R) * Math.sin((a + a2) / 2);
        return (
          <g key={i}>
            <Box x={x - 44} y={y - 18} w={88} h={36} label={s} c={c} s={8.5} />
            <circle cx={mx} cy={my} r={3} fill="currentColor" opacity={0.5} />
          </g>
        );
      })}
      <T x={cx} y={cy - 6} s={9} b>AI Project</T><T x={cx} y={cy + 8} s={9} b>Cycle</T>
      <T x={cx} y={222} s={8.5} o={0.75}>Then deploy, watch it in use, and go round again to improve</T>
    </Svg>
  );
}

export function FourWs() {
  const q = [
    ['WHO', 'is affected?\n(stakeholders)', K.cyan], ['WHAT', 'is the problem?\n(evidence it exists)', K.purple],
    ['WHERE', 'does it happen?\n(context, situation)', K.green], ['WHY', 'is solving it\nvaluable?', K.amber],
  ];
  return (
    <Svg w={340} h={200} label="4Ws problem canvas">
      {q.map(([h, b, c], i) => (
        <g key={h}><Box x={10 + (i % 2) * 165} y={10 + Math.floor(i / 2) * 82} w={155} h={72} c={c} />
          <T x={88 + (i % 2) * 165} y={30 + Math.floor(i / 2) * 82} b s={12} c={c}>{h}</T>
          <T x={88 + (i % 2) * 165} y={56 + Math.floor(i / 2) * 82} s={9}>{b}</T></g>
      ))}
      <T x={170} y={188} s={8.5} o={0.8}>Problem statement: Our [who] have [problem] when [where] — solving it will [why]</T>
    </Svg>
  );
}

export function DataSplit() {
  return (
    <Svg w={340} h={134} label="Training and testing data split">
      <T x={170} y={14} b s={10}>Whole dataset (e.g. from Kaggle / sensors / survey)</T>
      <rect x={10} y={30} width={256} height={36} rx={6} fill={K.cyan} fillOpacity={0.25} stroke={K.cyan} />
      <rect x={266} y={30} width={64} height={36} rx={6} fill={K.amber} fillOpacity={0.25} stroke={K.amber} />
      <T x={138} y={48} b>Training data — 80%</T><T x={298} y={48} b s={9}>Test 20%</T>
      <T x={138} y={84} s={8.5}>model LEARNS patterns from these</T>
      <T x={298} y={84} s={8.5}>kept hidden,{'\n'}used to CHECK</T>
      <T x={170} y={114} s={8.5} o={0.75} i>{'Never test on the data you trained on —\nlike seeing the exam answers first'}</T>
    </Svg>
  );
}

export function GraphTypes() {
  return (
    <Svg w={360} h={130} label="Graph types used in data exploration">
      <g>{[30, 50, 22, 42].map((h, i) => <rect key={i} x={12 + i * 14} y={80 - h} width={10} height={h} fill={K.cyan} opacity={0.6} />)}
        <T x={38} y={98} s={9} b>Bar</T><T x={38} y={112} s={8} o={0.75}>compare groups</T></g>
      <g>{[12, 26, 44, 34, 16, 8].map((h, i) => <rect key={i} x={80 + i * 10} y={80 - h} width={10} height={h} fill={K.purple} opacity={0.55} stroke={K.purple} strokeWidth={0.5} />)}
        <T x={110} y={98} s={9} b>Histogram</T><T x={110} y={112} s={8} o={0.75}>spread of values</T></g>
      <g><polyline points="150,72 162,60 174,64 186,44 198,48 210,30" fill="none" stroke={K.green} strokeWidth={2} />
        <T x={180} y={98} s={9} b>Line</T><T x={180} y={112} s={8} o={0.75}>change over time</T></g>
      <g>{[[230, 70], [238, 64], [244, 58], [252, 54], [258, 46], [266, 40], [240, 50], [262, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill={K.amber} />)}
        <T x={250} y={98} s={9} b>Scatter</T><T x={250} y={112} s={8} o={0.75}>relationship</T></g>
      <g><circle cx={322} cy={54} r={24} fill={K.pink} fillOpacity={0.25} stroke={K.pink} />
        <path d="M322 54 L322 30 A24 24 0 0 1 344 62 Z" fill={K.pink} opacity={0.6} />
        <T x={322} y={98} s={9} b>Pie</T><T x={322} y={112} s={8} o={0.75}>parts of whole</T></g>
    </Svg>
  );
}

export function LinearRegression() {
  const pts = [[40, 150], [62, 138], [80, 130], [96, 118], [118, 112], [140, 96], [160, 92], [182, 76], [204, 70], [226, 58]];
  return (
    <Svg w={340} h={190} label="Linear regression line">
      <Arrow x1={30} y1={170} x2={260} y2={170} c={K.grey} /><Arrow x1={30} y1={170} x2={30} y2={20} c={K.grey} />
      <T x={150} y={184} s={8.5}>hours studied (x)</T><T x={18} y={95} s={8.5}>marks{'\n'}(y)</T>
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y + (i % 3 - 1) * 6} r={3.5} fill={K.cyan} />)}
      <Line x1={34} y1={156} x2={246} y2={50} c={K.orange} w={2.5} />
      <Box x={262} y={40} w={72} h={64} c={K.orange} r={6} />
      <T x={298} y={56} b s={10}>y = mx + c</T>
      <T x={298} y={76} s={8}>m = slope</T><T x={298} y={90} s={8}>c = intercept</T>
      <T x={150} y={14} s={8.5} o={0.8}>Best-fit line → predict y for a new x</T>
    </Svg>
  );
}

export function MlTypes() {
  return (
    <Svg w={360} h={180} label="Supervised, unsupervised and reinforcement learning">
      <Box x={4} y={6} w={114} h={168} c={K.cyan} />
      <T x={61} y={20} b s={9.5}>Supervised</T>
      {[['🍎', 'apple'], ['🍊', 'orange'], ['🍎', 'apple']].map(([e, l], i) => <T key={i} x={61} y={44 + i * 18} s={9}>{`${e} → "${l}"`}</T>)}
      <T x={61} y={116} s={8.5}>labelled examples{'\n'}→ predict labels</T>
      <T x={61} y={156} s={8} o={0.75}>spam filter, grading{'\n'}fruit by photo</T>
      <Box x={123} y={6} w={114} h={168} c={K.purple} />
      <T x={180} y={20} b s={9.5}>Unsupervised</T>
      {[[150, 46], [158, 54], [146, 58], [205, 50], [212, 58], [200, 62], [176, 90], [184, 96], [170, 98]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.5} fill={i < 3 ? K.cyan : i < 6 ? K.pink : K.amber} />)}
      <T x={180} y={124} s={8.5}>no labels → finds{'\n'}groups (clusters)</T>
      <T x={180} y={156} s={8} o={0.75}>customer groups,{'\n'}sorting news</T>
      <Box x={242} y={6} w={114} h={168} c={K.green} />
      <T x={299} y={20} b s={9.5}>Reinforcement</T>
      <Box x={256} y={34} w={40} h={24} label="Agent" c={K.green} s={8} r={4} />
      <Box x={304} y={34} w={44} h={24} label="World" c={K.grey} s={8} r={4} />
      <Arrow x1={296} y1={40} x2={304} y2={40} head={4} /><Arrow x1={304} y1={54} x2={296} y2={54} head={4} />
      <T x={299} y={74} s={8}>action → reward</T>
      <T x={299} y={116} s={8.5}>trial and error,{'\n'}maximise reward</T>
      <T x={299} y={156} s={8} o={0.75}>game AI, robot{'\n'}learning to walk</T>
    </Svg>
  );
}

export function FruitSorting() {
  const ap = [[60, 60], [72, 52], [66, 74], [80, 66], [54, 50]], or = [[160, 120], [172, 112], [150, 130], [180, 128], [166, 136]];
  return (
    <Svg w={340} h={180} label="Machine learning sorts fruit by features">
      <Arrow x1={30} y1={160} x2={230} y2={160} c={K.grey} /><Arrow x1={30} y1={160} x2={30} y2={20} c={K.grey} />
      <T x={130} y={174} s={8.5}>size →</T><T x={14} y={90} s={8.5}>red-{'\n'}ness</T>
      {ap.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill={K.red} opacity={0.75} />)}
      {or.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill={K.orange} opacity={0.75} />)}
      <Line x1={50} y1={150} x2={210} y2={30} dash="5 4" c={K.purple} />
      <circle cx={118} cy={74} r={7} fill="none" stroke={K.cyan} strokeWidth={2} /><T x={118} y={74} s={9} b c={K.cyan}>?</T>
      <Box x={244} y={24} w={90} h={130} c={K.purple} r={6} />
      <T x={289} y={40} s={8.5} b>How it learns</T>
      <T x={289} y={84} s={8}>1. features: size,{'\n'}colour, weight{'\n'}2. labelled fruit{'\n'}3. draws a boundary{'\n'}4. new fruit → side{'\n'}of the line = label</T>
    </Svg>
  );
}

export function TuringTest() {
  return (
    <Svg w={340} h={170} label="The Turing test">
      <rect x={168} y={10} width={6} height={130} fill="currentColor" opacity={0.4} />
      <circle cx={70} cy={60} r={14} fill="none" stroke={K.cyan} strokeWidth={2} />
      <path d="M45 115 q25 -40 50 0" fill={K.cyan} fillOpacity={0.2} stroke={K.cyan} />
      <T x={70} y={134} b s={9}>Judge (C)</T><T x={70} y={148} s={8} o={0.75}>chats by text only</T>
      <Box x={230} y={20} w={90} h={44} label="Human (B)" c={K.green} s={9} />
      <Box x={230} y={84} w={90} h={44} label="Machine (A)" c={K.purple} s={9} />
      <Arrow x1={100} y1={60} x2={230} y2={42} both c={K.grey} dash="4 3" />
      <Arrow x1={100} y1={66} x2={230} y2={106} both c={K.grey} dash="4 3" />
      <T x={170} y={160} s={8.5} o={0.85}>If the judge can't reliably tell which is the machine, it passes</T>
    </Svg>
  );
}

export function AiDomains() {
  return (
    <Svg w={350} h={170} label="Three domains of AI">
      {[
        ['Data / Statistics', 'numbers & tables', 'price prediction,\nrecommendations', K.cyan, '📊'],
        ['Computer Vision', 'images & video', 'face unlock,\nself-driving cars', K.purple, '👁️'],
        ['NLP', 'text & speech', 'chatbots, translate,\nvoice assistants', K.green, '💬'],
      ].map(([h, d, ex, c, icon], i) => (
        <g key={h}>
          <Box x={6 + i * 116} y={8} w={106} h={154} c={c} />
          <T x={59 + i * 116} y={36} s={22}>{icon}</T>
          <T x={59 + i * 116} y={68} b s={9.5}>{h}</T>
          <T x={59 + i * 116} y={92} s={8.5} o={0.8}>{`works with\n${d}`}</T>
          <T x={59 + i * 116} y={124} s={8.5}>{ex}</T>
        </g>
      ))}
    </Svg>
  );
}

export function CvPixels() {
  const grid = [
    [0, 0, 40, 40, 0, 0], [0, 90, 255, 255, 90, 0], [40, 255, 255, 255, 255, 40],
    [40, 255, 255, 255, 255, 40], [0, 90, 255, 255, 90, 0], [0, 0, 40, 40, 0, 0],
  ];
  return (
    <Svg w={340} h={190} label="An image is a grid of pixel numbers">
      {grid.map((row, r) => row.map((v, c) => (
        <rect key={`${r}${c}`} x={14 + c * 24} y={14 + r * 24} width={24} height={24} fill={`rgb(${v},${v},${v})`} stroke={K.grey} strokeWidth={0.5} />
      )))}
      <T x={86} y={170} s={8.5}>what we see (6×6 pixels)</T>
      <Arrow x1={170} y1={86} x2={190} y2={86} />
      {grid.map((row, r) => row.map((v, c) => (
        <T key={`t${r}${c}`} x={206 + c * 22} y={26 + r * 24} s={7.5}>{v}</T>
      )))}
      <T x={262} y={170} s={8.5}>what the computer sees{'\n'}(0 = black, 255 = white)</T>
    </Svg>
  );
}

export function CvTasks() {
  return (
    <Svg w={360} h={150} label="Computer vision tasks">
      {[['Classification', '"It is a cat"'], ['Object detection', 'boxes + labels'], ['Segmentation', 'colour every pixel']].map(([h, s], i) => (
        <g key={h}>
          <rect x={10 + i * 118} y={10} width={104} height={84} rx={6} fill={K.grey} fillOpacity={0.1} stroke={K.grey} />
          <circle cx={45 + i * 118} cy={56} r={18} fill={i === 2 ? K.purple : K.amber} opacity={i === 2 ? 0.55 : 0.4} />
          <rect x={72 + i * 118} y={50} width={28} height={28} fill={i === 2 ? K.green : K.cyan} opacity={i === 2 ? 0.55 : 0.4} />
          {i === 1 && <><rect x={143} y={36} width={40} height={40} fill="none" stroke={K.red} strokeWidth={1.5} /><rect x={187} y={47} width={34} height={34} fill="none" stroke={K.red} strokeWidth={1.5} /><T x={163} y={28} s={7.5} c={K.red}>cat 92%</T><T x={204} y={40} s={7.5} c={K.red}>box 88%</T></>}
          {i === 0 && <T x={62} y={24} s={8} c={K.cyan} b>cat</T>}
          <T x={62 + i * 118} y={110} b s={9.5}>{h}</T><T x={62 + i * 118} y={126} s={8.5} o={0.75}>{s}</T>
        </g>
      ))}
    </Svg>
  );
}

export function NlpPipeline() {
  const st = [['Text / speech', K.grey], ['Tokenise', K.cyan], ['Clean', K.purple], ['Normalise', K.amber], ['Features', K.green], ['Model', K.pink]];
  const ex = ['"Robots ARE\namazing!"', 'Robots | ARE |\namazing | !', 'remove "are", "!"\n(stopwords)', 'robot, amazing\n(lower + stem)', 'robot:1\namazing:1', 'sentiment:\npositive'];
  // Row 1 runs left→right, row 2 runs right→left (snake)
  const pos = [[4, 8], [124, 8], [244, 8], [244, 96], [124, 96], [4, 96]];
  return (
    <Svg w={364} h={180} label="Natural language processing pipeline">
      {st.map(([s, c], i) => {
        const [x, y] = pos[i];
        return (
          <g key={s}>
            <Box x={x} y={y} w={108} h={26} label={s} c={c} s={9} />
            <T x={x + 54} y={y + 50} s={8.5} o={0.85}>{ex[i]}</T>
          </g>
        );
      })}
      <Arrow x1={112} y1={21} x2={124} y2={21} head={4} /><Arrow x1={232} y1={21} x2={244} y2={21} head={4} />
      <Line x1={352} y1={21} x2={360} y2={21} /><Line x1={360} y1={21} x2={360} y2={109} /><Arrow x1={360} y1={109} x2={352} y2={109} head={4} />
      <Arrow x1={244} y1={109} x2={232} y2={109} head={4} /><Arrow x1={124} y1={109} x2={112} y2={109} head={4} />
    </Svg>
  );
}

export function NeuralNet() {
  const L = [[50, [50, 100, 150]], [170, [36, 78, 122, 164]], [290, [76, 124]]];
  const lines = [];
  for (let a = 0; a < 2; a++) for (const y1 of L[a][1]) for (const y2 of L[a + 1][1]) lines.push([L[a][0], y1, L[a + 1][0], y2]);
  return (
    <Svg w={340} h={210} label="A simple neural network">
      {lines.map(([x1, y1, x2, y2], i) => <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} o={0.25} w={1} />)}
      {L.map(([x, ys], i) => ys.map((y, j) => <Circle key={`${i}${j}`} x={x} y={y} r={13} c={[K.cyan, K.purple, K.green][i]} fo={0.3} />))}
      <T x={50} y={186} b s={9}>Input layer</T><T x={50} y={200} s={8} o={0.75}>pixels / values</T>
      <T x={170} y={186} b s={9}>Hidden layer</T><T x={170} y={200} s={8} o={0.75}>finds patterns</T>
      <T x={290} y={186} b s={9}>Output layer</T><T x={290} y={200} s={8} o={0.75}>cat? dog?</T>
      <T x={110} y={14} s={8.5} o={0.8}>each line has a weight (importance)</T>
    </Svg>
  );
}

export function Neuron() {
  return (
    <Svg w={340} h={170} label="A single artificial neuron">
      {[[40, 'x₁', 'w₁'], [85, 'x₂', 'w₂'], [130, 'x₃', 'w₃']].map(([y, x, w]) => (
        <g key={x}><Circle x={30} y={y} r={13} c={K.cyan} label={x} s={9} /><Arrow x1={44} y1={y} x2={140} y2={85} /><T x={88} y={y + (y < 85 ? 14 : y > 85 ? -14 : -9)} s={8.5} c={K.purple}>{w}</T></g>
      ))}
      <Circle x={162} y={85} r={22} c={K.purple} label="Σ + b" s={9} />
      <Arrow x1={184} y1={85} x2={214} y2={85} />
      <Box x={214} y={66} w={60} h={38} label="activation" sub="f( )" c={K.amber} s={8.5} />
      <Arrow x1={274} y1={85} x2={316} y2={85} /><T x={324} y={85} s={9} b>y</T>
      <T x={170} y={150} s={8.5} o={0.85}>output = f(x₁w₁ + x₂w₂ + x₃w₃ + b) — learning = adjusting the weights</T>
    </Svg>
  );
}

export function DetVsProb() {
  return (
    <Svg w={350} h={170} label="Deterministic versus probabilistic problems">
      <Box x={6} y={6} w={164} h={158} c={K.cyan} />
      <T x={88} y={22} b s={10}>Deterministic</T>
      <Box x={20} y={36} w={136} h={30} label="input 25 → ×2 → 50" c={K.cyan} s={9} r={4} />
      <T x={88} y={92} s={8.5}>same input → SAME output,{'\n'}every single time</T>
      <T x={88} y={134} s={8.5} o={0.8}>calculator, logic gates,{'\n'}traffic light timer</T>
      <Box x={180} y={6} w={164} h={158} c={K.purple} />
      <T x={262} y={22} b s={10}>Probabilistic</T>
      <Box x={194} y={36} w={136} h={30} label="clouds + wind → ?" c={K.purple} s={9} r={4} />
      <T x={262} y={92} s={8.5}>answer is a LIKELIHOOD:{'\n'}"70% chance of rain"</T>
      <T x={262} y={134} s={8.5} o={0.8}>weather, face match, spam,{'\n'}diagnosis → needs AI</T>
    </Svg>
  );
}

export function DataToInfo() {
  return (
    <Svg w={350} h={150} label="Data becomes information">
      <Box x={6} y={30} w={84} h={60} label="DATA" sub="37, 38, 39.5" c={K.grey} />
      <Arrow x1={90} y1={60} x2={112} y2={60} />
      <Box x={112} y={22} w={110} h={76} c={K.purple} />
      <T x={167} y={36} b s={9.5}>PROCESSING</T>
      <T x={167} y={68} s={8.5}>collect → sort →{'\n'}calculate → analyse{'\n'}→ present</T>
      <Arrow x1={222} y1={60} x2={244} y2={60} />
      <Box x={244} y={30} w={100} h={60} label="INFORMATION" sub="fever is rising" c={K.green} s={9.5} />
      <T x={175} y={128} s={8.5} o={0.85}>Data types: numbers · text · audio · images/video</T>
    </Svg>
  );
}

export function CyberThreats() {
  const items = [
    ['🦠 Virus / malware', 'harmful program that\nspreads & damages', K.red], ['🎣 Phishing', 'fake message to steal\npasswords or OTP', K.amber],
    ['🕵️ Hacking', 'breaking into a system\nwithout permission', K.purple], ['📂 Data theft', 'copying private data\n(marks, photos, cards)', K.pink],
  ];
  return (
    <Svg w={350} h={210} label="Common cyber threats and defences">
      {items.map(([h, d, c], i) => (
        <g key={h}><Box x={6 + (i % 2) * 172} y={6 + Math.floor(i / 2) * 66} w={166} h={58} c={c} />
          <T x={89 + (i % 2) * 172} y={22 + Math.floor(i / 2) * 66} b s={9.5}>{h}</T>
          <T x={89 + (i % 2) * 172} y={44 + Math.floor(i / 2) * 66} s={8.5}>{d}</T></g>
      ))}
      <Box x={6} y={142} w={338} h={62} c={K.green} />
      <T x={175} y={156} b s={9.5}>🛡️ Defences</T>
      <T x={175} y={182} s={8.5}>strong unique passwords + 2-step login · update software · antivirus{'\n'}never share OTP · check links before tapping · back up your data</T>
    </Svg>
  );
}
