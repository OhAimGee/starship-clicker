---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — index.html (whole game UI)

Scope: the entire single-page game. Visitor mode: Operate (the player runs a
task across sessions). Audience: casual idle-game players, desktop and mobile,
short interrupted sessions. Job: click, schedule production, watch numbers
climb, unlock the next tier, reach an ascension. Constraints: static host, no
backend, offline-capable, FR default / EN ready, must run at 390px portrait.

Unresolved: exact self-hosted face; PWA scope; whether the flap cascade needs a
reduced-motion "snap" only or also a "no cascade" setting.

## Direction contract

THESIS: The game is a public departures board for a spacefaring civilisation.
It refuses the idle-game default — a scroll of same-size buy-cards — and the
sci-fi default — a neon HUD over a starfield. Every quantity is a ruled row on
one board; every change is a per-character flap cascade down that row.

OWN-WORLD: Matte near-black flap faces, white painted condensed grotesque in
fixed character cells, a brushed-steel board frame as the ground. Amber row
lamp = unaffordable or deficit; locked/terminated rows drop to dim signal-red.
One self-hosted condensed face throughout. Icons: one transit-pictogram set
(AIGA/DOT lineage) — solid white, single weight, one grid. Ruled rows and
columns are the whole composition: no cards, no gradients, no glass, tabular
numerals everywhere, themed scrollbar/caret/selection/focus.

STORY: The player reads the board, watches a resource line tick up flap by
flap, taps the board's origin to launch energy, and schedules services
(generators) that then run themselves. Locked rows state their unlock. Reaching
the quantum threshold lets them call ASCENSION — the board clears with a full
cascade and re-populates.

FIRST VIEWPORT (390px portrait): brushed-steel header — wordmark left,
CIVILISATION LEVEL set large right. Beneath it the resource board: 3–5 flap
rows (pictogram cell · name · right-aligned flapping figure · trend/lamp).
Centre, thumb-height: the LAUNCH control, a flap-framed bar reading "+N ⚡"
that flaps on every tap. Below: the active terminal's departures — generators
as timetabled services (time-code · name · ×count · load bar · cost). Fixed
bottom strip: the terminal selector. LAUNCH is the visual and physical centre.

FORM: Rail-concourse split-flap board (signals-instruments-split-flap-concourse).
Dealt challenger; beat the assigned orrery on audience identification and
product clarity. Fuses my top grounded candidate ("a departures/telemetry
board", rank 1 of 7). Seed key 5e1de50f.

RAISE (from Alphabet Storm, declined — type as monumental matter): the
civilisation level and running grand totals are set at board-header display
scale as the page's anchor, never a stat-strip afterthought.
RAISE (from Variable Font Specimen, declined — one continuous control drives
the surface): LAUNCH is the single master input; held, it runs a visible
auto-cadence and the whole board answers in step.
RAISE (from Sneaker Box Archive, declined — tactile pull-to-reveal depth): a
row opens in place with a mechanical slide to its detail drawer, never a modal.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
