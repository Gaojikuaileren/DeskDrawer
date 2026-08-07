/**
 * The homepage, the section hubs, and the standalone pages.
 *
 * Marketing pages are hand-built HTML because their layout is the content. Prose pages
 * are markdown, rendered through the same pipeline as the documentation.
 */

const I = (paths, w = 2) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const CHECK = I('<path d="M20 6 9 17l-5-5"/>', 2.4);
const DOT = I('<circle cx="12" cy="12" r="9"/>', 2.2);
const ARROW = I('<path d="M5 12h14M13 6l6 6-6 6"/>');

const STORE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>`;

export function buildPages(ctx) {
  const { SITE, url, md, plain, esc, resolveRefs, fmtDate, docSidebar, tocHtml, docHeader,
          DOC_GROUPS, DOCS, FAQ_CATEGORIES, FAQS, TERMS, NOTES, RELEASES,
          D_PAGES, D_FAQ, D_RELEASES } = ctx;

  const pages = [];

  /** A simple prose page: markdown in, standard document layout out. */
  const prose = ({ path, title, description, section, lede, body, crumbs, schema, updated, cta = "", wideToc = true }) => {
    const source = resolveRefs(body, path);
    const { html, toc } = md(source);
    pages.push({
      path, title, description, section, updated: updated || D_PAGES(),
      crumbs: crumbs || [{ name: title, href: `/${path}` }],
      aside: wideToc ? tocHtml(toc) : "",
      body:
        docHeader({ title, lede: lede || description, meta: [`Updated ${fmtDate(updated || D_PAGES())}`] }) +
        cta + html,
      schema, plain: plain(source),
    });
  };

  /* ================================================================== HOME */

  const featureCards = [
    {
      ic: I('<rect x="3" y="3" width="7" height="18" rx="1.5"/><rect x="14" y="3" width="7" height="11" rx="1.5"/>'),
      h: "Drawers for everything",
      p: "Group desktop icons, files, folders and shortcuts into clean boards. Drag to move them, fold a board to a compact square when you need the room.",
      href: "/docs/boards/", more: "How boards work",
    },
    {
      ic: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
      h: "Your files never move",
      p: "A board stores which icons belong to it — not the files. Every path, shortcut and backup rule keeps working, and uninstalling changes nothing.",
      href: "/docs/boards/", more: "Why your files stay put",
    },
    {
      ic: I('<path d="M4 4h16v12H4z"/><path d="M8 20h8M12 16v4"/>'),
      h: "The real Windows menu",
      p: "Right-click an icon and you get the genuine shell menu — Open with, Send to, Share, and every extension you have installed. Not an imitation.",
      href: "/docs/menus/", more: "How the menus work",
    },
    {
      ic: I('<path d="M5 8h14M5 12h9M5 16h5"/><path d="m17 14 3 3 3-3"/>', 2),
      h: "16 languages, almost no language barrier",
      p: "The Store listing is available in 16 languages — and the app itself is icon-driven, so using it barely depends on reading text in any of them.",
      href: "/docs/languages/", more: "Languages in detail",
    },
    {
      ic: I('<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>'),
      h: "Genuinely lightweight",
      p: "One tray process. No background services, no shell extensions, no plugin host, no polling loop. It organizes your desktop and does nothing else.",
      href: "/docs/architecture/", more: "How it is built",
    },
    {
      ic: I('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>'),
      h: "No wasted height",
      p: "Board controls live in one small widget in the corner instead of a title bar on every board. With six boards open, that is a tenth of your screen back.",
      href: "/notes/why-boards-have-no-title-bar/", more: "Why there is no title bar",
    },
  ];

  const exploreCards = [
    { h: "Documentation", p: `${DOCS.length} pages covering every board, menu, gesture and setting.`, href: "/docs/" },
    { h: "Questions & answers", p: `${FAQS.length} straight answers about files, privacy, licensing and Windows behaviour.`, href: "/faq/" },
    { h: "Glossary", p: `${TERMS.length} canonical definitions for every concept in the app.`, href: "/glossary/" },
    { h: "Engineering notes", p: "Why it is built this way, what broke, and what that taught.", href: "/notes/" },
  ];

  pages.push({
    path: "", section: "home", wide: true,
    title: "DeskDrawer — Lightweight Windows Desktop Organizer",
    metaTitle: "DeskDrawer — Lightweight Windows Desktop Organizer",
    description:
      "DeskDrawer groups the icons, files and shortcuts on a cluttered Windows desktop into clean transparent drawers, without moving a single file. One-time purchase.",
    ogAlt: "DeskDrawer social card: the DeskDrawer mark above the words \"Lightweight Windows desktop organizer — group desktop icons into clean drawers. Buy once, use for life.\"",
    body: `
  <section class="hero wrap">
    <span class="eyebrow reveal"><span class="dot"></span> Windows desktop organizer · One-time purchase</span>
    <h1 class="reveal d1">Organize your Windows desktop, <span class="grad-text">without moving a single file</span></h1>
    <p class="sub reveal d2">DeskDrawer groups your Windows desktop icons, files and shortcuts into clean transparent drawers. Your files stay exactly where they are, your desktop still works like your desktop. <b>Buy once, keep it for life.</b></p>
    <div class="cta-row reveal d3">
      <a class="btn btn-primary btn-lg" href="${SITE.store}" target="_blank" rel="noopener">${STORE_SVG} Get it on the Microsoft Store</a>
      <a class="btn btn-ghost btn-lg" href="/download/">Requirements &amp; details</a>
    </div>
    <div class="trust reveal d4">
      <span>${CHECK} One-time purchase</span>
      <span>${CHECK} No ads · no telemetry</span>
      <span>${CHECK} Windows 10 &amp; 11</span>
      <span>${CHECK} 16 languages on the Store</span>
    </div>
    <div class="frame float reveal d5">
      <img src="/messy-desktop-before-after.png" width="2612" height="850" fetchpriority="high"
           alt="The same Windows desktop twice: on the left a messy field of desktop icons, on the right the identical icons grouped into labelled transparent DeskDrawer boards" />
    </div>
  </section>

  <section class="wrap">
    <div class="grid reveal" style="gap:18px">
      <article class="card">
        <h3>What it is</h3>
        <p>A single-purpose desktop organizer for Windows. It draws transparent boards onto your wallpaper and lets you decide which icons go in which board, running from the system tray and nothing else.</p>
      </article>
      <article class="card">
        <h3>Who it is for</h3>
        <p>People whose desktop is a working surface — current projects, downloads, this week's files — who want it readable without installing a large personalization suite.</p>
      </article>
      <article class="card">
        <h3>What it deliberately is not</h3>
        <p>Not a launcher, dock, theming engine or file manager. No automatic filing rules, no plugins. <a href="/docs/limitations/">The full list of limitations</a> is public.</p>
      </article>
    </div>
  </section>

  <section id="features" class="wrap">
    <div class="sec-head reveal">
      <h2>A desktop organizer that stays out of the way</h2>
      <p>Six things it does well, and a great many it deliberately does not do at all.</p>
    </div>
    <div class="grid">
      ${featureCards.map((c, n) => `<a class="card reveal${n % 3 ? ` d${n % 3}` : ""}" href="${c.href}">
        <div class="ic">${c.ic}</div>
        <h3>${c.h}</h3>
        <p>${c.p}</p>
        <span class="more">${c.more} ${ARROW}</span>
      </a>`).join("")}
    </div>
  </section>

  <section id="showcase" class="wrap">
    <div class="sec-head reveal">
      <h2>See it on a real desktop</h2>
      <p>Transparent boards sit on your wallpaper. Your files never move — DeskDrawer just remembers which drawer each icon belongs to.</p>
    </div>
    <div class="frame reveal" style="margin-top:0">
      <img src="/windows-11-desktop-boards.png" width="2560" height="1380" loading="lazy"
           alt="A Windows 11 desktop with its icons grouped into labelled transparent DeskDrawer boards for apps, media and files, with a fourth board folded into a small square" />
    </div>
    <div class="shots" style="margin-top:18px">
      <div class="shot reveal">
        <img src="/boards-closeup.png" width="1200" height="740" loading="lazy" alt="Three DeskDrawer boards up close — app shortcuts in Apps, images in Media, folders and documents in Files — beside a fourth board folded to a small square labelled Tools" />
        <div class="cap">Boards up close — one for apps, one for images, one for working files</div>
      </div>
      <div class="shot reveal d1">
        <img src="/board-menu.png" width="460" height="470" loading="lazy" alt="DeskDrawer's board menu — a narrow dark column of icon-only commands for creating, renaming, deleting, sorting and restyling a board" />
        <div class="cap">Icon-only menus — nothing to translate, nothing to read</div>
      </div>
    </div>
  </section>

  <section id="vs-folders" class="wrap">
    <div class="sec-head reveal">
      <h2>Why not just make folders?</h2>
      <p>It is the obvious way to deal with a cluttered desktop, and sometimes it is the right answer. Here is where it stops working.</p>
    </div>
    <div class="grid reveal">
      <article class="card">
        <h3>A folder hides what you filed</h3>
        <p>The reason a file is on your desktop is that you want to see it. Dragging it into a folder puts it one double-click away, which is the problem you were trying to solve. A drawer groups your desktop icons while leaving every one of them visible.</p>
      </article>
      <article class="card">
        <h3>Folders change where things live</h3>
        <p>Filing moves files, so every path that pointed at them now points somewhere else. A drawer records only which icons belong together, so nothing on disk moves and nothing that referenced it has to be updated.</p>
      </article>
      <article class="card">
        <h3>Tidying by hand does not stay tidy</h3>
        <p>A desktop you sort into folders on Monday is loose again by Friday, because downloads and screenshots keep landing on it. New items simply join a drawer, so the arrangement holds without you maintaining it.</p>
      </article>
    </div>
  </section>

  <section id="compare" class="wrap">
    <div class="sec-head reveal">
      <h2>A lightweight alternative to heavy desktop suites</h2>
      <p>Most desktop organization tools are large all-in-one suites. DeskDrawer does one job. Here is an honest way to choose.</p>
    </div>
    <div class="compare">
      <div class="col hi reveal">
        <h3>DeskDrawer <span class="tag">One-time</span></h3>
        <p>Choose it if you want a quiet, focused way to group desktop icons — bought once.</p>
        <ul>
          <li>${CHECK} One-time purchase, lifetime use</li>
          <li>${CHECK} One tray process, no background services</li>
          <li>${CHECK} No ads, no telemetry, no network access at all</li>
          <li>${CHECK} Real Windows right-click menu and drag-and-drop</li>
          <li>${CHECK} Files never move</li>
        </ul>
      </div>
      <div class="col reveal d1">
        <h3>Full desktop suites</h3>
        <p>Choose one if you want deep customization and a toolkit that goes well beyond grouping icons.</p>
        <ul>
          <li class="neutral">${DOT} Large, feature-rich all-in-one tools</li>
          <li class="neutral">${DOT} Deep customization and automatic filing rules</li>
          <li class="neutral">${DOT} Theming, docks, widgets and more</li>
        </ul>
      </div>
    </div>
    <p style="text-align:center;margin-top:28px"><a class="btn btn-ghost" href="/compare/">Read the full comparison ${ARROW}</a></p>
  </section>

  <section class="wrap">
    <div class="sec-head reveal">
      <h2>Written down, in public</h2>
      <p>Documentation, honest limitations, and engineering notes about how it is built and what has gone wrong.</p>
    </div>
    <div class="grid grid-4">
      ${exploreCards.map((c, n) => `<a class="card reveal${n ? ` d${n}` : ""}" href="${c.href}">
        <h3>${c.h}</h3><p>${c.p}</p><span class="more">Open ${ARROW}</span>
      </a>`).join("")}
    </div>
  </section>

  <section class="wrap">
    <div class="cta-band reveal">
      <h2>Clean up your Windows desktop today</h2>
      <p>Group your cluttered desktop icons into clean drawers in a couple of minutes. Buy once, keep it for life — no subscription, no account, no telemetry.</p>
      <div class="cta-row" style="margin-top:30px">
        <a class="btn btn-primary btn-lg" href="${SITE.store}" target="_blank" rel="noopener">${STORE_SVG} Get DeskDrawer on the Microsoft Store</a>
        <a class="btn btn-ghost btn-lg" href="/docs/getting-started/">Read the docs</a>
      </div>
    </div>
  </section>`,
    plain: `${SITE.boilerplate}\nDeskDrawer groups Windows desktop icons into transparent drawers without moving files. One-time purchase on the Microsoft Store. Store listing available in 16 languages; the application interface is icon-driven and largely language-independent. Windows 10 build 19041+ and Windows 11, x64. No ads, telemetry, accounts or network connections.`,
  });

  /* ================================================================== FEATURES */

  prose({
    path: "features/", section: "features", title: "Everything DeskDrawer does",
    description:
      "Every DeskDrawer feature — grouping desktop icons into boards, native Windows behaviour, sorting, multi-monitor support — plus what it deliberately leaves out.",
    lede: "A complete list, including the things it deliberately does not do. If you are deciding whether it fits, the second half of this page matters as much as the first.",
    body: `## Boards

