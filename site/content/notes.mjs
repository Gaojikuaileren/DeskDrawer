/**
 * Engineering notes.
 *
 * These are the pages nobody but the developer of this application can write: why a
 * decision was made, what it cost, and what broke afterwards. No general-interest
 * "productivity tips" articles — if the subject is not specifically about how
 * DeskDrawer is built, it does not belong here.
 */

const D = "2026-08-07";

export const NOTES = [
  {
    slug: "why-boards-have-no-title-bar",
    title: "Why DeskDrawer's boards have no title bar",
    tag: "Design decision",
    date: D,
    keywords: ["desktop organizer design", "screen space", "interface density"],
    description:
      "Every desktop organizer puts a title bar on top of each container. Removing it was the first design decision in DeskDrawer, and it drove most of the ones that followed.",
    body: `The first prototype had title bars, because that is what containers have. It looked
professional and it was wrong, and it took a full-screen screenshot to see why.

Six boards on a 1080p display, each with a title bar about 28 pixels high plus its border and
padding, spent roughly 200 vertical pixels — near enough a tenth of the screen — on chrome. Those
pixels were not showing files. They were showing six copies of the word "Board" and six close buttons
for a thing that is not a window and cannot meaningfully be closed.

The purpose of a desktop organizer is to give you more usable desktop. Spending a tenth of the screen
to announce that an organizer is present is working against the product's only job.

## What a title bar is actually for

Three things, usually: it names the container, it gives you somewhere to drag it, and it holds
controls.

The naming is worth very little here. You know what is in a board because you can see the icons in
it; the label matters when scanning a layout you have not looked at for a week, which is not most of
the time. Dragging and controls are real needs, but neither requires a full-width strip.

## Where the controls went

Into one compact widget in the **bottom-right corner** of each board: fold arrow, name, resize grip,
on a single line.

The bottom-right corner is the right place because of how icon grids fill. Icons flow from the
top-left, and the last row is almost never complete, so the bottom-right cell is usually empty. The
controls occupy space that was already unused. A title bar, by contrast, occupies space that is
always at a premium: the top, where the first row of icons wants to be.

That gives a smaller, quieter, denser board — the same icons in less area — and the resize grip ends
up adjacent to the corner you would naturally drag anyway.

## Then the outlines came off

Once the chrome was one small cluster, the border started looking like the loudest thing on screen,
so it became a toggle. With outlines off, a board is nothing but your icons on your wallpaper, and
the widget fades in only when the pointer is over the board.

This is the mode most people settle on, and it is the state the whole product is designed around: the
tool disappears and the desktop remains.

## What it cost

Three real things, stated honestly:

**Discoverability.** A control you cannot see is a control you may not find. The widget is in one
consistent place on every board, and outlines are on by default so the first-run experience shows
where things are — but a title bar would be more obvious, and there is no pretending otherwise.

**A conditioned expectation.** People expect a container to have a bar at the top. The first few
minutes with DeskDrawer involve unlearning that.

**Hit-testing precision.** Three controls on one line in a corner is a small target area, and it sits
on top of a surface that also responds to clicks. Getting this exactly right took two releases: in
1.2.3 clicking the title bar, resize corner or fold arrow in single-click-launch mode could launch
the icon sitting behind it, and in 1.2.5 double-clicking the fold arrow or the resize grip could open
an icon behind the widget. Both are the same class of bug, and both are a direct consequence of
putting controls on top of content rather than in a reserved strip.

That is the honest ledger. A title bar would have avoided two bugs and cost a tenth of the screen,
permanently, for every user. It was still the wrong trade.`,
  },

  {
    slug: "hiding-the-desktop-icon-layer",
    title: "Hiding the desktop icon layer without breaking the desktop",
    tag: "Windows integration",
    date: D,
    keywords: ["Windows desktop", "Explorer", "shell integration", "SysListView32"],
    description:
      "DeskDrawer has to hide the icons Windows draws, without changing a setting, without surviving a crash, and without upsetting Explorer. Each of those constraints came from a specific failure.",
    body: `DeskDrawer draws your desktop icons inside boards. Windows is also drawing them, in the icon
view that Explorer owns. Something has to give, or every icon appears twice.

Hiding that view is the single most invasive thing this application does, and the rules around it
were written one failure at a time.

## Rule 1: never write a Windows setting

Windows has a real setting for this — the **Show desktop icons** item in the desktop's View menu. The
obvious implementation is to turn it off at startup and back on at exit.

It is the wrong implementation, and the reason is the crash case. If the application exits without
running its cleanup — a hard kill, a power cut, an uninstall while it is running — the setting stays
off. The user now has a permanently empty desktop, no running application to blame, and no idea which
Windows setting was changed. From their side the desktop is simply broken.

So the hiding is **session-scoped**: it lasts only as long as the current sign-in and is never
persisted. Quitting restores the icons. Crashing restores them at the next sign-in. Uninstalling
while running restores them at the next sign-in. The worst case is "sign out and back in", which is
recoverable by someone who does not know what happened, and that is the bar an invasive behaviour has
to clear.

It also means the desktop's own **View → Show desktop icons** still works as an escape hatch, which
is the instruction on the [[troubleshooting]] page.

## Rule 2: never show both layers at once

Boards and native icons are never displayed together, because that shows every item twice and neither
copy is authoritative. This is why [[view-mode]] is a toggle rather than two independent switches, and
why creating a new board switches back to board view automatically — otherwise the board you just
asked for would be invisible.

## Rule 3: the desktop's gestures still have to mean what they meant

Once boards *are* the desktop, several Windows behaviours become wrong by default:

- <kbd>Win</kbd>+<kbd>D</kbd> minimises everything to reveal the desktop — but boards are the
  desktop, so hiding them is the opposite of the request. Fixed in 1.1.2.
- "Minimise all" had the same problem. Fixed in 1.0.8.
- <kbd>Alt</kbd>+<kbd>F4</kbd> on the desktop opens **Shut Down Windows**. On a board it was closing
  the board — a destructive-feeling action triggered by muscle memory. Fixed in 1.1.0.
- Applications launched while boards were on screen got stuck behind them. Also 1.1.0.

None of these were in the original plan. Each was found by using the thing.

## Rule 4: do not upset Explorer

This is the one that produced the most serious bug in the product's history, and it is worth
describing because the shape of it is instructive.

Hiding the icon view involves cross-process work: the view belongs to Explorer, not to DeskDrawer.
Part of the interaction cleared the desktop selection after a **New** item was created. Under the
right timing — a busy PC, OneDrive or antivirus scanning the desktop, the view being rebuilt
underneath — that cleanup could act on a view that had already gone away, and take **explorer.exe**
down with it. The desktop would flicker and restart.

Three things about that bug are worth stating plainly.

**It was rare, and rare is the problem.** It needed a busy machine and a specific sequence. That is
exactly the profile of a bug that survives ordinary testing and reaches users.

**It was introduced by a fix.** The code that caused it was written during an earlier hardening pass —
a change made to improve reliability created the worst reliability bug in the product.

**It survived three subsequent audits.** It was written during the fourth review round and found in
the seventh, having been read past three times, because each of those rounds was looking at something
else. It was eventually caught by a review pass specifically about cross-process COM object lifetime,
which is the only lens that would have shown it.

It shipped fixed in 1.2.4. The lesson is in [[eight-rounds-of-audits]]: what you find depends
entirely on what you were looking for.

## What the constraint bought

The rules read like caution, and they are, but they produce a concrete guarantee worth having: **the
worst thing DeskDrawer can do to your desktop is temporary.** No setting is changed, no file is
moved, nothing needs undoing. Sign out and back in and Windows is exactly as it was.

For a program that paints over the whole desktop, that is the property that matters most.`,
  },

  {
    slug: "offline-network-shares",
    title: "The same bug, five times: offline network locations",
    tag: "Engineering lesson",
    date: D,
    keywords: ["Windows file system", "network timeout", "UI thread", "freeze"],
    description:
      "One bug class caused every freeze DeskDrawer has ever had. It was fixed in five separate releases before the pattern was fully understood.",
    body: `If you had asked me after 1.1.4 whether the freeze problem was solved, I would have said yes.
I would have said it again after 1.2.2, after 1.2.3, and after 1.2.4.

It shipped again in 1.2.5.

## The bug class

On Windows, a file-system call against a location that is unreachable does not fail quickly. It
blocks until the network stack gives up, which can be tens of seconds. Make that call on the thread
that pumps window messages and the entire application stops — no repaint, no clicks, and
distinctively, **no mouse wheel**, because wheel messages queue behind the blocked call like
everything else.

A desktop organizer is unusually exposed to this. Desktops collect shortcuts to network shares,
mapped drives that are only sometimes present, VPN paths, and NAS folders that sleep. Every one of
them is a call waiting to block.

## The five occurrences

| Release | The blocking call |
|---|---|
| 1.1.4 | Building a hover info tip for a file on an offline share or an un-downloaded cloud file |
| 1.2.2 | A board holding a shortcut whose target was an offline network location |
| 1.2.3 | Large paste and drag operations |
| 1.2.4 | Dragging onto a shortcut that reached an offline location *through a local symbolic link* |
| 1.2.5 | Asking the Recycle Bin for its state across **all** drives, from a notification thread |

Each was a real fix. None was the last one.

## Why "move it to a background thread" was not enough

The first fix was the obvious one: move info-tip resolution off the interface thread. Correct, and it
solved the reported symptom completely.

It did not generalise, because the problem is not one call site. It is that *a large number of
ordinary-looking operations end in a file-system call*, and the dangerous ones are not obviously
dangerous when you read them. Resolving an icon reads the file. Building a tooltip reads the file.
Deciding whether a drop target is a folder reads the file. Deciding whether a drag should copy or
move reads the file, to find out which volume it is on. None of those look like network code.

1.2.4 is the clearest example. The shortcut pointed at a local path, so it passed every "is this
remote?" check — but that local path was a symbolic link that redirected to an offline share. The
remoteness was one level of indirection away, and every check was looking at the wrong level.

1.2.5 is the other shape of it. The Recycle Bin query was not about a file the user had touched at
all; it asked Windows about the bin *across every drive*, which includes mapped network drives. A
sleeping NAS in a drive letter you had forgotten about would stall the application when you deleted an
unrelated desktop file. The fix was to scope the query to local fixed drives.

## What actually changed

The rule stopped being "move known-slow calls off the interface thread" and became:

> **The interface thread never touches the file system.** Not for icons, not for tooltips, not for
> drop-target tests, not for volume checks, not for Recycle Bin state. If a code path on the interface
> thread ends in a file-system call, that path is a bug, whether or not anyone has reported a freeze
> from it.

That is a stronger and much less comfortable rule, because it condemns code that currently works. It
is also the only version of the rule that generalises, since the whole difficulty is that you cannot
tell by reading whether a given path will be fast.

## The uncomfortable part

Five releases is not a story about one difficult bug. It is a story about repeatedly fixing the
instance in front of me instead of the class behind it, and being satisfied each time because the
reported symptom went away.

The reported symptom going away is very weak evidence that a bug class is closed. It mostly means
nobody has hit the next instance yet — and with no [[telemetry]] in this product, "nobody has
reported it" is even weaker evidence than usual. See [[no-telemetry-by-default]].

If DeskDrawer freezes on your machine, it is almost certainly this, it is almost certainly a path I
have not found, and the report genuinely matters. [[troubleshooting]] has the diagnosis steps.`,
  },

  {
    slug: "reparse-points-and-onedrive",
    title: "Three attempts at one check: reparse points, OneDrive and the desktop",
    tag: "Engineering lesson",
    date: D,
    keywords: ["reparse point", "junction", "symbolic link", "OneDrive", "regression"],
    description:
      "A one-line safety check took three releases to get right, and two of the attempts caused regressions worse than the problem being fixed.",
    body: `This is a small story about a small check, and it is here because it is the clearest example
in this product of a fix causing worse damage than the bug.

## The setup

Following the rule from [[offline-network-shares]] — never touch the file system from the interface
thread — DeskDrawer needs to know whether a desktop item might live somewhere slow, so it can route
that work to a background thread.

The obvious way to ask is a straightforward Windows call for the item's attributes. That works, until
the item is a [[cloud-placeholder]]: asking that particular question about an online-only OneDrive
file can force it to download. Now browsing your desktop pulls files out of the cloud, which is
exactly what "files on demand" exists to prevent.

**Attempt one** replaced the attribute call with a directory-enumeration call that returns the same
information without hydrating the file. Correct.

## Attempt two: too broad

The same work introduced a check for *reparse points* — the Windows mechanism behind junctions and
symbolic links — because a redirect can point at a network location, and that is precisely the slow
case worth avoiding.

The check flagged **any** reparse point.

This broke something specific and common: a Desktop folder that OneDrive has backed up is itself a
redirect. Flagging it as potentially remote meant DeskDrawer stopped attaching its live file-system
watcher to it. For anyone with OneDrive desktop backup — a large share of Windows users — the desktop
silently stopped updating. Create a file, nothing appears until a manual refresh.

**Attempt three** narrowed the check to *name-surrogate* reparse points, the subclass that actually
represents a directory redirect, which restored the watcher.

## Attempt three: still wrong, in the other direction

Narrowing fixed the OneDrive case and introduced two new ones, both shipped and both found in the
next audit round.

The remaining error was conceptual. The check still conflated two different questions:

1. *Is this item a redirect?*
2. *Does this item's redirect point somewhere slow?*

A junction to a folder on the same physical disk answers **yes** to the first and **no** to the
second. It is local, it is fast, and it wants the ordinary code path with a live watcher — but it was
still being treated as suspect. The consequences:

- A cancelled move onto a local junction dropped the item's [[board-membership]], so an icon
  disappeared from its board after an operation the user had cancelled.
- A Desktop folder reached through a local junction — the standard arrangement when a user profile
  has been moved to another drive — lost its watcher again, for a different reason than before.

## What finally worked

Stop inferring from the presence of a redirect and read the redirect **target**.

DeskDrawer now opens the reparse point without following it, reads the reparse data, extracts the
actual target path, and classifies on that. A name-surrogate reparse point whose target is local is
treated as local. Only one whose target is genuinely remote takes the careful path.

That shipped in 1.2.5, and it is the version that answers the right question. The first two attempts
were answering a proxy question that happened to correlate with the right one most of the time.

## The lesson

Both regressions came from a fix, not from original code. Both were introduced while making the
product *more* correct. And the second one was introduced by the fix for the first.

The general shape:

> When a safety check uses a proxy for the property you care about, it will be wrong for every case
> where the proxy and the property come apart — and those cases are, by construction, the ones you did
> not think of.

"Is it a reparse point" was a proxy for "is it slow". A local junction is exactly where those two
diverge, and a local junction is not exotic — it is what you get when Windows moves a user profile.

The wider pattern of fixes introducing regressions is in [[eight-rounds-of-audits]].`,
  },

  {
    slug: "no-telemetry-by-default",
    title: "Shipping with no telemetry, and what it costs",
    tag: "Privacy decision",
    date: D,
    keywords: ["telemetry", "privacy", "analytics", "crash reporting"],
    description:
      "DeskDrawer makes no network connections at all. That is a stronger promise than 'privacy-friendly', and it has a real price the developer pays.",
    body: `DeskDrawer contains no analytics, no crash reporting, no update check of its own, no account
system and no licence phone-home. It opens no network connections. Not anonymised ones, not
aggregated ones, not opt-out ones.

This page is about why, and about what it costs, because the second half is usually left out.

## Why the strong version

"Privacy-friendly" is a claim you have to trust. "Makes no network connections" is a claim you can
**check**, with any firewall or network monitor, in about a minute.

That difference is the entire reason for the decision. A desktop organizer sees the name of every
file on your desktop — which is a surprisingly complete picture of what someone is working on, who
they work for, what they are applying for, what they are ill with. There is no anonymisation scheme
that makes that data harmless, and no privacy policy that makes "trust us" as good as "it cannot
happen".

So the design rule is not *collect less*, it is **have no mechanism**. The application has no code
that opens a socket. There is nothing to misconfigure, nothing to leak in a future release by
accident, and nothing an attacker could repoint.

Everything else follows:

- Updates are the Microsoft Store's job, so no update checker is needed.
- Purchase and licensing are Windows' job, so no licence server is needed.
- Diagnostics go to a local [[error-log]] you can read, which goes nowhere unless you send it.

## What it costs

**I do not know when DeskDrawer breaks.** Not how many people are affected, not on which Windows
build, not whether the last release made things worse. A product with telemetry knows within hours.
This one finds out when somebody writes an email.

**I do not know which features are used.** Whether anyone folds boards, whether sort-by-type earns
its place, whether the icon-size submenu should have three options or six. Every roadmap decision is
made without usage data. [[eight-rounds-of-audits]] describes the substitute: read the code
repeatedly, from a different angle each time. It works, but it is slower and it is not the same
thing.

**Crashes are invisible.** The [[hiding-the-desktop-icon-layer|explorer.exe crash]] fixed in 1.2.4 was
found by a code review. With crash reporting it would have surfaced the week it shipped.

**Every bug report is worth more, and there are fewer of them.** Most people who hit a problem close
the application and move on. That is entirely reasonable and it means the developer learns nothing.

## The bargain

Users get a promise that is verifiable rather than a policy that is trusted. The developer gives up
the entire feedback loop that modern software development assumes.

I still think it is the right trade for this kind of product — a small, local, single-purpose utility
that touches something as personal as the contents of your desktop. But it is a trade, not a free
virtue, and the cost is paid in bugs found late.

Which is why [[support]] matters more here than for a typical product. If DeskDrawer misbehaves on
your machine, that report is not one signal among thousands. It may be the only one.

The precise inventory of what is and is not stored is in [[privacy-and-data]].`,
  },

  {
    slug: "designing-for-language-independence",
    title: "Designing an interface that barely needs language",
    tag: "Design decision",
    date: D,
    keywords: ["localisation", "icon-only interface", "internationalisation", "Windows shell"],
    description:
      "DeskDrawer's Store listing is in 16 languages. The application itself is built so that using it depends very little on reading text in any of them.",
    body: `The DeskDrawer listing on the Microsoft Store is available in 16 languages. The application
underneath it is not translated into 16 languages, and mostly does not need to be — which is a
consequence of how it is built rather than a claim about it.

## The starting point was not localisation

The menus became icon-only for a different reason: they had to be small. A menu that appears when you
right-click a board's name sits directly on top of your desktop, and a list of eight text commands is
a large opaque rectangle covering the thing you are working with.

Icons made the menu roughly a third of the size. Sorting is an arrow and a symbol; icon size is four
squares of increasing size; outline is a rectangle; quit is a power symbol.

The localisation benefit was noticed afterwards, and it turned out to be the larger one.

## Three decisions that removed language from the interface

**The menus contain no sentences.** Both the [[board-menu]] and the [[tray-menu]] are glyph-only.
There is nothing in either to translate, because there is nothing in either to read.

**New boards are numbered, not named.** In 1.0.5 the default name for a new board became 1, 2, 3…
rather than a word like "Board" or "New group". A number is the same in every language a Windows user
is likely to be running, and it means a layout never contains a word its owner does not read.

**System icon names come from Windows.** In 1.0.6 the names of shell items — *This PC*, *Recycle
Bin*, *Network* — stopped coming from a built-in string table and started coming from the shell. They
therefore appear in the user's Windows display language: *Este equipo*, *この PC*, *Dieser PC*. Not
because DeskDrawer translated them, but because it stopped pretending it knew them.

## The largest one was free

The most text-heavy surface in the application is the right-click menu on a file — twenty or more
commands, plus whatever 7-Zip, Git, your antivirus and your cloud client have added.

DeskDrawer does not write that menu. It asks the Windows shell for the item's real
[[shell-context-menu]] and displays it. See [[menus]].

That decision was made for correctness — a hand-written menu silently loses every extension you have
installed. But it also means the most language-dense part of the interface arrives **already
translated**, in your Windows display language, including third-party entries, at no cost and with no
translation to keep current.

This is the pattern behind all of it: delegating to Windows means inheriting Windows' localisation.
Reimplementing means owning the translation forever.

## What is left in English, honestly

The application ships without satellite resource assemblies — English only for the few strings it
owns. Those strings are error text, and the contents of [[error-log]]. This website and its
documentation are English only too.

You meet none of these in normal use. You meet them when something has gone wrong, which is also when
you are most likely to be reading [[troubleshooting]] or writing to [[support]].

## What the claim actually is

Not "DeskDrawer supports every language". It does not, and no amount of icon design would make that
true.

The accurate claim is narrower and, I think, more interesting: **the Store listing is available in 16
languages, and the application is built so that using it depends very little on reading text in any
language at all.** If yours is not one of the 16, you will meet very little friction in the product
itself — not because it was translated for you, but because there is not much there to translate.

The user-facing version of this is on the [[languages]] documentation page.`,
  },

  {
    slug: "eight-rounds-of-audits",
    title: "Eight rounds of code audits on a small app, and what each one found",
    tag: "Development history",
    date: D,
    keywords: ["code review", "software quality", "regression", "audit"],
    description:
      "Nine of DeskDrawer's releases were stability releases with no new features. This is what eight successive full-codebase reviews actually turned up, including how often a fix caused the next bug.",
    body: `Look at DeskDrawer's [[changelog|release notes]] and a pattern is hard to miss. From 1.1.4
onward, most entries begin with some version of *"a stability release — no new features"*.

That is not modesty. It is what the work was.

## The rounds

Eight full reviews of the same codebase, each looking through a different lens.

| Round | Shipped in | Character of what it found |
|---|---|---|
| 1–2 | 1.1.5, 1.1.6 | Blocking the interface thread on icon and thumbnail work; rename and drop targeting the wrong item; configuration safety |
| 3–4 | 1.2.0, 1.2.1 | The desktop **New** menu misbehaving while icons were hidden; the full shell context menu being truncated; Windows' own dialogs being swallowed |
| 5 | 1.2.2 | Freezes from offline network targets; **New** item creation on every code path |
| 6 | 1.2.3 | Click-target bugs on board controls; an interrupted save mistaken for a first run; autostart state disagreeing with Task Manager |
| 7 | 1.2.4 | A cross-process object-lifetime bug that could crash **explorer.exe** |
| 8 | 1.2.5 | A Recycle Bin query stalling on offline network drives; two regressions from round 7's own fix |

Round 7 is the one worth dwelling on. It found a use-after-free across a process boundary that could
take Windows Explorer down and restart the desktop. It had been written during **round 4**, and
rounds 5 and 6 had both read that code and not seen it.

## What you find is what you were looking for

That is the central lesson, and it is uncomfortable.

Rounds 5 and 6 were competent reviews that fixed real bugs. They read past the Explorer crash because
they were examining threading and configuration integrity, and the bug was neither — it was an object
lifetime question spanning two processes. It was found in round 7 because round 7 was specifically
about COM interop lifetimes. Nothing else would have surfaced it.

The practical consequence: *"the code has been reviewed"* is close to meaningless as a quality claim.
The useful question is *"reviewed for what?"* — and the way to find a new class of bug is to pick a
lens you have not used yet, not to look harder through one you have.

## Fixes cause bugs at an uncomfortable rate

Round 8 found four issues. **Two of them were regressions from round 7's fixes.**

Round 7 had narrowed a check about redirected folders to solve a real problem — a OneDrive-backed
desktop losing its live file watcher. The narrowed version was still asking the wrong question, and
it broke two other cases. That check took three releases to settle, and the story is in
[[reparse-points-and-onedrive]].

The [[hiding-the-desktop-icon-layer|Explorer crash]] was itself introduced by a hardening change in
round 4. A change made to improve reliability produced the least reliable moment in the product's
history.

Across eight rounds, a fix causing the next bug was not the exception. It was common enough that
verification became a separate step rather than something folded into the fix.

## Why this got done at all

Because there is no [[telemetry|telemetry]] in this product, and no way to learn about failures
except by finding them — see [[no-telemetry-by-default]]. With no crash reports and no usage data,
reading the code repeatedly from different angles is not a supplement to the feedback loop. It is the
feedback loop.

It is a poor substitute in one specific way: it finds bugs that exist, not bugs that *matter*.
Telemetry tells you which of a hundred rare bugs is hitting a thousand people. Code review tells you
there are a hundred rare bugs.

## What it means for the product

Nine consecutive releases of a small utility with no new features is either a warning sign or a
statement of priorities. Here it is the second: DeskDrawer paints over the whole desktop, hides the
icon layer Explorer owns, and handles your files. The cost of being wrong is high, and shaped like
"the user's desktop is broken and they do not know why".

The [[limitations]] page lists what is still known and unfixed. It is a short page, but it is not
empty, and it will not become empty.`,
  },
];
