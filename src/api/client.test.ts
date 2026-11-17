import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appeler, enregistrerSurSessionInvalide } from './client';
import { ErreurApi } from './erreurs';
import { effacerJetons, memoriserJetons } from '@/auth/jetons';

function repondre(statut: number, corps: unknown, entetes: Record<string, string> = {}) {
  const fetchSimule = vi.fn(async () => new Response(typeof corps === 'string' ? corps : JSON.stringify(corps), { status: statut, headers: { 'Content-Type': 'application/json', ...entetes } }));
  vi.stubGlobal('fetch', fetchSimule);
  return fetchSimule;
}

const base = { success: true, statusCode: 200, code: null, message: null, data: null, totalCount: null, page: null, taille: null, errors: null, correlationId: 'c-1' };

beforeEach(() => effacerJetons());
afterEach(() => {
  vi.unstubAllGlobals();
  enregistrerSurSessionInvalide(null);
});

describe('appeler — succès', () => {
  it('déballe l’enveloppe une seule fois (data, pagination, Location)', async () => {
    repondre(201, { ...base, statusCode: 201, data: { code: 'X' }, totalCount: 27, page: 2, taille: 10 }, { Location: '/api/v1/produits/X' });
    const r = await appeler<{ code: string }>('POST', '/produits', { corps: { code: 'X' } });
    expect(r).toEqual({ data: { code: 'X' }, totalCount: 27, page: 2, taille: 10, correlationId: 'c-1', location: '/api/v1/produits/X' });
  });

  it('construit l’URL depuis la configuration et ignore les paramètres vides', async () => {
    const f = repondre(200, { ...base, data: [] });
    await appeler('GET', '/produits', { requete: { page: 1, taille: 10, q: '', autre: undefined } });
    expect((f.mock.calls[0] as unknown as [string])[0]).toBe('/api/v1/produits?page=1&taille=10');
  });

  it('ajoute le jeton et la clé d’idempotence quand ils existent', async () => {
    memoriserJetons('acces-1', 'rafraichissement-1');
    const f = repondre(200, { ...base });
    await appeler('POST', '/retraits', { corps: {}, cleIdempotence: 'cle-42' });
    const entetes = (f.mock.calls[0] as unknown as [string, RequestInit])[1].headers as Record<string, string>;
    expect(entetes.Authorization).toBe('Bearer acces-1');
    expect(entetes['Idempotency-Key']).toBe('cle-42');
  });

  it('n’envoie aucun en-tête d’autorisation sans session', async () => {
    const f = repondre(200, { ...base });
    await appeler('GET', '/produits');
    const entetes = (f.mock.calls[0] as unknown as [string, RequestInit])[1].headers as Record<string, string>;
    expect(entetes.Authorization).toBeUndefined();
  });
});

describe('appeler — erreurs', () => {
  it('lit le code, traduit en français, garde le correlationId et les erreurs par champ', async () => {
    repondre(400, { ...base, success: false, statusCode: 400, code: 'E-SYS-01', message: 'Validation failed', errors: [{ field: 'code', message: 'Requis' }], correlationId: 'c-9' });
    const e = await appeler('POST', '/produits').catch((x: unknown) => x);
    expect(e).toBeInstanceOf(ErreurApi);
    const err = e as ErreurApi;
    expect(err.code).toBe('E-SYS-01');
    expect(err.message).toContain('informations saisies sont invalides'); // message français, pas celui de l’API
    expect(err.erreursChamps).toEqual({ code: 'Requis' });
    expect(err.correlationId).toBe('c-9');
  });

  it('traite un 200 avec success à false comme une erreur', async () => {
    repondre(200, { ...base, success: false, code: 'E-SYS-07' });
    await expect(appeler('GET', '/x')).rejects.toBeInstanceOf(ErreurApi);
  });

  it('404 : message « introuvable », sans en dire plus', async () => {
    repondre(404, { ...base, success: false, statusCode: 404, code: 'E-XXX-01' });
    await expect(appeler('GET', '/clients/42')).rejects.toMatchObject({ statusCode: 404, message: 'Élément introuvable.' });
  });

  it('serveur injoignable : statut 0 et message français', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(appeler('GET', '/x')).rejects.toMatchObject({ statusCode: 0, message: expect.stringContaining('injoignable') as unknown });
  });

  it('réponse non JSON (ex. 502) : erreur propre', async () => {
    repondre(502, '<html>Bad gateway</html>');
    await expect(appeler('GET', '/x')).rejects.toMatchObject({ statusCode: 502 });
  });
});

describe('appeler — session expirée', () => {
  it('un 401 renvoie à la connexion', async () => {
    const rappel = vi.fn();
    enregistrerSurSessionInvalide(rappel);
    repondre(401, { ...base, success: false, statusCode: 401, code: 'E-SYS-06' });
    await expect(appeler('GET', '/espace/utilisateurs')).rejects.toBeInstanceOf(ErreurApi);
    expect(rappel).toHaveBeenCalledTimes(1);
  });

  it('un 401 sur une route publique (mauvais mot de passe) ne déconnecte pas', async () => {
    const rappel = vi.fn();
    enregistrerSurSessionInvalide(rappel);
    repondre(401, { ...base, success: false, statusCode: 401 });
    await expect(appeler('POST', '/public/sessions')).rejects.toBeInstanceOf(ErreurApi);
    expect(rappel).not.toHaveBeenCalled();
  });

  it('un 403 E-IAM-09 ne déconnecte pas', async () => {
    const rappel = vi.fn();
    enregistrerSurSessionInvalide(rappel);
    repondre(403, { ...base, success: false, statusCode: 403, code: 'E-IAM-09' });
    await expect(appeler('GET', '/espace/profil')).rejects.toMatchObject({ code: 'E-IAM-09' });
    expect(rappel).not.toHaveBeenCalled();
  });
});
