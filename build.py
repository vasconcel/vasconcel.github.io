#!/usr/bin/env python3
"""Generate static pages from templates, data/site.json, and locales/*.json."""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def esc(value: str) -> str:
    return html.escape(value, quote=True)


SVG_ATTRS = (
    'width="14" height="14" viewBox="0 0 24 24" fill="none" '
    'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" '
    'stroke-linejoin="round" aria-hidden="true" focusable="false"'
)

PROFILE_ICONS = {
    "GitHub": (
        '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.2-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5a12 12 0 0 0-8 0C5 2.5 4 2.5 4 2.5c-.3 1.1-.3 2.3 0 3.5A5.4 5.4 0 0 0 3 9.5c0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4"/>'
        '<path d="M9 18c-4.5 2-5-2-7-2"/>'
    ),
    "LinkedIn": (
        '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>'
        '<rect width="4" height="12" x="2" y="9"/>'
        '<circle cx="4" cy="4" r="2"/>'
    ),
    "ORCID": (
        '<circle cx="12" cy="12" r="9"/>'
        '<path d="M9 16V8m3 0v8m0-4h4m0-4v8"/>'
    ),
    "Lattes": (
        '<path d="M4 20h16"/>'
        '<path d="M7 20V10m5 10V5m5 15v-7"/>'
    ),
    "Mastodon": (
        '<path d="M20 10.5c0 4-2.6 6.5-6.5 6.5S7 14.5 7 10.5V8a4.5 4.5 0 0 1 9 0v2.5"/>'
        '<path d="M7 10.5H4m16 0h-3M9.5 20l1-3m4 3-1-3"/>'
    ),
}

ACTION_ICONS = {
    "api": '<path d="m8 8-4 4 4 4m8-8 4 4-4 4"/>',
    "dashboard": (
        '<rect x="3" y="4" width="18" height="16" rx="2"/>'
        '<path d="M3 10h18M9 10v10"/>'
    ),
    "source": (
        '<circle cx="6" cy="6" r="2"/>'
        '<circle cx="6" cy="18" r="2"/>'
        '<circle cx="18" cy="8" r="2"/>'
        '<path d="M6 8v8m0-4h6a6 6 0 0 0 6-4"/>'
    ),
}


def inline_icon(markup: str) -> str:
    return f'<svg {SVG_ATTRS}>{markup}</svg>' if markup else ""


def build_json_ld(site: dict, loc: dict) -> str:
    person = {
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
            "url": "https://www.ufca.edu.br/",
        },
        "sameAs": [p["url"] for p in site["profiles"]],
    }
    graph = [
        person,
        {
            "@type": "WebSite",
            "@id": f"{site['url']}#website",
            "url": site["url"],
            "name": site["name"],
            "author": {"@id": f"{site['url']}#person"},
        },
    ]
    for pub in site["publications"]:
        stype = pub.get("status_type")
        if stype == "published" and pub.get("url"):
            pub_loc = loc.get("publications", {}).get("items", {}).get(pub["id"], {})
            graph.append(
                {
                    "@type": "ScholarlyArticle",
                    "headline": pub_loc.get("title", pub["id"]),
                    "author": {"@id": f"{site['url']}#person"},
                    "url": pub["url"],
                }
            )
        if stype == "accepted" and pub.get("url"):
            pub_loc = loc.get("publications", {}).get("items", {}).get(pub["id"], {})
            graph.append(
                {
                    "@type": "ScholarlyArticle",
                    "headline": pub_loc.get("title", pub["id"]),
                    "author": {"@id": f"{site['url']}#person"},
                    "url": pub.get("url2", site["url"]),
                    "sameAs": pub["url"],
                }
            )
    payload = {"@context": "https://schema.org", "@graph": graph}
    return json.dumps(payload, indent=2, ensure_ascii=False)


