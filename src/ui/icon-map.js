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
export const megastructureIconId = () => 'megastructure';
export const decreeIconId = () => 'decree';

const FACTION_ICON = {
  miningCollective: 'metal',
  ironLegion: 'fleet',
  quantumOrder: 'quantumEnergy',
};
const PLANET_TYPE_ICON = {
  invaded: 'fleet',
  hostile: 'fleet',
  uninhabited: 'exploration',
  gas: 'trendUp',
};

export const factionIconId = (id) => FACTION_ICON[id] ?? 'ascension';
export const factionSkillIconId = () => 'ascension';
export const planetTypeIconId = (type) => PLANET_TYPE_ICON[type] ?? 'exploration';

const RUN_SKILL_ICON = {
  overclockedThrusters: 'fleet',
  scavengerProtocols: 'metal',
  rapidFire: 'bolt',
  fieldRepairs: 'fleet',
  reinforcedHulls: 'fleet',
  streamlinedLogistics: 'fleet',
  energyFocus: 'energy',
};
export const runSkillIconId = (id) => RUN_SKILL_ICON[id] ?? 'ascensionPoints';

const ASCENSION_REWARD_ICON = {
  hyperProduction: 'trendUp',
  overcharge: 'bolt',
  grandArmada: 'fleet',
  stockpile: 'metal',
  quantumMastery: 'quantumEnergy',
  masterShipwrights: 'fleet',
  selfSufficientFleet: 'fleet',
  primordialSpark: 'energy',
};
export const ascensionRewardIconId = (id) => ASCENSION_REWARD_ICON[id] ?? 'ascension';
