// In-app Python, powered by Pyodide (Python compiled to WebAssembly).
// It runs in a Web Worker so the app stays responsive and a runaway loop can
// be stopped. The first run downloads Python (~10 MB), later runs are cached.
export const PYODIDE_VERSION = '0.27.7';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const TIME_LIMIT_MS = 20000;

const WORKER_SRC = `
importScripts(${JSON.stringify(INDEX_URL + 'pyodide.js')});
let py = null;
const RUN = \`
import builtins, sys
def __rc_input(prompt=''):
    v = __rc_inputs.pop(0) if __rc_inputs else ''
    print(str(prompt) + str(v))
    return v
builtins.input = __rc_input
\`;
const FIGS = \`
__rc_figs = []
if 'matplotlib.pyplot' in sys.modules:
    import io, base64
    import matplotlib.pyplot as __plt
    for __n in __plt.get_fignums():
        __buf = io.BytesIO()
        __plt.figure(__n).savefig(__buf, format='png', dpi=90, bbox_inches='tight')
        __rc_figs.append(base64.b64encode(__buf.getvalue()).decode())
    __plt.close('all')
__rc_figs
\`;
function cleanError(msg) {
  const lines = String(msg).split('\\n');
  const start = lines.findIndex(l => l.includes('File "<exec>"'));
  const body = start >= 0 ? lines.slice(start) : lines.slice(-3);
  return body.join('\\n').replace(/File "<exec>"/g, 'Your code').trim();
}
self.onmessage = async (e) => {
  const { code, input } = e.data;
  try {
    if (!py) {
      postMessage({ type: 'status', text: 'Starting Python (first time takes a few seconds)…' });
      py = await loadPyodide({ indexURL: ${JSON.stringify(INDEX_URL)} });
    }
    py.setStdout({ batched: s => postMessage({ type: 'out', text: s }) });
    py.setStderr({ batched: s => postMessage({ type: 'err', text: s }) });
    await py.loadPackagesFromImports(code, { messageCallback: m => { if (/Loading/.test(m)) postMessage({ type: 'status', text: m }); } });
    if (/matplotlib/.test(code)) py.runPython("import matplotlib; matplotlib.use('AGG')");
    const g = py.globals.get('dict')();
    g.set('__name__', '__main__');
    g.set('__rc_inputs', py.toPy(input ? String(input).split('\\n') : []));
    py.runPython(RUN, { globals: g });
    postMessage({ type: 'running' });
    await py.runPythonAsync(code, { globals: g });
    const figs = py.runPython(FIGS, { globals: g }).toJs();
    figs.forEach(b64 => postMessage({ type: 'img', src: 'data:image/png;base64,' + b64 }));
    g.destroy();
    postMessage({ type: 'done', ok: true });
  } catch (err) {
    postMessage({ type: 'err', text: cleanError(err && err.message || err) });
    postMessage({ type: 'done', ok: false });
  }
};
`;

let worker = null;
function getWorker() {
  if (!worker) {
    const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }));
    worker = new Worker(url);
  }
  return worker;
}

let busy = false;

/**
 * Run Python code.
 * @param {string} code
 * @param {{input?: string, onEvent: (ev: {type: string, text?: string, src?: string, ok?: boolean}) => void}} opts
 * @returns {() => void} stop function
 */
export function runPython(code, { input = '', onEvent }) {
  if (busy) { onEvent({ type: 'err', text: 'Another program is still running.' }); onEvent({ type: 'done', ok: false }); return () => {}; }
  busy = true;
  const w = getWorker();
  let timer = null;
  const finish = () => { busy = false; clearTimeout(timer); w.onmessage = null; w.onerror = null; };
  const kill = (why) => {
    finish();
    w.terminate();
    worker = null;
    onEvent({ type: 'err', text: why });
    onEvent({ type: 'done', ok: false });
  };
  w.onmessage = (e) => {
    const ev = e.data;
    if (ev.type === 'running') {
      timer = setTimeout(() => kill(`Stopped: your program ran for more than ${TIME_LIMIT_MS / 1000} seconds. Is there a loop that never ends (like while True)?`), TIME_LIMIT_MS);
      return;
    }
    if (ev.type === 'done') finish();
    onEvent(ev);
  };
  w.onerror = () => kill(navigator.onLine === false
    ? 'Python needs the internet the first time it starts. Connect and try again.'
    : 'Python could not start. Check your internet connection and try again.');
  w.postMessage({ code, input });
  return () => kill('Stopped.');
}
