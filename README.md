# Your hbk.com Portfolio — Setup & Editing Guide

This is written for you, not a developer. There is no code in here you need to
understand. Two phases:

- **Phase 1 — One-time setup** (today): create two free accounts and click a
  few buttons. ~20 minutes. You will not write or edit any code.
- **Phase 2 — Day-to-day editing** (forever after): log into a private
  dashboard, fill in forms, click "Publish." That's it.

---

## Phase 1 — One-time setup

### Step 1: Unzip the file I gave you
Double-click the `.zip` file you downloaded. It'll create a folder called
`hbk-portfolio` with everything inside.

### Step 2: Create a free GitHub account
GitHub is just the storage locker your website lives in.
1. Go to **github.com** → "Sign up" → follow the prompts.
2. Once logged in, click the **+** icon top-right → **New repository**.
3. Name it `hbk-portfolio` (or anything you like) → set it to **Public** →
   click **Create repository**.

### Step 3: Upload your files to GitHub (no terminal, just drag-and-drop)
1. On your new repo's page, click **"uploading an existing file"** (or
   **Add file → Upload files**).
2. Open the `hbk-portfolio` folder you unzipped, select everything inside
   it (not the outer folder itself), and drag it into the browser window.
3. Scroll down, click **Commit changes**. Done — your files are now online.

### Step 4: Create a free Netlify account and connect it
Netlify is what actually turns your files into a live website.
1. Go to **netlify.com** → sign up using **"Sign up with GitHub"** (easiest —
   one click, no new password to remember).
2. Click **Add new site → Import an existing project → GitHub**.
3. Pick the `hbk-portfolio` repo you just created.
4. Leave all the build settings as they are (this site needs no build step)
   → click **Deploy site**.
5. After ~30 seconds, Netlify gives you a live link like
   `random-name-123.netlify.app`. Click it — your site is live.

### Step 5: Turn on your private dashboard (Identity + Git Gateway)
1. In Netlify, open your site → **Site configuration → Identity → Enable
   Identity**.
2. Still in Identity, scroll to **Services → Git Gateway → Enable Git
   Gateway**.
3. Go to **Identity → Invite users** → type in your own email → **Send**.
4. Check your email, click the invite link, set a password. This creates
   your login.

### Step 6: Log into your dashboard
1. Go to `your-site-name.netlify.app/admin`
2. Log in with the email + password from Step 5.
3. You'll see four sections on the left: **Site Settings, Skills,
   Education, Projects.** This is the dashboard you'll use forever — no
   code, ever.

### (Optional) Step 7: Point your real domain at it
Once you own `hbk.com`, go to **Site configuration → Domain management →
Add a custom domain** in Netlify and follow its instructions. You don't
need this to start editing — your `.netlify.app` link already works.

---

## Phase 2 — Editing your site (this is the part you'll actually use)

Every time you want to change anything:

1. Go to `your-site-name.netlify.app/admin` and log in.
2. Click the section you want:
   - **Site Settings** — your name, tagline, bio, email, location, social
     links, the 4 stat counters, your profile photo, your CV file.
   - **Skills** — add/remove skill categories and individual skills.
   - **Education** — your degree timeline and any certifications.
   - **Projects** — add a new project, edit an existing one, switch a
     project between "photo card" and "code snippet card," upload images,
     add links.
3. Make your changes in the form fields.
4. Click **Publish** (top right).
5. Wait about 60 seconds — Netlify rebuilds automatically — then refresh
   your live site to see the change.

You will never need to open a code editor, GitHub, or a terminal again
after Step 1 of Phase 1. Everything from here on is forms and buttons.

---

## What's still placeholder — replace these first

- **Site Settings**: name, tagline, bio, email, location, social links, CV
  file, profile photo — all currently dummy text.
- **Projects**: all 4 projects (ChronoMed, PID controller, AuroraNet,
  Fourier visualizer) are placeholder write-ups. The PID and Fourier
  snippets are real-ish example code, not your actual code — swap in your
  own once you have it.
- **Education**: university name and years are dummy values.

## What I assumed or simplified (flagging per your original spec)

- **Hero background**: a lightweight animated canvas "signal trace" instead
  of Three.js — same visual idea (and on-theme for an embedded/signals
  student), much lighter on mobile battery and load time.
- **Smooth scroll**: uses Lenis (as you asked), with a safe native fallback.
- **Content protection**: right-click/drag disabled on images, plus a
  custom print message. I did **not** add devtools-detection/blanking —
  it's easy to add later, but it has a real risk of false-triggering and
  locking out legitimate visitors, so I left it out by default. Say the
  word if you still want it.
- **No screenshot-proofing claim anywhere** — as you asked, nothing in the
  UI or this README claims to block screenshots or recordings, because
  nothing actually can.
- **Contact form**: currently a clean `mailto:` link, not a hosted form
  service (Formspree/EmailJS), since you hadn't confirmed which. Tell me
  if you want a real form wired in — it's a small addition.

## File map (for your reference only — you never need to open these)

```
hbk-portfolio/
├── index.html          → the page itself
├── css/style.css        → all styling
├── js/render.js          → pulls your dashboard content into the page
├── js/animations.js      → scroll reveals, hero canvas, counters
├── js/main.js            → nav, theme toggle, project filter/modal
├── content/*.json        → your actual content (edited via the dashboard, not by hand)
├── admin/                → the dashboard itself (config.yml + index.html)
└── assets/images/        → where your uploaded photos land
```
