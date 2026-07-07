# Changelog

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
