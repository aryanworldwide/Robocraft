import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import {
  getConceptIntro, getHowItWorks, getKeyPoints, getEngineeringInsight,
  getCommonMistake, getExamPoint, getThinkingQuestion, getTakeaway,
} from '@/lib/lesson/parseTheory';
import { generateFlashCards } from '@/lib/curriculum/flashcardData';
import { getMode } from '@/lib/adaptive';
import { exportLessonRevisionPdf } from '@/lib/revision/exportRevisionPdf';
import LessonInteractives from '@/components/lesson/LessonInteractives';
import ExplainDifferently from '@/components/lesson/ExplainDifferently';
import {
  BookOpen, Lightbulb, Wrench, Globe, AlertTriangle, BrainCircuit,
  CheckCircle2, Layers, FileText, Download, ChevronDown, ChevronUp,
  Zap, Clock, Eye, Compass, Sparkles, ArrowRight, Check, X,
} from 'lucide-react';

function SectionCard({ icon: Icon, color, label, children, delay = 0 }) {
  return (
    <div className="glass-strong rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>{label}</h3>
      </div>
      {children}
    </div>
  );
}

function Expandable({ title, children, color = '#00D2FF', defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3 hover:bg-cyan-500/5 transition-colors text-left">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-sm flex-1 font-medium">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-3 pb-3 text-sm text-foreground/85 leading-relaxed animate-fade-in">{children}</div>}
    </div>
  );
}

