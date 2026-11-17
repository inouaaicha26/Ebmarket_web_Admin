/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** Adresse de l'API (vide = même origine, via le proxy de Vite). */
  readonly VITE_API_URL?: string;
  /** "true" = connexion simulée (mode mock). */
  readonly VITE_SESSION_SIMULEE?: string;
}
