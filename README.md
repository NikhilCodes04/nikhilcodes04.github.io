# nikhilcodes04.github.io

Personal portfolio for Nikhil Mittal, backend and AI engineer.

**Live:** https://nikhilcodes04.github.io

A single-page static site built with plain HTML, CSS and JavaScript. No
framework, no build step, no dependencies to install. Roughly 320&nbsp;KB total,
served straight from GitHub Pages.

---

## Overview

The site borrows its visual language from the engineering work it describes.
Query plans, syntax trees and service call-graphs are structures a backend
engineer works with daily, so the page uses them as layout rather than as
decoration.

**Hero.** A summary printed the way a query plan prints itself, alongside a
carousel of four systems drawn as diagrams: a boolean query AST, an LLM voice
pipeline, a database throughput fix, and service-to-service authorization. Each
diagram runs on a shared five-second cycle, with node highlights timed to a
packet's actual arrival along its path.

**Experience.** Rendered as a spine with a node per role. It is the one section
where chronology carries information, so it is the one section drawn as a
sequence.

**Section labels.** Each label states what a section is (`// newest first`,
`// open to roles`) rather than numbering sections that are not sequences.

---

## Running locally

Clone and serve. Any static server works:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`. There is nothing to install or compile.

When editing `styles.css`, hard-refresh (`Ctrl+Shift+R`) — stylesheets cache
aggressively.

---

## Structure

```
index.html      All content and markup
styles.css      Design tokens in :root, then section styles
script.js       Theme toggle, mobile menu, hero carousel, scroll reveals
icons/          15 technology logos, stored locally
img/            Portrait at two densities, plus the social preview image
```

### Design tokens

Colour, type scale and spacing are CSS custom properties declared once in
`:root`, with a `[data-theme="light"]` block overriding the palette. Changing
the accent colour is a two-line edit.

| Token | Dark | Light |
|---|---|---|
| Background | `#0b0d12` | `#f7f7f5` |
| Foreground | `#e8eaf0` | `#14161b` |
| Accent | `#ffb454` | `#8a5200` |

Type is [Archivo](https://fonts.google.com/specimen/Archivo) for display and
body, [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) for
labels, data and captions. Sizes use `clamp()` so they scale continuously with
the viewport instead of stepping at breakpoints.

---

## Accessibility and performance

- `prefers-reduced-motion` disables every animation and lands each element on
  its finished state.
- Hover styling is scoped to `@media (hover: hover) and (pointer: fine)`, so
  effects do not stick after a tap on touch devices.
- The hero carousel is a keyboard-navigable tablist: arrow keys move between
  diagrams, and focus pauses rotation.
- Interactive targets are at least 40&nbsp;px; safe-area insets are respected on
  notched devices.
- Technology logos are committed to the repository rather than loaded from a
  CDN, so the page has one external dependency: the Google Fonts stylesheet.
- Images are served at two densities via `srcset`.

---

## Deployment

GitHub Pages serves `main` from the repository root. Pushing deploys:

```bash
git push
```

`.nojekyll` tells Pages to serve the files as-is instead of processing them
through Jekyll.

The site is portable to any static host. On Vercel or Netlify, connect the
repository with no build command and `.` as the output directory.

---

## Assets

Portrait derivatives are generated from a single source image with ImageMagick:

```bash
magick source.png -crop 580x725+110+35 +repage -resize 640x800 -quality 82 img/portrait@2x.jpg
magick img/portrait@2x.jpg -resize 320x400 -quality 84 img/portrait.jpg
```

---

## Contact

- Email — nikhilmittal2004@gmail.com
- LinkedIn — [nikhilmittal11](https://linkedin.com/in/nikhilmittal11)
- GitHub — [NikhilCodes04](https://github.com/NikhilCodes04)