function QuickCheck({ quiz, color }) {
  const [picked, setPicked] = useState({});
  if (!quiz.length) return null;
  return (
    <div className="space-y-3">
      {quiz.map((q, i) => (
        <div key={i} className="glass rounded-xl p-3">
          <p className="text-sm font-medium mb-2">{i + 1}. {q.q}</p>
          <div className="grid gap-1.5">
            {q.options.map((opt, oi) => {
              const isPicked = picked[i] === oi;
              const isAnswer = oi === q.answer;
              const show = picked[i] !== undefined;
              return (
                <button key={oi} disabled={show} onClick={() => setPicked({ ...picked, [i]: oi })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-all ${
                    show ? (isAnswer ? 'bg-green-500/15 text-green-400' : isPicked ? 'bg-red-500/15 text-red-400' : 'opacity-50') : 'glass hover:bg-cyan-500/10'
                  }`}>
                  {show && isAnswer && <Check className="w-3.5 h-3.5" />}
                  {show && isPicked && !isAnswer && <X className="w-3.5 h-3.5" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          {picked[i] !== undefined && (
            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{q.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function Thinking({ question, color }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <p className="text-sm text-foreground/90 leading-relaxed mb-3">{question}</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="text-xs glass px-3 py-2 rounded-lg text-cyan-400 font-medium hover:bg-cyan-500/10">
          Reveal a hint →
        </button>
      ) : (
        <div className="glass rounded-lg p-3 text-xs text-muted-foreground leading-relaxed animate-fade-in">
          Think about which component, signal, or assumption could break — then how you would test it. Discuss with your mentor or use <strong className="text-violet-400">Ask Why</strong> below.
        </div>
      )}
    </div>
  );
}

export default function LessonExperience({ lesson, quizQuestions, color, onComplete, onOpenFlashcards }) {
  const navigate = useNavigate();
  const { selectedClass } = useApp();
  const engineering = getMode(selectedClass) === 'engineering';

  const concept = getConceptIntro(lesson);
  const howItWorks = getHowItWorks(lesson);
  const keyPoints = getKeyPoints(lesson);
  const insight = getEngineeringInsight(lesson);
  const mistake = getCommonMistake(lesson);
  const examPoint = getExamPoint(lesson);
  const thinking = getThinkingQuestion(lesson);
  const takeaway = getTakeaway(lesson);
  const flashCards = generateFlashCards(lesson).slice(0, 5);
  const quickCheck = quizQuestions.filter(q => q.type === 'mcq').slice(0, 3);

  const [fiveMin, setFiveMin] = useState(false);
  const [deepDive, setDeepDive] = useState(false);

  // Python/Computing lessons show code as their examples — label them honestly.
  const isCodeExample = /python|programming|computing|artificial intelligence/i.test(lesson.subject) &&
    (lesson.examples || []).some(e => /[={};[\]]|print\(|input\(|def |\/\/|;/g.test(e));
  const examplesLabel = isCodeExample ? 'Code Example' : 'Real Robot Example';

  return (
    <div className="space-y-4">
      {/* Quick-access toggles */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => { setFiveMin(!fiveMin); setDeepDive(false); }}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${fiveMin ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white neon-glow' : 'glass text-green-400'}`}>
          <Zap className="w-4 h-4" /> 5 Minute Learn
        </button>
        <button onClick={() => { setDeepDive(!deepDive); setFiveMin(false); }}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${deepDive ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white neon-glow' : 'glass text-violet-400'}`}>
          <Compass className="w-4 h-4" /> Deep Dive
        </button>
      </div>

      {/* 5 Minute Learn — condensed */}
      {fiveMin && (
        <div className="glass-strong rounded-2xl p-5 border-l-2 border-green-500 animate-fade-in space-y-4">
          <h3 className="text-sm font-bold text-green-400 flex items-center gap-2"><Zap className="w-4 h-4" /> 5 Minute Learn</h3>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Core Concept</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{concept}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Simple Explanation</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{takeaway}</p>
          </div>
          {(lesson.examples || []).length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{isCodeExample ? 'Code Example' : 'Real-World Example'}</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{lesson.examples[0]}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Engineering Insight</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{insight}</p>
          </div>
          {quickCheck.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">3-Question Check</p>
              <QuickCheck quiz={quickCheck} color={color} />
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Key Takeaways</p>
            <div className="space-y-1.5">
              {keyPoints.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" /><span className="text-sm text-foreground/85">{p}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deep Dive — more technical */}
      {deepDive && (
        <div className="glass-strong rounded-2xl p-5 border-l-2 border-violet-500 animate-fade-in space-y-3">
          <h3 className="text-sm font-bold text-violet-400 flex items-center gap-2"><Compass className="w-4 h-4" /> Deep Dive</h3>
          {howItWorks.map((sec, i) => (
            <Expandable key={i} title={sec.heading || `Detail ${i + 1}`} color="#A78BFA" defaultOpen={i === 0}>
              {sec.paragraphs.map((p, j) => <p key={j} className="mb-2 last:mb-0">{p}</p>)}
              {sec.bullets.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {sec.bullets.map((b, j) => <li key={j} className="flex gap-2"><span className="text-violet-400">•</span><span>{b}</span></li>)}
                </ul>
              )}
            </Expandable>
          ))}
          {mistake && (
            <div className="glass rounded-xl p-3 border-l-2 border-yellow-500">
              <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-1">Common Mistake</p>
              <p className="text-sm text-foreground/85">{mistake}</p>
            </div>
          )}
          <div className="glass rounded-xl p-3 border-l-2 border-cyan-500">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">Exam Point</p>
            <p className="text-sm text-foreground/85">{examPoint}</p>
          </div>
        </div>
      )}

      {/* Main progressive experience */}
      {!fiveMin && !deepDive && (
        <>
          {/* CONCEPT */}
          <SectionCard icon={BookOpen} color={color} label={engineering ? 'Concept' : 'What Is It?'} delay={0.02}>
            <p className="text-sm text-foreground/90 leading-relaxed">{concept}</p>
          </SectionCard>

          {/* VISUALIZE IT */}
          <LessonInteractives lesson={lesson} />

          {/* HOW IT WORKS */}
          {howItWorks.length > 0 && (
            <SectionCard icon={Wrench} color="#0EA5E9" label="How It Works" delay={0.04}>
              <div className="space-y-2">
                {howItWorks.slice(0, 5).map((sec, i) => (
                  <Expandable key={i} title={sec.heading || `Step ${i + 1}`} color={color} defaultOpen={i === 0}>
                    {sec.paragraphs.map((p, j) => <p key={j} className="mb-2 last:mb-0">{p}</p>)}
                    {sec.bullets.length > 0 && (
                      <ul className="space-y-1 mt-2">
                        {sec.bullets.map((b, j) => <li key={j} className="flex gap-2"><span className="text-cyan-400">•</span><span>{b}</span></li>)}
                      </ul>
                    )}
                  </Expandable>
                ))}
              </div>
            </SectionCard>
          )}

          {/* REAL ROBOT EXAMPLE */}
          {(lesson.examples || []).length > 0 && (
            <SectionCard icon={Globe} color="#22C55E" label={examplesLabel} delay={0.06}>
              <div className="space-y-2">
                {lesson.examples.slice(0, 3).map((ex, i) => (
                  <p key={i} className="text-sm text-foreground/90 leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />{ex}
                  </p>
                ))}
              </div>
            </SectionCard>
          )}

          {/* ENGINEERING INSIGHT */}
          <SectionCard icon={BrainCircuit} color="#A78BFA" label={engineering ? 'Engineering Insight' : 'Pro Insight'} delay={0.08}>
            <p className="text-sm text-foreground/90 leading-relaxed">{insight}</p>
          </SectionCard>

          {/* COMMON MISTAKE */}
          {mistake && (
            <div className="glass-strong rounded-2xl p-4 border-l-2 border-yellow-500 animate-slide-up" style={{ animationDelay: '0.09s' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">Common Mistake</h3>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{mistake}</p>
            </div>
          )}

          {/* WHY IT MATTERS (engineering) */}
          {engineering && (
            <SectionCard icon={Sparkles} color="#00D2FF" label="Why This Matters" delay={0.1}>
              <p className="text-sm text-foreground/90 leading-relaxed">{takeaway}</p>
            </SectionCard>
          )}

          {/* TRY THINKING */}
          <SectionCard icon={Lightbulb} color="#F59E0B" label="Try Thinking" delay={0.11}>
            <Thinking question={thinking} color={color} />
          </SectionCard>

          {/* QUICK CHECK */}
          {quickCheck.length > 0 && (
            <SectionCard icon={CheckCircle2} color={color} label="Quick Check" delay={0.12}>
              <QuickCheck quiz={quickCheck} color={color} />
            </SectionCard>
          )}

          {/* KEY TAKEAWAYS */}
          {keyPoints.length > 0 && (
            <SectionCard icon={Layers} color="#22C55E" label="Key Takeaways" delay={0.13}>
              <div className="space-y-2">
                {keyPoints.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground/90">{p}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* EXPLAIN DIFFERENTLY (AI) */}
          <ExplainDifferently lesson={lesson} />

          {/* FLASHCARDS + QUIZ + REVISION row */}
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => (onOpenFlashcards ? onOpenFlashcards() : navigate(`/quiz/${lesson.id}`))} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:neon-glow transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center"><Layers className="w-4 h-4 text-purple-400" /></div>
              <span className="text-[10px] font-medium text-center leading-tight">Flashcards<br /><span className="text-muted-foreground">{flashCards.length}</span></span>
            </button>
            {quizQuestions.length > 0 && (
              <button onClick={() => navigate(`/quiz/${lesson.id}`)} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:neon-glow transition-all">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-cyan-400" /></div>
                <span className="text-[10px] font-medium text-center leading-tight">Full Quiz<br /><span className="text-muted-foreground">{quizQuestions.length} Qs</span></span>
              </button>
            )}
            <button onClick={() => exportLessonRevisionPdf(selectedClass, lesson)} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:neon-glow transition-all">
              <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center"><Download className="w-4 h-4 text-green-400" /></div>
              <span className="text-[10px] font-medium text-center leading-tight">Revision<br /><span className="text-muted-foreground">PDF</span></span>
            </button>
          </div>

          {/* REVISION block */}
          <SectionCard icon={FileText} color="#22C55E" label="Revision" delay={0.15}>
            <div className="glass rounded-xl p-3 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Quick Revision</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{takeaway}</p>
              {examPoint !== takeaway && (
                <p className="text-xs text-muted-foreground mt-2"><strong className="text-cyan-400">Exam point:</strong> {examPoint}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate('/revision')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:neon-glow transition-all">
                <BrainCircuit className="w-4 h-4" /> Revision Mode
              </button>
              <button onClick={() => exportLessonRevisionPdf(selectedClass, lesson)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl glass text-green-400 text-xs font-bold hover:bg-green-500/10 transition-colors">
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}