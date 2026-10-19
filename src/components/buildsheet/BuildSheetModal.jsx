import React, { useState, useEffect, useRef } from 'react';
import { generateBuildSheetData } from '@/lib/buildsheet/generateData';
import { exportToPDF } from '@/lib/buildsheet/exportUtils';
import BuildSheet from '@/components/buildsheet/BuildSheet';
import { X, FileText, Download, Loader2, Bot, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function BuildSheetModal({ project, projectType, classId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [explainData, setExplainData] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const sheetRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const result = await generateBuildSheetData(project, projectType, classId);
      if (active) { setData(result); setLoading(false); }
    })();
    return () => { active = false; };
  }, [project, projectType, classId]);

  const filename = (data?.projectName || project?.title || project?.name || 'project').replace(/\s+/g, '_');

  const handlePDF = async () => {
    if (!sheetRef.current) return;
    setExporting(true);
    try { await exportToPDF(sheetRef.current, `RoboCraft_BuildSheet_${filename}`); }
    finally { setExporting(false); }
  };

  const handleExplain = async () => {
    if (explainData) { setShowExplain(!showExplain); return; }
    setShowExplain(true);
    setExplainLoading(true);
    try {
      const prompt = `You are explaining a robotics build to a school student (class 9-11).
Project: "${data.projectName}" (${data.difficulty})
Components: ${data.components.map(c => c.name).join(', ')}
Pin Connections: ${data.pinConnections.map(p => `${p.controllerPin} → ${p.component} → ${p.componentPin}`).join('; ')}

Write a detailed but simple explanation covering ALL of these in order:
1. 🧩 Purpose of every component (what each one does)
2. 🔗 Why each wire is connected (explain the wiring logic)
3. ⚠️ Common mistakes students make (and how to avoid them)
4. 🛡 Safety precautions (battery safety, short circuits, etc.)
5. 🌍 Real-world applications (where is this technology used?)

Use simple English. Use emojis. Write 4-6 paragraphs.`;

      const res = await (await import('@/api/client')).backend.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: { type: 'object', properties: { explanation: { type: 'string' } } },
      });
      setExplainData(res.explanation || 'Could not generate explanation. Please try again.');
    } catch {
      setExplainData('Could not connect to AI. Please try again later.');
    } finally {
      setExplainLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Top bar */}
      <div className="relative z-10 glass-strong border-b border-cyan-500/10 px-4 py-3 flex items-center justify-between safe-area-top" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Build Sheet</h2>
            <p className="text-[10px] text-muted-foreground">{data?.projectName || 'Loading...'} · Professional Project Manual</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={handlePDF} disabled={!data || exporting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40 hover:neon-glow transition-all">
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
          </button>
          <button onClick={onClose} className="p-2 rounded-lg glass text-muted-foreground hover:text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Explain Build bar */}
      {data && (
        <div className="relative z-10 px-4 py-2 glass border-b border-cyan-500/10 flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <button onClick={handleExplain}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors">
            <Bot className="w-4 h-4" /> AI Explain Build
            {showExplain ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* AI Explain panel */}
      {showExplain && data && (
        <div className="relative z-10 max-w-2xl w-full mx-auto px-4 py-3 animate-slide-up">
          <div className="glass-strong rounded-2xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-purple-400">AI Build Explanation</h3>
            </div>
            {explainLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                <span className="text-xs text-muted-foreground ml-2">AI is analyzing the build...</span>
              </div>
            ) : explainData ? (
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{explainData}</p>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">Loading explanation...</p>
            )}
          </div>
        </div>
      )}

      {/* Content scroll area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4" onClick={e => e.stopPropagation()}>
        {loading || !data ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <p className="text-sm font-medium text-cyan-400 animate-pulse">Preparing Build Sheet...</p>
            <p className="text-[10px] text-muted-foreground mt-2">Assembling components, pin table, and code locally</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
            <BuildSheet ref={sheetRef} data={data} />
          </div>
        )}
      </div>
    </div>
  );
}