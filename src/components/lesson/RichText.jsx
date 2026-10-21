import React from 'react';
import { Diagram } from '@/components/diagrams';

// Renders textbook text. Format:
//   blank line        → new paragraph
//   "• item"          → bullet
//   "1. step"         → numbered line
//   ```  ...  ```     → code block
//   [fig:name]        → a diagram (optional caption: [fig:name|caption])
//   **bold**          → bold
//   Heading:  (a short line ending in ":")  → small heading
function inline(text, keyBase) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={keyBase + i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={keyBase + i} className="px-1 py-0.5 rounded bg-muted text-[0.85em] font-mono">{p.slice(1, -1)}</code>;
    return p;
  });
}

export function parseBlocks(src) {
  const lines = String(src || '').split('\n');
  const blocks = [];
  let para = [], list = null, code = null;
  const flushPara = () => { if (para.length) { blocks.push({ t: 'p', text: para.join(' ') }); para = []; } };
  const flushList = () => { if (list) { blocks.push(list); list = null; } };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (code) {
      if (/^(```|~~~)/.test(line.trim())) { blocks.push({ t: 'code', text: code.join('\n') }); code = null; }
      else code.push(raw);
      continue;
    }
    if (/^(```|~~~)/.test(line.trim())) { flushPara(); flushList(); code = []; continue; }
    const fig = line.trim().match(/^\[fig:([A-Za-z0-9]+)(?:\|(.+))?\]$/);
    if (fig) { flushPara(); flushList(); blocks.push({ t: 'fig', name: fig[1], caption: fig[2] }); continue; }
    if (!line.trim()) { flushPara(); flushList(); continue; }
    const b = line.match(/^\s*[•\-]\s+(.*)$/);
    const n = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (b || n) {
      flushPara();
      const kind = b ? 'ul' : 'ol';
      if (!list || list.t !== kind) { flushList(); list = { t: kind, items: [] }; }
      list.items.push(b ? b[1] : n[2]);
      continue;
    }
    flushList();
    if (line.length < 60 && /:$/.test(line.trim()) && !para.length) { blocks.push({ t: 'h', text: line.trim().replace(/:$/, '') }); continue; }
    para.push(line.trim());
  }
  flushPara(); flushList();
  if (code) blocks.push({ t: 'code', text: code.join('\n') });
  return blocks;
}

export default function RichText({ text, className = '' }) {
  const blocks = parseBlocks(text);
  return (
    <div className={`space-y-2.5 text-sm text-foreground/85 leading-relaxed ${className}`}>
      {blocks.map((b, i) => {
        if (b.t === 'p') return <p key={i}>{inline(b.text, i + '-')}</p>;
        if (b.t === 'h') return <p key={i} className="font-bold text-foreground text-[13px] pt-1">{inline(b.text, i + '-')}</p>;
        if (b.t === 'ul') return (
          <ul key={i} className="space-y-1">
            {b.items.map((it, j) => <li key={j} className="flex gap-2"><span className="text-cyan-500 mt-0.5">•</span><span>{inline(it, `${i}-${j}-`)}</span></li>)}
          </ul>
        );
        if (b.t === 'ol') return (
          <ol key={i} className="space-y-1">
            {b.items.map((it, j) => <li key={j} className="flex gap-2"><span className="text-cyan-500 font-semibold min-w-[1.1rem]">{j + 1}.</span><span>{inline(it, `${i}-${j}-`)}</span></li>)}
          </ol>
        );
        if (b.t === 'code') return <pre key={i} className="text-[12px] font-mono bg-muted/70 rounded-lg p-3 overflow-x-auto whitespace-pre leading-snug">{b.text}</pre>;
        if (b.t === 'fig') return <Diagram key={i} name={b.name} caption={b.caption} />;
        return null;
      })}
    </div>
  );
}

// Plain-text version for PDFs and speech.
export function toPlainText(src) {
  return parseBlocks(src).map(b => {
    if (b.t === 'ul') return b.items.map(x => '- ' + x).join('\n');
    if (b.t === 'ol') return b.items.map((x, j) => `${j + 1}. ${x}`).join('\n');
    if (b.t === 'fig') return '';
    return b.text;
  }).filter(Boolean).join('\n\n').replace(/\*\*/g, '').replace(/`/g, '');
}