- Group desktop icons, files, folders and shortcuts into transparent [[board|boards]]
- Boards are drawn on the desktop, not as windows: <kbd>Win</kbd>+<kbd>D</kbd> and "Minimize all" leave them alone
- No title bars — all controls in one compact corner widget
- Fold any board into a compact square and unfold it again
- Optional outline and rounded corners, per board
- Drag to move, drag to resize; both snap to the icon grid, screen edges and neighbouring boards
- Rename by double-clicking the board name
- Deleting a board returns its icons to the default board and never touches a file

## Your files

- **Files never move.** Boards store [[board-membership]], not locations
- New desktop items appear automatically on the default board
- The one exception is deliberate: dropping a file **onto a folder** moves it, exactly as the desktop does — with the folder highlighted while you drag, and a cross-drive drop copying rather than moving
- Uninstalling leaves every file exactly where it was

## Native Windows behaviour

- The genuine [[shell-context-menu]] on every icon, including every extension you have installed
- The desktop's own right-click menu on empty board space, with a working **New** submenu
- Open, rename (<kbd>F2</kbd>), delete, copy, cut, paste, drag — the shortcuts you already use
- Drag files out to File Explorer or any application, and in from them
- Standard Windows info tips on hover: type, size, date, a shortcut's target, an image's dimensions
- The Windows 11 Share pane
- Windows' own dialogs are passed through, including the broken-shortcut prompt and the "how do you want to open this file?" picker
- [[marquee-selection]] that spans several boards at once

