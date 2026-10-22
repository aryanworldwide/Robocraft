// WebView / app-wrapper platform detection + download/TTS helpers.
// The Android wrapper (Appilix) runs the app in a WebView: userAgent contains
// "; wv)" or an Appilix "App<N>" token.

export const isInApp = typeof navigator !== 'undefined' &&
  (/\bApp\d+\b/.test(navigator.userAgent) || navigator.userAgent.includes('; wv)'));

export const canShareFiles = typeof navigator !== 'undefined' &&
  typeof navigator.share === 'function' && typeof navigator.canShare === 'function';

// True inside the Capacitor Android app (built from this repo).
export const isNative = typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.();

// Native Google sign-in is compiled into the Android app only when the build has
// android-config/google-services.json (see .github/workflows/build-apk.yml).
export const nativeGoogle = isNative && import.meta.env.VITE_NATIVE_GOOGLE === '1';

// True in browsers, on iPhone and (via lib/speechPolyfill.js) in the Android app.
export const hasSpeech = typeof window !== 'undefined' && ('speechSynthesis' in window || !!window.Capacitor?.isNativePlatform?.());

/**
 * Download a file in the browser, or share/open it when running inside the
 * Android WebView (WebViews block direct downloads). Always reports via toast.
 * @param {Blob} blob  the file bytes
 * @param {string} filename  name with extension
 * @param {string} [mimeType] override for the File type when sharing
 */
export async function downloadFile(blob, filename, mimeType) {
  const { toast } = await import('@/components/ui/use-toast');
  try {
    if (isNative) {
      // Android app: write the file to the cache folder, then open the system
      // share sheet so the student can save it to Files / Drive / WhatsApp.
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(',')[1]);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
      const saved = await Filesystem.writeFile({ path: filename, data: base64, directory: Directory.Cache });
      try {
        await Share.share({ title: filename, url: saved.uri, dialogTitle: 'Save or share ' + filename });
      } catch (e) {
        if (!/cancel/i.test(e?.message || '')) throw e;
        return false;
      }
      return true;
    }
    if (isInApp) {
      const file = new File([blob], filename, { type: mimeType || blob.type || 'application/octet-stream' });
      if (canShareFiles && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return true;
        } catch (e) {
          if (e && e.name === 'AbortError') return false; // user cancelled — not an error
          throw e;
        }
      }
      // No file share support — open in a viewable page instead
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      toast({ title: 'File opened', description: 'Tap the share icon to save it.' });
      return true;
    }
    // Normal browser download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast({ title: 'Downloaded', description: filename });
    return true;
  } catch (err) {
    toast({ title: 'Download failed', description: 'Something went wrong — please try again.', variant: 'destructive' });
    return false;
  }
}
