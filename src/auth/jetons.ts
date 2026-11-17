/**
 * STOCKAGE DES JETONS — décision à confirmer avec David (voir docs/decisions.md).
 * Choix actuel : EN MÉMOIRE SEULEMENT. Jamais localStorage, jamais sessionStorage, jamais dans l'URL.
 * Conséquence : recharger la page oblige à se reconnecter. Changer de méthode = modifier ce seul fichier.
 *
 * Jeton d'accès : 15 min. Jeton de rafraîchissement : 7 jours. Chaque rafraîchissement renvoie un NOUVEAU
 * jeton de rafraîchissement : on garde toujours le dernier (réutiliser un ancien ferme la session, E-IAM-08).
 */
let jetonAcces: string | null = null;
let jetonRafraichissement: string | null = null;

export const lireJetonAcces = (): string | null => jetonAcces;
export const lireJetonRafraichissement = (): string | null => jetonRafraichissement;

export function memoriserJetons(acces: string, rafraichissement: string): void {
  jetonAcces = acces;
  jetonRafraichissement = rafraichissement;
}

export function effacerJetons(): void {
  jetonAcces = null;
  jetonRafraichissement = null;
}
