// ================= INITIALIZATION =================
window.addEventListener('load', () => {
  initRevealAnimations();
  initYear();
  initLucideIcons();
  initCarousels();
  initGitHubStats();
});

// ================= GITHUB LANGUAGE STATS =================
async function fetchGitHubStats(username) {
  const languageBar = document.getElementById('language-bar');
  const languageLogs = document.getElementById('language-logs');
  const lastUpdated = document.getElementById('last-updated');

  if (!languageBar || !languageLogs) return;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!response.ok) throw new Error('Failed to fetch repositories');

    const repos = await response.json();
    const languageBytes = {};
    let totalBytes = 0;

    for (const repo of repos) {
      if (repo.language) {
        const langResponse = await fetch(repo.languages_url);
        if (langResponse.ok) {
          const languages = await langResponse.json();
          for (const [lang, bytes] of Object.entries(languages)) {
            languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
            totalBytes += bytes;
          }
        }
      }
    }

    const languagePercentages = [];
    for (const [lang, bytes] of Object.entries(languageBytes)) {
      const percentage = (bytes / totalBytes) * 100;
      if (percentage >= 5) {
        languagePercentages.push({
          name: lang,
          percentage: percentage.toFixed(1)
        });
      }
    }

    languagePercentages.sort((a, b) => b.percentage - a.percentage);

    languageBar.innerHTML = '';
    languageLogs.innerHTML = '';

    languagePercentages.forEach((lang, index) => {
      const segment = document.createElement('div');
      segment.className = `lang-segment ${lang.name.toLowerCase()}`;
      segment.style.width = `${lang.percentage}%`;
      segment.style.backgroundColor = getLangColor(lang.name);
      segment.setAttribute('data-lang', lang.name);
      languageBar.appendChild(segment);

      const logEntry = document.createElement('div');
      logEntry.className = 'lang-log';
      logEntry.innerHTML = `
        <span class="lang-index">[ ${String(index + 1).padStart(2, '0')} ]</span>
        <span class="lang-name">${lang.name.toUpperCase()}</span>
        <span class="lang-percent">:: ${lang.percentage}%</span>
        <span class="lang-status">[ STATUS: ${getLangStatus(lang.percentage)} ]</span>
      `;
      languageLogs.appendChild(logEntry);
    });

    if (lastUpdated) {
      const now = new Date();
      lastUpdated.textContent = `Last Updated: ${now.toLocaleTimeString()}`;
    }

  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    languageLogs.innerHTML = '<div class="lang-log"><span class="lang-status">[ ERROR: API UNAVAILABLE ]</span></div>';
  }
}

function getLangColor(lang) {
  const colors = {
    'Python': '#3fb950',
    'JavaScript': '#f0db4f',
    'TypeScript': '#3178c6',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#178600',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Ruby': '#701516',
    'PHP': '#4F5D95',
    'Shell': '#6e7681',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Vue': '#41b883',
    'Jupyter Notebook': '#da5fc0',
    'Solidity': '#AA6746'
  };
  return colors[lang] || '#6e7681';
}

function getLangStatus(percentage) {
  if (percentage >= 50) return 'OPTIMIZED';
  if (percentage >= 20) return 'OPERATIONAL';
  return 'CORE';
}

function initGitHubStats() {
  const languageBar = document.getElementById('language-bar');
  if (languageBar) {
    fetchGitHubStats('vasconcel');
  }
}

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