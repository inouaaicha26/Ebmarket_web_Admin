import { appeler } from '@/api/client';
import type { FournisseurSession } from './fournisseur';

/**
 * Session RÉELLE — à brancher à l'étape « connexion réelle » (sprint 1, 2e tâche).
 * On n'invente aucun nom de champ : il faut une VRAIE réponse de POST /public/sessions
 * (champs de la réponse, nom du jeton de rafraîchissement, corps de /public/sessions/jeton).
 * Voir docs/connexion-reelle.md pour la marche à suivre.
 */
export class NonBranche extends Error {
  constructor(quoi: string) {
    super(`${quoi} n’est pas encore branché sur la vraie API. Lancez « npm run dev:mock » pour la session simulée.`);
    this.name = 'NonBranche';
  }
}

export const sessionApi: FournisseurSession = {
  ouvrir: () => Promise.reject(new NonBranche('La connexion')),
  choisirContexte: () => Promise.reject(new NonBranche('Le choix du contexte')),
  // Route connue (brief) : POST /api/v1/compte/deconnexion
  fermer: async () => {
    await appeler('POST', '/compte/deconnexion');
  },
};
