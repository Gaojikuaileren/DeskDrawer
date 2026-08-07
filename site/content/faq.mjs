/**
 * Questions and answers.
 *
 * These live on ONE well-organized page, grouped by topic and linkable by anchor.
 * They are deliberately not split into a page each: most are two-paragraph answers,
 * and a page per question would be a hundred thin pages competing with the
 * documentation that actually explains the subject. Where a question needs depth,
 * the answer is short and links to the documentation page that carries it.
 */

export const FAQ_CATEGORIES = [
  { id: "basics", title: "The basics", description: "What DeskDrawer is and who it is for." },
  { id: "files", title: "Your files and safety", description: "What happens to the files on your desktop. The short answer is: nothing." },
  { id: "using", title: "Using it day to day", description: "Boards, menus, sorting, dragging and the small things people ask about first." },
  { id: "languages", title: "Languages", description: "What is translated, what is not, and why it matters less than you would expect." },
  { id: "windows", title: "Windows behaviour", description: "How DeskDrawer sits inside Windows, and where it deliberately differs." },
  { id: "privacy", title: "Privacy and data", description: "What is stored, what is sent, and how you can verify it." },
  { id: "buying", title: "Buying, licensing and updates", description: "The one-time purchase, and what it does and does not cover." },
  { id: "trouble", title: "When something is wrong", description: "The problems that actually come up, and what to do about them." },
];

