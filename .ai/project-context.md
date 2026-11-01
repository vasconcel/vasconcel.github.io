# Contexto do projeto — portfólio `vasconcel.github.io`

> Documento de contexto para uma LLM. Objetivo: a partir daqui, gerar um **prompt de execução** para um agente de código (OpenCode) fazer ajustes neste repositório.
> Última atualização: 2026-10-31 (commit `ed68951`, branch `main`).

---

## 1. O que é o projeto

Site pessoal / portfólio acadêmico de **Gabriel V. Silva**, publicado no GitHub Pages em <https://vasconcel.github.io/>.

- Repositório: `github.com/vasconcel/vasconcel.github.io` (branch `main`, deploy automático pelo GitHub Pages).
- Público-alvo: recrutadores, pesquisadores e colaboradores em engenharia de software empírica.
- Posicionamento: não é um portfólio de "dev front-end". A página é editada como uma **publicação de pesquisa independente**: capa escura, corpo claro para leitura, página final escura.
- Conteúdo: um estudo de caso (dataWASHES), uma seção de pesquisa, duas publicações, um bloco de formação e um bloco de contato.
- Idioma do site: **inglês** (com um título em português marcado com `lang="pt-BR"`). O autor é brasileiro (UFCA), mas o conteúdo é em inglês.

### Fatos biográficos usados no site (não inventar outros)
- Gabriel V. Silva — Federal University of Cariri (UFCA), Brasil.
- Graduação em Análise e Desenvolvimento de Sistemas (tecnólogo), UFCA — em andamento.
- Grupos: GESID (UFCA) e PADIM Lab (UFCA).
- Certificação: AWS Certified Cloud Practitioner (2025, válida até 2028).
- Contato: `gabriel.vasconcel@outlook.com`.
- Perfis: GitHub `vasconcel`, LinkedIn `vasconcel`, Lattes `7193014410256740`, ORCID `0009-0005-1736-354X`.
- Publicações: CHASE 2026 ("Constructive Patterns for Human-Centered Tech Hiring") e SEPEC 2025 (artigo em português sobre dataWASHES e extensão universitária).
- Projeto destacado: **dataWASHES** (corpus do workshop WASHES, 2016–2026, 11 edições, 137 artigos, 429 autores).

---

## 2. Restrições técnicas rígidas

Estas restrições definem o projeto e **não devem ser violadas** por um ajuste:

1. **Sem build step.** Nada de bundler, framework, `package.json`, pré-processador CSS, TypeScript ou dependências JS.
2. **HTML, CSS e JavaScript puro**, servidos como estão pelo GitHub Pages.
3. **Sem backend.** O site é 100% estático.
4. **Sem CDN de JS.** O único recurso externo é o Google Fonts (e imagens locais).
5. **Sem bibliotecas de UI, ícones ou animação.** Ícones são caracteres/texto (`↗`, `↓`) ou CSS puro.
6. **Funciona sem JavaScript.** O conteúdo nunca pode depender de JS para aparecer (o JS é só aprimoramento progressivo).
7. **Acessibilidade é requisito, não extra**: ver seção 5.
8. **Conteúdo factual não pode ser inventado.** Se faltar informação, o ajuste deve pedir ou usar placeholder explícito.
9. **Português vs. inglês**: código e comentários em inglês; copy do site em inglês (exceto conteúdo em pt-BR explicitamente marcado).
10. **Deploy**: basta um push na `main`. Não existe ambiente de staging.

---

## 3. Estrutura real de arquivos

```
.
├── index.html          # única página real (≈518 linhas)
├── engineering.html    # stub de redirect para index.html (meta refresh + canonical + noindex)
├── README.md           # documentação do repo
├── assets/
│   ├── styles.css      # todo o CSS (≈1211 linhas, 1 arquivo)
│   ├── profile.jpg     # retrato em uso — 2048×2048, 532 KB
│   └── profile2.jpg    # retrato alternativo — 400×400, 16 KB (NÃO referenciado)
└── scripts/
    └── main.js         # ano do rodapé, scroll-spy, reveal (≈160 linhas)
```

