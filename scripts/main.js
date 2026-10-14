// ================= INITIALIZATION =================
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