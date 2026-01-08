# Implementación de Página de Galería en OwnerRez

Sigue estos pasos para activar la galería automática en el sitio web de Garden of Manors.

## 1. Crear la Custom Page

1. En OwnerRez, ve a **Settings > Hosted Websites**.
2. Selecciona el website activo (Garden of Manors).
3. Ve a la pestaña **Pages** y haz clic en **Create Custom Page**.
4. Configura lo siguiente:
   - **Menu Item/Title**: `Gallery`
   - **Page Type**: `Custom HTML`
   - **URL Slug**: `gallery` (Importante: debe coincidir con `GALLERY_PATH` del script).
   - **Show in Header Menu**: `Yes` (según prefieras).
   - **Meta Title**: `Luxury Vacation Rentals Gallery | Garden of Manors`
   - **Meta Description**: `Explora la belleza de nuestras propiedades exclusivas. Galería visual detallada de Garden of Manors.`

## 2. Insertar el Código (Copy-Paste)

### A. CSS y JS (Head Injection)
En lugar de pegar código, usaremos el CDN para cargar los archivos optimizados (versión **v3.1.15**).
1. Ve a **Settings > Hosted Websites > (Tu Sitio) > Change Layout HTML**.
2. Busca la sección `<head>` y añade las siguientes líneas:

```html
<!-- Gallery CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.15/dist/gom-gallery.min.css">
<!-- Gallery JS -->
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.15/js/gom-gallery.js"></script>
```

### B. HTML Body (Estructura)
1. Abre el archivo `gallery-body.html`.
2. Copia todo el contenido.
3. Pega el código en el campo **Body HTML** de la Custom Page "Gallery".

## 3. Configuración Manual (Si el auto-crawler falla)

Si la galería no encuentra las casas automáticamente, puedes especificar las URLs manualmente.
**Para hacer esto, debes editar el archivo `js/gom-gallery.js` en tu repositorio y crear una nueva release.**

Busca la línea `MANUAL_URLS` al principio del archivo:

```javascript
    CONFIG = {
        // ...
        // List of specific property URLs to scrape (overrides auto-discovery)
        MANUAL_URLS: [
             "/properties/the-gold-room",
             "/properties/sunset-villa"
        ],
        // ...
    };
```

## 4. Troubleshooting (Consola Debugger)

Si necesitas verificar qué detecta el script en una página específica, abre esa página en tu navegador, abre la consola (F12) y ejecuta este código:

```javascript
(() => {
  console.log("--- DEBUGGER GOM GALLERY ---");

  // 1. Check LightSlider (Prioridad 1)
  const ls = document.querySelector("#lightSlider");
  if(ls) {
      console.log("✅ #lightSlider found.");
      const imgs = Array.from(ls.querySelectorAll("li img"));
      console.log(`📸 Images in slider: ${imgs.length}`);
      imgs.forEach((img, i) => {
           let src = img.currentSrc || img.src;
           console.log(`   [${i}] ${src}`);
      });
  } else {
      console.warn("❌ #lightSlider NOT found.");
  }

  // 2. Check Links (Fallback)
  const links = document.querySelectorAll("a[href$='.jpg'], a[href$='.webp']");
  console.log(`🔗 High-Res Links found: ${links.length}`);
  links.forEach((a, i) => console.log(`   [Link ${i}] ${a.href}`));

})();
```
