# vasconcel.github.io

Personal academic site published with GitHub Pages at <https://vasconcel.github.io/>.
The English version is served at `/` and the Portuguese version at `/pt/`.

## Architecture

The two HTML pages are generated artifacts; all editable content lives in the
sources below.

| File | Role |
| --- | --- |
| `build.py` | Generator using only the Python standard library. |
| `template.html` | Shared HTML template with `{{placeholder}}` tokens. |
| `data/site.json` | Shared data: URLs, profiles, publications, projects and links. |
| `locales/en.json` | English copy and metadata for `/`. |
| `locales/pt.json` | Portuguese copy and metadata for `/pt/`. |
| `index.html` | Generated English page. |
| `pt/index.html` | Generated Portuguese page. |
| `assets/` | Stylesheet, favicon, portrait, Open Graph image and legacy media. |
| `scripts/main.js` | Progressive enhancement: theme toggle with `localStorage`, scroll spy and anchor navigation. |

Generated HTML files are committed because GitHub Pages serves them directly.
Do not edit `index.html` or `pt/index.html` by hand.

## Build

```bash
python build.py
```

No packages or build tools are required. Run this after changing the template,
site data or either locale.

## Preview locally

```bash
python -m http.server 8000
# http://localhost:8000/  and  http://localhost:8000/pt/
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
