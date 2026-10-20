// RoboCraft backend client.
// Same shape the app already uses (backend.auth.*, backend.integrations.Core.*,
// backend.entities.*), now powered by free services:
//   • Accounts + progress  → Firebase Auth + Firestore
//   • AI                   → Cloudflare Workers AI (backend/worker.js)
//   • Speech               → the device's own text-to-speech (see lib/speech.js)
import { aiServerUrl } from '@/config/services';
import { accountsEnabled, aiEnabled } from '@/lib/features';
import { fb, currentFirebaseUser, authError } from '@/api/firebase';

const unavailable = (what) => Promise.reject(Object.assign(new Error(`${what} aren't available yet.`), { status: 503, offline: true }));

// ── Accounts ────────────────────────────────────────────────────────────────
async function userRecord(fbUser) {
  const { db, F } = await fb();
  let data = {};
  try {
    const snap = await F.getDoc(F.doc(db, 'users', fbUser.uid));
    if (snap.exists()) data = snap.data();
  } catch { /* offline: fall back to local progress */ }
  return {
    id: fbUser.uid,
    email: fbUser.email,
    full_name: fbUser.displayName || data.full_name || (fbUser.email ? fbUser.email.split('@')[0] : 'Student'),
    email_verified: fbUser.emailVerified,
    role: 'user',
    ...data,
  };
}

const auth = {
  async me() {
    if (!accountsEnabled) return unavailable('Accounts');
    const u = await currentFirebaseUser();
    if (!u) throw Object.assign(new Error('Not signed in'), { status: 401 });
    return userRecord(u);
  },
  async loginViaEmailPassword(email, password) {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    try { await A.signInWithEmailAndPassword(a, email.trim(), password); }
    catch (e) { throw authError(e); }
  },
  async register({ email, password }) {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    try {
      const cred = await A.createUserWithEmailAndPassword(a, email.trim(), password);
      try { await A.sendEmailVerification(cred.user); } catch { /* optional */ }
      return { user: cred.user };
    } catch (e) { throw authError(e); }
  },
  async loginWithGoogle() {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    try { await A.signInWithPopup(a, new A.GoogleAuthProvider()); }
    catch (e) { throw authError(e); }
  },
  async resendVerification() {
    const { auth: a, A } = await fb();
    if (a.currentUser) await A.sendEmailVerification(a.currentUser);
  },
  async resetPasswordRequest(email) {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    try { await A.sendPasswordResetEmail(a, email.trim()); }
    catch (e) { if (e?.code !== 'auth/user-not-found') throw authError(e); }
  },
  async updateMe(data) {
    if (!accountsEnabled) return unavailable('Accounts');
    const { db, F, auth: a } = await fb();
    if (!a.currentUser) return;
    await F.setDoc(F.doc(db, 'users', a.currentUser.uid), { ...data, updated_at: F.serverTimestamp() }, { merge: true });
  },
  async deleteAccount() {
    const { db, F, auth: a, A } = await fb();
    const u = a.currentUser; if (!u) return;
    try { await F.deleteDoc(F.doc(db, 'users', u.uid)); } catch {}
    try { await A.deleteUser(u); } catch (e) { throw authError(e); }
  },
  async logout() {
    if (!accountsEnabled) return;
    const { auth: a, A } = await fb();
    await A.signOut(a);
  },
  setToken() {},
};

// ── AI (Cloudflare Workers AI) ──────────────────────────────────────────────
async function invokeLLM({ prompt, response_json_schema, user_input } = {}) {
  if (!aiEnabled) return unavailable('AI features');
  let res;
  try {
    res = await fetch(aiServerUrl.replace(/\/$/, '') + '/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, schema: response_json_schema || null, user_input: user_input || '' }),
    });
  } catch {
    throw Object.assign(new Error('No internet connection. AI needs internet.'), { status: 0 });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw Object.assign(new Error(data.error || 'AI is busy right now. Please try again.'), { status: res.status });
  return data.result;
}

// ── Saved AI projects (Firestore) ───────────────────────────────────────────
const PROJECTS = 'generatedProjects';
const generatedProject = {
  async create(data) {
    if (!accountsEnabled) return unavailable('Saving');
    const { db, F, auth: a } = await fb();
    if (!a.currentUser) throw Object.assign(new Error('Log in to save projects.'), { status: 401 });
    const record = { ...data, owner: a.currentUser.uid, created_date: new Date().toISOString() };
    const ref = await F.addDoc(F.collection(db, PROJECTS), record);
    return { id: ref.id, ...record };
  },
  async update(id, data) {
    if (!accountsEnabled) return unavailable('Saving');
    const { db, F } = await fb();
    await F.updateDoc(F.doc(db, PROJECTS, id), data);
    return { id, ...data };
  },
  async list(sort = '-created_date', limit = 50) {
    if (!accountsEnabled) return [];
    const { db, F } = await fb();
    const field = sort.replace(/^-/, '');
    const q = F.query(F.collection(db, PROJECTS), F.orderBy(field, sort.startsWith('-') ? 'desc' : 'asc'), F.limit(limit));
    const snap = await F.getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async filter(criteria = {}) {
    const all = await generatedProject.list('-created_date', 100);
    return all.filter(p => Object.entries(criteria).every(([k, v]) => p[k] === v));
  },
};

export const backend = {
  auth,
  integrations: {
    Core: {
      InvokeLLM: invokeLLM,
      // Speech is generated on the device now (free, offline); see lib/speech.js.
      GenerateSpeech: () => unavailable('Server speech'),
    },
  },
  entities: { GeneratedProject: generatedProject },
  asServiceRole: { entities: { GeneratedProject: generatedProject } },
};
