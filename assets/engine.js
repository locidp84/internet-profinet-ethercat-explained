/* Tiny step-by-step animation engine (needs lang.js first).
 *
 * Elements with data-id are "actors". Position-able actors have data-x / data-y (centre of the element
 * in stage pixels), optional data-s (scale), data-r (rotation), data-o (opacity).
 * Elements with data-txt can have their innerHTML replaced ("t"); t may be T('english','magyar').
 *
 * A step = { title, text, do: [ items ] } (title/text are T(...) pairs).
 * An item = { id, x,y,s,r,o, dur, delay, ease, t, cls, rm }.
 * Going to step N = reset everything, instantly apply steps 0..N-1, then animate step N.
 * That makes "Back" and jumping around (#3 in the URL) work for free.
 */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const UI = {
    menu: T('⌂ Menu', '⌂ Menü'),
    back: T('◀ Back', '◀ Vissza'),
    prev: T('◀ Previous scene', '◀ Előző jelenet'),
    next: T('Next ▶', 'Tovább ▶'),
    restart: T('↻ Restart', '↻ Újra'),
    hide: T('Hide controls', 'Vezérlők elrejtése'),
    lang: T('🌐 Magyar', '🌐 English'),
    hint: T('→ / Space / click = next · ← = back · H = hide controls · R = restart',
            '→ / Szóköz / kattintás = tovább · ← = vissza · H = vezérlők elrejtése · R = újra'),
    menuLast: T('Menu', 'Menü'),
  };
  const go = url => { location.href = withLang(url); };

  function Scene(cfg) {
    const stage = $('#stage');
    const steps = cfg.steps;
    const els = {};
    let i = 0;
    let timers = [];

    if (cfg.pageTitle) document.title = pick(cfg.pageTitle);

    document.querySelectorAll('[data-id]').forEach(el => {
      const d = el.dataset;
      const pos = d.x !== undefined || d.y !== undefined || d.s !== undefined;
      els[d.id] = {
        el, pos,
        init: {
          x: +d.x || 0, y: +d.y || 0, s: d.s !== undefined ? +d.s : 1, r: +d.r || 0,
          o: d.o !== undefined ? +d.o : 1, html: el.innerHTML, cls: el.className
        },
        st: null
      };
    });

    function render(e, dur, ease, odur) {
      const el = e.el, s = e.st;
      el.style.transition = dur
        ? (e.pos ? `transform ${dur}ms ${ease}, ` : '') + `opacity ${odur === undefined ? dur : odur}ms ease`
        : 'none';
      void el.offsetWidth; // flush so the new transition really starts from the current state
      if (e.pos) el.style.transform = `translate(${s.x}px,${s.y}px) translate(-50%,-50%) scale(${s.s}) rotate(${s.r}deg)`;
      el.style.opacity = s.o;
    }

    function apply(it, animate) {
      const e = els[it.id];
      if (!e) { console.warn('unknown id', it.id); return; }
      for (const k of ['x', 'y', 's', 'r', 'o']) if (it[k] !== undefined) e.st[k] = it[k];
      const dur = animate ? (it.dur !== undefined ? it.dur : 900) : 0;
      render(e, dur, it.ease || 'ease-in-out', it.odur);
      if (it.t !== undefined) e.el.innerHTML = pick(it.t);
      if (it.cls) it.cls.split(' ').forEach(c => e.el.classList.add(c));
      if (it.rm) it.rm.split(' ').forEach(c => e.el.classList.remove(c));
    }

    function reset() {
      for (const id in els) {
        const e = els[id];
        e.st = Object.assign({}, e.init);
        e.el.className = e.init.cls;
        if (e.el.hasAttribute('data-txt')) e.el.innerHTML = e.init.html;
        render(e, 0);
      }
    }

    const byDelay = list => list.map((x, n) => [x, n]).sort((a, b) => ((a[0].delay || 0) - (b[0].delay || 0)) || (a[1] - b[1])).map(p => p[0]);

    function goto(n, animate = true) {
      n = Math.max(0, Math.min(steps.length - 1, n));
      timers.forEach(clearTimeout); timers = [];
      reset();
      for (let k = 0; k < n; k++) byDelay(steps[k].do || []).forEach(it => apply(it, false));
      const cur = byDelay(steps[n].do || []);
      cur.forEach(it => {
        const d = it.delay || 0;
        if (!animate) apply(it, false);
        else if (d > 0) timers.push(setTimeout(() => apply(it, true), d));
        else apply(it, true);
      });
      i = n;
      caption(); dots(); controls();
      try { history.replaceState(null, '', location.search + '#' + (n + 1)); } catch (e) { }
    }

    function caption() {
      const s = steps[i], cap = $('#cap');
      $('#capT').innerHTML = pick(s.title) || '';
      $('#capP').innerHTML = pick(s.text) || '';
      cap.classList.remove('pop'); void cap.offsetWidth; cap.classList.add('pop');
    }

    function dots() {
      const box = $('#dots');
      if (!box.children.length) steps.forEach(() => box.appendChild(document.createElement('i')));
      [...box.children].forEach((d, k) => d.className = k < i ? 'done' : (k === i ? 'cur' : ''));
      $('#count').textContent = (i + 1) + ' / ' + steps.length;
    }

    // ---------- controls ----------
    const ctl = document.createElement('div');
    ctl.className = 'ctl'; ctl.id = 'ctl';
    ctl.innerHTML =
      `<a href="${withLang(cfg.home || 'index.html')}">${pick(UI.menu)}</a>` +
      `<button id="bBack"></button>` +
      `<button id="bNext" class="primary"></button>` +
      `<button id="bRestart" title="R">${pick(UI.restart)}</button>` +
      `<button id="bLang" title="EN / HU">${pick(UI.lang)}</button>` +
      `<button id="bHide" title="H">${pick(UI.hide)}</button>`;
    document.body.appendChild(ctl);
    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = pick(UI.hint);
    document.body.appendChild(hint);

    function controls() {
      const last = i === steps.length - 1;
      $('#bNext').textContent = last ? pick(cfg.nextLabel || UI.menuLast) + ' ▶' : pick(UI.next);
      $('#bBack').style.visibility = (i === 0 && !cfg.prev) ? 'hidden' : 'visible';
      $('#bBack').textContent = pick((i === 0 && cfg.prev) ? UI.prev : UI.back);
    }

    function next() {
      if (i < steps.length - 1) goto(i + 1);
      else go(cfg.next || cfg.home || 'index.html');
    }
    function back() {
      if (i > 0) goto(i - 1);
      else if (cfg.prev) go(cfg.prev + '#99');
    }

    $('#bNext').onclick = e => { e.stopPropagation(); next(); };
    $('#bBack').onclick = e => { e.stopPropagation(); back(); };
    $('#bRestart').onclick = e => { e.stopPropagation(); goto(0); };
    $('#bLang').onclick = e => { e.stopPropagation(); switchLang(); };
    $('#bHide').onclick = e => { e.stopPropagation(); ctl.classList.add('hidden'); };
    ctl.addEventListener('click', e => e.stopPropagation());
    stage.addEventListener('click', next);

    window.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowRight' || k === ' ' || k === 'Enter' || k === 'PageDown') { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft' || k === 'Backspace' || k === 'PageUp') { e.preventDefault(); back(); }
      else if (k === 'r' || k === 'R') goto(0);
      else if (k === 'h' || k === 'H') ctl.classList.toggle('hidden');
      else if (k === 'Home') goto(0);
      else if (k === 'End') goto(steps.length - 1);
    });

    if (/[?&]clean/.test(location.search)) document.body.classList.add('clean');

    function fit() {
      const k = Math.min(innerWidth / 1280, innerHeight / 720);
      stage.style.transform = `translate(-50%,-50%) scale(${k})`;
    }
    window.addEventListener('resize', fit); fit();

    let start = parseInt((location.hash || '').slice(1), 10);
    if (isNaN(start)) start = 1;
    goto(Math.min(start, steps.length) - 1, true);
    window.__scene = { goto, next, back };
    return window.__scene;
  }

  window.Scene = Scene;
})();
