// Deterministic, local revision PDF generator — zero AI credits.
// Produces a proper "Last-Minute Revision Book" with real per-topic content
// extracted from the existing curriculum, plus final quick revision,
// important questions, and an exam checklist.
import { downloadFile } from '@/lib/platform';
import { getTextbook } from '@/lib/curriculum/textbook';
import { toPlainText } from '@/components/lesson/RichText';
import { pdfSafe } from '@/lib/exam/paperPdf';

function renderPlain(pdf, text) {
  for (const block of toPlainText(text).split('\n')) {
    const t = pdfSafe(block).trim();
    if (!t) continue;
    if (/^(- |\d+\. )/.test(t)) pdf.bullet(t.replace(/^- /, ''), 9);
    else pdf.body(t, 9.5);
  }
}
import { getSubjects, getQuizForLesson, getAllLessons } from '@/lib/curriculum';
import {
  getConceptIntro, getHowItWorks, getKeyPoints, getEngineeringInsight,
  getCommonMistake, getExamPoint, getThinkingQuestion, getTakeaway,
} from '@/lib/lesson/parseTheory';

function buildTopic(classId, lesson) {
  return {
    title: lesson.title,
    concept: getConceptIntro(lesson),
    howItWorks: getHowItWorks(lesson),
    keyPoints: getKeyPoints(lesson),
    keyConcepts: lesson.keyConcepts || [],
    examples: lesson.examples || [],
    insight: getEngineeringInsight(lesson),
    mistake: getCommonMistake(lesson),
    examPoint: getExamPoint(lesson),
    takeaway: getTakeaway(lesson),
    quiz: getQuizForLesson(classId, lesson.id) || [],
  };
}

// ── PDF helpers ──
async function makeDoc() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 42;
  let y = margin;

  const ensure = (h) => { if (y + h > pageH - margin - 14) { doc.addPage(); y = margin; } };

  const heading = (text, size = 14, color = [0, 120, 180]) => {
    ensure(size + 12); doc.setFont('helvetica', 'bold'); doc.setFontSize(size); doc.setTextColor(...color);
    doc.text(text, margin, y); y += size + 8;
  };
  const subheading = (text, size = 11, color = [20, 80, 120]) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(size); doc.setTextColor(...color);
    doc.splitTextToSize(String(text), pageW - 2 * margin).forEach(ln => {
      ensure(size + 10); doc.text(ln, margin, y); y += size + 4;
    });
    y += 1;
  };
  const label = (text) => {
    ensure(14); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 130, 100);
    doc.text(text.toUpperCase(), margin, y); y += 12;
  };
  const body = (text, size = 9, color = [30, 30, 40]) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(size); doc.setTextColor(...color);
    doc.splitTextToSize(text, pageW - 2 * margin).forEach(ln => {
      ensure(size + 4); doc.text(ln, margin, y); y += size + 4;
    });
    y += 2;
  };
  const bullet = (text, size = 9, indent = 14) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(size); doc.setTextColor(30, 30, 40);
    doc.splitTextToSize(text, pageW - 2 * margin - indent).forEach((ln, i) => {
      ensure(size + 4);
      if (i === 0) doc.text('•', margin, y);
      doc.text(ln, margin + indent, y); y += size + 4;
    });
    y += 1;
  };
  const callout = (text, color = [200, 150, 0]) => {
    ensure(28);
    doc.setFillColor(252, 248, 230); doc.rect(margin, y - 9, pageW - 2 * margin, 22, 'F');
    doc.setDrawColor(...color); doc.setLineWidth(2); doc.line(margin, y - 9, margin, y + 13);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(60, 50, 20);
    doc.splitTextToSize(text, pageW - 2 * margin - 16).forEach(ln => {
      doc.text(ln, margin + 12, y); y += 11;
    });
    y += 6;
  };
  const divider = () => { ensure(12); doc.setDrawColor(210, 220, 230); doc.setLineWidth(0.5); doc.line(margin, y, pageW - margin, y); y += 12; };

  const footer = (subjectName) => {
    const pages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(150, 160, 170);
      doc.text(`RoboCraft Revision${subjectName ? ' — ' + subjectName : ''} — Page ${p}/${pages}`, pageW / 2, pageH - 14, { align: 'center' });
    }
  };

  return { doc, pageW, pageH, margin, y: { get: () => y, set: (v) => y = v }, ensure, heading, subheading, label, body, bullet, callout, divider, footer };
}

