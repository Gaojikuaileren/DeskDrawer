# Changelog

## 1.2.5
- A stability release fixing issues found in a further code audit — no new features.
- Fixed a rare freeze (and mouse-wheel stall) that could happen when a mapped network drive was offline
  and you deleted a desktop file or hovered the Recycle Bin — the bin state is now read only from local
  drives, so an unreachable network drive can no longer stall the app.
- Fixed two edge cases with desktop folders/shortcuts that are junctions or symbolic links to a local
  location: board membership and live desktop refresh now behave correctly for them again.
- Double-clicking a board's collapse arrow or resize handle no longer accidentally opens an icon behind it.

## 1.2.4
- A stability release fixing issues found in a deep code audit — no new features.
- Fixed a rare case where clearing the desktop selection after a "New" item (on a busy PC — e.g. while
  OneDrive or antivirus was scanning the desktop) could crash Windows Explorer and briefly restart the
  desktop. This is the most important fix in this release.
- A shortcut pointing at an offline network location (via a symbolic link on a local drive) no longer
  risks freezing the app when you drag onto it.
- Your board layout is a little safer against an unlucky crash mid-save.
- A minor rename glitch (renaming a board by double-click could swallow the next file's rename click) is gone.

## 1.2.3
- Another stability and reliability release — no new features, a deep hardening pass over the areas the
  1.2.2 work touched.
- Removed several rare ways the app could briefly freeze or stop responding to the mouse wheel when a
  board held a shortcut to an offline network location, or during large paste/drag operations.
- In single-click-launch mode, clicking a board's title bar, resize corner, or collapse arrow no longer
  ever launches the icon sitting behind it.
- Your board layout is safer: an interrupted save can no longer be mistaken for a first run, and autostart
  now reflects exactly what you (or Task Manager) set, in both directions.
- Many smaller correctness fixes around renaming, drag-and-drop, icon refresh, and a clean exit.

## 1.2.2
- A stability and reliability release — no new features, just a thorough hardening pass over the whole app.
- Creating several **New** items in a row on the desktop is now dependable on every path, including the
  classic "Show more options" menu: items reliably land on the desktop (never nested, never a "16389" error).
- Removed a rare freeze that could happen when a shortcut on a board pointed at a network location that
  was offline (a disconnected VPN or sleeping NAS), which could also make the mouse wheel stop working.
- Tightened up many smaller edge cases around renaming, drag-and-drop between boards, autostart, and icon
  refreshing so they behave correctly in more situations.

## 1.2.1
- Right-clicking an icon on a board now gives the **full** Windows menu — the same one the real desktop
  shows under "Show more options". Entries that were previously missing are back, including Open with,
  Send to, Copy as path, Share, Restore previous versions, and any right-click add-ins you have
  installed (7-Zip, Git, your editor, and so on).
- A shortcut whose target has been deleted no longer does nothing when you click it. Windows' own
  "Problem with Shortcut — do you want to delete it?" prompt appears, exactly as on the real desktop.
  As a side effect, other things Windows normally tells you about are no longer swallowed either —
  e.g. the "How do you want to open this file?" picker for a file type with no associated app.

## 1.2.0.0
- Fixed the desktop **New** menu misbehaving while the icons are hidden: a new Text Document or
  Bitmap Image could fail with "file system error (16389)", and a New item created right after a
  New Folder could land *inside* that folder instead of on the desktop. Creating items — including
  several in a row — now works reliably.

## 1.1.6
- You can now drag a file onto a **folder shortcut** (not only a real folder) to move it inside,
  just like on the desktop.
- A broad reliability & quality pass from a second full code audit: icon loading no longer leaves a
  large or cloud desktop showing grey placeholders (and a file that's still downloading gets its real
  icon once it finishes), plus fixes across file/config safety, renaming, drag-and-drop, autostart,
  and multi-user edge cases — including a few issues the previous release's own fixes had introduced.

## 1.1.5
- A reliability and safety pass — 18 fixes from a full code audit:
  - Icons now load in the background, so boards no longer freeze while fetching thumbnails on a
    large desktop or for cloud / network files.
  - Rename, the right-click menu, and folder drops are hardened so an action always targets the
    file you meant — a rename can no longer accidentally move a file off the desktop.
  - Your board organization is better protected in edge cases (a busy disk at startup, reordering
    a board that has hidden items) that could previously misplace a file's board.
  - Memory, startup, and shared-PC (multi-user) robustness fixes.

## 1.1.4
- Refinements to the drag-a-file-into-a-folder feature from 1.1.3:
  - Dragging a file across drives now **copies** it (exactly as the desktop does) instead of moving
    it, so a file is never accidentally removed from a USB stick or a network drive.
  - The folder you're about to drop into now highlights while you drag, so it's clear whether you're
    reordering icons or dropping the file inside a folder.
  - A file only leaves its drawer once it has actually moved — a cancelled move now keeps it put.
- Hovering a file no longer risks a pause when it points to an offline network share or a
  not-yet-downloaded cloud file — the Windows info tip now loads in the background.

## 1.1.3
- You can now drag a file onto a folder shown on a board to move it into that folder — the
  same drag-into-a-folder behavior as the real desktop. Works both for files dragged in from
  another window and for files already sitting on a board.
- Hovering over a file on a board now shows the standard Windows info tip (type, size, date
  modified, a shortcut's target, an image's dimensions), just as it does on the desktop.

## 1.1.2
- Win+D and the taskbar "Show desktop" corner no longer collapse your boards. Because the
  boards are your desktop, showing the desktop now keeps them in place instead of hiding them.
  (To bring minimized windows back, use the taskbar or Alt+Tab.)

## 1.1.1 — Microsoft Store release
- DeskDrawer is now available on the Microsoft Store
- Streamlined the app's Windows permissions for Store certification (the app requests
  only what a packaged desktop app needs)
