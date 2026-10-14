// ================= INITIALIZATION =================
// The reveal is set up as soon as the script is parsed, at the end of the
// body: the targets exist by then, and hiding them here (before paint)
// avoids a flash that waiting for "load" would cause while the portrait
// downloads. Everything else waits for load.
initReveal();

window.addEventListener('load', () => {
  initYear();
  initNavSpy();
});

// ================= FOOTER YEAR =================
function initYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ================= NAV SCROLL SPY =================
// Highlights the in-page anchor for the section currently in view.
// Uses scroll position: the active section is the last one whose top
// has crossed the viewport centre, but only once the first section has
// reached the sticky navigation, so nothing is highlighted while the
// hero is in view. Because the contact section sits at the end of the
// page, a "bottom reached" check always activates it, which a plain
// IntersectionObserver with a negative rootMargin would miss on short
// final sections.
function initNavSpy() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length) {
    return;
  }

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  const setActive = (id) => {
    const target = id == null ? null : '#' + id;
    links.forEach((link) => {
      link.classList.toggle(
        'active',
        target !== null && link.getAttribute('href') === target
      );
    });
  };

  // Until the first section reaches the sticky navigation the reader is
  // still in the hero, so no item is current. Past that gate the active
  // item is the last section whose top has crossed the viewport centre.
  // A centre probe alone marked Projects as current on load for tall
  // viewports, where the first section's top sits above the centre line
  // while the hero is still in view.
  const nav = document.querySelector('.global-nav');
  const gate = (nav ? nav.offsetHeight : 56) + 40;

  const pick = () => {
    const doc = document.documentElement;
    const centre = window.innerHeight * 0.45;
    const atBottom =
      window.innerHeight + window.scrollY >= doc.scrollHeight - 8;

    let active = null;
    const tops = sections.map((section) => section.getBoundingClientRect().top);
    if (tops[0] <= gate) {
      for (let i = 0; i < sections.length; i += 1) {
        if (tops[i] <= centre) {
          active = sections[i];
        }
      }
    }
    if (atBottom) {
      active = sections[sections.length - 1];
    }
    setActive(active ? active.id : null);
  };

  const onScroll = () => {
    requestAnimationFrame(pick);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  pick();
}

// ================= ENTRANCE REVEAL =================
// Progressive enhancement: nothing is hidden unless this runs, so the page
// is identical with JavaScript off. It steps aside entirely when the reader
// prefers reduced motion or the browser lacks IntersectionObserver, and it
// never hides anything already on screen. The hidden state is a class the
// script adds, so a failure here cannot leave content invisible.
function initReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    return;
  }

  const targets = document.querySelectorAll(
    '.section-head, .role-desc, .project, .facts, .publication'
  );
  if (!targets.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, seen) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add('reveal--in');
        seen.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.01 }
  );

  const viewport = window.innerHeight || document.documentElement.clientHeight;

  Array.prototype.forEach.call(targets, (el) => {
    // Leave anything the reader can already see untouched: no flash, and no
    // reliance on the observer for above-the-fold content.
    if (el.getBoundingClientRect().top < viewport * 0.9) {
      return;
    }

    // A minimal stagger across publication records, capped at one step so
    // the reader never waits for the second record to become readable.
    if (el.classList.contains('publication')) {
      const records = Array.prototype.filter.call(
        el.parentElement.children,
        (child) => child.classList.contains('publication')
      );
      el.style.transitionDelay = Math.min(records.indexOf(el), 1) * 70 + 'ms';
    }

    el.classList.add('reveal');
    observer.observe(el);
  });

  // If reduced motion is turned on while the page is open, stop hiding and
  // bring whatever is left into view.
  if (typeof reduce.addEventListener === 'function') {
    reduce.addEventListener('change', () => {
      if (!reduce.matches) {
        return;
      }
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('reveal--in');
      });
    });
  }
}