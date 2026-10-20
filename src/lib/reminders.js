// Daily study reminders.
// Android app: real phone notifications (@capacitor/local-notifications).
// We schedule the next 7 days one by one and skip today if the student has
// already studied, so nobody is nagged after finishing their lesson.
// Web / iPhone: an in-app "keep your streak" card on Home (see StreakReminder).
import { isNative } from '@/lib/platform';

const KEY = 'robocraft_reminder';
const IDS = [1001, 1002, 1003, 1004, 1005, 1006, 1007];

const MESSAGES = [
  ['🤖 Your robot misses you!', 'A quick 5-minute lesson keeps your streak alive.'],
  ['🔥 Keep the streak going', 'One lesson today = more XP and coins.'],
  ['⚡ Daily robotics boost', 'Learn something new in under 10 minutes.'],
  ['🏆 Climb the ranks', 'Finish a lesson or quiz today to earn XP.'],
  ['🧠 Quick brain workout', 'Try a quiz — can you get 100%?'],
  ['🛠️ Build something today', 'Open the Lab or start your next lesson.'],
  ['🎁 Coins are waiting', 'Earn coins today and spend them in the Reward Shop.'],
];

export function getReminderSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && typeof s.time === 'string') return { enabled: !!s.enabled, time: s.time };
  } catch { /* ignore */ }
  return { enabled: false, time: '18:00' };
}

function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

async function plugin() {
  if (!isNative) return null;
  try { return (await import('@capacitor/local-notifications')).LocalNotifications; } catch { return null; }
}

/** Ask for permission (Android 13+ shows a system prompt). Returns true if allowed. */
async function ensurePermission(LN) {
  let p = await LN.checkPermissions();
  if (p.display === 'prompt' || p.display === 'prompt-with-rationale') p = await LN.requestPermissions();
  return p.display === 'granted';
}

/**
 * (Re)schedule the next week of reminders.
 * @param {boolean} studiedToday skip today's reminder when true
 */
export async function scheduleReminders(studiedToday = false) {
  const LN = await plugin();
  if (!LN) return { ok: true, native: false };
  const s = getReminderSettings();
  try {
    await LN.cancel({ notifications: IDS.map(id => ({ id })) });
    if (!s.enabled) return { ok: true, native: true };
    if (!(await ensurePermission(LN))) return { ok: false, native: true, reason: 'permission' };
    const [h, m] = s.time.split(':').map(Number);
    const now = new Date();
    const notifications = [];
    for (let i = 0; i < 7; i++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m, 0);
      if (at <= now) continue;
      if (i === 0 && studiedToday) continue;
      const [title, body] = MESSAGES[(at.getDate() + i) % MESSAGES.length];
      notifications.push({ id: IDS[i], title, body, schedule: { at } });
    }
    if (notifications.length) await LN.schedule({ notifications });
    return { ok: true, native: true };
  } catch (e) {
    console.warn('Reminder scheduling failed', e);
    return { ok: false, native: true, reason: 'error' };
  }
}

/** Save new settings and reschedule. */
export async function setReminderSettings(next, studiedToday = false) {
  saveSettings({ ...getReminderSettings(), ...next });
  return scheduleReminders(studiedToday);
}

export const remindersAreNative = isNative;
