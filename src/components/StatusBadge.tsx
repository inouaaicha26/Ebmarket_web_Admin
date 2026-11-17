/**
 * Badge de statut : libellé français et couleur constantes d'un écran à l'autre (guide v4 §5).
 * Un statut inconnu s'affiche tel quel en gris : l'écran ne casse jamais sur une valeur nouvelle.
 * Pour ajouter un statut : une ligne dans STATUTS.
 */
type Ton = 'ok' | 'info' | 'warn' | 'err' | 'grey';

export const STATUTS: Record<string, { libelle: string; ton: Ton }> = {
  DEMANDE_SOUMISE: { libelle: 'Demande soumise', ton: 'warn' },
  EN_VALIDATION: { libelle: 'En validation', ton: 'info' },
  COMPLEMENT_DEMANDE: { libelle: 'Complément demandé', ton: 'warn' },
  REJETEE: { libelle: 'Rejetée', ton: 'err' },
  ACTIVE: { libelle: 'Activée', ton: 'ok' },
  ACTIF: { libelle: 'Actif', ton: 'ok' },
  EN_ATTENTE: { libelle: 'En attente', ton: 'warn' },
  SUSPENDU: { libelle: 'Suspendu', ton: 'err' },
  VERIFIE: { libelle: 'Vérifié', ton: 'ok' },
  SIGNE: { libelle: 'Signé', ton: 'info' },
  BROUILLON: { libelle: 'Brouillon', ton: 'grey' },
  PUBLIE: { libelle: 'Publié', ton: 'ok' },
  PUBLIEE: { libelle: 'Publiée', ton: 'ok' },
  ACQUISE: { libelle: 'Acquise', ton: 'info' },
  DISPONIBLE: { libelle: 'Disponible', ton: 'ok' },
  PAYEE: { libelle: 'Payée', ton: 'ok' },
  ECHOUEE: { libelle: 'Échouée', ton: 'err' },
  INCONNUE: { libelle: 'Statut inconnu', ton: 'warn' },
  ANNULEE: { libelle: 'Annulée', ton: 'err' },
};

export function StatusBadge({ statut }: { statut: string }) {
  const connu = STATUTS[statut];
  return <span className={`badge badge-${connu?.ton ?? 'grey'}`}>{connu?.libelle ?? statut.replace(/_/g, ' ')}</span>;
}