function renderTopic(pdf, topic) {
  const { heading, subheading, label, body, bullet, callout, divider } = pdf;
  heading(topic.title, 13, [0, 90, 140]);

  label('What is it?');
  body(topic.concept, 9);

  if (topic.howItWorks.length) {
    label('How it works');
    topic.howItWorks.slice(0, 4).forEach(sec => {
      subheading(sec.heading || '', 9.5, [40, 70, 100]);
      if (sec.paragraphs[0]) body(sec.paragraphs[0], 9);
      if (sec.paragraphs[1]) body(sec.paragraphs[1], 9);
      if (sec.bullets.length) sec.bullets.slice(0, 5).forEach(b => bullet(b));
    });
  }

  if (topic.keyPoints.length) {
    label('Key points');
    topic.keyPoints.forEach(p => bullet(p));
  }

  if (topic.examples.length) {
    label('Real-world robotics example');
    topic.examples.slice(0, 2).forEach(ex => body('• ' + ex, 9));
  }

  label('Engineering insight');
  body(topic.insight, 9);

  if (topic.mistake) {
    label('Common mistake');
    callout(topic.mistake, [200, 120, 0]);
  }

  label('Exam point');
  callout(topic.examPoint, [0, 130, 180]);

  divider();
}

function renderFinalSections(pdf, topics) {
  const { heading, label, body, bullet, callout, divider, ensure } = pdf;

  // Final Quick Revision — 10-20 most important points
  heading('Final Quick Revision', 14, [0, 120, 80]);
  body('The 15 most important things to remember across this subject.', 9, [90, 100, 120]);
  const quick = topics.flatMap(t => t.keyPoints.slice(0, 3)).slice(0, 18);
  quick.forEach((p, i) => bullet(`${i + 1}. ${p}`));
  divider();

  // Important Questions — mixed
  heading('Important Questions', 14, [0, 120, 80]);

  label('Multiple Choice');
  const mcqs = topics.flatMap(t => t.quiz.filter(q => q.type === 'mcq')).slice(0, 8);
  mcqs.forEach((q, i) => {
    bullet(`Q${i + 1}. ${q.q}`);
    q.options.forEach((o, oi) => bullet(`${String.fromCharCode(65 + oi)}. ${o}`));
    callout(`Answer: ${String.fromCharCode(65 + q.answer)} — ${q.explanation || ''}`, [0, 130, 90]);
  });

  label('Short Answer & Conceptual');
  topics.flatMap(t => t.keyConcepts ? t.keyConcepts : []).slice(0, 6).forEach((c, i) => bullet(`Q${i + 1}. Explain: ${c}`));
  // fallback if no keyConcepts (use takeaways)
  if (!topics.some(t => t.keyPoints.length)) {
    topics.slice(0, 6).forEach((t, i) => bullet(`Q${i + 1}. Explain: ${t.title}`));
  }

  label('Reasoning / Application');
  topics.slice(0, 6).forEach((t, i) => bullet(`Q${i + 1}. ${getThinkingQuestion({ title: t.title, subject: '', theory: '' })}`.slice(0, 180) + '…'));
  divider();

  // Exam Checklist
  heading('Exam Checklist', 14, [0, 120, 80]);
  const checklist = [
    'I understand the main concepts',
    'I can explain important definitions',
    'I can distinguish similar concepts',
    'I can solve basic application questions',
    'I reviewed my weak areas',
    'I completed the practice questions',
  ];
  checklist.forEach(item => {
    ensure(16);
    pdf.doc.setDrawColor(0, 130, 180); pdf.doc.setLineWidth(1); pdf.doc.rect(pdf.margin, pdf.y.get() - 9, 10, 10);
    pdf.doc.setFont('helvetica', 'normal'); pdf.doc.setFontSize(10); pdf.doc.setTextColor(30, 30, 40);
    pdf.doc.text(item, pdf.margin + 18, pdf.y.get()); pdf.y.set(pdf.y.get() + 16);
  });
}

