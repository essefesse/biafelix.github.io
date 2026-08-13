# Bia Félix — Portfolio site

Single-page static portfolio. No build step, no dependencies. Open `index.html` to preview.

**Positioning:** Creator Growth Strategist & Marketing Leader — tailored for the Toptal *Talent Network Social Media Brand Strategist / Creator Agent* application.

---

## 1. Hosting on GitHub Pages

Recommended over Netlify Drop. The URL is tied to your GitHub username, so it can never expire or get reassigned to someone else's site (which is what happened to the old Netlify link: anonymous drops that are never claimed into an account get recycled).

**No terminal required:**

1. Create a new repository at github.com named exactly `biafelix.github.io`. That exact name is what gives you the clean URL.
2. Set it to **Public**, then create.
3. On the repo page, click **uploading an existing file**.
4. Drag the **contents** of this folder, not the folder itself: `index.html`, `style.css`, `script.js`, `.gitignore`, `README.md` and the `assets` folder. `index.html` must sit at the root.
5. Commit. The site is live at `https://biafelix.github.io` in a minute or two.

To update later: open the file on GitHub, click the pencil icon, edit, commit. Or drag new files through **Add file → Upload files**.

**Limits to know:** 100 MB per file, 1 GB recommended per repo. This folder is **3.1 MB**, so it uploads in one go with room to spare.

### If you'd rather stay on Netlify

Log in at <https://app.netlify.com> **first**, find the site under **Sites**, open **Deploys**, and drag the folder there. That keeps the same URL. Dragging onto `app.netlify.com/drop` while logged out creates a brand new anonymous site every time, which is the original problem.

Either way: **always upload the whole folder**, never `index.html` alone. On its own it loads with no CSS, no JS and no images.

---

## 2. Page structure

| # | Section | Purpose |
|---|---|---|
| — | Hero | Portrait + role labels: Creator · Growth strategist · Marketing leader · Systems builder |
| — | Proof bar | 100K+ followers · 15M+ views · #14 Spotify · 20K leads · 3 brand partnerships |
| 01 | About | Narrative arc: built audiences → monetized → advised → built systems → leads marketing |
| 02 | Case studies | Six cases, each: Challenge → Diagnosis → Strategy → Execution → Results → **What became repeatable** |
| — | Selected craft & recognition | TEMOS AI video · TEMOS mascot · UNESCO × Women@Dior · Vinte brand system |
| 03 | Brands & press | Logo marquee |
| 04 | Contact | Email + channel links |

### Case order (deliberate — it answers the recruiter's questions in sequence)

1. **20 e poucos** — can she grow an audience? (100K+ followers, #14 Spotify)
2. **Creator channels** — does she understand *why* content grows? (15M+ views, 79% non-follower reach)
3. **Brand partnerships** — can she monetize? (Disney, M·A·C, L'Occitane)
4. **Aptus** — can she build systems? (playbooks, editorial systems, AI workflows, 5 retained clients)
5. **TEMOS** — does content connect to business outcomes? (+30% traffic, +10% MoM revenue)
6. **Empowerment Lab** — can she brief and coach other creators? (20K qualified leads)

The **"What became repeatable"** block closing each case is the most important element for the Toptal application. It's what turns a portfolio of results into evidence that she can teach the method to someone else.

---

## 3. Missing asset (one)

| Filename | Used by | What to grab |
|---|---|---|
| `assets/work-creator.jpg` | Case 02 | Screenshot of your Instagram or TikTok grid, ideally with the view counts visible. **800 × 500 px or larger, landscape.** |

Every other image slot is filled. The slot hides itself gracefully if the file is missing, so the site works either way — but Case 02 is the creator-growth diagnostic, so a visual there is worth adding.

Optional, still unfilled from before: `assets/contact-video.mp4` and `assets/contact-poster.jpg`. Without them the contact section falls back to a black gradient, which looks fine.

---

## 4. Housekeeping (done)

The folder went from **76 MB to 3.1 MB**. Nothing visible changed.

- Deleted `assets/temos-brand-kit.mp4` (34 MB, no longer referenced), `PUT_IMAGES_HERE.txt` and the `.DS_Store` files. A `.gitignore` keeps `.DS_Store` from coming back.
- Resized every image to a sensible web size (1600 px on the long edge, 1920 px for the hero) at quality 82. `work-temos.jpg` alone went from 13.4 MB to 258 KB. All images together are now under 2 MB.
- Re-encoded `vinte-brand-kit.mp4` from 2940 px wide at 17 Mbps down to 1600 px at CRF 26, audio stripped since it plays muted. 17 MB to 928 KB.

If you ever replace an image, keep it around 1600 px wide and under ~400 KB. Anything larger is wasted on screen and just slows the page down.

---

## 5. Editing copy

Everything lives in `index.html`:

- **Proof bar numbers** → `proofbar__stats`
- **Hero role labels** → `orbit__text`
- **About narrative** → `about__body-p`, pull-quote in `about__aside-quote`
- **Case content** → search `Case 01`, `Case 02`, etc.
- **Case KPIs** → `case__kpis`
- **The repeatable-method blocks** → `case__step--repeatable`
- **Contact headline** → `contact__big`

Colors live in the `:root` block at the top of `style.css`.

---

## 6. Copy provenance

Every number traces to a verified source. Nothing invented:

- **20 e poucos:** 100K+ followers (IG + TikTok), 82K+ Spotify plays, 10.5K loyal listeners, #14 Top Education Podcasts / #90 overall (Spotify BR)
- **Creator channels:** 15M+ lifetime views, ~6.5M annual views, ~3M annual accounts reached, ~79% non-follower reach, multiple assets past 1M views
- **Partnerships:** The Walt Disney Company, M·A·C Cosmetics (Estée Lauder), L'Occitane en Provence; 90%+ view-to-visit on best paid run
- **Aptus:** 9,000+ professional audience, ~3.7% engagement, contributed to 5 major retained clients, Head of Marketing since Jun 2026
- **TEMOS:** 600K+ quarterly views, 270K+ quarterly accounts reached, ~80% non-follower reach, +30% weekend traffic month one, +10% MoM revenue, break-even ~month 7
- **Empowerment Lab:** 20,000 qualified leads
- **Vinte consulting:** Gen Z financial education product, +50% student adoption after repositioning
- **UNESCO × Women@Dior:** only Brazilian in cohort, Top-20 final project
