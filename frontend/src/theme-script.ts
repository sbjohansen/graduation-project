const theme = (() => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('vite-ui-theme')) {
    return localStorage.getItem('vite-ui-theme');
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
})();

if (theme === 'light') {
  document.documentElement.classList.add('light');
} else if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}
