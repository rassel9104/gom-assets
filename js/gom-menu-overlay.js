/*!
 * Garden of Manors — Unified Menu Overlay (Desktop + Mobile)
 * v2.1.1
 * Changes:
 *  2) Desktop footer "signature": logo bottom-right only; rest centered
 *  3) Titles clickable WITHOUT "open" hint
 *  4) Mobile: 2 columns + smaller typography (handled in CSS)
 *  5) Keeps /properties drawer compatibility (stopImmediatePropagation + close drawer)
 */
(function () {
    'use strict';

    var OVERLAY_ID = 'gom-menu-overlay';
    var CSS_LINK_ID = 'gom-menu-overlay-css-link';
    var MOBILE_MQ = '(max-width: 768px)';

    var BRAND = {
        homeUrl: '/',
        logo: 'https://uc.orez.io/f/d75e4c3b34dc403398973f84d1b60318',
        brandName: 'Garden of Manors',
        tagline: 'HEATED SALTWATER POOL · TROPICAL GARDENS · STEPS TO WILTON DRIVE',
        waLabel: 'WhatsApp',
        waUrl: 'https://wa.me/17863887255?text=Hello%20%E2%80%94%20I%27d%20like%20to%20inquire%20about%20Garden%20of%20Manors.'
    };

    function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    function isMobile() {
        return window.matchMedia && window.matchMedia(MOBILE_MQ).matches;
    }

    function getSelfSrc() {
        var cs = document.currentScript;
        if (cs && cs.src) return cs.src;

        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            var src = scripts[i].src || '';
            if (src.indexOf('gom-menu-overlay.js') > -1) return src;
        }
        return '';
    }

    function getSourceRoot() {
        var desktop = document.querySelector('.header.header-desktop .header-links > ul.list-inline');
        if (desktop) return desktop;

        var mobile = document.querySelector('#header-menu-phone-container > ul');
        return mobile || null;
    }

    function parseMenu() {
        var root = getSourceRoot();
        if (!root) return [];

        var items = Array.prototype.slice.call(root.querySelectorAll('li.header-links-menu'));
        return items.map(function (li) {
            var main = li.querySelector('a:not(.dropdown-toggle)');
            var title = (main ? main.textContent : '').trim() || 'Menu';
            var mainHref = (main && main.getAttribute('href')) ? main.getAttribute('href') : '#';

            var links = Array.prototype.slice.call(li.querySelectorAll('.dropdown-menu a')).map(function (a) {
                return {
                    text: (a.textContent || '').trim(),
                    href: a.getAttribute('href') || '#'
                };
            });

            if (!links.length && main && mainHref && mainHref !== '#') {
                links = [{ text: title, href: mainHref }];
            }

            return { title: title, mainHref: mainHref, links: links };
        });
    }

    function buildOverlayOnce() {
        var existing = document.getElementById(OVERLAY_ID);
        if (existing) return existing;

        var ov = document.createElement('div');
        ov.id = OVERLAY_ID;
        ov.setAttribute('role', 'dialog');
        ov.setAttribute('aria-modal', 'true');
        ov.setAttribute('aria-label', 'Menu');

        var year = (new Date()).getFullYear();

        ov.innerHTML = `
      <div class="gom-ov-wrap">
        <div class="gom-ov-top">
          <div class="gom-ov-mark">Menu</div>
          <button type="button" class="gom-ov-close">CLOSE ▲</button>
        </div>

        <div class="gom-ov-grid" id="gom-ov-grid"></div>
      </div>

      <!-- Brand footer (centered content) -->
      <div class="gom-ov-brand">
        <a href="${BRAND.homeUrl}" aria-label="${BRAND.brandName}">
          <img class="gom-ov-logo" src="${BRAND.logo}" alt="${BRAND.brandName}">
        </a>
        <div class="gom-ov-tagline">${BRAND.tagline}</div>
        <a class="gom-ov-wa" rel="noopener" target="_blank" href="${BRAND.waUrl}">${BRAND.waLabel}</a>
        <small class="gom-ov-copy">© ${year} ${BRAND.brandName} · All rights reserved ®</small>
      </div>

      <!-- Desktop signature logo -->
      <a class="gom-ov-sig" href="${BRAND.homeUrl}" aria-label="${BRAND.brandName}">
        <img src="${BRAND.logo}" alt="${BRAND.brandName}">
      </a>
    `;

        // Click outside closes
        ov.addEventListener('click', function (e) {
            if (e.target === ov) closeOverlay();
        });

        // Close button
        ov.querySelector('.gom-ov-close').addEventListener('click', closeOverlay);

        // ESC closes
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeOverlay();
        });

        // H3 click navigates
        ov.addEventListener('click', function (e) {
            var h3 = e.target && e.target.closest ? e.target.closest('.gom-ov-h3') : null;
            if (!h3) return;
            var href = h3.getAttribute('data-href') || '#';
            if (href && href !== '#') window.location.href = href;
        });

        // Keyboard support for titles
        ov.addEventListener('keydown', function (e) {
            var h3 = e.target && e.target.closest ? e.target.closest('.gom-ov-h3') : null;
            if (!h3) return;
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            var href = h3.getAttribute('data-href') || '#';
            if (href && href !== '#') window.location.href = href;
        });

        document.body.appendChild(ov);
        return ov;
    }

    function distributeIntoColumns(sections, colCount) {
        var cols = [];
        for (var i = 0; i < colCount; i++) cols.push([]);
        for (var j = 0; j < sections.length; j++) cols[j % colCount].push(sections[j]);
        return cols;
    }

    function renderOverlay() {
        var ov = buildOverlayOnce();
        var grid = ov.querySelector('#gom-ov-grid');
        if (!grid) return;

        var data = parseMenu();

        // Desktop 3 cols, Mobile 2 cols, Tablets 1 col
        var colCount = (window.innerWidth >= 992) ? 3 : (isMobile() ? 2 : 1);
        var cols = distributeIntoColumns(data, colCount);

        grid.innerHTML = cols.map(function (col) {
            var html = col.map(function (sec) {
                var links = (sec.links || []).map(function (l) {
                    var href = l.href || '#';
                    var text = l.text || href;
                    return `<a href="${href}">${text}</a>`;
                }).join('');

                // Titles clickable; no "open" indicator
                return `
          <div class="gom-ov-sec">
            <div class="gom-ov-h3" data-href="${sec.mainHref || '#'}" role="link" tabindex="0">
              ${sec.title}
            </div>
            <div class="gom-ov-links">${links}</div>
          </div>
        `;
            }).join('');

            return `<div class="gom-ov-col">${html}</div>`;
        }).join('');
    }

    function closePropertiesDrawerIfAny() {
        try {
            if (window.GOMPropDrawer && typeof window.GOMPropDrawer.close === 'function') {
                window.GOMPropDrawer.close();
            }
            document.body.classList.remove('gom-prop-drawer-open');
        } catch (e) { }
    }

    function hardUnlock() {
        var ov = document.getElementById(OVERLAY_ID);
        if (ov) ov.classList.remove('is-open');
        document.documentElement.classList.remove('gom-ov-open');
        document.body.classList.remove('gom-ov-open');
        var btn = document.querySelector('.header-menu-toggle');
        if (btn) btn.classList.remove('menu-is-active');
    }

    function openOverlay() {
        closePropertiesDrawerIfAny();

        renderOverlay();
        var ov = buildOverlayOnce();
        ov.classList.add('is-open');

        document.documentElement.classList.add('gom-ov-open');
        document.body.classList.add('gom-ov-open');

        var btn = document.querySelector('.header-menu-toggle');
        if (btn) btn.classList.add('menu-is-active');

        // Ensure native collapse isn't left open
        var c = document.getElementById('header-menu-phone-container');
        if (c) {
            c.classList.remove('in');
            c.setAttribute('aria-expanded', 'false');
        }

        setTimeout(function () {
            var still = document.getElementById(OVERLAY_ID);
            if (!still || !still.classList.contains('is-open')) hardUnlock();
        }, 200);
    }

    function closeOverlay() {
        var ov = document.getElementById(OVERLAY_ID);
        if (ov) ov.classList.remove('is-open');
        document.documentElement.classList.remove('gom-ov-open');
        document.body.classList.remove('gom-ov-open');

        var btn = document.querySelector('.header-menu-toggle');
        if (btn) btn.classList.remove('menu-is-active');
    }

    function safeOpenOverlay() {
        try { openOverlay(); } catch (e) { hardUnlock(); }
    }

    function bindTriggers() {
        // Desktop trigger: "Menu" text
        var desk = document.querySelector('.header.header-desktop .header-links-text span');
        if (desk) {
            desk.style.cursor = 'pointer';
            desk.addEventListener('click', function (e) {
                e.preventDefault();
                safeOpenOverlay();
            });
        }

        // Mobile trigger: hamburger (capture + stopImmediatePropagation)
        document.addEventListener('click', function (e) {
            var t = e.target && e.target.closest ? e.target.closest('.header-menu-toggle') : null;
            if (!t) return;
            if (!isMobile()) return;

            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();

            safeOpenOverlay();
        }, true);

        // Re-render on resize/rotate if open
        window.addEventListener('resize', function () {
            var ov = document.getElementById(OVERLAY_ID);
            if (ov && ov.classList.contains('is-open')) renderOverlay();
        });
    }

    onReady(function () { // preload CSS for less flicker on first open
        bindTriggers();
    });
})();
