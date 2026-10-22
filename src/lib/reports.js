// "Report a problem" — content mistakes and AI replies (required by Google Play's
// policy for apps with generative AI). Reports go to Firestore `reports` when the
// student is signed in; otherwise they wait on the device and are sent later.
import { accountsEnabled } from '@/lib/features';

const QUEUE = 'robocraft_report_queue';
const readQ = () => { try { return JSON.parse(localStorage.getItem(QUEUE) || '[]'); } catch { return []; } };
const writeQ = (q) => { try { localStorage.setItem(QUEUE, JSON.stringify(q.slice(-30))); } catch { /* ignore */ } };

export const REPORT_KINDS = [
  ['mistake', 'Wrong information / mistake'],
  ['typo', 'Typo or formatting problem'],
  ['ai_wrong', 'AI answer is wrong'],
  ['ai_harmful', 'AI reply is offensive or unsafe'],
  ['bug', 'Something is not working'],
  ['other', 'Something else'],
];

async function send(r) {
  if (!accountsEnabled) return false;
  const { fb } = await import('@/api/firebase');
  const { db, F, auth } = await fb();
  if (!auth.currentUser) return false;
  await F.addDoc(F.collection(db, 'reports'), { ...r, uid: auth.currentUser.uid });
  return true;
}

/** Returns 'sent' or 'queued'. Never throws. */
export async function submitReport({ kind, message, context = {} }) {
  const r = {
    kind: String(kind).slice(0, 20),
    message: String(message || '').slice(0, 1000),
    page: String(context.page || (typeof location !== 'undefined' ? location.pathname : '')).slice(0, 120),
    lessonId: String(context.lessonId || '').slice(0, 40),
    excerpt: String(context.excerpt || '').slice(0, 1500),
    classId: String(context.classId || '').slice(0, 12),
    app: String(import.meta.env?.VITE_APP_VERSION || 'web').slice(0, 20),
    created: new Date().toISOString(),
  };
  try {
    if (await send(r)) {
      // also flush anything that was waiting
      const q = readQ();
      if (q.length) { writeQ([]); for (const x of q) { try { await send(x); } catch { /* drop */ } } }
      return 'sent';
    }
  } catch { /* offline or rules not deployed */ }
  writeQ([...readQ(), r]);
  return 'queued';
}