export const FAQS = [
  /* ------------------------------------------------------------------ basics */
  {
    slug: "what-is-deskdrawer", cat: "basics",
    q: "What is DeskDrawer?",
    a: `DeskDrawer is a lightweight [[desktop-organizer|desktop organizer]] for Windows 10 and 11. It
groups the icons, files, folders and shortcuts on your desktop into transparent [[board|boards]] —
labelled containers drawn straight onto your wallpaper — so a crowded desktop becomes readable
without anything being moved into folders.

It is a single-purpose tool. It does not launch things, theme anything, manage windows or replace
Explorer. It groups desktop icons, and it is sold as a [[one-time-purchase]] with no ads, telemetry
or subscription.`,
  },
  {
    slug: "who-is-it-for", cat: "basics",
    q: "Who is DeskDrawer for?",
    a: `People whose desktop is a working surface rather than an empty wallpaper: current projects,
downloads in progress, files that will be dealt with this week, tools reached daily.

It fits if you want a cleaner desktop but do not want to install a large personalization suite, and
if you would rather your files stayed exactly where they are. It does not fit if you want automatic
filing rules, a launcher, widgets or theming — those are all deliberately out of scope, as listed in
[[limitations]].`,
  },
  {
    slug: "why-not-just-use-folders", cat: "basics",
    q: "Why not just put everything into folders?",
    a: `Folders work, and if a folder solves your problem you do not need this.

But the reason a file ends up on a desktop in the first place is usually that you want to see it, and
a folder hides its contents behind a double-click — which is the thing you were avoiding. A board
groups your desktop icons while leaving every one of them visible.

There are two other differences. Filing moves files, so every path that pointed at them now points
somewhere else; a board records only which icons belong together, so nothing on disk moves — see
[[board-membership]]. And a desktop you sort by hand on Monday is untidy again by Friday, because
downloads and screenshots keep arriving; new items simply join the [[default-board]] instead.`,
  },
  {
    slug: "how-is-it-different", cat: "basics",
    q: "How is DeskDrawer different from other desktop organizers?",
    a: `Three concrete differences.

**No title bars.** Board controls sit in one small widget in the bottom-right corner instead of a
strip along the top of every board. With six boards on screen, that is roughly a tenth of your
display returned to you. The reasoning is in [[why-boards-have-no-title-bar]].

**One process, no services.** DeskDrawer runs from the tray with no background services, no shell
extension and no plugin host. See [[architecture]].

**No network access at all.** Not reduced telemetry — none, and no code that could send anything. See
[[privacy-and-data]].

A fuller comparison against the "full desktop suite" category is on the [[compare|Why DeskDrawer]]
page.`,
  },
  {
    slug: "fences-alternative", cat: "basics",
    q: "Is DeskDrawer an alternative to Stardock Fences?",
    a: `Only in a narrow sense, and it is worth being straight about that before you spend anything.

Fences, by Stardock, has been the established tool in this category since 2009, and it does
considerably more than DeskDrawer does: rules that sort new icons into groups by themselves, folder
portals that mirror a folder onto the desktop, several pages of groups to move between, and a wide
set of appearance options. None of that is planned here — see [[limitations]] and the [[roadmap]].

DeskDrawer covers the smaller part of the same ground. It groups desktop icons into boards, and that
is the entire product: one tray process, nothing to configure beyond the boards themselves.

Neither tool files your desktop away into folders on disk — both group icons visually and leave the
files in your Desktop folder — so the choice between them is about scope, not about safety. If
grouping icons was the only part you wanted, DeskDrawer is the smaller tool. If you wanted the rules
and the portals, buy the one that has them.

For what Fences currently costs and includes, check Stardock — that changes, and a figure repeated
here would go stale.`,
  },
  {
    slug: "is-it-free", cat: "basics",
    q: "Is DeskDrawer free?",
    a: `No. It is a paid application sold as a one-time purchase on the Microsoft Store — you buy it
once and keep it, with no subscription, no renewal and no in-app purchases.

There is no advertising-supported version, because there is no advertising. See [[licensing]].`,
  },
  {
    slug: "does-it-slow-down-my-pc", cat: "basics",
    q: "Will DeskDrawer slow down my PC?",
    a: `It is designed not to. At rest it runs no polling loop and no timer — it waits on change
notifications for your desktop folder and the Recycle Bin and otherwise does nothing. There are no
background services; the whole application is one tray process.

Rather than trust a number from someone else's machine, check yours: **Task Manager → Details →
DeskDrawer.exe**. [[performance]] and [[memory-usage]] explain what drives those figures.`,
  },

  /* ------------------------------------------------------------------ files */
  {
    slug: "does-it-move-my-files", cat: "files",
    q: "Does DeskDrawer move or change my files?",
    a: `No. Your files stay in your desktop folder, at their original paths. DeskDrawer stores only
[[board-membership]] — a record of which board each icon belongs to — in its own configuration file.

Dragging an icon between boards changes that record and nothing else. No file is moved, copied,
renamed or altered. Every shortcut, script, backup rule and recent-files entry that pointed at a file
still points at it.

The one exception is deliberate and matches the real desktop: dropping a file **onto a folder icon**
moves it into that folder. See [[drag-and-drop]].`,
  },
  {
    slug: "what-happens-if-i-uninstall", cat: "files",
    q: "What happens to my files if I uninstall DeskDrawer?",
    a: `Nothing. Every file is exactly where it always was, because DeskDrawer never moved anything.
Uninstalling a desktop organizer should not be a data decision, and with DeskDrawer it is not.

If the desktop looks empty immediately after uninstalling while DeskDrawer was still running, the
icons return at your next sign-in — or right away via right-click the desktop → **View** → **Show
desktop icons**. The full procedure is in [[uninstall]].`,
  },
  {
    slug: "does-deleting-a-board-delete-files", cat: "files",
    q: "If I delete a board, do I lose the files in it?",
    a: `No. Deleting a board is purely organizational: its icons return to the [[default-board]] and not
one file is touched.

A board never contained your files in the first place — it contained a list of which icons belong to
it. There is no way for deleting a board to lose data.`,
  },
  {
    slug: "what-if-deskdrawer-crashes", cat: "files",
    q: "What happens to my files if DeskDrawer crashes?",
    a: `Nothing happens to your files — DeskDrawer does not hold them and does not have them open.

Your board layout is protected separately: [[config-json]] is written to a temporary file and swapped
into place atomically, so an interrupted save cannot leave a half-written configuration. Your desktop
icons reappear at the next sign-in even if DeskDrawer stopped without cleaning up, because hiding them
is session-scoped and never written to a Windows setting.`,
  },
  {
    slug: "can-i-recover-my-layout", cat: "files",
    q: "Can I back up or move my board layout?",
    a: `Yes — copy one file. [[config-json]] in the [[configuration-folder]] holds every board, its
geometry, its settings and its icon assignments. Tray menu → **Open the configuration folder** takes
you there.

Restoring is the same in reverse: quit DeskDrawer, put the file back, start it again. Carrying your
layout to a new PC works the same way — if its monitors are arranged differently, **Fix misplaced
boards** settles the positions afterwards. Setting up a fresh Windows install is the easiest time to
do this, since the desktop starts empty. See [[backup-and-restore]].`,
  },
  {
    slug: "does-it-work-with-onedrive", cat: "files",
    q: "Does DeskDrawer work with a OneDrive-backed desktop?",
    a: `Yes, and it is a case the product has been specifically fixed for more than once.

A OneDrive-backed Desktop folder is a redirected folder full of online-only
[[cloud-placeholder|placeholders]]. DeskDrawer reads placeholder metadata without forcing files to
download, and shows a generic icon for a file that is still downloading, swapping in the real one when
it arrives.

Getting the redirected-folder detection right took three attempts — the story, including a version
where OneDrive desktops stopped refreshing, is in [[reparse-points-and-onedrive]].`,
  },
  {
    slug: "network-drives", cat: "files",
    q: "Can I put shortcuts to network locations on a board?",
    a: `Yes. Be aware that a target which is offline — a disconnected VPN, a sleeping NAS, a mapped
drive that is gone — cannot produce an icon or a tooltip until Windows gives up waiting for it.

DeskDrawer does that work off the interface thread so the application stays responsive, but that one
item will be slow. If you are seeing outright freezes, make sure you are on the current version:
[[offline-network-shares]] lists five separate fixes in this area.`,
  },

  /* ------------------------------------------------------------------ using */
  {
    slug: "where-do-i-start", cat: "using",
    q: "My desktop is a mess. Where do I start?",
    a: `By doing nothing, first. DeskDrawer reads your desktop on its first run and puts everything it
finds on one board, so the clutter is already contained before you have made a single decision.

From there the useful order is: make a second board, drag a related group of icons onto it, then size
and place the two boards. Repeat until what is left on the first board is genuinely miscellaneous —
that board becomes your inbox rather than a failure. Most desktops settle at three to six boards.

You do not have to get it right immediately, because nothing you do here touches a file. See
[[getting-started]].`,
  },
  {
    slug: "how-do-i-create-a-board", cat: "using",
    q: "How do I create a new board?",
    a: `Right-click the DeskDrawer tray icon and choose **New board**, or right-click any board's name
block and choose the same. An empty board appears, and you can drag icons into it straight away.

New boards are numbered rather than named — see [[why-are-boards-numbered]].`,
  },
  {
    slug: "how-do-i-rename-a-board", cat: "using",
    q: "How do I rename a board?",
    a: `Double-click its name in the bottom-right [[board-widget]], or right-click the name and choose
**Rename**. It edits in place.`,
  },
  {
    slug: "how-do-i-move-a-board", cat: "using",
    q: "How do I move or resize a board?",
    a: `Drag the **name block** in the bottom-right corner to move it. Drag the [[corner-grip]] beside
it to resize.

Both snap — to the [[icon-grid]], to screen edges and to other boards — so boards line up without
pixel-nudging and never end up a fraction of an icon too narrow.`,
  },
  {
    slug: "where-are-the-controls", cat: "using",
    q: "Where are a board's controls? I do not see a title bar.",
    a: `There is not one. Every control is in a compact widget in the board's **bottom-right corner**:
fold arrow, name block, resize grip.

If you have turned outlines off, the widget appears only when your pointer is over the board. That is
the intended resting state — the tool disappears and your icons remain. See [[boards]], and
[[why-boards-have-no-title-bar]] for why the title bar was removed.`,
  },
  {
    slug: "how-do-i-fold-a-board", cat: "using",
    q: "What does folding a board do?",
    a: `The **▾** arrow collapses the board to a small square showing only its name, freeing the space
its icons used. Nothing is lost: a [[folded-board]] keeps every icon assigned to it and unfolds to its
previous size and position.

It is the right state for a board you want to keep organized but rarely open.`,
  },
  {
    slug: "can-i-sort-boards-differently", cat: "using",
    q: "Can different boards be sorted differently?",
    a: `Yes — [[sort-mode|sorting]] is per board, which is the point. An installers board is best by
date descending, a projects board by name, a scratch board left in manual order.

Five modes: manual, name, type, size and date, each ascending or descending. Manual is a real stored
order, not "unsorted" — switching to an automatic mode and back returns the arrangement you had. See
[[sorting]].`,
  },
  {
    slug: "how-many-boards", cat: "using",
    q: "How many boards can I have?",
    a: `There is no fixed limit. In practice the useful number is set by your screen: boards are meant
to be visible at once, so most layouts settle at somewhere between three and eight.`,
  },
  {
    slug: "do-i-get-the-real-right-click-menu", cat: "using",
    q: "Do I get the real Windows right-click menu on a board?",
    a: `Yes — the genuine one, not an imitation. DeskDrawer asks the Windows shell for each item's
context menu and shows that, so every extension you have installed appears: 7-Zip, Git, your editor,
your antivirus, your cloud client, **Open with**, **Send to**, **Copy as path**, **Share**, **Restore
previous versions**.

Since 1.2.1 it is the full menu — the equivalent of Windows 11's **Show more options** — rather than a
subset. See [[menus]].`,
  },
  {
    slug: "can-i-create-new-files-on-a-board", cat: "using",
    q: "Can I create a new file or folder directly on a board?",
    a: `Yes. Right-click empty space on a board and you get the desktop's own context menu, including
**New**. The item is created on your desktop and assigned to the board you clicked in.

This path was hardened considerably in 1.2.0 and 1.2.2 — creating several items in a row now works
reliably on every route, including the classic "Show more options" menu.`,
  },
  {
    slug: "keyboard-shortcuts", cat: "using",
    q: "What keyboard shortcuts does DeskDrawer support?",
    a: `The ones you already use on the desktop: <kbd>Enter</kbd> to open, <kbd>F2</kbd> to rename,
<kbd>Delete</kbd> to recycle, <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>,
<kbd>Ctrl</kbd>+<kbd>X</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd> and <kbd>Esc</kbd>.

There are no DeskDrawer-specific shortcuts to learn, and no global hotkeys — see
[[why-no-global-hotkey]]. The full table is in [[keyboard-and-mouse]].`,
  },
  {
    slug: "select-across-boards", cat: "using",
    q: "Can I select icons across several boards at once?",
    a: `Yes. Start a drag on empty space — inside a board or on bare desktop between boards — and the
[[marquee-selection|selection band]] crosses board boundaries, selecting everything it touches. Hold
<kbd>Ctrl</kbd> to add to an existing selection.

The mixed selection can then be dragged, copied, cut or deleted as one unit.`,
  },
  {
    slug: "drag-into-a-folder", cat: "using",
    q: "Can I drag a file into a folder shown on a board?",
    a: `Yes, and this is the one gesture that actually moves a file, exactly as on the real desktop. The
target folder highlights while you drag over it so the intent is never ambiguous, and dragging across
drives copies rather than moves — matching Explorer, so nothing is silently removed from a USB stick.

Folder shortcuts work as targets too, not only real folders. See [[drag-into-folder]].`,
  },
  {
    slug: "drag-out-to-explorer", cat: "using",
    q: "Can I drag files from a board into other applications?",
    a: `Yes. Drag icons off a board into File Explorer, an email, a chat window or anything else that
accepts files, and the real files are transferred with normal Windows semantics. Dragging in from
Explorer works too — the files land on your desktop and join the board you dropped them on.`,
  },
  {
    slug: "hide-boards-temporarily", cat: "using",
    q: "Can I see the plain Windows desktop without quitting DeskDrawer?",
    a: `Yes. Tray menu → **Switch view**. Boards hide, the native icons come back, and DeskDrawer keeps
running. Switch again to return.

The two are never shown at once, because that would display every desktop item twice. See
[[view-mode]].`,
  },
  {
    slug: "change-icon-size", cat: "using",
    q: "Can I change how big the icons are?",
    a: `Yes — four sizes, set per board, from the **Icon size** submenu of the [[board-menu]]. Because
icon size changes how many icons fit per row, DeskDrawer re-tiles afterwards so boards stay inside
the visible work area and do not overlap. See [[icon-sizes]].`,
  },
  {
    slug: "hide-board-outlines", cat: "using",
    q: "Can I hide the board outlines?",
    a: `Yes, per board, from the [[board-menu]]. With outlines off, a board is just your icons on your
wallpaper and the control widget fades in only on hover. Rounded corners are a separate toggle in the
same menu.`,
  },
  {
    slug: "multiple-monitors", cat: "using",
    q: "Does DeskDrawer work with multiple monitors?",
    a: `Yes. Boards can be placed on any display and dragged between displays, and each is kept inside
that monitor's work area so it is never positioned under the taskbar.

Mixed DPI is handled properly: DeskDrawer declares [[per-monitor-dpi|per-monitor v2 DPI awareness]],
so a laptop at 150% next to an external display at 100% stays crisp on both, including mid-drag. See
[[layout-and-monitors]].`,
  },
  {
    slug: "why-are-boards-numbered", cat: "using",
    q: "Why are new boards called 1, 2, 3 instead of having a name?",
    a: `Deliberate, since 1.0.5. A number reads the same in every language, so a layout never contains a
word its owner does not read. Double-click the name to change it to whatever you like.

It is part of a broader decision described in [[designing-for-language-independence]].`,
  },
  {
    slug: "automatic-sorting-rules", cat: "using",
    q: "Can DeskDrawer file new files into boards automatically?",
    a: `No, and this is a deliberate exclusion rather than a missing feature. There are no rules that
sort by type, name or age — new desktop items go to the [[default-board]] and you decide where they
belong.

Rule engines are how an organizer quietly becomes a filing system its owner did not design, and then
files end up somewhere nobody chose. See [[limitations]].`,
  },
  {
    slug: "why-no-global-hotkey", cat: "using",
    q: "Is there a global hotkey to show or hide boards?",
    a: `No. A global hotkey means a keyboard hook running for every keystroke on the machine, which is a
large permanent cost — in memory, in CPU and in trust — for a utility that is meant to be invisible.

**Switch view** in the tray menu does the same job without that cost.`,
  },

  /* ------------------------------------------------------------------ languages */
  {
    slug: "what-languages-does-it-support", cat: "languages",
    q: "What languages does DeskDrawer support?",
    a: `The DeskDrawer listing on the Microsoft Store is available in **16 languages**, so you can read
about the product in your own language before buying.

The application itself is a different matter, and a more interesting one: its interface is icon-only,
so there is very little text in it to translate in the first place. Most of the words you *do* see —
system icon names, the whole right-click menu — come from Windows in your own display language. The
distinction is explained in [[languages]].`,
  },
  {
    slug: "can-i-use-it-if-my-language-is-not-supported", cat: "languages",
    q: "Can I use DeskDrawer if my language is not one of the 16?",
    a: `Yes, comfortably. DeskDrawer is built so that using it barely depends on reading text at all.

Its two menus contain no sentences — every command is a glyph. New boards are numbered rather than
named. System items like *This PC* and *Recycle Bin* are named by Windows in your display language,
and the right-click menu on a file is Windows' own menu, so it arrives already translated including
third-party entries.

What remains in English is error text and the log file — things you meet only when something has gone
wrong. See [[languages]].`,
  },
  {
    slug: "does-it-need-much-reading", cat: "languages",
    q: "Does using DeskDrawer require much reading?",
    a: `Very little. The interactions are visual: drag an icon to a board, drag a corner to resize,
click an arrow to fold, right-click a name for an icon-only menu.

That was originally a decision about menu *size* — a menu of eight text commands is a large opaque
rectangle sitting on top of your desktop, while an icon menu is about a third of that. The
language-independence turned out to be the bigger benefit. See
[[designing-for-language-independence]].`,
  },
  {
    slug: "is-the-store-page-localized", cat: "languages",
    q: "Is the Microsoft Store page translated?",
    a: `Yes — the Store listing, including its description and feature list, is available in 16
languages. If your Store is set to one of them, you see it in your own language.

This website and its documentation are English only.`,
  },
  {
    slug: "is-the-app-fully-translated", cat: "languages",
    q: "Is the application itself fully translated into 16 languages?",
    a: `No, and it is worth being precise rather than letting the Store figure imply more than it should.

The **Store listing** is available in 16 languages. The **application** ships English-only strings —
but it owns very few strings, because its interface is icons and because the text-heavy parts
(context menus, system icon names) are provided by Windows in your display language.

So the accurate claim is not "DeskDrawer supports 16 languages" but "the Store listing is in 16
languages, and using the app depends very little on language at all." [[languages]] has the full
breakdown of what comes from where.`,
  },

  /* ------------------------------------------------------------------ windows */
  {
    slug: "which-windows-versions", cat: "windows",
    q: "Which versions of Windows does DeskDrawer run on?",
    a: `Windows 10 version 2004 (build 19041) or newer, and Windows 11, on x64.

The build floor is not arbitrary — DeskDrawer uses the packaged startup-task API for [[autostart]],
which is only available from that version. There is no ARM64 build today; see [[limitations]].`,
  },
  {
    slug: "do-i-need-net-runtime", cat: "windows",
    q: "Do I need to install .NET or any other runtime?",
    a: `No. DeskDrawer ships as a [[single-file-executable]] containing everything it needs, including
the runtime. Nothing is shared with other applications, so no framework update can break it.`,
  },
  {
    slug: "does-it-install-services", cat: "windows",
    q: "Does DeskDrawer install background services or shell extensions?",
    a: `No. No services, no drivers, no shell extensions, no scheduled tasks other than the startup task
you enable yourself, and no registry Run key. It is one tray process.

That also means DeskDrawer adds nothing to your right-click menus anywhere else in Windows. See
[[architecture]].`,
  },
  {
    slug: "win-d-does-not-hide-boards", cat: "windows",
    q: "Why does Win+D not hide my boards?",
    a: `Because your boards *are* the desktop now, so showing the desktop shows them — hiding them would
be the opposite of what you asked for. This changed in 1.1.2.

To bring minimized windows back, use the taskbar or <kbd>Alt</kbd>+<kbd>Tab</kbd>. See
[[windows-integration]].`,
  },
  {
    slug: "alt-f4-behaviour", cat: "windows",
    q: "Why does Alt+F4 open the shutdown dialog?",
    a: `Because that is what <kbd>Alt</kbd>+<kbd>F4</kbd> does on the Windows desktop, and boards are the
desktop. Since 1.1.0 a board behaves the same way rather than closing.

Closing a board with a system-wide window shortcut would be a destructive-feeling action triggered by
muscle memory, which is exactly the kind of surprise the product tries to avoid.`,
  },
  {
    slug: "does-it-replace-explorer", cat: "windows",
    q: "Does DeskDrawer replace Windows Explorer?",
    a: `No. Explorer keeps running and keeps owning the desktop; DeskDrawer hides Explorer's icon view
while it runs and draws its own boards. Quit DeskDrawer and Explorer's view comes straight back.

Everything file-related is still done by the Windows shell — menus, clipboard, opening files,
resolving shortcuts. See [[architecture]].`,
  },
  {
    slug: "recycle-bin-on-a-board", cat: "windows",
    q: "Do This PC and the Recycle Bin work on a board?",
    a: `Yes. Special shell items appear on boards and behave normally, and the Recycle Bin's icon updates
the moment the bin changes rather than on a timer — a change made in 1.1.0 that also lowered idle CPU.

Their names come from Windows in your display language. Note that since 1.1.1, deleting a special icon
from a board no longer also hides it on the real Windows desktop.`,
  },
  {
    slug: "multiple-users", cat: "windows",
    q: "Does DeskDrawer work on a shared PC with several user accounts?",
    a: `Yes. Configuration is per user, so each account gets its own boards, layout and startup setting —
which is correct, since each account has its own desktop.`,
  },
  {
    slug: "does-it-start-with-windows", cat: "windows",
    q: "Can DeskDrawer start automatically with Windows?",
    a: `Yes, off by default. Turn it on from the tray menu → **Run at startup**.

It registers as a proper Windows startup task, so it appears in **Task Manager → Startup apps** and
can be disabled there — and since 1.2.3 the tray toggle and Task Manager agree in both directions. See
[[autostart]].`,
  },

  /* ------------------------------------------------------------------ privacy */
  {
    slug: "does-it-collect-data", cat: "privacy",
    q: "Does DeskDrawer collect any data?",
    a: `No. There is no analytics SDK, no telemetry, no crash reporting, no account system, no
advertising identifier and no licence phone-home.

Stronger than that: **DeskDrawer opens no network connections of its own at all.** That is a claim you
can verify yourself with any firewall or network monitor, which is precisely why it was built that way
rather than as "anonymized analytics". See [[privacy-and-data]].`,
  },
  {
    slug: "does-it-show-ads", cat: "privacy",
    q: "Does DeskDrawer show ads?",
    a: `No. No ads, no sponsored entries, no upsell prompts, no bundled software and no notifications
trying to sell you anything. It is a paid application and that is the whole business model.`,
  },
  {
    slug: "what-does-it-store-locally", cat: "privacy",
    q: "What does DeskDrawer store on my machine?",
    a: `Two files in its [[configuration-folder]]:

- [[config-json]] — your boards, their geometry and settings, and which icon belongs to which board.
- [[error-log]] — a plain-text record of unexpected internal errors.

Neither leaves your device. There is no cache, no file index, no thumbnail database and no history of
what you have opened.`,
  },
  {
    slug: "can-it-read-my-files", cat: "privacy",
    q: "Can DeskDrawer read the contents of my files?",
    a: `It does not. DeskDrawer needs names, types, sizes, dates and icons to draw a board — it has no
reason to open a document and does not.

And since it makes no network connections, there is no mechanism by which anything it can see could
leave your machine.`,
  },
  {
    slug: "why-no-telemetry", cat: "privacy",
    q: "Why does DeskDrawer have no telemetry at all, not even anonymous?",
    a: `Because a desktop organizer sees the name of every file on your desktop, and that is a
surprisingly complete picture of what someone is working on. No anonymization scheme makes that
harmless.

So the rule is not "collect less" but "have no mechanism" — there is no code that opens a socket, so
there is nothing to misconfigure or leak later. The cost is real and paid by the developer: no crash
reports, no usage data, no idea when something breaks. That trade is written up honestly in
[[no-telemetry-by-default]].`,
  },
  {
    slug: "how-do-i-report-a-bug-privately", cat: "privacy",
    q: "If there is no crash reporting, how does the developer learn about bugs?",
    a: `Only from you. That is the direct cost of having no telemetry, and it means a bug report here
carries far more weight than it would for a typical product.

Attach [[error-log]] from the configuration folder — it is plain text and you can read it before
sending. See [[support]].`,
  },

  /* ------------------------------------------------------------------ buying */
  {
    slug: "is-it-one-time-purchase", cat: "buying",
    q: "Is DeskDrawer really a one-time purchase?",
    a: `Yes. Buy it once on the Microsoft Store and use it permanently. No subscription, no renewal, no
expiry, no in-app purchases, no "pro" tier — every feature is included. See [[licensing]].`,
  },
  {
    slug: "how-much-does-it-cost", cat: "buying",
    q: "How much does DeskDrawer cost?",
    a: `The current price is on the [[download|Microsoft Store listing]], which is the authoritative
source. No figure is printed on this site because Store pricing varies by market and changes over
time, and a stale number here would disagree with the page you actually buy from.`,
  },
  {
    slug: "how-many-pcs", cat: "buying",
    q: "Can I install DeskDrawer on more than one PC?",
    a: `Your licence is tied to your Microsoft account and handled by the Store, so installing on
another PC from your Store library works as it does for any Store application. Microsoft's Store terms
are authoritative on the specifics.`,
  },
  {
    slug: "how-do-updates-work", cat: "buying",
    q: "How do updates work, and do they cost anything?",
    a: `Updates arrive through the Microsoft Store and are included — there is no upgrade fee.
DeskDrawer contains no update checker of its own, because it makes no network connections; updating is
entirely the Store's job.`,
  },
  {
    slug: "is-it-actively-maintained", cat: "buying",
    q: "Is DeskDrawer actively maintained, and are bug reports welcome?",
    a: `Yes to both, and the [[changelog|release notes]] are the evidence rather than the claim: every
version is listed there with what changed in it. Twenty-three have shipped so far, twelve of them
fixing things rather than adding them, and the codebase has been through eight full review rounds —
what those found is written up in [[eight-rounds-of-audits]].

Bug reports and feature requests are genuinely wanted. Because DeskDrawer has no [[telemetry]], the
developer learns about a problem only when somebody writes in, so your report may be the only signal
that it exists. Both channels on the [[support]] page go straight to the person who writes the code,
and when a report leads to a fix the release notes name the version it landed in.`,
  },
  {
    slug: "is-there-a-trial", cat: "buying",
    q: "Is there a free trial?",
    a: `There is no trial build. Microsoft Store purchases are covered by Microsoft's refund policy, and
refunds are requested through your Microsoft account rather than from the developer.

The most useful thing to read before buying is [[limitations]], which lists plainly what DeskDrawer
does not do.`,
  },
  {
    slug: "portable-version", cat: "buying",
    q: "Is there a portable version?",
    a: `Not for end users. A [[portable-build]] exists for development and testing, but the Store version
is the supported route: it is signed, it updates itself, its startup integration works properly with
Task Manager, and it uninstalls cleanly.`,
  },
  {
    slug: "who-makes-deskdrawer", cat: "buying",
    q: "Who makes DeskDrawer?",
    a: `It is developed by Shipeng Ouyang and published as GaojiKuaileren — an independent product, not
affiliated with Microsoft. See [[about|About the developer]].`,
  },

  /* ------------------------------------------------------------------ trouble */
  {
    slug: "desktop-is-empty", cat: "trouble",
    q: "My desktop is empty and DeskDrawer is not running. How do I get my icons back?",
    a: `Right-click the desktop → **View** → **Show desktop icons**. If it already shows a check mark,
click it twice.

Or simply sign out and back in: DeskDrawer's hiding of the native icons is session-scoped and never
written to a Windows setting, so your icons return by themselves. See [[uninstall]].`,
  },
  {
    slug: "boards-off-screen", cat: "trouble",
    q: "My boards are off-screen or hidden behind the taskbar.",
    a: `Tray menu → **Fix misplaced boards**. It re-places only boards that are genuinely off-screen,
covered by the taskbar or overlapping; boards that are fine are left exactly where they are, and
contents, names and sizes are never changed.

This usually happens after a resolution change, unplugging a monitor, or moving the taskbar. See
[[layout-and-monitors]].`,
  },
  {
    slug: "it-freezes", cat: "trouble",
    q: "DeskDrawer freezes and my mouse wheel stops working.",
    a: `That specific pair of symptoms almost always means one thing: something on a board points at a
network location that is offline — a disconnected VPN, a sleeping NAS, a mapped drive that is gone.

Reconnect it or remove that item, and make sure you are on the current version: five separate cases of
this were fixed across 1.1.4, 1.2.2, 1.2.3, 1.2.4 and 1.2.5. The pattern is described in
[[offline-network-shares]].`,
  },
  {
    slug: "icons-are-grey", cat: "trouble",
    q: "Some icons are grey placeholders.",
    a: `Expected briefly on a large or cloud-backed desktop — boards draw first and icons fill in behind
them, so the interface never blocks. A cloud file that is still downloading shows a generic icon and
updates when it finishes.

If placeholders persist for a long time, something is pointing at a location Windows cannot reach. See
[[troubleshooting]].`,
  },
  {
    slug: "shortcut-does-nothing", cat: "trouble",
    q: "Clicking a shortcut does nothing.",
    a: `Its target has been deleted. Since 1.2.1 Windows' own *"Problem with Shortcut — do you want to
delete it?"* prompt appears, exactly as on the real desktop; earlier versions swallowed it.`,
  },
  {
    slug: "startup-does-not-stick", cat: "trouble",
    q: "\"Run at startup\" keeps turning itself off.",
    a: `Check **Task Manager → Startup apps**. DeskDrawer registers as a proper Windows startup task, so
a disable there wins — which is correct behaviour, just not obvious. Re-enable it in either place;
since 1.2.3 the two stay in agreement.`,
  },
  {
    slug: "how-do-i-get-help", cat: "trouble",
    q: "How do I report a bug or ask for a feature?",
    a: `Open an issue on GitHub, or email the developer — both are on the [[support]] page.

Attaching [[error-log]] from the configuration folder (tray menu → **Open the configuration folder**)
makes a fix far more likely. Because DeskDrawer has no telemetry, your report may genuinely be the
only signal that a problem exists.`,
  },
];
