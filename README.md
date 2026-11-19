# vasconcel.github.io

Personal academic site published with GitHub Pages at <https://vasconcel.github.io/>.
The English version is served at `/` and the Portuguese version at `/pt/`.

## Architecture

The HTML pages are generated artifacts; all editable content lives in the
sources below.

| File | Role |
| --- | --- |
| `build.py` | Generator using only the Python standard library. |
| `template.html` | Shared template for the home pages (`/` and `/pt/`). |
| `services.template.html` | Shared template for the services pages (`/services/` and `/pt/servicos/`). |
| `data/site.json` | Shared data: URLs, profiles, publications, projects, service offers and links. |
| `locales/en.json` | English copy and metadata for `/` and `/services/`. |
| `locales/pt.json` | Portuguese copy and metadata for `/pt/` and `/pt/servicos/`. |
| `index.html` | Generated English home page. |
| `pt/index.html` | Generated Portuguese home page. |
| `services/index.html` | Generated English services page. |
| `pt/servicos/index.html` | Generated Portuguese services page. |
| `assets/` | Stylesheet, favicon, portrait, Open Graph image and legacy media. |
| `scripts/main.js` | Progressive enhancement: theme toggle with `localStorage`, scroll spy/reveal and anchor navigation. |

Generated HTML files are committed because GitHub Pages serves them directly.
Do not edit `index.html`, `pt/index.html`, `services/index.html` or
`pt/servicos/index.html` by hand; make changes to the sources and regenerate
them.

## Build

```bash
python build.py
```

No packages or build tools are required. Run this after changing the template,
site data or either locale.

## Preview locally

```bash
python -m http.server 8000
# http://localhost:8000/           (EN home)
# http://localhost:8000/pt/        (PT home)
# http://localhost:8000/services/  (EN services)
# http://localhost:8000/pt/servicos/ (PT services)
```

Using HTTP instead of opening files directly keeps relative asset paths and
in-page navigation consistent with production.

## Legacy files

- `engineering.html` is a legacy redirect stub kept for old inbound links; it is
  not part of the generated site and should remain untouched.
- `assets/profile2.jpg` is an unreferenced alternate portrait. Kept deliberately
  pending a manual decision; do not use it without reviewing the portrait in use.

## Deployment

Push to `main`. GitHub Pages publishes the generated static files as-is.
