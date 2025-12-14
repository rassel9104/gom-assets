/*!
 * Garden of Manors — Properties (Mobile Drawer)
 * Purpose:
 *  - On /properties (html.multipropertyindex) and <=768px:
 *    - Show a fixed mini-bar under the header with Arrival–Departure summary
 *    - Tap to expand/collapse a drawer containing:
 *        - Page H2 (count + sort)
 *        - Search widget (Arrival, Departure, Search)
 *  - Keeps elements inside the /properties <form> so submission still works.
 *  - Does NOT affect desktop.
 */
(function () {
  'use strict';


  // ---- Drawer footer (customize) ----
  var GOM_DRAWER_HOME_URL = 'https://gardenofmanors.com';
  var GOM_DRAWER_LOGO_URL = 'https://uc.orez.io/f/d75e4c3b34dc403398973f84d1b60318';
  var GOM_DRAWER_TAGLINE = 'Book direct for best availability · Fast support · No surprises';
  var GOM_DRAWER_COPYRIGHT = 'All rights reserved ®';

  var GOM_DRAWER_WA_URL = 'https://wa.me/17863887255?text=Hello%20%E2%80%94%20I%27d%20like%20to%20inquire%20about%20Garden%20of%20Manors.';
  var GOM_DRAWER_WA_LABEL = 'WhatsApp';
  var ROOT = document.documentElement;
  var MOBILE_MQ = '(max-width: 768px)';
  var drawerId = 'gom-prop-drawer';
  var enabled = false;

  var moved = {
    h2: null, h2Marker: null, h2Parent: null,
    search: null, searchMarker: null, searchParent: null
  };

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function closest(el, sel) {
    if (!el) return null;
    if (el.closest) return el.closest(sel);
    while (el && el.nodeType === 1) {
      if (matches(el, sel)) return el;
      el = el.parentNode;
    }
    return null;
  }

  function matches(el, sel) {
    var p = Element.prototype;
    var fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector;
    return fn ? fn.call(el, sel) : false;
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia(MOBILE_MQ).matches;
  }

  function setCssVar(name, val) {
    ROOT.style.setProperty(name, val);
  }

  function headerHeight() {
    var hdr = document.getElementById('header-bar');
    if (!hdr) return 96;
    var r = hdr.getBoundingClientRect();
    return Math.max(40, Math.min(180, Math.round(r.height)));
  }

  function ensureVars() {
    setCssVar('--gom-hdr-h', headerHeight() + 'px');
  }

  function findTargets() {
    // Scope: /properties page only
    if (!ROOT.classList.contains('multipropertyindex')) return null;

    var form = qs('form[action="/properties"]');
    if (!form) return null;

    var h2 =
      qs('form[action="/properties"] > .row > .col-xs-12 > h2') ||
      qs('form[action="/properties"] > .row > .col-12 > h2');

    var search = qs('#search-bar-widget', form);
    if (!h2 || !search) return null;

    return { form: form, h2: h2, search: search };
  }

  function makeMarker(label) {
    return document.createComment(' ' + label + ' ');
  }

  function moveIntoDrawer(el, key, drawerContent) {
    if (!el || !el.parentNode) return;

    var marker = makeMarker('gom:' + key);
    var parent = el.parentNode;

    parent.insertBefore(marker, el);

    moved[key] = el;
    moved[key + 'Marker'] = marker;
    moved[key + 'Parent'] = parent;

    drawerContent.appendChild(el);
  }

  function restoreFromDrawer(key) {
    var el = moved[key];
    var marker = moved[key + 'Marker'];
    var parent = moved[key + 'Parent'];

    if (!el || !marker || !parent) return;

    parent.insertBefore(el, marker);
    marker.parentNode && marker.parentNode.removeChild(marker);

    moved[key] = null;
    moved[key + 'Marker'] = null;
    moved[key + 'Parent'] = null;
  }

  function formatSummary(arr, dep) {
    var a = (arr || '').trim();
    var d = (dep || '').trim();

    if (!a && !d) return 'Select dates';
    if (a && !d) return a + ' → …';
    if (!a && d) return '… → ' + d;

    // Optional nights calc (mm/dd/yyyy)
    function parseMDY(s) {
      var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return null;
      var mm = parseInt(m[1], 10) - 1;
      var dd = parseInt(m[2], 10);
      var yy = parseInt(m[3], 10);
      var dt = new Date(yy, mm, dd);
      return isNaN(dt.getTime()) ? null : dt;
    }
    var da = parseMDY(a);
    var ddp = parseMDY(d);

    if (da && ddp) {
      var nights = Math.round((ddp - da) / 86400000);
      if (isFinite(nights) && nights > 0 && nights < 60) {
        return a + ' → ' + d + ' · ' + nights + ' night' + (nights === 1 ? '' : 's');
      }
    }
    return a + ' → ' + d;
  }

  function buildDrawer(targets) {
    var form = targets.form;

    // Prevent double build
    if (qs('#' + drawerId, form)) return qs('#' + drawerId, form);

    var drawer = document.createElement('div');
    drawer.id = drawerId;
    drawer.className = 'gom-prop-drawer';

    drawer.innerHTML = ''
      + '<button type="button" class="gom-prop-drawer__toggle" aria-expanded="false">'
      + '  <span class="gom-prop-drawer__label">DATES</span>'
      + '  <span class="gom-prop-drawer__summary" id="gom-prop-drawer-summary">Select dates</span>'
      + '  <span class="gom-prop-drawer__chev" aria-hidden="true">▾</span>'
      + '</button>'
      + '<div class="gom-prop-drawer__panel" aria-hidden="true">'
      + '  <div class="gom-prop-drawer__panel-inner"></div>'
      + '</div>';

    // Insert at top of the form (keeps inputs inside form)
    form.insertBefore(drawer, form.firstChild);

    return drawer;
  }

  function attachBehavior(drawer) {
    var toggle = qs('.gom-prop-drawer__toggle', drawer);
    var panel = qs('.gom-prop-drawer__panel', drawer);
    var chev = qs('.gom-prop-drawer__chev', drawer);
    var summaryEl = qs('#gom-prop-drawer-summary', drawer);

    function setOpen(open) {
      drawer.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (chev) chev.textContent = open ? '▴' : '▾';

      // Avoid background scroll when open (optional premium feel)
      if (open) {
        document.body.classList.add('gom-prop-drawer-open');
      } else {
        document.body.classList.remove('gom-prop-drawer-open');
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });

    // Close on outside tap (ignore datepickers/dropdowns that may be appended to <body>)
    document.addEventListener('click', function (e) {
      if (!isMobile()) return;
      if (!drawer.classList.contains('is-open')) return;
      if (drawer.contains(e.target)) return;

      // Bootstrap Datepicker / dropdown menus often live outside the drawer
      if (closest(e.target, '.datepicker, .datepicker-dropdown, .dropdown-menu, .ui-datepicker')) return;

      setOpen(false);
    }, true);

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        setOpen(false);
      }
    });

    // Update summary from inputs
    function syncSummary() {
      var a = qs('#ArrivalDate');
      var d = qs('#DepartureDate');
      var txt = formatSummary(a && a.value, d && d.value);
      if (summaryEl) summaryEl.textContent = txt;
    }

    // Bind input changes
    ['change', 'input'].forEach(function (evt) {
      var a = qs('#ArrivalDate');
      var d = qs('#DepartureDate');
      a && a.addEventListener(evt, syncSummary);
      d && d.addEventListener(evt, syncSummary);
    });

    // First paint
    syncSummary();

    return { setOpen: setOpen, syncSummary: syncSummary };
  }

  function enable() {
    if (enabled) return;

    var targets = findTargets();
    if (!targets) return;

    ensureVars();

    // Mark doc for CSS scoping
    ROOT.classList.add('gom-drawer-on');

    // Build drawer
    var drawer = buildDrawer(targets);
    var panelInner = qs('.gom-prop-drawer__panel-inner', drawer);

    // Move targets into drawer panel
    moveIntoDrawer(targets.h2, 'h2', panelInner);
    moveIntoDrawer(targets.search, 'search', panelInner);
    // Footer block to avoid "empty" lower area and keep brand presence
    try {
      var year = (new Date()).getFullYear();

      // Avoid duplicating footer if enable() runs again
      if (!panelInner.querySelector('.gom-prop-drawer__footer')) {
        var footer = document.createElement('div');
        footer.className = 'gom-prop-drawer__footer';

        footer.innerHTML =
          '<a class="gom-prop-drawer__brand" href="' + GOM_DRAWER_HOME_URL + '" aria-label="Garden of Manors Home">' +
          '<img class="gom-prop-drawer__brand-img" src="' + GOM_DRAWER_LOGO_URL + '" alt="Garden of Manors">' +
          '</a>' +
          '<div class="gom-prop-drawer__tagline">' + GOM_DRAWER_TAGLINE + '</div>' +
          '<a class="gom-prop-drawer__wa" rel="noopener" target="_blank" href="' + GOM_DRAWER_WA_URL + '">' +
          GOM_DRAWER_WA_LABEL +
          '</a>' +
          '<small class="gom-prop-drawer__copy">© ' + year + ' Garden of Manors · ' + GOM_DRAWER_COPYRIGHT + '</small>';

        panelInner.appendChild(footer);
      }
    } catch (e) { /* noop */ }
    // Attach behavior
    attachBehavior(drawer);

    // Ensure header var updates on resize
    window.addEventListener('resize', ensureVars);
    window.addEventListener('orientationchange', ensureVars);

    enabled = true;
  }

  function disable() {
    if (!enabled) return;

    var form = qs('form[action="/properties"]');
    if (!form) return;

    var drawer = qs('#' + drawerId, form);
    if (drawer) {
      // Restore moved nodes
      restoreFromDrawer('h2');
      restoreFromDrawer('search');

      // Remove drawer
      drawer.parentNode && drawer.parentNode.removeChild(drawer);
    }

    ROOT.classList.remove('gom-drawer-on');
    document.body.classList.remove('gom-prop-drawer-open');

    enabled = false;
  }

  function boot() {
    if (!ROOT.classList.contains('multipropertyindex')) return;

    if (isMobile()) enable();
    else disable();
  }

  document.addEventListener('DOMContentLoaded', boot);
  window.addEventListener('resize', boot);
})();
