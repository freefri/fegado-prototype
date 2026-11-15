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
- `src/content/events/`: los eventos de la portada (de momento, los del diseño).
- `src/components/`: piezas de la web; `src/components/ui/` son los componentes de shadcn/ui.
- `src/i18n/ui.ts`: textos fijos de la web en gallego y castellano.
- `src/data/`: enlaces, contacto y registro de imágenes.
- `src/styles/global.css`: colores, tipografías y variables del tema.

### Noticias

Las noticias se importan de <https://fegado.es/> y no se traducen: cada una indica en `lang` el
idioma en que se escribió.

```bash
node scripts/import-news.mjs --since 2026    # noticias desde 2026
node scripts/import-news.mjs --all           # todo el archivo
```

Solo descarga lo nuevo; con `--force` vuelve a generar las existentes, conservando los campos
añadidos a mano (`image`, `imagePosition`, `categories`) y el `lang` corregido.

Toda imagen nueva se añade a `src/data/images.ts` con su origen y propietario. Si falta en el
registro, o una entrada deja de usarse, `npm run build` falla.

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
