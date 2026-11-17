/** Adresse de l'API : toujours lue depuis la configuration, jamais écrite en dur (guide v4 §2). */
export const URL_API: string = import.meta.env.VITE_API_URL ?? '';

/** Toutes les routes de l'API commencent par /api/v1. */
export const PREFIXE_API = '/api/v1';

export const urlRoute = (chemin: string): string => `${URL_API}${PREFIXE_API}${chemin}`;
