/*!
 * Garden of Manors — Properties Enhancements (pills + header fix + z-index safety)
 * Scope: runs ONLY on pages with html.multipropertyindex
 * Version: 1.0.0
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function injectStyleOnce(id, cssText) {
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(cssText));
    document.head.appendChild(style);
  }

  onReady(function () {
    if (!document.documentElement.classList.contains('multipropertyindex')) return;

    // 1) Safety: keep the native OR mobile menu overlay closable above the drawer
    injectStyleOnce('gom-prop-zfix', `
      @media (max-width:768px){
        html.multipropertyindex #header-menu-phone-container{ z-index: 9990 !important; }
        html.multipropertyindex #header-bar .header-phone a.header-menu-toggle{ z-index: 9995 !important; }
        html.multipropertyindex .gom-prop-drawer,
        html.multipropertyindex .gom-prop-drawer__bar,
        html.multipropertyindex .gom-prop-drawer__panel{ z-index: 9980 !important; }
      }
    `);

    // 2) Convert amenity-summary-size text nodes into .gom-pill spans (keeps existing spans)
    try {
      var blocks = document.querySelectorAll('.amenity-summary-size');
      blocks.forEach(function (el) {
        var nodes = Array.prototype.slice.call(el.childNodes);
        nodes.forEach(function (n) {
          if (n.nodeType !== 3) return; // only text nodes

          var raw = (n.textContent || '').replace(/\s+/g, ' ').trim();
          if (!raw) { if (n.parentNode) n.parentNode.removeChild(n); return; }

          var parts = raw.split('•').map(function (s) { return s.trim(); }).filter(Boolean);
          if (!parts.length) { if (n.parentNode) n.parentNode.removeChild(n); return; }

          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p || p === '-' || p === '–') return;
            var span = document.createElement('span');
            span.className = 'gom-pill';
            span.textContent = p;
            frag.appendChild(span);
          });

          n.replaceWith(frag);
        });

        // Existing spans become pills too
        el.querySelectorAll('span').forEach(function (s) {
          s.classList.add('gom-pill');
          s.textContent = (s.textContent || '').replace(/\s+/g, ' ').trim();
        });
      });
    } catch (e) { /* noop */ }

    // 3) Keep mobile header visible: remove sticky-top class that hides it (OR theme behavior)
    (function () {
      function fixMobileHeader() {
        if (!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) return;
        document.querySelectorAll('.header-container.sticky-top').forEach(function (el) {
          el.classList.remove('sticky-top');
        });
      }
      function onScroll() { requestAnimationFrame(fixMobileHeader); }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', fixMobileHeader);
      fixMobileHeader();
    })();
  });
})();

(function () {
  function unlockIfGhostOpen() {
    var mc = document.querySelector('#header-menu-phone-container');
    if (!mc) return;
    var isActuallyOpen = mc.classList.contains('in');
    if (!isActuallyOpen && document.body.classList.contains('menu-open')) {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
  }
  window.addEventListener('click', function () { setTimeout(unlockIfGhostOpen, 50); }, true);
  window.addEventListener('resize', unlockIfGhostOpen);
  document.addEventListener('DOMContentLoaded', unlockIfGhostOpen);
})();
