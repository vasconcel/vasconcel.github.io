#!/usr/bin/env python3
"""Generate static index.html and pt/index.html from template.html, data/site.json, and locales/*.json."""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def build_json_ld(site: dict, loc: dict) -> str:
    payload = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": f"{site['url']}#person",
                "name": site["name"],
                "alternateName": site["alternate_names"],
                "url": site["url"],
                "email": f"mailto:{site['email']}",
                "jobTitle": loc["jsonld_job_title"],
                "description": loc["jsonld_description"],
                "affiliation": {
                    "@type": "CollegeOrUniversity",
                    "name": loc["jsonld_affiliation"],
                },
                "knowsAbout": [
                    "Empirical Software Engineering",
                    "Qualitative Research",
                    "Reflexive Thematic Analysis",
                    "Multivocal Literature Review",
                    "Evidence Synthesis",
                    "Open Science",
                    "Research Software",
                    "Linux Systems Administration",
                ],
                "sameAs": [p["url"] for p in site["profiles"]],
            },
            {
                "@type": "ScholarlyArticle",
                "name": "Constructive Patterns for Human-Centered Tech Hiring",
                "datePublished": "2026",
                "inLanguage": "en",
                "url": "https://doi.org/10.1145/3794860.3794899",
                "sameAs": ["https://arxiv.org/abs/2602.13845"],
                "isPartOf": "Proceedings of the 19th International Conference on Cooperative and Human Aspects of Software Engineering (CHASE 2026)",
                "author": [
                    {"@type": "Person", "name": "Allysson Allex Araújo"},
                    {"@id": f"{site['url']}#person"},
                    {"@type": "Person", "name": "Marvin Wyrich"},
                    {"@type": "Person", "name": "Maria Teresa Baldassarre"},
                    {"@type": "Person", "name": "Paloma Guenes"},
                    {"@type": "Person", "name": "Marcos Kalinowski"},
                ],
            },
        ],
    }
    raw = json.dumps(payload, ensure_ascii=False, indent=2)
    return "\n".join(f"  {line}" for line in raw.splitlines())


