// Association sémantique entité -> pictogramme du set unique (icons.js).
// Le set reste court : on réemploie par sens plutôt que d'ouvrir 40 dessins.

import { GENERATOR_BY_ID } from '../data/generators.js';

const CLICK_UPGRADE_ICON = { clickPower: 'bolt', autoClicker: 'technology' };

const EVENT_ICON = {
  solarStorm: 'energy',
  archaeologicalFind: 'crystals',
  quantumAnomaly: 'antimatter',
  diplomaticContact: 'influence',
  darkMatterVortex: 'darkMatter',
};

export const resourceIconId = (id) => id; // les ids ressources = ids pictogrammes
export const terminalIconId = (key) => key; // shop/fleet/exploration/technology/ascension

export const generatorIconId = (id) =>
  resourceIconId(GENERATOR_BY_ID[id]?.resource ?? 'energy');

export const shipIconId = () => 'fleet';
export const techIconId = () => 'technology';
export const clickUpgradeIconId = (id) => CLICK_UPGRADE_ICON[id] ?? 'bolt';
export const prestigeUpgradeIconId = () => 'ascension';
export const eventIconId = (id) => EVENT_ICON[id] ?? 'ascensionPoints';
export const systemIconId = () => 'exploration';

const FACTION_ICON = {
  miningCollective: 'metal',
  ironLegion: 'fleet',
  quantumOrder: 'quantumEnergy',
};
const NODE_TYPE_ICON = {
  invade: 'fleet',
  bonus: 'trendUp',
  skillPoint: 'ascensionPoints',
  conquest: 'exploration',
};

export const factionIconId = (id) => FACTION_ICON[id] ?? 'ascension';
export const factionSkillIconId = () => 'ascension';
export const nodeTypeIconId = (type) => NODE_TYPE_ICON[type] ?? 'exploration';