- One behavior change from that: deleting a special desktop icon (This PC, Recycle Bin…)
  from a board no longer also hides it on the real Windows desktop — everything else works
  exactly as before

## 1.1.0
- Alt+F4 while boards are on screen now opens the standard Windows "Shut Down Windows"
  dialog — exactly like pressing Alt+F4 on the real desktop (it no longer closes a board)
- Apps that open while boards are on screen (editors, games, tools) no longer get stuck
  behind the boards — DeskDrawer steps aside so they come to the front
- Lighter on your PC: the Recycle Bin icon now updates the moment the bin changes, the
  old periodic background check is gone, and idle CPU use is lower
- Board pinning is more reliable right after sign-in / startup

## 1.0.9
- Share files straight from a board using the Windows 11 Share pane
- More reliable copy, cut, and paste of grouped items between boards and File Explorer
- Menus close cleanly when you click away
- Draw a marquee selection starting from an empty desktop
- Switch between board view and a plain desktop from the tray menu

## 1.0.8
- Show or hide the native desktop icons directly from the tray menu
- The reset button now only re-tiles misplaced boards — your boards and their contents
  are left untouched
- Boards no longer minimize along with other windows (Win+D / "minimize all")

## 1.0.7
- Marquee-select icons across several boards at once
- More reliable drag-and-drop from a board into File Explorer and other apps
- Keyboard shortcuts work immediately after a marquee selection

## 1.0.6 — Store packaging
- Microsoft Store packaging (MSIX); autostart now uses the official Windows startup task,
  manageable in Task Manager like any startup app
- System icons (Recycle Bin, This PC…) are named in your Windows display language
- Internal cleanup for a quieter, leaner app

## 1.0.5
- Layout auto-arranges after icon-size changes: boards stay inside the work area
  (never under the taskbar) and never overlap
- New tray reset button re-tiles all boards as a rescue — boards and contents untouched
- New boards are numbered (1, 2, 3…) — no language-specific names anywhere

## 1.0.4
- Recycle Bin icon refreshes automatically when the bin is emptied or filled
- Elastic drag: dragging between boards can no longer trigger Explorer's
  interrupted-operation dialog; drag out to Explorer and back seamlessly

## 1.0.3
- Drag files from a board straight into File Explorer (or any app)
- Ctrl+C / Ctrl+X / Ctrl+V between boards and Explorer, both directions

## 1.0.2
- Special desktop icons (This PC, Recycle Bin…) can be deleted from a board;
  at the time this also hid them on the real desktop (reversible from Windows Settings) —
  the real-desktop part was later removed in 1.1.1

## 1.0.1
- Fixed double-click open being swallowed in some window arrangements
- With outlines hidden, board controls appear only while hovering the board

## 1.0.0
- First release: transparent frameless boards, real desktop behavior, per-board
  sorting, folding boards, marquee selection, icon-only interface
