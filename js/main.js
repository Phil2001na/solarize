/* =========================================================
   SOLARIZE — interactions
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- Loader ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(function () { loader.classList.add('is-done'); }, reduceMotion ? 0 : 650);
  });

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById('nav');
  function onScrollNav() {
    if (window.scrollY > 24) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  }
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var overlay = document.getElementById('overlay');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
  }
  function toggleMenu() {
    var open = document.body.classList.toggle('menu-open');
    hamburger.setAttribute('aria-expanded', String(open));
    overlay.setAttribute('aria-hidden', String(!open));
  }
  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (overlay) {
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeLightbox(); }
  });

  /* ---------- Reveal on scroll (getBoundingClientRect, not IO) ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function checkReveals() {
    var vh = window.innerHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var top = el.getBoundingClientRect().top;
      if (top < vh - 70) {
        el.classList.add('is-in');
        reveals.splice(i, 1);
      }
    }
  }

  /* ---------- Count-up stats ---------- */
  var counted = false;
  function runCounts() {
    if (counted) return;
    var stats = document.querySelector('.stats');
    if (!stats) return;
    if (stats.getBoundingClientRect().top > window.innerHeight - 80) return;
    counted = true;
    document.querySelectorAll('.stat__num').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Scroll handler ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollNav();
      checkReveals();
      runCounts();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', checkReveals, { passive: true });
  checkReveals();
  runCounts();

  /* ---------- Cursor spotlight on category cards (desktop only) ---------- */
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Quote form → WhatsApp ---------- */
  // PLACEHOLDER: replace with real WhatsApp number
  var WA_NUMBER = '264810000000';
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('qName').value || '').trim();
      var interest = document.getElementById('qInterest').value || '';
      var msg = (document.getElementById('qMsg').value || '').trim();
      if (!name || !interest) {
        if (!name) document.getElementById('qName').focus();
        else document.getElementById('qInterest').focus();
        return;
      }
      var text = 'Hi Solarize! I\'m ' + name + '.';
      text += '\nI\'m interested in: ' + interest + '.';
      if (msg) text += '\nDetails: ' + msg;
      text += '\nCould you send me a quote?';
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Lightbox (gallery) ---------- */
  var lightbox = document.getElementById('lightbox');
  var stage = document.getElementById('lightboxStage');
  var closeBtn = document.getElementById('lightboxClose');
  function openLightbox(node) {
    if (!lightbox || !stage) return;
    stage.className = 'lightbox__stage';
    stage.removeAttribute('data-label');
    // Clone the placeholder/image look into the stage
    var img = node.querySelector('img');
    if (img) {
      stage.innerHTML = '<img src="' + img.src + '" alt="' + (img.alt || '') + '" style="width:100%;height:100%;object-fit:cover;">';
    } else {
      stage.classList.add('ph');
      stage.setAttribute('data-label', node.getAttribute('data-label') || 'Photo');
      stage.innerHTML = '';
    }
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('.gallery__item').forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
