// Arduino C/C++ (school subset) → async JavaScript.
// Runs on the phone, offline. Supports: variables and arrays of the usual types,
// #define, functions, if/else, for, while, do-while, switch, Serial, pin functions,
// Servo, delay/millis/micros, pulseIn, map/constrain/math helpers.
// Integer variables keep integer behaviour on assignment (x = 7/2 → 3).

const NUM_TYPES = new Set(['int', 'long', 'short', 'byte', 'word', 'unsigned', 'signed', 'uint8_t', 'int8_t', 'uint16_t', 'int16_t', 'uint32_t', 'int32_t', 'size_t', 'float', 'double', 'bool', 'boolean', 'char']);
const INT_TYPES = new Set(['int', 'long', 'short', 'byte', 'word', 'unsigned', 'uint8_t', 'int8_t', 'uint16_t', 'int16_t', 'uint32_t', 'int32_t', 'size_t']);
const QUALIFIERS = new Set(['const', 'static', 'volatile', 'unsigned', 'signed', 'extern', 'inline']);
const CLASS_TYPES = new Set(['Servo', 'String']);
const TYPE_WORDS = new Set([...NUM_TYPES, ...QUALIFIERS, ...CLASS_TYPES, 'void', 'auto']);
const ASYNC_BUILTINS = new Set(['delay', 'delayMicroseconds', 'pulseIn']);
const JS_RESERVED = new Set(['function', 'var', 'let', 'in', 'typeof', 'instanceof', 'with', 'await', 'yield', 'eval', 'arguments', 'export', 'import', 'super', 'undefined', 'NaN', 'Infinity', 'debugger', 'interface', 'package', 'implements', 'private', 'protected', 'public', 'of']);
const ASSIGN_OPS = new Set(['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '|=', '^=']);
const OPS = ['<<=', '>>=', '...', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '==', '!=', '<=', '>=', '&&', '||', '<<', '>>', '->', '::'];

export class SketchError extends Error {
  constructor(message, line) { super(message); this.line = line; }
}

export function tokenize(src) {
  const toks = [];
  let i = 0, line = 1;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; }
      i += 2; continue;
    }
    if (c === '#') {
      let j = i; let text = '';
      while (j < n && src[j] !== '\n') { if (src[j] === '\\' && src[j + 1] === '\n') { j += 2; line++; continue; } text += src[j]; j++; }
      toks.push({ t: 'pre', v: text.trim(), line });
      i = j; continue;
    }
    if (c === '"') {
      let j = i + 1;
      while (j < n && src[j] !== '"') { if (src[j] === '\\') j++; if (src[j] === '\n') throw new SketchError('Text in quotes "..." must end on the same line', line); j++; }
      toks.push({ t: 'str', v: src.slice(i, j + 1), line });
      i = j + 1; continue;
    }
    if (c === "'") {
      let j = i + 1, ch;
      if (src[j] === '\\') { const e = src[j + 1]; ch = { n: 10, t: 9, r: 13, 0: 0, '\\': 92, "'": 39, '"': 34 }[e]; if (ch === undefined) ch = e.charCodeAt(0); j += 2; }
      else { ch = src.charCodeAt(j); j += 1; }
      if (src[j] !== "'") throw new SketchError("A character like 'A' must be in single quotes", line);
      toks.push({ t: 'num', v: String(ch), line });
      i = j + 1; continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1]))) {
      let j = i;
      if (c === '0' && /[xX]/.test(src[i + 1])) { j += 2; while (/[0-9a-fA-F]/.test(src[j])) j++; const v = src.slice(i, j); while (/[uUlL]/.test(src[j])) j++; toks.push({ t: 'num', v, line }); i = j; continue; }
      if (c === '0' && /[bB]/.test(src[i + 1])) { j += 2; while (/[01]/.test(src[j])) j++; const v = src.slice(i, j); while (/[uUlL]/.test(src[j])) j++; toks.push({ t: 'num', v, line }); i = j; continue; }
      while (/[0-9.]/.test(src[j])) j++;
      if (/[eE]/.test(src[j]) && /[-+0-9]/.test(src[j + 1])) { j += 2; while (/[0-9]/.test(src[j])) j++; }
      let v = src.slice(i, j);
      while (/[uUlLfF]/.test(src[j])) j++;
      if (/^0[0-7]+$/.test(v)) v = '0o' + v.slice(1); // C octal literal
      toks.push({ t: 'num', v, line }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      toks.push({ t: 'id', v: src.slice(i, j), line }); i = j; continue;
    }
    const op = OPS.find(o => src.startsWith(o, i));
    if (op) { toks.push({ t: 'op', v: op, line }); i += op.length; continue; }
    toks.push({ t: 'op', v: c, line }); i++;
  }
  return toks;
}

