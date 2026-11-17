import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { appeler } from '@/api/client';
import { PageChoixContexte } from '@/compte/PageChoixContexte';
import { PageConnexion } from '@/compte/PageConnexion';
import { AuthProvider, useSession } from './AuthProvider';
import { RequireSession } from './RequireSession';
import { effacerJetons, lireJetonAcces } from './jetons';
import { sessionSimulee } from './sessionSimulee';

function Protegee() {
  const { contexte, fermerSession } = useSession();
  return (
    <>
      <p>Zone protégée — {contexte}</p>
      <button onClick={() => void fermerSession()}>Quitter</button>
      <button onClick={() => void appeler('GET', '/espace/profil').catch(() => undefined)}>Appel</button>
    </>
  );
}

function monter() {
  return render(
    <AuthProvider fournisseur={sessionSimulee}>
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path="/connexion" element={<PageConnexion />} />
          <Route path="/contexte" element={<PageChoixContexte />} />
          <Route element={<RequireSession />}><Route path="/" element={<Protegee />} /><Route path="/secret" element={<Protegee />} /></Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

afterEach(() => {
  effacerJetons();
  vi.unstubAllGlobals();
});

describe('connexion (session simulée)', () => {
  it('sans session, renvoie à la connexion', async () => {
    monter();
    expect(await screen.findByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  it('signale les champs vides à côté des champs', async () => {
    monter();
    await userEvent.click(await screen.findByRole('button', { name: 'Se connecter' }));
    expect(screen.getByText('Saisissez votre e-mail ou votre téléphone.')).toBeInTheDocument();
    expect(screen.getByText('Saisissez votre mot de passe.')).toBeInTheDocument();
  });

  it('un mauvais mot de passe affiche l’erreur et conserve la saisie', async () => {
    monter();
    await userEvent.type(await screen.findByLabelText(/E-mail ou téléphone/), 'awa@assurplus.test');
    await userEvent.type(screen.getByLabelText(/Mot de passe/), 'mauvais');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Identifiant ou mot de passe incorrect.');
    expect(screen.getByLabelText(/E-mail ou téléphone/)).toHaveValue('awa@assurplus.test');
  });

  it('un compte à un seul contexte entre directement', async () => {
    monter();
    await userEvent.type(await screen.findByLabelText(/E-mail ou téléphone/), 'awa@assurplus.test');
    await userEvent.type(screen.getByLabelText(/Mot de passe/), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(await screen.findByText('Zone protégée — ESPACE')).toBeInTheDocument();
    expect(lireJetonAcces()).not.toBeNull();
  });

  it('un compte à deux contextes passe par l’écran de choix', async () => {
    monter();
    await userEvent.type(await screen.findByLabelText(/E-mail ou téléphone/), 'double@ebmarket.test');
    await userEvent.type(screen.getByLabelText(/Mot de passe/), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    await userEvent.click(await screen.findByRole('button', { name: /Administration eBMarket/ }));
    expect(await screen.findByText('Zone protégée — PLATEFORME')).toBeInTheDocument();
  });

  it('la déconnexion efface les jetons et revient à la connexion', async () => {
    monter();
    await userEvent.type(await screen.findByLabelText(/E-mail ou téléphone/), 'awa@assurplus.test');
    await userEvent.type(screen.getByLabelText(/Mot de passe/), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Quitter' }));
    expect(await screen.findByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
    expect(lireJetonAcces()).toBeNull();
  });

  it('un 401 de l’API renvoie à la connexion avec un message d’expiration', async () => {
    monter();
    await userEvent.type(await screen.findByLabelText(/E-mail ou téléphone/), 'awa@assurplus.test');
    await userEvent.type(screen.getByLabelText(/Mot de passe/), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: false, statusCode: 401, code: 'E-SYS-06' }), { status: 401 })));
    await userEvent.click(await screen.findByRole('button', { name: 'Appel' }));
    expect(await screen.findByText('Votre session a expiré. Reconnectez-vous.')).toBeInTheDocument();
    expect(lireJetonAcces()).toBeNull();
  });
});
