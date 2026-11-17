import { appeler } from '@/api/client';
import { ROUTES_PROVISOIRES } from '@/api/routes-provisoires';
import type { Produit, ProduitACreer } from '@/api/types-reponses';

// Les appels de l'écran vivent ici, à côté de l'écran. Aucune adresse en dur : tout passe par `appeler`.
export const listerProduits = (page: number, taille: number, q: string, signal: AbortSignal) =>
  appeler<Produit[]>('GET', ROUTES_PROVISOIRES.produits, { requete: { page, taille, q }, signal });

export const creerProduit = (produit: ProduitACreer) => appeler<Produit>('POST', ROUTES_PROVISOIRES.produits, { corps: produit });
