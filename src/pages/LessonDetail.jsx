import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportButton from '@/components/ReportButton';
import { useApp } from '@/lib/AppContext';
import { getLesson, getQuizForLesson, findLessonAnywhere } from '@/lib/curriculum';
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
import TextbookNotes from '@/components/lesson/TextbookNotes';
import ExamCorner from '@/components/lesson/ExamCorner';
import { getTextbook } from '@/lib/curriculum/textbook';
import { isPro } from '@/lib/uiMode';
import { topicsForLesson } from '@/lib/problems';
import ProblemSolver from '@/components/problems/ProblemSolver';
import { exportLessonRevisionPdf } from '@/lib/revision/exportRevisionPdf';
import { toast } from '@/components/ui/use-toast';
import { useInk } from '@/lib/ui/ink';

export default function LessonDetail() {
  const ink = useInk();
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedClass, selectClass, getProgressForClass, markLessonComplete, toggleBookmark, addRecentlyViewed, saveNote, recordFlashcardReview, recordActivityComplete } = useApp();
  const progress = getProgressForClass(selectedClass);
  const lesson = useMemo(() => getLesson(selectedClass, id), [selectedClass, id]);
  const quizQuestions = useMemo(() => getQuizForLesson(selectedClass, id), [selectedClass, id]);
  const book = useMemo(() => getTextbook(id), [id]);
  const pro = isPro(selectedClass);
  const problemTopics = useMemo(() => topicsForLesson(id).filter(t => t.classes.includes(selectedClass)).map(t => t.id), [id, selectedClass]);

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
    // The link may point at a chapter from another class — a shared link, or a
    // bookmark kept from before the student switched. Offer the switch instead
    // of a dead end.
    const elsewhere = findLessonAnywhere(id);
    const classNames = { class_9: 'Class 9', class_10: 'Class 10', class_11: 'Class 11' };
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        {elsewhere ? (
          <>
            <p className="text-muted-foreground">
              “{elsewhere.lesson.title}” is a {classNames[elsewhere.classId] || 'another class'} chapter.
            </p>
            <button
              onClick={() => { selectClass(elsewhere.classId); navigate(`/lesson/${id}`, { replace: true }); }}
              className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-medium"
            >
              Switch to {classNames[elsewhere.classId] || 'that class'} and open it
            </button>
            <div><button onClick={() => navigate('/learn')} className="text-cyan-400 mt-3 text-sm">Back to Learn</button></div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">Lesson not found.</p>
            <button onClick={() => navigate('/learn')} className="text-cyan-400 mt-2">Back to Learn</button>
          </>
        )}
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
    { id: 'read', label: pro ? 'Notes' : 'Read', icon: BookOpen },
    { id: 'listen', label: pro ? 'Audio' : 'Listen', icon: Headphones, hidden: !hasSpeech },
    { id: 'interact', label: pro ? 'Practice' : 'Play', icon: pro ? Target : Gamepad2 },
    { id: 'build', label: pro ? 'Lab' : 'Build', icon: Wrench },
  ].filter(m => !m.hidden);

  const handleComplete = () => {
    if (!completed) {
      markLessonComplete(selectedClass, lesson.id);
      setCompleted(true);
      if (!pro) setShowConfetti(true);
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
      if (!navigator.clipboard) throw new Error('no clipboard');
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
          <button aria-label="Share" onClick={handleShare} className="p-2 rounded-lg transition-colors text-muted-foreground hover:text-cyan-400 tap-target">
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
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${color}20`, color: ink(color, 0.125) }}>
              {lesson.subject}
            </span>
            <span className="text-[10px] glass px-2.5 py-1 rounded-full text-muted-foreground">{lesson.difficulty}</span>
            <span className="text-[10px] glass px-2.5 py-1 rounded-full text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lesson.readingTime} min
            </span>
          </div>
          <h1 className="text-xl font-bold mb-2">{lesson.title}</h1>
          <div className="-mt-1 mb-1"><ReportButton label="Report a mistake in this chapter" context={{ lessonId: lesson.id, classId: selectedClass }} /></div>
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
      <button aria-label="Download" onClick={handleNotesDownload} disabled={notesLoading}
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
          <TextbookNotes book={book} color={color} />
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
          <ExamCorner exam={book?.exam} onPracticed={() => recordActivityComplete(selectedClass, lesson.id, 'exam')} />
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
            {problemTopics.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Numerical practice</p>
                <ProblemSolver topicIds={problemTopics} compact />
              </div>
            )}
            <ExperimentMode lesson={lesson} onComplete={() => recordActivityComplete(selectedClass, lesson.id, 'experiment')} xpReward={40} />

            {flashCards.length > 0 && (
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400">{pro ? 'Recall Cards' : 'Flash Cards'}</span>
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

            {pro ? null : matchPairs.length >= 4 ? (
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

            {!pro && fillBlankQuestions.length > 0 && (
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
            <LessonLabLinks lessonId={lesson.id} />
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
      <button aria-label="Mark done"
        onClick={handleComplete}
        disabled={completed}
        className={`w-full py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
          completed ? 'bg-green-500/15 text-green-400 cursor-default' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:neon-glow ' + (pro ? '' : 'animate-pulse-glow')
        }`}
      >
        {pro
          ? (completed ? <><CheckCircle2 className="w-5 h-5" /> Chapter done</> : <><CheckCircle2 className="w-5 h-5" /> Mark chapter as done</>)
          : (completed ? <><CheckCircle2 className="w-5 h-5" /> Lesson Completed (+50 XP)</> : <><Trophy className="w-5 h-5" /> Complete Lesson (+50 XP)</>)}
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

const LAB_LINKS = {
  c9_r_11: [['/arena?task=free', 'Drive a robot in the 3D arena']], c9_r_12: [['/mechanisms', 'Play with linkages & joints']],
  c9_proj_1: [['/arena?task=line', 'Code a line follower (3D arena)']], c9_proj_2: [['/arena?task=obstacle', 'Code an obstacle avoider (3D arena)']],
  c10_r_7: [['/arena?task=edge', 'Edge-detector robot'], ['/lab', 'Wire sensors in Circuit Lab']], c10_r_9: [['/arena?task=line', 'Program a controller: line follower']],
  c10_r_10: [['/arena?task=obstacle', 'Sensors + motors: obstacle avoider'], ['/arena?task=bin', 'Smart waste bin']],
  c10_r_11: [['/design', 'Model parts in the 3D Design Studio']], c10_r_12: [['/mechanisms', 'Mechanism Lab: gears & linkages']],
  c11_m_4: [['/mechanisms', 'Four-bar & slider-crank simulator']], c11_m_5: [['/design', 'Build a 3D model']], c11_m_6: [['/mechanisms', '2R arm: forward & inverse kinematics']],
  c11_e_1: [['/mechanisms', 'Gear trains: speed vs torque']], c11_e_2: [['/arena?task=edge', 'Sensors on a real robot (3D arena)']], c11_e_6: [['/arena?task=pid', 'Tune a PID line follower']],
};
function LessonLabLinks({ lessonId }) {
  const navigate = useNavigate();
  const links = LAB_LINKS[lessonId];
  if (!links) return null;
  return (
    <div className="glass-strong rounded-2xl p-3 mb-3">
      <p className="text-[11px] font-bold text-cyan-400 mb-2">Try it yourself</p>
      <div className="flex flex-wrap gap-2">
        {links.map(([to, label]) => (
          <button key={to + label} onClick={() => navigate(to)} className="px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 text-xs font-semibold">{label} →</button>
        ))}
      </div>
    </div>
  );
}
