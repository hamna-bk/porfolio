/* ============================================================
   animations.js
   ============================================================ */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------- Preloader ----------
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const minDelay = REDUCED_MOTION ? 0 : 900;
  setTimeout(() => preloader.classList.add("is-hidden"), minDelay);
});

// ---------- Scroll reveals ----------
function initReveals() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (REDUCED_MOTION) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => observer.observe(t));
}

// ---------- Stat counters ----------
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animateCount = (node) => {
    const target = parseFloat(node.dataset.count);
    if (REDUCED_MOTION) {
      node.textContent = target;
      return;
    }
    let current = 0;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      current = Math.round(target * progress);
      node.textContent = current;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => observer.observe(c));
}

// ---------- Hero signal-trace canvas ----------
function initSignalCanvas() {
  const canvas = document.getElementById("signal-canvas");
  if (!canvas || REDUCED_MOTION) return;
  const ctx = canvas.getContext("2d");
  let w, h, t = 0;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-green").trim() || "#5FE3A1";

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.5 * devicePixelRatio;
    ctx.beginPath();
    const midY = h / 2;
    const amp = h * 0.08;
    for (let x = 0; x <= w; x += 4) {
      const y = midY + Math.sin(x * 0.01 + t) * amp * Math.sin(x * 0.002 + t * 0.5);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    t += 0.01;
    requestAnimationFrame(draw);
  }
  draw();
}

// ---------- Run once content is rendered ----------
document.addEventListener("content:ready", () => {
  initReveals();
  initCounters();
  initSignalCanvas();
});
