// Amivi — legal pages: German/English switch.
//
// Every page carries both languages ([data-l="de"] / [data-l="en"]); this
// script picks one and legal.css hides the other. Loaded in <head> so the
// right language is set before anything is drawn.
//
// Order: ?lang=de|en in the URL (so a link can ask for a language), then the
// visitor's last choice, then the browser language (German → de, else en).
(function () {
  var KEY = 'amivi-legal-lang';
  var root = document.documentElement;

  function valid(l) { return l === 'de' || l === 'en'; }

  function store(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
  }

  function pick() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (valid(q)) { store(q); return q; }
    } catch (e) {}
    try {
      var s = localStorage.getItem(KEY);
      if (valid(s)) return s;
    } catch (e) {}
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^de\b/i.test(n) ? 'de' : 'en';
  }

  function apply(l) {
    root.setAttribute('data-lang', l);
    root.lang = l;
    var body = document.body;
    if (!body) return;
    var title = body.getAttribute('data-title-' + l);
    if (title) document.title = title;
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-lang') === l));
    }
  }

  function choose(l) {
    apply(l);
    store(l);
    try {
      var url = new URL(location.href);
      url.searchParams.set('lang', l);
      history.replaceState(null, '', url);
    } catch (e) {}
  }

  apply(pick());

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-lang'));
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        choose(this.getAttribute('data-set-lang'));
      });
    }
  });
})();
