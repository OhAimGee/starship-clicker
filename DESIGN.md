---
name: Starship Clicker
description: A departures-board idle game reskinned as a neon synthwave signal terminal broadcasting from deep space.
colors:
  face: "#0c0818"
  face-raised: "#170f2c"
  steel-1: "#4a3a7a"
  steel-2: "#322459"
  steel-3: "#1e1640"
  ink: "#f1ecff"
  ink-dim: "#b7a9e2"
  ink-faint: "#9384c0"
  lamp: "#ff2fd0"
  signal: "#ff4757"
  go: "#35ffb0"
  focus: "#6c8cff"
typography:
  display:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 11vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.055em"
  label:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.1em"
  body:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  hairline: "1.5px"
  base: "3px"
spacing:
  gap: "0.9rem"
  pad: "clamp(0.75rem, 3vw, 1.25rem)"
  row: "2.75rem"
components:
  button-primary:
    backgroundColor: "{colors.go}"
    textColor: "#0a0616"
    rounded: "{rounded.base}"
    padding: "0.6rem 1rem"
  terminal-btn-active:
    backgroundColor: "{colors.face}"
    textColor: "{colors.ink}"
    rounded: "0"
  row-cost-afford:
    textColor: "{colors.go}"
  row-cost-cant:
    textColor: "{colors.lamp}"
---

# Design System: Starship Clicker

## Overview

**Creative North Star: "The Deep-Space Signal Terminal"**

Starship Clicker is still a departures board — the ruled-row, split-flap
skeleton of the prior "Le Grand Tableau" identity is explicitly preserved —
but it no longer reads as a warm steel airport concourse. It now reads as a
terminal receiving a live broadcast from deep space: 1985's idea of what the
year 3000 looks like. Every quantity is still a ruled row on one board; every
change still flaps digit by digit. What changed is the material the board is
made of: indigo-black space instead of warm brushed steel, neon magenta/cyan/
violet fields that command whole regions instead of hairline-only signal
color, and a genuine light-emission glow around every affordance state. A
faint procedural starfield sits behind every panel and modal — the board is
not lit by an overhead lamp anymore, it is floating in the field it reports
on. Twelve hand-illustrated planet portraits (one per system archetype, see
Components → Planet Portrait) are the one place painted material replaces
the old world's flat-pictogram-only rule, appearing in the Exploration panel
and behind the map's conquest node.

This is a reskin, not a re-architecture: the same tabs, board-rows, drawers,
and full-frame modal pattern carry the new material. A player who knew the
old board will recognize every gesture; nothing about *what* the board says
changed, only what it looks and feels like saying it.

**Key Characteristics:**
- Deep-space indigo ground, never warm or neutral-black.
- Neon color owns whole regions (afford/cant states, selected tab, glow),
  not just a lamp-dot or hairline.
- Glow (`box-shadow`/`text-shadow` bloom) is a first-class material,
  layered onto — never replacing — the existing steel/machined-lip depth
  shadows.
- A faint procedural starfield texture sits behind body, modals, and node
  buttons.
- One typeface throughout (Barlow Condensed), tabular numerals everywhere,
  unchanged from the prior identity.
- Twelve hand-authored SVG planet portraits, the system's one illustrated
  (non-pictogram) art category.

## Colors

The palette is Full palette strategy: four named roles carry real regional
weight (not a restrained neutral-plus-accent scheme) — this is an Operate
surface that earns bold color because the whole point of the redesign is to
feel like an emissive instrument panel, not a muted productivity tool.

