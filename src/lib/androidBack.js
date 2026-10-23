// Android hardware back button.
//
// Without a listener Capacitor falls back to Android's default, which closes
// the activity from any screen — pressing Back inside a lesson throws the
// student out of the app and reads as a crash. This walks back through the
// app's own history instead, and only leaves from the home screen, after a
// confirm tap (the usual Android convention).
import { isNative } from '@/lib/platform';
import { toast } from '@/components/ui/use-toast';

let installed = false;

export async function installAndroidBackButton() {
  if (installed || !isNative) return;
  installed = true;
  let CapApp;
  try {
    ({ App: CapApp } = await import('@capacitor/app'));
  } catch {
    return; // plugin not in this build — Android keeps its default behaviour
  }

  let armedUntil = 0;

  await CapApp.addListener('backButton', ({ canGoBack }) => {
    // 1. Anything overlaying the screen closes first.
    const overlay = document.querySelector(
      '[data-state="open"][role="dialog"], [role="dialog"]:not([aria-hidden="true"]), [data-rc-overlay="open"]'
    );
    if (overlay) {
      const close = overlay.querySelector('[data-rc-close], [aria-label="Close"], [aria-label="close"]');
      if (close) { close.click(); return; }
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return;
    }

    // 2. Otherwise walk back through the app's own history.
    const atRoot = !canGoBack || window.history.length <= 1;
    if (!atRoot) { window.history.back(); return; }

    // 3. At the root, ask once before leaving.
    const now = Date.now();
    if (now < armedUntil) { CapApp.exitApp(); return; }
    armedUntil = now + 2000;
    toast({ title: 'Press back again to exit', description: 'Your progress is saved.' });
  });
}
