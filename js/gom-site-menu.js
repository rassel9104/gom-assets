/*!
 * Garden of Manors — Site Menu Logic (Desktop overlay + Mobile menu brand footer)
 * Scope: safe to load on all pages; it no-ops when elements aren't present.
 * Version: 1.0.0 (externalized from OwnerRez Head)
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

    var logoUrl = 'https://gardenofmanors.com';

    // Mobile menu "brand footer" (used inside the native OR mobile menu overlay)
    var MOBILE_BRAND = {
      logo: 'https://uc.orez.io/f/5d5c770f7f9f40d294e861812e2e1a74',
      tagline: 'HEATED SALTWATER POOL · TROPICAL GARDENS · STEPS TO WILTON DRIVE',
      waUrl: 'https://wa.me/17863887255?text=Hello%20%E2%80%94%20I%27d%20like%20to%20inquire%20about%20Garden%20of%20Manors.',
      waLabel: 'WhatsApp'
    };

    // Minimal CSS for the injected mobile brand footer + safety for desktop overlay
    injectStyleOnce('gom-site-menu-css', `
      /* Desktop overlay safety */
      #gom-desktop-overlay{
        position:fixed; inset:0; width:100vw; height:100svh;
        background: rgba(0,0,0,.94);
        z-index: 50000;
        display:none;
        overflow:auto;
        -webkit-overflow-scrolling: touch;
      }
      #gom-desktop-overlay.is-open{ display:block; }

      /* Mobile menu brand footer (inside #header-menu-phone-container) */
      @media (max-width:768px){
        #header-menu-phone-container{
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100svh !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          /* safety: keep overlay hidden unless open */
          display: none !important;
        }
        #header-menu-phone-container.in{ display: block !important; }
          padding-bottom: 14.5rem !important;
        }
        #header-menu-phone-container::after{ content:none !important; background-image:none !important; }

        #header-menu-phone-container .gom-menu-brand{
          position: fixed;
          left: 0; right: 0; bottom: 0;
          padding: 1.4rem 1.8rem calc(env(safe-area-inset-bottom) + 1.2rem);
          text-align: center;
          background: linear-gradient(to top, rgba(0,0,0,.92), rgba(0,0,0,.55), rgba(0,0,0,0));
          z-index: 9991;
          pointer-events: none;
        }
        #header-menu-phone-container .gom-menu-brand *{ pointer-events: auto; }
        #header-menu-phone-container .gom-menu-brand img{
          width: min(260px, 70vw);
          height: auto;
          display: block;
          margin: 0 auto .8rem;
          opacity: .92;
        }
        #header-menu-phone-container .gom-menu-brand .gom-tagline{
          letter-spacing: .14em;
          text-transform: uppercase;
          font-size: 1.05rem;
          color: rgba(255,255,255,.65);
          margin-bottom: .8rem;
        }
        #header-menu-phone-container .gom-menu-brand .gom-wa{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .6rem;
          border: 1px solid rgba(255,255,255,.35);
          padding: .7rem 1.1rem;
          color: rgba(255,255,255,.92) !important;
          text-decoration: none !important;
          text-transform: uppercase;
          letter-spacing: .16em;
          font-size: 1.05rem;
          background: rgba(255,255,255,.06);
        }
        #header-menu-phone-container .gom-menu-brand .gom-wa:hover{
          background: rgba(255,255,255,.10);
        }
      }
    `);

    // ---------------------------
    // 1) COMMON ELEMENTS
    // ---------------------------
    var body = document.body;
    var menuBtn = document.querySelector('.header-menu-toggle'); // mobile toggle
    var menuContainer = document.querySelector('#header-menu-phone-container'); // OR mobile overlay
    var desktopTrigger = document.querySelector('#header-bar .header-desktop .header-links-text span');
    var headerBookBtn = document.querySelector('#header-bar .header-desktop .header-links-page .btn');

    // ---------------------------
    // 2) MOBILE MENU: keep body state synced + inject brand footer
    // ---------------------------
    function ensureMobileMenuBrand() {
      if (!menuContainer) return;
      if (menuContainer.querySelector('.gom-menu-brand')) return;

      var brand = document.createElement('div');
      brand.className = 'gom-menu-brand';
      brand.innerHTML =
        '<img src="' + MOBILE_BRAND.logo + '" alt="Garden of Manors">' +
        '<div class="gom-tagline">' + MOBILE_BRAND.tagline + '</div>' +
        '<a class="gom-wa" rel="noopener" target="_blank" href="' + MOBILE_BRAND.waUrl + '">' +
          MOBILE_BRAND.waLabel +
        '</a>';

      menuContainer.appendChild(brand);
    }

    if (menuContainer) {
      function syncMobileState() {
        var isOpen = menuContainer.classList.contains('in');
        if (isOpen) {
          body.style.overflow = 'hidden';
          body.classList.add('menu-open');
          if (menuBtn) menuBtn.classList.add('menu-is-active');
        } else {
          body.style.overflow = '';
          body.classList.remove('menu-open');
          if (menuBtn) menuBtn.classList.remove('menu-is-active');
        }
      }

      try {
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (m) {
            if (m.attributeName === 'class') syncMobileState();
          });
        });
        observer.observe(menuContainer, { attributes: true });
      } catch (e) { /* noop */ }

      // Close by tapping the dark background (mobile)
      menuContainer.addEventListener('click', function (e) {
        if (e.target === menuContainer && menuBtn) menuBtn.click();
      });

      ensureMobileMenuBrand();
      syncMobileState();
    }

    // ---------------------------
    // 3) DESKTOP OVERLAY
    // ---------------------------
    var desktopOverlay = null;
    var desktopCloseBtn = null;
    var desktopBookBtn = null;
    var desktopOverlayBuilt = false;

    var desktopOverlayHtml = `
