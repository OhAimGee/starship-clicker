// Événements aléatoires de bataille (voir game/battle.js). À chaque round, 0 à
// 2 événements se déclenchent ; chacun frappe (ou avantage) un camp tiré au
// sort, à parts égales — les événements ne penchent donc pas la balance en
// moyenne, ils créent de la variance et de la tension.
//
// `kind` : 'boon' (avantage le camp `side`) ou 'bane' (le frappe) — l'interface
// s'en sert pour colorer la ligne du journal.
// Même motif que `data/events.js` : `weight` pondère le tirage, `when(ctx, side)`
// filtre les cas où l'événement n'a pas de sens, `apply(ctx, side)` modifie
// les piles d'unités et renvoie l'unité concernée (le texte vit en i18n :
// `battle.event.<id>.<ally|enemy>`, `side` = le camp concerné).
//
// `ctx` : { rng, round, flags, alive(side), pick(side), foeOf(side) } — une
// unité est { n, n0, pool, pool0, hp, size, armor, mod, incoming, … } ;
//  - `mod.dmg / mod.evade / mod.fire / mod.vuln` : modificateurs valables
//    pour le round en cours seulement ;
//  - `incoming` : dégâts immédiats, résolus avec ceux du round.

export const COMBAT_EVENTS = [
  {
    // Une pile trouve une faille : dégâts +50 % ce round.
    id: 'criticalHit',
    kind: 'boon',
    weight: 7,
    when: (ctx, side) => ctx.alive(side).length > 0,
    apply(ctx, side) {
      const unit = ctx.pick(side);
      unit.mod.dmg *= 1.5;
      return unit;
    },
  },
  {
    // Tous les tireurs du camp se coordonnent : dégâts +25 % ce round.
    id: 'barrage',
    kind: 'boon',
    weight: 5,
    when: (ctx, side) => ctx.alive(side).length > 0,
    apply(ctx, side) {
      const units = ctx.alive(side);
      for (const u of units) u.mod.dmg *= 1.25;
      return units[0];
    },
  },
  {
    // Boucliers saturés : la pile touchée encaisse +50 % ce round.
    id: 'shieldFailure',
    kind: 'bane',
    weight: 5,
    when: (ctx, side) => ctx.alive(side).length > 0,
    apply(ctx, side) {
      const unit = ctx.pick(side);
      unit.mod.vuln *= 1.5;
      return unit;
    },
  },
  {
    // Brèche dans la coque : la pile perd 6 % de ses PV sur-le-champ.
    id: 'hullBreach',
    kind: 'bane',
    weight: 5,
    when: (ctx, side) => ctx.alive(side).length > 0,
    apply(ctx, side) {
      const unit = ctx.pick(side);
      unit.incoming += 0.06 * unit.pool;
      return unit;
    },
  },
  {
    // Surchauffe d'un réacteur : un vaisseau est perdu (piles de 4+ seulement,
    // pour ne pas décimer une toute petite flotte sur un coup du sort).
    id: 'reactorOverheat',
    kind: 'bane',
    weight: 3,
    when: (ctx, side) => ctx.alive(side).some((u) => u.n >= 4),
    apply(ctx, side) {
      const unit = ctx.pick(side, (u) => u.n >= 4);
      unit.incoming += unit.hp;
      return unit;
    },
  },
  {
    // Manœuvre d'évitement : +20 points d'esquive ce round.
    id: 'evasiveManeuver',
    kind: 'boon',
    weight: 5,
    when: (ctx, side) => ctx.alive(side).length > 0,
    apply(ctx, side) {
      const unit = ctx.pick(side);
      unit.mod.evade += 0.2;
      return unit;
    },
  },
  {
    // Réparations d'urgence : la pile la plus entamée regagne 8 % de ses PV
    // (dans la limite des vaisseaux encore en vie — on ne ressuscite pas).
    id: 'emergencyRepairs',
    kind: 'boon',
    weight: 4,
    when: (ctx, side) => ctx.alive(side).some((u) => u.pool < u.n * u.hp * 0.9),
    apply(ctx, side) {
      const unit = ctx
        .alive(side)
        .filter((u) => u.pool < u.n * u.hp * 0.9)
        .reduce((a, b) => (a.pool / a.pool0 < b.pool / b.pool0 ? a : b));
      unit.pool = Math.min(unit.n * unit.hp, unit.pool + 0.08 * unit.pool0);
      return unit;
    },
  },
  {
    // Panne d'armes : la pile ne tire qu'à moitié ce round.
    id: 'weaponsMalfunction',
    kind: 'bane',
    weight: 4,
    when: (ctx, side) => ctx.alive(side).length > 0,
    apply(ctx, side) {
      const unit = ctx.pick(side);
      unit.mod.fire *= 0.5;
      return unit;
    },
  },
  {
    // Tir décisif : un vaisseau du camp adverse (la plus grosse pile) est
    // détruit net. `side` = le camp qui tire, l'unité renvoyée est la victime.
    id: 'decisiveShot',
    kind: 'boon',
    weight: 4,
    when: (ctx, side) => ctx.alive(ctx.foeOf(side)).length > 0,
    apply(ctx, side) {
      const victim = ctx
        .alive(ctx.foeOf(side))
        .reduce((a, b) => (b.size > a.size ? b : a));
      victim.incoming += victim.hp;
      return victim;
    },
  },
  {
    // Renforts ennemis : une fois par bataille, +10 % d'une pile ennemie.
    id: 'reinforcements',
    kind: 'boon',
    weight: 2,
    sides: ['enemy'],
    when: (ctx, side) =>
      side === 'enemy' && ctx.round >= 2 && !ctx.flags.reinforced,
    apply(ctx, side) {
      const unit = ctx.pick(side);
      const added = Math.max(1, Math.round(unit.n0 * 0.1));
      unit.n += added;
      unit.n0 += added;
      unit.pool += added * unit.hp;
      unit.pool0 += added * unit.hp;
      ctx.flags.reinforced = true;
      return unit;
    },
  },
];

export const COMBAT_EVENT_IDS = COMBAT_EVENTS.map((e) => e.id);
export const COMBAT_EVENT_BY_ID = Object.fromEntries(
  COMBAT_EVENTS.map((e) => [e.id, e])
);