Observações:
- Não há `_config.yml`, `robots.txt`, `sitemap.xml`, `404.html`, `.nojekyll`, CI, testes, linter ou formatter.
- `engineering.html` existe apenas para preservar links antigos (`/engineering.html` → `/index.html`). A página "Engineering" foi consolidada no `index.html` no commit `7672ae2`.
- `profile2.jpg` é órfão (sobra da versão anterior) — candidato a remoção, mas tratar como possível trabalho do usuário antes de apagar.

---

## 4. Mapa do `index.html`

Ordem dos blocos, âncoras e classes principais:

| Bloco | Elemento | id / âncora | Classes-chave |
|---|---|---|---|
| Skip link | link | `#main` | `.skip-link` |
| Nav global (sticky, escura) | `<nav>` | — | `.global-nav`, `.nav-inner`, `.nav-brand`, `.nav-mark`, `.nav-links` |
| Capa / hero (escura) | `<header class="hero">` | `#top` (no `body`) | `.hero-grid`, `.hero-copy`, `.kicker`, `.hero-title`, `.hero-role`, `.hero-statement`, `.hero-actions`, `.hero-aside`, `.portrait`, `.profile-links` |
| Projetos | `<section>` | `#project` | `.project`, `.project-masthead`, `.project-id`, `.project-tag`, `.project-name`, `.project-repo`, `.project-actions`, `.project-lede`, `.project-stats`/`.stat`, `.project-role`, `.contribution-list` |
| Pesquisa | `<section>` | `#research` | `.section-head--prose`, `.role-desc` |
| Publicações | `<section>` | `#publications` | `.publication-list`, `.publication`, `.pub-rail`, `.status--accepted`/`--published`, `.pub-year`, `.pub-main`, `.pub-title`, `.pub-venue`, `.pub-authors`, `.pub-abstract`, `.entry-links` |
| Background | `<section>` | `#background` | `.facts`, `.fact`, `.fact-label`, `.fact-value`, `.fact-note`, `.fact-list` |
| Contato (escura) | `<section>` | `#contact` | `.section--contact`, `.closing-line`, `.closing-line--note`, `.closing-email`, `.email-link`, `.closing-links` |
| Rodapé | `<footer>` | — | `.site-footer`, `.footer-inner`, `#year` |

Padrões do HTML:
- Indentação de 2 espaços; tags vazias fechadas com ` />`; atributos quebrados em linhas quando o `<a>` é longo.
- Um único `<h1>` (nome no hero); seções usam `<h2 class="section-title">`; itens usam `<h3>`.
- `aria-labelledby` ligando cada `<section>` ao seu título; `aria-label` em `<nav>` e `<aside>`.
- Links externos sempre com `target="_blank" rel="noopener noreferrer"` e um `↗` em `aria-hidden="true"`.
- Metadados editoriais em `<dl>` (`.project-stats`) e listas semânticas onde cabe.

---

## 5. Design system (`assets/styles.css`)

### Conceito (está documentado no topo do CSS — ler antes de mudar)
- A página imita uma publicação impressa: **capa escura → corpo claro → página final escura**. As superfícies alternam de propósito; não existe "tema dark".
- Hierarquia é tipográfica, não gráfica: **serif** para display e leitura, **sans** para corpo/interface, **mono** só para metadados, labels e identificadores.
- **Uma única cor de acento**, um vermelhão fosco, racionado: marcador do masthead, status "Accepted", hover de link/controle, endereço final. Nunca é a cor de todos os links/títulos/bordas.
- Seções são composições distintas, não cards repetidos.

