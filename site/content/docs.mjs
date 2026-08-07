/**
 * DeskDrawer documentation.
 *
 * Everything here is first-hand: it describes how this application actually behaves,
 * why it was built that way, and where it stops. Nothing is padding written to occupy
 * a keyword — if a page has little to say, it is short.
 */

export const DOC_GROUPS = [
  {
    title: "Start here",
    items: [
      {
        slug: "getting-started",
        title: "Getting started",
        nav: "Getting started",
        description:
          "What happens the first time you run DeskDrawer, and the four things worth doing in your first five minutes.",
        related: ["boards", "menus", "keyboard-and-mouse"],
        body: `DeskDrawer has no setup wizard, no account and no first-run questionnaire. You start it and
your desktop is already organised into one board. Everything after that is optional.

## What happens on first run

1. DeskDrawer reads what is currently on your desktop.
2. It creates one board — the [[default-board]] — containing every item it found.
3. It hides the [[native-icon-layer]] so you do not see every icon twice.
4. It places its icon in the system tray. There is no main window; the tray icon *is* the
   application.

Nothing has been moved. The desktop folder on disk is exactly as it was — see [[board-membership]].

## Your first five minutes

### 1. Make a second board

Right-click the tray icon and choose **New board**, or right-click a board's name and choose the same.
An empty board appears.

### 2. Move some icons into it

Drag icons from the first board onto the new one. You can drag several at once: hold <kbd>Ctrl</kbd>
while clicking, or drag a [[marquee-selection|selection rectangle]] across empty space — the band
crosses board boundaries, so you can sweep up icons from several boards in one gesture.

### 3. Size and place the boards

Drag a board by its **name block**, in the bottom-right [[board-widget]]. Resize with the
[[corner-grip]] beside it. Both snap: boards align to the [[icon-grid]] and sit flush against screen
edges and each other, so a tidy layout takes seconds rather than pixel-nudging.

### 4. Turn the outlines off

Right-click a board's name → toggle **Outline**. This is the mode most people settle on: the board
becomes invisible, you see grouped icons on your wallpaper, and the widget appears only when your
pointer is over the board.

:::tip
Double-click a board's name to rename it. New boards are numbered rather than given a word, so a
layout never contains text in a language you do not read — see [[languages]].
:::

## Two things that surprise people

**Your desktop still works like your desktop.** Right-click an icon and you get the real Windows
menu, with every extension you have installed. <kbd>F2</kbd> renames. <kbd>Delete</kbd> recycles.
Drag a file out to an Explorer window and it copies or moves for real. See [[menus]] and
[[keyboard-and-mouse]].

**<kbd>Win</kbd>+<kbd>D</kbd> does not hide your boards.** Boards *are* the desktop now, so showing
the desktop shows them. Use the taskbar or <kbd>Alt</kbd>+<kbd>Tab</kbd> to get minimised windows
back.

## Where to go next

- [[boards]] — the board object in full
- [[menus]] — the three menus and which is which
- [[keyboard-and-mouse]] — the complete gesture and shortcut reference`,
      },

      {
        slug: "installation",
        title: "Installing DeskDrawer",
        nav: "Installation",
        description:
          "System requirements, what installing actually puts on your machine, and how updates and autostart work.",
        related: ["licensing", "uninstall", "architecture"],
        body: `DeskDrawer is distributed through the Microsoft Store. Installing it is the ordinary Store
flow; this page covers what that leaves on your machine.

## Requirements

| | |
|---|---|
| Operating system | Windows 10 version 2004 (build 19041) or newer, and Windows 11 |
| Architecture | x64 |
| Runtime | None — see below |
| Disk | Roughly the size of one self-contained application |
| Network | Not required at any point after installation |

The build 19041 floor is not arbitrary: DeskDrawer uses the packaged startup-task API for
[[autostart]], which is only projected from that version onward.

## No runtime to install

DeskDrawer ships as a [[single-file-executable]] — one file containing the application, its
dependencies and the .NET runtime it needs. You do not install a framework, and a framework update
cannot break it. Nothing is shared with other applications on the machine.

## What installing puts on your machine

| Item | Where |
|---|---|
| The application | Inside its [[msix]] package, managed by Windows |
| Your layout and preferences | The [[configuration-folder]], per user |
| Anything else | Nothing |

No services are registered. No drivers. No shell extensions. No scheduled tasks other than the
startup task you enable yourself. No registry Run key.

## Updates

Updates arrive through the Microsoft Store like any other Store application. DeskDrawer contains no
update checker of its own and makes no network requests — see [[telemetry]].

## Starting with Windows

Off by default. Turn it on from the tray menu → **Run at startup**. It registers as a proper Windows
startup task, so it appears in **Task Manager → Startup apps** and can be disabled from there;
the two stay in agreement in both directions. See [[autostart]].

## Multiple user accounts

Configuration is per user. Two people signing in to the same PC get their own boards, their own
layout and their own [[autostart]] setting, because each has their own desktop.`,
      },

      {
        slug: "boards",
        title: "Boards",
        nav: "Boards",
        description:
          "Creating, naming, moving, resizing, folding and deleting boards — and what a board stores.",
        related: ["menus", "sorting", "layout-and-monitors"],
        body: `A [[board]] is a transparent container drawn on your desktop holding a group of icons. It has
no title bar. All of its controls live in one compact [[board-widget]] in the bottom-right corner.

## The widget

\`\`\`
                                    [ ▾ ] [ Projects ] [ ◢ ]
\`\`\`

| Part | What it does |
|---|---|
| **▾ arrow** | Folds the board into a compact square, or unfolds it |
| **Name block** | Drag to move · double-click to rename · right-click for the [[board-menu]] |
| **Corner grip** | Drag to resize |

With [[board-outline|outlines]] hidden the widget is invisible until your pointer enters the board.

## Why the controls are in the corner

A title bar across the top of a board costs about one row of icon height. With six boards on screen
that is six rows of desktop given to the tool rather than to your files. The bottom-right cell of an
icon grid is usually empty anyway, so putting the controls there costs nothing. This is the single
biggest visual difference between DeskDrawer and most desktop organizers, and the reasoning is
written up in [[why-boards-have-no-title-bar]].

## Creating and deleting

**Create** from the tray menu or the board menu → **New board**. New boards are numbered (1, 2, 3…)
rather than named, deliberately — see [[languages]].

**Delete** from the board menu. The board disappears and its icons return to the [[default-board]].
No file is deleted, moved or changed. There is no way for deleting a board to lose data, because a
board never held your data in the first place — see [[board-membership]].

## Moving and resizing

Drag the name block to move. Drag the [[corner-grip]] to resize.

Both snap. Boards align to the [[icon-grid]], to the edges of the [[work-area]], and to each other.
Resizing in whole grid steps means a board is never 2.4 icons wide with a ragged strip of dead space
on its right edge.

If boards do end up badly placed — after a resolution change or unplugging a monitor — the tray menu
has **Fix misplaced boards**, which re-places only the ones that are genuinely off-screen, under the
taskbar or overlapping. Correctly placed boards are left alone. It is a rescue, not a reset:
contents, names and sizes are never touched.

## Folding

The **▾** arrow collapses a board to a small square showing just its name. Nothing is lost — a
[[folded-board]] keeps every icon assigned to it and unfolds to its previous size. It is the right
state for a board you want to keep but rarely open.

## Appearance

Two toggles in the [[board-menu]], per board:

- **Outline** — the thin border around the board
- **Rounded corners** — square or rounded

## What a board stores

Its name, its rectangle, its [[sort-mode]], its [[icon-size]], its two appearance toggles, whether it
is folded, and the list of items assigned to it. All of it in [[config-json]]. Nothing else.`,
      },
    ],
  },

  {
    title: "Using DeskDrawer",
    items: [
      {
        slug: "menus",
        title: "Menus",
        nav: "Menus",
        description:
          "DeskDrawer has three menus: its own board menu, its tray menu, and the real Windows context menu. Knowing which is which explains most of the interface.",
        related: ["boards", "sorting", "keyboard-and-mouse"],
        body: `Almost every question about "how do I…" in DeskDrawer resolves to knowing which of three
menus to open.

| Right-click on… | You get | Whose menu |
|---|---|---|
| A board's **name block** | [[board-menu]] | DeskDrawer's |
| The **tray icon** | [[tray-menu]] | DeskDrawer's |
| An **icon**, or **empty board space** | [[shell-context-menu]] | Windows' |

The first two are DeskDrawer's own, icon-only and dark. The third is the genuine Windows menu.

## The board menu

Right-click a board's name. It applies to that board.

| Command | Effect |
|---|---|
| New board | Creates an empty board |
| Rename | Edits the name in place |
| Delete | Removes the board; icons return to the [[default-board]], files untouched |
| Sorting | The [[sorting]] submenu |
| Icon size | Four [[icon-sizes|sizes]] |
| Outline | Toggles the board border |
| Rounded corners | Toggles rounded corners |
| Quit | Exits DeskDrawer, restoring the native desktop icons |

## The tray menu

Right-click the tray icon. It applies to the application.

| Command | Effect |
|---|---|
| New board | Creates an empty board |
| Fix misplaced boards | Re-places off-screen, taskbar-covered or overlapping boards only |
| Switch view | Toggles [[view-mode]] between boards and the plain desktop |
| Run at startup | Toggles [[autostart]] |
| Open the configuration folder | Opens the folder holding [[config-json]] and [[error-log]] |
| Help & feedback | Opens the documentation |
| Quit | Exits and restores the native desktop icons |

## The Windows context menu

Right-click an **icon** on a board and DeskDrawer asks the Windows shell for that item's real context
menu and shows it. Not an imitation with the popular commands — the real one.

That means everything installed on your machine is there: 7-Zip, Git, your editor, your antivirus,
your cloud client, **Open with**, **Send to**, **Copy as path**, **Share**, **Restore previous
versions**. Since 1.2.1 it is the full menu, equivalent to Windows 11's **Show more options**, rather
than a subset.

Right-click **empty space** on a board and you get the desktop's own menu. Items created from its
**New** submenu are created on the desktop and assigned to the board you clicked in.

:::note Why this matters more than it sounds
An organizer with a hand-written context menu silently loses every shell extension you have
installed, and you find out which ones only at the moment you need one. Delegating to the shell also
means Windows' own dialogs still appear — the *"Problem with Shortcut"* prompt for a broken
[[shortcut]], the *"How do you want to open this file?"* picker for an unassociated file type. Both
were being swallowed before 1.2.1.
:::`,
      },

      {
        slug: "sorting",
        title: "Sorting a board",
        nav: "Sorting",
        description: "Five sort modes, each ascending or descending, set independently per board.",
        related: ["boards", "menus", "icon-sizes"],
        body: `Sorting is a property of one [[board]], not of the application. That is the point: different
boards want different orders.

Open the **Sorting** submenu from the [[board-menu]].

| Mode | Order |
|---|---|
| Manual | The order you dragged icons into |
| Name | Alphabetical by display name |
| Type | Grouped by file type |
| Size | By file size |
| Date | By date created |

Each automatic mode has an **ascending** and a **descending** direction, chosen from the same
submenu.

## Manual order is a real order

**Manual** does not mean unsorted. Dragging an icon within a board sets its position, that position
is stored in [[config-json]], and it survives restarts. Switching to an automatic mode and back
returns the manual arrangement you had — it is remembered, not discarded.

## Choosing per board

A worked example of why per-board sorting exists:

- **Installers** — by date, descending. The one you just downloaded is at the top.
- **Projects** — by name. You know what it is called, so you can find it.
- **Today** — manual. It is a work surface; things are where you put them.

## What sorting does not do

Sorting changes the drawing order of icons inside a board. It does not rename, move, group or touch
any file, and it does not change which board an icon belongs to. See [[board-membership]].`,
      },

      {
        slug: "icon-sizes",
        title: "Icon sizes",
        nav: "Icon sizes",
        description:
          "DeskDrawer offers four icon sizes, set independently for each board, and re-tiles the layout automatically when you change one.",
        related: ["boards", "sorting", "layout-and-monitors"],
        body: `Four [[icon-size|sizes]] are available from the **Icon size** submenu of the
[[board-menu]]. The setting is per board.

Per board matters because boards hold different things. A board of project folders you open daily
reads better large; a board of forty small utility shortcuts fits better small.

## What changes with it

Icon size determines the cell size of the [[icon-grid]], so it changes how many icons fit per row and
therefore how much board area a given set of icons needs.

Because that can leave boards the wrong size, DeskDrawer re-tiles automatically after an icon-size
change: boards are kept inside the [[work-area]], never under the taskbar, and never overlapping.
That behaviour was added in 1.0.5 for exactly this reason.

:::tip
If a layout still looks wrong after changing sizes on several boards at once, **Fix misplaced boards**
in the [[tray-menu]] tidies the ones that are actually misplaced without disturbing the rest.
:::`,
      },

      {
        slug: "keyboard-and-mouse",
        title: "Keyboard and mouse reference",
        nav: "Keyboard & mouse",
        description:
          "Every gesture and shortcut on a board. Most of them are the ones you already use on the Windows desktop.",
        related: ["drag-and-drop", "menus", "boards"],
        body: `The design goal is that you should not have to learn DeskDrawer. Almost every gesture here
is what the same gesture does on the real Windows desktop.

## Mouse

| Gesture | Effect |
|---|---|
| Drag on empty board space **or bare desktop** | [[marquee-selection|Rubber-band select]] — the band spans multiple boards; hold <kbd>Ctrl</kbd> to add to the selection |
| Drag selected icons | Move them between boards or reorder within one |
| Drag icons **out** to an Explorer window | Copies or moves the real files |
| Drag files **in** from Explorer | The files land on the desktop and join that board |
| Drag a file onto a **folder** on a board | Moves the file into that folder — see [[drag-into-folder]] |
| Right-click an icon | The real Windows context menu |
| Right-click empty board space | The real Windows **desktop** menu |
| Right-click a board's name | The [[board-menu]] |
| Double-click a board's name | Rename it in place |
| Mouse wheel over a board | Scrolls the board |
| Hover a file | The standard Windows info tip — type, size, date, a shortcut's target, an image's dimensions |
| Double-click an icon | Open |

## Keyboard

| Key | Effect |
|---|---|
| <kbd>Enter</kbd> | Open the selection |
| <kbd>F2</kbd> | Rename |
| <kbd>Delete</kbd> | Recycle, with Windows' confirmation for permanent deletes |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Select all in the board |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>X</kbd> | Copy / cut |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Paste into the board under the pointer |
| <kbd>Esc</kbd> | Clear the selection |
| <kbd>Alt</kbd>+<kbd>F4</kbd> | Windows' **Shut Down Windows** dialog, as on the real desktop |

## Selection across boards

A [[marquee-selection]] is not confined to one board. Start on empty space and drag: the band crosses
board boundaries and selects everything it touches. The resulting mixed selection can be dragged,
copied, cut or deleted as one unit, and keyboard shortcuts apply to it immediately — which was not
true before 1.0.7.

## What is deliberately missing

There is no global hotkey to summon DeskDrawer, and no configurable key bindings. Both would mean
installing a keyboard hook that runs for every keystroke on the machine, which is a large cost for a
tool that is meant to be invisible. See [[limitations]].`,
      },

      {
        slug: "drag-and-drop",
        title: "Drag and drop",
        nav: "Drag & drop",
        description:
          "What each kind of drag does, when a file actually moves on disk, and the safeguards around that.",
        related: ["keyboard-and-mouse", "boards", "troubleshooting"],
        body: `Dragging is where a desktop organizer can most easily do something you did not intend, so
this page is precise about which drags touch the file system and which do not.

## The four drags

| Drag | Touches disk? |
|---|---|
| Icon → another board | **No.** Updates [[board-membership]] only |
| Icon → elsewhere in the same board | **No.** Sets its manual position |
| Icon → a **folder** shown on a board | **Yes.** Moves the file into that folder |
| Icon → an Explorer window or another app | **Yes.** Copies or moves, as Explorer would |

Only the last two change anything on disk, and both are gestures that do the same thing on the real
desktop.

## Dropping onto a folder

This is the one gesture that relocates a file from inside DeskDrawer. It has three safeguards:

- **The folder highlights** while you drag over it, so you can always tell whether you are about to
  reorder icons or drop a file inside something. Added in 1.1.4 after the ambiguity proved real.
- **Across drives it copies**, matching Explorer, so nothing is silently removed from a USB stick or
  a network share.
- **The icon leaves its board only after the move has actually completed.** A cancelled or failed
  move leaves the icon where it was. This one took two attempts to get right — a cancelled move onto
  a local junction still dropped the membership until 1.2.5.

Folder [[shortcut|shortcuts]] work as targets too, not only real folders — that arrived in 1.1.6.

## Dragging out to Explorer

Drag icons off a board into a File Explorer window, or any application that accepts files, and the
real files are transferred with normal Windows semantics.

Dragging between boards and back out again does not trigger Explorer's "interrupted operation"
dialog; that class of problem was fixed in 1.0.4 by treating a drag that returns to its origin as a
no-op rather than a cancelled transfer.

## Dragging in from Explorer

Files dropped onto a board are placed on the desktop and assigned to that board. They land as files
on your desktop, exactly as if you had dropped them on the desktop itself.

## If a drag seems to hang

Almost always a [[shortcut]] pointing at an offline network location. Resolving such a target can
make Windows wait for a network timeout. DeskDrawer does that work off the interface thread, but the
target itself can still be slow to answer. See [[troubleshooting]] and [[offline-network-shares]].`,
      },

      {
        slug: "layout-and-monitors",
        title: "Layout and multiple monitors",
        nav: "Layout & monitors",
        description:
          "How boards behave across several displays, mixed DPI scaling, resolution changes and taskbar moves.",
        related: ["boards", "troubleshooting", "windows-integration"],
        body: `Multiple monitors is where desktop tools usually break, because the desktop is one logical
surface spanning displays that can have different sizes, scaling factors and arrangements — and that
arrangement changes whenever a cable is unplugged.

## Boards on several displays

Boards can be placed on any monitor and dragged between monitors. Each is positioned within the
[[work-area]] of the display it is on, so a board is never placed under the taskbar, whichever edge
the taskbar is on.

## Mixed DPI

DeskDrawer declares [[per-monitor-dpi|per-monitor v2 DPI awareness]]. A laptop at 150% scaling next
to an external display at 100% is the ordinary case, and an application that is not per-monitor aware
gets bitmap-scaled by Windows and goes blurry on one of them.

Declaring PerMonitorV2 means DeskDrawer is told about the DPI change and redraws at the correct scale
— including mid-drag, when a board crosses from one display to the other.

## When the display arrangement changes

Unplugging a monitor, changing resolution, or moving the taskbar can leave boards outside the visible
area. **Fix misplaced boards** in the [[tray-menu]] handles this:

- Boards that are off-screen, under the taskbar or overlapping are re-placed, snapped beside other
  boards.
- Boards that are in a valid position are **not** moved.

It never changes board contents, names or sizes. If your layout was fine and one board went astray,
only that board moves.

## What is not stored per monitor

A board's rectangle is stored in screen coordinates, not as "monitor 2, offset x". Moving a
configuration to a machine with a different display arrangement will therefore need a tidy-up; see
[[backup-and-restore]]. This is a real limitation and it is listed in [[limitations]].`,
      },

      {
        slug: "languages",
        title: "Languages and language independence",
        nav: "Languages",
        description:
          "DeskDrawer's Store listing is available in 16 languages, and the application itself is designed so that using it depends very little on reading text at all.",
        related: ["menus", "getting-started", "designing-for-language-independence"],
        body: `There are two separate questions here, and they have different answers.

## The Microsoft Store listing: 16 languages

The DeskDrawer listing on the Microsoft Store — its description, feature list and metadata — is
available in **16 languages**. If your Store is set to one of them, you read about DeskDrawer in your
own language before you buy it.

## The application: designed to need very little language

The application itself is a different matter, and this is the part worth understanding.

DeskDrawer's interface is **icon-only**. Its two menus — the [[board-menu]] and the [[tray-menu]] —
contain no sentences to read: each command is a glyph. Sorting is an arrow and a symbol. Icon size is
four squares of increasing size. Outline is a rectangle. Quit is a power symbol.

That is not a shortcut taken to avoid translation work. It is the same decision that keeps the menus
small and fast, and it has a side effect worth naming plainly: **you can use DeskDrawer comfortably
whether or not your language is one of the 16.**

### What this looks like in practice

| Element | What language it is in |
|---|---|
| Board and tray menus | None — icons only |
| New board names | Numbers: 1, 2, 3… |
| System icon names (This PC, Recycle Bin…) | **Your Windows display language**, taken from Windows |
| Right-click menu on a file | **Your Windows display language** — it is Windows' own menu |
| File names, folder names, tooltips | Whatever they already are on your PC |
| Store listing | 16 languages |

Two of those rows are the important ones. Because DeskDrawer shows the real
[[shell-context-menu]] rather than a hand-written imitation, that menu arrives already translated by
Windows, in your display language, including third-party entries. And because system icons are named
through the shell rather than from a built-in string table — a change made in 1.0.6 — *This PC*
appears as *Este equipo*, *この PC* or *Dieser PC* according to your Windows settings, with no work
on DeskDrawer's part.

Similarly, boards created new are **numbered** rather than given a word like "Board" or "New group".
That was a deliberate change in 1.0.5, so that no layout ever contains a word in a language its owner
does not read.

:::key
16 languages on the Store listing, and an application built so that reading is barely part of using
it. That is the honest version of the claim: DeskDrawer is not translated into every language, but
using it depends very little on translation.
:::

## What is honestly still in English

DeskDrawer is not a fully localised application and this page will not pretend otherwise:

- The application ships without satellite resource assemblies — the few strings it does own are
  English.
- This website and the documentation are English only.
- Error messages written by DeskDrawer itself, and the contents of [[error-log]], are English.

In normal use you will not meet any of these. They appear when something has gone wrong, which is
also when you are most likely to be reading [[troubleshooting]] or writing to [[support]] anyway.

The reasoning behind the icon-only interface, and what it costs, is written up in
[[designing-for-language-independence]].`,
      },
    ],
  },

  {
    title: "Your data",
    items: [
      {
        slug: "configuration-file",
        title: "The configuration file",
        nav: "Configuration file",
        description:
          "Where DeskDrawer keeps your layout, what is in it, how it is written safely, and whether you should edit it.",
        related: ["backup-and-restore", "privacy-and-data", "architecture"],
        body: `Everything DeskDrawer remembers lives in one file: [[config-json]], in the
[[configuration-folder]].

## Finding it

Tray menu → **Open the configuration folder**. You never need to type a path.

If you want one anyway:

| Build | Location |
|---|---|
| Microsoft Store | The package's per-user data folder, managed by Windows |
| [[portable-build|Portable]] | \`%APPDATA%\\DeskDrawer\` |

## What is in it

- Every board: name, rectangle, folded state, [[sort-mode]], [[icon-size]], outline and corner toggles
- [[board-membership]] — which desktop item belongs to which board
- Application preferences

That is all. There is no cache, no index, no copy of any file, and no history of what you have opened.

## How it is written

The file is written to a temporary file and then swapped into place atomically. A crash or a power
cut during a save cannot leave a half-written configuration, because the swap either happens or does
not.

A related failure mode took longer to find: an interrupted save used to be indistinguishable from a
first run, so DeskDrawer would helpfully rebuild a default layout over the top of your real one. That
was fixed in 1.2.3 by making "no configuration yet" and "configuration unreadable" distinct
conditions with different responses.

## Editing it by hand

You can — it is readable JSON. Two cautions:

1. **Quit DeskDrawer first.** It writes on change and will overwrite you otherwise.
2. **The format is not a stable API.** It may change between versions without notice. Nothing outside
   DeskDrawer should depend on its shape.

## The other file in the folder

[[error-log]], a plain-text record of unexpected internal errors. It stays on your machine unless you
attach it to a report yourself. See [[privacy-and-data]].`,
      },

      {
        slug: "backup-and-restore",
        title: "Backup, restore and moving to a new PC",
        nav: "Backup & restore",
        description:
          "Copying one file backs up your entire layout. What transfers cleanly to another machine and what does not.",
        related: ["configuration-file", "uninstall", "layout-and-monitors"],
        body: `## Backing up

Copy [[config-json]] from the [[configuration-folder]] — tray menu → **Open the configuration
folder**. That single file is your entire layout.

You do not need to back up your desktop files as part of this, because DeskDrawer never moved them.
They are in your desktop folder, where whatever already backs up your documents is presumably
covering them.

## Restoring

1. Quit DeskDrawer from the tray menu.
2. Copy your saved \`config.json\` back into the configuration folder, replacing the current one.
3. Start DeskDrawer.

## Moving to another PC

The same procedure works, with one honest caveat.

**What transfers cleanly:** board names, sizes, sort modes, icon sizes, appearance toggles, folded
states, and the assignment of any desktop item whose name matches on the new machine.

**What may need a tidy-up:**

- **Board positions**, if the new machine has a different display arrangement or resolution. Board
  rectangles are stored in screen coordinates. Run **Fix misplaced boards** from the tray menu and
  they will be re-placed inside the visible [[work-area]].
- **Membership for items that are not on the new desktop.** If a file is not there, there is nothing
  to assign. Copy your desktop contents across first, then restore the configuration.

## Starting over

There is no "reset everything" command, deliberately — it is too easy to hit by accident. To start
clean: quit DeskDrawer, delete \`config.json\`, start it again. You get one board containing every
desktop item, exactly as on first run.

:::note
**Fix misplaced boards** in the tray menu is *not* a reset. It re-places boards that are demonstrably
in the wrong place and leaves everything else alone. Nothing it does can lose a board or its contents.
:::`,
      },

      {
        slug: "privacy-and-data",
        title: "Privacy and local data",
        nav: "Privacy & data",
        description:
          "What DeskDrawer stores, what it transmits, and the specific list of things it does not contain.",
        related: ["configuration-file", "uninstall", "no-telemetry-by-default"],
        body: `The short version: DeskDrawer stores your board layout on your own machine and sends
nothing anywhere.

## What is stored, and where

| Data | Where | Leaves your device? |
|---|---|---|
| Boards, geometry, preferences | [[config-json]], locally | No |
| Which icon belongs to which board | [[config-json]], locally | No |
| Unexpected internal errors | [[error-log]], locally | No |
| Anything else | Not stored | — |

## What DeskDrawer does not contain

Stated precisely, because a vague privacy claim is worth nothing:

- No analytics SDK
- No [[telemetry]] of any kind
- No crash or error reporting service
- No update checker of its own — updating is the Microsoft Store's job
- No account system, sign-in or licence phone-home
- No advertising identifier, and no ads
- No bundled plugins or extensions
- **No network connections initiated by the application at all**

That last line is the one that makes the others verifiable rather than promised. An application that
makes no outbound connections cannot be exfiltrating anything, and you can check that claim yourself
with any firewall or network monitor.

## What DeskDrawer can see, by necessity

It reads your desktop folder — that is the product. It resolves icons through the Windows shell, and
it asks the shell for context menus and info tips. All of that is local, in-process work.

It does not read the *contents* of your files. It needs names, types, sizes, dates and icons; it has
no reason to open a document and does not.

## Purchase and licensing

Handled by Windows and the Microsoft Store, not by the application. DeskDrawer contains no licence
check that contacts a server.

## Uninstalling

The Store version's data folder is removed automatically by Windows on uninstall. For a
[[portable-build]], delete the folder yourself. Your desktop files are untouched either way — see
[[uninstall]].

The full policy is on the [[privacy|privacy page]]. The reasoning behind having no telemetry at all,
including what it costs, is in [[no-telemetry-by-default]].`,
      },

      {
        slug: "uninstall",
        title: "Uninstalling",
        nav: "Uninstalling",
        description:
          "How to remove DeskDrawer cleanly, what is left behind (nothing), and how to get your desktop icons back.",
        related: ["installation", "privacy-and-data", "troubleshooting"],
        body: `## The right order

1. **Quit DeskDrawer from the tray menu.** This restores the [[native-icon-layer]] immediately.
2. Uninstall it from Windows Settings → Apps, or by right-clicking it in the Start menu.

Quitting first is not strictly required — see below — but it makes the transition seamless.

## What is removed

The Store version's [[configuration-folder]] is removed automatically by Windows along with the
package. Nothing is left in the registry, no services, no scheduled tasks, no shell extensions,
because none were ever installed. See [[installation]].

For a [[portable-build]]: delete the executable and \`%APPDATA%\\DeskDrawer\`.

## Your files

Untouched. Every file is exactly where it was on your desktop, because DeskDrawer never moved
anything — see [[board-membership]]. Uninstalling a desktop organizer should never be a data
decision, and with DeskDrawer it is not.

## If the desktop looks empty afterwards

This happens if DeskDrawer was still running when it was uninstalled: it had hidden the native icon
layer and was removed before it could restore it.

Two fixes:

- **Immediately:** right-click the desktop → **View** → **Show desktop icons**. If it already shows a
  check mark, click it twice.
- **Or do nothing.** The hiding is session-only and never written to your Windows settings, so your
  icons return at your next sign-in regardless.

:::note
This is why the hiding is session-scoped in the first place. A desktop organizer that can permanently
change a Windows setting can also permanently break it, and the user will not know which setting to
look for.
:::`,
      },
    ],
  },

  {
    title: "Under the hood",
    items: [
      {
        slug: "architecture",
        title: "Architecture",
        nav: "Architecture",
        description:
          "How DeskDrawer is put together: one process, no services, WinForms over the Windows shell, and the reasoning behind each of those choices.",
        level: "Advanced",
        related: ["performance", "memory-usage", "windows-integration"],
        body: `This page describes how DeskDrawer is actually built. It is here because "lightweight" is a
claim, and a claim about software should be checkable.

## Shape of the application

One process. No services, no drivers, no shell extensions, no helper processes, no plugin host.

\`\`\`
DeskDrawer.exe  (one self-contained executable)
├── tray context          — the application; there is no main window
├── board windows         — one per board, drawn at desktop level
├── desktop scanner       — watches the desktop folder for changes
├── icon cache            — background icon resolution, in memory
├── config store          — atomic reads and writes of config.json
└── shell interop         — context menus, clipboard, info tips, links, share, execute
\`\`\`

## Platform choices

| Choice | Reason |
|---|---|
| .NET 9, Windows-targeted | Access to the packaged startup-task API and modern shell projections |
| Windows Forms | Thin over Win32. A board is close to a window with custom painting; a heavier UI framework would add a rendering stack for no benefit |
| [[single-file-executable]], self-contained | No runtime to install, nothing shared to break |
| **Not** trimmed | Trimming breaks COM interop and late-bound calls — see below |
| Workstation GC, non-concurrent | A background collector thread costs memory and CPU for an application that allocates very little |
| Per-monitor v2 DPI | Correct rendering on mixed-scaling setups — see [[per-monitor-dpi]] |

### Why not trimmed

Trimming would shrink the download considerably. It is deliberately off because DeskDrawer's most
important behaviour — showing the real [[shell-context-menu]] — runs through COM interop, and some
shell work is late-bound. A trimmer cannot see those call paths, would remove the types they need,
and the failure would appear at runtime in the exact features that matter most, with nothing at build
time to catch it. A larger file is the correct trade.

## Delegate to the shell

The design rule that shapes most of the code: **where Windows already has behaviour, call Windows
rather than reimplementing it.**

| Behaviour | Provided by |
|---|---|
| Context menus | The shell — real menus, real extensions |
| Copy, cut, paste, drag payloads | Shell clipboard and data objects |
| Hover info tips | The shell |
| Opening files and shortcuts | The shell |
| Resolving \`.lnk\` targets | The shell link interface |
| The Windows 11 Share pane | The shell share UI |
| Icon names for system items | The shell, in your Windows display language |

The cost is a lot of interop code and a lot of care about threading. The benefit is that DeskDrawer
inherits correct behaviour it did not write, including the parts nobody remembers to implement:
[[shortcut]] repair prompts, "how do you want to open this file", per-extension menu entries, and
localisation. See [[languages]].

## Threading

The rule is that the interface thread never waits on the file system.

Anything that can be slow — resolving an icon, reading a [[cloud-placeholder]], following a
[[shortcut]] to a network share, building an info tip — happens on a background thread and updates
the board when it completes. Boards draw a placeholder immediately rather than blocking.

This is the single largest source of past bugs in the product, and the reason for it is worth stating
plainly: on Windows, a file-system call against an unreachable location does not fail quickly, it
blocks until a network timeout. One such call on the interface thread freezes the whole application —
including, memorably, the mouse wheel. See [[offline-network-shares]].

## Boards are not ordinary windows

Board windows sit at desktop level rather than in the normal window stack. That is what produces the
behaviours in [[boards]]: <kbd>Win</kbd>+<kbd>D</kbd> does not hide them, "minimise all" does not
minimise them, <kbd>Alt</kbd>+<kbd>F4</kbd> gives the shutdown dialog, and applications launched over
them still come to the front.

## State

One file, [[config-json]], written atomically. No database, no cache on disk, no index. The entire
persistent state of the application is a layout description small enough to read.

## What this buys

An application with no background services, no network access, no disk cache and one small state file
has a small failure surface. It is also why the honest description of most releases since 1.1.4 is
"stability release, no new features" — see [[eight-rounds-of-audits]].`,
      },

      {
        slug: "windows-integration",
        title: "Windows integration",
        nav: "Windows integration",
        description:
          "The specific Windows behaviours DeskDrawer hooks into — the desktop icon layer, Show desktop, Alt+F4, the Share pane, the Recycle Bin — and how each is made to behave correctly.",
        level: "Advanced",
        related: ["architecture", "menus", "layout-and-monitors"],
        body: `A desktop organizer lives in the one part of Windows that every other program also assumes it
owns. This page lists the integration points and what each one required.

## The desktop icon layer

Windows draws desktop icons through an Explorer-owned view. DeskDrawer reads the same items and hides
that view while it runs, so icons are not shown twice. See [[native-icon-layer]].

The hiding is **session-scoped**: it is not written into your Windows settings. Quitting restores it;
so does signing out. This constraint exists because the failure mode of the alternative is a user
whose desktop icons are gone and who has no idea which setting to change.

## Show desktop

<kbd>Win</kbd>+<kbd>D</kbd> and the taskbar's "Show desktop" corner minimise everything to reveal the
desktop. For DeskDrawer that is backwards: the boards *are* the desktop, so hiding them is the
opposite of what was asked. Since 1.1.2 both gestures leave boards in place.

The trade is stated in the changelog: use the taskbar or <kbd>Alt</kbd>+<kbd>Tab</kbd> to restore
minimised windows.

## Minimise all

Boards do not minimise with other windows either, for the same reason — fixed in 1.0.8.

## Alt+F4

Pressing <kbd>Alt</kbd>+<kbd>F4</kbd> with the desktop focused opens **Shut Down Windows**. Since
1.1.0 a board does the same, rather than closing the board. Closing a board with a system-wide window
shortcut would be a destructive-feeling action triggered by muscle memory.

## Window activation

Applications that open while boards are on screen used to end up stuck behind them. Since 1.1.0
DeskDrawer steps aside so they come to the front. Any tool that paints across the whole desktop has
to solve this or it becomes a trap.

## The Recycle Bin

The bin's icon has to reflect whether it is empty. The obvious implementation — poll the bin
periodically — was replaced in 1.1.0 with change notifications, so the icon updates the moment the
bin changes and idle CPU went down.

That change had a sharp edge found much later. Asking Windows for the bin's state across *all* drives
blocks if any mapped network drive is offline, and it was being asked from a notification thread. In
1.2.5 the query was scoped to local fixed drives, so an unreachable network drive can no longer stall
the application.

## Share

The Windows 11 Share pane works from a board, added in 1.0.9, through the shell's own share
interface rather than a reimplementation.

## Startup

[[autostart]] uses the packaged Windows startup task, so DeskDrawer appears in **Task Manager →
Startup apps** and can be disabled there. The tray toggle and Task Manager agree in both directions —
which required an actual fix in 1.2.3, because either side can change at any time.

## Cloud files and redirected desktops

A desktop backed up by OneDrive is a redirected folder — a [[reparse-point]] — full of
[[cloud-placeholder|placeholders]]. Both need care: query a placeholder the wrong way and you force a
download; treat a local junction as remote and you lose its live file-system watcher. Getting the
second distinction wrong caused two regressions in 1.2.5, written up in
[[reparse-points-and-onedrive]].

## What is deliberately not integrated

No shell extension is installed, so DeskDrawer adds nothing to your right-click menus anywhere else
in Windows. No global keyboard hook. No Explorer replacement. See [[limitations]].`,
      },

      {
        slug: "performance",
        title: "Performance",
        nav: "Performance",
        description:
          "What DeskDrawer does to stay responsive on large, cloud-backed and network-connected desktops — and what can still make it slow.",
        level: "Advanced",
        related: ["memory-usage", "architecture", "troubleshooting"],
        body: `## The design rule

The interface thread never waits on the file system. Everything else on this page follows from that
one rule.

## Idle cost

At rest, DeskDrawer is doing nothing. There is no polling loop, no timer sweeping the desktop, no
background service. It waits on:

- a change notification for the desktop folder
- a change notification for the Recycle Bin
- ordinary window messages

The periodic Recycle Bin check that existed before 1.1.0 was removed precisely because a timer that
fires forever is a permanent tax on a machine that is otherwise asleep.

## Startup

Boards are drawn as soon as the layout is read; icons arrive afterwards. A board with unresolved
icons shows placeholders and fills in, rather than waiting for two hundred shell calls to complete
first. That was the 1.1.5 change, refined in 1.1.6 so that a large or cloud-backed desktop no longer
sat on grey placeholders.

## Icons

Icon resolution is genuinely expensive — Windows may read the file, locate an associated application,
extract a resource, or ask a cloud provider. DeskDrawer resolves each icon once on a background
thread and keeps the result in the [[icon-cache]]. A file that is still downloading gets a generic
icon immediately and its real one when the download completes.

## The slow cases, and what was done about them

Almost every performance bug in this product's history has been the same bug wearing a different hat:
**a file-system call against an unreachable location, made on the interface thread.** Such a call does
not fail quickly; it blocks until a network timeout, freezing everything — including, distinctively,
the mouse wheel.

| Case | Release |
|---|---|
| Hovering a file on an offline share, or a not-yet-downloaded cloud file, to build an info tip | 1.1.4 |
| A board holding a shortcut to an offline network location | 1.2.2 |
| Large paste and drag operations | 1.2.3 |
| Dragging onto a shortcut that reached an offline location through a local symbolic link | 1.2.4 |
| Deleting a desktop file, or hovering the Recycle Bin, with a mapped network drive offline | 1.2.5 |

The last one is instructive: the Recycle Bin query was asking about *all* drives from a notification
thread, so one sleeping NAS could stall the application. Scoping the query to local fixed drives fixed
it. The full story is in [[offline-network-shares]].

## What can still be slow

Honestly:

- **The first paint on a very large desktop.** Boards appear fast; icons take as long as the shell
  takes.
- **A genuinely unreachable target.** Work is off the interface thread, so the application stays
  responsive, but the icon or tooltip that needs that target cannot appear until Windows answers.
- **Another program hammering the desktop folder.** A sync client rewriting many files produces many
  change notifications, and DeskDrawer honours them.

## Measuring it yourself

There are no benchmark figures on this page because a number produced on the developer's machine
tells you nothing about yours, and a marketing figure is worth even less. Task Manager will show you
DeskDrawer's actual CPU and memory on your desktop, which is the only measurement that matters. See
[[memory-usage]] for what to expect and why.`,
      },

      {
        slug: "memory-usage",
        title: "Memory usage",
        nav: "Memory usage",
        description:
          "What DeskDrawer holds in memory, the choices that keep that small, and how to measure it on your own machine.",
        level: "Advanced",
        related: ["performance", "architecture", "troubleshooting"],
        body: `## What is actually held

| In memory | Why |
|---|---|
| The board layout | It is the application's entire state, and it is small |
| Resolved icons ([[icon-cache]]) | Re-resolving on every redraw would be visibly slow |
| One window per board | Boards are windows |
| The .NET runtime | It is a .NET application |

There is no file index, no thumbnail database, no search cache and no history.

## Choices that keep it down

- **Workstation garbage collection, non-concurrent.** Server GC allocates per-core heaps and a
  background collector thread — sensible for a server, waste for a tray utility that allocates very
  little. Configured explicitly in the project rather than left to default.
- **No satellite resource assemblies.** The application ships English resources only, which is
  possible because the interface is icons rather than sentences — see [[languages]].
- **A bounded, in-memory icon cache.** Never written to disk, so it cannot grow across sessions or go
  stale.
- **No plugin host.** Nothing third-party is ever loaded into the process.

## What makes it bigger

Mostly your desktop. Memory scales with the number of desktop items and their [[icon-size]], because
that is what the icon cache holds. A desktop of 30 items and a desktop of 500 are not the same
application in memory.

## Why there is no number on this page

Because any figure quoted here would be measured on one machine with one desktop, and yours differs
in the variables that actually drive the number: how many items you have, at what icon size, on how
many monitors, with which cloud client.

Measure it directly instead — **Task Manager → Details → DeskDrawer.exe**. That figure is true for
your machine, which is more than a number on a marketing page can be.

:::note
Compare it against what it replaces. DeskDrawer is one process with no services. Comparing a single
tray process against a suite's collection of background components is the comparison worth making,
and it is one you can perform yourself in Task Manager.
:::`,
      },

      {
        slug: "limitations",
        title: "Limitations",
        nav: "Limitations",
        description:
          "What DeskDrawer does not do, what it will not do, and the rough edges that are known and unfixed.",
        related: ["roadmap", "troubleshooting", "compare"],
        body: `A product page lists what something does. This page lists what it does not, because that is
usually what decides whether a tool fits.

## Deliberately out of scope

These are not missing features. They are decisions, and they are what keep the application to one
process with no services.

- **No automatic filing rules.** DeskDrawer does not sort new files into boards by type, name or age.
  You decide what goes where. Rule engines are the feature that turns an organizer into a filing
  system you did not design.
- **No launcher, dock or widgets.** Grouping desktop icons is the whole product.
- **No theming or wallpaper engine.** Boards take two appearance toggles and nothing else.
- **No plugin system.** Nothing third-party is loaded into the process. This is also a security
  position — see [[architecture]].
- **No global hotkeys or rebindable keys.** Both need a keyboard hook running for every keystroke on
  the machine, which is a large permanent cost for a tool meant to be invisible.
- **No sync between machines.** That would mean an account, a server and network access, which would
  end the claim in [[privacy-and-data]]. Copy [[config-json]] instead — see [[backup-and-restore]].
- **No portable build for end users.** The Store version is the supported route, because it is signed,
  it updates itself and it uninstalls cleanly.

## Real limitations

Things that would be better and currently are not:

- **Board positions do not survive a display-arrangement change gracefully.** Rectangles are stored in
  screen coordinates, so moving a configuration to a machine with different monitors needs **Fix
  misplaced boards** afterwards. See [[layout-and-monitors]].
- **The configuration format is not a stable API.** It may change between versions. Nothing outside
  DeskDrawer should depend on its shape.
- **The application's own strings are English only.** This is nearly invisible in normal use because
  the interface is icon-driven, but error text and [[error-log]] are English. See [[languages]].
- **This website and its documentation are English only.**
- **x64 only.** No ARM64 build today.
- **No accessibility story for screen readers.** Boards are custom-painted surfaces, not standard
  controls, and their contents are not currently exposed through UI Automation. If you rely on a
  screen reader for the desktop, DeskDrawer will not serve you well, and pretending otherwise would
  waste your money.
- **A very large desktop takes a moment to show all its icons.** Boards appear immediately; icons
  fill in. See [[performance]].

## Known rough edges

- **A genuinely unreachable network target** cannot produce an icon or tooltip until Windows gives
  up on it. The application stays responsive; that one item does not.
- **Heavy sync activity on the desktop folder** produces a stream of change notifications, and
  DeskDrawer honours all of them.

If one of these is a blocker for you, that is useful to know before buying rather than after. The
[[roadmap]] says which of them are being looked at.`,
      },
    ],
  },

  {
    title: "Help",
    items: [
      {
        slug: "troubleshooting",
        title: "Troubleshooting",
        nav: "Troubleshooting",
        description:
          "Fixes for the problems that actually come up: missing icons, misplaced boards, freezes, an empty desktop, and startup not sticking.",
        related: ["support", "performance", "uninstall"],
        body: `## My desktop is empty and DeskDrawer is not running

The [[native-icon-layer]] was hidden and DeskDrawer stopped before it could restore it.

**Fix now:** right-click the desktop → **View** → **Show desktop icons**. If it already shows a check
mark, click it twice.

**Or wait:** the hiding is session-only and is never written to your Windows settings, so your icons
return at your next sign-in regardless.

## My boards are off-screen or under the taskbar

Usually after a resolution change, unplugging a monitor, or moving the taskbar.

Tray menu → **Fix misplaced boards**. It re-places only boards that are genuinely off-screen, covered
by the taskbar or overlapping; boards that are fine are left where they are. Contents, names and
sizes are never changed. See [[layout-and-monitors]].

## Icons are grey placeholders, or slow to appear

Expected briefly on a large or cloud-backed desktop: boards draw first and icons fill in behind them.
A [[cloud-placeholder]] that is still downloading shows a generic icon and updates when it finishes.

If placeholders persist for a long time, something on the desktop is pointing at a location Windows
cannot reach — see the next item.

## DeskDrawer freezes, or the mouse wheel stops working

This specific pair of symptoms almost always means one thing: an item on a board points at a network
location that is offline — a disconnected VPN, a sleeping NAS, a mapped drive that is gone.

- Reconnect the network location, or remove that item from your desktop.
- Make sure you are on the current version. Five separate cases of this were fixed across 1.1.4,
  1.2.2, 1.2.3, 1.2.4 and 1.2.5; the last removed a stall triggered by deleting a file or hovering the
  Recycle Bin while a mapped drive was offline. See [[offline-network-shares]].

## A shortcut does nothing when I click it

Its target is gone. Since 1.2.1 Windows' own *"Problem with Shortcut — do you want to delete it?"*
prompt appears, as it does on the real desktop. Earlier versions swallowed it. See [[shortcut]].

## "Run at startup" does not stick

Check **Task Manager → Startup apps**. DeskDrawer registers as a proper Windows startup task, so
Task Manager can disable it and that disable wins. Re-enable it there or in the tray menu — since
1.2.3 the two agree in both directions. See [[autostart]].

## A new file did not appear on a board

New desktop items join the [[default-board]]. If it is folded or off-screen you will not see them
there. Unfold it, or run **Fix misplaced boards**.

## Win+D hides my windows but not my boards

That is intended. Boards *are* the desktop, so showing the desktop shows them. Use the taskbar or
<kbd>Alt</kbd>+<kbd>Tab</kbd> to bring minimised windows back. See [[windows-integration]].

## I want to see the plain Windows desktop for a moment

Tray menu → **Switch view**. Boards hide, native icons come back, and DeskDrawer keeps running. Switch
again to return. See [[view-mode]].

## Something else

Send a report. DeskDrawer has no [[telemetry]], so a problem that is not reported is a problem the
developer does not know exists.

Attach [[error-log]] from the configuration folder — tray menu → **Open the configuration folder**. It
is plain text, you can read it first, and it makes a fix far more likely. See [[support]].`,
      },

      {
        slug: "licensing",
        title: "Licensing and purchase",
        nav: "Licensing",
        description:
          "How the one-time purchase works, what it covers, how many machines it installs on, and why no price appears on this site.",
        related: ["installation", "download", "support"],
        body: `DeskDrawer is a [[one-time-purchase]] on the Microsoft Store. One payment, permanent use.

## What it includes

- The application, permanently
- Updates through the Microsoft Store
- Every feature — there is no tier, no "pro" edition, no in-app purchase

## What it does not include

- No subscription or renewal
- No trial that expires into a locked state
- No advertising-supported mode
- No paid plugins — there is no plugin system at all

## Installing on your own machines

The licence is tied to your Microsoft account, handled by the Store. Signing in on another PC and
installing from your library works the same way it does for any Store application; the Microsoft Store
terms are authoritative on the details.

## Reinstalling and new PCs

Install from your Store library and sign in. You are not buying again. Your layout is not carried
across automatically — copy [[config-json]] if you want it, as described in [[backup-and-restore]].

## Why there is no price on this site

Because it would be wrong somewhere. Store pricing varies by market and changes over time, and a
figure printed here would go stale and disagree with the page you actually buy from. The
[[download|Store listing]] is the single source of truth for price and it is one click away.

## Refunds

Microsoft Store purchases are governed by Microsoft's refund policy, and refunds are requested through
your Microsoft account rather than from the developer.

## Licence terms

DeskDrawer is proprietary software. The full licence ships with the application and is in the
repository. If something in it blocks a legitimate use, write to [[support]] — it is more likely to be
an oversight than a position.`,
      },
    ],
  },
];
