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

/* =============================================
   CONTENT LOCK
   A single master password unlocks all "locked" content
   sitewide (once unlocked in a browser, it stays unlocked —
   no need to re-enter it every visit).

   This is a PACING tool, not real security: the password is
   only hashed (not shown in plain text), but the underlying
   HTML still ships to the browser, so a student who reads
   page source could still find it. Good for "don't skip
   ahead," not for protecting anything sensitive.

   HOW TO CHANGE THE PASSWORD:
   1. Open the browser console on any page (F12 → Console).
   2. Run this, swapping in your new password:
        crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
          .then(buf => console.log(Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2,'0')).join('')));
   3. Copy the hash it prints and paste it below as passwordHash.

   HOW TO LOCK/UNLOCK A QUARTER:
   Add or remove the quarter number from lockedQuarters below.
   Cards, story cards, and vocab sets tagged with that quarter
   (via data-quarter="N") will lock/unlock automatically.
   The Timeline page is intentionally never locked — it's meant
   to stay a whole-year preview.
   ============================================= */
const LOCK = {
  // Password: saturday09
  passwordHash: "35c2274594016232b9f1ea10857e5e56089af4afd5fa20299c009b1c9507bc42",
  lockedQuarters: [2, 3, 4], // edit this list as the year progresses
  storageKey: "ush-unlocked",
};

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isUnlocked() {
  return localStorage.getItem(LOCK.storageKey) === 'true';
}

function buildLockModal() {
  if (document.getElementById('lockModal')) return;
  const overlay = document.createElement('div');
  overlay.className = 'lock-modal-overlay';
  overlay.id = 'lockModal';
  overlay.innerHTML = `
    <div class="lock-modal">
      <h3>🔒 Enter Password</h3>
      <p>This content unlocks as the class reaches it. Ask your teacher if you need early access.</p>
      <input type="password" id="lockPasswordInput" placeholder="Password" autocomplete="off">
      <p class="lock-error" id="lockError" style="display:none;">Incorrect password.</p>
      <div class="lock-modal-actions">
        <button class="btn btn--sm" id="lockCancelBtn" type="button">Cancel</button>
        <button class="btn btn--primary btn--sm" id="lockSubmitBtn" type="button">Unlock</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.getElementById('lockCancelBtn').addEventListener('click', close);

  const submit = async () => {
    const input = document.getElementById('lockPasswordInput');
    const hash = await sha256Hex(input.value);
    if (hash === LOCK.passwordHash) {
      localStorage.setItem(LOCK.storageKey, 'true');
      location.reload();
    } else {
      document.getElementById('lockError').style.display = 'block';
      input.value = '';
      input.focus();
    }
  };
  document.getElementById('lockSubmitBtn').addEventListener('click', submit);
  document.getElementById('lockPasswordInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
  document.getElementById('lockPasswordInput').focus();
}

function applyContentLock() {
  const unlocked = isUnlocked();

  if (!unlocked) {
    document.querySelectorAll('[data-quarter]').forEach(el => {
      const q = parseInt(el.getAttribute('data-quarter'), 10);
      if (LOCK.lockedQuarters.includes(q)) {
        el.classList.add('is-locked');
        el.innerHTML = `
          <span class="lock-icon">🔒</span>
          <h3>Locked</h3>
          <p>Unlocks in Quarter ${q}</p>
        `;
        el.removeAttribute('href');
        el.removeAttribute('target');
        el.addEventListener('click', (e) => {
          e.preventDefault();
          buildLockModal();
        });
      }
    });
  }

  /* Nav unlock indicator — injected on every page */
  const navLinks = document.querySelector('.nav-links');
  if (navLinks && !document.getElementById('lockNavItem')) {
    const li = document.createElement('li');
    li.id = 'lockNavItem';
    const btn = document.createElement('a');
    btn.href = '#';
    btn.style.cursor = 'pointer';
    if (unlocked) {
      btn.textContent = '🔓 Unlocked';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Lock content again on this device?')) {
          localStorage.removeItem(LOCK.storageKey);
          location.reload();
        }
      });
    } else {
      btn.textContent = '🔒 Unlock';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        buildLockModal();
      });
    }
    li.appendChild(btn);
    navLinks.appendChild(li);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyContentLock();

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
