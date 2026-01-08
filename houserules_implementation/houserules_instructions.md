# Implementación de House Rules en OwnerRez

Dale un aspecto premium a tus reglas con este nuevo diseño.

## 1. Crear/Editar la Custom Page

1. En OwnerRez, edita tu página de "House Rules" (o crea una nueva).
2. Asegúrate de que el **Page Type** sea `Custom HTML`.

## 2. Insertar el Código

### A. CSS (Head Injection)
Añade la hoja de estilos `gom-house-rules.min.css` (versión v3.1.18).

En **Change Layout HTML > Head**:
```html
<!-- House Rules CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.18/dist/gom-house-rules.min.css">
```
*(No sobrescribe el CSS de galería o contact, pueden convivir).*

### B. Font Awesome
Si no lo añadiste antes:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### C. HTML Body
1. Abre el archivo `house-rules-body.html` (carpeta `houserules_implementation`).
2. Copia todo el contenido.
3. Pega el código en el campo **Body HTML** de la página.

## 3. Resultado
Obtendrás una página con:
- Cabecera con degradado dorado sutil.
- Badges rápidos (Men-Only, 21+, etc.).
- Navegación interna (pills) que se queda fija al hacer scroll (sticky).
- Reglas organizadas en tarjetas grid con iconos.
- Sección final de aceptación legal.
