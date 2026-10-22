// Numerical problem generators — new numbers every time, with worked solutions.
// Each generator returns { q, answer, unit, steps[], tol?, choices? }.
// Numeric answers are accepted within `tol` (relative, default 2%).

const rnd = (a, b) => a + Math.random() * (b - a);
const int = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const r = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
const deg = (x) => (x * Math.PI) / 180;
const G = 9.8;

export const TOPICS = [
  // ── Mechanics & kinematics ──
  { id: 'gear', title: 'Gear ratio, speed and torque', area: 'Mechanics', lessons: ['c10_r_6', 'c11_e_1', 'c11_r_4'], classes: ['class_10', 'class_11'],
    gen() {
      const t1 = pick([10, 12, 15, 16, 20, 24]), k = pick([2, 3, 4, 5]), t2 = t1 * k;
      const n1 = pick([300, 600, 900, 1200, 1500]);
      const ask = pick(['speed', 'torque']);
      const tin = r(rnd(0.1, 0.8), 2);
      if (ask === 'speed') return {
        q: `A ${t1}-tooth driver gear on a motor turning at ${n1} rpm meshes with a ${t2}-tooth driven gear. Find the output speed.`,
        answer: n1 / k, unit: 'rpm',
        steps: [`Gear ratio = driven teeth ÷ driver teeth = ${t2} ÷ ${t1} = ${k} : 1`, `Output speed = input speed ÷ ratio = ${n1} ÷ ${k} = ${n1 / k} rpm`] };
      return {
        q: `A motor gives ${tin} N·m. It drives a ${t1}-tooth gear meshed with a ${t2}-tooth gear. Ignoring losses, find the output torque.`,
        answer: r(tin * k, 3), unit: 'N·m',
        steps: [`Gear ratio = ${t2} ÷ ${t1} = ${k}`, `Output torque = input torque × ratio = ${tin} × ${k} = ${r(tin * k, 3)} N·m`, 'Speed falls by the same factor — torque and speed trade off.'] };
    } },
  { id: 'compound', title: 'Compound gear trains', area: 'Mechanics', lessons: ['c10_r_6'], classes: ['class_10', 'class_11'],
    gen() {
      const a = pick([10, 12, 15]), ka = pick([2, 3, 4]), b = pick([12, 15, 20]), kb = pick([2, 3, 5]);
      const n = pick([1200, 1800, 2400, 3000]);
      const total = ka * kb;
      return {
        q: `In a compound gear train, a ${a}T gear drives a ${a * ka}T gear. On the same shaft as the ${a * ka}T gear, a ${b}T gear drives a ${b * kb}T gear. The input turns at ${n} rpm. Find the final output speed.`,
        answer: r(n / total, 2), unit: 'rpm',
        steps: [`Stage 1 ratio = ${a * ka} ÷ ${a} = ${ka}`, `Stage 2 ratio = ${b * kb} ÷ ${b} = ${kb}`, `Overall ratio = ${ka} × ${kb} = ${total}`, `Output = ${n} ÷ ${total} = ${r(n / total, 2)} rpm`] };
    } },
  { id: 'motorsize', title: 'Motor torque with gearbox efficiency', area: 'Mechanics', lessons: ['c11_e_1'], classes: ['class_11'],
    gen() {
      const t = r(rnd(0.05, 0.5), 2), k = pick([10, 20, 30, 50, 100]), eff = pick([0.7, 0.8, 0.85, 0.9]), n = pick([3000, 6000, 9000, 12000]);
      const ask = pick(['torque', 'speed']);
      if (ask === 'torque') return {
        q: `A motor delivers ${t} N·m at ${n} rpm through a ${k}:1 gearbox of ${eff * 100}% efficiency. Find the output torque.`,
        answer: r(t * k * eff, 3), unit: 'N·m',
        steps: ['Output torque = input torque × ratio × efficiency', `= ${t} × ${k} × ${eff} = ${r(t * k * eff, 3)} N·m`] };
      return {
        q: `A motor turns at ${n} rpm through a ${k}:1 gearbox. Find the output shaft speed.`,
        answer: r(n / k, 2), unit: 'rpm', steps: [`Output speed = ${n} ÷ ${k} = ${r(n / k, 2)} rpm`, 'Efficiency affects torque, not speed.'] };
    } },
  { id: 'statics', title: 'Holding torque (statics)', area: 'Mechanics', lessons: ['c11_r_5', 'c11_app_1'], classes: ['class_11'],
    gen() {
      const m = r(rnd(0.5, 5), 1), d = r(rnd(0.1, 0.8), 2);
      const withLink = Math.random() < 0.5;
      if (!withLink) return {
        q: `A robot arm holds a ${m} kg load horizontally at ${d} m from the joint. Find the torque the joint motor must provide (g = 9.8 m/s²).`,
        answer: r(m * G * d, 3), unit: 'N·m',
        steps: [`Weight = m × g = ${m} × 9.8 = ${r(m * G, 3)} N`, `Torque = weight × distance = ${r(m * G, 3)} × ${d} = ${r(m * G * d, 3)} N·m`] };
      const lm = r(rnd(0.3, 1.5), 1), L = d;
      const tq = lm * G * (L / 2) + m * G * L;
      return {
        q: `A horizontal link of length ${L} m and mass ${lm} kg holds a ${m} kg load at its end. Find the torque at the joint (g = 9.8 m/s²).`,
        answer: r(tq, 3), unit: 'N·m',
        steps: [`Link weight acts at its centre: ${lm} × 9.8 × ${r(L / 2, 3)} = ${r(lm * G * L / 2, 3)} N·m`, `Load: ${m} × 9.8 × ${L} = ${r(m * G * L, 3)} N·m`, `Total = ${r(tq, 3)} N·m`] };
    } },
  { id: 'inertia', title: 'Torque, inertia and angular acceleration', area: 'Mechanics', lessons: ['c11_r_5'], classes: ['class_11'],
    gen() {
      const I = r(rnd(0.01, 0.5), 3), a = r(rnd(1, 20), 1);
      return { q: `A joint with moment of inertia ${I} kg·m² must accelerate at ${a} rad/s². Find the torque required (ignore friction and gravity).`,
        answer: r(I * a, 4), unit: 'N·m', steps: ['τ = I × α', `= ${I} × ${a} = ${r(I * a, 4)} N·m`] };
    } },
  { id: 'fk2r', title: 'Forward kinematics of a 2R arm', area: 'Kinematics', lessons: ['c11_m_6', 'c10_r_13', 'c10_r_12'], classes: ['class_10', 'class_11'],
    gen() {
      const L1 = r(pick([0.3, 0.4, 0.5, 1, 8, 10]), 2), L2 = r(L1 * pick([0.5, 0.6, 0.75]), 2);
      const t1 = pick([0, 30, 45, 60, 90]), t2 = pick([-45, 0, 30, 45, 60, 90]);
      const x = L1 * Math.cos(deg(t1)) + L2 * Math.cos(deg(t1 + t2));
      const y = L1 * Math.sin(deg(t1)) + L2 * Math.sin(deg(t1 + t2));
      const ask = pick(['x', 'y']);
      const val = ask === 'x' ? x : y;
      return {
        q: `A 2R planar arm has L₁ = ${L1} and L₂ = ${L2} (same units). With θ₁ = ${t1}° and θ₂ = ${t2}°, find the ${ask}-coordinate of the end-effector.`,
        answer: r(val, 3), unit: '', tol: 0.02, absTol: 0.01,
        steps: [`θ₁ + θ₂ = ${t1 + t2}°`,
          ask === 'x' ? `x = L₁cosθ₁ + L₂cos(θ₁+θ₂) = ${L1}×${r(Math.cos(deg(t1)), 3)} + ${L2}×${r(Math.cos(deg(t1 + t2)), 3)}`
            : `y = L₁sinθ₁ + L₂sin(θ₁+θ₂) = ${L1}×${r(Math.sin(deg(t1)), 3)} + ${L2}×${r(Math.sin(deg(t1 + t2)), 3)}`,
          `${ask} = ${r(val, 3)}`, `(The full position is (${r(x, 3)}, ${r(y, 3)}).)`] };
    } },
  { id: 'rp', title: 'RP arm and polar coordinates', area: 'Kinematics', lessons: ['c11_m_6', 'c11_m_7'], classes: ['class_11'],
    gen() {
      const d = r(rnd(0.2, 3), 2), t = pick([0, 15, 30, 45, 60, 120, 135, 210, 225, 300]);
      const ask = pick(['x', 'y']);
      const val = ask === 'x' ? d * Math.cos(deg(t)) : d * Math.sin(deg(t));
      return {
        q: `An RP arm (or polar point) has θ = ${t}° and extension r = ${d} m. Find ${ask}.`,
        answer: r(val, 3), unit: 'm', absTol: 0.01,
        steps: [ask === 'x' ? `x = r cosθ = ${d} × ${r(Math.cos(deg(t)), 3)}` : `y = r sinθ = ${d} × ${r(Math.sin(deg(t)), 3)}`, `${ask} = ${r(val, 3)} m`] };
    } },
  { id: 'cart2polar', title: 'Cartesian to polar', area: 'Kinematics', lessons: ['c11_m_7'], classes: ['class_11'],
    gen() {
      const [x, y] = pick([[3, 4], [6, 8], [5, 12], [8, 6], [-3, 4], [1, 1], [-2, 2], [7, 24]]);
      const rr = Math.hypot(x, y);
      return { q: `Convert the point (${x}, ${y}) to polar form. Give r.`, answer: r(rr, 3), unit: '',
        steps: [`r = √(x² + y²) = √(${x * x} + ${y * y}) = ${r(rr, 3)}`, `θ = atan2(${y}, ${x}) = ${r(Math.atan2(y, x) * 180 / Math.PI, 1)}°`] };
    } },
  { id: 'rotate', title: 'Rotating a point with a matrix', area: 'Kinematics', lessons: ['c11_r_6', 'c11_m_2'], classes: ['class_11'],
    gen() {
      const px = int(1, 5), py = int(0, 4), t = pick([30, 45, 60, 90, 180]);
      const tx = int(0, 5), ty = int(0, 5);
      const nx = px * Math.cos(deg(t)) - py * Math.sin(deg(t)) + tx;
      const ny = px * Math.sin(deg(t)) + py * Math.cos(deg(t)) + ty;
      const ask = pick(['x', 'y']);
      return {
        q: `The point (${px}, ${py}) is rotated by ${t}° about the origin and then translated by (${tx}, ${ty}). Find the new ${ask}-coordinate.`,
        answer: r(ask === 'x' ? nx : ny, 3), unit: '', absTol: 0.01,
        steps: [`x′ = x cosθ − y sinθ = ${px}×${r(Math.cos(deg(t)), 3)} − ${py}×${r(Math.sin(deg(t)), 3)} = ${r(nx - tx, 3)}`,
          `y′ = x sinθ + y cosθ = ${px}×${r(Math.sin(deg(t)), 3)} + ${py}×${r(Math.cos(deg(t)), 3)} = ${r(ny - ty, 3)}`,
          `Add the translation → (${r(nx, 3)}, ${r(ny, 3)})`] };
    } },
  { id: 'grubler', title: 'Degrees of freedom (Grübler)', area: 'Kinematics', lessons: ['c11_m_3', 'c9_r_13', 'c11_m_4'], classes: ['class_9', 'class_11'],
    gen() {
      const n = int(3, 8), j1 = int(Math.max(2, n - 2), n + 2), j2 = Math.random() < 0.3 ? 1 : 0;
      const dof = 3 * (n - 1) - 2 * j1 - j2;
      return {
        q: `A planar mechanism has ${n} links (including ground), ${j1} lower pairs (1-DOF joints)${j2 ? ' and 1 higher pair (2-DOF joint)' : ''}. Find its DOF.`,
        answer: dof, unit: '', absTol: 0,
        steps: ['DOF = 3(n − 1) − 2j₁ − j₂', `= 3(${n} − 1) − 2(${j1}) − ${j2} = ${3 * (n - 1)} − ${2 * j1} − ${j2} = ${dof}`,
          dof <= 0 ? 'DOF ≤ 0 → a structure (or over-constrained).' : dof === 1 ? 'DOF = 1 → one input drives the mechanism.' : `DOF = ${dof} → needs ${dof} independent inputs.`] };
    } },
  { id: 'grashof', title: 'Grashof condition', area: 'Kinematics', lessons: ['c11_m_4'], classes: ['class_11'],
    gen() {
      const links = [int(2, 6), int(5, 10), int(6, 11), int(7, 12)];
      const s = Math.min(...links), l = Math.max(...links), sum = links.reduce((a, b) => a + b, 0), pq = sum - s - l;
      const ok = s + l <= pq;
      return {
        q: `A four-bar linkage has links of ${links.join(', ')} cm. Does it satisfy Grashof's condition (can at least one link rotate fully)?`,
        answer: ok ? 'Yes' : 'No', choices: ['Yes', 'No'],
        steps: [`Shortest s = ${s}, longest l = ${l}, others p + q = ${pq}`, `s + l = ${s + l} ${ok ? '≤' : '>'} ${pq}`, ok ? 'Grashof linkage — at least one link can rotate fully.' : 'Non-Grashof — no link can make a full rotation (triple rocker).'] };
    } },
  // ── Electrical ──
  { id: 'ohm', title: "Ohm's law and LED resistors", area: 'Electrical', lessons: ['c11_e_5', 'c9_r_8', 'c10_r_10'], classes: ['class_9', 'class_10', 'class_11'],
    gen() {
      const kind = pick(['led', 'ohm', 'power']);
      if (kind === 'led') {
        const vs = pick([3.3, 5, 9, 12]), vf = pick([1.8, 2, 2.2, 3]), i = pick([10, 15, 20]);
        if (vf >= vs) return this.gen();
        const R = (vs - vf) / (i / 1000);
        return { q: `An LED (forward voltage ${vf} V) must run at ${i} mA from a ${vs} V supply. Find the series resistor value.`,
          answer: r(R, 1), unit: 'Ω', steps: ['R = (V_supply − V_LED) ÷ I', `= (${vs} − ${vf}) ÷ ${i / 1000} = ${r(R, 1)} Ω`, 'Choose the next standard value up (e.g. 220 Ω, 330 Ω).'] };
      }
      if (kind === 'ohm') {
        const V = pick([3.3, 5, 6, 9, 12]), R = pick([10, 47, 100, 220, 470, 1000]);
        return { q: `A ${R} Ω resistor is connected across ${V} V. Find the current in mA.`, answer: r(V / R * 1000, 2), unit: 'mA',
          steps: ['I = V ÷ R', `= ${V} ÷ ${R} = ${r(V / R, 5)} A = ${r(V / R * 1000, 2)} mA`] };
      }
      const V = pick([5, 7.4, 11.1, 12]), I = r(rnd(0.2, 3), 2);
      return { q: `A motor draws ${I} A at ${V} V. Find its electrical power.`, answer: r(V * I, 3), unit: 'W', steps: ['P = V × I', `= ${V} × ${I} = ${r(V * I, 3)} W`] };
    } },
  { id: 'pwm', title: 'PWM duty cycle', area: 'Electrical', lessons: ['c11_e_1', 'c9_r_11', 'c10_r_8'], classes: ['class_9', 'class_10', 'class_11'],
    gen() {
      const V = pick([5, 6, 9, 12]);
      if (Math.random() < 0.5) {
        const d = pick([20, 25, 40, 50, 60, 75, 80]);
        return { q: `A ${V} V PWM signal has a duty cycle of ${d}%. Find the average voltage.`, answer: r(V * d / 100, 3), unit: 'V',
          steps: ['V_avg = duty × V_supply', `= ${d / 100} × ${V} = ${r(V * d / 100, 3)} V`] };
      }
      const val = int(20, 250);
      return { q: `On Arduino, analogWrite(pin, ${val}) is used with a ${V} V motor supply. Find the duty cycle (%) and average voltage. Give the average voltage.`,
        answer: r(V * val / 255, 3), unit: 'V', steps: [`Duty = ${val} ÷ 255 = ${r(val / 255 * 100, 1)}%`, `V_avg = ${r(val / 255, 4)} × ${V} = ${r(V * val / 255, 3)} V`] };
    } },
  { id: 'adc', title: 'ADC readings', area: 'Electrical', lessons: ['c11_mc_1', 'c11_e_2', 'c10_r_7'], classes: ['class_10', 'class_11'],
    gen() {
      const vref = pick([5, 3.3]), bits = pick([10, 12]), max = 2 ** bits - 1, raw = int(50, max - 50);
      const v = raw * vref / max;
      if (Math.random() < 0.6) return {
        q: `A ${bits}-bit ADC with reference ${vref} V reads ${raw}. Find the input voltage.`, answer: r(v, 3), unit: 'V',
        steps: [`Max count = 2^${bits} − 1 = ${max}`, `V = raw × Vref ÷ max = ${raw} × ${vref} ÷ ${max} = ${r(v, 3)} V`] };
      const lm = r(rnd(15, 45), 1), rawLm = Math.round((lm / 100) * 1023 / 5);
      return { q: `An LM35 (10 mV/°C) on a 10-bit, 5 V Arduino ADC reads ${rawLm}. Find the temperature.`, answer: r(rawLm * 5 / 1023 * 100, 1), unit: '°C',
        steps: [`V = ${rawLm} × 5 ÷ 1023 = ${r(rawLm * 5 / 1023, 4)} V`, `T = V ÷ 0.01 = ${r(rawLm * 5 / 1023 * 100, 1)} °C`] };
    } },
  { id: 'ultra', title: 'Ultrasonic distance', area: 'Electrical', lessons: ['c11_e_2', 'c10_r_7', 'c10_r_15'], classes: ['class_9', 'class_10', 'class_11'],
    gen() {
      if (Math.random() < 0.6) {
        const t = int(300, 12000);
        return { q: `An HC-SR04 echo pulse lasts ${t} µs. Find the distance in cm (speed of sound 343 m/s).`, answer: r(t * 0.0343 / 2, 2), unit: 'cm',
          steps: ['Speed of sound = 0.0343 cm/µs', `Distance = speed × time ÷ 2 = 0.0343 × ${t} ÷ 2 = ${r(t * 0.0343 / 2, 2)} cm`, 'Divide by 2 because the sound goes there and back.'] };
      }
      const d = int(5, 200);
      return { q: `An object is ${d} cm away. How long (µs) will the ultrasonic echo pulse last?`, answer: r(2 * d / 0.0343, 0), unit: 'µs', tol: 0.02,
        steps: [`t = 2d ÷ speed = 2 × ${d} ÷ 0.0343 = ${r(2 * d / 0.0343, 0)} µs`] };
    } },
  { id: 'battery', title: 'Battery packs and run time', area: 'Electrical', lessons: ['c11_e_3', 'c11_e_5', 'c10_r_5'], classes: ['class_10', 'class_11'],
    gen() {
      const kind = pick(['runtime', 'series', 'crating', 'energy']);
      if (kind === 'runtime') {
        const cap = pick([1000, 1500, 2200, 3000, 5000]), I = r(rnd(0.3, 3), 2), use = pick([0.8, 1]);
        const h = cap / 1000 * use / I;
        return { q: `A ${cap} mAh battery powers a robot drawing ${I} A on average${use < 1 ? ', using only 80% of capacity' : ''}. Find the run time in minutes.`,
          answer: r(h * 60, 1), unit: 'min', steps: [`Capacity = ${cap / 1000} Ah${use < 1 ? ` × 0.8 = ${r(cap / 1000 * use, 3)} Ah usable` : ''}`, `Time = ${r(cap / 1000 * use, 3)} ÷ ${I} = ${r(h, 3)} h = ${r(h * 60, 1)} min`] };
      }
      if (kind === 'series') {
        const s = pick([2, 3, 4, 6]);
        return { q: `What is the nominal voltage of a ${s}S Li-ion/LiPo pack (3.7 V per cell)?`, answer: r(3.7 * s, 2), unit: 'V', steps: [`Series cells add voltage: ${s} × 3.7 = ${r(3.7 * s, 2)} V`] };
      }
      if (kind === 'crating') {
        const cap = pick([1300, 1500, 2200, 5000]), c = pick([20, 25, 30, 45]);
        return { q: `A ${cap} mAh LiPo is rated ${c}C. Find the maximum continuous current.`, answer: r(cap / 1000 * c, 2), unit: 'A', steps: [`I_max = capacity (Ah) × C = ${cap / 1000} × ${c} = ${r(cap / 1000 * c, 2)} A`] };
      }
      const V = pick([7.4, 11.1, 12, 14.8]), cap = pick([2.2, 3, 5, 7]);
      return { q: `How much energy (Wh) is stored in a ${V} V, ${cap} Ah battery?`, answer: r(V * cap, 2), unit: 'Wh', steps: [`E = V × Ah = ${V} × ${cap} = ${r(V * cap, 2)} Wh`] };
    } },
  { id: 'budget', title: 'Power budget', area: 'Electrical', lessons: ['c11_e_5'], classes: ['class_11'],
    gen() {
      const parts = [['Arduino', 5, 0.05], ['2 DC motors', 6, 2 * r(rnd(0.2, 0.8), 2)], ['servo', 5, r(rnd(0.3, 1), 2)], ['sensors', 5, r(rnd(0.02, 0.1), 2)]];
      const P = parts.reduce((s, [, v, i]) => s + v * i, 0), margin = pick([20, 25, 30]), Vb = pick([7.4, 11.1, 12]);
      const Ptot = P * (1 + margin / 100), I = Ptot / Vb;
      return {
        q: `Loads: ${parts.map(([n, v, i]) => `${n} ${v} V × ${i} A`).join('; ')}. With a ${margin}% safety margin, what current (A) must a ${Vb} V battery supply? (Assume ideal regulators.)`,
        answer: r(I, 3), unit: 'A',
        steps: [...parts.map(([n, v, i]) => `${n}: ${v} × ${i} = ${r(v * i, 3)} W`), `Total = ${r(P, 3)} W; + ${margin}% = ${r(Ptot, 3)} W`, `I = P ÷ V = ${r(Ptot, 3)} ÷ ${Vb} = ${r(I, 3)} A`] };
    } },
  // ── Mobile robots & encoders ──
  { id: 'wheel', title: 'Wheel speed and distance', area: 'Mobile robots', lessons: ['c11_app_2', 'c10_r_15', 'c11_m_9'], classes: ['class_10', 'class_11'],
    gen() {
      const dmm = pick([48, 60, 65, 70, 80, 100]), rpm = pick([60, 100, 120, 150, 200, 300]);
      const circ = Math.PI * dmm / 10; // cm
      if (Math.random() < 0.5) return {
        q: `A robot has ${dmm} mm wheels turning at ${rpm} rpm. Find its speed in cm/s.`, answer: r(circ * rpm / 60, 2), unit: 'cm/s',
        steps: [`Circumference = π × d = π × ${dmm / 10} cm = ${r(circ, 3)} cm`, `Revolutions per second = ${rpm} ÷ 60 = ${r(rpm / 60, 3)}`, `Speed = ${r(circ, 3)} × ${r(rpm / 60, 3)} = ${r(circ * rpm / 60, 2)} cm/s`] };
      const dist = int(50, 500);
      return { q: `How many full wheel revolutions does a robot with ${dmm} mm wheels need to travel ${dist} cm?`, answer: r(dist / circ, 2), unit: 'rev',
        steps: [`Circumference = π × ${dmm / 10} = ${r(circ, 3)} cm`, `Revolutions = ${dist} ÷ ${r(circ, 3)} = ${r(dist / circ, 2)}`] };
    } },
  { id: 'encoder', title: 'Encoders and resolution', area: 'Mobile robots', lessons: ['c11_m_8', 'c11_mc_1', 'c11_app_2'], classes: ['class_11'],
    gen() {
      const cpr = pick([20, 360, 600, 1024, 2048, 4096]);
      if (Math.random() < 0.5) {
        const gr = pick([1, 30, 50, 100]);
        return { q: `A joint uses a ${cpr}-count encoder on the motor and a ${gr}:1 gearbox. Find the joint angle resolution in degrees.`,
          answer: r(360 / (cpr * gr), 6), unit: '°', tol: 0.02, steps: [`Counts per joint revolution = ${cpr} × ${gr} = ${cpr * gr}`, `Resolution = 360 ÷ ${cpr * gr} = ${r(360 / (cpr * gr), 6)}°`] };
      }
      const dmm = pick([60, 65, 80, 100]), ticks = int(cpr, cpr * 10);
      const dist = ticks / cpr * Math.PI * dmm / 10;
      return { q: `A wheel of ${dmm} mm diameter has a ${cpr}-count encoder. It records ${ticks} counts. How far did the robot travel (cm)?`,
        answer: r(dist, 2), unit: 'cm', steps: [`Revolutions = ${ticks} ÷ ${cpr} = ${r(ticks / cpr, 4)}`, `Distance = revolutions × π × d = ${r(ticks / cpr, 4)} × π × ${dmm / 10} = ${r(dist, 2)} cm`] };
    } },
  { id: 'stepper', title: 'Stepper motor steps', area: 'Mobile robots', lessons: ['c9_r_11', 'c10_r_8', 'c11_e_1'], classes: ['class_9', 'class_10', 'class_11'],
    gen() {
      const spr = pick([200, 400]), micro = pick([1, 2, 8, 16]), lead = pick([2, 4, 8]), mm = int(5, 120);
      const steps = mm / lead * spr * micro;
      if (Math.random() < 0.5) return { q: `A ${spr}-step/rev stepper at 1/${micro} microstepping drives a lead screw of ${lead} mm pitch. How many steps move the nut ${mm} mm?`,
        answer: r(steps, 0), unit: 'steps', tol: 0.005, steps: [`Steps per rev = ${spr} × ${micro} = ${spr * micro}`, `Revolutions = ${mm} ÷ ${lead} = ${r(mm / lead, 3)}`, `Steps = ${r(mm / lead, 3)} × ${spr * micro} = ${r(steps, 0)}`] };
      return { q: `What is the step angle of a ${spr}-step/rev stepper motor?`, answer: r(360 / spr, 2), unit: '°', steps: [`Step angle = 360 ÷ ${spr} = ${r(360 / spr, 2)}°`] };
    } },
  // ── Computing ──
  { id: 'binary', title: 'Number system conversions', area: 'Computing', lessons: ['c9_c_5', 'c9_c_6'], classes: ['class_9', 'class_11'],
    gen() {
      const n = int(10, 255);
      const kind = pick(['d2b', 'b2d', 'd2h', 'h2d', 'd2o']);
      const map = {
        d2b: [`Convert ${n} (decimal) to binary.`, n.toString(2), 'Divide by 2 repeatedly and read remainders bottom to top.'],
        b2d: [`Convert ${n.toString(2)}₂ to decimal.`, String(n), 'Multiply each bit by its place value (1, 2, 4, 8 …) and add.'],
        d2h: [`Convert ${n} (decimal) to hexadecimal.`, n.toString(16).toUpperCase(), 'Divide by 16 repeatedly; 10–15 are A–F.'],
        h2d: [`Convert ${n.toString(16).toUpperCase()}₁₆ to decimal.`, String(n), 'Multiply each hex digit by 16ⁿ and add.'],
        d2o: [`Convert ${n} (decimal) to octal.`, n.toString(8), 'Divide by 8 repeatedly and read remainders upwards.'],
      };
      const [q, ans, hint] = map[kind];
      return { q, answer: ans, text: true, steps: [hint, `Answer: ${ans}`, `Check: ${n}₁₀ = ${n.toString(2)}₂ = ${n.toString(8)}₈ = ${n.toString(16).toUpperCase()}₁₆`] };
    } },
  { id: 'metrics', title: 'Model evaluation metrics', area: 'AI', lessons: ['c10_a_8', 'c10_a_6', 'c10_a_3'], classes: ['class_10', 'class_11'],
    gen() {
      const tp = int(20, 90), tn = int(20, 90), fp = int(2, 20), fn = int(2, 20);
      const total = tp + tn + fp + fn;
      const ask = pick(['accuracy', 'precision', 'recall']);
      const val = ask === 'accuracy' ? (tp + tn) / total : ask === 'precision' ? tp / (tp + fp) : tp / (tp + fn);
      const formula = ask === 'accuracy' ? `(TP + TN) ÷ total = (${tp} + ${tn}) ÷ ${total}` : ask === 'precision' ? `TP ÷ (TP + FP) = ${tp} ÷ ${tp + fp}` : `TP ÷ (TP + FN) = ${tp} ÷ ${tp + fn}`;
      return { q: `A classifier gives TP = ${tp}, TN = ${tn}, FP = ${fp}, FN = ${fn}. Find the ${ask} (%).`, answer: r(val * 100, 2), unit: '%',
        steps: [`${ask[0].toUpperCase() + ask.slice(1)} = ${formula}`, `= ${r(val * 100, 2)}%`] };
    } },
  { id: 'regression', title: 'Linear regression predictions', area: 'AI', lessons: ['c10_a_8'], classes: ['class_10', 'class_11'],
    gen() {
      const m = r(rnd(1, 12), 1), c = r(rnd(-5, 30), 1), x = int(1, 12);
      return { q: `A model has learned y = ${m}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}. Predict y when x = ${x}.`, answer: r(m * x + c, 2), unit: '',
        steps: [`y = ${m} × ${x} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${r(m * x + c, 2)}`] };
    } },
];

export function topicsForClass(classId) {
  return TOPICS.filter(t => t.classes.includes(classId));
}

export function topicsForLesson(lessonId) {
  return TOPICS.filter(t => t.lessons.includes(lessonId));
}

export function makeProblem(topicId) {
  const t = TOPICS.find(x => x.id === topicId);
  if (!t) return null;
  const p = t.gen.call(t);
  return { ...p, topicId: t.id, topicTitle: t.title };
}

const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, '').replace(/^0+(?=\w)/, '');

export function checkAnswer(problem, given) {
  if (given === '' || given == null) return false;
  if (problem.choices || problem.text) return norm(given) === norm(problem.answer);
  const g = parseFloat(String(given).replace(/,/g, ''));
  if (!Number.isFinite(g)) return false;
  const a = Number(problem.answer);
  if (problem.absTol !== undefined && Math.abs(g - a) <= Math.max(problem.absTol, Math.abs(a) * (problem.tol ?? 0.02))) return true;
  if (a === 0) return Math.abs(g) < 1e-6;
  return Math.abs(g - a) / Math.abs(a) <= (problem.tol ?? 0.02);
}