## Arranging

- Five [[sort-mode|sort modes]] per board — manual, name, type, size, date — each ascending or descending
- Manual order is stored and survives switching away and back
- Four [[icon-size|icon sizes]] per board
- Automatic re-tiling after an icon-size change so boards stay inside the work area
- **Fix misplaced boards** to rescue a layout after a display change, without touching boards that are fine

## Windows integration

- Windows 10 build 19041 and newer, and Windows 11, on x64
- Multiple monitors, including mixed DPI scaling — [[per-monitor-dpi|per-monitor v2 aware]]
- Boards kept inside each monitor's [[work-area]], never under the taskbar
- Optional [[autostart]] through the official Windows startup task, manageable from Task Manager
- Live Recycle Bin state, updated on change rather than by polling
- Per-user configuration, so a shared PC works correctly

## Language

- Store listing available in **16 languages**
- The application interface is icon-only — the [[board-menu]] and [[tray-menu]] contain no sentences
- New boards are numbered, not named, so a layout contains no words in any language
- System icon names and the whole right-click menu come from Windows in **your** display language
- Full detail in [[languages]]

## Privacy and footprint

- One tray process. No services, no drivers, no shell extensions, no plugin host
- **No network connections of any kind** — no telemetry, analytics, crash reporting, update checks or accounts
- No ads, ever
- Configuration is one local JSON file you can copy, read and back up
- Ships as a [[single-file-executable]]; no runtime to install

