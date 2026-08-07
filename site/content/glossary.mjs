/**
 * The DeskDrawer glossary.
 *
 * `short` is the canonical one-sentence definition. It is what appears in the
 * DefinedTerm schema, in api/glossary.json and in llms.txt, so it must stand alone
 * and be true without surrounding context.
 */

export const TERMS = [
  {
    slug: "desktop-organizer",
    term: "Desktop organizer",
    aka: ["desktop organiser", "desktop icon organizer"],
    short:
      "A desktop organizer is a utility that groups the icons on a computer's desktop into labelled containers so the desktop stays readable without files being moved or deleted.",
    related: ["board", "deskdrawer", "board-membership", "compare"],
    body: `A desktop organizer solves a specific problem: a desktop accumulates icons far faster than
anyone reorganizes them, and once there are more than about thirty the desktop stops working as a
place you can find things. Folders are the obvious answer, but a folder hides its contents behind a
double-click, which is exactly what people were trying to avoid by putting the file on the desktop.

An organizer takes a third path. It leaves every file where it is and draws grouped containers on
top of the desktop, so icons stay one click away but are no longer a single undifferentiated field.

## What separates one organizer from another

The category is broad. Some products are large personalization suites where icon grouping is one
feature among many — themes, docks, widgets, wallpaper engines, window management. Others, like
DeskDrawer, do only the grouping and try to be invisible otherwise.

The practical differences that matter when choosing:

- **Whether files move.** An organizer that physically relocates files into folders changes the
  meaning of every path that pointed at them. DeskDrawer never does this; see [[board-membership]].
- **How much screen space the tool takes for itself.** Title bars, toolbars and padding on every
  container add up quickly.
- **What runs in the background.** A tray application and a set of always-on services are very
  different propositions.
- **Licence model.** One-time purchase, subscription, or free-with-upsells.

## Related terms in this glossary

[[board]] · [[board-membership]] · [[drawer]] · [[native-icon-layer]]`,
  },

  {
    slug: "deskdrawer",
    term: "DeskDrawer",
    aka: ["DeskDrawer - Desktop Organizer"],
    short:
      "DeskDrawer is a lightweight desktop organizer for Windows 10 and 11 that groups desktop icons into transparent boards without moving the underlying files, sold as a one-time purchase with no ads, telemetry, accounts or network calls.",
    related: ["board", "desktop-organizer", "one-time-purchase", "architecture"],
    body: `DeskDrawer is a single-purpose Windows utility. It reads what is on your desktop, draws
transparent [[board|boards]] on top of the wallpaper, and lets you decide which icons belong to
which board. The files themselves are never touched — see [[board-membership]].

## Identity

| | |
|---|---|
| Product name | DeskDrawer |
| Store name | DeskDrawer - Desktop Organizer |
| Developer | Shipeng Ouyang |
| Publisher | GaojiKuaileren |
| Category | Productivity · desktop organizer |
| Platform | Windows 10 build 19041 or newer, Windows 11, x64 |
| Licence | Proprietary, one-time purchase |
| Distribution | Microsoft Store |

## What it deliberately is not

DeskDrawer is not a launcher, not a dock, not a theming engine, not a file manager and not a
wallpaper tool. It has no plugin system. These are not gaps waiting to be filled — they are the
reason the application stays small enough to run from the tray without a background service. The
[[roadmap|roadmap]] states which of them are permanently out of scope.

## How it behaves at a glance

- Boards are drawn as part of the desktop, not as ordinary windows, so <kbd>Win</kbd>+<kbd>D</kbd>
  and "Minimize all" leave them alone.
- The [[native-icon-layer]] is hidden only while DeskDrawer is running, and only for the current
  session.
- Right-clicking anything on a board opens the [[shell-context-menu]] — the real one, including
  third-party entries.
- Quitting restores the ordinary desktop immediately.`,
  },

  {
    slug: "board",
    term: "Board",
    aka: ["drawer", "desktop board"],
    short:
      "A board is a transparent, frameless container that DeskDrawer draws on the Windows desktop to hold a group of desktop icons; it stores which icons belong to it, not the files themselves.",
    related: ["drawer", "board-membership", "board-widget", "folded-board", "boards"],
    body: `A board is the central object in DeskDrawer. Visually it is a rectangle of your wallpaper
with an optional outline, holding a grid of icons. Functionally it is a named set of desktop entries
plus a position, a size, a sort order and an icon size.

## Anatomy

Every board has a compact [[board-widget]] in its bottom-right corner containing the fold arrow, the
board name and the [[corner-grip]]. There is no title bar along the top — this is deliberate, and it
is the single largest visual difference between DeskDrawer and most alternatives. A title bar costs
roughly one icon row of height on every board on screen.

## What a board stores

A board records the *identity* of the icons assigned to it, its rectangle in screen coordinates, its
[[sort-mode]], its [[icon-size]], and two appearance toggles ([[board-outline]] and rounded corners).
All of this lives in [[config-json]].

A board does **not** store your files, copies of your files, or paths that would break if a file
moved. See [[board-membership]] for the exact semantics.

## Behaviour that follows from being part of the desktop

Boards are not ordinary application windows. They sit at desktop level, which produces several
behaviours people notice:

- <kbd>Win</kbd>+<kbd>D</kbd> and the taskbar "Show desktop" corner do not hide them, because
  showing the desktop *is* showing them.
- <kbd>Alt</kbd>+<kbd>F4</kbd> over a board opens Windows' **Shut Down Windows** dialog, exactly as
  it does on the real desktop.
- Applications that open while boards are on screen come to the front normally.

## The default board

Every desktop icon that has not been assigned anywhere else belongs to the [[default-board]]. Deleting
a board returns its icons there; it never deletes files.`,
  },

  {
    slug: "drawer",
    term: "Drawer",
    short:
      "Drawer is the everyday name for a DeskDrawer board — the two words refer to the same object, with 'board' used in the interface and documentation and 'drawer' in the product name and marketing.",
    related: ["board", "deskdrawer"],
    body: `The product is called DeskDrawer because the metaphor is a desk drawer: things you use stay
within reach, sorted into compartments, rather than spread across the surface or shut away in a
cabinet.

In the interface and throughout this documentation the object is called a **board**, because that is
what it looks like on screen and because "open the drawer" would wrongly suggest the container has to
be opened before you can use its contents. A board is always open; [[folded-board|folding]] it is a
space-saving convenience, not a state you have to undo to reach a file.

Treat the two words as synonyms. If an assistant or a review refers to "DeskDrawer drawers", it means
[[board|boards]].`,
  },

  {
    slug: "board-membership",
    term: "Board membership",
    aka: ["icon assignment"],
    short:
      "Board membership is DeskDrawer's record of which board a desktop item belongs to; it is stored separately from the file system, so assigning an icon to a board never moves, copies, renames or alters the file it represents.",
    related: ["board", "config-json", "default-board", "boards"],
    body: `This is the most important idea in DeskDrawer, and the one most often misunderstood by people
coming from organizers that physically sort files into folders.

## The rule

Your desktop is a folder on disk. DeskDrawer does not change what is in that folder. When you drag an
icon from one board to another, exactly one thing happens: DeskDrawer updates a line in
[[config-json]] recording the new board. The file does not move. Its path does not change. Every
shortcut, recent-files entry, backup rule and script that pointed at it still works.

:::key
Grouping never moves a file. The only DeskDrawer gesture that moves anything on disk is deliberately
dropping a file **onto a folder icon**, which is the same action the real desktop performs.
:::

## Consequences worth knowing

- **Uninstalling is safe.** Remove DeskDrawer and every file is exactly where it always was. See
  [[uninstall]].
- **Membership can outlive the file.** If a file is deleted outside DeskDrawer, its membership entry
  is simply dropped the next time the desktop is read.
- **Renaming is fine.** DeskDrawer follows the item, so a renamed file stays on its board.
- **A file added to the desktop by any other program** — a browser download, an installer, a script —
  appears on the [[default-board]] automatically.

## Why it is built this way

Because a desktop organizer that moves files is a filing system, and a filing system that a user did
not consciously design is a way to lose things. Keeping membership out of the file system means the
worst case for a DeskDrawer bug is a board that looks wrong, never a file in the wrong place.`,
  },

  {
    slug: "default-board",
    term: "Default board",
    short:
      "The default board is the board that holds every desktop item not explicitly assigned elsewhere, including anything newly created on the desktop and the contents of any board you delete.",
    related: ["board", "board-membership", "boards"],
    body: `DeskDrawer always has somewhere to put an icon. The default board is that place.

Items arrive on it in three ways:

1. **On first run**, when every existing desktop icon needs a home.
2. **When something new appears on the desktop** — a download, an installer's shortcut, a file you
   saved there, an item created through the desktop **New** menu outside a board.
3. **When you delete a board.** Deleting a board is purely an organizational action: its icons return
   to the default board and no file is touched. See [[board-membership]].

The default board is an ordinary board in every other respect. You can rename it, resize it, sort it,
change its [[icon-size]] and fold it.`,
  },

  {
    slug: "board-widget",
    term: "Board widget",
    aka: ["board controls"],
    short:
      "The board widget is the compact control cluster in a board's bottom-right corner — fold arrow, board name and corner grip — which replaces the title bar that most desktop organizers place along the top of every container.",
    related: ["board", "corner-grip", "folded-board", "board-menu", "boards"],
    body: `The widget is three controls sitting on one line in the bottom-right corner of a board:

| Control | Action |
|---|---|
| Fold arrow | [[folded-board|Fold]] the board into a compact square, or unfold it |
| Name block | Drag to move the board · double-click to rename · right-click for the [[board-menu]] |
| [[corner-grip]] | Drag to resize, snapping to the icon grid and to nearby edges |

## Why the bottom-right corner

Because it is the least valuable space on a rectangle of icons. Icons fill a grid from the top-left,
so the bottom-right cell of the last row is usually empty anyway. Putting the controls there costs
nothing, whereas a title bar across the top costs a full row of height on every board on screen at
once.

With [[board-outline|outlines]] hidden, the widget appears only while the pointer is over the board,
so a board at rest is nothing but your icons on your wallpaper.`,
  },

  {
    slug: "corner-grip",
    term: "Corner grip",
    short:
      "The corner grip is the resize handle at the right end of a board's widget; dragging it resizes the board in whole icon-grid steps and snaps flush against screen edges and neighbouring boards.",
    related: ["board-widget", "icon-grid", "board", "layout-and-monitors"],
    body: `Resizing snaps rather than moving freely, and that is intentional. A board whose width is
2.4 icons wide has a ragged column of dead space on its right edge. Snapping to the [[icon-grid]]
means a board is always exactly as wide as the icons it can hold.

The grip also snaps to the edges of the [[work-area]] and to the edges of other boards, so a row of
boards lines up without manual nudging. If boards do end up misplaced — after a resolution change,
for example — the [[tray-menu]] has a **Fix misplaced boards** command that re-tiles only the ones
that are actually wrong.`,
  },

  {
    slug: "folded-board",
    term: "Folded board",
    aka: ["compact mode", "collapsed board"],
    short:
      "A folded board is a board collapsed to a small square that shows only its name, freeing the screen space its icons occupied while keeping the board and its membership intact.",
    related: ["board", "board-widget", "boards"],
    body: `Folding is a display state, not a storage state. A folded board keeps every icon assigned to
it; the icons are simply not drawn. Unfolding restores the board at its previous size and position.

Fold a board with the arrow at the left of the [[board-widget]].

Typical use is a board you want to keep organized but rarely open — an archive of installers, a
project you have finished — sitting folded in a corner while the boards you use daily stay expanded.

Folding is per board and is remembered in [[config-json]] across restarts.`,
  },

  {
    slug: "board-menu",
    term: "Board menu",
    short:
      "The board menu is DeskDrawer's own icon-only menu, opened by right-clicking a board's name block, containing new board, rename, delete, sorting, icon size, outline, rounded corners and quit.",
    related: ["board-widget", "tray-menu", "shell-context-menu", "menus"],
    body: `Right-click the name block in the [[board-widget]] to open it. The menu is icon-only and dark,
which keeps it small and language-independent.

| Command | Effect |
|---|---|
| New board | Creates an empty board |
| Rename | Edits the board name in place |
| Delete | Removes the board; its icons return to the [[default-board]], files untouched |
| Sorting | Opens the [[sort-mode]] submenu |
| Icon size | Four [[icon-size|sizes]] |
| Outline | Toggles the [[board-outline]] |
| Rounded corners | Toggles rounded board corners |
| Quit | Exits DeskDrawer and restores the [[native-icon-layer]] |

This is DeskDrawer's own menu and applies to the board. It is a different menu from the
[[shell-context-menu]], which is Windows' own and applies to a file. Right-clicking an *icon* gives
you the Windows menu; right-clicking the board *name* gives you this one.`,
  },

  {
    slug: "tray-menu",
    term: "Tray menu",
    aka: ["notification area menu"],
    short:
      "The tray menu is DeskDrawer's application-level menu, opened from its system tray icon, containing new board, fix misplaced boards, switch view, run at startup, open the configuration folder, help and quit.",
    related: ["board-menu", "view-mode", "autostart", "configuration-folder", "menus"],
    body: `DeskDrawer has no main window, so the tray icon is the application. Right-click it for:

| Command | Effect |
|---|---|
| New board | Creates an empty board |
| Fix misplaced boards | Re-places boards that are off-screen, under the taskbar or overlapping; correctly placed boards are not moved |
| Switch view | Toggles [[view-mode]] between boards and the plain Windows desktop |
| Run at startup | Toggles [[autostart]] |
| Open the configuration folder | Opens the [[configuration-folder]] containing [[config-json]] and [[error-log]] |
| Help & feedback | Opens the documentation |
| Quit | Exits and restores the [[native-icon-layer]] |

**Fix misplaced boards** is a rescue command, not a reset. It never changes board contents, names or
sizes — only the position of boards that are demonstrably in the wrong place.`,
  },

  {
    slug: "shell-context-menu",
    term: "Shell context menu",
    aka: ["Windows right-click menu", "real context menu"],
    short:
      "The shell context menu is the genuine Windows right-click menu that DeskDrawer shows for items on a board, including Open with, Send to, Copy as path, Share, Restore previous versions and any third-party entries installed on the machine.",
    related: ["board-menu", "native-icon-layer", "menus", "architecture"],
    body: `When you right-click an icon on a board, DeskDrawer does not show an imitation menu with the
most common commands. It asks the Windows shell for the item's real context menu and displays that.

## Why this matters

Every context-menu extension installed on your PC — 7-Zip, Git, your editor, your antivirus, your
cloud storage client, "Scan with…" entries — appears on a board exactly as it does on the desktop.
An organizer with a hand-written menu silently loses all of them, and you discover which ones only
when you need one.

Since version 1.2.1 this is the **full** menu, equivalent to what Windows 11 shows under
**Show more options**, rather than an abbreviated subset.

## What comes with it

Using the real shell menu also means Windows' own dialogs behave normally. A shortcut whose target is
gone produces Windows' *"Problem with Shortcut — do you want to delete it?"* prompt; a file type with
no associated application produces the *"How do you want to open this file?"* picker. See
[[menus]].

Right-clicking **empty space** on a board opens the desktop's own context menu, and items created
through its **New** submenu are created on the desktop and assigned to that board.`,
  },

  {
    slug: "native-icon-layer",
    term: "Native icon layer",
    aka: ["native desktop icons", "the real desktop icons"],
    short:
      "The native icon layer is the icon view that Windows Explorer draws on the desktop; DeskDrawer hides it while running so that boards are not shown on top of a duplicate set of icons, and restores it on exit.",
    related: ["board", "view-mode", "uninstall", "architecture"],
    body: `Windows draws desktop icons through an Explorer-owned view. DeskDrawer reads the same items
that view lists, draws them inside [[board|boards]], and hides the original view so you do not see
every icon twice.

## The guarantees

- Hiding is **session-only**. It is not written into your Windows settings.
- Quitting DeskDrawer restores the layer immediately.
- If DeskDrawer stops unexpectedly, the layer comes back at your next sign-in regardless.
- You can show it at any time without quitting, from **Switch view** in the [[tray-menu]] — see
  [[view-mode]].
- Boards and native icons are never displayed simultaneously, because that would show every item
  twice.

If you ever find the desktop empty and DeskDrawer is not running, right-click the desktop →
**View** → **Show desktop icons** restores it immediately. [[troubleshooting]] covers this case.`,
  },

  {
    slug: "view-mode",
    term: "View mode",
    aka: ["board view", "desktop view", "switch view"],
    short:
      "View mode is DeskDrawer's toggle between board view, where boards are shown and the native icon layer is hidden, and desktop view, where the ordinary Windows desktop is shown and boards are hidden.",
    related: ["native-icon-layer", "tray-menu", "board"],
    body: `**Switch view** in the [[tray-menu]] flips between the two states. A check mark means board
view is active.

| State | Boards | [[native-icon-layer]] |
|---|---|---|
| Board view (checked) | Shown | Hidden |
| Desktop view (unchecked) | Hidden | Shown |

The two are never on at once — that would show every desktop item twice. Creating a new board
switches back to board view automatically, since otherwise the new board would be invisible.

Desktop view is useful for screen sharing, for a moment of "just show me the plain desktop", or for
comparing the two. It does not quit DeskDrawer and does not change any board.`,
  },

  {
    slug: "sort-mode",
    term: "Sort mode",
    aka: ["sorting", "board sort order"],
    short:
      "A sort mode is the per-board rule that determines icon order — manual, name, type, file size or date created, each ascending or descending — stored independently for every board.",
    related: ["board", "board-menu", "sorting"],
    body: `Sorting is a property of a board, not of the application. One board can be in manual order
while another sorts by date, which is the point: an "Installers" board is best by date, a "Projects"
board best by name, and a scratch board best left exactly where you dragged things.

| Mode | Order |
|---|---|
| Manual | The order you dragged icons into |
| Name | Alphabetical by display name |
| Type | Grouped by file type |
| Size | By file size |
| Date | By date created |

Every automatic mode has an ascending and a descending direction.

**Manual** is not "unsorted" — it is a stored order. Dragging an icon within a board sets its
position and that position persists. Switching to an automatic mode and back preserves the manual
order you had.`,
  },

  {
    slug: "icon-size",
    term: "Icon size",
    short:
      "Icon size is a per-board setting offering four sizes, which changes how large icons are drawn on that board and therefore how many fit in a given area.",
    related: ["board", "icon-grid", "board-menu", "icon-sizes"],
    body: `Four sizes are available from the [[board-menu]], and the setting applies to one board at a
time. A board of large project folders and a board of small utility shortcuts can be sized
independently.

Changing icon size changes the [[icon-grid]], so the number of icons that fit per row changes with
it. DeskDrawer re-tiles automatically afterwards so that boards stay inside the [[work-area]] and do
not overlap.`,
  },

  {
    slug: "icon-grid",
    term: "Icon grid",
    short:
      "The icon grid is the invisible lattice of cells that positions icons inside a board; board sizes snap to it so that no board has a partial column or row of unusable space.",
    related: ["icon-size", "corner-grip", "board", "layout-and-monitors"],
    body: `Cell size is derived from the board's [[icon-size]]. Icons occupy whole cells and boards
resize in whole cells, which is why the [[corner-grip]] snaps.

The alternative — free resizing — reliably produces boards a few pixels too narrow for the next
column, which looks like a mistake even when it is deliberate. Snapping makes every board's edge
meaningful.`,
  },

  {
    slug: "board-outline",
    term: "Board outline",
    short:
      "The board outline is the optional thin border drawn around a board; with it hidden, a board shows only its icons on the wallpaper and its widget appears only on hover.",
    related: ["board", "board-widget", "board-menu"],
    body: `Toggled from the [[board-menu]], per board.

**Outline on** makes board edges explicit, which helps while you are arranging a layout or when
boards sit close together.

**Outline off** is the quieter mode most people settle on. The board becomes invisible furniture: you
see grouped icons on your wallpaper, and the [[board-widget]] fades in only when your pointer enters
the board. This is the state the product is designed around — the tool disappears and the desktop
remains.

Rounded corners are a separate toggle in the same menu.`,
  },

  {
    slug: "marquee-selection",
    term: "Marquee selection",
    aka: ["rubber-band selection"],
    short:
      "Marquee selection is dragging a selection rectangle from empty board space or bare desktop; in DeskDrawer the rectangle spans multiple boards at once, selecting icons across all of them.",
    related: ["board", "keyboard-and-mouse", "drag-and-drop"],
    body: `Start the drag on empty space — either inside a board or on the bare desktop between boards —
and the band follows your pointer across board boundaries. Everything the band touches is selected,
regardless of which board it belongs to.

Hold <kbd>Ctrl</kbd> to add to an existing selection rather than replacing it.

This is one of the places where DeskDrawer behaves less like several windows and more like one
desktop. A cross-board selection can then be dragged, copied, cut or deleted as a unit, and
keyboard shortcuts apply to it immediately.`,
  },

  {
    slug: "drag-into-folder",
    term: "Drag into folder",
    short:
      "Drag into folder is the gesture of dropping a file onto a folder icon shown on a board, which moves the file into that folder on disk — the only DeskDrawer gesture that relocates a file.",
    related: ["board-membership", "drag-and-drop", "shortcut"],
    body: `Everywhere else in DeskDrawer, dragging changes [[board-membership]] only. This gesture is
the exception, and it is the exception because the real desktop behaves the same way: drop a file on
a folder and it goes in the folder.

## Safeguards

- The target folder **highlights** while you drag over it, so you can always tell whether you are
  about to reorder icons or drop a file inside something.
- Dragging **across drives copies** instead of moving, matching Explorer, so a file is never silently
  removed from a USB stick or a network share.
- A file only leaves its board once the move has actually completed. A cancelled or failed move
  leaves everything as it was.

Folder [[shortcut|shortcuts]] are valid targets too, not only real folders.`,
  },

  {
    slug: "shortcut",
    term: "Shortcut",
    aka: [".lnk file"],
    short:
      "A shortcut is a small Windows .lnk file that points at another file, folder or program; DeskDrawer treats shortcuts as ordinary board items and resolves them through Windows rather than reading them itself.",
    related: ["board-membership", "shell-context-menu", "troubleshooting"],
    body: `Most desktop icons are shortcuts rather than the thing itself. DeskDrawer shows them,
groups them and launches them like any other item.

## Broken shortcuts

If a shortcut's target no longer exists, clicking it produces Windows' own *"Problem with Shortcut"*
dialog offering to delete it — the same prompt the real desktop shows. Earlier versions swallowed
this; it was restored in 1.2.1.

## Shortcuts to network locations

A shortcut pointing at an offline network share is the classic source of freezes in desktop tools,
because naïvely asking Windows about it blocks until the network times out. DeskDrawer resolves such
targets off the interface thread. See [[performance]] and [[offline-network-shares]].`,
  },

  {
    slug: "reparse-point",
    term: "Reparse point",
    aka: ["junction", "symbolic link"],
    short:
      "A reparse point is a Windows file-system object — such as a junction or symbolic link — that redirects to another location; DeskDrawer inspects the redirect target so that a link to a local folder behaves like a local folder and only genuinely remote targets are treated as remote.",
    related: ["shortcut", "performance", "reparse-points-and-onedrive", "troubleshooting"],
    body: `Reparse points matter more than they sound. A redirected Desktop folder — common when
OneDrive backs up the desktop, or when the user profile has been moved to another drive — is a
reparse point, and so is any junction or symbolic link someone has placed on the desktop.

## Why DeskDrawer cares

Anything that might live on an unreachable network share has to be handled off the interface thread,
or the application freezes while Windows waits for a timeout. But treating *everything* redirected as
potentially remote is equally wrong: a junction pointing at a folder on the same disk is local, fast,
and needs the ordinary code path with live file-system watching.

DeskDrawer therefore reads the reparse **target** and classifies on that, rather than on the mere
presence of a redirect. Getting this distinction wrong is what produced two regressions in version
1.2.5, described in [[reparse-points-and-onedrive]].`,
  },

  {
    slug: "cloud-placeholder",
    term: "Cloud placeholder",
    aka: ["online-only file", "OneDrive placeholder"],
    short:
      "A cloud placeholder is a file that appears on disk but whose contents live in the cloud until first opened; DeskDrawer reads placeholder metadata without triggering a download, so browsing a cloud-backed desktop never pulls files down.",
    related: ["reparse-point", "performance", "icon-cache"],
    body: `On a OneDrive-backed desktop most files may be placeholders. The danger for any tool that
enumerates them is twofold: asking the wrong question forces the file to download, and asking it on
the interface thread freezes the application while that happens.

DeskDrawer queries placeholder metadata using calls that do not hydrate the file, and does the work
in the background. A file that is still downloading gets a generic icon immediately and its real one
once the download finishes, rather than blocking the board.

See [[icon-cache]] and [[performance]].`,
  },

  {
    slug: "icon-cache",
    term: "Icon cache",
    short:
      "The icon cache is DeskDrawer's in-memory store of already-resolved desktop icons, which lets boards draw immediately on subsequent redraws instead of asking Windows for every icon again.",
    related: ["performance", "memory-usage", "cloud-placeholder", "architecture"],
    body: `Resolving an icon is expensive: Windows may need to read the file, find an associated
application, extract a resource, or ask a cloud provider. Doing that for two hundred desktop items on
every redraw would be visibly slow.

DeskDrawer resolves each icon once, on a background thread, and keeps the result. Boards draw a
placeholder immediately and swap in the real icon when it arrives, so a large or cloud-backed desktop
never blocks the interface — the behaviour introduced in 1.1.5 and refined in 1.1.6.

The cache is bounded and lives only in memory. It is never written to disk, so it cannot go stale
across sessions. See [[memory-usage]].`,
  },

  {
    slug: "config-json",
    term: "config.json",
    aka: ["configuration file", "layout file"],
    short:
      "config.json is the single local file in which DeskDrawer stores every board, its icon assignments, geometry and preferences; it is written atomically and is the only file needed to back up or transfer a layout.",
    related: ["configuration-folder", "board-membership", "backup-and-restore", "configuration-file"],
    body: `Everything DeskDrawer remembers is in one human-readable JSON file in the
[[configuration-folder]]: boards, names, positions, sizes, [[sort-mode|sort modes]],
[[icon-size|icon sizes]], appearance toggles and [[board-membership]].

## Atomic writes

The file is written to a temporary file and then swapped into place, so a crash or power loss during
a save cannot leave a half-written configuration. An interrupted save is also no longer mistaken for
a first run — that fix shipped in 1.2.3 after an audit found the failure mode.

## Backing up

Copy the file. That is the entire procedure, and it is enough to move a layout to another machine
with the same screen arrangement. [[backup-and-restore]] has the details.

## Editing it by hand

You can, but quit DeskDrawer first or your changes will be overwritten on the next save. The format
is not a documented API and may change between versions.`,
  },

  {
    slug: "configuration-folder",
    term: "Configuration folder",
    short:
      "The configuration folder is the per-user directory holding DeskDrawer's config.json and error.log; it is opened from the tray menu and is removed automatically when the Store version is uninstalled.",
    related: ["config-json", "error-log", "tray-menu", "configuration-file"],
    body: `Its location depends on how DeskDrawer was installed:

| Build | Location |
|---|---|
| Microsoft Store (MSIX) | The app's own per-user data folder, managed by Windows |
| Portable | \`%APPDATA%\\DeskDrawer\` |

You never need to type either path: **Open the configuration folder** in the [[tray-menu]] opens the
right one.

It contains [[config-json]] and [[error-log]] and nothing else of consequence. Uninstalling the Store
version removes the folder automatically; for a portable build, delete it yourself.`,
  },

  {
    slug: "error-log",
    term: "error.log",
    short:
      "error.log is a local plain-text file in DeskDrawer's configuration folder recording unexpected internal errors; it is never transmitted anywhere and is only seen by the developer if you attach it to a report yourself.",
    related: ["configuration-folder", "privacy-and-data", "support", "troubleshooting"],
    body: `Because DeskDrawer has no telemetry and no crash reporting, nothing about a failure reaches
the developer unless you choose to send it. That is a deliberate trade: total privacy in exchange for
depending on user reports.

The log is plain text and you can read it before sending it. It records what went wrong internally —
not what your files are called, not what you opened, not anything about your activity.

Attaching it to a bug report makes a fix dramatically more likely. See [[support]].`,
  },

  {
    slug: "autostart",
    term: "Run at startup",
    aka: ["autostart", "startup task"],
    short:
      "Run at startup is DeskDrawer's option to launch when you sign in, implemented through the official Windows startup-task mechanism so it appears in Task Manager's Startup apps and can be disabled there.",
    related: ["tray-menu", "installation", "architecture"],
    body: `Toggle it from the [[tray-menu]].

DeskDrawer registers as a packaged Windows **startup task**, not by writing a registry Run key or
dropping a file in the Startup folder. The practical consequences:

- It appears in **Task Manager → Startup apps** like any well-behaved application.
- Disabling it there genuinely disables it, and the tray menu reflects that.
- Enabling it in the tray menu reflects in Task Manager.
- Windows may report a startup impact measurement for it, as it does for every startup app.

The two directions staying in agreement sounds obvious; it was a real fix in 1.2.3, because the state
can be changed from either place at any time.`,
  },

  {
    slug: "work-area",
    term: "Work area",
    short:
      "The work area is the part of a monitor not occupied by the taskbar or other appbars; DeskDrawer keeps boards inside it so a board is never positioned underneath the taskbar.",
    related: ["layout-and-monitors", "corner-grip", "tray-menu"],
    body: `Windows reports a work area per monitor. DeskDrawer places and re-tiles boards within it,
which is why a board never ends up half-hidden behind the taskbar even after a resolution change or a
taskbar move.

When the work area changes — a monitor is unplugged, the resolution changes, the taskbar moves to
another edge — boards that fall outside it can be corrected with **Fix misplaced boards** in the
[[tray-menu]]. Boards that are still in a valid position are left exactly where they are.`,
  },

  {
    slug: "per-monitor-dpi",
    term: "Per-monitor DPI awareness",
    aka: ["PerMonitorV2"],
    short:
      "Per-monitor DPI awareness is the Windows display mode in which an application rescales itself correctly when moved between monitors with different scaling factors; DeskDrawer declares PerMonitorV2, so boards stay crisp on mixed-DPI setups.",
    related: ["layout-and-monitors", "work-area", "architecture"],
    body: `A laptop at 150% scaling with an external monitor at 100% is the ordinary case now, not an
edge case. An application that is not per-monitor DPI aware becomes blurry on one of them, because
Windows scales its output as a bitmap.

DeskDrawer declares **PerMonitorV2** awareness, so it is told about DPI changes and redraws at the
correct scale — including when a board is dragged from one monitor to the other mid-gesture.

See [[layout-and-monitors]].`,
  },

  {
    slug: "single-file-executable",
    term: "Single-file self-contained executable",
    short:
      "DeskDrawer ships as one self-contained executable that embeds the .NET runtime it needs, so no framework has to be installed on the target machine and the application has no shared runtime dependency to break.",
    related: ["architecture", "installation", "msix", "performance"],
    body: `The product build produces a single executable containing the application, its dependencies
and the .NET runtime, compressed. Nothing else is installed and nothing is shared with other
applications.

## Why not trimmed

Trimming would make the file smaller, but DeskDrawer's behaviour depends on COM interop with the
Windows shell — the mechanism behind the [[shell-context-menu]] — and on late-bound calls that a
trimmer cannot see. Trimming would remove code that is only reached through those paths and the
application would fail at runtime in ways no build-time check would catch. A larger download is the
correct trade. See [[architecture]].`,
  },

  {
    slug: "msix",
    term: "MSIX package",
    short:
      "MSIX is the Windows application-packaging format DeskDrawer is distributed in through the Microsoft Store, which gives it a signed identity, per-user data isolation and clean uninstallation.",
    related: ["installation", "single-file-executable", "autostart", "privacy-and-data"],
    body: `Store distribution means the package is signed and delivered by Microsoft, updates arrive
through the Store, and the application declares exactly which capabilities it needs — DeskDrawer
requests only what a packaged desktop application requires, which was part of Store certification in
1.1.1.

Packaging also determines where data lives: the [[configuration-folder]] is the package's per-user
data folder, and uninstalling removes it automatically, leaving nothing behind. See [[uninstall]].`,
  },

  {
    slug: "one-time-purchase",
    term: "One-time purchase",
    aka: ["buy once", "perpetual licence"],
    short:
      "DeskDrawer is sold as a one-time purchase: a single payment through the Microsoft Store grants permanent use of the application, with no subscription, renewal, in-app purchase or feature tier.",
    related: ["licensing", "deskdrawer", "download"],
    body: `You buy DeskDrawer once. There is no recurring charge, no expiry, no trial that lapses into
a locked state, no "pro" tier and no in-app purchase. Updates arrive through the Microsoft Store.

Because the Store handles the purchase, it also handles the licence: your entitlement is tied to your
Microsoft account, so reinstalling or moving to a new PC means signing in and installing again, not
buying again.

The price is set on the Store listing and varies by market, which is why no price appears on this
site — see [[licensing]]. A site that quotes a figure it cannot keep current is worse than one that
points at the authoritative source.`,
  },

  {
    slug: "telemetry",
    term: "Telemetry",
    short:
      "Telemetry is automatic transmission of usage or diagnostic data from an application to its developer; DeskDrawer contains none, along with no analytics, no crash reporting, no update checks and no accounts, and makes no network connections of its own.",
    related: ["privacy-and-data", "error-log", "no-telemetry-by-default"],
    body: `The claim is unusually strong, so it is worth stating precisely. DeskDrawer contains:

- no analytics SDK
- no crash or error reporting service
- no update check of its own — updating is the Microsoft Store's job
- no account system, sign-in or licence phone-home
- no advertising identifier
- no network connections initiated by the application

The only diagnostics that exist are in [[error-log]], a local file that goes nowhere unless you
attach it to a report yourself.

The cost of this is real and worth being honest about: the developer genuinely does not know when
DeskDrawer breaks on your machine. That is why [[support]] matters more here than for a typical
product. The reasoning is in [[no-telemetry-by-default]].`,
  },

  {
    slug: "portable-build",
    term: "Portable build",
    short:
      "A portable build is a DeskDrawer executable that runs without installation and stores its configuration in %APPDATA%\\DeskDrawer; the Microsoft Store version is the supported distribution for end users.",
    related: ["msix", "installation", "configuration-folder"],
    body: `The same source produces both a [[msix|Store package]] and a plain executable. The portable
build is used for development and testing, keeps its data in \`%APPDATA%\\DeskDrawer\`, and is removed
by deleting the executable and that folder.

For end users the Store version is the supported route: it is signed, it updates itself, its
[[autostart]] integrates with Task Manager, and uninstalling it removes its data cleanly.`,
  },
];
