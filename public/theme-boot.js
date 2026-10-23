/* Applies the saved light/dark choice before the first paint (no theme flash). */
(function () {
  try {
    var t = localStorage.getItem('robocraft_theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
