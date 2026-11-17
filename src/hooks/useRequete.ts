import { useCallback, useEffect, useRef, useState } from 'react';
import type { Reponse } from '@/api/client';
import { ErreurApi } from '@/api/erreurs';

export type EtatRequete<T> =
  | { statut: 'chargement' }
  | { statut: 'erreur'; erreur: ErreurApi }
  | { statut: 'ok'; reponse: Reponse<T> };

/**
 * Charge des données et expose les états chargement / erreur / données (le « vide » se décide à l'affichage).
 * `cle` résume les paramètres de la requête : quand elle change, on recharge (ex. `${page}|${recherche}`).
 * Annule la requête précédente si la clé change ou si l'écran se ferme.
 */
export function useRequete<T>(cle: string, appel: (signal: AbortSignal) => Promise<Reponse<T>>) {
  const [etat, setEtat] = useState<EtatRequete<T>>({ statut: 'chargement' });
  const [version, setVersion] = useState(0);
  const appelRef = useRef(appel);

  useEffect(() => {
    appelRef.current = appel;
  });

  useEffect(() => {
    const controle = new AbortController();
    setEtat({ statut: 'chargement' });
    appelRef
      .current(controle.signal)
      .then((reponse) => {
        if (!controle.signal.aborted) setEtat({ statut: 'ok', reponse });
      })
      .catch((e: unknown) => {
        if (controle.signal.aborted) return;
        setEtat({ statut: 'erreur', erreur: e instanceof ErreurApi ? e : new ErreurApi(0, null, 'Une erreur est survenue.') });
      });
    return () => controle.abort();
  }, [cle, version]);

  const recharger = useCallback(() => setVersion((v) => v + 1), []);
  return { etat, recharger };
}