def build_services_json_ld(site: dict, sloc: dict, page_url: str) -> str:
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
                "jobTitle": sloc["jsonld_job_title"],
                "description": sloc["jsonld_description"],
                "affiliation": {
                    "@type": "CollegeOrUniversity",
                    "name": sloc["jsonld_affiliation"],
                    "url": "https://www.ufca.edu.br/",
                },
                "sameAs": [p["url"] for p in site["profiles"]],
            },
            {
                "@type": "WebPage",
                "url": page_url,
                "name": sloc["page_title"],
                "isPartOf": {"@id": f"{site['url']}#website"},
                "about": {"@id": f"{site['url']}#person"},
            },
        ],
    }
    return json.dumps(payload, indent=2, ensure_ascii=False)


def render_page(template: str, site: dict, loc: dict, lang: str) -> str:
    is_pt = lang == "pt"
    asset_prefix = "../" if is_pt else ""
    canonical_url = f"{site['url']}pt/" if is_pt else site["url"]
    lang_switch_href = "../" if is_pt else "pt/"
    services_href = "servicos/" if is_pt else "services/"
    alt_en = site["url"]
    alt_pt = f"{site['url']}pt/"

    nav_links = "\n        ".join(
        f'<a href="{esc(item["href"])}">{esc(item["label"])}</a>'
        for item in loc["nav"]["links"]
    )
    hero_focus_items = "\n          ".join(
        f"<li>{esc(item)}</li>" for item in loc["hero"]["focus"]
    )
    profile_links = "\n          ".join(
        f'<a href="{esc(p["url"])}" target="_blank" rel="{esc(p["rel"])}">'
        f'{inline_icon(PROFILE_ICONS.get(p["label"], ""))}{esc(p["label"])} ↗</a>'
        for p in site["profiles"]
    )
    closing_links = "\n          ".join(
        f'<a class="link-arrow" href="{esc(p["url"])}" target="_blank" rel="{esc(p["rel"])}">'
        f'{inline_icon(PROFILE_ICONS.get(p["label"], ""))}{esc(p["label"])} ↗</a>'
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
        title_text = esc(pcopy.get("title") or pub.get("title", ""))
        title_inner = (
            f'<a href="{esc(pub["url"])}" target="_blank" rel="noopener noreferrer">{title_text}</a>'
            if pub.get("url")
            else title_text
        )
        status_label = esc(loc["publications"]["status_labels"][pub["status_type"]])
        authors_block = (
            f'\n              <p class="pub-authors">{pub["authors_html"]}</p>'
            if pub.get("authors_html")
            else ""
        )
        links_block = ""
        if pub.get("links"):
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
            f'{inline_icon(ACTION_ICONS.get(a["key"], ""))}'
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
        "alt_en_href": esc(alt_en),
        "alt_pt_href": esc(alt_pt),
        "alt_xdefault_href": esc(alt_en),
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
        "services_href": esc(services_href),
        "contact_services_label": esc(loc["contact"]["services_label"]),
        "contact_services_arrow": esc(loc["contact"]["services_arrow"]),
        "contact_services_kicker": esc(loc["contact"]["services_kicker"]),
        "contact_services_summary": esc(loc["contact"]["services_summary"]),
        "contact_links_aria": esc(loc["contact"]["links_aria"]),
        "copy_email": esc(loc["contact"]["copy_email"]),
        "copied_email": esc(loc["contact"]["copied_email"]),
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


def render_services_page(template: str, site: dict, loc: dict, lang: str) -> str:
    is_pt = lang == "pt"
    sloc = loc["services"]
    asset_prefix = "../../" if is_pt else "../"
    canonical_url = f"{site['url']}pt/servicos/" if is_pt else f"{site['url']}services/"
    lang_switch_href = "../../services/" if is_pt else "../pt/servicos/"
    home_href = "../"
    hreflang_en = f"{site['url']}services/"
    hreflang_pt = f"{site['url']}pt/servicos/"

    hero_focus_items = "\n          ".join(
        f"<li>{esc(item)}</li>" for item in sloc["hero"]["focus"]
    )

    closing_profile_links = "\n          ".join(
        f'<a class="link-arrow" href="{esc(p["url"])}" target="_blank" rel="{esc(p["rel"])}">'
        f'{inline_icon(PROFILE_ICONS.get(p["label"], ""))}{esc(p["label"])} ↗</a>'
        for p in site["profiles"]
    )

    offer_cards = []
    for offer in site["services"]["offers"]:
        oid = offer["id"]
        ocopy = sloc["offers"]["items"][oid]
        deliverables = "\n                ".join(
            f"<li>{esc(d)}</li>" for d in ocopy["deliverables"]
        )
        offer_cards.append(
            f'<article class="capability offer-card" id="offer-{esc(oid)}">\n'
            '            <div class="capability-head">\n'
            f'              <p class="capability-index">{esc(ocopy["index"])}</p>\n'
            f'              <h3 class="capability-title">{esc(ocopy["title"])}</h3>\n'
            '            </div>\n'
            f'            <p class="offer-target"><span class="offer-sublabel">{esc(sloc["offers"]["audience_label"])}</span> {esc(ocopy["audience"])}</p>\n'
            '            <div class="offer-deliverables">\n'
            f'              <p class="offer-sublabel">{esc(sloc["offers"]["deliverables_label"])}</p>\n'
            '              <ul class="capability-items">\n'
            f'                {deliverables}\n'
            '              </ul>\n'
            '            </div>\n'
            '            <div class="offer-meta">\n'
            f'              <p class="offer-timeline"><span>{esc(sloc["offers"]["timing_label"])}</span> {esc(ocopy["timing"])}</p>\n'
            f'              <p class="capability-evidence"><span>{esc(sloc["offers"]["proof_label"])}</span>'
            f'<a class="link-arrow" href="{esc(offer["proof_url"])}" target="_blank" rel="noopener noreferrer">{esc(ocopy["proof"])} ↗</a></p>\n'
            '            </div>\n'
            '          </article>'
        )

    boundary_rows = []
    for fact in sloc["boundaries"]["facts"]:
        boundary_rows.append(
            '<div class="fact">\n'
            f'            <h3 class="fact-label">{esc(fact["label"])}</h3>\n'
            f'            <p class="fact-value">{esc(fact["text"])}</p>\n'
            '          </div>'
        )

    process_steps = []
    for step in sloc["process"]["steps"]:
        clean_title = re.sub(r"^\d+\s*[·\-–.]\s*", "", step["title"])
        process_steps.append(
            '<li>\n'
            f'            <h3 class="index-title">{esc(clean_title)}</h3>\n'
            f'            <p class="index-text">{esc(step["text"])}</p>\n'
            '          </li>'
        )

    replacements = {
        "html_lang": esc(loc["html_lang"]),
        "meta_description": esc(sloc["meta_description"]),
        "og_locale": esc(loc["og_locale"]),
        "og_title": esc(sloc["og_title"]),
        "og_description": esc(sloc["og_description"]),
        "canonical_url": esc(canonical_url),
        "og_image_url": esc(f"{site['url']}assets/og-image.png"),
        "site_name": esc(site["name"]),
        "hreflang_en": esc(hreflang_en),
        "hreflang_pt": esc(hreflang_pt),
        "asset_prefix": asset_prefix,
        "page_title": esc(sloc["page_title"]),
        "json_ld": build_services_json_ld(site, sloc, canonical_url),
        "skip_link": esc(sloc["skip_link"]),
        "nav_aria_label": esc(sloc["nav"]["aria_label"]),
        "home_href": esc(home_href),
        "brand_aria_label": esc(sloc["nav"]["brand_aria"]),
        "handle": esc(site["handle"]),
        "nav_home": esc(sloc["nav"]["home"]),
        "nav_offers": esc(sloc["nav"]["offers"]),
        "nav_boundaries": esc(sloc["nav"]["boundaries"]),
        "nav_process": esc(sloc["nav"]["process"]),
        "nav_contact": esc(sloc["nav"]["contact"]),
        "lang_switch_href": esc(lang_switch_href),
        "lang_switch_hreflang": esc(sloc["nav"]["lang_hreflang"]),
        "lang_switch_lang": esc(sloc["nav"]["lang_lang"]),
        "lang_switch_aria": esc(sloc["nav"]["lang_aria"]),
        "lang_switch_title": esc(sloc["nav"]["lang_title"]),
        "lang_switch_label": esc(sloc["nav"]["lang_label"]),
        "theme_toggle_aria": esc(sloc["nav"]["theme_aria"]),
        "hero_kicker": esc(sloc["hero"]["kicker"]),
        "hero_title": esc(sloc["hero"]["title"]),
        "hero_statement": esc(sloc["hero"]["statement"]),
        "hero_focus_aria": esc(sloc["hero"]["focus_aria"]),
        "hero_focus_items": hero_focus_items,
        "hero_cta_primary": esc(sloc["hero"]["cta_primary"]),
        "hero_cta_secondary": esc(sloc["hero"]["cta_secondary"]),
        "brief_aria_label": esc(sloc["brief"]["aria_label"]),
        "brief_kicker": esc(sloc["brief"]["kicker"]),
        "brief_format_label": esc(sloc["brief"]["format_label"]),
        "brief_format_value": esc(sloc["brief"]["format_value"]),
        "brief_timeline_label": esc(sloc["brief"]["timeline_label"]),
        "brief_timeline_value": esc(sloc["brief"]["timeline_value"]),
        "brief_languages_label": esc(sloc["brief"]["languages_label"]),
        "brief_languages_value": esc(sloc["brief"]["languages_value"]),
        "brief_link_publications": esc(sloc["brief"]["link_publications"]),
        "brief_link_software": esc(sloc["brief"]["link_software"]),
        "offers_kicker": esc(sloc["offers"]["kicker"]),
        "offers_title": esc(sloc["offers"]["title"]),
        "offers_lead": esc(sloc["offers"]["lead"]),
        "offer_cards": "\n          ".join(offer_cards),
        "boundaries_kicker": esc(sloc["boundaries"]["kicker"]),
        "boundaries_title": esc(sloc["boundaries"]["title"]),
        "boundaries_lead": esc(sloc["boundaries"]["lead"]),
        "boundary_rows": "\n          ".join(boundary_rows),
        "process_kicker": esc(sloc["process"]["kicker"]),
        "process_title": esc(sloc["process"]["title"]),
        "process_lead": esc(sloc["process"]["lead"]),
        "process_steps": "\n          ".join(process_steps),
        "contact_kicker": esc(sloc["contact"]["kicker"]),
        "contact_title": esc(sloc["contact"]["title"]),
        "contact_lead": esc(sloc["contact"]["lead"]),
        "email": esc(site["email"]),
        "copy_default": esc(sloc["contact"]["copy_default"]),
        "copy_copied": esc(sloc["contact"]["copy_copied"]),
        "external_profiles_aria": esc(sloc["contact"]["external_profiles_aria"]),
        "closing_profile_links": closing_profile_links,
        "footer_status": esc(sloc["footer"]["status"]),
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
    services_template = (ROOT / "services.template.html").read_text(encoding="utf-8")

    targets = [
        ("en", ROOT / "index.html"),
        ("pt", ROOT / "pt/index.html"),
    ]
    for lang, out_path in targets:
        loc = json.loads((ROOT / f"locales/{lang}.json").read_text(encoding="utf-8"))
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(render_page(template, site, loc, lang), encoding="utf-8")
        print(f"Generated {out_path.relative_to(ROOT)}")

    service_targets = [
        ("en", ROOT / "services/index.html"),
        ("pt", ROOT / "pt/servicos/index.html"),
    ]
    for lang, out_path in service_targets:
        loc = json.loads((ROOT / f"locales/{lang}.json").read_text(encoding="utf-8"))
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(
            render_services_page(services_template, site, loc, lang), encoding="utf-8"
        )
        print(f"Generated {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()