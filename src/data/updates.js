// Mise à jour courante à annoncer au joueur (voir ui/update-notice.js) —
// une seule entrée, pas d'historique : pour une future mise à jour,
// changer `id` (et les clés i18n associées) redéclenche la popup pour
// tout le monde, y compris ceux ayant déjà vu la précédente.

export const CURRENT_UPDATE = {
  id: 'corbi',
  titleKey: 'updateNotice.corbi.title',
  introKey: 'updateNotice.corbi.intro',
  bulletKeys: [
    'updateNotice.corbi.bullet1',
    'updateNotice.corbi.bullet2',
    'updateNotice.corbi.bullet3',
  ],
};
