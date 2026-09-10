---
name: Starship Clicker
description: A public departures board for a spacefaring civilisation — an incremental game where every quantity is a ruled row and every change flaps digit by digit.
colors:
  face: '#1a1713'
  face-raised: '#241f18'
  page: '#0d0a06'
  ink: '#f4f0e4'
  ink-dim: '#aca894'
  ink-faint: '#8d887a'
  steel: '#48453f'
  steel-mid: '#37342d'
  steel-deep: '#26221c'
  lamp-amber: '#ffb020'
  signal-red: '#c9503f'
  active-green: '#57b894'
  focus-blue: '#79b8ff'
typography:
  display:
    fontFamily: "Barlow Condensed, 'Arial Narrow', system-ui, sans-serif"
    fontSize: 'clamp(1.55rem, 6vw, 2.05rem)'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '0.02em'
  body:
    fontFamily: "Barlow Condensed, 'Arial Narrow', system-ui, sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: '0.01em'
  label:
    fontFamily: "Barlow Condensed, 'Arial Narrow', system-ui, sans-serif"
    fontSize: '0.78rem'
    fontWeight: 600
    lineHeight: 1
    letterSpacing: '0.13em'
rounded:
  hairline: '1.5px'
  base: '3px'
  pill: '50%'
spacing:
  pad: 'clamp(0.75rem, 3vw, 1.25rem)'
  gap: '0.9rem'
  row: '2.4rem'
components:
  button-primary:
    backgroundColor: '{colors.active-green}'
    textColor: '#0c130f'
    rounded: '{rounded.base}'
    padding: '0.6rem 1rem'
  button-default:
    backgroundColor: '{colors.face-raised}'
    textColor: '{colors.ink}'
    rounded: '{rounded.base}'
    padding: '0.6rem 1rem'
  button-danger:
    backgroundColor: '{colors.signal-red}'
    textColor: '{colors.signal-red}'
    rounded: '{rounded.base}'
    padding: '0.6rem 1rem'
  service-row:
    backgroundColor: '{colors.face}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    height: '2.75rem'
  terminal-button:
    backgroundColor: '{colors.steel}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    height: '3.9rem'
---

# Design System: Starship Clicker

## Overview

**Creative North Star: "Le Grand Tableau"**

The game is a public departures board for a spacefaring civilisation. Not a
dashboard, not a HUD over a starfield, not the idle-game scroll of same-size
buy-cards — a single physical board of matte flap faces set in a brushed-steel
frame, hung above a concourse. Every quantity the player owns is a ruled row on
that board. Every number that moves, moves the way a departures board moves:
one character cell flips, then the next, a cascade running left to right down
the row with a soft mechanical clatter you can almost hear.

The surface commits to one material world and stays in it. The ground is a warm
matte near-black — the colour of a painted flap, never blue-black slate. Letters
are painted white, slightly warm, with a hairline of shadow where the paint
sits on the metal. The frame is real brushed aluminium: an anisotropic noise
texture, not a CSS bevel pretending to be metal. Colour is rationed to three
signal roles — an amber lamp when you can't afford something, an active green
when you can, a dim signal-red for a locked or terminated line — plus a cool
blue focus ring that belongs to the browser, not the board.

Density is high and legible. The board is meant to be scanned: ruled rows,
fixed columns, tabular figures, a condensed grotesque (Barlow Condensed, from
highway signage) carrying every word on the page. The one concession to scale
is the header: the running total energy produced and the civilisation level are
set large, the two numbers that tell you how far you've come, the way a
concourse board leads with its clock.

**Key Characteristics:**

- One ruled board; no cards, ever.
- Any changing number changes by flap cascade, digit by digit.
- One typeface (Barlow Condensed) for every word.
- Warm matte near-black ground; painted-white letters; brushed-steel frame.
- Colour is signal only: amber = can't afford, green = affordable, red = locked.
- Real generated textures (brushed metal, paint grain), never faked bevels.

## Colors

A warm greyscale board with three signal accents and one browser-blue focus.

### Primary

- **Lamp Amber** (`#ffb020`): the deficit/unaffordable signal. A cost turns
  amber the instant the player can't pay it; a resource row's trend lamp glows
  amber while it is falling. Also the active-terminal indicator bar. Used as a
  point, never a field.

### Secondary