function matchClose(toks, i) {
  const open = toks[i].v, close = { '(': ')', '[': ']', '{': '}' }[open];
  let d = 0;
  for (let k = i; k < toks.length; k++) {
    if (toks[k].v === open && toks[k].t === 'op') d++;
    else if (toks[k].v === close && toks[k].t === 'op') { d--; if (d === 0) return k; }
  }
  throw new SketchError(`Missing "${close}" for "${open}"`, toks[i].line);
}

const isType = (tok) => tok && tok.t === 'id' && TYPE_WORDS.has(tok.v);

export function transpile(src) {
  const toks = tokenize(src);
  // Pass 1: user function names (so calls can be awaited even before definition).
  const userFns = new Set();
  {
    let depth = 0;
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t.v === '{' && t.t === 'op') depth++;
      if (t.v === '}' && t.t === 'op') depth--;
      if (depth === 0 && isType(t)) {
        let k = i; while (isType(toks[k])) k++;
        if (toks[k]?.t === 'id' && toks[k + 1]?.v === '(') userFns.add(toks[k].v);
      }
    }
  }
  const intNames = new Set();
  const out = [];
  const closeAfter = {}; // token index → text to insert after it
  const pendingClose = []; // { depth, text } closes before a terminator at this paren depth
  let paren = 0;
  let braceDepth = 0;
  const hasSetup = userFns.has('setup');
  if (!hasSetup) throw new SketchError('Your sketch needs a void setup() function', 1);
  if (!userFns.has('loop')) throw new SketchError('Your sketch needs a void loop() function', 1);

  const emit = (s) => out.push(s);
  const name = (v) => (JS_RESERVED.has(v) ? `_u_${v}` : v);

  // Find the end index of the primary expression starting at i (for casts).
  const primaryEnd = (i) => {
    let k = i;
    while (toks[k] && (toks[k].v === '-' || toks[k].v === '!' || toks[k].v === '~' || toks[k].v === '+') && toks[k].t === 'op') k++;
    if (!toks[k]) return i;
    if (toks[k].v === '(') k = matchClose(toks, k);
    else if (toks[k].t === 'id') {
      // identifier with member/call/index chain
      while (true) {
        if (toks[k + 1]?.v === '(' ) { k = matchClose(toks, k + 1); continue; }
        if (toks[k + 1]?.v === '[') { k = matchClose(toks, k + 1); continue; }
        if (toks[k + 1]?.v === '.' && toks[k + 2]?.t === 'id') { k += 2; continue; }
        break;
      }
    }
    return k;
  };

  // Wrap a single statement (for brace-less loop bodies) — returns end index of statement.
  const statementEnd = (i) => {
    const t = toks[i];
    if (t.v === '{') return matchClose(toks, i);
    if (t.t === 'id' && (t.v === 'if' || t.v === 'for' || t.v === 'while')) {
      let k = matchClose(toks, i + 1);
      let e = statementEnd(k + 1);
      if (t.v === 'if' && toks[e + 1]?.v === 'else') e = statementEnd(e + 2);
      return e;
    }
    let k = i, d = 0;
    for (; k < toks.length; k++) {
      const v = toks[k].v;
      if ('([{'.includes(v) && toks[k].t === 'op') d++;
      if (')]}'.includes(v) && toks[k].t === 'op') d--;
      if (v === ';' && d === 0) return k;
    }
    throw new SketchError('Missing ";" at the end of a statement', t.line);
  };

  const parseDecl = (i, inFor) => {
    // collect type words
    const typeWords = [];
    let k = i;
    while (isType(toks[k])) { typeWords.push(toks[k].v); k++; }
    while (toks[k]?.v === '*' || toks[k]?.v === '&') k++; // pointers/references (treated as values)
    const isConst = typeWords.includes('const');
    const base = typeWords.filter(w => !QUALIFIERS.has(w) || w === 'unsigned' || w === 'signed');
    const intLike = base.some(w => INT_TYPES.has(w)) && !base.includes('float') && !base.includes('double');
    const isServo = base.includes('Servo');
    const isString = base.includes('String');
    const isChar = base.includes('char');
    const isBool = base.includes('bool') || base.includes('boolean');
    if (toks[k]?.t !== 'id') throw new SketchError('Expected a variable or function name after the type', toks[i].line);

    // function definition / prototype
    if (toks[k + 1]?.v === '(' && braceDepth === 0 && !inFor) {
      const fname = toks[k].v;
      const close = matchClose(toks, k + 1);
      const params = [];
      let seg = [];
      for (let p = k + 2; p < close; p++) {
        if (toks[p].v === ',') { params.push(seg); seg = []; } else seg.push(toks[p]);
      }
      if (seg.length) params.push(seg);
      const pnames = [];
      for (const s of params) {
        const ids = s.filter(x => x.t === 'id' && !TYPE_WORDS.has(x.v));
        if (s.length === 1 && s[0].v === 'void') continue;
        if (!ids.length) continue;
        const pn = ids[ids.length - 1].v;
        if (s.some(x => INT_TYPES.has(x.v))) intNames.add(pn);
        const eq = s.findIndex(x => x.v === '=');
        pnames.push(eq >= 0 ? `${name(pn)} = ${s.slice(eq + 1).map(x => x.v).join(' ')}` : name(pn));
      }
      if (toks[close + 1]?.v === ';') return close + 2; // prototype
      emit(`async function ${name(fname)}(${pnames.join(', ')}) `);
      return close + 1;
    }

    // variable declarations: a, b = 2, c[3] = {1,2,3};
    emit(isConst && !inFor ? 'const ' : 'let ');
    let first = true;
    while (true) {
      const vn = toks[k].v; k++;
      if (!first) emit(', ');
      first = false;
      let isArray = false, size = null;
      while (toks[k]?.v === '[') {
        const c = matchClose(toks, k);
        isArray = true;
        if (size === null && c > k + 1) size = toks.slice(k + 1, c).map(x => x.v).join(' ');
        k = c + 1;
      }
      if (intLike && !isArray) intNames.add(vn);
      emit(name(vn));
      if (toks[k]?.v === '=') {
        k++;
        // initializer up to , or ; at depth 0
        let end = k, d = 0;
        for (; end < toks.length; end++) {
          const v = toks[end].v;
          if ('([{'.includes(v) && toks[end].t === 'op') d++;
          if (')]}'.includes(v) && toks[end].t === 'op') d--;
          if ((v === ',' || v === ';') && d === 0) break;
          if (inFor && v === ')' && d < 0) break;
        }
        emit(' = ');
        if (toks[k].v === '{') {
          emit(transpileRange(k, end).replace(/\{\n/g, '[').replace(/\}\n/g, ']'));
        } else if (isArray && isChar && toks[k].t === 'str') {
          emit('__chars(' + toks[k].v + ')');
        } else if (intLike && !isArray) {
          emit('__i(' + transpileRange(k, end) + ')');
        } else {
          emit(transpileRange(k, end));
        }
        k = end;
      } else if (isServo) {
        emit(' = new Servo()');
      } else if (isArray) {
        emit(isChar ? ' = ""' : ` = __arr(${size ?? 0})`);
      } else if (!inFor) {
        emit(isString ? ' = ""' : isBool ? ' = false' : ' = 0');
      }
      if (toks[k]?.v === ',') { k++; continue; }
      break;
    }
    return k; // at ';' (or ')' in for-init)
  };

  // Translate a token range [a, b) as an expression (no declarations).
  function transpileRange(a, b) {
    const saved = out.length;
    walk(a, b);
    const s = out.splice(saved).join('');
    return s;
  }

  function prevTok(i) { return toks[i - 1]; }

  function walk(start, end) {
    let i = start;
    while (i < end) {
      const t = toks[i];
      const prev = prevTok(i);

      if (t.t === 'pre') {
        const m = t.v.match(/^#\s*define\s+([A-Za-z_]\w*)(\(([^)]*)\))?\s*(.*)$/);
        if (m) {
          if (m[2] !== undefined) {
            emit(`const ${m[1]} = (${m[3]}) => (${m[4] || 0});\n`);
          } else {
            let val = (m[4] || '1').trim();
            val = val.replace(/(\d+(?:\.\d+)?)[uUlLfF]+\b/g, '$1');
            emit(`const ${m[1]} = ${val};\n`);
          }
        }
        // #include and others are ignored
        i++; continue;
      }

      // Declarations at statement start (or for-init)
      const stmtStart = !prev || [';', '{', '}'].includes(prev.v) || prev.t === 'pre' || (prev.v === ')' && false);
      const forInit = prev && prev.v === '(' && toks[i - 2]?.v === 'for';
      if (isType(t) && (stmtStart || forInit) && !(t.v === 'String' && toks[i + 1]?.v === '(')) {
        i = parseDecl(i, forInit);
        continue;
      }

      // Function-style casts: int(x), float(x), byte(x)
      if (isType(t) && toks[i + 1]?.v === '(' && t.v !== 'String') {
        if (INT_TYPES.has(t.v) || t.v === 'char') emit('__i');
        else if (t.v === 'bool' || t.v === 'boolean') emit('!!');
        i++; continue;
      }

      // Casts: (int) x, (float) y
      if (t.v === '(' && isType(toks[i + 1]) && (toks[i + 2]?.v === ')' || (isType(toks[i + 2]) && toks[i + 3]?.v === ')'))) {
        const closeIdx = toks[i + 2].v === ')' ? i + 2 : i + 3;
        const typeWords = toks.slice(i + 1, closeIdx).map(x => x.v);
        const end2 = primaryEnd(closeIdx + 1);
        if (typeWords.some(w => INT_TYPES.has(w)) || typeWords.includes('char')) {
          emit('__i(');
          closeAfter[end2] = (closeAfter[end2] || '') + ')';
        } else if (typeWords.includes('bool') || typeWords.includes('boolean')) {
          emit('!!(');
          closeAfter[end2] = (closeAfter[end2] || '') + ')';
        }
        i = closeIdx + 1; continue;
      }

      // Loops: inject a tick so endless loops can't freeze the phone
      if (t.t === 'id' && (t.v === 'while' || t.v === 'for') && toks[i + 1]?.v === '(') {
        const isDoWhileTail = t.v === 'while' && prev?.v === '}' && doStack.includes(matchOpenOf(i - 1));
        const close = matchClose(toks, i + 1);
        emit(t.v + ' ');
        walk(i + 1, close + 1);
        if (isDoWhileTail) { i = close + 1; continue; }
        const bodyStart = close + 1;
        if (toks[bodyStart]?.v === '{') {
          emit('{ await __tick(); ');
          braceDepth++;
          i = bodyStart + 1; continue;
        }
        if (toks[bodyStart]?.v === ';') { emit('{ await __tick(); }'); i = bodyStart + 1; continue; }
        const se = statementEnd(bodyStart);
        emit('{ await __tick(); ');
        walk(bodyStart, se + 1);
        emit(' }');
        i = se + 1; continue;
      }
      if (t.t === 'id' && t.v === 'do' && toks[i + 1]?.v === '{') {
        doStack.push(i + 1);
        emit('do { await __tick(); ');
        braceDepth++;
        i += 2; continue;
      }

      // Assignment to integer variables keeps integer results
      if (t.t === 'id' && intNames.has(t.v) && prev?.v !== '.' && ASSIGN_OPS.has(toks[i + 1]?.v)) {
        const op = toks[i + 1].v;
        let e = i + 2, d = 0;
        for (; e < end; e++) {
          const v = toks[e].v;
          if ('([{'.includes(v) && toks[e].t === 'op') d++;
          if (')]}'.includes(v) && toks[e].t === 'op') { if (d === 0) break; d--; }
          if ((v === ';' || v === ',') && d === 0) break;
        }
        const rhs = transpileRange(i + 2, e);
        const nm = name(t.v);
        if (op === '=') emit(`${nm} = __i(${rhs})`);
        else emit(`${nm} = __i(${nm} ${op.slice(0, -1)} (${rhs}))`);
        i = e; continue;
      }

      // String.length() → .length
      if (t.v === '.' && toks[i + 1]?.v === 'length' && toks[i + 2]?.v === '(' && toks[i + 3]?.v === ')') {
        emit('.length'); i += 4; continue;
      }
      // F("text") macro
      if (t.t === 'id' && t.v === 'F' && toks[i + 1]?.v === '(' && toks[i + 2]?.t === 'str') {
        emit(toks[i + 2].v); i = matchClose(toks, i + 1) + 1; continue;
      }
      // sizeof(x)
      if (t.t === 'id' && t.v === 'sizeof') { emit('__sizeof'); i++; continue; }

      // Calls that may wait
      if (t.t === 'id' && toks[i + 1]?.v === '(' && prev?.v !== '.' && (userFns.has(t.v) || ASYNC_BUILTINS.has(t.v))) {
        emit('(await ' + name(t.v));
        const c = matchClose(toks, i + 1);
        closeAfter[c] = (closeAfter[c] || '') + ')';
        i++; continue;
      }

      if (t.v === '{' && t.t === 'op') braceDepth++;
      if (t.v === '}' && t.t === 'op') braceDepth--;
      if (t.v === '->') { emit('.'); i++; continue; }
      if (t.v === '::') throw new SketchError('"::" (C++ classes) is not supported in the simulator', t.line);
      if (t.t === 'id' && (t.v === 'goto' || t.v === 'asm')) throw new SketchError(`"${t.v}" is not supported in the simulator`, t.line);

      if (t.t === 'id') emit((prev?.v === '.' ? t.v : name(t.v)) + ' ');
      else if (t.t === 'num' || t.t === 'str') emit(t.v + ' ');
      else emit(t.v === ';' ? ';\n' : t.v === '{' ? '{\n' : t.v === '}' ? '}\n' : t.v + ' ');
      if (closeAfter[i]) { emit(closeAfter[i]); delete closeAfter[i]; }
      i++;
    }
  }
  const doStack = [];
  const matchOpenOf = (closeIdx) => {
    let d = 0;
    for (let k = closeIdx; k >= 0; k--) {
      if (toks[k].v === '}' && toks[k].t === 'op') d++;
      else if (toks[k].v === '{' && toks[k].t === 'op') { d--; if (d === 0) return k; }
    }
    return -1;
  };

  walk(0, toks.length);
  return out.join('');
}
