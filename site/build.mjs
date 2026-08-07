/**
 * DeskDrawer site builder.
 *
 * Reads the content modules in site/content/, renders every page through the shared
 * layout, and writes plain static files into docs/ — which is exactly what Cloudflare
 * Pages serves. There is no runtime framework and no npm dependency: the output is the
 * artefact, it is committed, and the deployment configuration never has to change.
 *
 *     node site/build.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SITE, url, OG_BY_SECTION } from "./content/site.mjs";
import { md, plain, esc, slugify } from "./lib/md.mjs";
import { shell, MARK, ICONS } from "./lib/layout.mjs";

import { DOC_GROUPS } from "./content/docs.mjs";
import { FAQ_CATEGORIES, FAQS } from "./content/faq.mjs";
import { TERMS } from "./content/glossary.mjs";
import { NOTES } from "./content/notes.mjs";
import { RELEASES } from "./content/releases.mjs";
import { buildPages } from "./content/pages.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const OUT = path.join(ROOT, "docs");
const MANIFEST = path.join(OUT, ".build-manifest.json");

const written = new Set();

function write(rel, content) {
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
  written.add(rel.replace(/\\/g, "/"));
}

const DOCS = DOC_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.title })));
const TERM_BY_SLUG = new Map(TERMS.map((t) => [t.slug, t]));
const FAQ_BY_SLUG = new Map(FAQS.map((f) => [f.slug, f]));
const DOC_BY_SLUG = new Map(DOCS.map((d) => [d.slug, d]));
const NOTE_BY_SLUG = new Map(NOTES.map((n) => [n.slug, n]));

/** Standalone pages that content can link to by slug. */
const PAGE_REFS = new Map(
  Object.entries({
    features: ["/features/", "Features"],
    download: ["/download/", "Download DeskDrawer"],
    compare: ["/compare/", "Why DeskDrawer"],
    about: ["/about/", "About the developer"],
    roadmap: ["/roadmap/", "Roadmap"],
    privacy: ["/privacy/", "Privacy policy"],
    support: ["/support/", "Support"],
    changelog: ["/changelog/", "Release notes"],
    faq: ["/faq/", "Questions & answers"],
    glossary: ["/glossary/", "Glossary"],
    notes: ["/notes/", "Engineering notes"],
  })
);

/* ------------------------------------------------------------------ helpers */

/**
 * Resolve `[[slug]]` cross-references against every content collection, so an author can
 * link a glossary term, a doc page, a note or a question without knowing its URL.
 *
 * FAQ entries resolve to an anchor on the single FAQ hub rather than to a page of their
 * own: a two-paragraph answer does not warrant its own URL, and a hundred such pages
 * would compete with the documentation that actually explains the subject.
 *
 * An unresolved reference fails the build rather than shipping a dead link.
 */
function resolveRefs(source, where) {
  return String(source).replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, slug, label) => {
    if (TERM_BY_SLUG.has(slug)) return `[${label || TERM_BY_SLUG.get(slug).term}](/glossary/${slug}/)`;
    if (DOC_BY_SLUG.has(slug)) return `[${label || DOC_BY_SLUG.get(slug).nav || DOC_BY_SLUG.get(slug).title}](/docs/${slug}/)`;
    if (NOTE_BY_SLUG.has(slug)) return `[${label || NOTE_BY_SLUG.get(slug).title}](/notes/${slug}/)`;
    if (PAGE_REFS.has(slug)) {
      const [href, name] = PAGE_REFS.get(slug);
      return `[${label || name}](${href})`;
    }
    if (FAQ_BY_SLUG.has(slug)) return `[${label || FAQ_BY_SLUG.get(slug).q}](/faq/#${slug})`;
    throw new Error(`Unresolved [[${slug}]] reference in ${where}`);
  });
}

const fmtDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

function tocHtml(toc) {
  if (toc.length < 3) return "";
  return `<nav class="doc-toc" aria-label="On this page"><h2>On this page</h2>${toc
    .map((t) => `<a class="lvl-${t.level}" href="#${t.id}">${esc(t.text)}</a>`)
    .join("")}</nav>`;
}

