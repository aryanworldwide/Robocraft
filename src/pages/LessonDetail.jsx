import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getLesson, getQuizForLesson } from '@/lib/curriculum';
import { generateFlashCards, generateMatchGame, generateArrangeSteps, generateFillBlank, generateDidYouKnow } from '@/lib/curriculum/flashcardData';
import { ArrowLeft, Bookmark, CheckCircle2, Trophy, Share2, BookOpen, Headphones, Gamepad2, Wrench, Clock, Target, Lightbulb, Globe, Edit3, Check, Sparkles, FileText, Download, Loader2 } from 'lucide-react';
import { hasSpeech } from '@/lib/platform';
import MatchGame from '@/components/learning/MatchGame';
import ArrangeSteps from '@/components/learning/ArrangeSteps';
import FillBlank from '@/components/learning/FillBlank';
import Confetti from '@/components/learning/Confetti';
import PodcastPlayer from '@/components/learning/PodcastPlayer';
import AIVoicePlayer from '@/components/learning/AIVoicePlayer';
import BuildWithMe from '@/components/learning/BuildWithMe';
import FlashCardView from '@/components/learning/FlashCardView';
import BackButton from '@/components/BackButton';
import ExplainLike15 from '@/components/learning/ExplainLike15';
import AskWhy from '@/components/learning/AskWhy';
import MemoryHacks from '@/components/learning/MemoryHacks';
import ImConfused from '@/components/learning/ImConfused';
import ChallengeMe from '@/components/learning/ChallengeMe';
import ExperimentMode from '@/components/learning/ExperimentMode';
import PythonRunner from '@/components/learning/PythonRunner';
import { PYTHON_PRACTICE } from '@/lib/curriculum/pythonPractice';
import LessonVideo from '@/components/learning/LessonVideo';
import LessonExperience from '@/components/lesson/LessonExperience';
import { exportLessonRevisionPdf } from '@/lib/revision/exportRevisionPdf';
import { toast } from '@/components/ui/use-toast';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass, markLessonComplete, toggleBookmark, addRecentlyViewed, saveNote, recordFlashcardReview, recordActivityComplete } = useApp();
  const progress = getProgressForClass(selectedClass);
  const lesson = useMemo(() => getLesson(selectedClass, id), [selectedClass, id]);
  const quizQuestions = useMemo(() => getQuizForLesson(selectedClass, id), [selectedClass, id]);

  const [activeMode, setActiveMode] = useState('read');
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [note, setNote] = useState('');
  const [podcastLang, setPodcastLang] = useState('en');
  const [notesLoading, setNotesLoading] = useState(false);

  const handleNotesDownload = async () => {
    if (notesLoading) return;
    setNotesLoading(true);
    try { await exportLessonRevisionPdf(selectedClass, lesson); }
    catch (e) { console.error('Notes PDF failed', e); }
    finally { setNotesLoading(false); }
  };

  useEffect(() => {
    if (lesson) {
      addRecentlyViewed(selectedClass, lesson.id);
      setCompleted(progress.completedLessons.includes(lesson.id));
      setNote(progress.notes?.[lesson.id] || '');
      window.scrollTo(0, 0);
    }
  }, [lesson]);

  const { flashCards, matchPairs, arrangeSteps, fillBlankQuestions, didYouKnow, buildChallengeId, concepts, theoryChunks } = useMemo(() => {
    if (!lesson) return { flashCards: [], matchPairs: [], arrangeSteps: [], fillBlankQuestions: [], didYouKnow: '', buildChallengeId: null, concepts: [], theoryChunks: [] };

    const fc = generateFlashCards(lesson).slice(0, 5);
    const mp = generateMatchGame(lesson, quizQuestions);
    const as = generateArrangeSteps(lesson);
    const fb = generateFillBlank(quizQuestions);
    const dyk = generateDidYouKnow(lesson);

    const isRoboticsSubject = ['Robotics', 'Microcontrollers', 'Mechanical Systems', 'Electrical & Control Systems'].includes(lesson.subject);
    const buildId = lesson.id.includes('sensor') || lesson.id.includes('ultrasonic') ? 'ultrasonic_distance'
      : lesson.id.includes('servo') || lesson.id.includes('motor') ? 'servo_control'
      : isRoboticsSubject ? 'led_blink' : null;

    const chunks = lesson.theory ? lesson.theory.split('\n\n').filter(t => t.trim().length > 20) : [];
    const conceptsList = lesson.keyConcepts || [];

    return { flashCards: fc, matchPairs: mp, arrangeSteps: as, fillBlankQuestions: fb, didYouKnow: dyk, buildChallengeId: buildId, concepts: conceptsList, theoryChunks: chunks };
  }, [lesson, quizQuestions]);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Lesson not found.</p>
        <button onClick={() => navigate('/learn')} className="text-cyan-400 mt-2">Back to Learn</button>
      </div>
    );
  }

  const isBookmarked = progress.bookmarks.includes(lesson.id);
  const subjectColors = { Robotics: '#00D2FF', 'Python Programming': '#4ADE80', 'Artificial Intelligence': '#A78BFA', 'Computing Fundamentals': '#F59E0B', 'Mechanical Systems': '#F97316', Computing: '#F59E0B', Microcontrollers: '#22D3EE', 'Electrical & Control Systems': '#EAB308', Applications: '#EC4899' };
  const color = subjectColors[lesson.subject] || '#00D2FF';

  const getTheoryHeading = (text, concept) => {
    if (concept) return concept;
    const firstLine = text.trim().split('\n')[0];
    const firstSentence = firstLine.split(/(?<=[.!?])\s+/)[0].trim();
    if (firstSentence.length > 3 && firstSentence.length <= 70) return firstSentence;
    if (firstSentence.length > 70) return firstSentence.substring(0, 67) + '...';
    return text.trim().split(/\s+/).slice(0, 6).join(' ') + '...';
  };

  // Hide the Listen tab where speech synthesis is unavailable (Android WebView).
  const modes = [
    { id: 'read', label: 'Read', icon: BookOpen },
    { id: 'listen', label: 'Listen', icon: Headphones, hidden: !hasSpeech },
    { id: 'interact', label: 'Play', icon: Gamepad2 },
    { id: 'build', label: 'Build', icon: Wrench },
  ].filter(m => !m.hidden);

  const handleComplete = () => {
    if (!completed) {
      markLessonComplete(selectedClass, lesson.id);
      setCompleted(true);
      setShowConfetti(true);
    }
  };

  const handleShare = async () => {
    const text = `I'm learning "${lesson.title}" on RoboCraft!`;
    try {
      if (window.Capacitor?.isNativePlatform?.()) {
        const { Share } = await import('@capacitor/share');
        await Share.share({ title: lesson.title, text, dialogTitle: 'Share lesson' });
        return;
      }
      if (navigator.share) { await navigator.share({ title: lesson.title, text, url: window.location.href }); return; }
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied', description: 'Paste it anywhere to share this lesson.' });
    } catch (e) {
      if (e?.name === 'AbortError' || /cancel/i.test(e?.message || '')) return; // user closed the share sheet
      toast({ title: "Couldn't share", description: 'Sharing isn\'t available on this device.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-4">
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 animate-slide-up sticky top-14 z-30 glass-strong rounded-2xl px-3 py-2">
        <BackButton />
        <div className="flex items-center gap-1">
          <button onClick={handleShare} className="p-2 rounded-lg transition-colors text-muted-foreground hover:text-cyan-400">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => toggleBookmark(selectedClass, lesson.id)} className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}>
            <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Lesson cover */}
      <div className="glass-strong rounded-3xl p-5 mb-4 animate-slide-up relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 animate-float" style={{ background: color }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${color}20`, color }}>
              {lesson.subject}
            </span>
            <span className="text-[10px] glass px-2.5 py-1 rounded-full text-muted-foreground">{lesson.difficulty}</span>
            <span className="text-[10px] glass px-2.5 py-1 rounded-full text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lesson.readingTime} min
            </span>
          </div>
          <h1 className="text-xl font-bold mb-2">{lesson.title}</h1>
          {lesson.objectives && lesson.objectives.length > 0 && (
            <div className="text-left mt-3">
              <h3 className="text-[10px] font-bold mb-1.5 flex items-center gap-1 text-muted-foreground"><Target className="w-3 h-3" /> What you'll learn</h3>
              <div className="flex flex-wrap gap-1.5">
                {lesson.objectives.map((obj, i) => (
                  <span key={i} className="text-[10px] glass px-2 py-1 rounded-full text-foreground/80">{obj}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapter notes download — prominent at top */}
      <button onClick={handleNotesDownload} disabled={notesLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass text-green-500 dark:text-green-400 text-xs font-bold mb-4 hover:bg-green-500/10 transition-colors animate-slide-up disabled:opacity-60">
        {notesLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing PDF…</> : <><Download className="w-4 h-4" /> Download Chapter Notes (PDF)</>}
      </button>

      {/* Mode tabs */}
      <div className="grid grid-cols-4 gap-2 mb-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        {modes.map(mode => {
          const Icon = mode.icon;
          const active = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${active ? 'glass-strong neon-glow' : 'glass hover:bg-cyan-500/5'}`}
              style={active ? { borderBottom: `2px solid ${color}` } : {}}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-cyan-400' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-medium ${active ? 'text-cyan-400' : 'text-muted-foreground'}`}>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode content */}
      <div key={activeMode} className="animate-fade-in space-y-4 mb-6">

        {/* READ MODE */}
        {activeMode === 'read' && (
          <>
          <LessonVideo lesson={lesson} />
          <LessonExperience lesson={lesson} quizQuestions={quizQuestions} color={color} onComplete={handleComplete} onOpenFlashcards={() => { setActiveMode('interact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          {PYTHON_PRACTICE[lesson.id] && (
            <PythonRunner
              initialCode={PYTHON_PRACTICE[lesson.id].code}
              initialInput={PYTHON_PRACTICE[lesson.id].input || ''}
              task={PYTHON_PRACTICE[lesson.id].task}
              note={PYTHON_PRACTICE[lesson.id].note}
              storageKey={`py_code_${lesson.id}`}
              onRun={() => recordActivityComplete(selectedClass, lesson.id, 'python')}
            />
          )}
          </>
        )}

        {/* LISTEN MODE */}
        {activeMode === 'listen' && (
          <>
            <PodcastPlayer
              lesson={lesson}
              language={podcastLang}
              onLanguageChange={setPodcastLang}
            />
            <div className="glass-strong rounded-2xl p-4">
              <h3 className="text-xs font-bold mb-2 flex items-center gap-2"><Headphones className="w-4 h-4 text-cyan-400" /> Quick Narration</h3>
              <p className="text-xs text-muted-foreground mb-3">Listen to a summary of this lesson in natural voice.</p>
              <AIVoicePlayer text={lesson.summary || lesson.theory?.substring(0, 500) || lesson.title} title={lesson.title} />
            </div>
          </>
        )}

        {/* INTERACT MODE */}
        {activeMode === 'interact' && (
          <>
            <ExperimentMode lesson={lesson} onComplete={() => recordActivityComplete(selectedClass, lesson.id, 'experiment')} xpReward={40} />

            {flashCards.length > 0 && (
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400">Flash Cards</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{flashcardIdx + 1} / {flashCards.length}</span>
                </div>
                <FlashCardView
                  card={flashCards[flashcardIdx]}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                  onPrev={() => { setFlashcardIdx(Math.max(0, flashcardIdx - 1)); setIsFlipped(false); }}
                  onNext={() => { setFlashcardIdx(Math.min(flashCards.length - 1, flashcardIdx + 1)); setIsFlipped(false); recordFlashcardReview(selectedClass, lesson.id); }}
                  canPrev={flashcardIdx > 0}
                  canNext={flashcardIdx < flashCards.length - 1}
                  totalCards={flashCards.length}
                  currentIdx={flashcardIdx}
                />
              </div>
            )}

            {matchPairs.length >= 4 ? (
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400">Match the Pairs - +30 XP</span>
                </div>
                <MatchGame pairs={matchPairs} onComplete={() => recordActivityComplete(selectedClass, lesson.id, 'match')} xpReward={30} />
              </div>
            ) : arrangeSteps.length > 0 && (
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400">Arrange the Steps - +30 XP</span>
                </div>
                <ArrangeSteps steps={arrangeSteps} onComplete={() => recordActivityComplete(selectedClass, lesson.id, 'arrange')} xpReward={30} />
              </div>
            )}

            {fillBlankQuestions.length > 0 && (
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400">Quick Challenge - +30 XP</span>
                </div>
                <FillBlank questions={fillBlankQuestions} onComplete={() => recordActivityComplete(selectedClass, lesson.id, 'fillblank')} xpReward={30} />
              </div>
            )}

            {quizQuestions.length > 0 && (
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400">Checkpoint Quiz</span>
                </div>
                <button onClick={() => navigate(`/quiz/${lesson.id}`)} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all">
                  Take Quiz ({quizQuestions.length} questions)
                </button>
              </div>
            )}

            <ChallengeMe lesson={lesson} selectedClass={selectedClass} />
          </>
        )}

        {/* BUILD MODE */}
        {activeMode === 'build' && (
          <>
            {buildChallengeId ? (
              <BuildWithMe
                challengeId={buildChallengeId}
                onComplete={() => recordActivityComplete(selectedClass, lesson.id, 'build')}
                xpReward={50}
              />
            ) : (
              <div className="glass-strong rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/15 flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="font-bold text-sm mb-1">No Build Activity</h3>
                <p className="text-xs text-muted-foreground mb-4">This lesson doesn't have a virtual build challenge yet. Check out the Build Lab for more activities!</p>
                <button onClick={() => navigate('/lab')} className="px-4 py-2 rounded-xl glass text-cyan-400 text-sm font-medium hover:bg-cyan-500/10 transition-colors">
                  Open Build Lab
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={completed}
        className={`w-full py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
          completed ? 'bg-green-500/15 text-green-400 cursor-default' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:neon-glow animate-pulse-glow'
        }`}
      >
        {completed ? <><CheckCircle2 className="w-5 h-5" /> Lesson Completed (+50 XP)</> : <><Trophy className="w-5 h-5" /> Complete Lesson (+50 XP)</>}
      </button>

      {/* Chapter Revision — per-chapter notes, quiz, flashcards */}
      <div className="glass-strong rounded-2xl p-5 mt-4 animate-slide-up">
        <h3 className="text-sm font-bold mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-green-400" /> Chapter Revision</h3>
        <p className="text-xs text-muted-foreground mb-4">Review this chapter before your exam.</p>
        <div className={`grid gap-2 ${quizQuestions.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {quizQuestions.length > 0 && (
            <button onClick={() => navigate(`/quiz/${lesson.id}`)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors">
              <CheckCircle2 className="w-4 h-4" /> Start Chapter Quiz
            </button>
          )}
          <button onClick={() => setActiveMode('interact')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass text-purple-400 text-xs font-bold hover:bg-purple-500/10 transition-colors">
            <Sparkles className="w-4 h-4" /> View Flashcards
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 text-center">Downloads only this chapter — not the full syllabus.</p>
      </div>
    </div>
  );
}