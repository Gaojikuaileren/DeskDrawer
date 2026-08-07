import { SITE, NAV, FOOTER, OG_BY_SECTION, url } from "../content/site.mjs";
import { esc } from "./md.mjs";

/** The brand mark, identical in geometry to favicon.ico and the PWA icons. */
export const MARK = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
<rect width="32" height="32" rx="7" fill="#0e1118" stroke="rgba(255,255,255,.14)"/>
<rect x="6.8" y="7" width="7.6" height="18" rx="2.3" fill="#7aa9ff"/>
<rect x="17.6" y="7" width="7.6" height="11.6" rx="2.3" fill="#57cfa2"/>
</svg>`;

const ICON = (p, d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${d || 2}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
export const ICONS = {
  check: ICON('<path d="M20 6 9 17l-5-5"/>', 2.4),
  arrow: ICON('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  store: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>`,
};

const abs = (href) => (/^(https?:|mailto:)/i.test(href) ? href : url(href));

/**
 * Trim a description to a search-snippet length, cutting at a clause boundary rather
 * than mid-word. The full text still appears on the page and in the JSON-LD, so nothing
 * is lost — this only keeps the <meta> tag from being truncated arbitrarily by the engine.
 */
function clip(text, limit = 165) {
  const s = String(text).trim();
  if (s.length <= limit) return s;
  const head = s.slice(0, limit);
  for (const mark of ["; ", ". ", " — ", ", "]) {
    const at = head.lastIndexOf(mark);
    if (at > limit * 0.55) return s.slice(0, at) + (mark === ". " ? "." : "");
  }
  return head.replace(/\s+\S*$/, "") + "…";
}

function link({ label, href, external }) {
  const attrs = external || /^(https?:|mailto:)/i.test(href) ? ' target="_blank" rel="noopener"' : "";
  return `<a href="${href}"${attrs}>${esc(label)}</a>`;
}

/* ------------------------------------------------------------------ structured data */

/**
 * Pages where the product itself is the subject, and where a full SoftwareApplication
 * node — feature list, offer, screenshot — therefore describes what the reader can see.
 * Every other page (a glossary term, a troubleshooting page) is *about* DeskDrawer but is
 * not a product listing, so it carries only enough of the entity for `about` to resolve.
 * Repeating the offer on 77 pages would assert something none of them actually show.
 */
const PRODUCT_PAGES = new Set(["", "features/", "download/", "compare/", "changelog/", "docs/"]);

function graph(page) {
  const pageUrl = url(page.path);
  const image = url(`assets/${OG_BY_SECTION[page.section] || "og.png"}`);
  const isProductPage = PRODUCT_PAGES.has(page.path);

  const nodes = [
    {
      "@type": "Organization",
      "@id": `${SITE.origin}/#organization`,
      name: SITE.publisher,
      url: SITE.origin,
      logo: { "@type": "ImageObject", url: url("icon-512.png"), width: 512, height: 512 },
      founder: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
      email: SITE.email,
      sameAs: [SITE.github, SITE.store],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.origin}/#website`,
      url: SITE.origin,
      name: SITE.name,
      description: SITE.boilerplate,
      publisher: { "@id": `${SITE.origin}/#organization` },
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE.origin}/faq/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE.origin}/#software`,
      name: SITE.name,
      alternateName: SITE.legalName,
      applicationCategory: "ProductivityApplication",
      applicationSubCategory: "Desktop organizer",
      operatingSystem: "Windows 10, Windows 11",
      processorRequirements: "x64",
      memoryRequirements: "No minimum beyond the operating system's own",
      softwareVersion: SITE.version,
      description: SITE.boilerplate,
      url: SITE.origin,
      author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
      publisher: { "@id": `${SITE.origin}/#organization` },
      isAccessibleForFree: false,
      ...(isProductPage
        ? {
            datePublished: "2026-06-20",
            dateModified: SITE.released,
            downloadUrl: SITE.store,
            installUrl: SITE.store,
            releaseNotes: url("changelog/"),
            screenshot: url("hero-desktop.png"),
            softwareHelp: { "@id": `${SITE.origin}/docs/#webpage` },
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              url: SITE.store,
              seller: { "@id": `${SITE.origin}/#organization` },
              // Price is intentionally omitted: the Microsoft Store is the single source of
              // truth and it varies by market. A hardcoded figure would go stale and would
              // not match anything visible on the page.
            },
            featureList: [
              "Group desktop icons, files, folders and shortcuts into transparent boards",
              "Files never move — boards store membership, not locations",
              "Native Windows right-click menu, drag and drop, rename, delete",
              "Sort each board by name, type, size, date or manual order",
              "Fold a board into a compact square",
              "Four icon sizes per board",
              "Runs from the system tray with no background services",
              "One-time purchase, no subscription",
              "No ads, no telemetry, no accounts, no network calls",
            ],
          }
        : {}),
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${SITE.origin}/#website` },
      about: { "@id": `${SITE.origin}/#software` },
      inLanguage: "en",
      datePublished: page.published || "2026-06-20",
      dateModified: page.updated || SITE.updated,
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      ...(page.crumbs?.length ? { breadcrumb: { "@id": `${pageUrl}#breadcrumb` } } : {}),
    },
  ];

  if (page.crumbs?.length) {
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [{ name: "Home", href: "/" }, ...page.crumbs].map((c, n) => ({
        "@type": "ListItem",
        position: n + 1,
        name: c.name || c.label,
        item: url(c.href),
      })),
    });
  }

  if (page.schema) nodes.push(...(Array.isArray(page.schema) ? page.schema : [page.schema]));

  // `<` is escaped so no string in the graph can terminate the enclosing <script> element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}