### Tokens (`:root`)
```css
--paper: #F0EEE8;      --paper-2: #E6E3DB;
--ink: #111111;        --ink-2: #3A3C37;
--gray: #777A76;       --gray-ink: #5C5F5A;   /* gray = ornamento; gray-ink = texto pequeno */
--red: #C84B3A;        --red-ink: #9E3326;    --red-on-dark: #D2593F;
--on-dark: #F0EEE8;    --on-dark-2: #B9B7AF;  --on-dark-3: #9A988F;
--rule / --rule-strong / --rule-dark / --rule-dark-strong   /* hairlines */
--serif: 'Source Serif 4', Georgia, serif;
--sans: 'Inter', system-ui, sans-serif;
--mono: 'IBM Plex Mono', ui-monospace, monospace;
--measure: 1160px;  --text: 64ch;  --leading: 1.68;
--gutter: clamp(1.25rem, 4vw, 2.5rem);
```

Regra de contraste documentada no CSS: `--gray` e `--red` passam 3:1 (regras, tipografia grande, ornamento) mas **não** 4,5:1; para texto pequeno usar `--gray-ink` e `--red-ink` / `--red-on-dark`. Qualquer cor nova precisa manter isso.

### Breakpoints existentes
`1024px` (hero 2 colunas → 220px de retrato) · `900px` (hero empilha, retrato 128px ao lado dos links) · `820px` (stats 4→2 colunas) · `720px` (publicação e facts empilham) · `620px` (nav em 2 linhas, `scroll-margin-top: 6.5rem`, esconde `.nav-name`) · `480px` (retrato 104px) · `400px` (nav mais compacta) · `min-width: 1024px` (recuo editorial do `.role-desc`).

Detalhes que não podem quebrar:
- `section[id] { scroll-margin-top }` compensa o nav sticky (5.5rem, 6.5rem abaixo de 620px).
- `.reveal` / `.reveal--in` só são aplicados via JS; o estado oculto não existe sem script.
- `@media (prefers-reduced-motion: reduce)` zera transições/animações e força o estado final do reveal.
- Foco visível é um anel vermelho de 2,5px (`:focus-visible`), válido em fundo claro e escuro.

---

## 6. JavaScript (`scripts/main.js`)

Sem dependências, organizado por blocos comentados (`// ================= ... =================`).

1. `initReveal()` — roda **no parse**, ao final do body, para evitar flash. Usa `IntersectionObserver`, ignora o que já está na viewport e desiste sob `prefers-reduced-motion` ou sem suporte. Adiciona `.reveal` (oculto) e depois `.reveal--in`; aplica stagger de 70ms (máx. 1 passo) nas publicações.
2. `initYear()` — preenche `#year` no rodapé.
3. `initNavSpy()` — destaca o link da seção atual. Lógica própria (não é IntersectionObserver): só ativa depois que a primeira seção cruza o nav (`gate = altura do nav + 40`), escolhe a última seção cujo topo passou de `45%` da viewport, e força a última seção quando a página chega ao fim. Usa `requestAnimationFrame` no scroll.

Convenções: `function` declarations, `const`/`let`, aspas duplas para strings e simples para seletores, sem semicol... — na verdade **com** ponto e vírgula; sem transpilação.

---

## 7. Conteúdo e tom de voz

- Primeira pessoa, tom sóbrio e acadêmico, sem superlativos de marketing ("paixão", "rockstar", "10x").
- Frases longas e densas são intencionais (estilo ensaístico). A seção Research é uma "essay" com recuo editorial.
- Autoria colaborativa é sempre explícita: lista de autores completa e "My contribution" separado da descrição do projeto.
- Números são fatos verificáveis (137 artigos, 429 autores, 22 entrevistas, 470 experiências). Não arredondar nem inventar.
- Evitar emoji. Símbolos permitidos: `↗` (link externo), `↓` (scroll), `·` (`&middot;`), `–`/`—` (`&ndash;`/`&mdash;`).

---