<div class="gom-desktop-menu-inner" style="max-width:100%;margin:0 auto;padding:7.2rem;font-family:var(--main-font);max-height:100%;">
  <div class="gom-desktop-menu-top" style="display:flex;align-items:flex-start;justify-content:space-between;margin:0;">
    <div class="gom-menu-logo" style="width:24rem;position:fixed;height:6.4rem;background-size:contain;background-image:url(https://uc.orez.io/f/d75e4c3b34dc403398973f84d1b60318);background-repeat:no-repeat;top:1.2rem;left:7.2rem;"></div>
    <div class="gom-menu-actions" style="display:flex;gap:.8rem;">
      <button type="button" class="gom-menu-btn gom-menu-close" style="display:inline-flex;border:1px solid #fff;padding:0 2rem;background:transparent;color:#fff;text-transform:uppercase;letter-spacing:.15em;cursor:pointer;white-space:nowrap;font-weight:var(--fw-semibold);min-width:var(--header-btn-minw);height:var(--header-btn-h);align-items:center;font-size:1.4rem;">
        CLOSE &#9650;
      </button>
      <a href="/book" class="gom-menu-btn gom-menu-book" style="border:1px solid #fff;padding:0 2rem;background:#fff;color:#000;text-transform:uppercase;letter-spacing:.15em;font-size:clamp(1rem,0.3vw + .9rem,1.4rem);cursor:pointer;white-space:nowrap;font-weight:var(--fw-semibold) !important;height:var(--header-btn-h);min-width:var(--header-btn-minw);display:flex;align-items:center;justify-content:center;">
        BOOK NOW !
      </a>
    </div>
  </div>

  <div class="gom-desktop-menu-grid" style="display:grid;max-width:100%;margin:4.8rem 0;grid-template-columns:repeat(3,minmax(220px,1fr));column-gap:20%;row-gap:10%;">
    <div class="gom-menu-col">
      <h3>ROOMS</h3>
      <a href="https://gardenofmanors.com/the-gold-room-garden-of-manors-guesthousefl-orp5b72550x" target="_blank">The Gold Room</a>
      <a href="https://gardenofmanors.com/the-red-room-garden-of-manors-guesthousefl-orp5b72146x" target="_blank">The Red Room</a>
      <a href="https://gardenofmanors.com/the-green-room-garden-of-manors-guesthousefl-orp5b72145x" target="_blank">The Green Room</a>
    </div>
    <div class="gom-menu-col">
      <h3>GUEST INFO</h3>
      <a href="/reviews">Guest Reviews</a>
      <a href="/map">Map &amp; Directions</a>
      <a href="/house-rules-574039907">House Rules &amp; Policies</a>
    </div>
    <div class="gom-menu-col">
      <h3>MANORS NEWS</h3>
      <a href="/blog/wilton-drive-guide-2025">A First-Timer's Guide</a>
      <a href="/blog/wilton-manors-nightlife-2025-men-only-radar">Nightlife 2025</a>
      <a href="/blog/stonewall-pride-2025-wilton-manors-guide">Stonewall Pride 2025</a>
    </div>
    <div class="gom-menu-col">
      <h3>ALSO PRESENT IN...</h3>
      <a href="https://airbnb.com/rooms/1569409996054900306" target="_blank">Airbnb · Gold Room</a>
      <a href="https://airbnb.com/rooms/1522329768355308485" target="_blank">Airbnb · Red Room</a>
      <a href="https://airbnb.com/rooms/1515782773658155156" target="_blank">Airbnb · Green Room</a>
      <a href="https://www.vrbo.com/4890471?dateless=true" target="_blank">Vrbo · Red Room</a>
      <a href="https://www.vrbo.com/4890426?dateless=true" target="_blank">Vrbo · Green Room</a>
      <a href="https://www.booking.com/hotel/us/den-of-sen-guest-house.html" target="_blank">Booking.com · Garden of Manors</a>
    </div>
    <div class="gom-menu-col">
      <h3>SOCIALS &amp; CONTACT</h3>
      <a href="mailto:raulserrano9104@gmail.com">E-mail</a>
      <a href="https://wa.me/17863887255?text=Hello%20%E2%80%94%20I%27d%20like%20to%20inquire%20about%20Garden%20of%20Manors." target="_blank">WhatsApp</a>
      <a href="https://www.instagram.com/garden_of_manors/" target="_blank">Instagram</a>
      <a href="https://www.tiktok.com/@gardenofmanors?_r=1&amp;_t=ZG-91L3jVsVw3t" target="_blank">TikTok</a>
      <a href="https://www.facebook.com/profile.php?id=61579288606794" target="_blank">Facebook</a>
    </div>
    <div class="gom-menu-col">
      <h3>ADDRESS</h3>
      <a href="/map">109 NE 26th Street, Wilton Manors, FL 33305</a>
      <a href="https://maps.google.com/maps?daddr=GARDEN+OF+MANORS+-+MEN-FOCUSED+GUESTHOUSE,+109+NE+26th+St,+Wilton+Manors,+FL+33305" target="_blank">Open in Google Maps</a>
    </div>
  </div>
