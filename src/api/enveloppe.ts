/**
 * Enveloppe commune à toutes les réponses JSON de l'API, succès comme erreurs (décision du 16/11, guide v4 §2).
 * Le statut HTTP reste le vrai statut : jamais 200 avec success à false.
 * Types volontairement tolérants (null possible) : à resserrer avec une vraie réponse.
 */
export type ErreurChamp = { field: string; message: string };

export type Enveloppe<T> = {
  success: boolean;
  statusCode: number;
  /** En erreur : code fonctionnel (ex. E-ONB-01). On teste ce code, jamais le message. */
  code: string | null;
  message: string | null;
  data: T | null;
  totalCount: number | null;
  page: number | null;
  taille: number | null;
  /** Erreurs de saisie (400 E-SYS-01) : chemin du champ en camelCase, ex. lignes[0].quantite */
  errors: ErreurChamp[] | null;
  correlationId: string | null;
};