- **Active Green** (`#57b894`): the affordable signal. A cost is green when the
  player can buy now; the primary action button (`buy` / `build` / `research` /
  `ascend`) is a green fill; the trend lamp glows green while a resource climbs.
- **Signal Red** (`#c9503f`): the locked / terminated signal. A locked service
  row and its unlock hint; the "ALL SERVICES TERMINATED" ascension marquee; the
  destructive reset button (outline, not fill).

### Neutral

- **Painted White** (`#f4f0e4`): all primary text and figures, pictogram fill.
  Warm, not pure white.
- **Ink Dim** (`#aca894`): row sub-text (counts, rates), resource names,
  secondary values. 7.5:1 on the board ground.
- **Ink Faint** (`#8d887a`): time-codes, column headers, section labels, the
  desktop dotted leader. Held at ≥ 4.5:1 on the matte ground for small text.
- **Flap Face** (`#1a1713`): the board / row / resource-panel ground. Warm
  matte near-black.
- **Raised Face** (`#241f18`): the detail-drawer and hover ground, one step up
  from the board.
- **Page** (`#0d0a06`): the field behind the board (visible as the outer
  margin on desktop).
- **Brushed Steel** (`#48453f` / `#37342d` / `#26221c`): the frame — header,
  terminal bar, modal head. A vertical brushed-noise texture over a top-lit
  gradient; the light-to-dark run reads as a slightly domed metal panel.
- **Focus Blue** (`#79b8ff`): the keyboard focus ring only. Deliberately the
  one cool colour on the surface, so focus never reads as a board signal.

### Named Rules

**The Lamp Rule.** Cost colour IS the affordability state. Amber means you
cannot pay; green means you can. Never show a cost in neutral ink — the player
reads the board by colour first.

**The Signal-Only Rule.** The three accents (amber, green, red) are points and
1px marks, never fills over a region. If an accent owns more than a lamp, a
short word, or a hairline, it has stopped being a signal.

## Typography

**Display / Body / Label Font:** Barlow Condensed (self-hosted via @fontsource,
weights 400/500/600/700; fallback `'Arial Narrow', system-ui, sans-serif`).

**Character:** One family, the whole board. Barlow Condensed is a utilitarian
condensed grotesque drawn from Californian highway signage — narrow enough to
run long service names in a fixed column, plain enough that a digit run reads as
data, not decoration. Uppercase for every label and name; sentence case only in
drawer descriptions. Tabular numerals everywhere (`font-variant-numeric:
tabular-nums` on `body`).

### Hierarchy

- **Readout** (700, `clamp(1.55rem, 6vw, 2.05rem)`; civ level `clamp(1.7rem,
7vw, 2.35rem)`, +0.02em): the header anchor — total energy produced and
  civilisation level. The only text set at display scale.
- **Flap figure** (700, 1.35rem): the resource-panel numbers that flap.
- **Launch figure** (700, 1.7rem) / **Launch label** (700, 1.2rem, +0.18em):
  the master control.
- **Panel heading** (700, 1.35rem, uppercase, +0.055em): the terminal title
  ("CENTRE DE COMMANDE").
- **Row name** (600, 1.02rem, uppercase, +0.045em): a service name on the
  board.
- **Row figure / count / fare** (700, 1–1.1rem, tabular): the values in a row's
  tail.
- **Body** (400–500, 1rem, line-height 1.55, +0.01em): drawer descriptions,
  modal copy.
- **Label** (600, 0.78rem, uppercase, +0.1–0.16em, ink-faint): time-codes,
  column headers, section labels.

### Named Rules

**The One Face Rule.** Barlow Condensed carries every word on the surface.
There is no second family — no serif, no mono, no system-sans body face. A
departures board is lettered once.

**The Painted-Letter Rule.** Display text on the matte ground carries
`text-shadow: 0 1px 0 rgba(0,0,0,0.45)` — the shadow of paint sitting proud of
the metal. Applied to the wordmark, readouts, panel headings, section labels,
row names, the launch label, the marquee. Body copy does not get it.

## Layout

One centred column, `max-width: 860px`; on desktop (≥ 720px) the service list,
section heads and stat grids cap tighter (~46–52rem) and centre inside it so
rows stay a comfortable scan width. Outer page field shows as margin beyond
that.

**Stacking, top to bottom:** brushed-steel header (sticky, `top: 0`) → resource
panel (sticky, `top: 0`, so the flapping figures never scroll away) → the
LANCER master control → the active terminal's list → footer stats → terminal
selector.

