import { useCallback, useRef, useState } from 'react';
import { ErreurApi } from './erreurs';

/** Clé à envoyer dans l'en-tête Idempotency-Key d'une action financière. */
export const genererCleIdempotence = (): string => crypto.randomUUID();

/**
 * Enveloppe une action financière (vente, financement, retrait, approbation, transaction) :
 * - la clé est générée UNE fois par action ;
 * - un deuxième clic pendant l'envoi est ignoré (et `occupe` désactive le bouton) ;
 * - après un réseau coupé ou une erreur serveur, le nouvel essai réutilise la MÊME clé ;
 * - après un succès, ou un refus de l'API (4xx : rien n'a été fait), la clé suivante est nouvelle.
 *
 * Usage :
 *   const { executer, occupe } = useActionFinanciere((cle) => appeler('POST', route, { corps, cleIdempotence: cle }));
 *   <Button disabled={occupe} onClick={() => void executer()}>Approuver</Button>
 */
export function useActionFinanciere<A extends unknown[], R>(action: (cle: string, ...args: A) => Promise<R>) {
  const cle = useRef<string | null>(null);
  const enCours = useRef(false); // garde synchrone : le double clic est capté avant le prochain rendu
  const [occupe, setOccupe] = useState(false);

  const executer = useCallback(
    async (...args: A): Promise<R | undefined> => {
      if (enCours.current) return undefined;
      enCours.current = true;
      setOccupe(true);
      cle.current ??= genererCleIdempotence();
      try {
        const resultat = await action(cle.current, ...args);
        cle.current = null;
        return resultat;
      } catch (e) {
        const refusParApi = e instanceof ErreurApi && e.statusCode >= 400 && e.statusCode < 500 && e.statusCode !== 409;
        if (refusParApi) cle.current = null;
        throw e;
      } finally {
        enCours.current = false;
        setOccupe(false);
      }
    },
    [action],
  );

  return { executer, occupe };
}
