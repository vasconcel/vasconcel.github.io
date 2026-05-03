// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
  initRevealAnimations();
  initYear();
  initLucideIcons();
});

// ================= LUCIDE ICONS =================
function initLucideIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    console.log("Lucide icons initialized");
  } else {
    console.error("Lucide library not loaded");
  }
}

// ================= FOOTER YEAR =================
function initYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ================= SCROLL REVEAL ANIMATIONS =================
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    observer.observe(el);
  });
}