// Mise à jour courante à annoncer au joueur (voir ui/update-notice.js) —
// une seule entrée, pas d'historique : pour une future mise à jour,
// changer `id` (et les clés i18n associées) redéclenche la popup pour
// tout le monde, y compris ceux ayant déjà vu la précédente.

export const CURRENT_UPDATE = {
  id: 'fifty',
  titleKey: 'updateNotice.fifty.title',
  introKey: 'updateNotice.fifty.intro',
  bulletKeys: [
    'updateNotice.fifty.bullet1',
    'updateNotice.fifty.bullet2',
    'updateNotice.fifty.bullet3',
  ],
};
