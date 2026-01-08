/**
 * OWNERREZ GALLERY LOADER
 * Scrapes property pages to build a unified gallery.
 * Place this in the HEAD of your layout or use a Script Injector.
 */

(function() {
    // --- CONFIGURATION ---
    const CONFIG = {
        GALLERY_PATH: "/gallery", // The path where this script should run
        INDEX_CANDIDATES: ["/properties", "/rooms", "/suites"],
        // List of specific property URLs to scrape (overrides auto-discovery)
        // Example: ["/properties/villa-rosa", "/properties/sunset-manor"]
        MANUAL_URLS: ["/the-gold-room-garden-of-manors-guesthousefl", "/the-red-room-garden-of-manors-guesthousefl"],

        MAX_PROPERTIES: 20,
        MAX_PHOTOS_PER_PROPERTY: 120,
        MAX_TOTAL_PHOTOS: 500,
        CACHE_KEY: "gom_gallery_cache",
        CACHE_TTL_HOURS: 6,
        DEBUG: false // Set to true to force refresh and log
    };

    // --- UTILS ---
    const log = (msg, data) => CONFIG.DEBUG && console.log(`[Gallery] ${msg}`, data || '');

    // Check if we are on the gallery page
    if (window.location.pathname !== CONFIG.GALLERY_PATH && !window.location.pathname.endsWith("/gallery") && !window.location.search.includes("gallery_debug")) {
        return; // Exit if not on gallery page
    }

    console.log("Initialize Gallery Loader...");

    // --- STATE ---
    let fullGallery = [];

    // --- DOMContentLoaded Wrapper ---
    document.addEventListener("DOMContentLoaded", async () => {
        const root = document.getElementById("gallery-root");
        if (!root) {
            console.error("Gallery root element not found. Make sure HTML Body is pasted.");
            return;
        }

        const loader = document.getElementById("gallery-loader");
        const errorEl = document.getElementById("gallery-error");

        try {
            // 1. Try Cache
            const cachedParams = loadFromCache();
            if (cachedParams) {
                log("Loaded from cache", cachedParams.length);
                renderGallery(cachedParams);
                return;
            }

            // 2. Build Index (Scrape)
            log("Building index...");
            const allPhotos = await buildGalleryIndex();

            if (allPhotos.length === 0) {
                throw new Error("No photos found.");
            }

            // 3. Save & Render
            saveToCache(allPhotos);
            renderGallery(allPhotos);

        } catch (err) {
            console.error(err);
            if (loader) loader.style.display = "none";
            if (errorEl) errorEl.style.display = "block";
            // Optional: fallback to manual images if any
        }
    });

    // --- CORE LOGIC: CRAWLER ---

    async function buildGalleryIndex() {
        let urlsToVisit = [];

        // A. Check Manual List
        if (CONFIG.MANUAL_URLS && CONFIG.MANUAL_URLS.length > 0) {
            log("Using manual property list", CONFIG.MANUAL_URLS);
            urlsToVisit = CONFIG.MANUAL_URLS;
        } else {
            // B. Auto-Discovery
            const indexUrl = await findWorkingIndexUrl();
            if (!indexUrl) throw new Error("Could not find property index page.");

            const indexHtml = await fetchHtml(indexUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(indexHtml, "text/html");

        // C. Extract Property Links
        // Look for links that seemingly go to property details
        // Heuristic: href starts with / or absolute, not external (unless same domain), usually contains /property/ or matches standard patterns
        const links = Array.from(doc.querySelectorAll("a[href]"));
        const propertyLinks = new Set();

            links.forEach(a => {
                const href = a.getAttribute("href");
                // Basic OwnerRez pattern detection + exclusions
                if (
                    href &&
                    !href.startsWith("#") &&
                    !href.includes("javascript:") &&
                    !href.includes("/book")  &&
                    !href.includes("/inquiry") &&
                    (href.includes("property") || href.includes("vacation-rental") || href.match(/\/[a-z0-9-]+\/[0-9]+$/i)) // Adjust this regex based on actual site structure
                ) {
                     // Normalize URL
                     propertyLinks.add(href);
                }
            });

            urlsToVisit = Array.from(propertyLinks).slice(0, CONFIG.MAX_PROPERTIES);
        }

        log("Property URLs found:", urlsToVisit);

        // D. Visit Each Property (Concurrent with limit)
        const photoCollection = [];

        // Simple sequential or batched fetch
        for (const url of urlsToVisit) {
            try {
                const photos = await scrapePropertyPage(url);
                photoCollection.push(...photos);
                if (photoCollection.length >= CONFIG.MAX_TOTAL_PHOTOS) break;
            } catch (e) {
                console.warn(`Failed to scrape ${url}`, e);
            }
        }

        return photoCollection;
    }

    async function findWorkingIndexUrl() {
        // Try candidates
        for (const path of CONFIG.INDEX_CANDIDATES) {
             try {
                 const res = await fetch(path, { method: 'HEAD' });
                 if (res.ok) return path;
             } catch (e) {}
        }
        // Fallback: assume the navigation menu has a link to "Properties"
        // This runs on the current page (gallery) to spy on nav
        const navLinks = document.querySelectorAll("nav a, header a");
        for (const a of navLinks) {
            if (a.textContent.toLowerCase().includes("properties") || a.textContent.toLowerCase().includes("rentals")) {
                return a.getAttribute("href");
            }
        }
        return CONFIG.INDEX_CANDIDATES[0]; // Default
    }

    async function scrapePropertyPage(url) {
        log(`Scraping ${url}...`);
        const html = await fetchHtml(url);
        const doc = new DOMParser().parseFromString(html, "text/html");
        const title = doc.querySelector("h1")?.textContent.trim() || "Vacation Rental";

        // Extract Images
        // Strategy: Look for specific gallery containers, or just all large images
        // OwnerRez specific: often `.owl-carousel img`, `.gallery img`, or `a[data-fancybox]`

        const candidates = [];

        // 1. #lightSlider (User validated selector)
        const lightSlider = doc.querySelector("#lightSlider");
        if (lightSlider) {
            const slides = lightSlider.querySelectorAll("li img");
            slides.forEach(img => {
                let src = img.currentSrc || img.getAttribute("src");
                // User snippet fix: ensure absolute URL
                if (src) {
                   try { src = new URL(src, url).href; } catch(e) { /* ignore */ }
                }

                if (src) {
                    candidates.push({
                         src: src,
                         thumb: src, // Use same for now, browser will cache
                         caption: img.getAttribute("alt") || "",
                         property: title,
                         url: url
                    });
                }
            });
        }

        // 2. Lightbox anchors (Fallback if lightSlider missing)
        if (candidates.length === 0) {
            const lightboxLinks = doc.querySelectorAll("a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png'], a[href$='.webp']");
            lightboxLinks.forEach(a => {
                candidates.push({
                    src: a.getAttribute("href"),
                    thumb: a.querySelector("img")?.src || a.getAttribute("href"),
                    caption: a.getAttribute("title") || a.getAttribute("data-caption") || "",
                    property: title,
                    url: url
                });
            });
        }

        // 2. Img tags if no lightbox links found (Fallback)
        if (candidates.length === 0) {
            const images = doc.querySelectorAll("img");
            images.forEach(img => {
                // Heuristic: ignore small icons, logos
                if (img.naturalWidth > 100 || (img.getAttribute("src") && !img.getAttribute("src").includes("logo"))) {
                    candidates.push({
                        src: img.getAttribute("src"),
                        thumb: img.getAttribute("src"),
                        caption: img.getAttribute("alt") || "",
                        property: title,
                        url: url
                    });
                }
            });
        }

        // Deduplicate by SRC
        const unique = [];
        const seen = new Set();
        candidates.forEach(c => {
            if (!seen.has(c.src) && unique.length < CONFIG.MAX_PHOTOS_PER_PROPERTY) {
                seen.add(c.src);
                unique.push(c);
            }
        });

        return unique;
    }

    async function fetchHtml(url) {
        if(url.startsWith("http") && !url.includes(window.location.hostname)) {
             // External link protection? Assuming same origin
             return "";
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.text();
    }

    // --- CACHE ---
    function saveToCache(data) {
        const payload = {
            timestamp: Date.now(),
            data: data
        };
        try {
            localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(payload));
        } catch (e) { console.warn("Cache write failed (quota?)"); }
    }

    function loadFromCache() {
        if (CONFIG.DEBUG) return null;
        try {
            const raw = localStorage.getItem(CONFIG.CACHE_KEY);
            if (!raw) return null;
            const payload = JSON.parse(raw);
            const ageHours = (Date.now() - payload.timestamp) / (1000 * 60 * 60);
            if (ageHours > CONFIG.CACHE_TTL_HOURS) {
                localStorage.removeItem(CONFIG.CACHE_KEY);
                return null;
            }
            return payload.data;
        } catch (e) { return null; }
    }

    // --- RENDER ---
    function renderGallery(items) {
        fullGallery = items; // Store global for filtering
        populateFilters(items);

        // Initial Draw
        drawGrid(items);

        // Hide loader, show controls
        const loader = document.getElementById("gallery-loader");
        const controls = document.getElementById("gallery-controls");
        if (loader) loader.style.display = "none";
        if (controls) controls.style.display = "flex";

        setupLightbox();

        // Update status
        updateStatus(items.length);
    }

    function drawGrid(items) {
        const grid = document.getElementById("gallery-grid");
        if (!grid) return;

        grid.innerHTML = "";

        if (items.length === 0) {
            grid.innerHTML = "<p style='text-align:center;width:100%;padding:40px;'>No photos found.</p>";
            return;
        }

        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "gallery-item";
            // Stagger animation delay slightly? overflow issue for large lists
            // div.style.animationDelay = `${Math.min(index * 0.05, 1)}s`;

            div.innerHTML = `
                <img src="${item.thumb}" loading="lazy" alt="${item.caption || item.property}" />
            `;

            div.addEventListener("click", () => openLightbox(index, items)); // Pass current filtered list context? Or global?
            // Actually, better to pass the Item proper, or find index in current rendered set

            // Re-bind click for context aware navigation
            div.onclick = () => openLightbox(index, items);

            fragment.appendChild(div);
        });

        grid.appendChild(fragment);
    }

    function updateStatus(count) {
        const el = document.getElementById("gallery-status");
        if (el) el.innerText = `${count} photos`;
    }

    function populateFilters(items) {
        const select = document.getElementById("gallery-filter-property");
        if (!select) return;

        // Extract unique properties
        const props = [...new Set(items.map(i => i.property))].sort();

        props.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p;
            opt.textContent = p;
            select.appendChild(opt);
        });

        select.addEventListener("change", (e) => {
            const val = e.target.value;
            if (val === "all") {
                drawGrid(fullGallery);
                updateStatus(fullGallery.length);
            } else {
                const filtered = fullGallery.filter(i => i.property === val);
                drawGrid(filtered);
                updateStatus(filtered.length);
            }
        });
    }

    // --- LIGHTBOX ---
    let currentLightboxIndex = 0;
    let currentContextItems = [];

    function setupLightbox() {
        const lb = document.getElementById("gallery-lightbox");
        if (!lb) return;

        // Close events
        lb.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
        lb.querySelector(".lightbox-overlay").addEventListener("click", closeLightbox);

        // Nav events
        lb.querySelector(".lightbox-prev").addEventListener("click", (e) => { e.stopPropagation(); prevImage(); });
        lb.querySelector(".lightbox-next").addEventListener("click", (e) => { e.stopPropagation(); nextImage(); });

        // Keyboard
        document.addEventListener("keydown", (e) => {
            if (!lb.classList.contains("active")) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
        });
    }

    function openLightbox(index, list) {
        const lb = document.getElementById("gallery-lightbox");
        lb.classList.add("active");
        currentContextItems = list;
        currentLightboxIndex = index;
        updateLightboxContent();
        document.body.style.overflow = "hidden"; // Prevent scroll
    }

    function closeLightbox() {
        const lb = document.getElementById("gallery-lightbox");
        lb.classList.remove("active");
        document.body.style.overflow = "";
    }

    function updateLightboxContent() {
        const item = currentContextItems[currentLightboxIndex];
        const lb = document.getElementById("gallery-lightbox");

        const img = document.getElementById("lightbox-img");
        const title = document.getElementById("lightbox-title");
        const prop = document.getElementById("lightbox-property");

        // Preload generic
        img.style.opacity = 0.5;

        const newImg = new Image();
        newImg.src = item.src;
        newImg.onload = () => {
            img.src = item.src;
            img.style.opacity = 1;
        };

        title.textContent = item.caption || "";
        prop.textContent = item.property || "";
    }

    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentContextItems.length;
        updateLightboxContent();
    }

    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentContextItems.length) % currentContextItems.length;
        updateLightboxContent();
    }

})();
