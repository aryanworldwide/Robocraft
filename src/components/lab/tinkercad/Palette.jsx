import React, { useState } from 'react';
import { LAB_COMPONENTS, PALETTE_CATEGORIES } from '@/lib/lab/labComponents';
import { ChevronDown, Search } from 'lucide-react';
import { PartThumb } from '@/components/lab/art/PartArt';

export default function Palette({ onAdd }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState({});

  const filtered = PALETTE_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(type => {
      const c = LAB_COMPONENTS[type];
      if (!c) return false;
      if (!query) return true;
      return c.name.toLowerCase().includes(query.toLowerCase()) || type.toLowerCase().includes(query.toLowerCase());
    }),
  })).filter(cat => cat.items.length > 0);

  const toggle = (name) => setOpen(o => ({ ...o, [name]: o[name] === false ? true : false }));

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2.5 border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Components</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search components…"
            className="w-full glass rounded-lg pl-8 pr-2 py-1.5 text-[11px] outline-none border border-border focus:border-cyan-500/40 transition-colors" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map(cat => {
          const isOpen = query ? true : (open[cat.name] !== false);
          return (
            <div key={cat.name}>
              <button onClick={() => toggle(cat.name)} className="flex items-center gap-1 px-1 mb-1 w-full">
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{cat.name}</span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-2 gap-1.5">
                  {cat.items.map(type => {
                    const c = LAB_COMPONENTS[type];
                    return (
                      <div key={type} draggable onDragStart={e => { e.dataTransfer.setData('lab/type', type); e.dataTransfer.effectAllowed = 'copy'; }}
                        onClick={() => onAdd?.(type)}
                        className="glass rounded-lg p-1.5 cursor-grab hover:bg-cyan-500/10 active:cursor-grabbing transition-colors select-none border border-border">
                        <div className="flex flex-col items-center gap-1">
                          <PartThumb type={type} size={52} />
                          <span className="text-[10px] font-medium leading-tight text-center">{c.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-4">No matches.</p>}
      </div>
      <div className="px-3 py-2 border-t border-border text-[10px] text-muted-foreground">
        Drag onto canvas · or tap to add
      </div>
    </div>
  );
}
