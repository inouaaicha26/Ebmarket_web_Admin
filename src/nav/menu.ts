import type { ContexteBackOffice } from '@/api/types-reponses';

/**
 * MENU DU BACK-OFFICE, repris de la maquette (08_MAQUETTE/ebmarket.html, constante NAV).
 * - `rubrique` = dossier de src/rubriques/ où vivent les écrans du groupe ;
 * - `contextes` = qui voit le groupe : PLATEFORME (administration eBMarket) ou ESPACE (entreprise) ;
 * - `permission` (facultative) = code de permission du rôle. À renseigner avec les VRAIS codes de la matrice
 *   (/api/v1/espace/roles/matrice) : on n'en invente pas.
 * Pour ajouter une rubrique : une ligne ici, puis enregistrer l'écran dans app/ecrans.tsx.
 */
export type ElementMenu = { cle: string; libelle: string; permission?: string };
export type GroupeMenu = { libelle: string; rubrique: string; contextes: ContexteBackOffice[]; elements: ElementMenu[] };

export const MENU: GroupeMenu[] = [
  { libelle: 'Espace plateforme', rubrique: 'plateforme', contextes: ['PLATEFORME'], elements: [
    { cle: 'dashboard-global', libelle: 'Dashboard global' },
    { cle: 'demandes-ouverture', libelle: 'Demandes d’ouverture' },
    { cle: 'entreprises', libelle: 'Entreprises' },
    { cle: 'catalogue-roles', libelle: 'Catalogue rôles & formules' },
    { cle: 'pays', libelle: 'Pays' },
    { cle: 'devises', libelle: 'Devises' },
    { cle: 'agregateurs', libelle: 'Agrégateurs' },
    { cle: 'supervision-paiements', libelle: 'Supervision des paiements' },
  ] },
  { libelle: 'Espace entreprise', rubrique: 'entreprise', contextes: ['ESPACE'], elements: [
    { cle: 'dashboard', libelle: 'Dashboard entreprise' },
    { cle: 'profil', libelle: 'Profil entreprise' },
    { cle: 'utilisateurs', libelle: 'Utilisateurs' },
    { cle: 'roles', libelle: 'Rôles et permissions' },
    { cle: 'organisation', libelle: 'Organisation commerciale' },
    { cle: 'hierarchie', libelle: 'Hiérarchie commerciale' },
    { cle: 'campagnes', libelle: 'Campagnes' },
  ] },
  { libelle: 'Réseau commercial', rubrique: 'reseau-commercial', contextes: ['ESPACE'], elements: [
    { cle: 'commerciaux', libelle: 'Commerciaux' },
    { cle: 'collaborateurs', libelle: 'Collaborateurs' },
    { cle: 'affiliations', libelle: 'Affiliations' },
    { cle: 'contrats', libelle: 'Contrats' },
    { cle: 'statistiques', libelle: 'Statistiques individuelles' },
  ] },
  { libelle: 'Produits et clients', rubrique: 'produits-clients', contextes: ['ESPACE'], elements: [
    { cle: 'produits', libelle: 'Produits' },
    { cle: 'parametrage-commissions', libelle: 'Paramétrage commissions' },
    { cle: 'clients', libelle: 'Clients' },
    { cle: 'attributions', libelle: 'Attributions' },
  ] },
  { libelle: 'Ventes et commissions', rubrique: 'ventes-commissions', contextes: ['ESPACE'], elements: [
    { cle: 'ventes', libelle: 'Ventes' },
    { cle: 'commissions', libelle: 'Commissions' },
    { cle: 'commissions-recurrentes', libelle: 'Commissions récurrentes' },
  ] },
  // « Espace structure » : placé provisoirement dans ventes-commissions, en attente de la réponse de David.
  { libelle: 'Espace structure', rubrique: 'ventes-commissions', contextes: ['ESPACE'], elements: [
    { cle: 'plans-redistribution', libelle: 'Plans de redistribution' },
    { cle: 'redistributions', libelle: 'Redistributions' },
  ] },
  { libelle: 'Paiements', rubrique: 'paiements', contextes: ['ESPACE'], elements: [
    { cle: 'financement', libelle: 'Financement' },
    { cle: 'demande-retrait', libelle: 'Demande de retrait' },
    { cle: 'file-maker', libelle: 'File Maker' },
    { cle: 'file-checker', libelle: 'File Checker' },
    { cle: 'historique', libelle: 'Historique des paiements' },
    { cle: 'reconciliation', libelle: 'Réconciliation' },
    { cle: 'ledger', libelle: 'Ledger de suivi' },
    { cle: 'audit', libelle: 'Journal d’audit' },
  ] },
];

export const cheminElement = (g: GroupeMenu, e: ElementMenu): string => `/${g.rubrique}/${e.cle}`;

/** Groupes et éléments visibles pour ce contexte et ces permissions (confort d'affichage, pas une sécurité). */
export function menuVisible(contexte: ContexteBackOffice | null, peutVoir: (permission?: string) => boolean, menu: GroupeMenu[] = MENU): GroupeMenu[] {
  if (!contexte) return [];
  return menu
    .filter((g) => g.contextes.includes(contexte))
    .map((g) => ({ ...g, elements: g.elements.filter((e) => peutVoir(e.permission)) }))
    .filter((g) => g.elements.length > 0);
}

export function trouverElement(chemin: string, menu: GroupeMenu[] = MENU): { groupe: GroupeMenu; element: ElementMenu } | undefined {
  for (const groupe of menu) for (const element of groupe.elements) if (cheminElement(groupe, element) === chemin) return { groupe, element };
  return undefined;
}
