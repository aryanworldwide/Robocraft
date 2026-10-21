import React, { useState } from 'react';
import { BookOpenCheck, ChevronDown, ChevronUp } from 'lucide-react';
import RichText from '@/components/lesson/RichText';
import { Diagram } from '@/components/diagrams';

/** Full textbook-style chapter notes: detailed sections with diagrams. */
export default function TextbookNotes({ book, color = '#06b6d4' }) {
  const [open, setOpen] = useState(true);
  if (!book || !(book.sections || []).length) return null;
  const figs = (book.figs || []).filter(f => !(book.sections || []).some(s => (s.b || '').includes(`[fig:${f}`)));
  return (
    <div className="glass-strong rounded-2xl p-5 animate-slide-up">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 text-left">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <BookOpenCheck className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>Textbook Notes</h3>
          <p className="text-[10px] text-muted-foreground">Full chapter explanation with diagrams · {book.sections.length} sections</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="mt-4 space-y-5">
          {figs.length > 0 && <div className="space-y-3">{figs.map(f => <Diagram key={f} name={f} />)}</div>}
          {book.sections.map((s, i) => (
            <section key={i}>
              <h4 className="text-[15px] font-bold mb-2 flex gap-2">
                <span className="text-muted-foreground font-semibold">{i + 1}.</span>{s.h}
              </h4>
              <RichText text={s.b} />
            </section>
          ))}
          {book.glossary && book.glossary.length > 0 && (
            <section>
              <h4 className="text-[15px] font-bold mb-2">Key terms</h4>
              <dl className="grid gap-1.5">
                {book.glossary.map(([term, def], i) => (
                  <div key={i} className="glass rounded-lg px-3 py-2 text-sm">
                    <dt className="font-semibold inline">{term}: </dt><dd className="inline text-foreground/80">{def}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