**Terminal selector.** Sticky to the bottom of the viewport on mobile
(`--bottom-bar-h: 3.9rem`, five equal columns, icon over label, safe-area
padding); sticky to the top and reordered above the header on desktop (`order:
-1`, single row, icon beside label).

**Rows.** Ruled: a 1px `--rule` divider under each, no gaps, no card margins.
Resource rows `min-height: 2.4rem`; service rows `2.75rem`. A service row is a
grid: `time-code · pictogram · name+sub · [tail]`. On desktop the name+sub
column ends in a dotted leader (`border-bottom: 1px dotted`) that runs to the
fare — the printed-timetable tie between a destination and its price.

**Rhythm.** `--pad: clamp(0.75rem, 3vw, 1.25rem)` is the single horizontal
inset (rows, headings, sections all share it). `--gap: 0.9rem` vertical between
blocks. Section headings get more space above than below.

## Elevation & Depth

The board is flat. Rows have no shadow and no elevation; depth is carried by
material and by exactly one lifted element.

- **Texture, not shadow.** The steel frame is a brushed-noise texture over a
  top-lit gradient (`inset 0 1px 0 rgba(255,255,255,0.12)` highlight, `inset 0
-2px 5px rgba(0,0,0,0.5)` underside). The flap faces carry a fine paint grain
  and a 2px gradient hinge shadow across the middle. These read as physical
  surface without a single drop shadow on the layout.
- **The one lift.** `.launch` is a machined lip: `inset 0 2px 0
rgba(255,255,255,0.09)` top bevel, `inset 0 -3px 6px rgba(0,0,0,0.5)`
  underside, `inset 0 0 0 1px rgba(0,0,0,0.55)` seat, and a real `0 10px 22px
rgba(0,0,0,0.5)` drop — the master control sits proud of the board. `:active`
  presses it in (`translateY(2px)`, shadow collapses inward). Held, it gains an
  amber inner ring.
- **Floating chrome.** Toasts (`0 6px 16px rgba(0,0,0,0.45)`) and modals sit
  above the board on a `rgba(6,7,9,0.75)` scrim.
- **Lamp glow.** A trend lamp gets `0 0 8px` of its own colour — the only glow
  on the surface, and it is a lamp.

### Named Rule

**The Real-Material Rule.** Metal and paint are generated textures (SVG
`feTurbulence` tiles blended over a gradient). CSS bevels, embossing, and
zero-blur block shadows (`box-shadow: 0 Ypx 0`) imitating a material the page
never renders are banned — the machined lip on `.launch` is the single
sanctioned dimensional treatment.

## Shapes

Near-square. `--radius: 3px` on buttons, the board frame, modal, toast; `1.5px`
on a flap cell; `50%` on a trend lamp only. No large radii, no pill buttons, no
rounded cards (there are no cards). The board's structure is drawn entirely with
1px rules and fixed grid columns; corners are incidental, not a form language.

Pictograms are their own shape system: a single set on a 24-unit grid, solid
single-weight silhouettes in the AIGA/DOT transit-signage tradition,
`fill: currentColor`. Kept short and reused by meaning (a generator borrows the
pictogram of the resource it produces; every ship shares one; every technology
shares one).

## Components

### Buttons

- **Shape:** 3px radius (`--radius`), 1px `--rule-strong` border, `0.6rem 1rem`
  padding, Barlow Condensed 700 / 0.85rem / uppercase / +0.12em.
- **Default:** warm dark gradient fill (`#2a2620 → #1a1712`), painted-white
  text. Hover lightens the border to `--ink-faint`.
- **Primary (`.btn-go`):** Active Green fill, near-black text (`#0c130f`). The
  buy / build / research / ascend action.
- **Danger (`.btn-danger`):** Signal Red outline and text on a faint red wash,
  no fill. The reset action only.
- **Disabled:** `opacity: 0.6`, `--ink-faint` text, `not-allowed`.

### Service Row (signature)

The board's atom. A `<li>` with a 1px underrule; a full-width `<button>` (the
buy action) plus a narrow chevron button (opens the drawer).

- **Layout:** `time-code · pictogram · name / sub · tail`. Tail = load bar
  (desktop only) · count (`×N`, hidden at 0) · fare. Desktop adds a dotted
  leader between the label and the tail.