function docSidebar(activeSlug) {
  return `<nav class="doc-side" aria-label="Documentation">${DOC_GROUPS.map(
    (g) =>
      `<h2>${esc(g.title)}</h2>${g.items
        .map(
          (it) =>
            `<a href="/docs/${it.slug}/"${it.slug === activeSlug ? ' class="is-active" aria-current="page"' : ""}>${esc(
              it.nav || it.title
            )}</a>`
        )
        .join("")}`
  ).join("")}</nav>`;
}

function relatedBlock(title, links) {
  const unique = links.filter((l, i, a) => l && a.findIndex((x) => x.href === l.href) === i);
  if (!unique.length) return "";
  return `<section class="related"><h2>${esc(title)}</h2><ul>${unique
    .map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`)
    .join("")}</ul></section>`;
}

function pagerBlock(prev, next) {
  if (!prev && !next) return "";
  const cell = (p, dir, cls) =>
    p
      ? `<a class="${cls}" href="${p.href}"><div class="dir">${dir}</div><div class="t">${esc(p.label)}</div></a>`
      : `<span></span>`;
  return `<nav class="pager" aria-label="Pagination">${cell(prev, "Previous", "prev")}${cell(next, "Next", "next")}</nav>`;
}

/** Standard prose page header: title, lede, and a metadata line. */
function docHeader({ title, lede, meta }) {
  return (
    `<h1>${esc(title)}</h1>` +
    (lede ? `<p class="lede">${esc(lede)}</p>` : "") +
    (meta?.length ? `<div class="meta">${meta.map((m) => `<span>${m}</span>`).join("")}</div>` : "")
  );
}

/* ------------------------------------------------------------------ page collection */

const pages = [];
const add = (p) => { pages.push(p); return p; };

/* ---- documentation ---- */
DOCS.forEach((doc, n) => {
  const { html, toc } = md(resolveRefs(doc.body, `docs/${doc.slug}`));
  const prev = DOCS[n - 1];
  const next = DOCS[n + 1];

  add({
    path: `docs/${doc.slug}/`,
    title: doc.title,
    description: doc.description,
    section: "docs",
    updated: doc.updated || SITE.updated,
    crumbs: [{ name: "Documentation", href: "/docs/" }, { name: doc.nav || doc.title, href: `/docs/${doc.slug}/` }],
    sidebar: docSidebar(doc.slug),
    aside: tocHtml(toc),
    body:
      docHeader({
        title: doc.title,
        lede: doc.description,
        meta: [doc.group, `Updated ${fmtDate(doc.updated || SITE.updated)}`, `DeskDrawer ${SITE.version}`],
      }) +
      html +
      relatedBlock(
        "Related",
        (doc.related || []).map((s) => {
          if (DOC_BY_SLUG.has(s)) return { href: `/docs/${s}/`, label: DOC_BY_SLUG.get(s).title };
          if (TERM_BY_SLUG.has(s)) return { href: `/glossary/${s}/`, label: TERM_BY_SLUG.get(s).term };
          if (NOTE_BY_SLUG.has(s)) return { href: `/notes/${s}/`, label: NOTE_BY_SLUG.get(s).title };
          if (PAGE_REFS.has(s)) return { href: PAGE_REFS.get(s)[0], label: PAGE_REFS.get(s)[1] };
          if (FAQ_BY_SLUG.has(s)) return { href: `/faq/#${s}`, label: FAQ_BY_SLUG.get(s).q };
          throw new Error(`Unknown related slug "${s}" in docs/${doc.slug}`);
        })
      ) +
      pagerBlock(
        prev && { href: `/docs/${prev.slug}/`, label: prev.title },
        next && { href: `/docs/${next.slug}/`, label: next.title }
      ),
    schema: {
      "@type": "TechArticle",
      "@id": `${url(`docs/${doc.slug}/`)}#article`,
      headline: doc.title,
      description: doc.description,
      articleSection: doc.group,
      author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
      publisher: { "@id": `${SITE.origin}/#organization` },
      dateModified: doc.updated || SITE.updated,
      isPartOf: { "@id": `${SITE.origin}/docs/#webpage` },
      about: { "@id": `${SITE.origin}/#software` },
      inLanguage: "en",
      proficiencyLevel: doc.level || "Beginner",
    },
    plain: plain(doc.body),
  });
});

