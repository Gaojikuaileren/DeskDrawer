/**
 * Every fact about the product that appears in more than one place lives here,
 * so the site, the structured data and the machine-readable exports can never disagree.
 */

export const SITE = {
  // One edit here moves the whole site to a custom domain: URLs, canonicals,
  // sitemap, RSS, JSON-LD and llms.txt all derive from it.
  origin: "https://deskdrawer.pages.dev",

  name: "DeskDrawer",
  legalName: "DeskDrawer - Desktop Organizer",
  tagline: "Lightweight Windows desktop organizer",
  version: "1.2.5",
  released: "2026-07-25",
  updated: "2026-08-07",

  // The single sentence every surface — page, card, schema, llms.txt — agrees on.
  boilerplate:
    "DeskDrawer is a lightweight desktop organizer for Windows. It groups desktop icons, " +
    "files, folders and shortcuts into clean transparent boards without moving your files, " +
    "adding bulky title bars, or changing how your desktop works. One-time purchase. " +
    "No ads, no telemetry, no subscriptions, no bundled plugins.",

  store: "https://apps.microsoft.com/detail/9n904wfphzfz",
  storeId: "9n904wfphzfz",
  github: "https://github.com/Gaojikuaileren/DeskDrawer",
  issues: "https://github.com/Gaojikuaileren/DeskDrawer/issues",
  email: "freeketchup@icloud.com",

  author: { name: "Shipeng Ouyang", url: "https://github.com/Gaojikuaileren" },
  publisher: "GaojiKuaileren",

  requirements: {
    os: "Windows 10 version 2004 (build 19041) or newer, and Windows 11",
    arch: "x64",
    runtime: "None — the app ships as a single self-contained executable",
    ram: "No minimum beyond the operating system's own",
  },
};

export const url = (p = "") => `${SITE.origin}/${String(p).replace(/^\/+/, "")}`;

/** Primary navigation. `section` matches a page's `section` so the current item is marked. */
export const NAV = [
  { label: "Features", href: "/features/", section: "features" },
  { label: "Docs", href: "/docs/", section: "docs" },
  { label: "FAQ", href: "/faq/", section: "faq" },
  { label: "Glossary", href: "/glossary/", section: "glossary" },
  { label: "Notes", href: "/notes/", section: "notes" },
];

export const FOOTER = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features/" },
      { label: "Download", href: "/download/" },
      { label: "Why DeskDrawer", href: "/compare/" },
      { label: "Release notes", href: "/changelog/" },
      { label: "Roadmap", href: "/roadmap/" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Documentation", href: "/docs/" },
      { label: "Getting started", href: "/docs/getting-started/" },
      { label: "Questions & answers", href: "/faq/" },
      { label: "Glossary", href: "/glossary/" },
      { label: "Engineering notes", href: "/notes/" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "About the developer", href: "/about/" },
      { label: "Privacy", href: "/privacy/" },
      { label: "Support", href: "/support/" },
      { label: "Architecture", href: "/docs/architecture/" },
      { label: "Troubleshooting", href: "/docs/troubleshooting/" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "Microsoft Store", href: SITE.store, external: true },
      { label: "GitHub", href: SITE.github, external: true },
      { label: "Report an issue", href: SITE.issues, external: true },
      { label: "Email the developer", href: `mailto:${SITE.email}`, external: true },
      { label: "llms.txt", href: "/llms.txt" },
    ],
  },
];

/** Section → social card. Keeps every share of a docs page visually part of the docs. */
export const OG_BY_SECTION = {
  home: "og.png",
  features: "og-features.png",
  download: "og-download.png",
  docs: "og-docs.png",
  faq: "og-faq.png",
  glossary: "og-glossary.png",
  notes: "og-notes.png",
  compare: "og-compare.png",
  changelog: "og-changelog.png",
  about: "og-about.png",
  privacy: "og-privacy.png",
  support: "og-support.png",
  roadmap: "og-roadmap.png",
};
