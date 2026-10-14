# vasconcel.github.io

Personal portfolio of Gabriel V. Silva, published with **GitHub Pages** as a user site
(`vasconcel.github.io`). It is a **single page** (`index.html`) that presents one
professional identity - empirical software engineering research combined with open-source
research-software work - through in-page anchors rather than separate pages.

## Structure

```
.
├── index.html          # single-page portfolio (Project, Research, Publications, Background, Contact)
├── engineering.html    # legacy redirect → index.html
├── assets/
│   ├── styles.css      # single design system
│   └── profile.jpg
├── scripts/
│   └── main.js         # footer year, nav scroll-spy
└── README.md
```

No build step, bundler, framework, or dependencies. Everything is plain HTML, CSS, and
vanilla JavaScript, so the site is edited directly and deployed as-is from the root of
`main`.

## Page sections

`index.html` is organised as one continuous page, navigated with in-page anchors:

1. **Hero** (`#top`) - who he is, how he works, one primary contact action, one quiet link to
   the work, portrait and profile links.
2. **Projects** (`#project`) - dataWASHES: the problem, the dataset figures, and a contribution
   block that separates the project from his own work on it.
3. **Research** (`#research`) - the hiring research, his role in executing it, the ongoing
   multivocal review, and the two affiliations.
4. **Publications** (`#publications`) - CHASE 2026 and SEPEC 2025, both attributed in full.
5. **Background** (`#background`) - research methods, engineering practice, then education and
   certification.
6. **Contact** (`#contact`) - four kinds of project he takes on, then email.

Each section uses a different shape on purpose: the hero is a two-column split, projects a
single detailed surface with the tally in its base, research prose plus a marked note and two
cards, publications a status-railed list, background a full-width methods statement above a
two-column spread, and contact a hairline-separated list.

## How the work is described

This matters more than any layout decision on the page, so it is written down here.

- **Engineering work is directed, not hand-written.** He defines problems and acceptance
  criteria, directs coding agents through the implementation, evaluates what they produce, and
  validates the result. The page says this plainly and does not claim manual fluency in
  Python, SQL, or any other stack. Do not reintroduce technology inventories or language lists
  in the hero, Background, or Contact; do not describe him as a developer of specific
  frameworks.
- **Research work is execution, not conception.** He recruited and interviewed participants,
  transcribed and prepared the recordings, did the initial qualitative coding, built the
  study artifacts, and drafted the papers in LaTeX. His advisor shaped the research questions
  and the wider author team handled final validation. Both sides of that are stated, so the
  page neither claims sole authorship nor reduces his part to maintenance.
- **Attribute by contribution, not by presence in a repository.** Technologies appearing in a
  project are not evidence that he wrote them by hand.

## Evidence standard

Every public claim on the page is traceable to a source that can be checked. The
inventory used when the page was last revised:

| Claim on the page | Source |
|---|---|
| 11 editions, 137 papers, 429 authors | `data/papers.json`, `data/authors.json`, `data/editions.json` in `gesid/dataWASHES` |
| Per-edition counts in the tally (15, 4, 10, 10, 14, 7, 7, 12, 21, 16, 21) | derived from `data/papers.json` (`Year` field); sums to 137 |
| Pipeline classifies each paper's research approach and data-analysis methods | the six fields in `data/method_index.json` and `data/papers.json` (`Approach`, `Objective`, `Procedures`, `Data_collection`, `Quantitative_Data_Analysis`, `Qualitative_Data_Analysis`) |
| Monthly pipeline: scraping, LLM classification, dataset regeneration, pull request, human approval | commits `d553a41`, `a131207`, `c3f3a94`, `5fc716f` and `.github/workflows/data-sync-and-citations.yml` |
| Citation collection consolidated from a separate .NET tool into an in-repo Python script | `.github/run-citation-miner.yml` at `33c0575` checked out the external `gesid/CitationMiner` repo and set up .NET 8; `e5cfce7` replaced that with `setup-python` plus an in-repo script |
| Dashboard export/search/table work; CI/CD and deployment automation | commits `bc23107`, `608a113`, `5fc716f`, `a131207`, `856f737` |
| dataWASHES is collaborative and owned by GESID | `dataWASHES/README.md` ("collaborative, open-source"); 14 contributors in `git shortlog` |
| CHASE 2026 acceptance, venue, date and author order | CHASE 2026 program (Research Track, Mon 13 Apr 2026, Rio de Janeiro) and [arXiv:2602.13845](https://arxiv.org/abs/2602.13845) |
| SEPEC 2025 title, author order and venue | Gabriel's public ORCID record, [`0009-0005-1736-354X`](https://orcid.org/0009-0005-1736-354X) |
| AWS Certified Cloud Practitioner, issued Feb 2025, valid to Feb 2028 | public Credly badge |

Notes and non-claims:

- The author list for the CHASE paper is shown in full because it is a six-author
  collaboration; Gabriel is the second author. No score is claimed for the AWS
  certification because the public badge does not publish one.
- **dataWASHES publishes three papers (WASHES 2024, two in WASHES 2025), and Gabriel is not
  an author of any of them.** The page therefore presents dataWASHES as a project he
  maintains, never as his own publication. The "project publications" block stays removed.
- **The citation collector is attributed as a consolidation, not original design.** An earlier
  C# tool became an in-repo Python script under his direction; the page says so.
- **The EMSE manuscript previously listed under "Under review" was removed.** No public
  record of it exists, and its stated title matches a different, already-published EMSE
  article by other authors ("Investigating the online recruitment and selection journey of
  novice software engineers", DOI `10.1007/s10664-024-10498-w`). Do not restore it unless the
  submission is independently established.
- **SEPEC has no DOI or proceedings page recorded.** Only the record link held in the ORCID
  entry is used; no publication status or identifier is invented for it.
- The project's `padimlab.github.io` link was replaced by the CNPq group record
  (`dgp.cnpq.br/dgp/espelhogrupo/790337`) because the GitHub Pages URL is a bare redirect
  stub with no content.
- **MLR Screening must not appear anywhere on the site.** It is not in Projects, and the
  reference that used to sit in the ongoing-review note was removed at the owner's request,
  along with the link to `vasconcel/mlr-screening`. Do not reintroduce it in any section.

## Conventions

- **Public copy is written in English** - short, direct sentences, no promotional language,
  no unsupported claims.
- **Editorial minimal identity**: near-black page (`--bg-page: #0a0a0a`), one raised surface
  (`--bg-surface: #14171d`) and one inset surface (`--bg-inset: #101319`), separated by
  hairlines at 8% white (`--border`). No gradients, glows, ornament, or colour without a
  function.
- **One measure**: every section sits in a single centred `920px` column
  (`--measure`), so no content drifts to the edges of a wide screen.
- **Palette** lives in `:root` (`assets/styles.css`). Text runs three tiers: primary
  (`--text-primary: #f0f6fc`), secondary (`--text-secondary: #b9bcc4`) and muted
  (`--text-muted: #8b949e`). The accent (`--accent: #58a6ff`) is rationed to hover, focus,
  the primary action, the active nav rule and the tally's current edition. Editorial status
  uses a green (`--status-accepted: #56d364`) and an amber (`--status-review: #d29922`) -
  each as a small colour dot plus a text label inside a subtle tinted pill, never colour
  alone and never as a large saturated button.
- **Typography**: a single family - `Inter` - carries display and body copy, so hierarchy
  comes from size, weight and colour, not a second face. `JetBrains Mono` is limited to
  micro-labels, statuses, figures and the contribution labels. The `.kicker` eyebrow is used
  once, in the hero; the other sections lead with a plain `h2`, because a label above every
  heading adds noise without adding meaning.
- **Measure**: body text is capped at 60–70ch (`--measure` is 920px, which is wider than a
  comfortable line). This was measured in the browser: uncapped, `.section-lead` rendered at
  roughly 99 characters per line at 1440px.
- **Composition**: purpose-specific layouts instead of one repeating grid. The hero pairs a
  copy column with the portrait and profile links, and offers one primary action plus a quiet
  text link. The project is one surface: masthead with links, the problem in prose, a
  single-line metric row (`Editions · Papers · Authors`), a contribution block that separates
  *my contribution* from the project itself, then the per-edition *tally* in the card base,
  one mark per paper, current edition in accent. Research leads with a plain h2 and prose, then
  his role as an unframed block, then the ongoing review set apart by an accent rule, then two
  equal-weight affiliation cards. Publications are an editorial list with a status rail (status
  and venue on the left, title/venue/authors/abstract/links on the right). Background opens with
  a full-width methods statement, then a two-column spread of engineering practice and
  credentials. Contact lists four kinds of project above one typographic email link.
- **No technology inventory**: the background describes how he works (directing, validating,
  integrating) instead of listing languages and frameworks. Adding a stack list back would
  contradict the page's own account of how the work is done.
- **Attribution is explicit**: collaborative work names its owners (dataWASHES belongs to
  GESID), the CHASE author list is printed in full, the citation collector is described as a
  consolidation of someone else's tool, and individual contributions are described by their
  engineering consequence instead of listed as raw commits.
- **Writing standard**: the copy avoids em dashes, "rather than" and "not just" constructions,
  empty intensifiers, three-item lists used for symmetry, and repeated disclaimers about career
  stage. The `<title>` uses a pipe instead of an em dash. Verified by scan.
- **Hierarchy over accumulation**: Background and Contact were deliberately cut back. The
  methods statement gets full width, engineering practice and credentials share a two-column
  spread, and Contact carries four short entries rather than a longer catalogue. When adding
  content here, prefer removing something else first.
- **Data visualisations are truthful**: the tally reflects the real per-edition counts from
  the dataWASHES dataset (2016–2026: 15, 4, 10, 10, 14, 7, 7, 12, 21, 16, 21). Section
  headings are typographic, not numbered; no fake case IDs, coordinates or telemetry appear.
- **Icons** are limited to the `↗` glyph on external links, plus an inline SVG data-URI
  favicon. No icon font or CDN.
- **CSS** lives in one file (`assets/styles.css`). All tokens are defined in `:root`.
- **Motion is optional**: transitions are short (150–160ms) and all are disabled under
  `@media (prefers-reduced-motion: reduce)`. `:focus-visible` outlines are always kept.
- **Skip link**: `a.skip-link` points to `#main`, the `id` on the `<main>` element, so keyboard
  users land on the page content rather than on a mid-page section.
- **Responsive**: verified with zero horizontal overflow and an empty console at 320, 390, 768
  and 1440 CSS px. Below 780px the hero, affiliation, service and background grids collapse to
  one column and the tally becomes a readable list of rows; below 620px the nav drops the
  wordmark, stats wrap, and action buttons share the row.
- **Data visualisations are truthful**: the tally reflects the real per-edition counts from
  the dataWASHES dataset (2016–2026: 15, 4, 10, 10, 14, 7, 7, 12, 21, 16, 21). Section
  headings are typographic, not numbered; no fake case IDs, coordinates or telemetry appear.
- **Icons** are limited to the `↗` glyph on external links, plus an inline SVG data-URI
  favicon. No icon font or CDN.
- **CSS** lives in one file (`assets/styles.css`). All tokens are defined in `:root`.
- **Motion is optional**: transitions are short (150–160ms) and all are disabled under
  `@media (prefers-reduced-motion: reduce)`. `:focus-visible` outlines are always kept.
- **Responsive**: verified with zero horizontal overflow and an empty console at 320, 390, 768
  and 1440 CSS px. Below 780px the hero, affiliation, service and background grids collapse to
  one column and the tally becomes a readable list of rows; below 620px the nav drops the
  wordmark, stats wrap, and action buttons share the row.

## JavaScript (`scripts/main.js`)

Runs once on `load`:

- `initYear()` - fills the footer year.
- `initNavSpy()` - highlights the `.global-nav` anchor for the section in view.

## Previewing locally

Because there is no build step, open the files directly or serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

Serving over HTTP (rather than opening the file directly) is recommended so relative paths
and in-page navigation behave exactly as in production.

## Deployment

Pushing to `main` publishes the current files at https://vasconcel.github.io/.

## Content notes

- **dataWASHES** is the only featured project. The card gives the problem (a decade of
  proceedings that could only be read one paper at a time), the verified figures, and links to
  the live platform (https://datawashes.pythonanywhere.com/), the dashboard and the repository
  (https://github.com/gesid/dataWASHES). The "My contribution" block picks three things worth
  explaining: the self-running update pipeline and why it stops at a pull request, the
  consolidation of citation collection into the repository, and the platform and delivery work.
  It states that GESID owns the project and that the work is directed through coding agents.
  The "project publications" block stays removed, because none of the three dataWASHES papers
  list him as an author.
- **MLR Screening must not appear anywhere on the site**, in any section and under any name.
  The reference that used to sit in the ongoing-review note and the link to
  `vasconcel/mlr-screening` were both removed at the owner's request. Do not reintroduce the
  tool, the link, or a claim that a usable screening tool exists.
- **Research** states his role in executing the studies: recruiting and interviewing, preparing
  the recordings, initial qualitative coding, building the study artifacts, and drafting in
  LaTeX, with the advisor shaping the questions and the wider author team validating. Keep both
  halves of that. Do not present him as the originator of the research, and do not reduce his
  part to tooling or maintenance.
- **Publications** lists only work verifiable against an external record: the CHASE 2026
  Research Track paper with its full six-author list (Gabriel second) and links to the artifact
  and arXiv preprint, and the SEPEC 2025 paper with its Portuguese title, four authors in order,
  and the venue as recorded. The EMSE "under review" entry was removed as unverifiable; see
  *Evidence standard* above.
- The **AWS Certified Cloud Practitioner** badge is publicly verifiable via Credly (issued
  February 2025, valid to February 2028); no score is claimed because the badge publishes none.
- **Contact** describes four kinds of project as problems and outcomes, not as a skills list:
  a recurring task that runs itself, messy records consolidated into one dataset, a small
  service or integration, and a simple interface for data. It carries no testimonials, client
  names, prices, guarantees or years of experience, and it offers an honest redirect if the
  request is out of scope.
- The **footer** carries only the copyright line. Do not add a note about the site's own stack.
- `engineering.html` is retained as a minimal redirect to `index.html` so that any external
  links to the former engineering page keep working. It is not a second portfolio.
- `engineering.html` and `scripts/main.js` carry uncommitted changes from earlier work; they
  were not touched by this revision.