## What DeskDrawer does not do

Stated here rather than left for you to discover:

- No automatic filing rules
- No launcher, dock, widgets or theming
- No plugin system
- No global hotkeys or rebindable keys
- No sync between machines
- No screen-reader support for board contents
- No ARM64 build
- English-only application strings and documentation

The reasoning for each, and the known rough edges, is in [[limitations]].`,
  });

  /* ================================================================== DOWNLOAD */

  prose({
    path: "download/", section: "download", title: "Download DeskDrawer",
    description:
      "Get DeskDrawer from the Microsoft Store: system requirements, what installing puts on your machine, licensing, and the 16 languages the listing comes in.",
    lede: "DeskDrawer is distributed through the Microsoft Store as a one-time purchase.",
    cta: `<p style="margin:0 0 34px"><a class="btn btn-primary btn-lg" href="${SITE.store}" target="_blank" rel="noopener">${STORE_SVG} Get it on the Microsoft Store</a></p>`,
    body: `## Requirements

| | |
|---|---|
| Operating system | Windows 10 version 2004 (build 19041) or newer · Windows 11 |
| Architecture | x64 |
| Runtime | **None.** Ships as a [[single-file-executable]] with everything it needs |
| Network | Not required at any point after installation |
| Current version | ${SITE.version} — see [[changelog|release notes]] |

## Languages

The Microsoft Store listing is available in **16 languages**, so you can read about DeskDrawer in your
own language before buying.

The application itself is designed so that using it barely depends on language at all: its menus are
icon-only, new boards are numbered rather than named, and the text-heavy parts — system icon names,
the whole right-click menu — are supplied by Windows in your own display language.

So if your language is not one of the 16, you will still meet very little friction in the product.
What remains in English is error text and the log file. The full breakdown is in [[languages]].

## What installing puts on your machine

| Item | Where |
|---|---|
| The application | Inside its signed [[msix]] package, managed by Windows |
| Your layout | One JSON file in a per-user [[configuration-folder]] |
| Anything else | Nothing |

No services, no drivers, no shell extensions, no registry Run key. See [[installation]].

## Licensing

A [[one-time-purchase]]: one payment, permanent use, every feature included, updates through the
Store. No subscription, no trial that expires into a locked state, no in-app purchases, no plugin
store.

The current price is on the Store listing, which is authoritative — it varies by market and changes
over time, so no figure is printed here. See [[licensing]].

## Before you buy

The most useful page to read first is [[limitations]]. It lists plainly what DeskDrawer does not do
and what is still rough, which is more likely to decide whether it suits you than the feature list is.

## After installing

[[getting-started]] covers the first five minutes.`,
  });

  /* ================================================================== COMPARE */

  prose({
    path: "compare/", section: "compare", title: "Why DeskDrawer, and when not to choose it",
    description:
      "An honest comparison between a focused desktop organizer and a full desktop suite, including the cases where DeskDrawer is the wrong choice.",
    lede: "No competitor is named here, because the useful comparison is between two categories rather than two brands.",
    body: `Desktop-organizing tools fall broadly into two groups. Knowing which group you want settles the
question faster than any feature table.

## The two categories

**Full desktop suites** are large personalization products. Icon grouping is one feature among many:
themes, docks, widgets, wallpaper engines, window management, automatic filing rules. They are
powerful, and if you want to redesign how your whole desktop looks and behaves, that power is the
point.

**Focused organizers** do the grouping and nothing else. DeskDrawer is one of these. The product is
one tray process, no services, no plugins, no theming.

## Choose DeskDrawer if

- You want a cleaner desktop, not a redesigned Windows
- You would rather your files stayed exactly where they are — see [[board-membership]]
- You care about what runs in the background: this is one process with no services and no network access
- You prefer buying something once
- You want the real Windows right-click menu, with your extensions intact — see [[menus]]
- Screen space matters to you, so a title bar on every board is a real cost — see [[why-boards-have-no-title-bar]]

## Choose something else if

Stated plainly, because a purchase that does not fit helps nobody:

- **You want automatic filing rules.** DeskDrawer has none, deliberately. If you want new screenshots
  swept into a board by themselves, this is not the tool.
- **You want theming, docks or widgets.** Entirely out of scope.
- **You rely on a screen reader.** Boards are custom-painted surfaces and their contents are not
  exposed through UI Automation. DeskDrawer would not serve you well.
- **You are on ARM64.** There is no build.
- **You need a fully localized application interface.** DeskDrawer's own strings are English; it works
  around that with an icon-driven interface rather than translation — see [[languages]].
- **You want it free.** It is a paid application with no free tier.

## The honest trade

DeskDrawer's advantage is narrowness. It stays small, quiet and predictable because it does one thing,
and every "why not add…" answer in [[limitations]] is what keeps it that way.

If the features you want are the ones a suite has, a suite is the correct purchase and you should make
it. This page exists so you can work that out before paying rather than after.`,
  });

  /* ================================================================== ABOUT */

  prose({
    path: "about/", section: "about", title: "About DeskDrawer and its developer",
    description:
      "Who builds DeskDrawer, the principles behind it, and how it is developed — an independent one-person Windows product.",
    lede: "DeskDrawer is an independent product built by one person.",
    body: `## Who

DeskDrawer is developed by **${SITE.author.name}** and published under **${SITE.publisher}**. It is
sold on the Microsoft Store and is not affiliated with or endorsed by Microsoft.

