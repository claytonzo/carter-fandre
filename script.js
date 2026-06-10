// Sticky nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Scroll progress bar ──
const bar = document.createElement('div');
bar.id = 'progress-bar';
document.body.appendChild(bar);
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / max * 100) + '%';
}, { passive: true });

// ── Mouse spotlight ──
if (!reduced) {
  const spot = document.createElement('div');
  spot.id = 'spotlight';
  document.body.appendChild(spot);
  let sx = innerWidth / 2, sy = innerHeight / 2, tx = sx, ty = sy;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function moveSpot() {
    sx += (tx - sx) * 0.08;
    sy += (ty - sy) * 0.08;
    spot.style.background =
      `radial-gradient(600px circle at ${sx}px ${sy}px, rgba(61,220,151,0.07), transparent 70%)`;
    requestAnimationFrame(moveSpot);
  })();
}

// ── 3D tilt on sport & family cards ──
document.querySelectorAll('.sport-card, a.fam-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Scroll fade-in
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(22px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);

const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.sport-card, .fam-card, .highlight, .about-text p, .career-text p, .cm')
  .forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
