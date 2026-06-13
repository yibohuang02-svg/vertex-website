/* ═══════════════════════════════════════════════
   VERTEX SERVICES — Main JS
═══════════════════════════════════════════════ */

// ── Tab switching ─────────────────────────────────
const navTabs   = document.querySelectorAll('.nav-tab');
const tabPanels = document.querySelectorAll('.tab-panel');
const navLinks  = document.getElementById('navLinks');

function revealVisibleInPanel(panel) {
  // IntersectionObserver doesn't re-fire after display:none → block.
  // Double-rAF ensures the browser has committed layout before we check positions.
  const sel = '.service-card, .about-card, .sla-card, .case-card, .facility-zone, ' +
              '.coverage-point, .process-step, .cert-badge, .pillar';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    panel.querySelectorAll(sel).forEach(el => {
      if (el.classList.contains('revealed')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80 && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }));
}

function switchTab(tabName) {
  tabPanels.forEach(p => p.classList.remove('active'));
  navTabs.forEach(t => t.classList.remove('active'));

  const panel = document.getElementById('panel-' + tabName);
  const btn   = document.querySelector('.nav-tab[data-tab="' + tabName + '"]');

  if (panel) {
    panel.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    revealVisibleInPanel(panel);
  }
  if (btn) btn.classList.add('active');

  history.replaceState(null, '', '#' + tabName);
}

// Init from hash or default to home
const validTabs  = ['home', 'services', 'coverage', 'cases', 'contact'];
const initialTab = validTabs.includes(window.location.hash.slice(1))
  ? window.location.hash.slice(1)
  : 'home';
switchTab(initialTab);

// Nav tab clicks
navTabs.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
    navLinks.classList.remove('open');
  });
});

// data-goto-tab intercept (buttons and links anywhere on the page)
document.addEventListener('click', e => {
  const el = e.target.closest('[data-goto-tab]');
  if (el) {
    e.preventDefault();
    switchTab(el.dataset.gotoTab);
    navLinks.classList.remove('open');
  }
});

// ── Navbar scroll effect ─────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile nav toggle ────────────────────────────────
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ── Animated counter ─────────────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const countersObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      countersObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) countersObserver.observe(heroStats);

// ── Scroll-reveal ────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.service-card, .about-card, .sla-card, .case-card, .facility-zone, ' +
  '.coverage-point, .process-step, .cert-badge, .pillar'
).forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.08}s, transform 0.5s ease ${(i % 6) * 0.08}s`;
  revealObserver.observe(el);
});

document.head.insertAdjacentHTML('beforeend', `
<style>
  .revealed { opacity: 1 !important; transform: translateY(0) !important; }
</style>
`);

// ── Contact form ─────────────────────────────────────
const form           = document.getElementById('contactForm');
const submitBtn      = document.getElementById('submitBtn');
const formSuccess    = document.getElementById('formSuccess');
const formSuccessMsg = document.getElementById('formSuccessMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled  = true;
    btnText.textContent = 'Sending...';

    try {
      const data = Object.fromEntries(new FormData(form));
      const res  = await fetch('/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
        formSuccessMsg.textContent = json.message;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }
    } catch (err) {
      formSuccessMsg.textContent = 'Submission received. We will be in touch shortly.';
      formSuccess.classList.add('show');
    } finally {
      submitBtn.disabled  = false;
      btnText.textContent = 'Send Enquiry';
    }
  });
}

// ── SLA carousel dots (mobile) ────────────────────
const slaGrid = document.querySelector('.sla-grid');
const slaDots = document.querySelectorAll('.sla-dot');

if (slaGrid && slaDots.length) {
  const setActiveDot = (index) => {
    slaDots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  slaDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const card = slaGrid.children[i];
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  let scrollTimer;
  slaGrid.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const cards  = Array.from(slaGrid.children);
      const center = slaGrid.scrollLeft + slaGrid.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveDot(closest);
    }, 50);
  }, { passive: true });
}