def render_page(template: str, site: dict, loc: dict, lang: str) -> str:
    is_pt = lang == "pt"
    asset_prefix = "../" if is_pt else ""
    canonical_url = f"{site['url']}pt/" if is_pt else site["url"]
    lang_switch_href = "../" if is_pt else "pt/"

    nav_links = "\n        ".join(
        f'<a href="{esc(item["href"])}">{esc(item["label"])}</a>'
        for item in loc["nav"]["links"]
    )
    hero_focus_items = "\n          ".join(
        f"<li>{esc(item)}</li>" for item in loc["hero"]["focus"]
    )
    profile_links = "\n          ".join(
        f'<a href="{esc(p["url"])}" target="_blank" rel="{esc(p["rel"])}">{esc(p["label"])} ↗</a>'
        for p in site["profiles"]
    )
    closing_links = "\n          ".join(
        f'<a class="link-arrow" href="{esc(p["url"])}" target="_blank" rel="{esc(p["rel"])}">{esc(p["label"])} ↗</a>'
        for p in site["profiles"]
    )

    proof_html = []
    for item in site["proof"]:
        copy = loc["proof"]["items"][item["id"]]
        proof_html.append(
            "<li>\n"
            f"            <strong>{esc(copy['title'])}</strong>\n"
            f"            <span>{esc(copy['text'])}</span>\n"
            f'            <a class="link-arrow" href="{esc(item["url"])}" target="_blank" rel="noopener noreferrer">{esc(copy["link_label"])} ↗</a>\n'
            "          </li>"
        )

    approach_html = [
        "<li>\n"
        f'            <h3 class="index-title">{esc(item["title"])}</h3>\n'
        f'            <p class="index-text">{esc(item["text"])}</p>\n'
        "          </li>"
        for item in loc["approach"]["items"]
    ]

    pubs_html = []
    for pub in site["publications"]:
        pid = pub["id"]
        pcopy = loc["publications"]["items"][pid]
        title_text = esc(pcopy.get("title") or pub["title"])
        title_inner = (
            f'<a href="{esc(pub["url"])}" target="_blank" rel="noopener noreferrer">{title_text}</a>'
            if pub["url"]
            else title_text
        )
        status_label = esc(loc["publications"]["status_labels"][pub["status_type"]])
        authors_block = (
            f'\n              <p class="pub-authors">{pub["authors_html"]}</p>'
            if pub["authors_html"]
            else ""
        )
        links_block = ""
        if pub["links"]:
            anchors = "\n                ".join(
                f'<a class="link-arrow" href="{esc(lnk["url"])}" target="_blank" rel="noopener noreferrer">'
                f'{esc(loc["publications"]["link_labels"][lnk["key"]])} ↗</a>'
                for lnk in pub["links"]
            )
            links_block = f'\n              <div class="entry-links">\n                {anchors}\n              </div>'

        pubs_html.append(
            '<li class="publication">\n'
            '            <div class="pub-rail">\n'
            f'              <span class="status status--{esc(pub["status_type"])}">{status_label}</span>\n'
            f'              <span class="pub-year">{esc(pub["year"])}</span>\n'
            '            </div>\n'
            '            <div class="pub-main">\n'
            f'              <h3 class="pub-title">{title_inner}</h3>\n'
            f'              <p class="pub-venue">{esc(pcopy["venue"])}</p>'
            f"{authors_block}\n"
            f'              <p class="pub-abstract">{esc(pcopy["abstract"])}</p>'
            f"{links_block}\n"
            '            </div>\n'
            '          </li>'
        )

    projects_html = []
    for proj in site["projects"]:
        pcopy = loc["software"]["items"][proj["id"]]
        actions = "\n              ".join(
            f'<a class="link-arrow" href="{esc(a["url"])}" target="_blank" rel="noopener noreferrer">'
            f'{esc(loc["software"]["action_labels"][a["key"]])} ↗</a>'
            for a in proj["actions"]
        )
        stats = "\n            ".join(
            f'<div class="stat"><dt>{esc(loc["software"]["stat_labels"][s["key"]])}</dt><dd>{esc(s["value"])}</dd></div>'
            for s in proj["stats"]
        )
        projects_html.append(
            f'<article class="project" aria-labelledby="{esc(proj["id"])}-title">\n'
            '          <header class="project-masthead">\n'
            '            <div class="project-id">\n'
            f'              <p class="project-tag">{esc(pcopy["tag"])}</p>\n'
            f'              <h3 class="project-name" id="{esc(proj["id"])}-title">{esc(proj["name"])}</h3>\n'
            f'              <p class="project-repo">{esc(pcopy["subtitle"])}</p>\n'
            '            </div>\n'
            '            <div class="project-actions">\n'
            f'              {actions}\n'
            '            </div>\n'
            '          </header>\n'
            '          <div class="project-body">\n'
            f'            <p class="project-lede">{esc(pcopy["lede"])}</p>\n'
            f'            <p class="project-attribution">{esc(pcopy["attribution"])}</p>\n'
            '          </div>\n'
            f'          <dl class="project-stats" aria-label="{esc(pcopy["stats_aria"])}">\n'
            f'            {stats}\n'
            '          </dl>\n'
            '          <div class="project-role">\n'
            f'            <p class="project-role-label">{esc(pcopy["role_label"])}</p>\n'
            f'            <p class="project-role-text">{esc(pcopy["role_text"])}</p>\n'
            '          </div>\n'
            '        </article>'
        )

    caps_html = []
    for card in loc["methods"]["cards"]:
        bullets = "\n              ".join(f"<li>{esc(b)}</li>" for b in card["items"])
        caps_html.append(
            '<article class="capability">\n'
            '            <div class="capability-head">\n'
            f'              <p class="capability-index">{esc(card["index"])}</p>\n'
            f'              <h3 class="capability-title">{esc(card["title"])}</h3>\n'
            '            </div>\n'
            '            <ul class="capability-items">\n'
            f'              {bullets}\n'
            '            </ul>\n'
            f'            <p class="capability-evidence"><span>{esc(loc["methods"]["applied_label"])}</span>{esc(card["evidence"])}</p>\n'
            '          </article>'
        )

    tools_rows = "\n          ".join(
        f'<p><span>{esc(t["label"])}</span> {esc(t["value"])}</p>'
        for t in loc["methods"]["tools"]
    )

    facts_html = []
    for fact in loc["background"]["facts"]:
        val = (
            fact["value_html"]
            .replace("{{gesid}}", esc(site["links"]["gesid"]))
            .replace("{{padim}}", esc(site["links"]["padim"]))
            .replace("{{aws_badge}}", esc(site["links"]["aws_badge"]))
        )
        facts_html.append(
            '<div class="fact">\n'
            f'            <h3 class="fact-label">{esc(fact["label"])}</h3>\n'
            f'            <p class="fact-value">{val}</p>\n'
            '          </div>'
        )

    replacements = {
        "html_lang": esc(loc["html_lang"]),
        "meta_description": esc(loc["meta_description"]),
        "og_locale": esc(loc["og_locale"]),
        "name": esc(site["name"]),
        "handle": esc(site["handle"]),
        "email": esc(site["email"]),
        "og_description": esc(loc["og_description"]),
        "canonical_url": esc(canonical_url),
        "page_title": esc(loc["page_title"]),
        "asset_prefix": asset_prefix,
        "json_ld": build_json_ld(site, loc),
        "skip_link": esc(loc["skip_link"]),
        "nav_aria_label": esc(loc["nav"]["aria_label"]),
        "nav_brand_aria": esc(loc["nav"]["brand_aria"]),
        "nav_links": nav_links,
        "lang_switch_href": lang_switch_href,
        "lang_hreflang": esc(loc["nav"]["lang_hreflang"]),
        "lang_aria": esc(loc["nav"]["lang_aria"]),
        "lang_title": esc(loc["nav"]["lang_title"]),
        "lang_label": esc(loc["nav"]["lang_label"]),
        "theme_aria": esc(loc["nav"]["theme_aria"]),
        "hero_kicker": esc(loc["hero"]["kicker"]),
        "hero_role": esc(loc["hero"]["role"]),
        "hero_statement": esc(loc["hero"]["statement"]),
        "hero_focus_aria": esc(loc["hero"]["focus_aria"]),
        "hero_focus_items": hero_focus_items,
        "hero_cta_primary": esc(loc["hero"]["cta_primary"]),
        "hero_cta_secondary": esc(loc["hero"]["cta_secondary"]),
        "hero_aside_aria": esc(loc["hero"]["aside_aria"]),
        "portrait_alt": esc(loc["hero"]["portrait_alt"]),
        "caption_line1": esc(loc["hero"]["caption_line1"]),
        "caption_line2": esc(loc["hero"]["caption_line2"]),
        "profiles_aria": esc(loc["hero"]["profiles_aria"]),
        "profile_links": profile_links,
        "proof_aria_label": esc(loc["proof"]["aria_label"]),
        "proof_items": "\n          ".join(proof_html),
        "approach_kicker": esc(loc["approach"]["kicker"]),
        "approach_title": esc(loc["approach"]["title"]),
        "approach_lead": esc(loc["approach"]["lead"]),
        "approach_items": "\n          ".join(approach_html),
        "publications_kicker": esc(loc["publications"]["kicker"]),
        "publications_title": esc(loc["publications"]["title"]),
        "publications_lead": esc(loc["publications"]["lead"]),
        "publication_items": "\n          ".join(pubs_html),
        "software_kicker": esc(loc["software"]["kicker"]),
        "software_title": esc(loc["software"]["title"]),
        "software_lead": esc(loc["software"]["lead"]),
        "project_items": "\n        ".join(projects_html),
        "methods_kicker": esc(loc["methods"]["kicker"]),
        "methods_title": esc(loc["methods"]["title"]),
        "methods_lead": esc(loc["methods"]["lead"]),
        "capability_items": "\n          ".join(caps_html),
        "tools_rows": tools_rows,
        "background_kicker": esc(loc["background"]["kicker"]),
        "background_title": esc(loc["background"]["title"]),
        "background_lead": esc(loc["background"]["lead"]),
        "fact_items": "\n          ".join(facts_html),
        "contact_kicker": esc(loc["contact"]["kicker"]),
        "contact_title": esc(loc["contact"]["title"]),
        "contact_lead": esc(loc["contact"]["lead"]),
        "contact_links_aria": esc(loc["contact"]["links_aria"]),
        "closing_links": closing_links,
        "footer_status": esc(loc["footer"]["status"]),
    }

    output = re.sub(
        r"\{\{([a-z0-9_]+)\}\}",
        lambda match: replacements[match.group(1)],
        template,
    )
    assert "{{" not in output and "}}" not in output
    return output


def main() -> None:
    site = json.loads((ROOT / "data/site.json").read_text(encoding="utf-8"))
    template = (ROOT / "template.html").read_text(encoding="utf-8")

    targets = [
        ("en", ROOT / "index.html"),
        ("pt", ROOT / "pt/index.html"),
    ]
    for lang, out_path in targets:
        loc = json.loads((ROOT / f"locales/{lang}.json").read_text(encoding="utf-8"))
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(render_page(template, site, loc, lang), encoding="utf-8")
        print(f"Generated {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()