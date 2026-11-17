import { urlRoute } from './config';
import type { Enveloppe } from './enveloppe';
import { ErreurApi, champsEnRecord, messageFrancais } from './erreurs';
import { lireJetonAcces } from '@/auth/jetons';

/**
 * COUCHE D'ACCÈS UNIQUE à l'API. Tous les écrans passent par `appeler` :
 * l'enveloppe est traitée ici, une seule fois (guide v4 §2).
 * Règles appliquées ici : adresse depuis la config, jeton ajouté automatiquement, Idempotency-Key,
 * erreurs lues par leur CODE, correlationId conservé, aucune donnée écrite dans la console.
 */

export type Methode = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type OptionsAppel = {
  /** Paramètres d'URL (page, taille, recherche…). Jamais d'identifiant d'entreprise : il vient du jeton. */
  requete?: Record<string, string | number | undefined>;
  corps?: unknown;
  /** Obligatoire pour les actions financières : voir useActionFinanciere. */
  cleIdempotence?: string;
  signal?: AbortSignal;
};

export type Reponse<T> = {
  data: T;
  totalCount: number | null;
  page: number | null;
  taille: number | null;
  correlationId: string | null;
  /** En-tête Location d'une création (201). */
  location: string | null;
};

let surSessionInvalide: (() => void) | null = null;
/** Appelé par la session : un 401 (hors routes publiques) renvoie à l'écran de connexion. */
export function enregistrerSurSessionInvalide(rappel: (() => void) | null): void {
  surSessionInvalide = rappel;
}

function construireUrl(chemin: string, requete: OptionsAppel['requete']): string {
  const parametres = new URLSearchParams();
  for (const [cle, valeur] of Object.entries(requete ?? {})) if (valeur !== undefined && valeur !== '') parametres.set(cle, String(valeur));
  const texte = parametres.toString();
  return urlRoute(chemin) + (texte ? `?${texte}` : '');
}

async function lireCorps(reponse: Response): Promise<Enveloppe<unknown> | null> {
  const texte = await reponse.text();
  if (!texte) return null;
  try {
    return JSON.parse(texte) as Enveloppe<unknown>;
  } catch {
    return null;
  }
}

export async function appeler<T>(methode: Methode, chemin: string, options: OptionsAppel = {}): Promise<Reponse<T>> {
  const entetes: Record<string, string> = { Accept: 'application/json' };
  const jeton = lireJetonAcces();
  if (jeton) entetes.Authorization = `Bearer ${jeton}`;
  if (options.corps !== undefined) entetes['Content-Type'] = 'application/json';
  if (options.cleIdempotence) entetes['Idempotency-Key'] = options.cleIdempotence;

  let reponse: Response;
  try {
    reponse = await fetch(construireUrl(chemin, options.requete), {
      method: methode,
      headers: entetes,
      body: options.corps === undefined ? undefined : JSON.stringify(options.corps),
      signal: options.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e; // requête annulée volontairement
    throw new ErreurApi(0, null, messageFrancais(0, null));
  }

  const enveloppe = await lireCorps(reponse);

  if (!reponse.ok || enveloppe?.success === false) {
    const code = enveloppe?.code ?? null;
    if (reponse.status === 401 && !chemin.startsWith('/public/')) surSessionInvalide?.();
    throw new ErreurApi(reponse.status, code, messageFrancais(reponse.status, code), champsEnRecord(enveloppe?.errors), enveloppe?.correlationId ?? null);
  }

  return {
    data: (enveloppe?.data ?? null) as T,
    totalCount: enveloppe?.totalCount ?? null,
    page: enveloppe?.page ?? null,
    taille: enveloppe?.taille ?? null,
    correlationId: enveloppe?.correlationId ?? null,
    location: reponse.headers.get('Location'),
  };
}
