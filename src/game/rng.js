// Générateurs pseudo-aléatoires seedés, partagés par la génération procédurale
// des systèmes (`systems-map.js`) et par la simulation de bataille
// (`battle.js`) : mêmes graines, mêmes tirages, sur n'importe quelle machine.

/** PRNG minimal (mulberry32) : `seededRng(graine)()` renvoie un flottant
 * dans [0, 1). Aucun état externe — un appel = un tirage, dans l'ordre. */
export function seededRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Empreinte 32 bits d'une chaîne (FNV-1a) — sert à dériver une graine
 * stable d'un identifiant (ex. l'id d'une planète). */
export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Tirage gaussien centré réduit (Box-Muller) à partir de `rng`. */
export function gaussian(rng) {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Tirage binomial B(n, p). Exact (boucle) pour les petits effectifs, loi de
 * Poisson quand l'espérance est faible, approximation normale sinon : une
 * bataille compte des milliers de tirs, on ne peut pas les lancer un par un.
 */
export function binomial(rng, n, p) {
  if (n <= 0 || p <= 0) return 0;
  if (p >= 1) return n;
  if (n <= 40) {
    let k = 0;
    for (let i = 0; i < n; i++) if (rng() < p) k++;
    return k;
  }
  const mean = n * p;
  if (mean <= 10) {
    // Poisson (méthode de Knuth), bornée par n.
    const limit = Math.exp(-mean);
    let k = 0;
    let prod = rng();
    while (prod > limit && k < n) {
      k++;
      prod *= rng();
    }
    return k;
  }
  const sd = Math.sqrt(mean * (1 - p));
  const x = Math.round(mean + sd * gaussian(rng));
  return Math.min(n, Math.max(0, x));
}
