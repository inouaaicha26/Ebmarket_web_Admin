/**
 * ÉCRAN D'EXEMPLE — modèle à copier (voir docs/ajouter-un-ecran.md).
 * Montre : en-tête, recherche, tableau, badge de statut, montants XAF, pagination,
 * les 4 états (chargement, vide, erreur, données) et un formulaire de création.
 * Travaille sur le SERVEUR SIMULÉ : route provisoire /produits (api/routes-provisoires.ts).
 */
import { useState } from 'react';
import type { Produit } from '@/api/types-reponses';
import { BlocRequete, Button, DataTable, EmptyState, PageHeader, Pagination, StatusBadge, TextInput, type Colonne } from '@/components';
import { useRequete } from '@/hooks/useRequete';
import { formaterMontantXAF } from '@/lib/formatage';
import { listerProduits } from './api';
import { FormulaireProduit } from './FormulaireProduit';

const TAILLE = 10;

const colonnes: Colonne<Produit>[] = [
  { titre: 'Code', cellule: (p) => p.code },
  { titre: 'Libellé', cellule: (p) => p.libelle },
  { titre: 'Prix unitaire', cellule: (p) => formaterMontantXAF(p.prixUnitaire), alignement: 'droite' },
  { titre: 'Statut', cellule: (p) => <StatusBadge statut={p.statut} /> },
];

export default function PageProduits() {
  const [page, setPage] = useState(1);
  const [recherche, setRecherche] = useState('');
  const [creation, setCreation] = useState(false);
  const { etat, recharger } = useRequete(`${page}|${recherche}`, (signal) => listerProduits(page, TAILLE, recherche, signal));

  return (
    <>
      <PageHeader titre="Produits" sousTitre="Catalogue des produits de l’entreprise (exemple sur données simulées)." actions={<Button onClick={() => setCreation(true)}>+ Nouveau produit</Button>} />
      <div className="card">
        <div className="filters">
          <TextInput placeholder="Rechercher (code, libellé)…" aria-label="Rechercher" value={recherche} onChange={(e) => { setRecherche(e.target.value); setPage(1); }} />
        </div>
        <BlocRequete etat={etat} onRetry={recharger} vide={<EmptyState titre="Aucun produit" indication="Modifiez la recherche ou créez un produit." />}>
          {(produits, ok) => (
            <>
              <DataTable legende="Liste des produits" colonnes={colonnes} lignes={produits} cle={(p) => p.code} />
              <Pagination page={ok.reponse.page ?? page} taille={ok.reponse.taille ?? TAILLE} totalCount={ok.reponse.totalCount ?? produits.length} onChange={setPage} />
            </>
          )}
        </BlocRequete>
      </div>
      <FormulaireProduit ouvert={creation} onFermer={() => setCreation(false)} onCree={recharger} />
    </>
  );
}
