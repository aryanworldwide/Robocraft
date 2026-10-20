import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getProject } from '@/lib/curriculum';
import { ArrowLeft, Clock, DollarSign, Wrench, ListChecks, AlertTriangle, Copy, Check, Download, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import BackButton from '@/components/BackButton';
import BuildSheetModal from '@/components/buildsheet/BuildSheetModal';
import CodeExplainer from '@/components/learning/CodeExplainer';
import { generateBuildSheetData } from '@/lib/buildsheet/generateData';
import { sanitizeCode } from '@/lib/buildsheet/sanitizeCode';
import { downloadFile } from '@/lib/platform';
import { FileText, Eye } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedClass } = useApp();
  const project = getProject(selectedClass, id);
  const [copied, setCopied] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);
  const [showBuildSheet, setShowBuildSheet] = useState(false);
  const [sheetData, setSheetData] = useState(null);
  const [loadingSheet, setLoadingSheet] = useState(false);

  useEffect(() => {
    if (!project) return;
    let active = true;
    setLoadingSheet(true);
    (async () => {
      try {
        const data = await generateBuildSheetData(project, 'curriculum', selectedClass);
        if (active) { setSheetData(data); }
      } catch (err) {
        console.error('Failed to load circuit data:', err);
      } finally {
        if (active) setLoadingSheet(false);
      }
    })();
    return () => { active = false; };
  }, [project, selectedClass]);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <button onClick={() => navigate('/projects')} className="text-cyan-400 mt-2">Back to Projects</button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(sanitizeCode(project.arduinoCode || ''))?.catch?.(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const blob = new Blob([sanitizeCode(project.arduinoCode || '')], { type: 'text/plain' });
    await downloadFile(blob, `${project.title.replace(/\s+/g, '_')}.ino`, 'text/plain');
  };

  const diffColors = { Beginner: '#4ADE80', Intermediate: '#F59E0B', Advanced: '#EF4444' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <BackButton />
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${diffColors[project.difficulty]}20`, color: diffColors[project.difficulty] }}>
          {project.difficulty}
        </span>
      </div>

      {/* Title */}
      <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-3">
          <Wrench className="w-7 h-7 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        <div className="flex items-center gap-2 text-xs mb-4">
          <span className="glass px-3 py-1.5 rounded-full text-cyan-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.estimatedTime}</span>
          <span className="glass px-3 py-1.5 rounded-full text-green-400 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {project.estimatedCost}</span>
        </div>

        {/* Build Sheet buttons */}
        <div className="flex gap-2 mb-2">
          <button onClick={() => setShowBuildSheet(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:neon-glow transition-all">
            <Eye className="w-3.5 h-3.5" /> Preview Build Sheet
          </button>
          <button onClick={() => setShowBuildSheet(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors">
            <FileText className="w-3.5 h-3.5" /> Download Build Sheet
          </button>
        </div>
      </div>

      {/* Components */}
      <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> Components Required</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {project.components.map((comp, i) => (
            <div key={i} className="flex items-center gap-2 text-sm glass rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
              {comp}
            </div>
          ))}
        </div>
      </div>

      {/* Pin Mapping Table */}
      {sheetData?.pinConnections?.length > 0 && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.13s' }}>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> Pin Mapping Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-cyan-500/10">
                  <th className="text-left p-2 font-medium">Controller Pin</th>
                  <th className="text-center p-2">→</th>
                  <th className="text-left p-2 font-medium">Component</th>
                  <th className="text-left p-2 font-medium">Component's Pin</th>
                  <th className="text-center p-2 font-medium">Wire</th>
                </tr>
              </thead>
              <tbody>
                {sheetData.pinConnections.map((conn, i) => (
                  <tr key={i} className="border-b border-cyan-500/5">
                    <td className="p-2 font-bold text-cyan-400">{conn.controllerPin}</td>
                    <td className="p-2 text-center text-muted-foreground">→</td>
                    <td className="p-2">{conn.component}</td>
                    <td className="p-2 font-medium">{conn.componentPin}</td>
                    <td className="p-2 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-1 rounded" style={{ background: conn.color }} />
                        <span className="text-[10px] text-muted-foreground capitalize">{conn.wireColor}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><ListChecks className="w-4 h-4 text-cyan-400" /> Step-by-Step Guide</h3>
        <div className="space-y-2">
          {project.steps.map((step, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                className="w-full flex items-center gap-3 p-3 hover:bg-cyan-500/5 transition-colors text-left"
              >
                <span className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">{i + 1}</span>
                <span className="text-sm flex-1">{step}</span>
                {expandedStep === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {expandedStep === i && (
                <div className="px-3 pb-3 text-xs text-muted-foreground animate-fade-in">
                  Take your time with this step. Ensure all connections are secure before moving on.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Code */}
      {project.arduinoCode && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> Arduino Code</h3>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="text-xs glass px-3 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/15 transition-colors flex items-center gap-1">
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
              <button onClick={handleDownload} className="text-xs glass px-3 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/15 transition-colors flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <pre className="glass rounded-xl p-4 overflow-x-auto text-xs font-mono text-cyan-300/90 leading-relaxed">
            <code>{sanitizeCode(project.arduinoCode)}</code>
          </pre>
        </div>
      )}

      {/* ESP32 Code (if applicable) */}
      {project.esp32Code && project.esp32Code.trim() && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.22s' }}>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Cpu className="w-4 h-4 text-red-400" /> ESP32 Code</h3>
          <pre className="glass rounded-xl p-4 overflow-x-auto text-xs font-mono text-cyan-300/90 leading-relaxed">
            <code>{sanitizeCode(project.esp32Code)}</code>
          </pre>
        </div>
      )}

      {/* Code Explanation */}
      {project.arduinoCode && (
        <div className="mb-4">
          <CodeExplainer code={project.arduinoCode} />
        </div>
      )}

      {/* Testing Checklist */}
      {project.testingChecklist && project.testingChecklist.length > 0 && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><ListChecks className="w-4 h-4 text-green-400" /> Testing Checklist</h3>
          <ul className="space-y-2">
            {project.testingChecklist.map((item, i) => (
              <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                <span className="w-4 h-4 rounded border border-green-500/30 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Troubleshooting */}
      {project.troubleshooting && project.troubleshooting.length > 0 && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" /> Troubleshooting</h3>
          <div className="space-y-2">
            {project.troubleshooting.map((item, i) => (
              <div key={i} className="text-sm text-foreground/90 flex items-start gap-2 glass rounded-lg p-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
      {showBuildSheet && (
        <BuildSheetModal
          project={project}
          projectType="curriculum"
          classId={selectedClass}
          onClose={() => setShowBuildSheet(false)}
        />
      )}
    </div>
  );
}