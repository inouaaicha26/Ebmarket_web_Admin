import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSimule } from '../../../../mock/fetchSimule';
import { reinitialiserSimulation } from '../../../../mock/traitement';
import PageProduits from './PageProduits';

const lisible = (s: string | null) => (s ?? '').replace(/\u00A0/g, ' ');

beforeEach(() => {
  reinitialiserSimulation();
  vi.stubGlobal('fetch', vi.fn(fetchSimule));
});
afterEach(() => vi.unstubAllGlobals());

describe('PageProduits — les 4 états', () => {
  it('chargement puis données (montants en XAF, statut en français, pagination)', async () => {
    render(<PageProduits />);
    expect(screen.getByRole('status')).toHaveTextContent('Chargement');
    expect(await screen.findByText('SANTE-STD')).toBeInTheDocument();
    expect(lisible(screen.getByText(/25.000.XAF/).textContent)).toBe('25 000 XAF');
    expect(screen.getAllByText('Publié').length).toBeGreaterThan(0);
    expect(screen.getByText(/27 résultats — page 1 sur 3/)).toBeInTheDocument();
  });

  it('vide quand la recherche ne trouve rien', async () => {
    render(<PageProduits />);
    await screen.findByText('SANTE-STD');
    await userEvent.type(screen.getByLabelText('Rechercher'), 'zzzz');
    expect(await screen.findByText('Aucun produit')).toBeInTheDocument();
  });

  it('erreur : message français et référence, avec possibilité de réessayer', async () => {
    render(<PageProduits />);
    await screen.findByText('SANTE-STD');
    await userEvent.type(screen.getByLabelText('Rechercher'), 'erreur');
    const alerte = await screen.findByRole('alert');
    expect(alerte).toHaveTextContent('Le serveur a rencontré un problème');
    expect(alerte).toHaveTextContent('Référence à communiquer : simule-');
    expect(within(alerte).getByRole('button', { name: 'Réessayer' })).toBeInTheDocument();
  });

  it('pagination : page suivante', async () => {
    render(<PageProduits />);
    await screen.findByText('SANTE-STD');
    await userEvent.click(screen.getByRole('button', { name: 'Suivant' }));
    expect(await screen.findByText(/page 2 sur 3/)).toBeInTheDocument();
    expect(screen.queryByText('SANTE-STD')).not.toBeInTheDocument();
  });
});

describe('PageProduits — formulaire de création', () => {
  async function ouvrir() {
    render(<PageProduits />);
    await screen.findByText('SANTE-STD');
    await userEvent.click(screen.getByRole('button', { name: '+ Nouveau produit' }));
  }

  it('contrôle de confort : erreurs à côté des champs', async () => {
    await ouvrir();
    await userEvent.click(screen.getByRole('button', { name: 'Créer' }));
    expect(screen.getByText('Le code est requis.')).toBeInTheDocument();
    expect(screen.getByText('Saisissez un entier positif, sans décimale.')).toBeInTheDocument();
  });

  it('erreur de l’API à côté du champ, saisie conservée, puis succès après correction', async () => {
    await ouvrir();
    await userEvent.type(screen.getByLabelText(/Code/), 'SANTE-STD'); // existe déjà
    await userEvent.type(screen.getByLabelText(/Libellé/), 'Doublon');
    await userEvent.type(screen.getByLabelText(/Prix unitaire/), '30000');
    await userEvent.click(screen.getByRole('button', { name: 'Créer' }));

    expect(await screen.findByText('Ce code existe déjà.')).toBeInTheDocument(); // message du champ renvoyé par l'API
    expect(screen.getByLabelText(/Libellé/)).toHaveValue('Doublon'); // saisie conservée
    expect(screen.getByLabelText(/Prix unitaire/)).toHaveValue('30000');

    await userEvent.clear(screen.getByLabelText(/Code/));
    await userEvent.type(screen.getByLabelText(/Code/), 'NOUVEAU-1');
    await userEvent.click(screen.getByRole('button', { name: 'Créer' }));
    expect(await screen.findByText('NOUVEAU-1')).toBeInTheDocument(); // la liste a été rechargée
  });
});
