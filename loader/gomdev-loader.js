/*!
 * GOMDEV Loader — carga SIEMPRE el último commit de main usando SHA
 * - Evita depender del alias @main (que puede tardar en refrescar)
 * - Expone window.GOMDEV para verificar rápido en consola
 */
(function () {
    'use strict';

    var REPO = 'rassel9104/gom-assets';
    var BRANCH = 'main';

    // Si GitHub API falla, cargamos un tag estable (no dev).
    var FALLBACK_TAG = 'v2.1.2';

    var API = 'https://api.github.com/repos/' + REPO + '/commits/' + encodeURIComponent(BRANCH);

    // Cache anti-rate-limit (evita llamar GitHub API en cada refresh)
    var STORAGE_KEY = 'gomdev_sha_cache_v1';
    var CACHE_MS = 45 * 1000;

    function now() { return Date.now(); }

    function setStatus(obj) {
        try { window.GOMDEV = Object.assign(window.GOMDEV || {}, obj); } catch (e) { }
    }

    function addCss(href, id) {
        if (id && document.getElementById(id)) return;
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        if (id) l.id = id;
        l.setAttribute('data-gomdev', '1');
        document.head.appendChild(l);
    }

    function addJs(src, id) {
        if (id && document.getElementById(id)) return;
        var s = document.createElement('script');
        s.src = src;
        s.defer = true;
        if (id) s.id = id;
        s.setAttribute('data-gomdev', '1');
        document.head.appendChild(s);
    }

    function inject(ref) {
        var base = 'https://cdn.jsdelivr.net/gh/' + REPO + '@' + ref;
        setStatus({ ref: ref, base: base });

        // CSS (tu build actual)
        addCss(base + '/dist/gom-global.min.css', 'gomdev-css-global');
        addCss(base + '/dist/gom-home.min.css', 'gomdev-css-home');
        addCss(base + '/dist/gom-properties.min.css', 'gomdev-css-properties');

        // JS (ajusta rutas si en tu repo están en otra carpeta)
        addJs(base + '/js/gom-menu-overlay.js', 'gomdev-js-menu');
        addJs(base + '/js/gom-properties-mobile-drawer.js', 'gomdev-js-drawer');
    }

    function getCachedSha() {
        try {
            var raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            if (!obj || !obj.sha || !obj.t) return null;
            if (now() - obj.t > CACHE_MS) return null;
            return obj.sha;
        } catch (e) { return null; }
    }

    function cacheSha(sha) {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ sha: sha, t: now() })); } catch (e) { }
    }

    function fetchSha() {
        // override opcional: ?sha=abcdef1 para probar un commit específico
        try {
            var m = location.search.match(/[?&]sha=([0-9a-f]{7,40})/i);
            if (m) return Promise.resolve(m[1]);
        } catch (e) { }

        var cached = getCachedSha();
        if (cached) return Promise.resolve(cached);

        return fetch(API, {
            method: 'GET',
            headers: { 'Accept': 'application/vnd.github+json' },
            cache: 'no-store'
        })
            .then(function (r) {
                if (!r.ok) throw new Error('GitHub API ' + r.status);
                return r.json();
            })
            .then(function (j) {
                var sha = (j && j.sha) ? j.sha : null;
                if (!sha) throw new Error('No SHA in response');
                cacheSha(sha);
                return sha;
            });
    }

    setStatus({ repo: REPO, branch: BRANCH, startedAt: new Date().toISOString() });

    fetchSha()
        .then(function (sha) {
            setStatus({ sha: sha, mode: 'sha' });
            inject(sha);
            console.log('[GOMDEV] loaded sha:', sha);
        })
        .catch(function (err) {
            setStatus({ error: String(err), mode: 'fallback', sha: null });
            inject(FALLBACK_TAG);
            console.warn('[GOMDEV] SHA fetch failed, using:', FALLBACK_TAG, err);
        });
})();
