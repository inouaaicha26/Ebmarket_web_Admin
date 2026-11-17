import type { ErreurChamp } from './enveloppe';

/** Erreur normalisée : tous les écrans reçoivent la même forme. */
export class ErreurApi extends Error {
  constructor(
    /** Statut HTTP (0 = serveur injoignable). */
    public readonly statusCode: number,
    /** Code fonctionnel, par exemple E-SYS-01. null si l'API n'en a pas donné. */
    public readonly code: string | null,
    /** Message en français, prêt à afficher. */
    message: string,
    /** Messages par champ (clé = chemin du champ), à afficher à côté du champ. */
    public readonly erreursChamps: Record<string, string> = {},
    /** À conserver pour le signalement. */
    public readonly correlationId: string | null = null,
  ) {
    super(message);
    this.name = 'ErreurApi';
  }
}

/** Messages selon le CODE reçu (jamais selon le message de l'API). Seuls les codes documentés dans le guide v4 sont listés. */
const MESSAGES_PAR_CODE: Record<string, string> = {
  'E-SYS-01': 'Certaines informations saisies sont invalides. Corrigez les champs signalés.',
  'E-SYS-06': 'Votre session a expiré. Reconnectez-vous.',
  'E-SYS-07': 'Cet élément a été modifié entre-temps par quelqu’un d’autre. Il a été rechargé : refaites votre modification.',
  'E-IAM-08': 'Votre session a été fermée par sécurité. Reconnectez-vous.',
  'E-IAM-09': 'Vous n’avez aucun rôle actif dans ce contexte.',
  'E-IAM-12': 'Votre session n’est plus valide. Reconnectez-vous.',
};

function messageParStatut(statusCode: number): string {
  if (statusCode === 0) return 'Serveur injoignable. Vérifiez votre connexion puis réessayez.';
  if (statusCode === 400) return 'La demande est invalide.';
  if (statusCode === 401) return 'Votre session a expiré. Reconnectez-vous.';
  if (statusCode === 403) return 'Vous n’avez pas le droit d’effectuer cette action.';
  if (statusCode === 404) return 'Élément introuvable.';
  if (statusCode === 409) return 'Conflit : l’élément a changé entre-temps. Rechargez puis réessayez.';
  if (statusCode >= 500) return 'Le serveur a rencontré un problème. Réessayez dans un instant.';
  return 'Une erreur est survenue.';
}

export function messageFrancais(statusCode: number, code: string | null): string {
  return (code && MESSAGES_PAR_CODE[code]) || messageParStatut(statusCode);
}

export function champsEnRecord(erreurs: ErreurChamp[] | null | undefined): Record<string, string> {
  const resultat: Record<string, string> = {};
  for (const e of erreurs ?? []) if (!(e.field in resultat)) resultat[e.field] = e.message;
  return resultat;
}

export const estConflitModification = (e: unknown): boolean => e instanceof ErreurApi && e.statusCode === 409 && e.code === 'E-SYS-07';
export const estAccesRefuseSansRole = (e: unknown): boolean => e instanceof ErreurApi && e.statusCode === 403 && e.code === 'E-IAM-09';
