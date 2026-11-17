import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { enregistrerSurSessionInvalide } from '@/api/client';
import type { ContexteBackOffice } from '@/api/types-reponses';
import type { FournisseurSession } from './fournisseur';
import { effacerJetons } from './jetons';
import { sessionApi } from './sessionApi';
import { sessionSimulee } from './sessionSimulee';

type Etat = {
  statut: 'deconnecte' | 'choix-contexte' | 'connecte';
  nom: string;
  contextes: ContexteBackOffice[];
  contexte: ContexteBackOffice | null;
  permissions: string[];
  /** Pourquoi on est revenu à la connexion (message affiché sur la page). */
  motif: 'expiree' | null;
};

const ETAT_INITIAL: Etat = { statut: 'deconnecte', nom: '', contextes: [], contexte: null, permissions: [], motif: null };

export type Session = Etat & {
  ouvrirSession: (identifiant: string, motDePasse: string) => Promise<void>;
  choisirContexte: (contexte: ContexteBackOffice) => Promise<void>;
  fermerSession: () => Promise<void>;
  /** Confort d'affichage seulement : une action interdite est de toute façon refusée par l'API. */
  peutVoir: (permission?: string) => boolean;
};

const SessionContext = createContext<Session | null>(null);

export function AuthProvider({ children, fournisseur }: { children: ReactNode; fournisseur?: FournisseurSession }) {
  const f = fournisseur ?? (import.meta.env.VITE_SESSION_SIMULEE === 'true' ? sessionSimulee : sessionApi);
  const [etat, setEtat] = useState<Etat>(ETAT_INITIAL);

  // Un 401 de l'API renvoie à la connexion.
  useEffect(() => {
    enregistrerSurSessionInvalide(() => {
      effacerJetons();
      setEtat({ ...ETAT_INITIAL, motif: 'expiree' });
    });
    return () => enregistrerSurSessionInvalide(null);
  }, []);

  const choisirContexte = useCallback(
    async (contexte: ContexteBackOffice) => {
      await f.choisirContexte(contexte);
      setEtat((e) => ({ ...e, statut: 'connecte', contexte, motif: null }));
    },
    [f],
  );

  const ouvrirSession = useCallback(
    async (identifiant: string, motDePasse: string) => {
      const r = await f.ouvrir(identifiant, motDePasse);
      const [seul] = r.contextes;
      if (r.contextes.length === 1 && seul) {
        await f.choisirContexte(seul);
        setEtat({ statut: 'connecte', nom: r.nomAffiche, contextes: r.contextes, contexte: seul, permissions: r.permissions, motif: null });
      } else {
        setEtat({ statut: 'choix-contexte', nom: r.nomAffiche, contextes: r.contextes, contexte: null, permissions: r.permissions, motif: null });
      }
    },
    [f],
  );

  const fermerSession = useCallback(async () => {
    try {
      await f.fermer();
    } catch {
      /* même si l'API ne répond pas, on efface les jetons locaux */
    }
    effacerJetons();
    setEtat(ETAT_INITIAL);
  }, [f]);

  const valeur = useMemo<Session>(
    () => ({ ...etat, ouvrirSession, choisirContexte, fermerSession, peutVoir: (p) => !p || etat.permissions.includes(p) }),
    [etat, ouvrirSession, choisirContexte, fermerSession],
  );
  return <SessionContext.Provider value={valeur}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession doit être utilisé dans <AuthProvider>');
  return ctx;
}
