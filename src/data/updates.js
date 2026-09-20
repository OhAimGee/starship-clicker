// Mise à jour courante à annoncer au joueur (voir ui/update-notice.js) —
// une seule entrée, pas d'historique : pour une future mise à jour,
// changer `id` (et les clés i18n associées) redéclenche la popup pour
// tout le monde, y compris ceux ayant déjà vu la précédente.

export const CURRENT_UPDATE = {
  id: 'enhancedCombat',
  titleKey: 'updateNotice.enhancedCombat.title',
  introKey: 'updateNotice.enhancedCombat.intro',
  bulletKeys: [
    'updateNotice.enhancedCombat.bullet1',
    'updateNotice.enhancedCombat.bullet2',
    'updateNotice.enhancedCombat.bullet3',
    'updateNotice.enhancedCombat.bullet4',
  ],
};
