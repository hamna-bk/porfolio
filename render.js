/* ============================================================
   render.js
   Fetches the 4 content files (edited via /admin) and fills in
   every section of the page. Runs before animations.js so reveal
   animations have real content to animate.
   ============================================================ */

const SITE = {}; // populated below, used by main.js / animations.js too

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function renderPersonal(settings) {
  if (!settings) return;
  SITE.settings = settings;

  document.getElementById("hero-name-text").textContent = settings.displayName || "HBK";
  document.getElementById("hero-tagline").textContent = settings.tagline || "";
  document.getElementById("footer-name").textContent = settings.displayName || "HBK";

  // CV buttons — hide entirely if disabled or no file uploaded yet
  const cvButtons = [document.getElementById("nav-cv"), document.getElementById("hero-cv")];
  cvButtons.forEach((btn) => {
    if (settings.resumeEnabled && settings.resumeFile) {
      btn.href = settings.resumeFile;
      btn.style.display = "";
    } else {
      btn.style.display = "none";
    }
  });

  // Bio
  const bioWrap = document.getElementById("about-bio");
  bioWrap.innerHTML = "";
  (settings.bio || []).forEach((p) => bioWrap.appendChild(el("p", null, p.text)));

  // Avatar — real photo if uploaded, otherwise initials monogram
  const avatarFrame = document.getElementById("avatar-frame");
  if (settings.avatarImage) {
    avatarFrame.innerHTML = `<img src="${settings.avatarImage}" alt="${settings.fullName || "Profile photo"}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
  } else {
    avatarFrame.textContent = (settings.displayName || "HBK").slice(0, 4);
  }

  // Stats
  const statsGrid = document.getElementById("stats-grid");
  statsGrid.innerHTML = "";
  (settings.stats || []).forEach((s) => {
    const card = el("div", "stat");
    card.appendChild(el("div", "stat-value", `<span data-count="${s.value}">0</span>${s.suffix || ""}`));
    card.appendChild(el("div", "stat-label", s.label));
    statsGrid.appendChild(card);
  });

  // Social — hero icons + contact section
  const socialLinks = [];
  if (settings.githubUrl) socialLinks.push({ label: "GitHub", url: settings.githubUrl });
  if (settings.linkedinUrl) socialLinks.push({ label: "LinkedIn", url: settings.linkedinUrl });
  if (settings.email) socialLinks.push({ label: "Email", url: `mailto:${settings.email}` });

  const heroSocial = document.getElementById("hero-social");
  heroSocial.innerHTML = socialLinks.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join("");

  const contactSocial = document.getElementById("contact-social");
  contactSocial.innerHTML = socialLinks
    .filter((s) => s.label !== "Email")
    .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
    .join("");

  const contactEmail = document.getElementById("contact-email");
  if (settings.email) {
    contactEmail.href = `mailto:${settings.email}`;
    contactEmail.textContent = settings.email;
  }

  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

function renderSkills(data) {
  if (!data) return;
  const grid = document.getElementById("skills-grid");
  grid.innerHTML = "";
  (data.skillGroups || []).forEach((group) => {
    const card = el("div", "skill-card");
    card.appendChild(el("h3", null, group.category));
    const chips = el("div", "skill-chips");
    (group.items || []).forEach((i) => chips.appendChild(el("span", "skill-chip", i.item)));
    card.appendChild(chips);
    grid.appendChild(card);
  });
}

function renderEducation(data) {
  if (!data) return;
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";
  (data.education || []).forEach((ed) => {
    const item = el("div", "timeline-item");
    item.innerHTML = `
      <div class="timeline-years">${ed.years || ""}</div>
      <h3 class="timeline-degree">${ed.degree || ""}</h3>
      <div class="timeline-school">${ed.school || ""}</div>
      ${ed.details ? `<p class="timeline-details">${ed.details}</p>` : ""}
    `;
    timeline.appendChild(item);
  });

  // Achievements get appended into the same section if present
  if (data.achievements && data.achievements.length) {
    const wrap = document.getElementById("education").querySelector(".section-title");
    const achWrap = el("div", "skills-grid"); // reuse the chip-card look
    data.achievements.forEach((a) => {
      const card = el("div", "skill-card");
      card.innerHTML = `<h3>${a.title}${a.year ? " · " + a.year : ""}</h3>${a.note ? `<p style="color:var(--text-muted);font-size:0.9rem;margin:0;">${a.note}</p>` : ""}`;
      achWrap.appendChild(card);
    });
    wrap.insertAdjacentElement("afterend", achWrap);
  }
}

function projectMediaHTML(p) {
  if (p.cardType === "code" && p.codeSnippet) {
    const lang = p.codeLanguage || "plaintext";
    return `
      <div class="project-media is-code">
        <pre><code class="language-${lang}">${escapeHTML(p.codeSnippet)}</code></pre>
      </div>`;
  }
  if (p.image) {
    return `<div class="project-media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>`;
  }
  return `<div class="project-media is-code"><span style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.8rem;">No image uploaded yet — add one from the dashboard.</span></div>`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderProjects(data) {
  if (!data) return;
  SITE.projects = data.projects || [];
  const grid = document.getElementById("projects-grid");
  const filterBar = document.getElementById("filter-bar");
  grid.innerHTML = "";

  // Build filter buttons from categories actually in use
  const categories = ["All", ...new Set(SITE.projects.map((p) => p.category).filter(Boolean))];
  filterBar.innerHTML = categories
    .map((c, i) => `<button class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${c}">${c}</button>`)
    .join("");

  SITE.projects.forEach((p, idx) => {
    const card = el("div", `project-card${p.featured ? " is-featured" : ""}`);
    card.dataset.category = p.category || "";
    card.dataset.index = idx;
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${p.name}`);
    card.innerHTML = `
      ${projectMediaHTML(p)}
      <div class="project-body">
        <div class="project-tag">${p.category || ""}</div>
        <h3 class="project-name">${p.name}</h3>
        <p class="project-tagline">${p.tagline || ""}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  if (window.hljs) window.hljs.highlightAll();
}

document.addEventListener("DOMContentLoaded", async () => {
  const [settings, skills, education, projects] = await Promise.all([
    loadJSON("settings.json"),
    loadJSON("skills.json"),
    loadJSON("education.json"),
    loadJSON("projects.json"),
  ]);

  renderPersonal(settings);
  renderSkills(skills);
  renderEducation(education);
  renderProjects(projects);

  document.dispatchEvent(new CustomEvent("content:ready"));
});
