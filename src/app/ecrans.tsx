import { lazy, type ComponentType } from 'react';

/**
 * REGISTRE chemin → écran. C'est ici qu'on branche un écran (une ligne).
 * Le chemin est « rubrique/cle » : mêmes valeurs que dans nav/menu.ts.
 * Une rubrique du menu absente d'ici affiche « Écran à venir ».
 */
export const ECRANS: Record<string, ComponentType> = {
  'produits-clients/produits': lazy(() => import('@/rubriques/produits-clients/produits/PageProduits')),
};
