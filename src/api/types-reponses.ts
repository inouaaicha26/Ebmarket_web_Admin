/**
 * TYPES DE RÉPONSE ÉCRITS À LA MAIN — un seul fichier par application (guide v4 §2).
 * Le Swagger ne décrit pas encore le contenu de `data`. Ces types s'écrivent à partir des RÉPONSES RÉELLES
 * de l'API, jamais de l'imagination : ce fichier disparaît dès que le Swagger décrit le contenu.
 *
 * Les valeurs de liste (statuts, rôles, méthodes) sont du TEXTE ("ACTIVE", "MAKER"), jamais des nombres.
 */

/** Contextes de session connus (brief) : COMPTE d'abord, puis le contexte choisi. */
export type Contexte = 'COMPTE' | 'ESPACE' | 'PLATEFORME' | 'COMMERCIAL';
/** Contextes qu'une personne choisit dans le back-office. */
export type ContexteBackOffice = 'ESPACE' | 'PLATEFORME';

/* ------------------------------------------------------------------ PROVISOIRE (écran d'exemple) */
/** PROVISOIRE : champs du serveur simulé, inventés pour l'exemple. À remplacer par la vraie réponse de l'API. */
export type Produit = {
  code: string;
  libelle: string;
  /** Prix unitaire en XAF, entier. */
  prixUnitaire: number;
  statut: string;
};

export type ProduitACreer = Pick<Produit, 'code' | 'libelle' | 'prixUnitaire'>;
