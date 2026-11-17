/* ==========================================================================
   Gabriel V. Silva
   Melhoria progressiva: a página funciona integralmente sem este script.
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
  var THEME_COLORS = { light: "#f4f5f2", dark: "#090b0a" };

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function syncThemeUI() {
    var theme = currentTheme();
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", THEME_COLORS[theme]);
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
    syncThemeUI();
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
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

    var syncNavOffset = function () {
      root.style.setProperty("--nav-offset", nav.offsetHeight + 8 + "px");
    };
    syncNavOffset();
    window.addEventListener("resize", syncNavOffset);
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
      if (active) a.setAttribute("aria-current", "location");
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
  function goTo(target) {
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href^='#']");
    if (!a) return;
    var hash = a.getAttribute("href");
    if (hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    e.preventDefault();
    goTo(target);
    if (history.pushState) history.pushState(null, "", hash);
  });

  window.addEventListener("popstate", function () {
    var id = window.location.hash.slice(1);
    var target = id ? document.getElementById(id) : null;
    if (target) goTo(target);
    else window.scrollTo(0, 0);
  });

  /* ---------- 5. Fallback do retrato ---------- */
  var portrait = document.querySelector(".portrait-img");
  if (portrait) {
    portrait.addEventListener("error", function () {
      portrait.classList.add("is-missing");
    });
  }
})();