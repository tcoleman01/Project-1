import { initQuickNav } from './quicknav.js';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Original JS component: a Cmd/Ctrl+K “Quick Nav” palette (>5 lines).
initQuickNav({
  trigger: document.getElementById('open-cmdk'),
  routes: [
    { label: 'Home', url: 'index.html', hint: 'G' },
    { label: 'Projects', url: 'projects.html', hint: 'P' },
    { label: 'AI Page', url: 'ai.html', hint: 'A' },
    { label: 'Contact (on Home)', url: 'index.html#contact', hint: 'C' }
  ]
});
