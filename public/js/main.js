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
              '.coverage-point, .process-step, .journey-step, .cert-badge, .pillar';
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

function switchTab(tabName, updateUrl = false) {
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

  if (updateUrl) {
    const path = tabName === 'home' ? '/' : '/' + tabName;
    if (window.location.pathname !== path) {
      history.pushState({ tab: tabName }, '', path);
    }
  }
}

// Init from the URL path (falls back to a legacy #hash link, then home)
const validTabs = ['home', 'services', 'coverage', 'career', 'contact'];

function tabFromPath(pathname) {
  const seg = pathname.replace(/^\/|\/$/g, '');
  return validTabs.includes(seg) ? seg : null;
}

const hashTab    = validTabs.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : null;
const initialTab = tabFromPath(window.location.pathname) || hashTab || 'home';
switchTab(initialTab);

// Upgrade old #hash links to the new path silently, without adding a history entry
if (hashTab && !tabFromPath(window.location.pathname)) {
  history.replaceState({ tab: initialTab }, '', initialTab === 'home' ? '/' : '/' + initialTab);
}

// Browser back/forward
window.addEventListener('popstate', () => {
  switchTab(tabFromPath(window.location.pathname) || 'home');
});

// Nav tab clicks
navTabs.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab, true);
    navLinks.classList.remove('open');
  });
});

// data-goto-tab intercept (buttons and links anywhere on the page)
document.addEventListener('click', e => {
  const el = e.target.closest('[data-goto-tab]');
  if (el) {
    e.preventDefault();
    switchTab(el.dataset.gotoTab, true);
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
  '.coverage-point, .process-step, .journey-step, .cert-badge, .pillar'
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
// Submits straight to Web3Forms (https://web3forms.com) so enquiries reach
// enquiry@vertexservice.ai without needing a backend on the production server.
const WEB3FORMS_ACCESS_KEY = '02cce691-9113-4912-8e80-dfd216126df0';

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
      data.access_key = WEB3FORMS_ACCESS_KEY;
      data.subject    = 'New enquiry — Vertex Service website';

      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || 'Submission failed');

      form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
      formSuccess.classList.remove('is-error');
      formSuccessMsg.textContent = 'Thank you. We will be in touch within 24 hours.';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } catch (err) {
      formSuccess.classList.add('is-error');
      formSuccessMsg.textContent = 'Something went wrong — please email us directly at enquiry@vertexservice.ai.';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show', 'is-error'), 8000);
    } finally {
      submitBtn.disabled  = false;
      btnText.textContent = 'Send Enquiry';
    }
  });
}

// ── Journey line scroll-fill ─────────────────────
// The persistent line fills as the visitor scrolls the journey,
// reinforcing the "one continuous, end-to-end process" message.
const journeyTrack    = document.getElementById('journeyTrack');
const journeyLineFill = document.getElementById('journeyLineFill');

if (journeyTrack && journeyLineFill) {
  const updateJourneyLine = () => {
    const rect = journeyTrack.getBoundingClientRect();
    if (rect.height === 0) return; // panel hidden
    // Fill from when the track enters the viewport until its end passes the ~60% line
    const anchor   = window.innerHeight * 0.6;
    const progress = (anchor - rect.top) / rect.height;
    journeyLineFill.style.height = (Math.max(0, Math.min(1, progress)) * 100) + '%';
  };
  window.addEventListener('scroll', updateJourneyLine, { passive: true });
  window.addEventListener('resize', updateJourneyLine, { passive: true });
  updateJourneyLine();
}

// ── Footage frame "camera on" transition ─────────
// The unboxing photo switches to a live-footage treatment (REC badge,
// timecode, viewfinder corners) once it scrolls into view.
const footageFrame = document.getElementById('footageFrame');

if (footageFrame) {
  const footageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footageFrame.classList.add('live');
        footageObserver.unobserve(footageFrame);
      }
    });
  }, { threshold: 0.35 });
  footageObserver.observe(footageFrame);
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
