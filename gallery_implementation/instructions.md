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

### A. CSS (Estilos)
1. Abre el archivo `gallery-styles.css` que te he enviado.
2. Copia todo el contenido.
3. En la configuración de la página en OwnerRez, busca el campo **CSS** (o "Inline CSS").
4. Pega el código allí.

### B. HTML Body (Estructura)
1. Abre el archivo `gallery-body.html`.
2. Copia todo el contenido.
3. Pega el código en el campo **Body HTML** de la página.

### C. Javascript (Lógica)
1. Abre el archivo `gallery-loader.js`.
2. Copia todo el contenido.
3. Para insertar este script, tienes dos opciones:
   - **Opción Recomendada**: Ir a **Settings > Hosted Websites > (Tu Sitio) > Change Layout HTML**. Busca la sección `<head>` y pega el script justo antes del cierre `</head>`.
     - *Nota*: El script tiene una protección (`window.location.pathname`) para que SOLO se ejecute cuando el usuario está en `/gallery`, así que es seguro ponerlo en el layout global.
   - **Opción Alternativa**: Si OwnerRez permite "Footer Injection" específico por página, úsalo ahí, pero asegúrate de envolverlo en `<script>...</script>`.

## 3. Verificación y QA

Una vez guardado:
1. Abre una pestaña de incógnito.
2. Ve a `https://tu-dominio.com/gallery`.
3. Deberías ver el mensaje "Curating gallery..." y un spinner.
4. Tras unos segundos, las fotos deberían aparecer en formato grid masonería.
5. **Prueba**:
   - Haz clic en una foto -> Debe abrirse el Lightbox.
   - Usa las flechas del teclado -> Debe navegar.
   - Filtra por propiedad en el dropdown superior -> Debe mostrar solo esa casa.
   - Carga la página en el móvil -> Debe verse en 1 o 2 columnas y ser táctil.

## Configuración Avanzada (Opcional)

Si necesitas cambiar límites o rutas, edita las constantes al inicio del script `gallery-loader.js`:

```javascript
    const CONFIG = {
        GALLERY_PATH: "/gallery",  // Cambiar si usas otro slug
        INDEX_CANDIDATES: ["/properties", ...], // Dónde buscar los links a casas
        MAX_TOTAL_PHOTOS: 500, // Límite total
        // ...
    };
```
