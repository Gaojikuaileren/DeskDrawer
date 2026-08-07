# Site source

The deskdrawer.pages.dev website. Content lives here; **`../docs/` is generated output** and is
committed so Cloudflare Pages can serve it with no build step and no deployment configuration.

```bash
node site/build.mjs     # regenerate ../docs
node site/check.mjs     # validate the output — fails on dead links, bad JSON-LD, missing metadata
python site/tools/gen-icons.py   # regenerate favicons and social cards (needs Pillow)
```

Or, from this directory, `npm run build`, `npm run check`, `npm run serve`.

## Deploying

**Pushing to GitHub does not deploy the site.** The Cloudflare Pages project `deskdrawer` is a
*direct upload* project — `wrangler pages project list` shows `Git Provider: No` — so nothing
watches this repository. A push updates the source of truth and nothing else.

To publish:

```bash
node site/build.mjs && node site/check.mjs
npx wrangler pages deploy docs --project-name=deskdrawer --branch=main --commit-dirty=true
```

`--branch=main` is what makes it a **Production** deployment rather than a preview; the
`<hash>.deskdrawer.pages.dev` URL wrangler prints is the immutable alias for that deployment, and
production deployments get one too, so seeing it does not mean the deploy went to a preview.

Cloudflare's edge may serve the previous response for a minute or two on paths that were requested
recently. Appending a throwaway query string (`?cb=1`) bypasses that and shows the truth.

## Why it works this way

No framework, no npm dependencies, no build step on the server. The generator is ~450 lines of
plain Node; the output is plain HTML, CSS and one small progressive-enhancement script. The
committed `docs/` directory is exactly what gets uploaded, so what you review is what ships.

## Layout

```
site/
  build.mjs            entry point — assembles pages, writes docs/
  check.mjs            post-build validation
  lib/md.mjs           small Markdown subset + heading/TOC extraction
  lib/layout.mjs       the HTML shell: head, metadata, JSON-LD, nav, footer
  assets/              site.css, site.js — copied to docs/assets/
  content/
    site.mjs           every fact that appears in more than one place
    docs.mjs           documentation pages
    faq.mjs            questions and answers (rendered onto ONE hub page)
    glossary.mjs       defined terms — one page each
    notes.mjs          engineering notes
    releases.mjs       release history
    pages.mjs          homepage, hubs and standalone pages
  tools/gen-icons.py   favicon / PWA icon / Open Graph card generation
```

## Editing rules

- **Cross-reference with `[[slug]]`.** It resolves against glossary terms, doc pages, notes,
  standalone pages and FAQ anchors, in that order. `[[slug|custom label]]` overrides the text.
  An unresolvable reference **fails the build** rather than shipping a dead link.
- **FAQ answers do not get their own pages.** They render as anchored entries on `/faq/`. A
  question that needs more than a few paragraphs belongs in `docs/` instead.
- **Facts live in `content/site.mjs`.** Version, URLs, requirements. Changing the origin there
  moves canonicals, sitemap, RSS, JSON-LD and llms.txt together.
- **Run `check.mjs` before committing.** It is the only thing standing between a typo and a
  broken link in production.

## Regenerating after a release

1. Bump `version` and `released` in `content/site.mjs`.
2. Add the release to `content/releases.mjs` (date from the commit that shipped it).
3. `node site/build.mjs && node site/check.mjs`, then commit `docs/`.