There is no company behind it, no team and no investors. That is relevant information when you are
deciding whether to depend on a tool, so it is stated rather than implied.

- Issue tracker and documentation source: [github.com/Gaojikuaileren/DeskDrawer](${SITE.github})
- Email: [${SITE.email}](mailto:${SITE.email})

## The principles

Four rules that decide most questions about this product.

**Never move a user's files.** A desktop organizer that relocates files is a filing system its owner
did not design. DeskDrawer stores [[board-membership]] separately, so the worst case for a bug is a
board that looks wrong, never a file in the wrong place.

**Never change a Windows setting that outlives the process.** Hiding the desktop icon layer is
session-scoped, so a crash or an uninstall cannot leave someone with a permanently empty desktop and
no idea why. See [[hiding-the-desktop-icon-layer]].

**Delegate to Windows.** Where the shell already has behaviour — context menus, the clipboard, info
tips, opening files, naming system icons — call it rather than reimplementing it. The application
inherits correctness and localization it did not write. See [[architecture]].

**Have no mechanism, not just no intent.** DeskDrawer contains no code that opens a network
connection, which makes its privacy claim checkable instead of promised. See
[[no-telemetry-by-default]].

## How it is developed

Twenty-three versions have shipped. Twelve of them fixed things rather than adding them, and the
four most recent — 1.2.2 through 1.2.5 — added no features at all. That is not a stall; it is what a
program that paints over the whole desktop and handles your files ought to spend its time on. The
[[changelog|release notes]] list every one of them, so the claim is checkable rather than asserted.

With no telemetry there are no crash reports and no usage data, so the substitute is repeated
full-codebase review — eight rounds so far, each through a different lens. What each one found,
including how often a fix caused the next bug, is written up in [[eight-rounds-of-audits]].

## Why this site is unusually detailed

Because the things worth knowing about a small utility — what it does to your files, what runs in the
background, what it sends, what breaks — are exactly the things a product page usually omits.

So the [[limitations]] page is public and specific, [[performance]] explains what can still be slow,
and the [[notes|engineering notes]] describe the bugs that shipped and what caused them. If you are
going to trust a program with your desktop, you should be able to read how it works first.

## Trademarks

Windows is a trademark of the Microsoft group of companies. DeskDrawer is an independent product.`,
  });

  /* ================================================================== ROADMAP */

  prose({
    path: "roadmap/", section: "roadmap", title: "Roadmap",
    description:
      "What is being considered for DeskDrawer, what is unlikely, and what is permanently out of scope — with no dates promised.",
    lede: "No dates are given here, because a one-person product cannot honour them and a roadmap with dates it misses is worse than none.",
    body: `## Current priority: correctness over features

The last several releases have been stability work, and that is where the effort still goes. A tool
that hides your desktop icon layer and handles your files earns feature work only after it is
reliable. [[eight-rounds-of-audits]] describes what that has involved.

## Being considered

Not commitments — things that are genuinely open.

- **Better display-change handling.** Board rectangles are stored in screen coordinates, so moving a
  configuration between machines with different monitors needs a manual tidy-up. Storing positions
  relative to a display would fix it. See [[layout-and-monitors]].
- **An ARM64 build.** Nothing in the design prevents it; it is a packaging and testing question.
- **Accessibility for board contents.** Boards are custom-painted, so a screen reader sees nothing
  useful. Exposing them through UI Automation is a substantial piece of work and it is the limitation
  that most clearly excludes people.
- **Localized application strings.** The interface is icon-driven so the surface is small, but error
  text is English. See [[languages]].

## Unlikely

- **Automatic filing rules.** Repeatedly requested, and still the feature most likely to move a file
  somewhere its owner did not choose.
- **Cloud sync of layouts.** Would require an account, a server and network access, ending the claim
  in [[privacy-and-data]]. Copying [[config-json]] already works — see [[backup-and-restore]].
- **A portable build for end users.** The Store version is signed, updates itself and uninstalls
  cleanly.

## Permanently out of scope

These will not happen, and saying so is more useful than leaving them open:

- A plugin or extension system — nothing third-party is ever loaded into this process
- Theming engines, docks, widgets, wallpaper management
- Replacing or extending File Explorer
- Global keyboard hooks
- Any telemetry, analytics or crash reporting
- Advertising, or a free ad-supported tier

## How to influence it

Open an issue or send an email — both are on [[support]]. With no telemetry, requests and bug reports
are the only signal there is, so they carry real weight. See [[no-telemetry-by-default]].`,
  });

  /* ================================================================== PRIVACY */

  prose({
    path: "privacy/", section: "privacy", title: "Privacy policy",
    description:
      "DeskDrawer's privacy policy: no personal data collected, no telemetry, no accounts, and no network connections made by the application.",
    lede: "DeskDrawer does not collect personal data, and makes no network connections of its own.",
    body: `## Summary

DeskDrawer does not collect personal data. It contains no ads, telemetry, analytics SDKs, crash
reporting, account systems, bundled plugins or unnecessary extensions. The application runs locally on
your Windows device and **makes no network connections of its own** — no analytics, no crash
reporting, no update checks, no accounts.

Purchase and licence verification, where they apply, are performed by Windows and the Microsoft Store,
not by the application.

## What is stored

DeskDrawer stores only the local configuration required to remember your boards, icon assignments,
layout and preferences, plus a local error log.

