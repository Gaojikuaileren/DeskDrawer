/**
 * Release history — released versions only; work that is built but not yet on the Store
 * goes on the roadmap page, never here.
 *
 * Dates come from commit history: the public repository's up to 1.2.5, the commit that
 * shipped the version after that. The earliest versions have none: they predate the
 * repository being made public on 3 July 2026. An invented date would be worse than an
 * absent one.
 */

export const RELEASES = [
  {
    version: "1.2.9", date: "2026-09-01", kind: "Feature",
    summary: "Fill rows or fill columns, per board — and a fix for system icons the Store version could not bring back.",
    notes: [
      "**Item flow, per board.** A board can fill rows left to right, then wrap down — the default, and what every existing board keeps — or fill columns top to bottom, then wrap right. Two new buttons in the board menu. A board that fills columns scrolls sideways.",
      "In the Store version, a system icon (This PC, Recycle Bin…) hidden by an early version of DeskDrawer could stay hidden even after **Bring back system icons**. It now comes back.",
      "Smoother right after sign-in on a busy PC: when Windows is slow to let DeskDrawer run, it now backs off instead of competing for the mouse, and repaints icons in smaller steps.",
      "Lower memory use in some situations: boards hidden in desktop view release their drawing surfaces, the selection band frees its bitmap when you let go, and all boards share one menu.",
    ],
  },
  {
    version: "1.2.8", date: "2026-08-08", kind: "Feature",
    summary: "A way back for removed system icons, boards that follow taskbar and resolution changes, and the icon fixes of 1.2.7.",
    notes: [
      "Includes 1.2.7 and its 1.2.7.1 hotfix, which were not released on their own. There was no 1.2.6.",
      "A new tray-menu button **brings back the system icons** (This PC, Recycle Bin…) you removed from a board with <kbd>Delete</kbd>. It appears only while one is hidden.",
      "Boards fit back inside the screen when the work area changes — the taskbar set to auto-hide, a toolbar docking, a resolution or scaling change.",
      "Signing out or shutting down while DeskDrawer is running now always restores the native desktop icons cleanly.",
      ".url shortcuts — Steam game shortcuts, browser links — show their real icon instead of a blank page, and icons fill their space instead of looking undersized inside a faint grey frame.",
      "The rename box grows to fit the name you are editing.",
      "Dragging icons over shortcuts no longer reads each shortcut from disk on every mouse move, and copying no longer risks a pause of up to two seconds while another program holds the clipboard.",
      "Removing a system icon from a board can no longer be undone by a background refresh that happened at the same moment.",
    ],
  },
  {
    version: "1.2.5", date: "2026-07-21", kind: "Stability",
    summary: "Fixes from an eighth code audit. Two of the four were regressions caused by the previous round's own fix.",
    notes: [
      "Fixed a rare freeze — and a mouse-wheel stall — when a mapped network drive was offline and you deleted a desktop file or hovered the Recycle Bin. The Recycle Bin's state is now read only from local drives, so an unreachable network drive can no longer stall the app.",
      "Fixed two edge cases with desktop folders and shortcuts that are junctions or symbolic links to a **local** location: board membership after a cancelled move, and live desktop refresh, both behave correctly again.",
      "Double-clicking a board's collapse arrow or resize handle no longer opens an icon sitting behind it.",
    ],
    reading: ["reparse-points-and-onedrive", "offline-network-shares"],
  },
  {
    version: "1.2.4", date: "2026-07-21", kind: "Stability",
    summary: "Fixes from a seventh audit, including the most serious bug in the product's history.",
    notes: [
      "Fixed a rare case where clearing the desktop selection after a **New** item — on a busy PC, for example while OneDrive or antivirus was scanning the desktop — could crash Windows Explorer and briefly restart the desktop. This is the most important fix in this release.",
      "A shortcut pointing at an offline network location through a symbolic link on a local drive no longer risks freezing the app when you drag onto it.",
      "Board layout is safer against an unlucky crash mid-save.",
      "Renaming a board by double-click no longer swallows the next file's rename click.",
    ],
    reading: ["hiding-the-desktop-icon-layer", "eight-rounds-of-audits"],
  },
  {
    version: "1.2.3", date: "2026-07-21", kind: "Stability",
    summary: "A hardening pass over everything 1.2.2 touched.",
    notes: [
      "Removed several rare ways the app could freeze or stop responding to the mouse wheel: a board holding a shortcut to an offline network location, and large paste or drag operations.",
      "In single-click-launch mode, clicking a board's title bar, resize corner or collapse arrow no longer launches the icon behind it.",
      "An interrupted save can no longer be mistaken for a first run, and autostart now reflects exactly what you — or Task Manager — set, in both directions.",
      "Many smaller correctness fixes around renaming, drag-and-drop, icon refresh and clean exit.",
    ],
  },
  {
    version: "1.2.2", date: "2026-07-20", kind: "Stability",
    summary: "A thorough hardening pass over the whole application.",
    notes: [
      "Creating several **New** items in a row on the desktop is dependable on every path, including the classic \"Show more options\" menu: items reliably land on the desktop, never nested, never a \"16389\" error.",
      "Removed a rare freeze when a shortcut on a board pointed at an offline network location — a disconnected VPN or a sleeping NAS — which could also stop the mouse wheel working.",
      "Tightened many smaller edge cases around renaming, drag-and-drop between boards, autostart and icon refreshing.",
    ],
  },
  {
    version: "1.2.1", date: "2026-07-20", kind: "Feature",
    summary: "The full Windows context menu, and Windows' own dialogs stopped being swallowed.",
    notes: [
      "Right-clicking an icon on a board now gives the **full** Windows menu — the same one the real desktop shows under \"Show more options\". Entries that were missing are back: Open with, Send to, Copy as path, Share, Restore previous versions, and any right-click add-ins you have installed (7-Zip, Git, your editor, and so on).",
      "A shortcut whose target has been deleted no longer does nothing. Windows' own \"Problem with Shortcut — do you want to delete it?\" prompt appears, exactly as on the real desktop. As a side effect, other things Windows normally tells you about are no longer swallowed either — such as the \"How do you want to open this file?\" picker for a file type with no associated app.",
    ],
    reading: ["designing-for-language-independence"],
  },
  {
    version: "1.2.0", date: "2026-07-14", kind: "Fix",
    summary: "The desktop New menu, fixed for the case where native icons are hidden.",
    notes: [
      "Fixed the desktop **New** menu misbehaving while the icons are hidden: a new Text Document or Bitmap Image could fail with \"file system error (16389)\", and a New item created right after a New Folder could land *inside* that folder instead of on the desktop. Creating items — including several in a row — now works reliably.",
    ],
  },
  {
    version: "1.1.6", date: "2026-07-14", kind: "Stability",
    summary: "Drag onto folder shortcuts, and a broad reliability pass from a second full audit.",
    notes: [
      "You can now drag a file onto a **folder shortcut**, not only a real folder, to move it inside — just like on the desktop.",
      "Icon loading no longer leaves a large or cloud-backed desktop showing grey placeholders, and a file that is still downloading gets its real icon once it finishes.",
      "Fixes across file and configuration safety, renaming, drag-and-drop, autostart and multi-user edge cases — including several the previous release's own fixes had introduced.",
    ],
    reading: ["eight-rounds-of-audits"],
  },
  {
    version: "1.1.5", date: "2026-07-14", kind: "Stability",
    summary: "Eighteen fixes from the first full code audit.",
    notes: [
      "Icons now load in the background, so boards no longer freeze while fetching thumbnails on a large desktop or for cloud and network files.",
      "Rename, the right-click menu and folder drops are hardened so an action always targets the file you meant — a rename can no longer accidentally move a file off the desktop.",
      "Board organization is better protected in edge cases — a busy disk at startup, reordering a board with hidden items — that could previously misplace a file's board.",
      "Memory, startup and shared-PC robustness fixes.",
    ],
  },
  {
    version: "1.1.4", date: "2026-07-13", kind: "Fix",
    summary: "Safer drag-into-folder, and the first of five fixes for offline network locations.",
    notes: [
      "Dragging a file across drives now **copies** it, exactly as the desktop does, instead of moving it — so a file is never accidentally removed from a USB stick or a network drive.",
      "The folder you are about to drop into highlights while you drag, so it is clear whether you are reordering icons or dropping the file inside.",
      "A file only leaves its drawer once it has actually moved; a cancelled move now keeps it put.",
      "Hovering a file no longer risks a pause when it points to an offline network share or a not-yet-downloaded cloud file — the Windows info tip now loads in the background.",
    ],
    reading: ["offline-network-shares"],
  },
  {
    version: "1.1.3", date: "2026-07-13", kind: "Feature",
    summary: "Drag files into folders, and standard Windows info tips.",
    notes: [
      "You can now drag a file onto a folder shown on a board to move it into that folder — the same drag-into-a-folder behaviour as the real desktop. Works for files dragged in from another window and for files already on a board.",
      "Hovering a file on a board shows the standard Windows info tip: type, size, date modified, a shortcut's target, an image's dimensions.",
    ],
  },
  {
    version: "1.1.2", date: "2026-07-07", kind: "Fix",
    summary: "Show desktop stopped hiding the boards.",
    notes: [
      "Win+D and the taskbar \"Show desktop\" corner no longer collapse your boards. Because the boards are your desktop, showing the desktop now keeps them in place instead of hiding them. To bring minimized windows back, use the taskbar or Alt+Tab.",
    ],
    reading: ["hiding-the-desktop-icon-layer"],
  },
  {
    version: "1.1.1", kind: "Release",
    summary: "The Microsoft Store release.",
    notes: [
      "DeskDrawer is now available on the Microsoft Store.",
      "Streamlined the app's Windows permissions for Store certification — the app requests only what a packaged desktop app needs.",
      "One behaviour change from that: deleting a special desktop icon (This PC, Recycle Bin…) from a board no longer also hides it on the real Windows desktop. Everything else works exactly as before.",
    ],
  },
  {
    version: "1.1.0", kind: "Fix",
    summary: "Desktop-level behaviours corrected, and lower idle CPU.",
    notes: [
      "Alt+F4 while boards are on screen now opens the standard Windows \"Shut Down Windows\" dialog — exactly like pressing Alt+F4 on the real desktop. It no longer closes a board.",
      "Apps that open while boards are on screen no longer get stuck behind them — DeskDrawer steps aside so they come to the front.",
      "Lighter on your PC: the Recycle Bin icon now updates the moment the bin changes, the old periodic background check is gone, and idle CPU use is lower.",
      "Board pinning is more reliable right after sign-in.",
    ],
    reading: ["hiding-the-desktop-icon-layer"],
  },
  {
    version: "1.0.9", kind: "Feature",
    summary: "Share pane, better clipboard, and the board/desktop view switch.",
    notes: [
      "Share files straight from a board using the Windows 11 Share pane.",
      "More reliable copy, cut and paste of grouped items between boards and File Explorer.",
      "Menus close cleanly when you click away.",
      "Draw a marquee selection starting from an empty desktop.",
      "Switch between board view and a plain desktop from the tray menu.",
    ],
  },
  {
    version: "1.0.8", kind: "Feature",
    summary: "Show or hide native icons from the tray; boards stop minimizing.",
    notes: [
      "Show or hide the native desktop icons directly from the tray menu.",
      "The reset button now only re-tiles misplaced boards — your boards and their contents are left untouched.",
      "Boards no longer minimize along with other windows (Win+D / minimize all).",
    ],
  },
  {
    version: "1.0.7", kind: "Feature",
    summary: "Cross-board marquee selection.",
    notes: [
      "Marquee-select icons across several boards at once.",
      "More reliable drag-and-drop from a board into File Explorer and other apps.",
      "Keyboard shortcuts work immediately after a marquee selection.",
    ],
  },
  {
    version: "1.0.6", kind: "Release",
    summary: "Store packaging, and system icon names taken from Windows.",
    notes: [
      "Microsoft Store packaging (MSIX); autostart now uses the official Windows startup task, manageable in Task Manager like any startup app.",
      "System icons (Recycle Bin, This PC…) are named in your Windows display language.",
      "Internal cleanup for a quieter, leaner app.",
    ],
    reading: ["designing-for-language-independence"],
  },
  {
    version: "1.0.5", kind: "Feature",
    summary: "Auto-arranging layout, and numbered board names.",
    notes: [
      "Layout auto-arranges after icon-size changes: boards stay inside the work area — never under the taskbar — and never overlap.",
      "New tray reset button re-tiles all boards as a rescue; boards and contents untouched.",
      "New boards are numbered (1, 2, 3…) — no language-specific names anywhere.",
    ],
    reading: ["designing-for-language-independence"],
  },
  {
    version: "1.0.4", kind: "Fix",
    summary: "Live Recycle Bin icon, and elastic drag between boards.",
    notes: [
      "Recycle Bin icon refreshes automatically when the bin is emptied or filled.",
      "Elastic drag: dragging between boards can no longer trigger Explorer's interrupted-operation dialog; drag out to Explorer and back seamlessly.",
    ],
  },
  {
    version: "1.0.3", kind: "Feature",
    summary: "Drag out to Explorer, and clipboard both directions.",
    notes: [
      "Drag files from a board straight into File Explorer, or any app.",
      "Ctrl+C / Ctrl+X / Ctrl+V between boards and Explorer, both directions.",
    ],
  },
  {
    version: "1.0.2", kind: "Feature",
    summary: "Special desktop icons can be removed from a board.",
    notes: [
      "Special desktop icons (This PC, Recycle Bin…) can be deleted from a board. At the time this also hid them on the real desktop, reversible from Windows Settings — the real-desktop part was later removed in 1.1.1.",
    ],
  },
  {
    version: "1.0.1", kind: "Fix",
    summary: "Double-click reliability and hover-only controls.",
    notes: [
      "Fixed double-click open being swallowed in some window arrangements.",
      "With outlines hidden, board controls appear only while hovering the board.",
    ],
  },
  {
    version: "1.0.0", kind: "Release",
    summary: "First release.",
    notes: [
      "Transparent frameless boards, real desktop behaviour, per-board sorting, folding boards, marquee selection, icon-only interface.",
    ],
  },
];
