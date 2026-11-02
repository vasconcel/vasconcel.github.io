# vasconcel.github.io

Personal portfolio of Gabriel V. Silva, published with GitHub Pages at
<https://vasconcel.github.io/>.

It presents his work across empirical software engineering, qualitative research
and research data, with in-page navigation between the Research, Projects,
Publications, Capabilities, Background and Contact sections. The English version
is served at the root and the Portuguese version at `/pt/`; each page links to
the other in the navigation bar.

## Structure

```
.
├── index.html          # the portfolio, English (default)
├── pt/
│   └── index.html      # the portfolio, Portuguese
├── engineering.html    # legacy redirect to index.html
├── assets/
│   ├── styles.css      # stylesheet
│   ├── favicon.svg     # site icon
│   ├── profile.jpg     # portrait used on the page
│   └── profile2.jpg    # alternate portrait, kept but not referenced
├── scripts/
│   └── main.js         # footer year, nav scroll-spy, entrance reveal
└── README.md
```

## Technologies

- Plain HTML, CSS and vanilla JavaScript.
- No build step, bundler, framework or package manager; the files are served as they are.
- No external resources: fonts are the system stack declared in `assets/styles.css`.

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
