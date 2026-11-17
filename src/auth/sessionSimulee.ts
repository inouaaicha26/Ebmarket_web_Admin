import { ErreurApi } from '@/api/erreurs';
import type { ContexteBackOffice } from '@/api/types-reponses';
import type { FournisseurSession, ResultatOuverture } from './fournisseur';
import { memoriserJetons } from './jetons';

/**
 * Session SIMULÉE (npm run dev:mock). Aucune requête, aucun mot de passe vérifié.
 * - identifiant en « .test » obligatoire (comptes de test uniquement) ;
 * - contient « plateforme » → administrateur eBMarket (contexte PLATEFORME) ;
 * - contient « double » → deux contextes (écran de choix) ;
 * - sinon → utilisateur d'entreprise (contexte ESPACE) ;
 * - mot de passe « mauvais » → refus simulé.
 */
export const sessionSimulee: FournisseurSession = {
  async ouvrir(identifiant, motDePasse): Promise<ResultatOuverture> {
    if (!identifiant.toLowerCase().endsWith('.test') || motDePasse === 'mauvais') {
      throw new ErreurApi(401, null, 'Identifiant ou mot de passe incorrect.');
    }
    memoriserJetons('jeton-acces-simule', 'jeton-rafraichissement-simule');
    const id = identifiant.toLowerCase();
    const contextes: ContexteBackOffice[] = id.includes('double') ? ['ESPACE', 'PLATEFORME'] : id.includes('plateforme') ? ['PLATEFORME'] : ['ESPACE'];
    return { nomAffiche: 'Utilisateur simulé', contextes, permissions: [] };
  },
  async choisirContexte() {
    memoriserJetons('jeton-acces-simule-contexte', 'jeton-rafraichissement-simule-2');
  },
  async fermer() {
    /* rien à fermer côté serveur */
  },
};
