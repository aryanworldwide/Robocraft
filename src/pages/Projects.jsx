import React, { useState, useCallback } from 'react';
import { formatClass } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getProjects } from '@/lib/curriculum';
import PullToRefresh from '@/components/PullToRefresh';
import AISearchBar from '@/components/projects/AISearchBar';
import AIGeneratedProjectView from '@/components/projects/AIGeneratedProjectView';
import { generateOrRetrieveProject } from '@/lib/buildsheet/aiProjectSearch';
import { aiEnabled } from '@/lib/features';
import { toast } from '@/components/ui/use-toast';
import { Clock, DollarSign, ChevronRight, Wrench, Filter, Bot, Loader2, Cpu } from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const { selectedClass } = useApp();
  const projects = getProjects(selectedClass);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [generatedProject, setGeneratedProject] = useState(null);

  const handleRefresh = useCallback(async () => {
    await new Promise(r => setTimeout(r, 500));
  }, []);

  const handleGenerate = async (query) => {
    setLoading(true);
    setGeneratedProject(null);
    try {
      // curriculum match (zero AI) → cached DB match (zero AI) → one AI call (cached after)
      const result = await generateOrRetrieveProject(query);
      if (result.type === 'curriculum') {
        navigate(`/project/${result.project.id}`);
        setLoading(false);
        return;
      }
      setGeneratedProject(result.project);
    } catch (err) {
      console.error('Project search failed:', err);
      toast(aiEnabled
        ? { title: "Couldn't create that project", description: 'Please check your internet and try again.' }
        : { title: 'No matching project yet', description: 'The AI project creator is coming soon. Try a shorter search like "line follower" or "servo".' });
    } finally {
      setLoading(false);
    }
  };

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.difficulty === filter);
  const diffColors = { Beginner: '#4ADE80', Intermediate: '#F59E0B', Advanced: '#EF4444' };

  // Show AI-generated project view if one was generated
  if (generatedProject && !loading) {
    return <AIGeneratedProjectView project={generatedProject} onBack={() => setGeneratedProject(null)} />;
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold gradient-text">Projects</h1>
        <p className="text-sm text-muted-foreground">{aiEnabled ? 'Search any robotics project • AI generates instantly' : 'Search the project library'} • {formatClass(selectedClass)}</p>
      </div>

      {/* AI Search Bar */}
      <AISearchBar onGenerate={handleGenerate} loading={loading} />

      {/* AI Loading state */}
      {loading && (
        <div className="glass-strong rounded-3xl p-8 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Bot className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h3 className="font-bold text-sm gradient-text mb-2">AI is designing your project...</h3>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Selecting components · Designing circuit · Writing code · Creating build guide</span>
          </div>
        </div>
      )}

      {/* Filter */}
      {!loading && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                filter === d ? 'glass-strong text-cyan-400 neon-glow' : 'glass text-muted-foreground hover:text-cyan-400'
              }`}
            >
              {d === 'all' ? 'All Projects' : d}
            </button>
          ))}
        </div>
      )}

      {/* Project cards */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="glass-strong rounded-2xl p-5 cursor-pointer hover:scale-[1.02] hover:neon-glow transition-all group animate-slide-up"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${diffColors[project.difficulty]}20`, color: diffColors[project.difficulty] }}>
                  {project.difficulty}
                </span>
              </div>
              <h3 className="font-bold text-sm group-hover:text-cyan-400 transition-colors mb-1">{project.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="glass px-2 py-1 rounded-full text-cyan-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {project.estimatedTime}</span>
                <span className="glass px-2 py-1 rounded-full text-green-400 flex items-center gap-1"><DollarSign className="w-3 h-3" /> {project.estimatedCost}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> {project.components.length} components
                </span>
                <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No projects found for this filter.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try searching above — AI can generate any project!</p>
        </div>
      )}
    </div>
    </PullToRefresh>
  );
}