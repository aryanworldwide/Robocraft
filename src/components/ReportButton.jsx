import React, { useState } from 'react';
import { Flag, X, Check, Loader2 } from 'lucide-react';
import { REPORT_KINDS, submitReport } from '@/lib/reports';

/**
 * Small "Report" link that opens a sheet. `ai` = reporting an AI reply (pre-selects AI kinds).
 * context: { lessonId, excerpt, classId }
 */
export default function ReportButton({ ai = false, context = {}, label = 'Report', className = '' }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState(ai ? 'ai_wrong' : 'mistake');
  const [msg, setMsg] = useState('');
  const [state, setState] = useState(null); // null | 'busy' | 'sent' | 'queued'
  const kinds = REPORT_KINDS.filter(([k]) => (ai ? k.startsWith('ai') || k === 'other' : !k.startsWith('ai')));
  const submit = async () => { setState('busy'); setState(await submitReport({ kind, message: msg, context })); };
  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setOpen(true); setState(null); setMsg(''); }} className={`inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-400 ${className}`} aria-label={label}>
        <Flag className="w-3 h-3" /> {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full sm:max-w-sm glass-strong rounded-t-2xl sm:rounded-2xl p-4 pb-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold flex items-center gap-1.5"><Flag className="w-4 h-4 text-red-400" /> {ai ? 'Report this AI reply' : 'Report a problem'}</p>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            {state === 'sent' || state === 'queued' ? (
              <div className="text-center py-4">
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Thank you!</p>
                <p className="text-xs text-muted-foreground mt-1">{state === 'sent' ? 'Your report was sent. We review every report.' : 'Saved on this device — it will be sent next time you are signed in and online.'}</p>
                <button onClick={() => setOpen(false)} className="mt-4 px-4 py-2 rounded-xl glass text-xs">Close</button>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 mb-3">
                  {kinds.map(([k, l]) => (
                    <label key={k} className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 cursor-pointer ${kind === k ? 'bg-red-500/10 border border-red-500/40' : 'glass'}`}>
                      <input type="radio" name="rk" checked={kind === k} onChange={() => setKind(k)} /> {l}
                    </label>
                  ))}
                </div>
                <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3} maxLength={1000} placeholder="What is wrong? (optional)" className="w-full glass rounded-lg px-3 py-2 text-xs mb-3" />
                <button onClick={submit} disabled={state === 'busy'} className="w-full py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                  {state === 'busy' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />} Send report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
