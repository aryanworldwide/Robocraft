import React, { useState, useMemo } from 'react';
import { formatClass } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { searchContent } from '@/lib/curriculum';
import { Search as SearchIcon, Clock, ChevronRight, Wrench } from 'lucide-react';

export default function SearchPage() {
  const navigate = useNavigate();
  const { selectedClass } = useApp();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { lessons: [], projects: [] };
    return searchContent(selectedClass, query);
  }, [query, selectedClass]);

  const subjectColors = { Robotics: '#00D2FF', 'Python Programming': '#4ADE80', 'Artificial Intelligence': '#A78BFA', 'Computing Fundamentals': '#F59E0B', 'Mechanical Systems': '#F97316', Computing: '#F59E0B', Microcontrollers: '#22D3EE', 'Electrical & Control Systems': '#EAB308', Applications: '#EC4899' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold gradient-text">Search</h1>
        <p className="text-sm text-muted-foreground">Searching within {formatClass(selectedClass)} curriculum</p>
      </div>

      {/* Search input */}
      <div className="relative animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search lessons, projects, topics..."
          className="w-full glass-strong rounded-2xl pl-12 pr-4 py-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
          autoFocus
        />
      </div>

      {/* Results */}
      {query.trim() && (
        <div className="space-y-4">
          {/* Lessons */}
          {results.lessons.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Lessons ({results.lessons.length})</h2>
              <div className="space-y-2">
                {results.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    className="glass-strong rounded-xl p-3 cursor-pointer hover:neon-glow transition-all flex items-center gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${subjectColors[lesson.subject] || '#00D2FF'}20`, color: subjectColors[lesson.subject] || '#00D2FF' }}>
                          {lesson.subject}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium group-hover:text-cyan-400 transition-colors">{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.readingTime} min</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {results.projects.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Projects ({results.projects.length})</h2>
              <div className="space-y-2">
                {results.projects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="glass-strong rounded-xl p-3 cursor-pointer hover:neon-glow transition-all flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {results.lessons.length === 0 && results.projects.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <SearchIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!query.trim() && (
        <div className="text-center py-16 animate-fade-in">
          <SearchIcon className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Start typing to search lessons and projects</p>
          <p className="text-xs text-muted-foreground mt-1">Only {formatClass(selectedClass)} content will be shown</p>
        </div>
      )}
    </div>
  );
}