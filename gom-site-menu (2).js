/*!
 * Garden of Manors — Site Menu Logic (Desktop overlay + Mobile menu brand footer)
 * Scope: safe to load on all pages; it no-ops when elements aren't present.
 * Version: 1.0.1 (externalized from OwnerRez Head)
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
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  onReady(function () {
    // ---------------------------
    // 0) CONFIG
    // ---------------------------
    var h3Links = {
      'ROOMS': 'https://gardenofmanors.com/properties',
      'GUEST INFO': '/guest-info',
      'MANORS NEWS': '/blog',
      'ALSO PRESENT IN...': '/book-direct-vs-otas',
      'SOCIALS & CONTACT': '/contact',
      'ADDRESS': '/map'
    };

    // Mobile brand footer content (inserted as real markup, not pseudo-elements)
    var MOBILE_BRAND = {
      logo: 'https://uc.orez.io/f/d75e4c3b34dc403398973f84d1b60318',
      tagline: 'HEATED SALTWATER POOL · TROPICAL GARDENS · STEPS TO WILTON DRIVE',
      waLabel: 'WhatsApp',
      waUrl: 'https://wa.me/17863887255?text=Hello%20%E2%80%94%20I%27d%20like%20to%20inquire%20about%20Garden%20of%20Manors.'
    };

    // Minimal CSS required for the desktop overlay container only
    injectStyleOnce('gom-site-menu-css', `
      /* Desktop overlay container (desktop menu) */
      #gom-desktop-overlay{
        position:fixed;
        inset:0;
        width:100vw;
        height:100svh;
        background: rgba(0,0,0,.94);
        z-index: 50000;
        display:none;
        overflow:auto;
        -webkit-overflow-scrolling: touch;
      }
      #gom-desktop-overlay.is-open{ display:block; }
    `);

    // ---------------------------
    // 1) MOBILE MENU (OwnerRez collapse container)
    // ---------------------------
    var body = document.body;
    var menuBtn = document.querySelector('.header-menu-toggle');
    var menuContainer = document.getElementById('header-menu-phone-container');

    function ensureMobileMenuBrand() {
      if (!menuContainer) return;

      var brand = menuContainer.querySelector('.gom-menu-brand');
      if (!brand) {
        brand = document.createElement('div');
        brand.className = 'gom-menu-brand';
        menuContainer.appendChild(brand);
      }

      // Always normalize the brand content (prevents old/incorrect logo persisting)
      brand.innerHTML =
        '<img src="' + MOBILE_BRAND.logo + '" alt="Garden of Manors">' +
        '<div class="gom-tagline">' + MOBILE_BRAND.tagline + '</div>' +
        '<a class="gom-wa" rel="noopener" target="_blank" href="' + MOBILE_BRAND.waUrl + '">' +
        MOBILE_BRAND.waLabel +
        '</a>';

      // Keep it as the last element inside the overlay
      if (brand !== menuContainer.lastElementChild) {
        menuContainer.appendChild(brand);
      }
    }

    if (menuContainer) {
      ensureMobileMenuBrand();

      function syncMobileState() {
        var isOpen = menuContainer.classList.contains('in');

        if (isOpen) {
          body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          body.classList.add('menu-open');
          if (menuBtn) menuBtn.classList.add('menu-is-active');
        } else {
          body.style.overflow = '';
          document.documentElement.style.overflow = '';
          body.classList.remove('menu-open');
          if (menuBtn) menuBtn.classList.remove('menu-is-active');
        }
      }

      // Observe bootstrap collapse state changes
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'class') {
            syncMobileState();
            // Re-normalize brand on each open in case OR re-rendered the menu
            if (menuContainer.classList.contains('in')) ensureMobileMenuBrand();
          }
        }
      });
      observer.observe(menuContainer, { attributes: true });

      // Initial sync
      syncMobileState();
    }

    // ---------------------------
    // 2) DESKTOP OVERLAY MENU (custom overlay)
    // ---------------------------
    var desktopTrigger = document.querySelector('#header-bar .header-desktop .header-links-text span');
    var desktopOverlayId = 'gom-desktop-overlay';

    function buildDesktopOverlay() {
      var existing = document.getElementById(desktopOverlayId);
      if (existing) return existing;

      var overlay = document.createElement('div');
      overlay.id = desktopOverlayId;

      // Build columns using the same h3Links keys as your config
      var desktopOverlayHtml = `
        <div class="gom-menu-wrap">
          <button type="button" class="gom-menu-close" aria-label="Close menu">Close</button>
          <div class="gom-menu-grid">
            <div class="gom-menu-col">
              <h3>ROOMS</h3>
              <ul>
                <li><a href="${h3Links['ROOMS']}">All Rooms</a></li>
              </ul>
              <h3>GUEST INFO</h3>
              <ul>
                <li><a href="${h3Links['GUEST INFO']}">Guest Info</a></li>
              </ul>
            </div>

            <div class="gom-menu-col">
              <h3>MANORS NEWS</h3>
              <ul>
                <li><a href="${h3Links['MANORS NEWS']}">Blog</a></li>
              </ul>
              <h3>ALSO PRESENT IN...</h3>
              <ul>
                <li><a href="${h3Links['ALSO PRESENT IN...']}">Book Direct vs OTAs</a></li>
              </ul>
            </div>

            <div class="gom-menu-col">
              <h3>SOCIALS & CONTACT</h3>
              <ul>
                <li><a href="${h3Links['SOCIALS & CONTACT']}">Contact</a></li>
              </ul>
              <h3>ADDRESS</h3>
              <ul>
                <li><a href="${h3Links['ADDRESS']}">Map</a></li>
              </ul>
            </div>
          </div>

          <div class="gom-menu-footer">
            <div class="gom-menu-brandline">
              <span class="gom-menu-brandname">Garden of Manors</span>
              <span class="gom-menu-tagline">${MOBILE_BRAND.tagline}</span>
            </div>
          </div>
        </div>
      `;

      overlay.innerHTML = desktopOverlayHtml;
      document.body.appendChild(overlay);

      // Close controls
      overlay.addEventListener('click', function (e) {
        // Click outside wrap closes
        if (e.target === overlay) closeDesktopOverlay();
      });

      var closeBtn = overlay.querySelector('.gom-menu-close');
      if (closeBtn) closeBtn.addEventListener('click', closeDesktopOverlay);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDesktopOverlay();
      });

      // Make H3 clickable (configurable)
      overlay.addEventListener('click', function (e) {
        var h3 = e.target && e.target.closest ? e.target.closest('h3') : null;
        if (!h3) return;
        var txt = (h3.textContent || '').trim().toUpperCase();
        if (h3Links[txt]) window.location.href = h3Links[txt];
      });

      return overlay;
    }

    function openDesktopOverlay() {
      var overlay = buildDesktopOverlay();
      overlay.classList.add('is-open');
      body.classList.add('gom-desktop-menu-open');
      body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    function closeDesktopOverlay() {
      var overlay = document.getElementById(desktopOverlayId);
      if (!overlay) return;
      overlay.classList.remove('is-open');
      body.classList.remove('gom-desktop-menu-open');
      body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    if (desktopTrigger) {
      desktopTrigger.style.cursor = 'pointer';
      desktopTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        openDesktopOverlay();
      });
    }

    // Safety unlock (if body got stuck without any open menu)
    function unlockIfStuck() {
      var overlay = document.getElementById(desktopOverlayId);
      var desktopOpen = !!(overlay && overlay.classList.contains('is-open'));
      var mobileOpen = !!(menuContainer && menuContainer.classList.contains('in'));

      if (!desktopOpen && !mobileOpen) {
        body.classList.remove('menu-open', 'gom-desktop-menu-open');
        body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (menuBtn) menuBtn.classList.remove('menu-is-active');
      }
    }

    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.header-menu-toggle') : null;
      if (!btn) return;
      setTimeout(unlockIfStuck, 250);
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') unlockIfStuck();
    });
  });
})();
