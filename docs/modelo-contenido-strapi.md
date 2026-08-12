# Modelo de contenido en Strapi

Todo lo que se ve en el sitio sale de Strapi. Este documento lista **exactamente** los
tipos de contenido, componentes y campos que hay que crear para que las páginas se
llenen solas. Los nombres de campo son los que consultan `lib/content-manager.ts`:
si cambias uno, hay que cambiarlo también ahí.

Reglas generales:

- Los nombres de campo van en **español** y en `camelCase` (así los pide el código).
- Todo campo puede quedar vacío: el sitio simplemente no pinta esa parte. Nada rompe.
- Cada tipo nuevo necesita permiso `find` para el rol **Public**
  (Settings → Users & Permissions → Roles → Public).
- Las imágenes se sirven optimizadas por Astro; sube el mejor original que tengas
  (mínimo ~1600 px de ancho en fondos, ~1000 px en tarjetas).

---

## Componentes reutilizables

Créalos primero: los usan varios tipos de contenido.

### `shared.call-to-action` (componente)

| Campo           | Tipo    | Notas                                       |
| --------------- | ------- | ------------------------------------------- |
| `label`         | Text    | Texto del botón. Ej: "Cotiza tu proyecto"   |
| `href`          | Text    | Ej: `/contactanos` o un `https://wa.me/...` |
| `nuevaPestania` | Boolean | `true` abre en pestaña nueva                |

### `shared.trabajo` (componente — repetible)

Un trabajo realizado de la galería.

| Campo         | Tipo         | Notas                                                     |
| ------------- | ------------ | --------------------------------------------------------- |
| `titulo`      | Text         | Ej: "Valla Centro Comercial Unicentro"                     |
| `categoria`   | Text         | Alimenta los filtros de la galería. Ej: "Vallas"           |
| `descripcion` | Text (long)  | Se muestra al abrir la imagen                              |
| `imagen`      | Media (única)| Obligatoria para que la pieza aparezca                     |
| `destacado`   | Boolean      | Ocupa el doble de espacio en el mosaico. Usa 1 o 2 por galería |

### `shared.item` (componente — repetible)

| Campo    | Tipo | Notas                                   |
| -------- | ---- | --------------------------------------- |
| `nombre` | Text | Ej: "Vinilo adhesivo", "Lona banner 13oz" |

### `shared.punto` (componente — repetible)

| Campo   | Tipo | Notas                                            |
| ------- | ---- | ------------------------------------------------ |
| `texto` | Text | Argumento de venta. Ej: "Entrega en 48 horas"    |

---

## 1. Inicio — círculos de servicios

**Single type:** `servicios-inicio` → `/api/servicios-inicio`

| Campo        | Tipo                                          |
| ------------ | --------------------------------------------- |
| `etiqueta`   | Text — antetítulo. Ej: "Lo que hacemos"        |
| `titulo`     | Text — Ej: "Servicios que hacen ver tu marca"  |
| `subtitulo`  | Text (long)                                   |
| `servicios`  | Componente repetible `inicio.servicio-circulo`|

### `inicio.servicio-circulo`

| Campo         | Tipo          | Notas                                            |
| ------------- | ------------- | ------------------------------------------------ |
| `nombre`      | Text          | Ej: "Impresiones"                                 |
| `descripcion` | Text (corta)  | 1 línea, máx ~90 caracteres                       |
| `href`        | Text          | `/servicios/impresiones`, `/servicios/visibilidad`, `/servicios/insumos`, `/servicios/estructuras` |
| `imagen`      | Media (única) | Se recorta en círculo → usa una imagen centrada  |

> Están pensados 4 círculos (uno por página de servicio). Con más de 4 la fila se
> reacomoda sola, pero 4 es el diseño ideal.

---

## 2. Inicio — Horario de Atención y ubicación

**Single type:** `horario-ubicacion` → `/api/horario-ubicacion`

| Campo          | Tipo                                    |
| -------------- | --------------------------------------- |
| `etiqueta`     | Text — Ej: "Visítanos"                   |
| `titulo`       | Text — Ej: "Horario de Atención y ubicación" |
| `subtitulo`    | Text (long)                             |
| `horarios`     | Relación oneToMany → `api::horario.horario` |
| `notaHorario`  | Text (long) — Ej: "Festivos previa cita" |
| `ubicaciones`  | Relación oneToMany → `api::ubicacion.ubicacion` (la página usa la primera) |
| `callToAction` | Componente único `ui.boton`             |

### Collection type `horario`

| Campo       | Tipo    | Notas                                                |
| ----------- | ------- | ---------------------------------------------------- |
| `dias`      | Text    | Ej: "Lunes a Viernes", "Sábados", "Domingos y festivos" |
| `hora`      | Text    | Ej: "8:00 a.m. – 6:00 p.m." o "Cerrado"                |
| `cerrado`   | Boolean | Atenúa la fila (para días sin atención)                |
| `destacado` | Boolean | Resalta la fila en cian (jornada principal)            |

### Collection type `ubicacion`

| Campo        | Tipo        | Notas                                                        |
| ------------ | ----------- | ------------------------------------------------------------ |
| `direccion`  | Text        | Ej: "Cra. 14 # 20-35, Local 3"                                |
| `ciudad`     | Text        | "Armenia, Quindío"                                            |
| `referencia` | Text        | Ej: "Frente al Parque Sucre"                                  |
| `mapaEmbed`  | Text (long) | **Solo la URL del `src`** del iframe de Google Maps (empieza por `https://www.google.com/maps/embed?pb=...`) |
| `mapaHref`   | Text        | Enlace normal de Google Maps para "Cómo llegar"               |