/* ---- FAQ ----
   Deliberately NOT one page per question. Every answer lives on the single /faq/ hub,
   grouped by topic and addressable by anchor. See resolveRefs() above. */

/* ---- glossary ---- */
TERMS.forEach((t) => {
  const body = resolveRefs(t.body, `glossary/${t.slug}`);
  const { html, toc } = md(body);

  add({
    path: `glossary/${t.slug}/`,
    title: t.term,
    metaTitle: `${t.term} — DeskDrawer glossary`,
    description: t.short,
    section: "glossary",
    updated: t.updated || SITE.updated,
    crumbs: [{ name: "Glossary", href: "/glossary/" }, { name: t.term, href: `/glossary/${t.slug}/` }],
    aside: tocHtml(toc),
    body:
      docHeader({
        title: t.term,
        meta: ["DeskDrawer glossary", `Updated ${fmtDate(t.updated || SITE.updated)}`].concat(
          t.aka?.length ? [`Also called: ${esc(t.aka.join(", "))}`] : []
        ),
      }) +
      `<aside class="callout callout-key"><p class="callout-t">Definition</p><p>${esc(t.short)}</p></aside>` +
      html +
      relatedBlock(
        "Related terms",
        (t.related || []).map((s) => {
          if (TERM_BY_SLUG.has(s)) return { href: `/glossary/${s}/`, label: TERM_BY_SLUG.get(s).term };
          if (DOC_BY_SLUG.has(s)) return { href: `/docs/${s}/`, label: DOC_BY_SLUG.get(s).title };
          if (NOTE_BY_SLUG.has(s)) return { href: `/notes/${s}/`, label: NOTE_BY_SLUG.get(s).title };
          if (PAGE_REFS.has(s)) return { href: PAGE_REFS.get(s)[0], label: PAGE_REFS.get(s)[1] };
          if (FAQ_BY_SLUG.has(s)) return { href: `/faq/#${s}`, label: FAQ_BY_SLUG.get(s).q };
          throw new Error(`Unknown related slug "${s}" in glossary/${t.slug}`);
        })
      ) +
      `<p style="margin-top:36px"><a class="btn btn-ghost btn-sm" href="/glossary/">← Full glossary</a></p>`,
    schema: {
      "@type": "DefinedTerm",
      "@id": `${url(`glossary/${t.slug}/`)}#term`,
      name: t.term,
      description: t.short,
      ...(t.aka?.length ? { alternateName: t.aka } : {}),
      inDefinedTermSet: { "@id": `${SITE.origin}/glossary/#set` },
      url: url(`glossary/${t.slug}/`),
      termCode: t.slug,
      inLanguage: "en",
    },
    plain: `${t.term}: ${t.short}\n${plain(t.body)}`,
  });
});

/* ---- engineering notes ---- */
NOTES.forEach((n, i) => {
  const body = resolveRefs(n.body, `notes/${n.slug}`);
  const { html, toc } = md(body);
  const prev = NOTES[i - 1];
  const next = NOTES[i + 1];

  add({
    path: `notes/${n.slug}/`,
    title: n.title,
    description: n.description,
    section: "notes",
    ogType: "article",
    published: n.date,
    updated: n.updated || n.date,
    crumbs: [{ name: "Engineering notes", href: "/notes/" }, { name: n.title, href: `/notes/${n.slug}/` }],
    aside: tocHtml(toc),
    body:
      docHeader({
        title: n.title,
        lede: n.description,
        meta: [n.tag, fmtDate(n.date), `by ${esc(SITE.author.name)}`],
      }) +
      html +
      pagerBlock(
        prev && { href: `/notes/${prev.slug}/`, label: prev.title },
        next && { href: `/notes/${next.slug}/`, label: next.title }
      ),
    schema: {
      "@type": "TechArticle",
      "@id": `${url(`notes/${n.slug}/`)}#article`,
      headline: n.title,
      description: n.description,
      datePublished: n.date,
      dateModified: n.updated || n.date,
      keywords: n.keywords?.join(", "),
      author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
      publisher: { "@id": `${SITE.origin}/#organization` },
      about: { "@id": `${SITE.origin}/#software` },
      image: url(`assets/${OG_BY_SECTION.notes}`),
      inLanguage: "en",
    },
    plain: plain(n.body),
  });
});