- **States (via `data-state`):** `afford` — fare in Active Green, buy enabled;
  `cant` — fare in Lamp Amber, buy disabled; `locked` — whole row in Signal
  Red, pictogram dimmed, buy inert, drawer shows the unlock condition; `done`
  (technologies) — row faint, sub reads "Researched".
- **Drawer:** slides open in place via `grid-template-rows: 0fr → 1fr` (220ms),
  pushing the rows below down; never a modal. Holds a sentence description and a
  `<dl>` of facts (produces / consumes / owned, or attack / upkeep / cost).

### Split-Flap Display (signature)

`.flaps` is an inline row of `.flap` character cells. On `set(text)`, only cells
whose character changed get `.is-flipping`; the animation delay is
`calc(var(--i) * 26ms)` so the change cascades left to right. `flap-flip`
keyframes fold the cell at the hinge (`perspective(160px) rotateX`). Separators
(thin space) render as transparent `.is-sep` cells. The final string is always
in the DOM for screen readers. `prefers-reduced-motion`: no animation, instant
swap. Drives every resource figure and the LANCER "+N" figure.

### LANCER control (signature)

A full-width machined-lip bar directly under the resource panel: label left,
flapping "+N NRG" figure right. Tap = one click. **Hold** (`bindHold`, 320ms
threshold) enters an auto-cadence — the master control runs itself and gains an
amber inner ring — then releases on pointer-up. This is the game's single
continuous input.

### Terminal Selector (navigation)

Brushed-steel bar of five equal buttons, each a pictogram over an uppercase
label (0.78rem). Inactive: `rgba(244,240,228,0.55)` on steel. Active: matte
board-black inset with a 3px Lamp Amber bar on the leading edge and full painted
white. Fixed bottom on mobile, top on desktop.

### Announcement strip (transient)

Station-PA banner stacked above the terminal bar. `.announce`: matte face, 1px
border, a pictogram whose colour carries the level (green check / amber lock /
blue bolt), and a level-tinted left-edge gradient wash — **not** a coloured
`border-left`. Auto-dismisses after ~4.2s; max 3 at once.

### Board Modal

Steel head (painted-white title) + matte body on a scrim. Used for the offline
"welcome back" report (accumulated gains, one big green line) and the reset
confirmation. Escape and scrim-click close.

### Resource Row

`pictogram · name · flapping figure · trend lamp`. Progressive disclosure: a
resource row is not rendered until that resource has been produced at least once
(energy always shows). The trend lamp is a 0.55rem dot — grey at rest, green +
glow while climbing, amber + glow while falling.

## Do's and Don'ts

### Do:

- **Do** put every quantity on a ruled row of the one board. New content is a
  new row or a new section of rows, never a card or a panel.
- **Do** route any on-screen number that changes through the split-flap display
  so it flaps digit by digit; honour `prefers-reduced-motion` with an instant
  swap.
- **Do** set every word in Barlow Condensed, uppercase for names and labels,
  with tabular numerals.
- **Do** colour costs by affordability — Active Green when payable, Lamp Amber
  when not — and never in neutral ink.
- **Do** build metal and paint as generated textures; keep the machined lip on
  `.launch` as the only dimensional element.
- **Do** give the header the two lead numbers (total produced, civilisation
  level) at display scale as the page's anchor.
- **Do** open detail in place with the row drawer's mechanical slide.

### Don't:

- **Don't** introduce cards, boxed panels, rounded containers, or elevation on
  rows. Nested cards especially.
- **Don't** use emoji or Unicode glyphs as icons — only the authored 24-grid
  pictogram set.
- **Don't** add a second typeface, gradient text, glass/blur decoration, or a
  coloured `border-left` above 1px on any strip or alert.
- **Don't** use a zero-blur block shadow (`box-shadow: 0 Ypx 0 …`) — the
  neobrutalist ledge is not this world.
- **Don't** put a starfield, nebula, or neon-HUD chrome behind the board.
- **Don't** let an accent (amber / green / red) own a region; it is a lamp, a
  word, or a hairline.
- **Don't** flatten or remove the flap cascade to "simplify" — it is the
  thesis.

<!-- Not canonized (defects the build currently carries, not house rules):
     the footer stat-grid still reads as a small stat-strip; modal.js keeps a
     full modal for reset-confirm and the offline report rather than the
     in-place drawer pattern; the métal (trapezoid) and influence (crown)
     pictograms are rough below ~18px. -->
