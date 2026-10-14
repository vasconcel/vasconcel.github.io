# vasconcel.github.io

Personal portfolio of Gabriel V. Silva, published with GitHub Pages at
<https://vasconcel.github.io/>.

It is a single page presenting his work across empirical software engineering, qualitative
research and research software, with in-page navigation between the Projects, Research,
Publications, Background and Contact sections.

## Structure

```
.
├── index.html          # the portfolio (single page)
├── engineering.html    # legacy redirect to index.html
├── assets/
│   ├── styles.css      # stylesheet
│   └── profile.jpg     # portrait
├── scripts/
│   └── main.js         # footer year, nav scroll-spy
└── README.md
```

## Technologies

- Plain HTML, CSS and vanilla JavaScript.
- No build step, bundler, framework or package manager; the files are served as they are.
- The only external resource is Google Fonts (Inter and JetBrains Mono).

## Previewing locally

There is no build step, so any static server works:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

Serving over HTTP, rather than opening the file directly, keeps relative paths and in-page
navigation behaving as they do in production.

## Deployment

The site is published by GitHub Pages directly from the `main` branch. Pushing to `main`
updates <https://vasconcel.github.io/>.
