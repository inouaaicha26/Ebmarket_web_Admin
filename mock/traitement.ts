import { produitsInitiaux, type ProduitSimule } from './donnees';

/**
 * Serveur simulé : mêmes enveloppes que la vraie API (guide v4 §2).
 * Pure fonction (méthode + chemin + corps → statut + corps), donc utilisable par Vite ET par les tests.
 * Les champs sont ceux de src/api/types-reponses.ts (PROVISOIRE).
 */
export type ResultatSimule = { statut: number; entetes: Record<string, string>; corps: unknown };

let produits: ProduitSimule[] = produitsInitiaux();
export const reinitialiserSimulation = (): void => {
  produits = produitsInitiaux();
};

type Champ = { field: string; message: string };

function enveloppe(statut: number, partie: Record<string, unknown>): Record<string, unknown> {
  return {
    success: statut < 400,
    statusCode: statut,
    code: null,
    message: null,
    data: null,
    totalCount: null,
    page: null,
    taille: null,
    errors: null,
    correlationId: `simule-${Math.random().toString(36).slice(2, 10)}`,
    ...partie,
  };
}

const erreur = (statut: number, code: string, message: string, errors: Champ[] | null = null): ResultatSimule => ({
  statut,
  entetes: {},
  corps: enveloppe(statut, { code, message, errors }),
});

function listerProduits(parametres: URLSearchParams): ResultatSimule {
  const q = (parametres.get('q') ?? '').trim().toLowerCase();
  if (q === 'erreur') return erreur(500, 'SIMULE-500', 'Erreur simulée.');
  const page = Math.max(1, Number(parametres.get('page') ?? 1) || 1);
  const taille = Math.min(500, Math.max(1, Number(parametres.get('taille') ?? 50) || 50));
  const filtres = produits.filter((p) => !q || p.code.toLowerCase().includes(q) || p.libelle.toLowerCase().includes(q));
  const tranche = filtres.slice((page - 1) * taille, page * taille);
  return { statut: 200, entetes: {}, corps: enveloppe(200, { data: tranche, totalCount: filtres.length, page, taille }) };
}

function creerProduit(corps: unknown): ResultatSimule {
  const b = (corps ?? {}) as Partial<Record<keyof ProduitSimule, unknown>>;
  const errors: Champ[] = [];
  const code = typeof b.code === 'string' ? b.code.trim() : '';
  if (!/^[A-Z0-9-]{3,}$/.test(code)) errors.push({ field: 'code', message: 'Au moins 3 caractères : majuscules, chiffres ou tirets.' });
  else if (produits.some((p) => p.code === code)) errors.push({ field: 'code', message: 'Ce code existe déjà.' });
  const libelle = typeof b.libelle === 'string' ? b.libelle.trim() : '';
  if (libelle.length < 3) errors.push({ field: 'libelle', message: 'Au moins 3 caractères.' });
  const prix = b.prixUnitaire;
  if (typeof prix !== 'number' || !Number.isInteger(prix) || prix <= 0) errors.push({ field: 'prixUnitaire', message: 'Entier positif en XAF, sans décimale.' });
  if (errors.length) return erreur(400, 'E-SYS-01', 'Données invalides.', errors);

  const cree: ProduitSimule = { code, libelle, prixUnitaire: prix as number, statut: 'BROUILLON' };
  produits.unshift(cree);
  return { statut: 201, entetes: { Location: `/api/v1/produits/${code}` }, corps: enveloppe(201, { data: cree }) };
}

/** @param chemin chemin APRÈS /api/v1, avec sa chaîne de requête, ex. « /produits?page=2 ». */
export function traiterRequeteSimulee(methode: string, chemin: string, corps: unknown): ResultatSimule {
  const url = new URL(chemin, 'http://simule.local');
  if (url.pathname === '/produits' && methode === 'GET') return listerProduits(url.searchParams);
  if (url.pathname === '/produits' && methode === 'POST') return creerProduit(corps);
  return erreur(404, 'SIMULE-404', 'Introuvable (route non simulée).');
}
