import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2, X, ChevronRight } from 'lucide-react';
import { getSearchSuggestions } from '@/lib/buildsheet/aiProjectSearch';

export default function AISearchBar({ onSearch, onGenerate, loading }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const suggestions = getSearchSuggestions(query);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;
    onGenerate(query.trim());
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    onGenerate(s);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative animate-slide-up" style={{ animationDelay: '0.02s' }}>
      <div className={`glass-strong rounded-2xl flex items-center gap-2 px-4 py-3 transition-all ${focused ? 'neon-glow border-cyan-500/40' : ''}`}
        style={{ border: '1px solid rgba(0,210,255,0.15)' }}>
        <Search className={`w-4 h-4 flex-shrink-0 transition-colors ${focused ? 'text-cyan-400' : 'text-muted-foreground'}`} />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => { setFocused(true); setShowSuggestions(true); }}
            onBlur={() => setFocused(false)}
            placeholder="🔍 Search any robotics project... (e.g. Bluetooth Car, Smart Dustbin)"
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/60"
            disabled={loading}
          />
        </form>
        {query && !loading && (
          <button onClick={() => { setQuery(''); setShowSuggestions(false); inputRef.current?.focus(); }}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {loading ? (
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
        ) : (
          <button onClick={handleSubmit} disabled={!query.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40 transition-all hover:neon-glow flex-shrink-0">
            <Sparkles className="w-3 h-3" /> Generate
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl overflow-hidden z-40 animate-scale-in shadow-2xl">
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-cyan-500/10">
            {query.trim() ? 'Matching Projects' : 'Popular Projects'}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSuggestionClick(s)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-cyan-500/10 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-xs font-medium text-foreground/90 flex-1">{s}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
          <div className="px-4 py-2 text-[9px] text-muted-foreground border-t border-cyan-500/10">
            ✨ Can't find it? Type your own idea and AI will generate a full project!
          </div>
        </div>
      )}
    </div>
  );
}