# Garden of Manors - Assets & Overrides

Este repositorio contiene los estilos (CSS) y scripts (JS) utilizados para personalizar el sitio web **Garden of Manors**, construido sobre la plataforma **OwnerRez**.

## Table of Contents
- [Descripción General](#descripción-general)
- [Instalación](#instalación)
- [Uso y Comandos](#uso-y-comandos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Integración con OwnerRez](#integración-con-ownerrez)
- [Mapa de Páginas](#mapa-de-páginas)

---

## Descripción General

El proyecto utiliza un pipeline de construcción basado en **PostCSS** y scripts de PowerShell para gestionar, modularizar y minificar los archivos CSS que luego se inyectan en OwnerRez.

- **Producción**: Los archivos se sirven desde `jsdelivr` (CDN) apuntando a los tags de releases de este repositorio.
- **Desarrollo**: Se utiliza **Chrome DevTools Overrides** para mapear los recursos de producción a los archivos locales compilados, permitiendo ver cambios en tiempo real sin desplegar.

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

## Uso y Comandos

Los scripts principales se encuentran definidos en `package.json`:

| Comando | Descripción |
| :--- | :--- |
| `npm run build:css` | Compila todos los archivos CSS de `src/css/` a `dist/` (minificados). |
| `npm run build:ovr` | Compila los archivos hacia la carpeta de overrides locales (`src/css-overrides-devtool/...`) para desarrollo activo. |
| `npm run watch:css` | Observa cambios en `src/css/*.css` y reconstruye automáticamente. |
| `npm run dev:push` | Construye, hace commit con mensaje "dev", hace push a `main` y purga caché de jsdelivr (uso con precaución). |
| `npm run release` | Ejecuta el script de release para crear un nuevo tag de versión. |

## Estructura del Proyecto

```
gom-assets/
├── dist/                   # Archivos compilados listos para producción (.min.css)
├── src/
│   ├── css/                # Código fuente CSS (sin minificar, con @imports)
│   ├── js/                 # Scripts JS (Menu overlay, Mobile drawers)
│   └── css-overrides-devtool/ # Carpeta destino para local overrides
├── tools/                  # Scripts de PowerShell (Build, Release, Purge)
└── package.json            # Configuración de NPM y dependencias
```

## Integración con OwnerRez

### Mapa de Archivos CSS

La arquitectura CSS se divide modularmente para inyectar solo lo necesario en cada página de OwnerRez:

*   **`gom-global.min.css`**: Estilos base, fuentes, header, footer y **Overrides Móviles Globales** (importa reglas móviles). Se carga en *todas* las páginas.
*   **`gom-home.min.css`**: Específico para la **Home Page** (Intro, Hero adjustments, listado de habitaciones tipo grid).
*   **`gom-properties.min.css`**: Específico para **Detalle de Propiedad**. Incluye estilos para el drawer móvil de propiedades.
*   **`gom-multiproperty.min.css`**: Para los listados de búsqueda y resultados.
*   **`gom-blog.min.css`**: Específico para el **Blog Index** rediseñado.
*   **`gom-widget_*.min.css`**: Estilos inyectados directamente en la configuración de widgets específicos (Reviews, Booking).

### Ejemplo de Integración (Head Global)

Para producción, el `Head HTML` en OwnerRez debe lucir similar a esto (ajustando la versión `@vX.X.X`):

```html
<!-- CSS Globales -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/dist/gom-global.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/dist/gom-home.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/dist/gom-properties.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/dist/gom-book.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/dist/gom-multiproperty.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/dist/gom-blog.min.css">

<!-- Scripts -->
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/js/gom-menu-overlay.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.3/js/gom-properties-mobile-drawer.js"></script>
```

> **Nota para Desarrollo**: En el entorno local o DEV, los links deben apuntar a la rama `@main` para reflejar los últimos cambios sin tag, o utilizar Local Overrides.

## Mapa de Páginas

**Páginas Listas (Revisión 1):**
1. **Home**: [PROD](https://gardenofmanors.com) | [DEV](https://gomdev.hosted.ownerrez.com/)
2. **Book**: [PROD](https://gardenofmanors.com/book) | [DEV](https://gomdev.hosted.ownerrez.com/book)
3. **Properties/Rooms**: [PROD](https://gardenofmanors.com/properties) | [DEV](https://gomdev.hosted.ownerrez.com/properties)
4. **Propiedad Individual** (Plantilla): [Ejemplo PROD](https://gardenofmanors.com/the-gold-room-garden-of-manors-guesthousefl) | [Ejemplo DEV](https://gomdev.hosted.ownerrez.com/the-gold-room-garden-of-manors-guesthousefl)

**Páginas Pendientes de Personalización:**
1. **Blog**: [PROD](https://gardenofmanors.com/blog) | [DEV](https://gomdev.hosted.ownerrez.com/blog) (Listo en v3.1.3)
2. **Blog Post (Plantilla)**: [Ejemplo PROD](https://gardenofmanors.com/blog/wilton-drive-guide-2025) | [Ejemplo DEV](https://gomdev.hosted.ownerrez.com/blog/wilton-drive-guide-2025)
3. **Reviews**: [PROD](https://gardenofmanors.com/reviews) | [DEV](https://gomdev.hosted.ownerrez.com/reviews)
4. **House Rules**: [PROD](https://gardenofmanors.com/house-rules) | [DEV](https://gomdev.hosted.ownerrez.com/house-rules)
5. **Map**: [PROD](https://gardenofmanors.com/map) | [DEV](https://gomdev.hosted.ownerrez.com/map)