/* ---- hubs and standalone pages ---- */
buildPages({
  SITE, url, md, plain, esc, resolveRefs, fmtDate, docSidebar, tocHtml, docHeader,
  MARK, ICONS, DOC_GROUPS, DOCS, FAQ_CATEGORIES, FAQS, TERMS, NOTES, RELEASES,
}).forEach(add);

/* ------------------------------------------------------------------ render */

console.log(`rendering ${pages.length} pages`);
for (const page of pages) {
  // Cloudflare Pages serves /404.html for unmatched routes — and, crucially, serves it
  // with a real 404 status. Without this file it answers unknown paths with index.html
  // and HTTP 200, which is how /favicon.ico came to return the homepage as text/html.
  const dest = page.path === "404" ? "404.html" : path.join(page.path, "index.html");
  write(dest, shell(page));
}

/* ------------------------------------------------------------------ static assets */

for (const f of ["site.css", "site.js"]) {
  write(path.join("assets", f), fs.readFileSync(path.join(HERE, "assets", f)));
}

// Vector favicon — modern browsers prefer it, and it stays sharp on any display.
write(
  "favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <title>DeskDrawer</title>
  <rect width="32" height="32" rx="7" fill="#0e1118"/>
  <rect x="6.8" y="7" width="7.6" height="18" rx="2.3" fill="#7aa9ff"/>
  <rect x="17.6" y="7" width="7.6" height="11.6" rx="2.3" fill="#57cfa2"/>
</svg>
`
);

write(
  "site.webmanifest",
  JSON.stringify(
    {
      name: "DeskDrawer — Lightweight Windows Desktop Organizer",
      short_name: "DeskDrawer",
      description: SITE.boilerplate,
      id: "/",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#090a0e",
      theme_color: "#090a0e",
      lang: "en",
      categories: ["productivity", "utilities", "personalization"],
      icons: [
        { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { src: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      ],
      screenshots: [
        { src: "/hero-desktop.png", sizes: "2560x1380", type: "image/png", form_factor: "wide",
          label: "DeskDrawer organising a Windows 11 desktop into transparent boards" },
      ],
    },
    null,
    2
  )
);

write(
  "robots.txt",
  `# DeskDrawer — every page is public and meant to be read, by people and by machines alike.
User-agent: *
Allow: /

# Assistants and answer engines are explicitly welcome. The canonical machine-readable
# summary of this site is /llms.txt, and the full text is /llms-full.txt.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /
User-agent: DuckAssistBot
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: Meta-ExternalAgent
Allow: /

Sitemap: ${url("sitemap.xml")}
`
);

/* sitemap — every generated page, with honest priorities */
const PRIORITY = { "": "1.0", features: "0.9", download: "0.9", docs: "0.8", faq: "0.7", glossary: "0.6", notes: "0.7" };
const sitemapEntries = pages
  .filter((p) => !p.noindex)
  .sort((a, b) => {
    const rank = (p) => (p.path === "" ? 0 : p.path.split("/").length <= 2 ? 1 : 2);
    return rank(a) - rank(b) || a.path.localeCompare(b.path);
  })
  .map((p) => {
    const top = p.path.split("/")[0];
    const priority = p.path === "" ? "1.0" : p.path.split("/").length <= 2 ? PRIORITY[top] || "0.7" : { docs: "0.7", faq: "0.6", glossary: "0.5", notes: "0.6" }[top] || "0.5";
    return `  <url>
    <loc>${url(p.path)}</loc>
    <lastmod>${p.updated || SITE.updated}</lastmod>
    <changefreq>${p.path === "" ? "weekly" : "monthly"}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n");

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`);

/* RSS — engineering notes and releases, newest first */
const feedItems = NOTES.map((n) => ({
  title: n.title, link: url(`notes/${n.slug}/`), date: n.date, desc: n.description,
}))
  .concat(RELEASES.map((r) => ({
    title: `DeskDrawer ${r.version}`, link: `${url("changelog/")}#v${r.version.replace(/\./g, "-")}`,
    date: r.date, desc: plain(r.summary || r.notes.join(" ")).slice(0, 300),
  })))
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 40);

