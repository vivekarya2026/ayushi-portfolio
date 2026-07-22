# Ayushi Dubey — Portfolio

Graphic-designer portfolio built with **Next.js (App Router) + TypeScript + Tailwind v4**,
shipped as a **static export** and hosted on **GitHub Pages**.

- **Live site:** https://vivekarya2026.github.io/ayushi-portfolio/
- **Repo:** https://github.com/vivekarya2026/ayushi-portfolio

The site is 100% static — no server or database at runtime. The contact form posts to
[Web3Forms](https://web3forms.com). Content lives in plain TypeScript files
(`content/projects.ts`, `content/copy.ts`). An **optional** Supabase + Tiptap CMS lives in
[`cms/`](./cms) for anyone who prefers a visual admin over editing files (see
[Content & the CMS](#content--the-cms)).

---

## 1. Run it locally

**Requirements:** Node ≥ 20 and npm.

```bash
# clone
git clone https://github.com/vivekarya2026/ayushi-portfolio.git
cd ayushi-portfolio

# install + run the dev server
npm install
npm run dev
```

Open **http://localhost:3000**.

> In dev the site is served from `/`. In production (GitHub Pages) it's served from
> `/ayushi-portfolio/`, so the build adds a `basePath`. That switch is automatic — you don't
> need to do anything locally.

**Other scripts**

```bash
npm run build     # static export → ./out  (served from "/")
npm run lint      # eslint
npx tsc --noEmit  # type-check
```

---

## 2. Deploy (automatic)

Every push to **`main`** triggers [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml),
which builds the static export with the Pages `basePath` and publishes `./out` to GitHub Pages.

```
git push origin main  →  GitHub Actions builds  →  https://vivekarya2026.github.io/ayushi-portfolio/
```

Nothing else to configure — Pages is already set to the **GitHub Actions** source. To watch a
deploy: repo → **Actions** tab, or `gh run watch`.

**Moving to a custom domain later** (e.g. `ayushidubey.com`) removes the sub-path, so you'd:
1. set the domain in repo → Settings → Pages,
2. drop the `basePath` (the `GITHUB_PAGES` branch in `next.config.ts`), and
3. update `NEXT_PUBLIC_SITE_URL` used by `metadataBase` in `app/layout.tsx`.

---

## 3. Edit content (the simple way)

No CMS required — the site's content is just typed data:

| What | File |
|---|---|
| Projects / case studies | `content/projects.ts` |
| All page copy (two-voice) | `content/copy.ts` |
| Images | `public/images/…` |
| Résumé PDF | add `public/resume.pdf` (the Resume links expect it) |

Edit a file, commit, push → the site redeploys. This is the recommended workflow for a
one-person portfolio.

---

## Content & the CMS

`cms/` is a **standalone** Next.js + **Supabase** + **Tiptap** admin panel (a visual way to manage
Projects, a Blog, and Categories). It runs independently of the public site.

> **Heads-up on the current wiring:** the live site reads the static `content/*.ts` files above,
> **not** Supabase. The CMS is included as a ready-to-use authoring tool, but the step that feeds
> CMS content back into the site is **not connected yet** — see
> [Wiring the CMS into the site](#wiring-the-cms-into-the-site). Until then, treat `content/*.ts`
> as the source of truth and use the CMS for drafting/managing content in Supabase.

### 4. Set up the CMS + Supabase

**a. Create a Supabase project** at https://supabase.com → from **Settings → API**, note:
- `Project URL`
- `anon` public key
- `service_role` key (server-only — never expose to the browser)

**b. Configure env.** In `cms/`, copy the template and fill it in:

```bash
cd cms
cp .env.example .env.local
```

`.env.local` (never commit this — it's git-ignored):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# optional: Resend for the contact email, revalidate secret, etc. (see .env.example)
```

**c. Create the database schema.** Run the SQL migrations in
[`cms/supabase/migrations/`](./cms/supabase/migrations) **in order** (they create the `categories`,
`projects`, `posts`, and `settings` tables + row-level-security + the storage bucket). Two ways:

- **Supabase Studio:** open each `*.sql` file in order (`0001_…`, `0002_…`, `0003_…`) and run it in
  the SQL Editor, **or**
- **Supabase CLI:**
  ```bash
  npm i -g supabase
  supabase link --project-ref YOUR_PROJECT_REF
  supabase db push
  ```

**d. Create the admin login.** In Supabase → **Authentication → Users → Add user**, create one
email/password user (the CMS is single-admin, gated by `cms/middleware.ts`).

**e. Run the CMS:**

```bash
cd cms
npm install
npm run dev
```

Open **http://localhost:3000/admin**, sign in, and manage Projects / Blog / Categories.

### 5. Updating Supabase content

- **Add / edit a project:** `/admin/projects` → create or open an item → edit fields + rich-text
  body (Tiptap) → upload images (stored in the Supabase `media` bucket) → **Publish**.
- **Categories & blog:** `/admin/categories`, `/admin/blog`.
- **Schema changes:** add a new `cms/supabase/migrations/00xx_*.sql` file and run it (Studio or
  `supabase db push`). Keep migrations append-only and in order.
- **Seed from the old site (optional):** `cms/scripts/migrate-webflow.ts` parses a Webflow export
  into Supabase — run with `.env.local` set (`npx tsx scripts/migrate-webflow.ts`).

### Wiring the CMS into the site

To make the public site read from the CMS instead of `content/projects.ts`, pick one:

1. **Build-time generation (fits this static site best):** a script reads Supabase and writes
   `content/projects.ts` (or a JSON file the site imports) during the build, then the normal
   `export` runs. Trigger a rebuild on publish via a Supabase webhook → GitHub
   `repository_dispatch` → the deploy workflow.
2. **Runtime fetch + ISR:** switch off `output: "export"`, host on Vercel, and fetch published rows
   from Supabase with revalidation. Instant edits without a redeploy, but drops the free GitHub
   Pages hosting.

The current `Project` shape (`content/types.ts`) has fields the CMS schema doesn't yet
(`theme` card colour, `role`, `tools`, the `overview` challenge/approach/outcome triad,
multi-category, `secondaryImage`) — extend the Supabase schema and the generator/mapper to cover
them when you do this step.

---

## Project structure

```
app/                 # routes: /, /work, /work/[slug], /about, /contact
components/          # UI (home sections, project cards, navbar, footer, forms)
content/             # projects.ts, copy.ts, types.ts  ← site content
lib/                 # helpers (base-path, image-loader, motion)
public/              # images, fonts, lottie
.github/workflows/   # deploy.yml (GitHub Pages)
next.config.ts       # static export + Pages basePath
cms/                 # optional Supabase + Tiptap admin (standalone)
```
