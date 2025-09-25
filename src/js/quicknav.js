// Accessible quick navigation command palette (Cmd/Ctrl+K)
export function initQuickNav({ trigger, routes }) {
  const backdrop = document.querySelector('.cmdk-backdrop');
  const dialog = document.querySelector('.cmdk');
  const input = document.getElementById('cmdk-input');
  const list = document.getElementById('cmdk-list');

  if (!backdrop || !dialog || !input || !list) return;

  let isOpen = false;
  let activeIndex = 0;
  let filtered = routes.slice();

  function render(items) {
    list.innerHTML = '';
    items.forEach((r, i) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
      li.tabIndex = -1;
      li.innerHTML = `<span>${r.label}</span><kbd>${r.hint ?? ''}</kbd>`;
      li.addEventListener('click', () => {
        window.location.href = r.url;
      });
      list.appendChild(li);
    });
  }

  function open() {
    isOpen = true;
    backdrop.hidden = false;
    dialog.hidden = false;
    input.value = '';
    filtered = routes.slice();
    activeIndex = 0;
    render(filtered);
    input.focus();
  }

  function close() {
    isOpen = false;
    backdrop.hidden = true;
    dialog.hidden = true;
  }

  function move(delta) {
    if (!filtered.length) return;
    activeIndex = (activeIndex + delta + filtered.length) % filtered.length;
    render(filtered);
  }

  function activate() {
    if (!filtered[activeIndex]) return;
    window.location.href = filtered[activeIndex].url;
  }

  function onKeyDown(e) {
    // Open with Cmd/Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      isOpen ? close() : open();
    }

    // Single-letter hints (G, P, A, C)
    if (isOpen && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const k = e.key.toUpperCase();
      const hit = routes.find((r) => r.hint?.toUpperCase() === k);
      if (hit) {
        e.preventDefault();
        window.location.href = hit.url;
      }
    }

    if (!isOpen) return;

    // Palette navigation
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      activate();
    }
  }

  function onInput() {
    const q = input.value.toLowerCase().trim();
    filtered = routes.filter((r) => r.label.toLowerCase().includes(q));
    activeIndex = 0;
    render(filtered);
  }

  document.addEventListener('keydown', onKeyDown);
  input.addEventListener('input', onInput);
  backdrop.addEventListener('click', close);
  trigger?.addEventListener('click', open);
}