/* ------------------------------------------------------------------ chrome */

function header(page) {
  const items = NAV.map(
    (n) =>
      `<a class="link${page.section === n.section ? " is-active" : ""}" href="${n.href}"${
        page.section === n.section ? ' aria-current="page"' : ""
      }>${esc(n.label)}</a>`
  ).join("");

  return `<header class="nav" id="nav">
  <div class="wrap nav-inner">
    <a class="brand" href="/" aria-label="DeskDrawer home">${MARK}<span>DeskDrawer</span></a>
    <nav class="nav-links" aria-label="Primary">${items}</nav>
    <div class="nav-end">
      <a class="btn btn-primary nav-cta" href="${SITE.store}" target="_blank" rel="noopener">Get DeskDrawer</a>
      <details class="menu">
        <summary aria-label="Menu"><span class="bars" aria-hidden="true"></span></summary>
        <div class="menu-panel">
          ${NAV.concat([{ label: "Download", href: "/download/" }, { label: "Why DeskDrawer", href: "/compare/" }, { label: "Release notes", href: "/changelog/" }, { label: "About", href: "/about/" }, { label: "Support", href: "/support/" }])
            .map((n) => `<a href="${n.href}">${esc(n.label)}</a>`)
            .join("")}
          <a class="btn btn-primary" href="${SITE.store}" target="_blank" rel="noopener">Get DeskDrawer</a>
        </div>
      </details>
    </div>
  </div>
</header>`;
}

function crumbTrail(page) {
  if (!page.crumbs?.length) return "";
  const parts = [`<a href="/">Home</a>`]
    .concat(
      page.crumbs.map((c, n) =>
        n === page.crumbs.length - 1
          ? `<span aria-current="page">${esc(c.name)}</span>`
          : `<a href="${c.href}">${esc(c.name)}</a>`
      )
    )
    .join(`<span class="sep" aria-hidden="true">/</span>`);
  return `<nav class="crumbs" aria-label="Breadcrumb">${parts}</nav>`;
}

function footer() {
  const cols = FOOTER.map(
    (g) => `<div class="grp"><h2>${esc(g.title)}</h2>${g.links.map(link).join("")}</div>`
  ).join("");

  return `<footer>
  <div class="wrap">
    <div class="foot">
      <div class="foot-brand">
        <div class="brand">${MARK}<span>DeskDrawer</span></div>
        <p class="tagline">${esc(SITE.boilerplate)}</p>
        <p class="verline">Version ${SITE.version} · Windows 10 &amp; 11 · <a href="/changelog/">Release notes</a></p>
      </div>
      <div class="foot-links">${cols}</div>
    </div>
    <div class="copy">
      <p>© <span id="yr">2026</span> ${esc(SITE.publisher)} · DeskDrawer — a lightweight Windows desktop organizer by ${esc(SITE.author.name)}.</p>
      <p>Windows is a trademark of the Microsoft group of companies. DeskDrawer is an independent product, not affiliated with or endorsed by Microsoft or any other company.</p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ document */

export function shell(page) {
  const pageUrl = url(page.path);
  const ogImage = url(`assets/${OG_BY_SECTION[page.section] || "og.png"}`);
  // Suffix the brand only while the result still fits a search result's title line.
  const suffixed = `${page.title} · DeskDrawer`;
  const title = page.metaTitle || (page.path === "" || suffixed.length > 65 ? page.title : suffixed);
  const desc = clip(page.description);

  const main = page.wide
    ? page.body
    : `<div class="wrap doc-shell${page.sidebar ? " has-side" : ""}">
${page.sidebar || ""}
<article class="doc-body">${crumbTrail(page)}${page.body}</article>
${page.aside || ""}
</div>`;

  return `<!doctype html>
<html lang="en">
<head>
<script>document.documentElement.className+=" js"</script>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${pageUrl}" />
<meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}" />
<meta name="theme-color" content="#090a0e" />
<meta name="color-scheme" content="dark" />
<meta name="author" content="${esc(SITE.author.name)}" />
<meta name="generator" content="DeskDrawer site builder" />

<!-- Real icon files at real URLs. Google's favicon crawler cannot use a data: URI,
     which is why search results previously fell back to a generic icon. -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="msapplication-TileColor" content="#090a0e" />
<meta name="msapplication-TileImage" content="/mstile-270x270.png" />
<meta name="application-name" content="DeskDrawer" />
<meta name="apple-mobile-web-app-title" content="DeskDrawer" />

<meta property="og:type" content="${page.ogType || "website"}" />
<meta property="og:site_name" content="DeskDrawer" />
<meta property="og:locale" content="en" />
<meta property="og:title" content="${esc(page.ogTitle || title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${pageUrl}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${esc(page.ogAlt || `${page.title} — DeskDrawer`)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(page.ogTitle || title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${ogImage}" />
<meta name="twitter:image:alt" content="${esc(page.ogAlt || `${page.title} — DeskDrawer`)}" />

<link rel="alternate" type="application/rss+xml" title="DeskDrawer — engineering notes and releases" href="/rss.xml" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
<link rel="stylesheet" href="/assets/site.css" />
${page.head || ""}
<script type="application/ld+json">${graph(page)}</script>
</head>
<body${page.section ? ` data-section="${page.section}"` : ""}>
<a class="skip" href="#main">Skip to content</a>
${header(page)}
<main id="main">
${main}
</main>
${footer()}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

export { abs, link };
