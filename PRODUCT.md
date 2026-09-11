# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are casual incremental/idle-game players who play in a desktop or
mobile browser, usually in short sessions between other activities and leaving
the tab open to accumulate resources. They arrive expecting a Cookie
Clicker–style loop: click, buy generators, watch numbers grow, unlock new
systems. The game is playable in French (default) and English via an
in-game language switcher.

## Product Purpose

Starship Clicker is a browser-based incremental game about growing a spacefaring
civilization. The player clicks a mothership to generate energy, then reinvests
resources into automated generators, a combat fleet, stellar exploration,
a technology tree, and a prestige ("Ascension") reset that grants permanent
multipliers. Success means players return across multiple sessions, progress
through each unlock tier, and reach at least one prestige.

## Positioning

A multi-resource incremental game with seven interlocking resources (energy,
metal, crystals, antimatter, influence, dark matter, quantum energy) where
generators consume one resource to produce another, so progression is about
balancing conversion chains rather than a single currency. It runs fully
client-side with no account, no backend, and no external dependencies.

## Operating Context

- Played in a single browser tab; progress persists via `localStorage`
  (throttled autosave every ~10 s, plus on tab-hide/close) with automatic
  restore and offline-progress reconciliation on load (capped at 8 h).
- Sessions are interrupted and resumed; the game is expected to keep producing
  while unattended and to reconcile progress on return.
- Distributed as a static Vite build on GitHub Pages (or an equivalent static
  host): no server, relative asset paths only (`base: './'`), installable as a
  PWA (manifest + service worker) for offline play.
- Debug helpers (`window.__starship`) are exposed only in the Vite dev build
  (`import.meta.env.DEV`), never in the production bundle.

## Capabilities and Constraints

Confirmed capabilities:
- Click-to-earn mothership with an energy-per-click value and a displayed
  "Civilization Level".
- 14 automated generators across 4 tiers, each costing one resource to
  produce another (a legible conversion chain, not a single currency).
- Upgrades: click power, auto-clicker, and 4 permanent (prestige) upgrades.
- Space fleet (8 ship classes, fighters through reality-shifters) with attack
  and energy-upkeep costs.
- Stellar-system exploration (basic + advanced tiers) gated by fleet power.
- Technology tree (12 nodes) unlocking systems and applying cost/production
  modifiers.
- Prestige / Ascension: reset for Ascension Points and permanent bonuses;
  each ascension compounds (verified by simulation: first ascension in ~2h20
  of optimal play, the second in ~40 min).
- Random timed events with an in-game notification banner.
- Tabbed UI: Boutique (shop), Flotte (fleet), Exploration, Technologies,
  Ascension — all rendered from `src/data/*` definitions, not hand-written
  HTML.
- Full FR/EN localization (`src/i18n/`, key-parity tested) with a language
  switcher; FR is the default.

Constraints:
- Vite-built ES modules (`src/{data,game,i18n,ui}`), no UI framework. `data/`
  holds pure content definitions, `game/` a pure economy engine + stateful
  orchestrator, `ui/` the data-driven rendering layer. Any dependency beyond
  `break_infinity.js` and `@fontsource/barlow-condensed` is a deliberate
  decision, not assumed.
- No external runtime dependencies (no account, no backend, no network calls);
  must keep working offline and on a static host.
- Visual identity follows `DESIGN.md` ("Le Grand Tableau" — a split-flap
  departures-board system): a single pictogram icon set (no emoji), a single
  typeface, generated (not decorative-gradient) textures, mobile-first layout.
  Departing from it is a deliberate design decision, not an oversight.

## Brand Commitments

- Name: "Starship Clicker".
- Visual identity defined in `DESIGN.md`: split-flap board motif, a dedicated
  SVG pictogram set (`src/ui/icons.js`), Barlow Condensed as the sole
  typeface, a warm near-black steel palette with signal-only color use.
  Emoji are explicitly excluded from the interface (a deliberate departure
  from the pre-refonte identity).

## Evidence on Hand

- A complete, playable implementation is the primary evidence of intended
  behavior and content, backed by 77 Vitest tests (economy formulas, save
  migration, offline calculation, i18n key parity, data-integrity invariants)
  and a headless balance simulation used to validate ascension pacing.
- `README.md` and `DESIGN.md` reflect the current architecture and visual
  system. `docs/archive/` holds pre-refonte French cleanup reports
  (`CORRECTION_FORMATNUMBER.md`, `VALIDATION_REPORT.md`) as historical record
  only — they describe the pre-refonte codebase, not the current one.
- No real player data, analytics, testimonials, press, marketing copy, store
  listing, or original artwork exist. Future work must not fabricate player
  counts, reviews, or launch claims.

## Product Principles

1. **The idle loop is sacred.** Progress must continue while the tab is
   unattended and reconcile correctly on return; never require the player to be
   present to keep earning.
2. **Legible conversion chains.** With eight resources feeding each other, the
   player must always be able to see what a purchase costs, what it produces,
   and what it unlocks next.
3. **Every tier earns the next.** Shop, fleet, exploration, technology, and
   ascension should each make the following system reachable and worth pursuing
   — verified periodically by headless simulation, not assumed from the
   numbers alone.
4. **Zero-dependency, static-host-safe.** No backend, no account, no external
   calls; the game ships as a static Vite build and runs offline (PWA).
5. **One board, one voice.** The split-flap board motif, single pictogram set,
   and single typeface defined in `DESIGN.md` are the interface — no
   decorative gradients, no emoji, no ad-hoc icon styles.
6. **Speaks French and English equally.** Every user-facing string goes
   through `src/i18n/`; FR is today's default, EN is a first-class citizen,
   not an afterthought.

## Accessibility & Inclusion

Mobile-first, keyboard-accessible by construction: every purchase/action is a
real `<button>`, focus states are visible, resource and notification updates
use `aria-live`, motion honors `prefers-reduced-motion`, and text contrast is
held to the WCAG AA floor (4.5:1) — verified numerically during the Phase 3
visual refonte, not just eyeballed. Remaining known gaps: a full Lighthouse
accessibility audit is pending (Phase 4), and small pictogram sizes
(<~18px) for a couple of resource icons could use refinement.
