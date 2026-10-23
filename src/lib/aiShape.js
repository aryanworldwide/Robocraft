// A language model returns JSON that is *usually* the right shape. Once in a
// while a list comes back as a single string, or an object, or null — and
// `thing.map is not a function` takes the whole screen down. Everything the UI
// treats as a list goes through here first.

export const asList = (v) => {
  if (Array.isArray(v)) return v.filter(x => x !== null && x !== undefined && x !== '');
  if (v === null || v === undefined || v === '') return [];
  if (typeof v === 'string') {
    // "1. do this\n2. do that" or "a; b; c" → separate steps.
    const lines = v.split(/\r?\n+/).map(s => s.replace(/^\s*[-*•]?\s*\d*[.)]?\s*/, '').trim()).filter(Boolean);
    return lines.length > 1 ? lines : [v.trim()];
  }
  if (typeof v === 'object') return Object.values(v).filter(Boolean);
  return [v];
};

export const asText = (v) => {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.map(asText).join('\n');
  return String(v);
};

const LIST_FIELDS = [
  'components', 'pinConnections', 'buildSteps', 'testingChecklist',
  'troubleshooting', 'safetyTips', 'learningOutcomes', 'extensions',
  'materials', 'steps', 'tips', 'concepts', 'tools',
];
const TEXT_FIELDS = ['arduinoCode', 'esp32Code', 'pythonCode', 'code', 'description', 'summary', 'title', 'name'];

// Returns a project object the views can render without defensive checks.
export function normalizeProject(p) {
  if (!p || typeof p !== 'object') return null;
  const out = { ...p };
  for (const f of LIST_FIELDS) if (f in out) out[f] = asList(out[f]);
  for (const f of TEXT_FIELDS) if (f in out) out[f] = asText(out[f]);
  // Rows the tables read must be objects; a bare string becomes a labelled row
  // rather than being dropped, and existing fields are left untouched.
  out.pinConnections = (out.pinConnections || []).map((c) => (
    c && typeof c === 'object' ? c : { component: asText(c), pin: '', wireColor: '' }
  ));
  out.components = (out.components || []).map((c) => (
    c && typeof c === 'object' ? c : { name: asText(c), quantity: 1 }
  ));
  return out;
}