</div>`;

    function attachH3Links() {
      if (!desktopOverlay) return;
      var headers = desktopOverlay.querySelectorAll('.gom-menu-col h3');
      headers.forEach(function (h3) {
        var key = (h3.textContent || '').trim().toUpperCase();
        var url = h3Links[key];
        if (!url) return;

        h3.style.cursor = 'pointer';
        h3.setAttribute('tabindex', '0');

        function go() { window.location.href = url; }
        h3.addEventListener('click', go);
        h3.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
        });
      });
    }

    function attachLogoLinks() {
      if (!desktopOverlay) return;
      var logos = desktopOverlay.querySelectorAll('.gom-menu-logo');
      logos.forEach(function (logo) {
        var url = logo.getAttribute('data-logo-url') || logoUrl;
        if (!url) return;

        logo.style.cursor = 'pointer';
        logo.setAttribute('role', 'link');
        logo.setAttribute('tabindex', '0');

        function go() { window.location.href = url; }
        logo.addEventListener('click', go);
        logo.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
        });
      });
    }

    function buildDesktopOverlay() {
      if (desktopOverlayBuilt) return;
      desktopOverlayBuilt = true;

      desktopOverlay = document.createElement('div');
      desktopOverlay.id = 'gom-desktop-overlay';
      desktopOverlay.innerHTML = desktopOverlayHtml;
      body.appendChild(desktopOverlay);

      desktopCloseBtn = desktopOverlay.querySelector('.gom-menu-close');
      desktopBookBtn = desktopOverlay.querySelector('.gom-menu-book');

      attachH3Links();
      attachLogoLinks();

      desktopOverlay.addEventListener('click', function (e) {
        if (e.target === desktopOverlay) closeDesktopMenu();
      });

      if (desktopCloseBtn) {
        desktopCloseBtn.addEventListener('click', function (e) {
          e.preventDefault();
          closeDesktopMenu();
        });
      }

      window.addEventListener('resize', function () {
        if (desktopOverlay && desktopOverlay.classList.contains('is-open')) positionDesktopButtons();
        if (window.innerWidth < 769 && desktopOverlay && desktopOverlay.classList.contains('is-open')) closeDesktopMenu();
      });
    }

    function positionDesktopButtons() {
      if (!desktopOverlay || !desktopOverlay.classList.contains('is-open')) return;

      if (desktopCloseBtn && desktopTrigger) {
        var r = desktopTrigger.getBoundingClientRect();
        desktopCloseBtn.style.position = 'fixed';
        desktopCloseBtn.style.left = r.left + 'px';
        desktopCloseBtn.style.top = r.top + 'px';
      }
      if (desktopBookBtn && headerBookBtn) {
        var rb = headerBookBtn.getBoundingClientRect();
        desktopBookBtn.style.position = 'fixed';
        desktopBookBtn.style.left = rb.left + 'px';
        desktopBookBtn.style.top = rb.top + 'px';
      }
    }

    function openDesktopMenu() {
      buildDesktopOverlay();
      if (!desktopOverlay) return;

      desktopOverlay.classList.add('is-open');
      body.classList.add('menu-open');
      body.style.overflow = 'hidden';
      positionDesktopButtons();
    }

    function closeDesktopMenu() {
      if (!desktopOverlay) return;

      desktopOverlay.classList.remove('is-open');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    }

    function toggleDesktopMenu() {
      if (!desktopOverlay || !desktopOverlay.classList.contains('is-open')) openDesktopMenu();
      else closeDesktopMenu();
    }

    if (desktopTrigger) {
      desktopTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.innerWidth >= 769) toggleDesktopMenu();
        else if (menuBtn) menuBtn.click();
      });
    }
  });
})();
