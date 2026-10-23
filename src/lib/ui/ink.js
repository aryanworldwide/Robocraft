import { useMemo } from 'react';
import { useTheme } from '@/lib/ThemeContext';

/**
 * Brand colours in the curriculum data are tuned for the dark theme. Used as
 * text on the light page they land around 1.6-3:1, well under the WCAG AA
 * 4.5:1 minimum. ink() keeps the hue and walks the colour toward black (light
 * theme) or white (dark theme) until it clears the threshold against the
 * surface it will actually sit on.
 */
const PAGE = { light: [247, 248, 250], dark: [20, 26, 42] };
const cache = new Map();

function toRgb(hex) {
  const h = String(hex || '').trim().replace('#', '');
  if (h.length === 3) return [0, 1, 2].map((i) => parseInt(h[i] + h[i], 16));
  if (h.length >= 6) return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return null;
}
const hex2 = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
const toHex = (c) => '#' + c.map(hex2).join('');
const mix = (a, t, b) => a.map((v, i) => v * t + b[i] * (1 - t));

function lum(c) {
  const f = c.map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
}

export function contrast(a, b) {
  const l1 = lum(a), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * @param {string} hex   the brand colour
 * @param {string} theme 'light' | 'dark'
 * @param {number} tint  alpha of a `${hex}20`-style tinted background behind
 *                       the text (0 = the text sits straight on the page)
 * @param {number} need  required ratio (4.5 for body text, 3 for large text)
 */
export function ink(hex, theme = 'light', tint = 0, need = 4.5) {
  const base = toRgb(hex);
  if (!base) return hex;
  const key = hex + '|' + theme + '|' + tint + '|' + need;
  if (cache.has(key)) return cache.get(key);
  const page = PAGE[theme === 'dark' ? 'dark' : 'light'];
  const bg = tint > 0 ? mix(base, tint, page) : page;
  const towards = theme === 'dark' ? [255, 255, 255] : [0, 0, 0];
  let out = theme === 'dark' ? '#f8fafc' : '#0f172a';
  for (let t = 0; t <= 0.96; t += 0.04) {
    const cand = mix(towards, t, base);
    if (contrast(cand, bg) >= need + 0.1) { out = toHex(cand); break; }
  }
  cache.set(key, out);
  return out;
}

/** A fill that can carry white text: darkens the brand colour until white passes. */
export function fillFor(hex, need = 4.5) {
  const base = toRgb(hex);
  if (!base) return hex;
  const white = [255, 255, 255];
  if (contrast(white, base) >= need) return toHex(base);
  for (let t = 0.04; t <= 0.96; t += 0.04) {
    const cand = mix([0, 0, 0], t, base);
    if (contrast(white, cand) >= need + 0.1) return toHex(cand);
  }
  return '#0f172a';
}

/**
 * Hook form: binds ink() to the active theme and re-renders with it.
 *   const ink = useInk();
 *   <span style={{ color: ink(subject.color) }}>…
 *   <span style={{ background: subject.color + '20', color: ink(subject.color, 0.125) }}>…
 */
export function useInk() {
  const ctx = useTheme();
  const theme = ctx?.theme === 'light' ? 'light'
    : ctx?.theme === 'dark' ? 'dark'
    : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  return useMemo(() => {
    const f = (hex, tint = 0, need = 4.5) => ink(hex, theme, tint, need);
    f.theme = theme;
    f.fill = fillFor;
    return f;
  }, [theme]);
}
