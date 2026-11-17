import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErreurApi } from './erreurs';
import { genererCleIdempotence, useActionFinanciere } from './idempotence';

describe('genererCleIdempotence', () => {
  it('produit une clé différente à chaque appel', () => {
    expect(genererCleIdempotence()).not.toBe(genererCleIdempotence());
  });
});

describe('useActionFinanciere', () => {
  it('ignore un deuxième clic pendant l’envoi et désactive le bouton', async () => {
    let terminer: () => void = () => undefined;
    const action = vi.fn(() => new Promise<string>((ok) => (terminer = () => ok('ok'))));
    const { result } = renderHook(() => useActionFinanciere(action));

    let premier: Promise<string | undefined> = Promise.resolve(undefined);
    let second: string | undefined = 'pas appelé';
    await act(async () => {
      premier = result.current.executer();
      second = await result.current.executer(); // double clic
    });
    expect(second).toBeUndefined();
    expect(result.current.occupe).toBe(true);
    expect(action).toHaveBeenCalledTimes(1);

    await act(async () => {
      terminer();
      await premier;
    });
    expect(result.current.occupe).toBe(false);
  });

  it('réutilise la MÊME clé après un réseau coupé, puis en change après un succès', async () => {
    const cles: string[] = [];
    const action = vi.fn(async (cle: string) => {
      cles.push(cle);
      if (cles.length === 1) throw new ErreurApi(0, null, 'réseau');
      return 'ok';
    });
    const { result } = renderHook(() => useActionFinanciere(action));

    await act(async () => { await result.current.executer().catch(() => undefined); });
    await act(async () => { await result.current.executer(); });
    await act(async () => { await result.current.executer(); });

    expect(cles[1]).toBe(cles[0]); // nouvel essai = même clé
    expect(cles[2]).not.toBe(cles[0]); // nouvelle action = nouvelle clé
  });

  it('change de clé après un refus de l’API (rien n’a été fait)', async () => {
    const cles: string[] = [];
    const action = vi.fn(async (cle: string) => {
      cles.push(cle);
      throw new ErreurApi(400, 'E-SYS-01', 'invalide');
    });
    const { result } = renderHook(() => useActionFinanciere(action));
    await act(async () => { await result.current.executer().catch(() => undefined); });
    await act(async () => { await result.current.executer().catch(() => undefined); });
    expect(cles[1]).not.toBe(cles[0]);
  });
});
