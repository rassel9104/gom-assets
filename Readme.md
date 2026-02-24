# Garden of Manors — Assets & Overrides

Este repositorio contiene los estilos (CSS) y scripts (JS) utilizados para personalizar el sitio web **Garden of Manors**, construido sobre la plataforma **OwnerRez**.

## Table of Contents
- [Descripción General](#descripción-general)
- [Instalación](#instalación)
- [Uso y Comandos](#uso-y-comandos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Mapa de Archivos CSS](#mapa-de-archivos-css)
- [Scripts JS](#scripts-js)
- [Carpetas de Implementación](#carpetas-de-implementación)
- [Integración con OwnerRez](#integración-con-ownerrez)
- [Mapa de Páginas](#mapa-de-páginas)

---

## Descripción General

El proyecto utiliza un pipeline de construcción basado en **PostCSS** y scripts de PowerShell para gestionar, modularizar y minificar los archivos CSS que luego se inyectan en OwnerRez.

- **Producción**: Los archivos se sirven desde `jsdelivr` (CDN) apuntando a los tags de releases (`@vX.X.X`) de este repositorio.
- **Desarrollo**: Se utiliza **Chrome DevTools Overrides** para mapear los recursos de producción a los archivos locales compilados, permitiendo ver cambios en tiempo real sin desplegar.
- **El tag de release actualmente en uso en producción debe revisarse en OwnerRez > Settings > Hosted Websites > Layout HTML.**

---

## Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/rassel9104/gom-assets.git
   cd gom-assets
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

---

## Uso y Comandos

Los scripts principales se encuentran definidos en `package.json`:

| Comando | Descripción |
| :--- | :--- |
| `npm run build:css` | Compila todos los archivos CSS de `src/css/` a `dist/` (minificados con PostCSS + cssnano). |
| `npm run build` | Alias de `build:css`. |
| `npm run build:ovr` | Compila los archivos hacia la carpeta `src/css-overrides-devtool/` para uso con Chrome DevTools Overrides en desarrollo. |
| `npm run watch:css` | Observa cambios en `src/css/*.css` y re-ejecuta `build:css` automáticamente (usa `chokidar`). |
| `npm run dev:push` | Compila CSS, hace commit con mensaje `"dev"`, hace push a `main` y purga la caché de jsDelivr para `@main`. Usar con precaución. |
| `npm run release` | Ejecuta `release-tag.ps1`: compila, hace commit, push a `main`, crea un tag `vX.Y.Z` anotado (auto-incremental en patch), hace push del tag y purga caché de jsDelivr para ese tag. |
| `npm run tags:purge` | Ejecuta `purge-tags.ps1`: limpia tags locales o remotos obsoletos. |

> **Nota sobre `release`**: El script `release-tag.ps1` auto-incrementa el patch del último tag si no se especifica uno (`-Tag vX.Y.Z`). Soporte para modo `-DryRun` para simular sin cambios reales.

---

## Estructura del Proyecto

```
gom-assets/
├── dist/                          # Archivos compilados para producción (.min.css)
├── src/
│   ├── css/                       # Código fuente CSS (con @imports, sin minificar)
│   ├── css-overrides-devtool/     # Destino para Chrome DevTools Local Overrides (desarrollo)
│   ├── img/                       # Imágenes de referencia o recursos estáticos
│   └── psd/                       # Archivos fuente de diseño (PSD/Figma exports)
├── js/                            # Scripts JS (servidos por CDN en producción)
├── tools/                         # Scripts PowerShell: build, release, purge
├── gallery_implementation/        # Guía e HTML para activar la página Gallery en OwnerRez
├── contact_implementation/        # Guía e HTML para activar la página Contact en OwnerRez
├── houserules_implementation/     # Guía e HTML para activar la página House Rules en OwnerRez
├── blog_posts/                    # Contenido de artículos de blog
├── package.json                   # Configuración NPM y dependencias
└── postcss.config.cjs             # Configuración de PostCSS (autoprefixer, cssnano, postcss-import)
```

> **Archivos HTML de preview en raíz** (`_preview_blog_post.html`, `_preview_blog_sidebar.html`, `_preview_reviews.html`, etc.): son simulaciones locales para testear estilos antes de inyectar en OwnerRez. No se despliegan.

---

## Mapa de Archivos CSS

El script `tools/build-css.ps1` compila los siguientes pares `src → dist`:

| Archivo fuente (`src/css/`) | Compilado (`dist/`) | Uso |
| :--- | :--- | :--- |
| `gom-global.css` | `gom-global.min.css` | Estilos base, fuentes, header, footer, overrides móviles globales. Se carga en **todas** las páginas. |
| `gom-home.css` | `gom-home.min.css` | Home page: Hero, intro, grid de habitaciones. |
| `gom-properties.css` | `gom-properties.min.css` | Página de detalle de propiedad individual. |
| `gom-multiproperty.css` | `gom-multiproperty.min.css` | Listados de búsqueda y resultados (multi-property). |
| `gom-book.css` | `gom-book.min.css` | Página de reserva (`/book`). |
| `gom-blog.css` | `gom-blog.min.css` | Blog index rediseñado. |
| `gom-blog-post.css` | `gom-blog-post.min.css` | Plantilla de artículo individual de blog. |
| `gom-reviews.css` | `gom-reviews.min.css` | Página de reseñas (`/reviews`). |
| `gom-gallery.css` | `gom-gallery.min.css` | Página de galería personalizada (`/gallery`). |
| `gom-menu-overlay.css` | `gom-menu-overlay.min.css` | Overlay/menú móvil. Puede cargarse como widget o globalmente. |
| `contact.css` | `gom-contact.min.css` | Página de contacto personalizada. |
| `house-rules.css` | `gom-house-rules.min.css` | Página de House Rules personalizada. |
| `widget_reviews.css` | `gom-widget_reviews.min.css` | Widget de reseñas inyectado en configuración de widgets. |
| `widget-book.css` | `gom-widget_book.min.css` | Widget del motor de reservas. |

> **`gom-blog-rich-media.min.css`** también existe en `dist/` para rich media en posts, generado aparte.

---

## Scripts JS

Ubicados en `js/` y servidos directamente por CDN (sin paso de compilación):

| Archivo | Descripción |
| :--- | :--- |
| `gom-menu-overlay.js` | Lógica del menú overlay y drawer de navegación móvil. |
| `gom-properties-mobile-drawer.js` | Drawer deslizable de detalles de propiedad en móvil. |
| `gom-gallery.js` | Auto-crawler de imágenes de propiedades para armar la galería dinámica en `/gallery`. Soporta `MANUAL_URLS` como override. Ver `gallery_implementation/instructions.md`. |

---

## Carpetas de Implementación

Estas carpetas contienen **guías paso a paso** y el **HTML listo para pegar** en OwnerRez al activar cada página personalizada por primera vez:

| Carpeta | Página | Archivo clave |
| :--- | :--- | :--- |
| `gallery_implementation/` | `/gallery` | `instructions.md`, `gallery-body.html` |
| `contact_implementation/` | `/contact` (o similar) | `contact_instructions.md`, `contact-body.html` |
| `houserules_implementation/` | `/house-rules` | `houserules_instructions.md`, `house-rules-body.html` |

> Cada carpeta también incluye un `simulation.html` para previsualizar el resultado en el navegador sin OwnerRez.

---

## Integración con OwnerRez

### Ejemplo de integración (Head HTML global)

Para producción, el `Head HTML` en **OwnerRez > Settings > Hosted Websites > Layout HTML** debe incluir (ajustando `@vX.X.X` al tag de release vigente):

```html
<!-- CSS Globales -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-global.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-home.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-properties.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-book.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-multiproperty.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-blog.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-reviews.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-gallery.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-contact.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/dist/gom-house-rules.min.css">

<!-- Scripts -->
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/js/gom-menu-overlay.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/js/gom-properties-mobile-drawer.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.25/js/gom-gallery.js"></script>
```

> **Desarrollo**: Apuntar a `@main` en lugar de un tag de versión, o usar **Chrome DevTools > Sources > Overrides** mapeando el CDN a los archivos de `src/css-overrides-devtool/`.

### Widgets con CSS propio

Algunos widgets de OwnerRez tienen su propio campo de CSS. Los archivos correspondientes se inyectan ahí directamente, no en el `<head>`:
- `gom-widget_reviews.min.css` → Widget de Reviews
- `gom-widget_book.min.css` → Widget del motor de reservas

---

## Mapa de Páginas

### Páginas Activas (Con CSS/JS propio)

| Página | PROD | DEV |
| :--- | :--- | :--- |
| **Home** | [gardenofmanors.com](https://gardenofmanors.com) | [gomdev](https://gomdev.hosted.ownerrez.com/) |
| **Book** | [/book](https://gardenofmanors.com/book) | [/book DEV](https://gomdev.hosted.ownerrez.com/book) |
| **Properties (Listado)** | [/properties](https://gardenofmanors.com/properties) | [/properties DEV](https://gomdev.hosted.ownerrez.com/properties) |
| **Propiedad Individual** | [Ejemplo PROD](https://gardenofmanors.com/the-gold-room-garden-of-manors-guesthousefl) | [Ejemplo DEV](https://gomdev.hosted.ownerrez.com/the-gold-room-garden-of-manors-guesthousefl) |
| **Blog Index** | [/blog](https://gardenofmanors.com/blog) | [/blog DEV](https://gomdev.hosted.ownerrez.com/blog) |
| **Blog Post (Plantilla)** | [Ejemplo PROD](https://gardenofmanors.com/blog/wilton-drive-guide-2025) | [Ejemplo DEV](https://gomdev.hosted.ownerrez.com/blog/wilton-drive-guide-2025) |
| **Reviews** | [/reviews](https://gardenofmanors.com/reviews) | [/reviews DEV](https://gomdev.hosted.ownerrez.com/reviews) |
| **Gallery** | [/gallery](https://gardenofmanors.com/gallery) | [/gallery DEV](https://gomdev.hosted.ownerrez.com/gallery) |
| **Contact** | [/contact](https://gardenofmanors.com/contact) | — |
| **House Rules** | [/house-rules](https://gardenofmanors.com/house-rules) | [/house-rules DEV](https://gomdev.hosted.ownerrez.com/house-rules) |
| **Map** | [/map](https://gardenofmanors.com/map) | [/map DEV](https://gomdev.hosted.ownerrez.com/map) |
