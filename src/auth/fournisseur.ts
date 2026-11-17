import type { ContexteBackOffice } from '@/api/types-reponses';

/** Ce que la session sait faire. Deux réalisations : sessionSimulee (mode mock) et sessionApi (vraie API). */
export type ResultatOuverture = {
  nomAffiche: string;
  /** Contextes où la personne a un rôle. */
  contextes: ContexteBackOffice[];
  /** Codes de permission du rôle, pour masquer les menus (le front ne décide jamais d'un droit : l'API refuse). */
  permissions: string[];
};

export interface FournisseurSession {
  /** Ouvre la session « COMPTE ». (MFA : à ajouter à l'étape « connexion réelle ».) */
  ouvrir(identifiant: string, motDePasse: string): Promise<ResultatOuverture>;
  /** Passe de la session COMPTE au contexte choisi (ESPACE ou PLATEFORME). */
  choisirContexte(contexte: ContexteBackOffice): Promise<void>;
  /** Ferme la session côté API. Les jetons sont ensuite effacés par l'appelant. */
  fermer(): Promise<void>;
}
