// Traduit un message structuré du moteur ({ key, params }) en texte affichable.
// Le moteur ne connaît pas l'i18n : c'est ici qu'on relie les ids aux noms.

import { t } from '../i18n/index.js';
import { CONFIG } from '../data/config.js';
import { resourceCode } from '../data/resources.js';
import { formatNumber, formatResourceList } from './format.js';

const NAME_NS = {
  'notify.generatorBought': 'generator',
  'notify.shipBuilt': 'ship',
  'notify.upgradeBought': 'clickUpgrade',
  'notify.techResearched': 'tech',
  'notify.prestigeUpgraded': 'prestigeUpgrade',
};

const UNLOCK_NS = { gen: 'generator', ship: 'ship', tech: 'tech' };

export function notifyText({ key, params = {} }, engine) {
  // Événement aléatoire : la clé est `event.<id>`
  if (key.startsWith('event.')) {
    const id = key.slice('event.'.length);
    const list = Object.entries(params.gains ?? {})
      .map(([res, amt]) => `+${formatNumber(amt)} ${resourceCode(res)}`)
      .join(', ');
    return t('notify.eventGain', { name: t(`event.${id}`), list });
  }

  if (NAME_NS[key]) {
    const name = t(`${NAME_NS[key]}.${params.id}.name`);
    const level = engine?.state?.prestige?.upgrades?.[params.id]?.level;
    return t(key, { name, level });
  }

  if (key === 'notify.nodeReward') {
    const list = Object.entries(params.reward ?? {})
      .map(([res, amt]) => `+${formatNumber(amt)} ${resourceCode(res)}`)
      .join(', ');
    return t(key, { list });
  }

  if (key === 'notify.factionSkillBought') {
    const factionId = engine?.state?.run?.factionId;
    const name = t(`factionSkill.${params.id}.name`);
    const level =
      engine?.state?.prestige?.factions?.[factionId]?.skills?.[params.id]
        ?.level;
    return t(key, { name, level });
  }

  if (key === 'notify.ascensionRewardChosen') {
    const name = t(`ascensionReward.${params.id}.name`);
    const level = engine?.state?.ascension?.rewards?.[params.id]?.level;
    return t(key, { name, level });
  }

  if (key === 'notify.unlocked') {
    const ns = UNLOCK_NS[params.kind];
    return t('notify.unlocked', {
      name: ns ? t(`${ns}.${params.id}.name`) : params.id,
    });
  }

  if (key === 'notify.missingResources') {
    return t(key, { list: formatResourceList(params.missing ?? {}) });
  }

  if (key === 'notify.cannotAscend') {
    return t(key, { level: CONFIG.ascension.factionLevelThreshold });
  }

  return t(key, params);
}