write("rss.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>DeskDrawer — engineering notes and releases</title>
  <link>${SITE.origin}/</link>
  <atom:link href="${url("rss.xml")}" rel="self" type="application/rss+xml" />
  <description>${esc(SITE.boilerplate)}</description>
  <language>en</language>
  <lastBuildDate>${new Date(SITE.updated + "T00:00:00Z").toUTCString()}</lastBuildDate>
${feedItems
  .map((it) => `  <item>
    <title>${esc(it.title)}</title>
    <link>${it.link}</link>
    <guid isPermaLink="true">${it.link}</guid>
    <pubDate>${new Date(it.date + "T00:00:00Z").toUTCString()}</pubDate>
    <description>${esc(it.desc)}</description>
  </item>`)
  .join("\n")}
</channel>
</rss>
`);

/* llms.txt — the emerging convention for telling an assistant what a site contains */
const llmsSection = (title, items) =>
  `## ${title}\n\n${items.map((i) => `- [${i.t}](${i.u})${i.d ? `: ${i.d}` : ""}`).join("\n")}\n`;

write("llms.txt", `# DeskDrawer

> ${SITE.boilerplate}

DeskDrawer is developed by ${SITE.author.name} (${SITE.publisher}) and sold as a one-time
purchase on the Microsoft Store. Current version ${SITE.version}, for Windows 10 (build 19041+)
and Windows 11 on x64. This site is the product's official documentation and the canonical
source for how DeskDrawer behaves. Full plain-text corpus: ${url("llms-full.txt")}

${llmsSection("Product", [
  { t: "Home", u: url(""), d: "What DeskDrawer is, who it is for, and why it exists" },
  { t: "Features", u: url("features/"), d: "Complete capability list, including deliberate non-features" },
  { t: "Download", u: url("download/"), d: "System requirements, installation and licensing" },
  { t: "Why DeskDrawer", u: url("compare/"), d: "How a focused organizer differs from a full desktop suite" },
  { t: "Release notes", u: url("changelog/"), d: `Every version through ${SITE.version}` },
  { t: "Roadmap", u: url("roadmap/"), d: "What is planned and what is deliberately out of scope" },
])}
${llmsSection("Documentation", DOCS.map((d) => ({ t: d.title, u: url(`docs/${d.slug}/`), d: d.description })))}
${llmsSection("Glossary", TERMS.map((t) => ({ t: t.term, u: url(`glossary/${t.slug}/`), d: t.short })))}
${llmsSection("Engineering notes", NOTES.map((n) => ({ t: n.title, u: url(`notes/${n.slug}/`), d: n.description })))}
${llmsSection(
  "Questions and answers",
  [{ t: "All questions", u: url("faq/"), d: `${FAQS.length} answers on one page, grouped by topic` }].concat(
    FAQ_CATEGORIES.map((c) => ({ t: c.title, u: `${url("faq/")}#${c.id}`, d: c.description }))
  )
)}
${llmsSection("Trust and contact", [
  { t: "About the developer", u: url("about/") },
  { t: "Privacy policy", u: url("privacy/"), d: "No ads, telemetry, analytics, accounts or network calls" },
  { t: "Support", u: url("support/"), d: `GitHub issues and ${SITE.email}` },
  { t: "Microsoft Store listing", u: SITE.store },
  { t: "Source repository and changelog", u: SITE.github },
])}`);

write(
  "llms-full.txt",
  `# DeskDrawer — full documentation corpus\n\n` +
    `> ${SITE.boilerplate}\n\n` +
    `Version ${SITE.version}. Generated ${SITE.updated}. Canonical site: ${SITE.origin}/\n\n` +
    pages
      .filter((p) => p.plain)
      .map((p) => `\n\n---\n\n# ${p.title}\nURL: ${url(p.path)}\n\n${p.plain}`)
      .join("")
);