### Primary
- **Magenta Deficit** (`--lamp` #ff2fd0): unaffordable cost figures, the
  LANCER control's held/auto-cadence glow, the selected terminal tab's inset
  bar. The system's most attention-getting neon — reserved for "you can't
  afford this yet" and the master input's active state.

### Secondary
- **Cyan-Mint Go** (`--go` #35ffb0): affordable cost figures, resource
  trend-up lamps, the "ASCEND — NEW GAME+" action, invade-node names once
  reachable. Reads as "this is live and ready."

### Tertiary
- **Coral Signal** (`--signal` #ff4757): locked/terminated rows, the "all
  services complete" marquee, combat-defeat log entries. Distinct enough
  from Magenta Deficit to never be confused with "just can't afford it yet."

### Neutral
- **Deep Space** (`--face` #0c0818): the base panel/row surface.
- **Raised Space** (`--face-raised` #170f2c): hover/raised state, board
  drawers.
- **Violet Chrome** (`--steel-1/2/3` #4a3a7a/#322459/#1e1640): the brushed
  "metal" frame gradient (header, terminal bar, launch control) — now a
  violet chrome lit by the neon world instead of warm brushed steel.
- **Lavender Ink** (`--ink` #f1ecff / `--ink-dim` #b7a9e2 / `--ink-faint`
  #9384c0): body text at three emphasis levels, all ≥5.9:1 on Deep Space.
- **Focus Blue-Violet** (`--focus` #6c8cff): keyboard focus ring only.

### Named Rules
**The Region, Not a Hairline Rule.** Magenta/cyan/coral are allowed to fill a
button, a marquee, a selected tab's background wash, or a glow halo — the
prior world's "color is a lamp or a hairline, never a region" restraint is
explicitly retired. This is the one deliberate reversal from the incumbent
system.

**The Glow-Is-Material Rule.** Every neon color role has a matching
`--glow-*` token (soft + tight blur pair). A neon color used for emphasis
should usually carry its glow token too — a flat neon fill with no bloom
reads as a plain accent, not a signal.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow, system-ui fallback)
**Body Font:** Barlow Condensed (same family — unchanged from the incumbent
system: one typeface throughout remains a hard rule)

**Character:** A condensed grotesque read as terminal/signage type under
glow rather than paint-on-metal — the letterforms are unchanged, only the
`text-shadow` treatment (glow instead of a single dark paint-shadow on
selected/accent text) shifts the read.

### Hierarchy
- **Display** (700, `clamp(2.4rem, 11vw, 4.25rem)`, line-height 1): the
  Civilisation Level readout — the page's anchor figure.
- **Row** (700, 1.1rem): board-row counts and split-flap figures.
- **Body** (400, 1rem, line-height 1.55): panel notes, drawer descriptions.
- **Label** (600, 0.78rem, tracked 0.1em, uppercase): section heads,
  timetable codes, tab labels — always tabular-numeral, always uppercase.

### Named Rules
**The One Voice Rule.** Barlow Condensed is the only typeface anywhere in
the UI, carried over unchanged from the prior identity — a redesign this
large is exactly the moment a second "technical" or "display" face gets
smuggled in, and it stays refused.

## Layout

Unchanged from the incumbent system by explicit product constraint (see
`.impeccable/surfaces/index-html.md` direction contract): mobile-first
single column capped at `--maxw` (860px, 1040px ≥720px, 1360px ≥1280px with
a fixed 300px sidebar), sticky header/resources-board, a sticky terminal tab
bar (bottom on mobile, top on desktop), and the same `--pad`/`--gap` rhythm.
Nothing about grid structure, breakpoints, or component placement changed in
this pass — only the material rendered inside that structure.

## Elevation & Depth

Hybrid: the steel/machined-lip depth shadows from the incumbent system are
kept exactly as they were (inset bevels on `.steel`, the LANCER control's
pressed/released states) — those convey physical depth and were not part of
this redesign's scope. Layered on top, a new emissive category (glow) is
purely additive: it never replaces a depth shadow, it rides alongside one
(e.g. `.launch.is-holding` keeps its inset bevel shadows *and* gains
`--glow-lamp`).

### Shadow Vocabulary
- **`--glow-lamp`** (`0 0 10px rgba(255,47,208,.65), 0 0 26px rgba(255,47,208,.32)`):
  magenta bloom — LANCER hold state, unaffordable-cost text-shadow, the
  conquest node's border glow.
- **`--glow-go`** (`0 0 10px rgba(53,255,176,.6), 0 0 24px rgba(53,255,176,.3)`):
  cyan-mint bloom — affordable-cost text-shadow, reachable invade-node name.
- **`--glow-signal`** (`0 0 10px rgba(255,71,87,.6), 0 0 24px rgba(255,71,87,.3)`):
  coral bloom, reserved for locked/defeat states that need it.
- **`--glow-focus`** (`0 0 8px rgba(108,140,255,.55)`): reserved for focus
  states that want a glow beyond the default outline ring.

### Named Rules
**The Glow Rides, Never Replaces Rule.** A glow token is added to an
existing shadow/box-shadow list, never substituted for the steel/machined-
lip depth shadow already there.

## Shapes

Unchanged from the incumbent system: `--radius: 3px` throughout (rows,
modals, buttons, inputs), no large rounded containers, no card silhouettes.
Planet portraits are the one new circular form in the system — a
deliberate, singular exception (a celestial body reads as a circle;
squaring it off would fight the subject), never extended to any other
component.

## Components

### Buttons
- **Shape:** 3px radius, unchanged.
- **Primary (`.btn-go`):** Cyan-Mint Go fill, `#0a0616` text (contrast-
  checked, ~13:1), no glow at rest — the glow vocabulary is reserved for
  signal states (afford/cant/held), not every primary action.
- **Terminal tab (selected):** Deep Space background, Magenta Deficit
  inset top bar plus a soft magenta glow washed up from the bar
  (`inset 0 8px 14px -8px rgba(255,47,208,.45)`).

### Board Rows
- **Style:** unchanged ruled-row grid; `afford`/`cant`/`locked`/`done`
  states now carry glow on top of color (`--glow-go` / `--glow-lamp` text-
  shadow on the cost figure).

### Modals (Board Modal)
- **Style:** steel-chrome head, Deep Space body, unchanged frame — now with
  the procedural starfield layered behind the body (`--starfield`, blend
  mode `screen`) and a soft violet-chrome halo (`0 0 40px rgba(74,58,122,.5)`)
  around the whole modal.

### Node Map Buttons
- **Style:** unchanged ruled-button grid; the conquest node additionally
  carries its system's Planet Portrait as a background layer
  (`z-index: -1`, 40% opacity, clipped to the button's rounded corners) and
  a permanent `--glow-lamp` border glow.

### Planet Portrait (signature component)
Twelve hand-authored inline SVG illustrations (`src/ui/planet-art.js`), one
per system archetype (`mining`, `energetic`, `crystalline`, `balanced`,
`hostile`, `diplomatic`, `antimatterComplex`, `quantumStation`,
`galacticFortress`, `tradeHub`, `cosmicLab`, `voidBastion`). Each is a
radial-gradient sphere (three-stop, dark rim → bright near-side) with a
matching neon rim-glow ring and a distinct surface treatment tied to the
archetype's resource theme (craters for mining, a corona for energetic
worlds, faceting for crystalline, cloud bands for balanced, cracks of glow
for hostile/antimatter worlds, a ring for diplomatic/trade worlds, a hex
lattice for quantum/lab stations, plating for the fortress archetype, and a
near-black event-horizon disc for the void bastion). All twelve share one
13-star backdrop field for visual consistency. Appears at 4.2rem in the
Exploration panel's system header and as a 40%-opacity backdrop behind the
map's conquest node.

## Do's and Don'ts

### Do:
- **Do** let Magenta Deficit / Cyan-Mint Go / Coral Signal fill a region
  (button, marquee, tab-selected wash) — this is the reversal this redesign
  makes on purpose.
- **Do** pair a neon color used for signal with its `--glow-*` token.
- **Do** keep every existing steel/machined-lip depth shadow exactly as
  it was; add glow alongside it, never instead of it.
- **Do** route new content through the same ruled-row/board-modal skeleton;
  this redesign changed material, not structure.
- **Do** keep Barlow Condensed as the only typeface and route every
  changing number through the split-flap display.

### Don't:
- **Don't** introduce cards, boxed panels, or elevation on rows — carried
  over unchanged from the prior world.
- **Don't** use emoji or Unicode glyphs as icons — only the authored
  24-grid pictogram set (`src/ui/icons.js`) or, for the twelve system
  archetypes specifically, the illustrated Planet Portrait set.
- **Don't** add a second typeface, or a gradient applied to text.
- **Don't** reach for a hard-offset block shadow (`box-shadow: Npx Npx 0`) —
  the neobrutalist ledge was never this world, before or after the redesign.
- **Don't** let a glow stand alone as the only depth cue on an
  interactive control — it rides with the existing bevel/inset system.
- **Don't** extend the Planet Portrait's circular silhouette to any other
  component; it is a deliberate, singular exception for celestial bodies.
