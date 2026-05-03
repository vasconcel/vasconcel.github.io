// ================= INITIALIZATION =================
window.addEventListener('load', () => {
  initRevealAnimations();
  initYear();
  initLucideIcons();
  initCarousels();
});

// ================= LUCIDE ICONS =================
function initLucideIcons() {
  try {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
      console.log("Lucide icons initialized");
    }
  } catch (error) {
    console.error("Error initializing Lucide icons:", error);
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

// ================= MULTIPLE CAROUSELS =================
function initCarousels() {
  document.querySelectorAll('.carousel-header').forEach(header => {
    const section = header.closest('.section');
    const track = section.querySelector('.carousel-track');
    const prevBtn = header.querySelector('.prev');
    const nextBtn = header.querySelector('.next');
    
    if (prevBtn && nextBtn && track) {
      prevBtn.onclick = () => track.scrollBy({ left: -400, behavior: 'smooth' });
      nextBtn.onclick = () => track.scrollBy({ left: 400, behavior: 'smooth' });
    }
  });
}