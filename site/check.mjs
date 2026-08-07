/**
 * Post-build validation. Run after site/build.mjs:
 *
 *     node site/check.mjs
 *
 * Fails loudly on the things that are easy to ship broken and hard to notice:
 * dead internal links, invalid JSON-LD, missing metadata, absent icon files.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "docs");

const problems = [];
const warnings = [];
const fail = (m) => problems.push(m);
const warn = (m) => warnings.push(m);

/* ---- collect every emitted file ---- */
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git") continue;
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p) : files.push("/" + path.relative(OUT, p).replace(/\\/g, "/"));
  }
})(OUT);

const fileSet = new Set(files);

// Only pages this build produced are subject to the page checks. Files that live in
// docs/ for other reasons — the Google Search Console verification token, for example —
// are deliberately left alone and must not be "fixed" into valid pages.
const generated = new Set(JSON.parse(fs.readFileSync(path.join(OUT, ".build-manifest.json"), "utf8")).map((r) => "/" + r));
const htmlFiles = files.filter((f) => f.endsWith(".html") && generated.has(f));
const foreignHtml = files.filter((f) => f.endsWith(".html") && !generated.has(f));
if (foreignHtml.length) console.log(`(not checked, not generated: ${foreignHtml.join(", ")})`);

/** Does an internal href resolve to something we actually emitted? */
function resolves(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "") return true;
  if (fileSet.has(clean)) return true;
  if (clean.endsWith("/") && fileSet.has(clean + "index.html")) return true;
  return false;
}

/* ---- per-page checks ---- */
const anchorsByPage = new Map();

for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(OUT, f), "utf8");
  const page = f.replace(/index\.html$/, "");

  // metadata
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];

  const noindex = /content="noindex/.test(html);

  if (!title) fail(`${page}: no <title>`);
  else if (title.length > 70) warn(`${page}: title ${title.length} chars — "${title}"`);
  if (!desc) fail(`${page}: no meta description`);
  else if (!noindex && desc.length > 170) warn(`${page}: description ${desc.length} chars`);
  else if (!noindex && desc.length < 70) warn(`${page}: description only ${desc.length} chars`);
  if (!canon) fail(`${page}: no canonical`);

  if (!/<h1[ >]/.test(html)) fail(`${page}: no <h1>`);
  const h1s = (html.match(/<h1[ >]/g) || []).length;
  if (h1s > 1) fail(`${page}: ${h1s} <h1> elements`);

  // JSON-LD must parse and must not carry undefined
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail(`${page}: no JSON-LD`);
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw);
      const s = JSON.stringify(data);
      if (s.includes("undefined")) fail(`${page}: JSON-LD contains "undefined"`);
      if (!data["@context"]) fail(`${page}: JSON-LD missing @context`);
    } catch (e) {
      fail(`${page}: JSON-LD does not parse — ${e.message}`);
    }
  }

  // images need alt text
  for (const [, tag] of html.matchAll(/<img([^>]*)>/g)) {
    if (!/\balt=/.test(tag)) fail(`${page}: <img> without alt —${tag.slice(0, 70)}`);
  }

  // record anchor ids so fragment links can be validated
  anchorsByPage.set(page, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

  // internal links
  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (!resolves(href)) fail(`${page}: dead link → ${href}`);
  }
  // stray unresolved cross-references
  if (/\[\[[a-z0-9-]+\]\]/.test(html)) fail(`${page}: unresolved [[ref]] left in output`);
  if (html.includes("undefined<") || html.includes(">undefined")) fail(`${page}: literal "undefined" in output`);
}

/* ---- fragment links ---- */
for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(OUT, f), "utf8");
  const page = f.replace(/index\.html$/, "");
  for (const [, href] of html.matchAll(/href="(\/[^"]*#[^"]+)"/g)) {
    const [target, frag] = href.split("#");
    const key = target.endsWith("/") ? target : target + "/";
    const ids = anchorsByPage.get(key);
    if (ids && !ids.has(frag)) fail(`${page}: link to missing anchor → ${href}`);
  }
}

/* ---- required files (this is the Google-favicon fix, so assert it) ---- */
const REQUIRED = [
  "/favicon.ico", "/favicon.svg", "/favicon-16x16.png", "/favicon-32x32.png", "/favicon-96x96.png",
  "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png",
  "/site.webmanifest", "/robots.txt", "/sitemap.xml", "/rss.xml", "/llms.txt", "/llms-full.txt",
  "/404.html", "/_headers", "/assets/site.css", "/assets/site.js", "/assets/og.png",
  "/before-after.png", "/hero-desktop.png", "/boards-closeup.png", "/menu-dark.png",
  "/google05253daa0cdd748f.html",
];
for (const r of REQUIRED) if (!fileSet.has(r)) fail(`missing required file: ${r}`);

/* ---- sitemap sanity ---- */
const sitemap = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = htmlFiles
  .filter((f) => f.endsWith("index.html"))
  .map((f) => "https://deskdrawer.pages.dev" + f.replace(/index\.html$/, ""));

for (const u of locs) if (!indexable.includes(u)) fail(`sitemap lists a page that was not built: ${u}`);
for (const u of indexable) if (!locs.includes(u)) fail(`page missing from sitemap: ${u}`);
if (locs.some((u) => u.includes("404"))) fail("sitemap includes the 404 page");

/* ---- manifest sanity ---- */
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, "site.webmanifest"), "utf8"));
for (const icon of manifest.icons) {
  if (!fileSet.has(icon.src)) fail(`webmanifest references a missing icon: ${icon.src}`);
}

/* ---- report ---- */
console.log(`checked ${htmlFiles.length} pages, ${files.length} files`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log("  ~ " + w));
}
if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`);
  problems.forEach((p) => console.log("  ✗ " + p));
  process.exit(1);
}
console.log("\nall checks passed");