---

## 3. Inicio — galería de trabajos realizados

**Single type:** `galeria-inicio` → `/api/galeria-inicio`

| Campo          | Tipo                                     |
| -------------- | ---------------------------------------- |
| `etiqueta`     | Text — Ej: "Portafolio"                   |
| `titulo`       | Text — Ej: "Trabajos que ya están en la calle" |
| `subtitulo`    | Text (long)                              |
| `trabajos`     | Componente repetible `shared.trabajo`    |
| `callToAction` | Componente único `shared.call-to-action` |

La galería genera sola los filtros a partir del campo `categoria` de cada trabajo
(si hay 2 o más categorías distintas). Al hacer clic se abre la imagen en grande.

---

## 4. Páginas de servicio

**Collection type:** `servicio` → `/api/servicios`

Una entrada por página. El `slug` decide qué página la muestra:

| slug           | Página                      |
| -------------- | --------------------------- |
| `impresiones`  | `/servicios/impresiones`    |
| `visibilidad`  | `/servicios/visibilidad`    |
| `insumos`      | `/servicios/insumos`        |
| `estructuras`  | `/servicios/estructuras`    |

### Campos

| Campo                 | Tipo                                      | Dónde se ve                                        |
| --------------------- | ----------------------------------------- | -------------------------------------------------- |
| `slug`                | UID                                       | Solo interno — debe ser uno de los 4 de arriba      |
| `etiqueta`            | Text                                      | Antetítulo del encabezado                            |
| `titulo`              | Text                                      | Título grande del encabezado                         |
| `subtitulo`           | Text (long)                               | Bajada del encabezado                                |
| `imagen`              | Media (única, imagen o video mp4)         | Fondo del encabezado                                 |
| `callToAction`        | `shared.call-to-action`                   | Botón del encabezado                                 |
| `introTitulo`         | Text                                      | Bloque de introducción                               |
| `introMensaje`        | Rich text (Blocks)                        | Bloque de introducción                               |
| `puntosClave`         | Repetible `shared.punto`                  | Lista con check al lado de la introducción           |
| `categoriasEtiqueta`  | Text                                      | Antetítulo de la sección de categorías               |
| `categoriasTitulo`    | Text                                      | Ej: "Qué imprimimos"                                 |
| `categoriasSubtitulo` | Text (long)                               |                                                      |
| `categorias`          | Repetible `servicios.categoria`           | El contenido de la sección de categorías             |
| `trabajosEtiqueta`    | Text                                      | Antetítulo de la galería del servicio                |
| `trabajosTitulo`      | Text                                      | Ej: "Trabajos realizados"                            |
| `trabajosSubtitulo`   | Text (long)                               |                                                      |
| `trabajos`            | Repetible `shared.trabajo`                | Galería del servicio                                 |
| `cierre`              | Componente único `servicios.cierre`       | Bloque final para contactar ventas                   |
| `metaTitulo`          | Text                                      | `<title>` de la pestaña                              |
| `metaDescripcion`     | Text (long)                               | Meta description para buscadores                     |

### `servicios.categoria`

| Campo         | Tipo                     | Notas                                       |
| ------------- | ------------------------ | ------------------------------------------- |
| `nombre`      | Text                     | Ej: "Gran formato"                           |
| `descripcion` | Text (long)              | 2–4 líneas                                   |
| `imagen`      | Media (única)            |                                              |
| `items`       | Repetible `shared.item`  | Materiales / productos de esa categoría      |

> En `visibilidad` y `estructuras` la **primera** categoría se muestra más grande
> (diseño en mosaico), así que ponle la más vendedora de primera.

### `servicios.cierre`

Bloque de persuasión final. El sitio **no es una tienda**: aquí es donde el visitante
pasa a hablar con ventas.

| Campo             | Tipo                    | Notas                                             |
| ----------------- | ----------------------- | ------------------------------------------------- |
| `titulo`          | Text                    | Ej: "¿Cotizamos tu proyecto hoy?"                  |
| `mensaje`         | Rich text (Blocks)      | Refuerzo: asesoría sin costo, tiempos de entrega…  |
| `callToAction`    | `shared.call-to-action` | Botón principal                                    |
| `telefono`        | Text                    | Se muestra tal cual; el enlace `tel:` se limpia solo |
| `whatsapp`        | Text                    | Número con indicativo. Ej: `573001234567`          |
| `whatsappMensaje` | Text (long)             | Mensaje precargado del chat                        |

Si `titulo` está vacío, la sección completa no se muestra.

---

## Cómo se arma cada página de servicio

Todas usan el mismo `ServicioTemplate`, que resuelve encabezado → introducción →
categorías → trabajos → cierre. Lo único que cambia por página es **cómo se ven las
categorías** (el template recibe los datos, la página elige el diseño):

| Página        | Diseño de categorías  | Componente               |
| ------------- | --------------------- | ------------------------ |
| Impresiones   | Filas alternadas      | `CategoriasAlternadas`   |
| Visibilidad   | Mosaico con foto      | `CategoriasMosaico`      |
| Insumos       | Lista numerada        | `CategoriasLista`        |
| Estructuras   | Tarjetas en grilla    | `CategoriasGrid`         |

Para cambiar el diseño de una página, cambia el componente que se le pasa al slot
`categorias` en `src/pages/servicios/<pagina>.astro`. Si no se pasa ninguno, el
template usa `CategoriasGrid`.
