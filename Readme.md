Paginas listas 'Primera Revision':

1. Home (https://gardenofmanors.com) dev: https://gomdev.hosted.ownerrez.com/
2. Book (https://gardenofmanors.com/book) dev: https://gomdev.hosted.ownerrez.com/book
3. Properties/Rooms (https://gardenofmanors.com/properties) dev: https://gomdev.hosted.ownerrez.com/properties
4. Propiedades individuales se configuran en un solo css como plantilla, por ejemplo (https://gardenofmanors.com/the-gold-room-garden-of-manors-guesthousefl) dev: https://gomdev.hosted.ownerrez.com/the-gold-room-garden-of-manors-guesthousefl

Paginas por personalizar:

1. Blog (https://gardenofmanors.com/blog) dev: https://gomdev.hosted.ownerrez.com/blog
2. Plantilla de cada blog por ejemplo: (https://gardenofmanors.com/blog/wilton-drive-guide-2025) dev: https://gomdev.hosted.ownerrez.com/blog/wilton-drive-guide-2025
3. Reviews (https://gardenofmanors.com/reviews) dev: https://gomdev.hosted.ownerrez.com/reviews
4. House Rules (https://gardenofmanors.com/house-rules) dev: https://gomdev.hosted.ownerrez.com/house-rules
5. Map (https://gardenofmanors.com/map) dev: https://gomdev.hosted.ownerrez.com/map
6. Nuevas que hagan falta...

Ejemplo de configuracion/integracion en Prod (editar el Head para incluir): "<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.2/dist/gom-global.min.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.2/dist/gom-home.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.2/dist/gom-properties.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.2/dist/gom-book.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.2/dist/gom-multiproperty.min.css">

<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.2/js/gom-menu-overlay.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@v3.1.2/js/gom-properties-mobile-drawer.js"></script>"

EjemplEjemplo de configuracion/integracion en Dev (editar el Head para incluir):
"<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/dist/gom-global.min.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/dist/gom-home.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/dist/gom-properties.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/dist/gom-book.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/dist/gom-multiproperty.min.css">

<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/js/gom-menu-overlay.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/js/gom-properties-mobile-drawer.js"></script>"
