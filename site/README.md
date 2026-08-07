# Site source

The deskdrawer.pages.dev website. Content lives here; **`../docs/` is generated output** and is
committed so Cloudflare Pages can serve it with no build step and no deployment configuration.

```bash
node site/build.mjs     # regenerate ../docs
node site/check.mjs     # validate the output — fails on dead links, bad JSON-LD, missing metadata
python site/tools/gen-icons.py   # regenerate favicons and social cards (needs Pillow)
```

Or, from this directory, `npm run build`, `npm run check`, `npm run serve`.

## Why it works this way

No framework, no npm dependencies, no build step on the server. The generator is ~400 lines of
plain Node; the output is plain HTML, CSS and one small progressive-enhancement script. Pushing to
`main` deploys, because Cloudflare Pages is only ever serving files that are already in the repo.

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
