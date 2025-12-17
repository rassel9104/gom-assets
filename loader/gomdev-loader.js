/*!
 * GOMDEV Loader
 * - Gomdev: carga CSS/JS desde @main y fuerza refresh automático con cache-buster.
 * - No requiere cambiar ?v= manual en el Head.
 */
(function () {
    "use strict";

    // Cache-buster por carga (suficiente para forzar recarga en cada refresh)
    var V = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);

    // Base CDN (dev = main)
    var CDN = "https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/";

    function addCss(path) {
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = CDN + path + "?v=" + V;
        document.head.appendChild(l);
    }

    function addJs(path) {
        var s = document.createElement("script");
        s.defer = true;
        s.src = CDN + path + "?v=" + V;
        document.head.appendChild(s);
    }

    // --- CSS (orden: global -> page) ---
    addCss("dist/gom-global.min.css");

    var p = (location.pathname || "/").toLowerCase();

    // Home
    if (p === "/" || p === "") addCss("dist/gom-home.min.css");

    // Properties
    if (p.indexOf("/properties") === 0) addCss("dist/gom-properties.min.css");

    // --- JS (dev desde main) ---
    // Menú overlay (global)
    addJs("js/gom-menu-overlay.js");

    // Drawer solo en /properties (aunque sea "safe", así reduces ruido)
    if (p.indexOf("/properties") === 0) addJs("js/gom-properties-mobile-drawer.js");
})();
