# Your hbk.com Portfolio — Setup & Editing Guide (v2 — flat file version)

**What changed from before:** your files are now one flat pile — no folders
at all. This is on purpose: GitHub's drag-and-drop upload button flattens
folders anyway (that's what caused the build error and the missing admin
page last time), so this version is built to match exactly what that
upload actually does. No more fighting it.

---

## Fixing your current repo

You already have a partial, broken upload sitting in your GitHub repo. Clear
it out and start fresh with this version:

1. Go to your repo on github.com.
2. Click into each file → click the trash/delete icon (top right of the file
   view) → commit the deletion. Or faster: click **Add file → Upload files**,
   then on that same page, select all the old files shown and remove them —
   if that option isn't visible, just delete them one by one (there are
   only ~11).
3. Once the repo is empty again: unzip the new file I'm giving you, open
   that folder, select **everything inside it** (Ctrl+A), and drag it all
   into GitHub's upload box in one go.
4. Scroll down, click **Commit changes**.
5. Go to your repo's main page and confirm you now see ~12 files, all
   sitting at the top level — no subfolders, nothing nested.

## Fixing the Netlify build error

The earlier "cecil" error was Netlify guessing the wrong tool because of
folder names that no longer exist. Clear that guess out:

1. In Netlify: your site → **Site configuration → Build & deploy →
   Continuous deployment → Build settings → Edit settings**.
2. **Build command** → delete everything in that box, leave it empty.
3. **Publish directory** → delete everything in that box, leave it empty
   (or type a single period: `.`)
4. Click **Save**.
5. Go to the **Deploys** tab → **Trigger deploy → Clear cache and deploy
   site**.
6. This time it should skip straight to "Deploying" and finish in under a
   minute. Click the live link it gives you to confirm the site loads.

---

## Turning on your private dashboard (same as before, one path changed)

1. Site configuration → **Identity → Enable Identity**.
2. Same page → **Services → Git Gateway → Enable Git Gateway**.
3. **Identity → Invite users** → enter your own email → Send.
4. Check your email, click the link, set a password.
5. Go to `your-site-name.netlify.app/admin.html` *(note: `.html` at the
   end — there's no `/admin/` folder anymore, just one file)*.
6. Log in. You'll see **Site Settings, Skills, Education, Projects** on the
   left — this is your editing dashboard, forever.

## Editing your site from now on

1. Visit `your-site-name.netlify.app/admin.html`, log in.
2. Click a section, edit the fields, click **Publish** (top right).
3. Wait ~60 seconds, refresh your live site.

Nothing below this line ever needs to be opened by you — it's here only so
you know what each piece does if you're curious.

```
index.html      → the page itself
style.css       → all the styling
render.js       → pulls your dashboard content into the page
animations.js   → scroll reveals, hero canvas, counters
main.js         → nav, theme toggle, project filter/modal
settings.json   → your bio/contact/stats (edited via the dashboard)
skills.json     → your skills list (edited via the dashboard)
education.json  → your education timeline (edited via the dashboard)
projects.json   → your projects (edited via the dashboard)
admin.html      → loads your dashboard
config.yml      → tells the dashboard what fields to show
```

## Still placeholder — replace these from the dashboard once you're in

Name, tagline, bio, email, social links, CV, profile photo, all 4 sample
projects, and your university/degree details. See the previous message for
the full list of simplifications made (lightweight canvas hero instead of
Three.js, no devtools-blanking, mailto contact instead of a hosted form).
