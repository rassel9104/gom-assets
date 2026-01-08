# Implementación de Página de Contacto en OwnerRez

Sigue estos pasos para crear la página de Contacto con diseño premium "Garden of Manors".

## 1. Crear la Custom Page

1. En OwnerRez, ve a **Settings > Hosted Websites**.
2. Selecciona el website activo (Garden of Manors).
3. Ve a la pestaña **Pages** y haz clic en **Create Custom Page**.
4. Configura lo siguiente:
   - **Menu Item/Title**: `Contact` (o Contact Us)
   - **Page Type**: `Custom HTML`
   - **URL Slug**: `contact`
   - **Show in Header Menu**: `Yes`
   - **Meta Title**: `Contact Garden of Manors | Luxury Hospitality`
   - **Meta Description**: `Get in touch with Garden of Manors. Visit us in Wilton Manors, call us directly, or message your hosts Anthony and Joe.`

## 2. Insertar el Código

### A. CSS (Head Injection)
Usaremos la nueva hoja de estilos `gom-contact.min.css` desde el CDN.

1. Ve a **Settings > Hosted Websites > (Tu Sitio) > Change Layout HTML**.
2. Busca la sección `<head>` y añade la siguiente línea (asegúrate de no borrar las anteriores de la galería):

```html
<!-- Contact Page CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.17/dist/gom-contact.min.css">
```

*(Nota: Si ya tienes scripts de la galería, solo añade esta línea debajo).*

### B. Font Awesome (Si no está ya incluido)
Nuestros iconos requieren Font Awesome. Si tu theme de OwnerRez no lo incluye, añádelo también al `<head>`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### C. HTML Body (Estructura)
1. Abre el archivo `contact-body.html` ubicado en la carpeta `contact_implementation`.
2. Copia todo el contenido.
3. Pega el código en el campo **Body HTML** de la Custom Page "Contact".

## 3. Personalización (Opcional)

Si necesitas cambiar los enlaces de WhatsApp, teléfonos, o las fotos de los anfitriones:
- Edita directamente el HTML en el campo **Body HTML** de OwnerRez.
- Busca `href="https://wa.me/..."` y cambia el número.
- Busca `src="https://placehold.co/..."` en las tarjetas de Anthony/Joe y reemplaza la URL con la dirección real de sus fotos (puedes subir sus fotos a OwnerRez Files y copiar el enlace).

## 4. Verificación

1. Entra a `https://[tu-dominio]/contact`.
2. Verifica que se vea el título "Get in Touch" con el efecto dorado.
3. Prueba los botones de llamada y WhatsApp en tu móvil.