// ── Per-lesson (single chapter) notes PDF ──
// Contains ONLY the selected chapter's material — never the full syllabus.
export async function exportLessonRevisionPdf(classId, lesson) {
  const pdf = await makeDoc();
  const { doc, pageW, margin } = pdf;
  const classLabel = classId.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()); // "Class 11"

  // Header band — single chapter identity
  doc.setFillColor(10, 16, 30); doc.rect(0, 0, pageW, 72, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(0, 200, 245);
  doc.text('ROBOCRAFT', margin, 28);
  doc.setFontSize(9); doc.setTextColor(150, 170, 190);
  doc.text(`${classLabel.toUpperCase()}  •  ${(lesson.subject || '').toUpperCase()}`, margin, 44);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(0, 210, 255);
  doc.text(`CHAPTER: ${(lesson.title || '').toUpperCase()}`, margin, 62);
  pdf.y.set(94);

  const topic = buildTopic(classId, lesson);

  // 1. Core Concept
  pdf.heading('1. Core Concept', 13, [0, 90, 140]);
  pdf.body(topic.concept, 9.5);

  // 2. Key Definitions
  pdf.heading('2. Key Definitions', 13, [0, 90, 140]);
  const defs = (lesson.keyConcepts || []).slice(0, 6);
  if (defs.length) defs.forEach(d => pdf.bullet(d));
  else pdf.body(topic.takeaway || lesson.summary || 'See core concept above.', 9.5);

  // 3. How It Works
  pdf.heading('3. How It Works', 13, [0, 90, 140]);
  if (topic.howItWorks.length) {
    topic.howItWorks.slice(0, 4).forEach(sec => {
      if (sec.heading) pdf.subheading(sec.heading, 10.5, [40, 70, 110]);
      sec.paragraphs.slice(0, 2).forEach(p => pdf.body(p, 9.5));
      if (sec.bullets.length) sec.bullets.slice(0, 5).forEach(b => pdf.bullet(b));
    });
  } else {
    pdf.body(topic.concept, 9.5);
  }

  // 4. Important Points
  pdf.heading('4. Important Points', 13, [0, 90, 140]);
  if (topic.keyPoints.length) topic.keyPoints.slice(0, 8).forEach(p => pdf.bullet(p));
  else pdf.body(topic.takeaway || '', 9.5);

  // Full textbook notes for this chapter
  const book = getTextbook(lesson.id);
  if (book?.sections?.length) {
    pdf.heading('Detailed Notes', 13, [0, 90, 140]);
    book.sections.forEach(sec => {
      pdf.subheading(pdfSafe(sec.h), 10.5, [40, 70, 110]);
      renderPlain(pdf, sec.b);
    });
    if (book.glossary?.length) {
      pdf.subheading('Key terms', 10.5, [40, 70, 110]);
      book.glossary.forEach(([t, d]) => pdf.bullet(pdfSafe(`${t}: ${d}`), 9));
    }
    if (book.figs?.length || book.sections.some(x => x.b.includes('[fig:'))) {
      pdf.callout('Diagrams for this chapter are in the app (Textbook Notes and the Diagram Bank). Practise drawing and labelling them.', [120, 80, 200]);
    }
  }

  // 5. Real-World Application
  pdf.heading('5. Real-World Application', 13, [0, 90, 140]);
  if (topic.examples.length) topic.examples.slice(0, 2).forEach(e => pdf.body('• ' + e, 9.5));
  else pdf.body('Used in industrial automation, consumer robotics, and autonomous systems.', 9.5);

  // 6. Engineering Insight
  pdf.heading('6. Engineering Insight', 13, [0, 90, 140]);
  pdf.body(topic.insight, 9.5);

  // 7. Common Mistakes
  if (topic.mistake) {
    pdf.heading('7. Common Mistakes', 13, [0, 90, 140]);
    pdf.callout(topic.mistake, [200, 120, 0]);
  }

  // 8. Quick Revision
  pdf.heading('8. Quick Revision', 13, [0, 90, 140]);
  pdf.body(topic.takeaway || topic.examPoint, 9.5);
  if (topic.examPoint !== topic.takeaway) pdf.callout('Exam point: ' + topic.examPoint, [0, 130, 180]);

  // 9. Practice Questions
  pdf.heading('9. Practice Questions', 13, [0, 90, 140]);
  const mcqs = topic.quiz.filter(q => q.type === 'mcq').slice(0, 5);
  let qi = 1;
  mcqs.forEach(q => {
    pdf.bullet(`Q${qi}. ${q.q}`);
    q.options.forEach((o, oi) => pdf.bullet(`${String.fromCharCode(65 + oi)}. ${o}`, 9, 24));
    qi++;
  });
  (lesson.keyConcepts || []).slice(0, 3).forEach(s => { pdf.bullet(`Q${qi}. Explain: ${s}`); qi++; });
  while (qi <= 8) {
    pdf.bullet(`Q${qi}. ${getThinkingQuestion({ title: lesson.title, subject: lesson.subject, theory: lesson.theory })}`.slice(0, 200));
    qi++;
  }

  // 10. Answer Key
  if (mcqs.length) {
    pdf.heading('10. Answer Key', 13, [0, 90, 140]);
    mcqs.forEach((q, i) => pdf.bullet(`Q${i + 1}. ${String.fromCharCode(65 + q.answer)} — ${q.explanation || ''}`));
  }

  // 11. Board-style written questions with model answers
  if (book?.exam && (book.exam.short?.length || book.exam.long?.length)) {
    pdf.heading('11. Exam Questions with Model Answers', 13, [0, 90, 140]);
    (book.exam.short || []).forEach((q, i) => {
      pdf.subheading(pdfSafe(`S${i + 1}. ${q.q}  [2]`), 10, [30, 60, 100]);
      renderPlain(pdf, q.a);
    });
    (book.exam.long || []).forEach((q, i) => {
      pdf.subheading(pdfSafe(`L${i + 1}. ${q.q}  [5]`), 10, [30, 60, 100]);
      renderPlain(pdf, q.a);
    });
  }

  pdf.footer(`${classLabel} — ${lesson.title}`);
  const safeTitle = (lesson.title || 'Notes').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const cls = classLabel.replace(/\s+/g, '');
  await downloadFile(doc.output('blob'), `RoboCraft_${cls}_${safeTitle}_Notes.pdf`, 'application/pdf');
}

