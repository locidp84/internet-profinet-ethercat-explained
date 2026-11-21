/* Language layer: Hungarian (default) / English.
 * Static text is written twice in the HTML: <span class="en">..</span><span class="hu">..</span>
 * Dynamic text (animation steps) uses T('english', 'magyar').
 * Language comes from ?lang=hu|en, else localStorage, else Hungarian. */
(function () {
  var LANG = 'hu';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'hu') {
      LANG = q;
      try { localStorage.setItem('lang', q); } catch (e) { }
    } else {
      var s = localStorage.getItem('lang');
      if (s === 'en' || s === 'hu') LANG = s;
    }
  } catch (e) { }
  document.documentElement.lang = LANG;
  document.body.classList.add('lang-' + LANG);

  window.LANG = LANG;
  window.T = function (en, hu) { return { en: en, hu: hu }; };
  window.pick = function (x) { return (x && typeof x === 'object' && 'en' in x) ? x[LANG] : x; };
  window.withLang = function (url) {
    var p = url.split('#'), base = p[0];
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + LANG + (p[1] !== undefined ? '#' + p[1] : '');
  };
  window.switchLang = function () {
    var o = LANG === 'hu' ? 'en' : 'hu';
    try { localStorage.setItem('lang', o); } catch (e) { }
    var u = new URL(location.href);
    u.searchParams.set('lang', o);
    location.href = u.toString();
  };
})();
