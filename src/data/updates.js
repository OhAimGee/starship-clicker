// Mise à jour courante à annoncer au joueur (voir ui/update-notice.js) —
// une seule entrée, pas d'historique : pour une future mise à jour,
// changer `id` (et les clés i18n associées) redéclenche la popup pour
// tout le monde, y compris ceux ayant déjà vu la précédente.

export const CURRENT_UPDATE = {
  id: 'civilEngineer',
  titleKey: 'updateNotice.civilEngineer.title',
  introKey: 'updateNotice.civilEngineer.intro',
  bulletKeys: [
    'updateNotice.civilEngineer.bullet1',
    'updateNotice.civilEngineer.bullet2',
    'updateNotice.civilEngineer.bullet3',
    'updateNotice.civilEngineer.bullet4',
  ],
};
