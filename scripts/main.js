/* ==========================================================================
   Gabriel V. Silva | Empirical Software Engineering
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
  var THEME_COLORS = { light: "#fafafa", dark: "#09090b" };

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

  var visible = {};

  function activateBestVisible() {
    var best = null;
    sections.forEach(function (s) {
      if (visible[s.id] && (!best || visible[s.id] > visible[best.id])) best = s;
    });
    if (best) setActive(best.id);
    else if (window.scrollY < 200) setActive("");
  }

  function atPageBottom() {
    return window.innerHeight + Math.ceil(window.scrollY) >= document.documentElement.scrollHeight - 4;
  }

  function syncActiveSection() {
    if (!sections.length) return;
    if (atPageBottom()) {
      var last = sections[sections.length - 1];
      setActive(last.id);
      revealThrough(last);
    } else activateBestVisible();
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
        });
        syncActiveSection();
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  if (sections.length) {
    var spyTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!spyTicking) {
          spyTicking = true;
          window.requestAnimationFrame(function () {
            syncActiveSection();
            spyTicking = false;
          });
        }
      },
      { passive: true }
    );
    syncActiveSection();
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
    if (a.closest(".nav-links")) setActive(hash.slice(1));
    revealThrough(target);
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

  /* ---------- 6. Scroll reveal progressivo ---------- */
  var revealTargets = [];
  var revealObserver = null;

  function showReveal(element) {
    if (element.classList.contains("is-visible")) return;
    element.classList.add("is-visible");
    if (revealObserver) revealObserver.unobserve(element);
  }

  function revealThrough(target) {
    if (!revealTargets || !revealTargets.length || !target) return;
    var bounds = target.closest ? target.closest(".section") : null;
    if (!bounds) bounds = target;
    var limit = bounds.getBoundingClientRect().bottom + window.scrollY + 1;
    revealTargets.forEach(function (element) {
      if (element.getBoundingClientRect().top + window.scrollY <= limit) showReveal(element);
    });
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets = Array.prototype.slice.call(
      document.querySelectorAll(
        ".section-head, .research-index li, .publication, .project, .capability, .tools-line, .facts, .section--contact .email-row, .section--contact .closing-links"
      )
    );
  }

  if (revealTargets.length) {
    root.classList.add("has-reveal");
    revealTargets.forEach(function (element) {
      element.classList.add("reveal");
    });

    function revealEntered() {
      revealTargets.forEach(function (element) {
        if (
          !element.classList.contains("is-visible") &&
          element.getBoundingClientRect().top < window.innerHeight * 0.92
        ) {
          showReveal(element);
        }
      });
    }

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) showReveal(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    revealTargets.forEach(function (element) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) showReveal(element);
      else revealObserver.observe(element);
    });
    window.addEventListener("scroll", revealEntered, { passive: true });
    window.addEventListener("resize", revealEntered);
    revealEntered();
  }

  /* ---------- 7. Copiar e-mail ---------- */
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "0";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.focus();
      field.select();
      field.setSelectionRange(0, text.length);
      var copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (e) {}
      document.body.removeChild(field);
      if (copied) resolve();
      else reject();
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text);
      });
    }
    return legacyCopy(text);
  }

  var copyButtons = Array.prototype.slice.call(document.querySelectorAll(".btn--copy"));
  var copyStatus = document.getElementById("copy-status");
  copyButtons.forEach(function (button) {
    var defaultLabel = button.getAttribute("data-label-default") || button.textContent;
    var copiedLabel = button.getAttribute("data-label-copied") || defaultLabel;
    var email = button.getAttribute("data-copy-email") || "";
    var resetTimer = null;

    button.addEventListener("click", function () {
      copyText(email)
        .then(function () {
          if (resetTimer) window.clearTimeout(resetTimer);
          button.textContent = copiedLabel;
          button.classList.add("is-copied");
          if (copyStatus) copyStatus.textContent = copiedLabel;
          resetTimer = window.setTimeout(function () {
            button.textContent = defaultLabel;
            button.classList.remove("is-copied");
            if (copyStatus) copyStatus.textContent = "";
          }, 2000);
        })
        .catch(function () {
          if (copyStatus) copyStatus.textContent = defaultLabel;
        });
    });
  });
})();