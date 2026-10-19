import React, { useState, useRef, useEffect } from 'react';
import { backend } from '@/api/client';
import { ChevronLeft, Clock, IndianRupee, Package, Wrench, BookOpen, Code2, FlaskConical, AlertTriangle, Globe, Lightbulb, Save, CheckCircle2, Share2, Copy, Check, Download, Send, Bot, Loader2, Volume2, ChevronDown, FileText, Eye } from 'lucide-react';
import BuildSheetModal from '@/components/buildsheet/BuildSheetModal';
import { sanitizeCode } from '@/lib/buildsheet/sanitizeCode';

function highlightCode(code) {
  if (!code) return '';
  code = sanitizeCode(code);
  let h = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  h = h.replace(/(\/\/[^\n]*)/g, '<span style="color:#64748b">$1</span>');
  h = h.replace(/(#[^\n]*)/g, '<span style="color:#f97316">$1</span>');
  h = h.replace(/\b(void|int|float|long|for|if|else|return|const|byte|char|boolean|include|define)\b/g, '<span style="color:#a78bfa">$&</span>');
  h = h.replace(/\b(digitalWrite|digitalRead|analogWrite|analogRead|pinMode|delay|delayMicroseconds|Serial|begin|print|println|attach|write|read|pulseIn|map|setup|loop|tone|noTone|Servo|Wire|beginTransmission|requestFrom|available)\b/g, '<span style="color:#00D2FF">$&</span>');
  h = h.replace(/\b(\d+)\b/g, '<span style="color:#fbbf24">$&</span>');
  h = h.replace(/"([^"]*)"/g, '<span style="color:#4ade80">"$1"</span>');
  return h;
}

function CodeBlock({ code, filename }) {
  const [copied, setCopied] = useState(false);
  if (!code || !code.trim()) return <p className="text-xs text-muted-foreground py-4 text-center">No code available for this board.</p>;

  const handleCopy = () => { navigator.clipboard?.writeText(sanitizeCode(code)); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => {
    const blob = new Blob([sanitizeCode(code)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex gap-1.5 mb-2">
        <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] glass px-2.5 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10">
          {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
        <button onClick={handleDownload} className="flex items-center gap-1 text-[10px] glass px-2.5 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10">
          <Download className="w-3 h-3" /> Download
        </button>
      </div>
      <pre className="text-[10px] font-mono leading-relaxed glass rounded-xl p-3 overflow-x-auto bg-black/30" dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
    </div>
  );
}

function Section({ icon: Icon, title, color, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2.5 p-3.5 hover:bg-white/5 transition-colors">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs font-bold flex-1 text-left">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-3.5 pb-3.5 animate-fade-in">{children}</div>}
    </div>
  );
}

export default function GeneratedProjectView({ project, onBack, onSaved, savedProjectId, setSavedProjectId }) {
  const [saved, setSaved] = useState(!!project._savedId);
  const [currentSavedId, setCurrentSavedId] = useState(project._savedId || savedProjectId || null);
  const [completed, setCompleted] = useState(project._isCompleted || false);
  const [shared, setShared] = useState(project._isShared || false);
  const [saving, setSaving] = useState(false);
  const [codeTab, setCodeTab] = useState('arduino');
  const [expandedStep, setExpandedStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showBuildSheet, setShowBuildSheet] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatMessages]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[🤖📦🔌💻📖✨💡]/g, ''));
      u.rate = 0.85; u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    try {
      const record = await backend.entities.GeneratedProject.create({
        user_prompt: project.userPrompt || '',
        project_name: project.name || 'Untitled Project',
        project_data: project,
        difficulty: project.difficulty || 'Beginner',
        is_shared: false,
        is_completed: false,
      });
      setSaved(true);
      setCurrentSavedId(record.id);
      setSavedProjectId?.(record.id);
      onSaved?.();
    } catch {}
    setSaving(false);
  };

  const handleComplete = async () => {
    if (!currentSavedId) return;
    try {
      await backend.entities.GeneratedProject.update(currentSavedId, { is_completed: !completed });
      setCompleted(!completed);
      onSaved?.();
    } catch {}
  };

  const handleShare = async () => {
    if (!currentSavedId) return;
    try {
      await backend.entities.GeneratedProject.update(currentSavedId, { is_shared: true });
      setShared(true);
      onSaved?.();
    } catch {}
  };

  const askMentor = async (q) => {
    if (!q.trim() || chatLoading) return;
    setChatMessages(prev => [...prev, { role: 'user', content: q }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt: `You are RoboMentor, a friendly robotics build mentor. A student is building "${project.name}" (${project.difficulty}). Overview: ${project.overview}. Components: ${(project.components || []).join(', ')}. Build steps: ${(project.buildSteps || []).map((s, i) => `${i + 1}. ${s.title}`).join('; ')}. Student question: "${q}". Answer in simple English, 2-3 sentences, friendly and encouraging.`,
        response_json_schema: { type: 'object', properties: { response: { type: 'string' } } },
      });
      setChatMessages(prev => [...prev, { role: 'assistant', content: res.response || 'Keep going, you can do it! 🤖' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Make sure VCC→5V, GND→GND, and signal pins match the code. You got this! 🤖' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const diffColor = project.difficulty === 'Beginner' ? '#4ADE80' : project.difficulty === 'Intermediate' ? '#FBBF24' : '#EF4444';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 animate-slide-up sticky top-14 z-30 glass-strong rounded-2xl px-3 py-2">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-1.5">
          {saved && <span className="text-[9px] glass px-2 py-0.5 rounded-full text-green-400 flex items-center gap-0.5"><Check className="w-2.5 h-2.5" /> Saved</span>}
          {completed && <span className="text-[9px] glass px-2 py-0.5 rounded-full text-green-400 flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" /> Done</span>}
          {shared && <span className="text-[9px] glass px-2 py-0.5 rounded-full text-cyan-400 flex items-center gap-0.5"><Share2 className="w-2.5 h-2.5" /> Shared</span>}
        </div>
      </div>

      {/* Project header */}
      <div className="glass-strong rounded-3xl p-5 mb-4 animate-slide-up relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 animate-float" style={{ background: diffColor }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${diffColor}20`, color: diffColor }}>{project.difficulty}</span>
            <span className="text-[10px] glass px-2.5 py-1 rounded-full text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {project.estimatedTime}</span>
            <span className="text-[10px] glass px-2.5 py-1 rounded-full text-muted-foreground flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {project.estimatedCost}</span>
          </div>
          <h1 className="text-xl font-bold mb-2 flex items-center gap-2">
            <span className="text-2xl">🤖</span> {project.name}
          </h1>
          <p className="text-sm text-foreground/80 leading-relaxed">{project.overview}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4 animate-slide-up">
        {!saved ? (
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 hover:neon-glow transition-all">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} {saving ? 'Saving...' : 'Save Project'}
          </button>
        ) : (
          <button onClick={handleComplete}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${completed ? 'glass text-green-400' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> {completed ? 'Completed' : 'Mark Complete'}
          </button>
        )}
        {saved && (
          <button onClick={handleShare} disabled={shared}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${shared ? 'glass text-cyan-400' : 'glass text-cyan-400 hover:bg-cyan-500/10'}`}>
            <Share2 className="w-3.5 h-3.5" /> {shared ? 'Shared' : 'Share'}
          </button>
        )}
        <button onClick={() => setShowBuildSheet(true)}
          className="px-4 py-2.5 rounded-xl glass text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-500/10 transition-colors">
          <Eye className="w-3.5 h-3.5" /> Build Sheet
        </button>
      </div>

      {/* Components & Tools */}
      <Section icon={Package} title="Required Components" color="#00D2FF" defaultOpen>
        <div className="flex flex-wrap gap-1.5">
          {(project.components || []).map((c, i) => (
            <span key={i} className="text-[10px] glass px-2.5 py-1.5 rounded-full text-cyan-400">{c}</span>
          ))}
        </div>
        {(project.tools || []).length > 0 && (
          <>
            <h4 className="text-[10px] font-bold text-muted-foreground mt-3 mb-2 flex items-center gap-1"><Wrench className="w-3 h-3" /> Required Tools</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.map((t, i) => (
                <span key={i} className="text-[10px] glass px-2.5 py-1.5 rounded-full text-orange-400">{t}</span>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* Build Steps */}
      <div className="mt-3">
        <Section icon={BookOpen} title="Step-by-Step Build Guide" color="#4ADE80" defaultOpen>
          <div className="space-y-2">
            {(project.buildSteps || []).map((step, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button onClick={() => setExpandedStep(expandedStep === i ? -1 : i)}
                  className="w-full flex items-center gap-2.5 p-2.5 hover:bg-white/5 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-green-500/15 flex items-center justify-center text-[10px] font-bold text-green-400 flex-shrink-0">{i + 1}</span>
                  <span className="text-xs font-medium flex-1 text-left">{step.title}</span>
                  <Volume2 onClick={(e) => { e.stopPropagation(); speak(step.title + '. ' + step.description); }} className="w-3.5 h-3.5 text-cyan-400 hover:scale-110 transition-transform flex-shrink-0" />
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedStep === i ? 'rotate-180' : ''}`} />
                </button>
                {expandedStep === i && (
                  <p className="px-2.5 pb-2.5 pl-11 text-xs text-foreground/80 leading-relaxed animate-fade-in">{step.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Code */}
      <div className="mt-3">
        <Section icon={Code2} title="Source Code" color="#00D2FF" defaultOpen>
          {project.esp32Code && project.esp32Code.trim() ? (
            <div className="flex gap-1.5 mb-2">
              <button onClick={() => setCodeTab('arduino')} className={`text-[10px] px-3 py-1.5 rounded-lg font-bold ${codeTab === 'arduino' ? 'bg-cyan-500/15 text-cyan-400' : 'glass text-muted-foreground'}`}>Arduino</button>
              <button onClick={() => setCodeTab('esp32')} className={`text-[10px] px-3 py-1.5 rounded-lg font-bold ${codeTab === 'esp32' ? 'bg-cyan-500/15 text-cyan-400' : 'glass text-muted-foreground'}`}>ESP32</button>
            </div>
          ) : null}
          <CodeBlock code={codeTab === 'esp32' ? project.esp32Code : project.arduinoCode} filename={`${project.name?.replace(/\s+/g, '_') || 'project'}_${codeTab}.ino`} />
        </Section>
      </div>

      {/* Code Explanation */}
      {project.codeExplanation && (
        <div className="mt-3">
          <Section icon={BookOpen} title="Code Explanation" color="#A78BFA">
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{project.codeExplanation}</p>
          </Section>
        </div>
      )}

      {/* Testing */}
      {project.testingInstructions && (
        <div className="mt-3">
          <Section icon={FlaskConical} title="Testing Instructions" color="#22D3EE">
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{project.testingInstructions}</p>
          </Section>
        </div>
      )}

      {/* Troubleshooting */}
      {project.troubleshooting && (
        <div className="mt-3">
          <Section icon={AlertTriangle} title="Troubleshooting Guide" color="#F97316">
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{project.troubleshooting}</p>
          </Section>
        </div>
      )}

      {/* Real-World Applications */}
      {project.realWorldApplications && (
        <div className="mt-3">
          <Section icon={Globe} title="Real-World Applications" color="#4ADE80">
            <p className="text-xs text-foreground/80 leading-relaxed">{project.realWorldApplications}</p>
          </Section>
        </div>
      )}

      {/* Future Improvements */}
      {project.futureImprovements && (
        <div className="mt-3">
          <Section icon={Lightbulb} title="Future Improvements" color="#FBBF24">
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{project.futureImprovements}</p>
          </Section>
        </div>
      )}

      {/* AI Mentor Chat */}
      <div className="glass-strong rounded-2xl mt-4 flex flex-col animate-slide-up" style={{ height: '300px' }}>
        <div className="flex items-center gap-2 p-3 border-b border-cyan-500/10">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold">AI Build Mentor</h3>
            <span className="text-[9px] text-green-400">● Ask me anything about this build</span>
          </div>
        </div>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatMessages.length === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground mb-3">Hi! I'm your AI mentor 🤖</p>
              <div className="flex flex-col gap-1.5">
                {['Why do I need a motor driver?', 'Explain this more simply', 'What if it doesn\'t work?'].map(q => (
                  <button key={q} onClick={() => askMentor(q)}
                    className="text-[10px] glass rounded-lg px-3 py-1.5 text-cyan-400 hover:bg-cyan-500/10 transition-colors">{q}</button>
                ))}
              </div>
            </div>
          )}
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${m.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'glass text-foreground/90'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-3 py-2 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                <span className="text-[10px] text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-2 border-t border-cyan-500/10 flex gap-1.5">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askMentor(chatInput)}
            placeholder="Ask your mentor..." className="flex-1 glass rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50" />
          <button onClick={() => askMentor(chatInput)} disabled={!chatInput.trim() || chatLoading}
            className="w-8 h-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center disabled:opacity-40">
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {showBuildSheet && (
        <BuildSheetModal
          project={project}
          projectType="ai"
          onClose={() => setShowBuildSheet(false)}
        />
      )}
    </div>
  );
}