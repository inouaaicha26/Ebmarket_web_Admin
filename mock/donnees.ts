/** Données de démonstration du serveur simulé (jeu de données du brief : SANTE-STD à 25 000 XAF). */
export type ProduitSimule = { code: string; libelle: string; prixUnitaire: number; statut: string };

export function produitsInitiaux(): ProduitSimule[] {
  const liste: ProduitSimule[] = [
    { code: 'SANTE-STD', libelle: 'Assurance santé standard', prixUnitaire: 25000, statut: 'PUBLIE' },
    { code: 'AUTO-BASE', libelle: 'Assurance auto de base', prixUnitaire: 40000, statut: 'PUBLIE' },
    { code: 'VIE-EPARGNE', libelle: 'Épargne vie', prixUnitaire: 15000, statut: 'BROUILLON' },
  ];
  // Quelques lignes de plus pour montrer la pagination.
  for (let i = 4; i <= 27; i++) liste.push({ code: `PRD-${String(i).padStart(3, '0')}`, libelle: `Produit d'essai ${i}`, prixUnitaire: 1000 * i, statut: 'BROUILLON' });
  return liste;
}
