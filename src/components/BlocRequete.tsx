import type { ReactNode } from 'react';
import type { EtatRequete } from '@/hooks/useRequete';
import { EmptyState, ErrorState, LoadingState } from './States';

type Props<T> = {
  etat: EtatRequete<T>;
  onRetry: () => void;
  /** Vrai si la donnée est « vide » (affiche l'état vide). Par défaut : tableau vide. */
  estVide?: (donnees: T) => boolean;
  vide?: ReactNode;
  children: (donnees: T, etat: Extract<EtatRequete<T>, { statut: 'ok' }>) => ReactNode;
};

/**
 * Gère les 3 premiers états d'un écran (chargement, erreur, vide) ; l'écran n'écrit que le cas « données ».
 */
export function BlocRequete<T>({ etat, onRetry, estVide = (d) => Array.isArray(d) && d.length === 0, vide, children }: Props<T>) {
  if (etat.statut === 'chargement') return <LoadingState />;
  if (etat.statut === 'erreur') return <ErrorState erreur={etat.erreur} onRetry={onRetry} />;
  if (estVide(etat.reponse.data)) return <>{vide ?? <EmptyState />}</>;
  return <>{children(etat.reponse.data, etat)}</>;
}
