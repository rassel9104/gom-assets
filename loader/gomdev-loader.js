/*!
 * GOMDEV Loader (SHA-resolved)
 * - Evita el “lag” de @main en jsDelivr resolviendo el commit SHA actual.
 * - Carga assets via: cdn.jsdelivr.net/gh/<user>/<repo>@<SHA>/...
 */
(function () {
    "use strict";

    var USER = "rassel9104";
    var REPO = "gom-assets";
    var BRANCH = "main";

    // 1) Cache-buster por carga (para que el navegador no “recicle” links)
    var V = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);

    // 2) Endpoint para resolver el SHA actual del branch (CORS ok)
    var GH_API = "https://api.github.com/repos/" + USER + "/" + REPO + "/commits/" + BRANCH;

    function addCss(base, path) {
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = base + path + "?v=" + V;
        document.head.appendChild(l);
    }

    function addJs(base, path) {
        var s = document.createElement("script");
        s.defer = true;
        s.src = base + path + "?v=" + V;
        document.head.appendChild(s);
    }

    function loadWithRef(ref) {
        var base = "https://cdn.jsdelivr.net/gh/" + USER + "/" + REPO + "@" + ref + "/";

        // Debug visible en consola
        window.GOMDEV = window.GOMDEV || {};
        window.GOMDEV.ref = ref;
        window.GOMDEV.v = V;

        // --- CSS (orden: global -> page) ---
        addCss(base, "dist/gom-global.min.css");

        var p = (location.pathname || "/").toLowerCase();
        if (p === "/" || p === "") addCss(base, "dist/gom-home.min.css");
        if (p.indexOf("/properties") === 0) addCss(base, "dist/gom-properties.min.css");

        // --- JS ---
        addJs(base, "js/gom-menu-overlay.js");
        if (p.indexOf("/properties") === 0) addJs(base, "js/gom-properties-mobile-drawer.js");
    }

    // 3) Resolver SHA y cargar por SHA (fallback a @main si falla)
    fetch(GH_API, { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (j) {
            var sha = (j && j.sha) ? j.sha : BRANCH;
            // SHA completo es válido; si quieres, puedes acortarlo:
            // sha = sha.slice(0, 12);
            loadWithRef(sha);
        })
        .catch(function () {
            loadWithRef(BRANCH);
        });
})();