| File | Contents |
|---|---|
| \`config.json\` | Boards, their geometry and settings, and which icon belongs to which board |
| \`error.log\` | Unexpected internal errors, in plain text |

Both are stored on your device — in the application's per-user data folder for the Store version, or
in \`%APPDATA%\\DeskDrawer\` for portable builds — and never leave it.

## What is not stored

No file contents. No history of what you have opened. No search index, thumbnail database or cache.
No identifiers of any kind.

## What is transmitted

Nothing. There is no code in DeskDrawer that opens a network connection. This is verifiable with any
firewall or network monitor, which is the reason it is built that way rather than as reduced or
anonymized collection. The reasoning is in [[no-telemetry-by-default]].

## Diagnostics

If you choose to report a problem, you may attach \`error.log\` yourself. It is plain text and you can
read it first. Nothing is sent automatically. See [[support]].

## Data deletion

Uninstalling the Store version removes its data folder automatically. For portable builds, delete the
folder. Your desktop files are never affected — see [[uninstall]].

## Children

DeskDrawer is a desktop utility with no accounts, no content and no communication features, and
collects no data from anyone, including children.

## Changes

Material changes to this policy will appear in the [[changelog|release notes]] alongside the release
that makes them.

## Contact

[${SITE.email}](mailto:${SITE.email}) or the [issue tracker](${SITE.issues}).`,
  });

  /* ================================================================== SUPPORT */

  prose({
    path: "support/", section: "support", title: "Support",
    description:
      "How to report a DeskDrawer bug, request a feature or get help — and why bug reports matter more for a product with no telemetry.",
    lede: "Two channels, both read by the developer directly.",
    body: `## Where to write

- **Bugs and feature requests:** [GitHub Issues](${SITE.issues}) — public, and needs a GitHub account
- **Email:** [${SITE.email}](mailto:${SITE.email}) — private, and needs nothing

Both are read by the person who writes the code. Feature requests are as welcome as bug reports:
with no telemetry there is no other way to learn what people actually want changed.

## Before writing

Most reported problems are covered by [[troubleshooting]] — an empty desktop, boards off-screen, a
freeze caused by an offline network location, startup not sticking. It is worth thirty seconds.

## What makes a report useful

1. **Your DeskDrawer version** — currently ${SITE.version}; see [[changelog|release notes]].
2. **Windows version**, and whether the desktop is backed up by OneDrive or another sync client.
3. **What you did**, in the order you did it.
4. **\`error.log\`**, from the tray menu → **Open the configuration folder**. It is plain text, you can
   read it before sending, and it makes a fix far more likely.

If the problem involves a freeze, mention whether any network drive, VPN or NAS was disconnected —
that is the cause of nearly every freeze this product has had. See [[offline-network-shares]].

## Why your report matters more than usual

DeskDrawer has no [[telemetry]]. No crash reporting, no analytics, no usage data. When something
breaks on your machine, nothing tells the developer — not the fact, not the frequency, not the Windows
build.

That is a deliberate privacy decision with a real cost, explained in [[no-telemetry-by-default]]. The
practical consequence is that your report may be the only signal a problem exists.

## Response

DeskDrawer is built by one person, so replies are not instant. Every report is read by the person who
writes the code — there is no queue in between. When a report leads to a fix, that fix ships through
the Microsoft Store and the [[changelog|release notes]] name the version it landed in.

## Refunds

Microsoft Store purchases are covered by Microsoft's refund policy and are requested through your
Microsoft account rather than from the developer. See [[licensing]].`,
  });

  /* ================================================================== CHANGELOG */

  const relHtml = RELEASES.map((r) => {
    const id = `v${r.version.replace(/\./g, "-")}`;
    const reading = (r.reading || [])
      .map((s) => {
        const n = NOTES.find((x) => x.slug === s);
        return n ? `<a href="/notes/${n.slug}/">${esc(n.title)}</a>` : "";
      })
      .filter(Boolean);
    return `<li id="${id}">
      <div class="rel-ver">
        <span class="v">${esc(r.version)}</span>
        ${r.version === SITE.version ? '<span class="badge">Current</span>' : ""}
        <span style="color:var(--muted2);font-size:14px">${r.date ? esc(fmtDate(r.date)) : "before the public repository"} · ${esc(r.kind)}</span>
      </div>
      <p style="color:var(--muted);margin-bottom:12px">${esc(r.summary)}</p>
      <ul>${r.notes.map((n) => `<li>${md(n).html.replace(/^<p>|<\/p>$/g, "")}</li>`).join("")}</ul>
      ${reading.length ? `<p style="font-size:14px;color:var(--muted2)">Background: ${reading.join(" · ")}</p>` : ""}
    </li>`;
  }).join("");

  pages.push({
    path: "changelog/", section: "changelog",
    title: "Release notes",
    description: `Every DeskDrawer release through version ${SITE.version}, what changed in it, and the engineering notes behind the significant ones.`,
    crumbs: [{ name: "Release notes", href: "/changelog/" }],
    body:
      docHeader({
        title: "Release notes",
        lede: `Every released version of DeskDrawer, newest first — ${RELEASES.length} of them, of which ${RELEASES.filter((r) => r.kind === "Fix" || r.kind === "Stability").length} fixed things rather than adding them. Dates come from the public repository, which is why the earliest releases have none — they predate it.`,
        meta: [`Current version ${SITE.version}`, `Updated ${fmtDate(SITE.updated)}`],
      }) + `<ul class="rel-list">${relHtml}</ul>`,
    schema: {
      "@type": "ItemList",
      "@id": `${url("changelog/")}#releases`,
      name: "DeskDrawer release history",
      numberOfItems: RELEASES.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: RELEASES.map((r, n) => ({
        "@type": "ListItem",
        position: n + 1,
        item: {
          "@type": "SoftwareApplication",
          name: `DeskDrawer ${r.version}`,
          softwareVersion: r.version,
          ...(r.date ? { datePublished: r.date } : {}),
          operatingSystem: "Windows 10, Windows 11",
          applicationCategory: "ProductivityApplication",
          releaseNotes: r.summary,
          url: `${url("changelog/")}#v${r.version.replace(/\./g, "-")}`,
        },
      })),
    },
    plain: RELEASES.map((r) => `DeskDrawer ${r.version}${r.date ? ` (${r.date})` : ""}: ${r.summary} ${r.notes.map(plain).join(" ")}`).join("\n\n"),
  });

  /* ================================================================== DOCS HUB */

  pages.push({
    path: "docs/", section: "docs",
    title: "DeskDrawer documentation",
    description: `Complete documentation for DeskDrawer: getting started, boards, menus, sorting, multi-monitor layout, privacy, architecture and troubleshooting.`,
    crumbs: [{ name: "Documentation", href: "/docs/" }],
    sidebar: docSidebar(null),
    body:
      docHeader({
        title: "Documentation",
        lede: "Everything about how DeskDrawer behaves, why it behaves that way, and where it stops. Written by the person who built it.",
        meta: [`${DOCS.length} pages`, `DeskDrawer ${SITE.version}`, `Updated ${fmtDate(SITE.updated)}`],
      }) +
      `<p>New here? Start with <a href="/docs/getting-started/">Getting started</a>. Deciding whether to buy? <a href="/docs/limitations/">Limitations</a> is the most useful page on this site.</p>` +
      DOC_GROUPS.map(
        (g) => `<h2 id="${g.title.toLowerCase().replace(/\s+/g, "-")}">${esc(g.title)}</h2>
        <div class="term-grid" style="margin-bottom:8px">${g.items
          .map((it) => `<a href="/docs/${it.slug}/"><div class="t">${esc(it.title)}</div><div class="d">${esc(it.description)}</div></a>`)
          .join("")}</div>`
      ).join(""),
    schema: {
      "@type": "ItemList",
      "@id": `${url("docs/")}#index`,
      name: "DeskDrawer documentation",
      numberOfItems: DOCS.length,
      itemListElement: DOCS.map((d, n) => ({
        "@type": "ListItem", position: n + 1, name: d.title, url: url(`docs/${d.slug}/`),
      })),
    },
    plain: `DeskDrawer documentation index. ${DOCS.map((d) => `${d.title}: ${d.description}`).join(" ")}`,
  });

  /* ================================================================== FAQ HUB */

  const faqSections = FAQ_CATEGORIES.map((cat) => {
    const items = FAQS.filter((f) => f.cat === cat.id);
    return `<section class="qa-group" data-group id="${cat.id}">
      <h2>${esc(cat.title)}</h2>
      <p class="gd">${esc(cat.description)}</p>
      ${items
        .map((f) => {
          const answer = md(resolveRefs(f.a, `faq#${f.slug}`)).html;
          const key = `${f.q} ${plain(resolveRefs(f.a, `faq#${f.slug}`))}`.toLowerCase().replace(/"/g, "");
          return `<details id="${f.slug}" data-k="${esc(key)}">
            <summary>${esc(f.q)}<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></summary>
            <div class="body">${answer}</div>
          </details>`;
        })
        .join("")}
    </section>`;
  }).join("");

  pages.push({
    path: "faq/", section: "faq",
    title: "DeskDrawer questions & answers",
    description:
      "Straight answers about DeskDrawer: whether it moves your files, what it stores, how the one-time purchase works, and what to do when something goes wrong.",
    crumbs: [{ name: "Questions & answers", href: "/faq/" }],
    body:
      docHeader({
        title: "Questions & answers",
        lede: "Short answers, grouped by topic. Where a question needs more room, the answer links to the documentation page that carries it.",
        meta: [`${FAQS.length} questions`, `DeskDrawer ${SITE.version}`, `Updated ${fmtDate(SITE.updated)}`],
      }) +
      `<div class="finder">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
         <input type="search" id="q" placeholder="Search the questions…" aria-label="Search questions" data-finder="#qa" autocomplete="off" />
       </div>
       <p class="finder-count" data-finder-count>Showing all ${FAQS.length}</p>
       <div id="qa" class="faq-sections">${faqSections}</div>
       <p style="margin-top:44px">Still stuck? <a href="/support/">Get in touch</a> — DeskDrawer has no telemetry, so a report may be the only signal a problem exists.</p>`,
    // FAQPage describes exactly what is on this page: every question and answer below
    // is present in the HTML, inside an accordion the reader can open.
    schema: {
      "@type": "FAQPage",
      "@id": `${url("faq/")}#faq`,
      inLanguage: "en",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        url: `${url("faq/")}#${f.slug}`,
        acceptedAnswer: { "@type": "Answer", text: plain(resolveRefs(f.a, `faq#${f.slug}`)) },
      })),
    },
    plain: FAQS.map((f) => `Q: ${f.q}\nA: ${plain(resolveRefs(f.a, `faq#${f.slug}`))}`).join("\n\n"),
    head: `<style>.faq-sections details{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:border-color .25s,background .25s;margin-bottom:8px}
.faq-sections details[open]{border-color:var(--border-hi);background:var(--card-hi)}
.faq-sections summary{list-style:none;cursor:pointer;padding:16px 20px;font-weight:600;font-size:16px;display:flex;justify-content:space-between;align-items:center;gap:16px;color:var(--text)}
.faq-sections summary::-webkit-details-marker{display:none}
.faq-sections .chev{width:19px;height:19px;flex:none;color:var(--muted);transition:transform .3s}
.faq-sections details[open] .chev{transform:rotate(180deg);color:var(--a1)}
.faq-sections .body{padding:0 20px 18px}
.faq-sections .body>*:last-child{margin-bottom:0}</style>`,
  });

  /* ================================================================== GLOSSARY HUB */

  pages.push({
    path: "glossary/", section: "glossary",
    title: "The DeskDrawer glossary",
    description: `Canonical definitions for ${TERMS.length} DeskDrawer concepts — boards, board membership, the native icon layer, reparse points, the configuration file and more.`,
    crumbs: [{ name: "Glossary", href: "/glossary/" }],
    body:
      docHeader({
        title: "Glossary",
        lede: "Every concept in DeskDrawer, defined once and properly. Each term has its own page with the full explanation.",
        meta: [`${TERMS.length} terms`, `Updated ${fmtDate(SITE.updated)}`],
      }) +
      `<div class="finder">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
         <input type="search" placeholder="Search terms…" aria-label="Search glossary terms" data-finder="#terms" autocomplete="off" />
       </div>
       <p class="finder-count" data-finder-count>Showing all ${TERMS.length}</p>
       <div id="terms"><div class="term-grid" data-group>${TERMS.map(
         (t) => `<a href="/glossary/${t.slug}/" data-k="${esc(`${t.term} ${(t.aka || []).join(" ")} ${t.short}`.toLowerCase().replace(/"/g, ""))}">
           <div class="t">${esc(t.term)}</div><div class="d">${esc(t.short.length > 130 ? t.short.slice(0, 127).replace(/\s+\S*$/, "") + "…" : t.short)}</div>
         </a>`
       ).join("")}</div></div>`,
    schema: {
      "@type": "DefinedTermSet",
      "@id": `${url("glossary/")}#set`,
      name: "The DeskDrawer glossary",
      description: "Canonical definitions of the concepts used by DeskDrawer, a Windows desktop organizer.",
      url: url("glossary/"),
      inLanguage: "en",
      publisher: { "@id": `${SITE.origin}/#organization` },
      hasDefinedTerm: TERMS.map((t) => ({
        "@type": "DefinedTerm", name: t.term, description: t.short, url: url(`glossary/${t.slug}/`), termCode: t.slug,
      })),
    },
    plain: TERMS.map((t) => `${t.term}: ${t.short}`).join("\n"),
  });

  /* ================================================================== NOTES HUB */

  pages.push({
    path: "notes/", section: "notes",
    title: "Engineering notes",
    description:
      "First-hand notes on how DeskDrawer is built: design decisions, Windows integration, the bugs that shipped, and what eight rounds of code audits found.",
    crumbs: [{ name: "Engineering notes", href: "/notes/" }],
    body:
      docHeader({
        title: "Engineering notes",
        lede: "Design decisions, Windows integration problems, and the bugs that shipped — written by the person who wrote the bugs.",
        meta: [`${NOTES.length} notes`, `<a href="/rss.xml">RSS</a>`],
      }) +
      `<ul class="note-list">${NOTES.map(
        (n) => `<li><a href="/notes/${n.slug}/">
          <div class="k">${esc(n.tag)} · ${esc(fmtDate(n.date))}</div>
          <div class="t">${esc(n.title)}</div>
          <div class="d">${esc(n.description)}</div>
        </a></li>`
      ).join("")}</ul>`,
    schema: {
      "@type": "Blog",
      "@id": `${url("notes/")}#blog`,
      name: "DeskDrawer engineering notes",
      description: "First-hand notes on the design and implementation of DeskDrawer.",
      url: url("notes/"),
      inLanguage: "en",
      publisher: { "@id": `${SITE.origin}/#organization` },
      author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
      blogPost: NOTES.map((n) => ({
        "@type": "BlogPosting", headline: n.title, description: n.description,
        datePublished: n.date, url: url(`notes/${n.slug}/`),
        author: { "@type": "Person", name: SITE.author.name },
      })),
    },
    plain: NOTES.map((n) => `${n.title}: ${n.description}`).join("\n"),
  });

  /* ================================================================== 404 */

  pages.push({
    path: "404", section: "", noindex: true, wide: true,
    title: "Page not found",
    description: "That page does not exist on deskdrawer.pages.dev.",
    body: `<section class="hero wrap">
      <span class="eyebrow"><span class="dot" style="background:#ffb454;box-shadow:0 0 12px #ffb454"></span> 404</span>
      <h1>That page does not exist</h1>
      <p class="sub">The link may be out of date, or the address slightly wrong. Everything on this site is reachable from the pages below.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="/">Home</a>
        <a class="btn btn-ghost" href="/docs/">Documentation</a>
        <a class="btn btn-ghost" href="/faq/">Questions &amp; answers</a>
        <a class="btn btn-ghost" href="/glossary/">Glossary</a>
      </div>
    </section>`,
  });

  return pages;
}
