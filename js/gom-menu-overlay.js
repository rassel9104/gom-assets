/*!
 * Garden of Manors — Unified Menu Overlay (Desktop + Mobile)
 * v2.1.0 (Premium redesign)
 * - Independent overlay (no OwnerRez collapse dependency)
 * - Desktop: 3-column premium layout
 * - Mobile: full-screen overlay, large tap targets
 * - Compatible with /properties drawer
 */
(function () {
    'use strict';

    var OVERLAY_ID = 'gom-menu-overlay';
    var CSS_ID = 'gom-menu-overlay-css';
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

    function injectCssOnce() {
        if (document.getElementById(CSS_ID)) return;

        var s = document.createElement('style');
        s.id = CSS_ID;

        s.textContent = `
      /* ============================
         GOM Premium Overlay (v2.1.0)
         ============================ */

      #${OVERLAY_ID}{
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100svh;
        z-index: 2147483646;
        display: none;

        background: rgba(0,0,0,.96);
        color: #fff;

        overflow: auto;
        -webkit-overflow-scrolling: touch;

        /* subtle entrance */
        opacity: 0;
        transform: translateY(8px);
        transition: opacity .18s ease, transform .18s ease;
      }

      #${OVERLAY_ID}.is-open{
        display: block;
        opacity: 1;
        transform: translateY(0);
      }

      /* Prevent background scroll while open */
      html.gom-ov-open, body.gom-ov-open{ overflow:hidden !important; }

      /* Inner wrap */
      #${OVERLAY_ID} .gom-ov-wrap{
        min-height: 100svh;
        padding: 18px 6% 168px; /* leaves space for fixed brand footer */
        box-sizing: border-box;
      }

      /* Top bar */
      #${OVERLAY_ID} .gom-ov-top{
        position: sticky;
        top: 0;
        z-index: 3;

        display:flex;
        align-items:center;
        justify-content: space-between;
        gap: 14px;

        padding: 10px 0 14px;
        background: linear-gradient(to bottom, rgba(0,0,0,.96), rgba(0,0,0,.72), rgba(0,0,0,0));
      }

      #${OVERLAY_ID} .gom-ov-top-left{
        display:flex;
        align-items:center;
        gap: 10px;
        min-width: 0;
      }

      #${OVERLAY_ID} .gom-ov-mark{
        letter-spacing: .18em;
        text-transform: uppercase;
        font-size: 12px;
        opacity: .85;
        white-space: nowrap;
      }

      #${OVERLAY_ID} .gom-ov-close{
        appearance: none;
        border: 1px solid rgba(255,255,255,.35);
        background: rgba(255,255,255,.06);
        color: rgba(255,255,255,.92);

        padding: 10px 14px;
        border-radius: 999px;

        letter-spacing: .16em;
        text-transform: uppercase;
        font-size: 12px;
        cursor: pointer;
      }
      #${OVERLAY_ID} .gom-ov-close:hover{
        background: rgba(255,255,255,.10);
        border-color: rgba(255,255,255,.45);
      }

      /* Desktop grid */
      #${OVERLAY_ID} .gom-ov-grid{
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
        padding-top: 8px;
      }

      @media (min-width: 992px){
        #${OVERLAY_ID} .gom-ov-grid{
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 44px;
          padding-top: 18px;
        }
        #${OVERLAY_ID} .gom-ov-wrap{
          padding-top: 26px;
          padding-bottom: 178px;
        }
        #${OVERLAY_ID} .gom-ov-close{
          padding: 11px 16px;
        }
      }

      /* Column */
      #${OVERLAY_ID} .gom-ov-col{
        min-width: 0;
      }

      /* Section */
      #${OVERLAY_ID} .gom-ov-sec{
        padding-top: 18px;
        border-top: 1px solid rgba(255,255,255,.14);
        break-inside: avoid;
      }

      #${OVERLAY_ID} .gom-ov-h3{
        margin: 0 0 10px;

        display:flex;
        align-items:center;
        justify-content: space-between;
        gap: 10px;

        letter-spacing: .18em;
        text-transform: uppercase;
        font-size: 14px;
        opacity: .92;

        cursor: pointer;
        user-select: none;
      }

      @media (min-width: 992px){
        #${OVERLAY_ID} .gom-ov-h3{
          font-size: 15px;
        }
      }

      #${OVERLAY_ID} .gom-ov-h3 span{
        display:inline-block;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      #${OVERLAY_ID} .gom-ov-h3 em{
        font-style: normal;
        opacity: .65;
        letter-spacing: .10em;
        text-transform: none;
        font-size: 12px;
        white-space: nowrap;
      }

      /* Links */
      #${OVERLAY_ID} .gom-ov-links a{
        display: block;
        padding: 10px 0;

        color: rgba(255,255,255,.86);
        text-decoration: none;
        letter-spacing: .08em;

        border-bottom: 1px solid rgba(255,255,255,.06);
      }
      #${OVERLAY_ID} .gom-ov-links a:last-child{ border-bottom: 0; }
      #${OVERLAY_ID} .gom-ov-links a:hover{ color: #fff; }

      /* Brand footer fixed */
      #${OVERLAY_ID} .gom-ov-brand{
        position: fixed;
        left: 0; right: 0; bottom: 0;
        z-index: 4;

        padding: 18px 6% calc(env(safe-area-inset-bottom) + 18px);
        text-align: center;
        background: linear-gradient(to top, rgba(0,0,0,.96), rgba(0,0,0,.68), rgba(0,0,0,0));
      }

      #${OVERLAY_ID} .gom-ov-brand a{ color: inherit; text-decoration: none; }

      #${OVERLAY_ID} .gom-ov-logo{
        width: min(280px, 72vw);
        height: auto;
        display:block;
        margin: 0 auto 10px;
        opacity: .92;
      }

      #${OVERLAY_ID} .gom-ov-tagline{
        letter-spacing: .16em;
        text-transform: uppercase;
        font-size: 12px;
        color: rgba(255,255,255,.68);
        margin-bottom: 12px;
      }

      #${OVERLAY_ID} .gom-ov-wa{
        display:inline-flex;
        align-items:center;
        justify-content:center;

        border: 1px solid rgba(255,255,255,.35);
        background: rgba(255,255,255,.06);
        color: rgba(255,255,255,.92);

        padding: 10px 14px;
        border-radius: 999px;

        letter-spacing: .16em;
        text-transform: uppercase;
        font-size: 12px;
      }
      #${OVERLAY_ID} .gom-ov-wa:hover{
        background: rgba(255,255,255,.10);
        border-color: rgba(255,255,255,.45);
      }

      #${OVERLAY_ID} .gom-ov-copy{
        display:block;
        margin-top: 10px;
        font-size: 11px;
        letter-spacing: .12em;
        color: rgba(255,255,255,.45);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce){
        #${OVERLAY_ID}{ transition: none; }
      }
    `;

        document.head.appendChild(s);
    }

    function getSourceRoot() {
        // Prefer desktop menus as canonical structure
        var desktop = document.querySelector('.header.header-desktop .header-links > ul.list-inline');
        if (desktop) return desktop;

        // Fallback: mobile collapse list
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

            // if no dropdown, still provide main link
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
          <div class="gom-ov-top-left">
            <div class="gom-ov-mark">Menu</div>
          </div>
          <button type="button" class="gom-ov-close">CLOSE ▲</button>
        </div>

        <div class="gom-ov-grid" id="gom-ov-grid"></div>
      </div>

      <div class="gom-ov-brand">
        <a href="${BRAND.homeUrl}" aria-label="${BRAND.brandName}">
          <img class="gom-ov-logo" src="${BRAND.logo}" alt="${BRAND.brandName}">
        </a>
        <div class="gom-ov-tagline">${BRAND.tagline}</div>
        <a class="gom-ov-wa" rel="noopener" target="_blank" href="${BRAND.waUrl}">${BRAND.waLabel}</a>
        <small class="gom-ov-copy">© ${year} ${BRAND.brandName} · All rights reserved ®</small>
      </div>
    `;

        // click outside closes
        ov.addEventListener('click', function (e) {
            if (e.target === ov) closeOverlay();
        });

        // close button
        ov.querySelector('.gom-ov-close').addEventListener('click', closeOverlay);

        // ESC closes
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeOverlay();
        });

        // H3 click navigates to main link
        ov.addEventListener('click', function (e) {
            var h3 = e.target && e.target.closest ? e.target.closest('.gom-ov-h3') : null;
            if (!h3) return;
            var href = h3.getAttribute('data-href') || '#';
            if (href && href !== '#') window.location.href = href;
        });

        document.body.appendChild(ov);
        return ov;
    }

    function distributeIntoColumns(sections, colCount) {
        var cols = [];
        for (var i = 0; i < colCount; i++) cols.push([]);

        // simple round-robin
        for (var j = 0; j < sections.length; j++) {
            cols[j % colCount].push(sections[j]);
        }
        return cols;
    }

    function renderOverlay() {
        var ov = buildOverlayOnce();
        var grid = ov.querySelector('#gom-ov-grid');
        if (!grid) return;

        var data = parseMenu();

        // Determine columns based on width (desktop 3 cols)
        var colCount = (window.innerWidth >= 992) ? 3 : 1;
        var cols = distributeIntoColumns(data, colCount);

        grid.innerHTML = cols.map(function (col) {
            var html = col.map(function (sec) {
                var links = (sec.links || []).map(function (l) {
                    var href = l.href || '#';
                    var text = l.text || href;
                    return `<a href="${href}">${text}</a>`;
                }).join('');

                var hasMain = sec.mainHref && sec.mainHref !== '#';
                var hint = hasMain ? '<em>open</em>' : '<em></em>';

                return `
          <div class="gom-ov-sec">
            <div class="gom-ov-h3" data-href="${sec.mainHref || '#'}" role="link" tabindex="0">
              <span>${sec.title}</span>
              ${hint}
            </div>
            <div class="gom-ov-links">
              ${links}
            </div>
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
        injectCssOnce();
        closePropertiesDrawerIfAny();

        renderOverlay();
        var ov = buildOverlayOnce();
        ov.classList.add('is-open');

        document.documentElement.classList.add('gom-ov-open');
        document.body.classList.add('gom-ov-open');

        // visual state on hamburger
        var btn = document.querySelector('.header-menu-toggle');
        if (btn) btn.classList.add('menu-is-active');

        // ensure native collapse isn't left open
        var c = document.getElementById('header-menu-phone-container');
        if (c) {
            c.classList.remove('in');
            c.setAttribute('aria-expanded', 'false');
        }

        // failsafe unlock
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

        // Keep content responsive if user rotates device while overlay open
        window.addEventListener('resize', function () {
            var ov = document.getElementById(OVERLAY_ID);
            if (ov && ov.classList.contains('is-open')) renderOverlay();
        });
    }

    onReady(function () {
        bindTriggers();
    });
})();
