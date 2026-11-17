import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BlocRequete, DataTable, EmptyState, ErrorState, FormField, LoadingState, Pagination, StatusBadge, TextInput } from '@/components';
import { ErreurApi } from '@/api/erreurs';

describe('StatusBadge', () => {
  it('affiche un libellé français et une couleur constante', () => {
    render(<StatusBadge statut="DEMANDE_SOUMISE" />);
    expect(screen.getByText('Demande soumise')).toHaveClass('badge-warn');
  });
  it('ne casse pas sur un statut inconnu : texte brut en gris', () => {
    render(<StatusBadge statut="NOUVEAU_STATUT" />);
    expect(screen.getByText('NOUVEAU STATUT')).toHaveClass('badge-grey');
  });
});

describe('DataTable', () => {
  it('affiche les lignes et réagit au clic', async () => {
    const onClic = vi.fn();
    render(<DataTable legende="Test" colonnes={[{ titre: 'Nom', cellule: (l: { id: string }) => l.id }]} lignes={[{ id: 'a' }, { id: 'b' }]} cle={(l) => l.id} onClicLigne={onClic} />);
    await userEvent.click(screen.getByText('b'));
    expect(onClic).toHaveBeenCalledWith({ id: 'b' });
  });
});

describe('Pagination', () => {
  it('affiche le total et change de page', async () => {
    const onChange = vi.fn();
    render(<Pagination page={2} taille={10} totalCount={27} onChange={onChange} />);
    expect(screen.getByText(/27 résultats — page 2 sur 3/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Suivant' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });
  it('désactive Précédent en première page et Suivant en dernière', () => {
    const { rerender } = render(<Pagination page={1} taille={10} totalCount={27} onChange={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Précédent' })).toBeDisabled();
    rerender(<Pagination page={3} taille={10} totalCount={27} onChange={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeDisabled();
  });
});

describe('États', () => {
  it('chargement, vide, erreur', async () => {
    const reessayer = vi.fn();
    render(<><LoadingState /><EmptyState titre="Rien ici" /><ErrorState erreur={new ErreurApi(500, null, 'Panne', {}, 'ref-7')} onRetry={reessayer} /></>);
    expect(screen.getByRole('status')).toHaveTextContent('Chargement');
    expect(screen.getByText('Rien ici')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Panne');
    expect(screen.getByText(/ref-7/)).toBeInTheDocument(); // correlationId conservé pour le signalement
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(reessayer).toHaveBeenCalled();
  });
});

describe('BlocRequete', () => {
  const ok = (data: string[]) => ({ statut: 'ok' as const, reponse: { data, totalCount: null, page: null, taille: null, correlationId: null, location: null } });
  it('affiche chaque état', () => {
    const { rerender } = render(<BlocRequete etat={{ statut: 'chargement' }} onRetry={() => undefined}>{() => <p>données</p>}</BlocRequete>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<BlocRequete etat={{ statut: 'erreur', erreur: new ErreurApi(404, null, 'Élément introuvable.') }} onRetry={() => undefined}>{() => <p>données</p>}</BlocRequete>);
    expect(screen.getByRole('alert')).toHaveTextContent('introuvable');
    rerender(<BlocRequete etat={ok([])} onRetry={() => undefined} vide={<p>liste vide</p>}>{() => <p>données</p>}</BlocRequete>);
    expect(screen.getByText('liste vide')).toBeInTheDocument();
    rerender(<BlocRequete etat={ok(['x'])} onRetry={() => undefined}>{(d) => <p>{d.length} ligne</p>}</BlocRequete>);
    expect(screen.getByText('1 ligne')).toBeInTheDocument();
  });
});

describe('FormField', () => {
  it('relie libellé, champ et message d’erreur', () => {
    render(<FormField label="Code" erreur="Requis">{(p) => <TextInput {...p} />}</FormField>);
    const champ = screen.getByLabelText('Code');
    expect(champ).toHaveAttribute('aria-invalid', 'true');
    expect(champ).toHaveAccessibleDescription('Requis');
  });
});
