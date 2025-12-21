Por hacer en Home:
1. El Widget de busqueda, en vista pc (@media (min-width: 769px)) esta abarcando el 100% del width y realmente sus margenes deberian coincidir con el resto de las secciones de la pagina (6% left-right) En vista movil lo resolci usando 'carousel-includes-search #search-bar-widget {
        margin-left: 5% !important;
        width: 90% !important;
    }
    pero en vista pc, ese metodo no funciona, rompe completamente el diseño de los elementos contenidos e el widget como Arrival/Departure/boton Search, etcetera.
2. Los 'captions' que agrege usando 'after' y 'before' (como por ejemplo: 'content: "Heated\A saltwater\A pool";content: "21+" etcetera) no estan y mantienen bien alineada su ubicacion atendiendo al resto de los elementos. Ademas de que su altura, o sea su margin-top deberia ser igual al de la altura del header.
3. Los parrafos del intro, que actualmente se divide en tres columnas, debo encontrar una solucion, pues en pantallas muy anchas es muy poco texto y deja mucho espacio en blanco, una solucion pudiera ser aumentar el texto y usar 'read more' en pantallas mas pequeñas (aqui si puedo usar html y quizas aumentar el texto aumentaria SEO) o la otra solucion seria delimitar el ancho desinado a estos textos, por ejemplo si en ves de tres fuesen cuatro columnas pero obligase al texto a ocupar solo 3, es verdad que quedaria un espacio vacio atendiendo al ancho, pero atendiendo al alto, el viewport estaria mas 'lleno' de contenido.
4. En el widget de 'Revies' que esta dentro del 'iFrame' en la pagina, no se respeto el margen del sitio y ahi que corregirlo (6% igual que el de search bar y los demas elementos)
5. Debido a que en las mismas reviews, tengo cuatro columnas y es bastante visible, lo ideal seria respetar esa 'filosofia' en el resto de la pagina, o sea, cuatro columnas tambien en el footer, en el menu principal, en los parrafos del intro, etcetera.
6. Al hacer hover sobre los elementos del footer el 'color' de los mismos cambia a uno oscuro, haciendolos invisibles, hay que cambiarlo y ajustarlo, ademas, recomiendo eliminar el fondo del footer.
7. Respecto al Menu (overlay) que primero debes entender como esta construido modificando los aspectos del html original hay que corregir varios puntos, que me solicitaras cuando corresponda dedicarnos a el.
LOCAL HEAD: f1122df
REMOTE main: f1122df
RAW has token?  True
CDN has token?  True
