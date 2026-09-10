# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are casual incremental/idle-game players who play in a desktop or
mobile browser, usually in short sessions between other activities and leaving
the tab open to accumulate resources. They arrive expecting a Cookie
Clicker–style loop: click, buy generators, watch numbers grow, unlock new
systems. The current audience is French-speaking; an English-speaking audience
is a planned expansion.

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

- Played in a single browser tab; progress persists via `localStorage` with
  automatic saving roughly every second and automatic restore on load.
- Sessions are interrupted and resumed; the game is expected to keep producing
  while unattended and to reconcile progress on return.
- Distributed as static files on GitHub Pages (or an equivalent static host):
  no server, relative asset paths only, must run from a plain file host.
- Debug helpers are exposed on `window` (`window.game`, `debugAddResources()`,
  `resetGame()`) and a `validation.js` self-check logs to the console.

## Capabilities and Constraints

Confirmed capabilities:
- Click-to-earn mothership with an energy-per-click value and a displayed
  "Civilization Level".
- ~17 automated generators across basic and ultra-advanced tiers, most costing
  one resource and producing another.
- Upgrades: click power, auto-clicker, and permanent multiplier upgrades.
- Space fleet (fighters through legendary ships) with attack and maintenance
  costs.
- Stellar-system exploration with progress tracking.
- Technology tree whose nodes unlock systems and apply cost/reward modifiers.
- Prestige / Ascension: reset for Ascension Points and permanent bonuses.
- Random timed events with an in-game notification banner.
- Tabbed UI: Boutique (shop), Flotte (fleet), Exploration, Technologies,
  Ascension.

Constraints:
- Pure vanilla HTML/CSS/JS, no framework and no build step
  (`index.html` + `script.js` + `visual-enhancements.js` + `validation.js`,
  `style_new.css` + `quantum-expansion.css`). Any future tooling change is a
  deliberate decision, not assumed.
- No external runtime dependencies; must keep working offline and on a static
  host.
- All user-facing copy is currently in French and is not yet structured for
  translation. Text expansion for English is an anticipated need but the
  localization approach is undecided.
- `index_optimized.html` and several `test-*.html` / `*-validation*.js` files
  exist alongside the live game; `index.html` is the canonical entry point.
- A `backup/` directory holds pre-cleanup copies of every file.

## Brand Commitments

- Name: "Starship Clicker" (styled in the header as "🚀 STARSHIP CLICKER 🚀").
- No logo, wordmark, or brand guidelines exist yet.
- Heavy use of emoji as resource, generator, and navigation icons is the
  current identity convention.

## Evidence on Hand

- A complete, playable implementation is the primary evidence of intended
  behavior and content.
- `README.md`, `CORRECTION_FORMATNUMBER.md`, and `VALIDATION_REPORT.md`
  document past cleanup and bug-fix work (in French).
- No real player data, analytics, testimonials, press, marketing copy, store
  listing, screenshots, or original artwork exist. Future work must not
  fabricate player counts, reviews, or launch claims.

## Product Principles

1. **The idle loop is sacred.** Progress must continue while the tab is
   unattended and reconcile correctly on return; never require the player to be
   present to keep earning.
2. **Legible conversion chains.** With seven resources feeding each other, the
   player must always be able to see what a purchase costs, what it produces,
   and what it unlocks next.
3. **Every tier earns the next.** Shop, fleet, exploration, technology, and
   ascension should each make the following system reachable and worth pursuing.
4. **Zero-dependency, static-host-safe.** No backend, no account, no external
   calls; the game ships as static files and runs offline.
5. **Ready to speak more than French.** Treat French as today's default while
   keeping copy and layout able to absorb English without a rebuild.

## Accessibility & Inclusion

No specific standard or user requirement has been established. Note for future
work: the core interaction is rapid repeated clicking on a single target, and
resource state is currently conveyed largely through color and emoji.
