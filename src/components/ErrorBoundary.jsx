import React from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

/** True when a lazily-loaded screen could not be fetched — almost always
 *  because a new version was deployed and the old chunk file is gone. */
export function isStaleChunkError(err) {
  const m = String(err?.message || err || '');
  return /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk \d+ failed/i.test(m);
}

const RELOAD_KEY = 'rc_chunk_reload';

/**
 * Catches a rendering error and shows a way out instead of a blank page.
 * `resetKey` (the route path) clears the error when the user navigates.
 * `compact` renders a small inline card for one widget rather than a full screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  componentDidCatch(error, info) {
    // A stale chunk after a deploy fixes itself with one reload.
    if (isStaleChunkError(error)) {
      try {
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, '1');
          window.location.reload();
          return;
        }
      } catch { /* storage unavailable */ }
    }
    if (import.meta.env?.DEV) console.error('Caught by ErrorBoundary:', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const stale = isStaleChunkError(error);
    const title = stale ? 'A new version is ready' : 'Something went wrong';
    const body = stale
      ? 'RoboCraft was updated while you had it open. Reload to get the new version — your progress is safe.'
      : (this.props.message || 'This part of the app hit an error. Your progress is saved — you can reload or go back home.');

    const reload = () => { try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ } window.location.reload(); };
    const home = () => { try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ } window.location.href = import.meta.env.BASE_URL || '/'; };

    if (this.props.compact) {
      return (
        <div className="glass-strong rounded-2xl p-4 text-center my-3">
          <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{body}</p>
          <div className="flex gap-2 justify-center mt-3">
            <button onClick={() => this.setState({ error: null })} className="px-3 py-2 rounded-xl glass text-xs font-bold">Try again</button>
            <button onClick={reload} className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">Reload</button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="glass-strong rounded-3xl p-6 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{body}</p>
          <div className="flex gap-2 mt-5">
            <button onClick={home} className="flex-1 py-2.5 rounded-xl glass text-sm font-bold flex items-center justify-center gap-1.5">
              <Home className="w-4 h-4" /> Home
            </button>
            <button onClick={reload} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1.5">
              <RotateCw className="w-4 h-4" /> Reload
            </button>
          </div>
          {!stale && (
            <p className="text-[10px] text-muted-foreground mt-4">
              If this keeps happening, please report it from Settings so we can fix it.
            </p>
          )}
        </div>
      </div>
    );
  }
}
