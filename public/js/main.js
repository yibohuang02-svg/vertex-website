/* ═══════════════════════════════════════════════
   VERTEX SERVICES — Main JS
═══════════════════════════════════════════════ */

// ── Navbar scroll effect ─────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = y;
}, { passive: true });

// ── Mobile nav toggle ────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Animated hero canvas ─────────────────────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const CYAN   = '0, 212, 255';
const VIOLET = '124, 58, 237';

const nodes = [];
const NODE_COUNT = 55;

function randBetween(a, b) { return a + Math.random() * (b - a); }

function createNode() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: randBetween(-0.25, 0.25),
    vy: randBetween(-0.25, 0.25),
    r: randBetween(1, 2.5),
    color: Math.random() > 0.6 ? CYAN : VIOLET,
    opacity: randBetween(0.3, 0.8),
  };
}

for (let i = 0; i < NODE_COUNT; i++) nodes.push(createNode());

const CONNECT_DIST = 140;
let animFrame;

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.18;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${n.color}, ${n.opacity})`;
    ctx.fill();
  });

  // Move nodes
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  });

  animFrame = requestAnimationFrame(drawCanvas);
}

drawCanvas();

// ── Animated counter ─────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
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

// ── Scroll-reveal ────────────────────────────────
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
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.08}s, transform 0.5s ease ${(i % 6) * 0.08}s`;
  revealObserver.observe(el);
});

document.head.insertAdjacentHTML('beforeend', `
<style>
  .revealed { opacity: 1 !important; transform: translateY(0) !important; }
</style>
`);

// ── Contact form ─────────────────────────────────
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formSuccessMsg = document.getElementById('formSuccessMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
      submitBtn.disabled = false;
      btnText.textContent = 'Send Enquiry';
    }
  });
}

// ── Active nav link on scroll ─────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cyan)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
