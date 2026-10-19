// Strips HTML/CSS tags, markdown artifacts, and formatting noise from Arduino/C++ code.
// CRITICAL: only strips KNOWN HTML tags + tags carrying style/class attributes, so valid
// C++ angle-bracket constructs like #include <Servo.h> or Vector<int> are preserved.

const HTML_TAGS = [
  'span','div','font','pre','code','p','br','b','i','em','strong','mark','small',
  'sub','sup','u','s','strike','label','a','ul','ol','li','table','tr','td','th',
  'tbody','thead','style','script','svg','g','path','rect','circle','text','tspan',
  'h1','h2','h3','h4','h5','h6','section','article','header','footer','main','nav',
  'aside','figure','figcaption','blockquote','q','cite','abbr','time','del','ins',
  'button','input','form','select','option','textarea','img','video','audio','source',
  'canvas','div','span','center','nobr','wbr','details','summary','dialog','data',
];

export function sanitizeCode(code) {
  if (!code || typeof code !== 'string') return '';

  let clean = code;

  // Remove markdown code fences (```cpp, ```c++, ```arduino, ```)
  clean = clean.replace(/```[\w]*\n?/g, '');
  clean = clean.replace(/```/g, '');

  // Loop: decode HTML entities then strip HTML formatting tags — repeated until stable.
  // This catches single AND double-escaped HTML from AI responses.
  let prev;
  let iterations = 0;
  do {
    prev = clean;
    iterations++;
    // Decode HTML entities (so &lt;span&gt; becomes <span>)
    clean = clean.replace(/&lt;/g, '<');
    clean = clean.replace(/&gt;/g, '>');
    clean = clean.replace(/&quot;/g, '"');
    clean = clean.replace(/&#0?39;/g, "'");
    clean = clean.replace(/&apos;/g, "'");
    clean = clean.replace(/&nbsp;/g, ' ');
    clean = clean.replace(/&ensp;/g, ' ');
    clean = clean.replace(/&emsp;/g, ' ');
    clean = clean.replace(/&thinsp;/g, ' ');
    clean = clean.replace(/&amp;/g, '&');
    clean = clean.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
    clean = clean.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));

    // Strip HTML tags that carry style/class attributes (definitely HTML, not C++)
    clean = clean.replace(/<\/?[a-zA-Z][^>]*\b(?:style|class)\s*=\s*[^>]*>/gi, '');

    // Strip known HTML tag names (with optional attributes) — leaves <Servo.h>, <int>, etc. intact
    const tagAlt = HTML_TAGS.join('|');
    clean = clean.replace(new RegExp(`</?(?:${tagAlt})\\b[^>]*>`, 'gi'), '');

    // Strip standalone <br> variants that have no closing slash
    clean = clean.replace(/<br\s*\/?>/gi, '');
  } while (clean !== prev && iterations < 6);

  // Remove leftover CSS / style declarations that may have leaked through
  clean = clean.replace(/style\s*=\s*"[^"]*"/gi, '');
  clean = clean.replace(/class\s*=\s*"[^"]*"/gi, '');
  clean = clean.replace(/style\s*=\s*'[^']*'/gi, '');
  clean = clean.replace(/color\s*:\s*#[0-9a-fA-F]{3,8}\s*;?/gi, '');
  clean = clean.replace(/background(?:-color)?\s*:\s*[^;}\n]+;?/gi, '');
  clean = clean.replace(/font(?:-weight|-family|-size|-style)?\s*:\s*[^;}\n]+;?/gi, '');
  clean = clean.replace(/text-decoration\s*:\s*[^;}\n]+;?/gi, '');
  clean = clean.replace(/margin\s*:\s*[^;}\n]+;?/gi, '');
  clean = clean.replace(/padding\s*:\s*[^;}\n]+;?/gi, '');
  clean = clean.replace(/display\s*:\s*[^;}\n]+;?/gi, '');
  clean = clean.replace(/border\s*:\s*[^;}\n]+;?/gi, '');

  // Remove stray CSS-like fragments without tags (e.g. orphaned "color:#97316")
  clean = clean.replace(/[#]?[a-z-]+\s*:\s*#[0-9a-fA-F]{3,8}\s*;?/gi, '');

  // Remove JSON-ish wrappers if the AI wrapped code in { "code": "..." }
  clean = clean.replace(/^\s*\{\s*["']?(?:code|arduinoCode|esp32Code|sketch)["']?\s*:\s*["']/i, '');
  clean = clean.replace(/["']\s*,?\s*\}\s*$/, '');

  // Remove zero-width / BOM characters
  clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Normalize whitespace: trim trailing spaces per line, collapse 3+ blank lines
  clean = clean.split('\n').map(l => l.replace(/\s+$/, '')).join('\n');
  clean = clean.replace(/\n{3,}/g, '\n\n');

  return clean.trim();
}

// Validates that code looks like real Arduino C++ (not corrupted with HTML)
export function isCodeClean(code) {
  if (!code) return true;
  const htmlTagPattern = /<\/?(?:span|div|font|pre|code|p|b|i|em|strong|mark|style|script|svg|g|path|rect|circle|text|tspan|label|a|ul|ol|li|table|tr|td|th|tbody|thead|h1|h2|h3|section|article|header|footer|button|input|form|select|option|center)\b[^>]*>/i;
  const cssPattern = /(?:color|background|font-weight|text-decoration)\s*:\s*#/i;
  const styleAttr = /\bstyle\s*=\s*["'][^"']*/i;
  return !htmlTagPattern.test(code) && !cssPattern.test(code) && !styleAttr.test(code);
}

// Basic Arduino code validation — checks for common syntax markers
export function validateArduinoCode(code) {
  if (!code || typeof code !== 'string') return { valid: false, issues: ['No code provided'] };
  const issues = [];

  // Must have setup() and/or loop() — relaxed: some library code may omit one
  if (!/void\s+setup\s*\(|void\s+loop\s*\(/i.test(code)) {
    if (/\bpinMode\b|\bdigitalWrite\b|\bdelay\b/i.test(code)) {
      if (!/void\s+setup\s*\(/i.test(code)) issues.push('Missing setup() function');
      if (!/void\s+loop\s*\(/i.test(code)) issues.push('Missing loop() function');
    }
  }

  // Check balanced braces
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (Math.abs(openBraces - closeBraces) > 1) issues.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);

  // Check for HTML contamination
  if (!isCodeClean(code)) {
    if (/<\/?[a-z][\s\S]*?>/i.test(code)) issues.push('Code contains HTML tags');
    if (/color\s*:\s*#/i.test(code)) issues.push('Code contains CSS styling');
  }

  return { valid: issues.length === 0, issues };
}