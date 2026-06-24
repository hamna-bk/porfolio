/* ============================================================
   main.js
   ============================================================ */

// ---------- Theme toggle (persisted) ----------
(function initTheme() {
  const stored = localStorage.getItem("hbk-theme");
  if (stored) document.documentElement.setAttribute("data-theme", stored);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hbk-theme", next);
  });
})();

// ---------- Sticky navbar ----------
(function initNavScroll() {
  const nav = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  });
})();

// ---------- Mobile nav toggle ----------
(function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

// ---------- Smooth scroll (Lenis if available, native fallback) ----------
(function initSmoothScroll() {
  if (window.Lenis && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
})();

// ---------- Back to top ----------
document.getElementById("back-to-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- Project filter + modal (depends on rendered project cards) ----------
document.addEventListener("content:ready", () => {
  const filterBar = document.getElementById("filter-bar");
  const grid = document.getElementById("projects-grid");
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-content");

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const filter = btn.dataset.filter;
    grid.querySelectorAll(".project-card").forEach((card) => {
      const match = filter === "All" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !match);
    });
  });

  function openModal(index) {
    const p = SITE.projects[index];
    if (!p) return;
    const stack = (p.stack || []).map((s) => `<span class="skill-chip">${s.tech}</span>`).join("");
    const links = [
      p.githubLink ? `<a href="${p.githubLink}" target="_blank" rel="noopener">GitHub →</a>` : "",
      p.demoLink ? `<a href="${p.demoLink}" target="_blank" rel="noopener">Live demo →</a>` : "",
      p.videoLink ? `<a href="${p.videoLink}" target="_blank" rel="noopener">Video →</a>` : "",
    ].join("");

    modalContent.innerHTML = `
      ${projectMediaHTML(p)}
      <div class="project-tag">${p.category || ""}</div>
      <h2 class="project-name">${p.name}</h2>
      <p class="project-tagline">${p.tagline || ""}</p>
      <div class="modal-stack">${stack}</div>
      <p style="color:var(--text-muted);">${p.description || ""}</p>
      ${links ? `<div class="modal-links">${links}</div>` : ""}
    `;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (window.hljs) window.hljs.highlightAll();
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (card) openModal(Number(card.dataset.index));
  });
  grid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".project-card");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openModal(Number(card.dataset.index));
    }
  });

  modal.querySelectorAll("[data-close-modal]").forEach((el) =>
    el.addEventListener("click", () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  });
});

/* ============================================================
   Content protection — HONEST DETERRENTS ONLY.
   These discourage casual copying. They cannot and do not claim
   to block screenshots, screen recordings, or photos of the
   screen — that happens outside the browser and no website can
   stop it. See README for what this does and doesn't do.
   ============================================================ */
(function initContentProtection() {
  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest("img, .project-media")) e.preventDefault();
  });
  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });
})();
