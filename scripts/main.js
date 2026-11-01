/* ==========================================================================
   Gabriel V. Silva — Research & Software
   Melhoria progressiva: a página funciona integralmente sem este script.

   Recursos
   1. Ano do rodapé
   2. Alternador de tema (claro/escuro) com persistência
   3. Navegação: estado ao rolar e seção ativa
   4. Rolagem suave para âncoras, com foco acessível
   5. Revelação ao rolar (respeita prefers-reduced-motion)
   6. Fallback do retrato
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Ano do rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 2. Tema ---------- */
  var toggle = document.querySelector(".theme-toggle");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var THEME_COLORS = { light: "#FFFFFF", dark: "#0D1117" };

  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return darkQuery.matches ? "dark" : "light";
  }

  function syncThemeUI() {
    var theme = currentTheme();
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", THEME_COLORS[theme]);
    });
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* armazenamento indisponível: o tema vale só nesta visita */
    }
    syncThemeUI();
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }
  if (darkQuery.addEventListener) {
    darkQuery.addEventListener("change", syncThemeUI);
  }
  syncThemeUI();

  /* ---------- 3. Navegação: estado ao rolar ---------- */
  var nav = document.querySelector(".global-nav");
  if (nav) {
    var ticking = false;
    var updateNav = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateNav);
        }
      },
      { passive: true }
    );
    updateNav();
  }

  /* ---------- 3b. Navegação: seção ativa ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      var active = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
        });
        var best = null;
        sections.forEach(function (s) {
          if (visible[s.id] && (!best || visible[s.id] > visible[best.id])) best = s;
        });
        if (best) setActive(best.id);
        else if (window.scrollY < 200) setActive("");
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------- 4. Rolagem suave para âncoras ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href^='#']");
    if (!a) return;
    var hash = a.getAttribute("href");
    if (hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (history.pushState) history.pushState(null, "", hash);
  });

  /* ---------- 5. Revelação ao rolar ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    root.classList.add("js");

    var singles = [
      ".section-head",
      ".project",
      ".publication",
      ".pub-note",
      ".tools-line",
      ".closing-line",
      ".closing-email",
      ".closing-links"
    ];
    var staggered = [
      ".proof-list li",
      ".research-index li",
      ".capability",
      ".fact",
      ".stat, .figure"
    ];

    var targets = [];
    singles.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        targets.push(el);
      });
    });
    staggered.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.style.setProperty("--reveal-delay", (i % 4) * 80 + "ms");
        targets.push(el);
      });
    });

    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach(function (el) {
      el.classList.add("reveal");
      reveal.observe(el);
    });

    /* Rede de segurança: nunca deixa conteúdo escondido se algo falhar */
    window.setTimeout(function () {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 4000);
  }

  /* ---------- 6. Fallback do retrato ---------- */
  var portrait = document.querySelector(".portrait-img");
  if (portrait) {
    portrait.addEventListener("error", function () {
      portrait.classList.add("is-missing");
    });
  }
})();