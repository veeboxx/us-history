/* ============================================
   US HISTORY — SHARED SCRIPTS
   ============================================ */

/* =============================================
   TODAY'S ASSIGNMENTS
   Edit these arrays and push to GitHub.
   Use the filename without .html extension.
   Clear the arrays when nothing is assigned.

   Stories:  use the filename from /stories/
   Games:    use the filename from /games/
   Resources: use the filename from /resources/
   ============================================= */
const TODAY = {
  label: "",        // Change to whatever you want: "Due Friday", "This Week", etc.
  stories:   [],                // e.g. ["hooverville", "the-fish-wars"]
  games:     [],                // e.g. ["apollo13", "colony"]
  resources: [],                // e.g. ["oregon_trail_reading"]
};

document.addEventListener('DOMContentLoaded', () => {

  /* --- Scroll Reveal --- */
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* --- Mobile Nav Toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.innerHTML = isOpen ? '&#x2715;' : '&#9776;';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;';
      });
    });
  }

  /* --- Active nav highlight --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });

  /* --- Page exit transition on internal links --- */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && link.target !== '_blank') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = href; }, 280);
      });
    }
  });

  /* --- TODAY badges on cards --- */
  const allAssigned = [...TODAY.stories, ...TODAY.games, ...TODAY.resources];
  if (allAssigned.length > 0) {
    document.querySelectorAll('a.card, a.story-card, a.game-card, a.resource-card').forEach(card => {
      const href = card.getAttribute('href') || '';
      // Extract filename without extension and path
      const filename = href.split('/').pop().replace('.html', '');
      if (allAssigned.includes(filename)) {
        card.classList.add('today-assigned');
        const badge = document.createElement('span');
        badge.className = 'today-badge';
        badge.textContent = 'Today';
        card.insertBefore(badge, card.firstChild);
      }
    });
  }

  /* --- TODAY strip on homepage --- */
  if (allAssigned.length > 0 && (currentPage === 'index.html' || currentPage === '')) {
    buildTodayStrip();
  }
});

/* Build the "Today's Work" strip on the homepage */
function buildTodayStrip() {
  const hero = document.querySelector('.hero-section, section.hero, .hero');
  if (!hero) return;

  const items = [];

  TODAY.stories.forEach(slug => {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    items.push({ label: 'Read', title: title, href: `stories/${slug}.html` });
  });

  TODAY.games.forEach(slug => {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    items.push({ label: 'Play', title: title, href: `games/${slug}.html` });
  });

  TODAY.resources.forEach(slug => {
    const title = slug.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    items.push({ label: 'Complete', title: title, href: `resources/${slug}.html` });
  });

  if (items.length === 0) return;

  const strip = document.createElement('section');
  strip.className = 'today-strip';
  strip.innerHTML = `
    <div class="container">
      <div class="today-header">
        <span class="today-pulse"></span>
        <span class="today-label">${TODAY.label}</span>
      </div>
      <div class="today-items">
        ${items.map(i => `
          <a href="${i.href}" class="today-item">
            <span class="today-item-type">${i.label}</span>
            <span class="today-item-title">${i.title}</span>
            <span class="today-item-arrow">&rarr;</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;
  hero.after(strip);
}

/* Page exit keyframes */
const s = document.createElement('style');
s.textContent = `.page-exit{animation:pageOut .28s cubic-bezier(.22,1,.36,1) forwards}@keyframes pageOut{to{opacity:0;transform:translateY(-8px)}}`;
document.head.appendChild(s);

/* Fix back/forward cache — force page visible when restored */
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    document.body.classList.remove('page-exit');
    document.body.style.opacity = '1';
    document.body.style.transform = 'none';
  }
});