// ── Per-subject revision book ──
export async function exportRevisionPdf(classId, subject) {
  const pdf = await makeDoc();
  const { doc, pageW, margin } = pdf;
  doc.setFillColor(8, 14, 28); doc.rect(0, 0, pageW, 64, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(0, 210, 255);
  doc.text('ROBOCRAFT — LAST-MINUTE REVISION', margin, 30);
  doc.setFontSize(10); doc.setTextColor(180, 200, 220);
  doc.text(`${classId.replace('_', ' ').toUpperCase()}  •  ${subject.name}`, margin, 48);
  pdf.y.set(80);

  const topics = (subject.lessons || []).map(l => buildTopic(classId, l));
  pdf.body(`${topics.length} topics in this revision book. Each topic covers what it is, how it works, key points, a real-world example, engineering insight, common mistakes and an exam point.`, 9, [90, 100, 120]);
  pdf.divider();

  topics.forEach(t => renderTopic(pdf, t));
  renderFinalSections(pdf, topics);
  pdf.footer(subject.name);
  await downloadFile(doc.output('blob'), `RoboCraft_Revision_${classId}_${subject.id}.pdf`, 'application/pdf');
}

// ── Full-class revision book ──
export async function exportFullRevisionPdf(classId) {
  const subjects = getSubjects(classId);
  const all = getAllLessons(classId);
  const pdf = await makeDoc();
  const { doc, pageW, margin } = pdf;
  doc.setFillColor(8, 14, 28); doc.rect(0, 0, pageW, 64, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(0, 210, 255);
  doc.text(`${classId.replace('_', ' ').toUpperCase()} — FINAL REVISION`, margin, 30);
  doc.setFontSize(10); doc.setTextColor(180, 200, 220);
  doc.text(`${subjects.length} sections • ${all.length} topics`, margin, 48);
  pdf.y.set(80);

  subjects.forEach((subject, si) => {
    pdf.heading(`SECTION ${si + 1}`, 11, [0, 150, 130]);
    pdf.heading(subject.name.toUpperCase(), 14, [0, 90, 140]);
    const topics = (subject.lessons || []).map(l => buildTopic(classId, l));
    topics.forEach(t => renderTopic(pdf, t));
  });

  // Class-level final sections
  const allTopics = subjects.flatMap(s => (s.lessons || []).map(l => buildTopic(classId, l)));
  renderFinalSections(pdf, allTopics);
  pdf.footer(`${classId.replace('_', ' ')} Full Revision`);
  await downloadFile(doc.output('blob'), `RoboCraft_FullRevision_${classId}.pdf`, 'application/pdf');
}