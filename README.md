# Portfolio, Nikhil Mittal

Single-page personal site. Plain HTML, CSS and JavaScript. No build step, no npm,
no framework.

**Live:** https://nikhilcodes04.github.io

## Run it

Open `index.html` in a browser, or serve it locally:

```bash
python -m http.server 8000
# or
npx serve .
```

Hard-refresh after editing CSS (`Ctrl+Shift+R`). The stylesheet caches aggressively.

## Files

| Path | What's in it |
|---|---|
| `index.html` | All content. This is the file you edit |
| `styles.css` | Design tokens at the top (`:root`), then section styles |
| `script.js` | Theme toggle, mobile menu, hero carousel, scroll reveals, active nav |
| `icons/` | 15 tech logos, stored locally so nothing depends on a CDN |
| `img/` | Portrait at two sizes plus the social preview image |
| `Nikhil_Mittal_Resume.pdf` | Linked from the hero and contact section |

## Design

**Type:** Archivo for display and body, IBM Plex Mono for labels, data and captions.

**Colour:** cool ink (`#0b0d12`) with a single amber accent (`#ffb454`), the colour
a query planner highlights cost in. Light theme darkens the amber hard to
`#8a5200` to stay legible on paper. All colour lives in `:root`, so changing the
accent is three lines.

**The idea:** the page borrows its structure from the work. Nikhil rebuilt a
ClickHouse query engine from flat AND-filters into a nested AST, so trees, plans
and flows are the visual language rather than decoration.

- The hero **plan block** prints his position the way a query plan prints itself.
- The hero **carousel** draws four real systems: the query AST, the Aayu Mitra
  voice pipeline, the PostgreSQL throughput fix, and service authorization.
  Each runs on the same 5s bar, with node highlights timed to the packet's
  actual arrival along the path.
- **Experience** is the one section that is genuinely a sequence, so it is the
  one section drawn as one: a spine with a node per role, only the current
  role filled.
- Section labels say what a section *is* (`// newest first`, `// open to roles`)
  instead of numbering things that are not sequences.

## Content order

Sections run **backend, then AI, then frontend**, deliberately:

- **Experience** newest first, which is also backend first.
- **Work** leads with Aayu Mitra (LLM backend), then Wired (APIs), then
  30 Days of Code.
- **Stack** groups: Backend, Databases, AI engineering, Frontend & Tooling,
  Core CS.

Keep that order if you add anything.

## Accessibility and motion

- Every hover effect is wrapped in `@media (hover: hover)` so nothing sticks
  after a tap on a touchscreen.
- `prefers-reduced-motion` disables all animation, hides the travelling packets
  and lands the portrait on its finished state.
- Tap targets are 40 to 46px minimum.
- Notches and home indicators handled via `env(safe-area-inset-*)`.
- The carousel is a real tablist: arrow keys work, focus pauses rotation.

## Still to fill in

- **Wired live URL**: the `Live` link is `href="#"`. Point it at the deployment.
- **Project repos**: the `Source` links go to the GitHub profile root, not the
  individual repos.
- **30 Days of Code**: written up from the Microsoft Learn Student Chapter bullet
  on the resume. Check the year (2023 is a guess).
- **Resume PDF** still contains a phone number, and it is publicly downloadable
  from the live site. Swap in a phone-free export if that matters.
- **RAG, agents, vector search and function calling** appear in Focus and the
  Stack section but are not on the resume. Worth adding there so the two
  documents agree.

## Deploy

Static files, so anything works. Currently GitHub Pages:

```bash
git push
```

Pages serves `main` at the repo root. `.nojekyll` stops GitHub running the files
through Jekyll.

For Vercel or Netlify instead: connect the repo, no build command, output
directory `.`.

## Notes

- Fonts load from Google Fonts, the only external request. To go fully offline,
  self-host them and drop the `<link>` tags in `<head>`.
- Fluid type via `clamp()`, so it scales smoothly instead of snapping at
  breakpoints.
- `Profile_Photo.png` is gitignored: it is the 1.3MB source for `img/portrait*.jpg`
  and the site never loads it. Regenerate the derivatives with:

  ```bash
  magick Profile_Photo.png -crop 580x725+110+35 +repage -resize 640x800 -quality 82 img/portrait@2x.jpg
  magick img/portrait@2x.jpg -resize 320x400 -quality 84 img/portrait.jpg
  ```