## 8. Dívidas técnicas e inconsistências conhecidas

Úteis como candidatos a ajuste:
1. **README desatualizado**: diz que as fontes são "Inter e JetBrains Mono" (na verdade IBM Plex Mono + Source Serif 4) e lista só `profile.jpg` na árvore (existe também `profile2.jpg`).
2. **`assets/profile2.jpg` órfão** (16 KB, não referenciado).
3. **Sem metadados sociais**: não há Open Graph, Twitter Card, `canonical` no `index.html`, nem `sitemap.xml`/`robots.txt`. O `engineering.html` tem canonical, o index não.
4. **Sem favicon "real"**: é um SVG inline em data URI com o monograma "GV".
5. **Imagem do retrato**: 2048×2048 / 532 KB sem `srcset`/`loading`/`width`/`height` — oportunidade de performance e de evitar layout shift.
6. **Sem `<meta name="theme-color">`**, sem JSON-LD (`Person`).
7. **Seção Projetos tem um único case study** — a estrutura `.project` existe para vários, mas hoje há só um.
8. **Sem estado "vazio" ou tratamento de erro** em qualquer lugar (não há dados dinâmicos).
9. **`engineering.html` é um stub** — decidir se mantém, remove ou transforma em 404.
10. **Sem testes automatizados nem validação HTML** no fluxo.

---

## 9. O que um ajuste precisa respeitar (checklist de aceitação)

- [ ] Nenhum arquivo novo de build/dependência; nada de `package.json`.
- [ ] `index.html` continua válido, semântico e navegável por teclado.
- [ ] Nada de conteúdo factual inventado; links externos com `rel="noopener noreferrer"`.
- [ ] Contraste: texto pequeno ≥ 4,5:1; usar `--gray-ink` / `--red-ink` / `--red-on-dark`.
- [ ] Funciona em 320 / 400 / 620 / 720 / 820 / 900 / 1024 / 1440 px.
- [ ] `prefers-reduced-motion` continua respeitado; nada fica invisível sem JS.
- [ ] `scroll-margin-top` e o scroll-spy continuam corretos após mudanças na altura do nav.
- [ ] Comentários em inglês, indentação de 2 espaços, mesmo estilo dos arquivos vizinhos.
- [ ] Escopo mínimo: alterar só os arquivos necessários, sem reformatação em massa.
- [ ] `README.md` atualizado se a estrutura ou as tecnologias mudarem.
- [ ] Sem push/deploy sem confirmação do usuário (o push publica em produção).

---

## 10. O que se espera da LLM agora

A LLM **não deve implementar nada**. Ela deve produzir um **prompt de execução** para um agente de código, em português, contendo:

1. **Objetivo** — uma frase clara do resultado desejado.
2. **Contexto mínimo necessário** — só o que o agente precisa saber deste documento (não despejar o documento inteiro).
3. **Arquivos a alterar** — caminhos exatos (`index.html`, `assets/styles.css`, `scripts/main.js`, `README.md`) e o que muda em cada um.
4. **Especificação do ajuste** — comportamento, estrutura, classes, textos e valores concretos (não "deixe mais bonito").
5. **Restrições** — as da seção 2 e o checklist da seção 9, resumidos.
6. **Critérios de aceitação verificáveis** — como o agente prova que terminou (ex.: "em 360px o nav não quebra em 3 linhas", "`grep` não encontra mais `profile2.jpg`").
7. **Ordem de execução** — passos numerados.
8. **O que NÃO fazer** — lista curta de armadilhas (inventar conteúdo, adicionar framework, reformatar tudo, commitar/pushar).
9. **Se houver ambiguidade** — instruir o agente a perguntar antes de assumir.

Formato de saída desejado: um bloco único, pronto para colar, sem preâmbulo. Se o pedido do usuário for vago, a LLM deve primeiro fazer até 3 perguntas de esclarecimento — e só então gerar o prompt.
