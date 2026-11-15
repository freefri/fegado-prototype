# Prototipo FEGADO

Prototipo de la web pública de la FEGADO (Federación Galega de Orientación). La web actual está en
<https://fegado.es/>, y sus textos se reutilizan aquí como contenido provisional.

Publicado en <https://freefri.github.io/fegado-prototype/> (gallego) y
<https://freefri.github.io/fegado-prototype/es/> (castellano), sin indexar en buscadores.

## Desarrollo

Requiere Node 22 (`nvm use` toma la versión de `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321/fegado-prototype/
npm run build     # comprueba imágenes y tipos, genera dist/ y el índice del buscador
```

Cada push a `main` publica la web en GitHub Pages; en un pull request solo se comprueba que compila.
El buscador de noticias solo funciona con la web generada (`npm run build` y `npm run preview`).

- `src/pages/`: una ruta por página; las de castellano van en `src/pages/es/`.
- `src/content/news/<año>/`: una noticia por archivo Markdown.
- `src/content/events/<año>/`: un evento por archivo Markdown, con su cartel en `src/assets/images/events/`.
- `src/content/documents.json`: la lista de documentos de Transparencia (los archivos siguen en fegado.es).
- `src/content/board.yaml`: la Xunta Directiva.
- `src/content/pages/<idioma>/`: páginas de texto (Sobre FEGADO, preguntas frecuentes) en MDX, una por idioma.
- `src/content/clubs.yaml`: los clubs, con su logo en `src/assets/images/clubs/`.
- `src/components/`: piezas de la web; `src/components/ui/` son los componentes de shadcn/ui.
- `src/i18n/locales/<idioma>/<área>.json`: textos fijos de la web, un archivo por área (común, portada,
  novas, eventos…). El gallego es el idioma de origen: define las claves, y lo que falte en castellano
  se muestra en gallego. `npm run check:translations` (también en el build) falla si una traducción
  tiene una clave que no existe en gallego o cambia sus `{marcadores}`, y avisa de lo que falta.
  Las claves se escriben con puntos, `t("nav.about")`, y la primera parte es el bloque del archivo.
  Un área nueva se añade también al tipo `Source` de `src/i18n/ui.ts`.
- `src/i18n/routes.ts`: la ruta de cada página en cada idioma; el cambio de idioma la usa para traducir la URL.
- `src/data/`: enlaces, contacto y registro de imágenes.
- `src/styles/global.css`: colores, tipografías y variables del tema.

### Contenido de la web actual

Noticias, eventos y documentos se importan de <https://fegado.es/>. Las noticias no se traducen:
cada una indica en `lang` el idioma en que se escribió.

```bash
node scripts/import-news.mjs --since 2026     # noticias desde 2026 (--all: todo el archivo)
node scripts/import-news.mjs --categorize     # adivina categorías para las que no tienen
node scripts/import-events.mjs --since 2026   # eventos desde la temporada 2026, con sus carteles
node scripts/import-documents.mjs             # lista de documentos de Transparencia
```

Solo descargan lo nuevo; con `--force` vuelven a generar lo existente, conservando los campos
añadidos a mano: en noticias `image`, `imagePosition`, `categories` y el `lang` corregido; en eventos
`poster`, `heroImage` y `demoSecondsLeft`. La web actual no tiene categorías de noticias, así que el
importador las adivina por el título; conviene revisarlas.

Toda imagen nueva se añade a `src/data/images.ts` con su origen y propietario. Si falta en el
registro, o una entrada deja de usarse, `npm run build` falla. Los logos de los clubs y los carteles
de los eventos se registran como carpeta: cada archivo debe aparecer en `src/content/clubs.yaml` o
en un evento de `src/content/events/`.

## Licencia

El diseño se basa en *Rediseño de la experiencia del sitio web de la FEGADO* de Nuria Oujo Míguez
(Trabajo Final de Máster, UOC, 2026), publicado bajo licencia
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/). Este prototipo adapta ese diseño a una
página web funcional.

> Oujo Míguez, N. [Nuria]. (2026). *Rediseño de la experiencia del sitio web de la FEGADO*.
> Universitat Oberta de Catalunya (UOC). <https://hdl.handle.net/10609/155819>

- Obra: <https://openaccess.uoc.edu/items/c92da18f-6763-463a-94a2-d20bff0c7663>
- PDF: <https://aip-uoc-media-pro.s3-v2.csuc.cat/documents/30/55/15/30551575308421266659466737057029304497/document_1.pdf>

Los textos tomados de <https://fegado.es/>, las fotos, los carteles y los logos pertenecen a la
FEGADO, a los clubes organizadores o a las entidades patrocinadoras, y no están cubiertos por la
licencia anterior.
