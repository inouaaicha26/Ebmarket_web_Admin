import type { ReactNode } from 'react';
import { Button } from './Button';
import type { ErreurApi } from '@/api/erreurs';

export function LoadingState({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ titre = 'Aucun résultat', indication, action }: { titre?: string; indication?: string; action?: ReactNode }) {
  return (
    <div className="state">
      <strong>{titre}</strong>
      {indication && <span className="muted">{indication}</span>}
      {action}
    </div>
  );
}

/** Affiche le message français de l'erreur, avec le correlationId à communiquer pour le signalement. */
export function ErrorState({ erreur, message, onRetry }: { erreur?: ErreurApi; message?: string; onRetry?: () => void }) {
  return (
    <div className="state state-error" role="alert">
      <strong>Une erreur est survenue</strong>
      <span>{erreur?.message ?? message ?? 'Erreur inconnue.'}</span>
      {erreur?.correlationId && <small className="muted">Référence à communiquer : {erreur.correlationId}</small>}
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Réessayer</Button>}
    </div>
  );
}