/* JSON knowledge endpoints — the same facts, addressable without parsing HTML */
write("api/product.json", JSON.stringify({
  name: SITE.name, version: SITE.version, description: SITE.boilerplate,
  developer: SITE.author, publisher: SITE.publisher, licence: "Proprietary, one-time purchase",
  platform: SITE.requirements, store: SITE.store, repository: SITE.github, support: SITE.email,
  privacy: { telemetry: false, ads: false, accounts: false, analytics: false, networkCalls: false },
  urls: { home: url(""), docs: url("docs/"), faq: url("faq/"), glossary: url("glossary/"),
          changelog: url("changelog/"), llms: url("llms.txt") },
}, null, 2));

write("api/faq.json", JSON.stringify({
  updated: SITE.updated, count: FAQS.length,
  categories: FAQ_CATEGORIES,
  items: FAQS.map((f) => ({
    slug: f.slug, question: f.q, category: f.cat,
    answer: plain(resolveRefs(f.a, `faq#${f.slug}`)), url: `${url("faq/")}#${f.slug}`,
  })),
}, null, 2));

write("api/glossary.json", JSON.stringify({
  updated: SITE.updated, count: TERMS.length,
  items: TERMS.map((t) => ({
    slug: t.slug, term: t.term, aka: t.aka || [], definition: t.short, url: url(`glossary/${t.slug}/`),
  })),
}, null, 2));

write("api/docs.json", JSON.stringify({
  updated: SITE.updated, count: DOCS.length,
  items: DOCS.map((d) => ({ slug: d.slug, title: d.title, group: d.group, description: d.description, url: url(`docs/${d.slug}/`) })),
}, null, 2));

write("api/releases.json", JSON.stringify({ current: SITE.version, releases: RELEASES }, null, 2));

/* Cloudflare Pages: long-lived caching for immutable assets, sane defaults elsewhere */
write("_headers", `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=604800

/favicon.ico
  Cache-Control: public, max-age=604800
  Content-Type: image/x-icon

/favicon.svg
  Cache-Control: public, max-age=604800

/api/*
  Cache-Control: public, max-age=3600
  Access-Control-Allow-Origin: *

/llms.txt
  Content-Type: text/plain; charset=utf-8
  Access-Control-Allow-Origin: *

/llms-full.txt
  Content-Type: text/plain; charset=utf-8
  Access-Control-Allow-Origin: *

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
`);

/* ------------------------------------------------------------------ prune stale output */

let previous = [];
try { previous = JSON.parse(fs.readFileSync(MANIFEST, "utf8")); } catch { /* first build */ }

let pruned = 0;
for (const rel of previous) {
  if (written.has(rel)) continue;
  const p = path.join(OUT, rel);
  if (fs.existsSync(p)) { fs.rmSync(p); pruned++; }
}
// remove directories the prune emptied
for (const rel of previous) {
  let dir = path.dirname(path.join(OUT, rel));
  while (dir.startsWith(OUT) && dir !== OUT) {
    try { if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir); else break; } catch { break; }
    dir = path.dirname(dir);
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify([...written].sort(), null, 0));

const bytes = [...written].reduce((n, r) => n + fs.statSync(path.join(OUT, r)).size, 0);
console.log(`wrote ${written.size} files (${(bytes / 1024).toFixed(0)} KB)${pruned ? `, pruned ${pruned}` : ""}`);
console.log(`  ${DOCS.length} docs · ${FAQS.length} FAQ · ${TERMS.length} glossary · ${NOTES.length} notes`);
