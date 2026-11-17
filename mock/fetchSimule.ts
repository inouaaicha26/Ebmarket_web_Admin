import { traiterRequeteSimulee } from './traitement';

/** Remplace `fetch` dans les tests d'écran : appelle le serveur simulé et renvoie une vraie Response. */
export async function fetchSimule(entree: string | URL | Request, init?: RequestInit): Promise<Response> {
  const texte = typeof entree === 'string' ? entree : entree instanceof URL ? entree.toString() : entree.url;
  const chemin = texte.replace(/^.*?\/api\/v1/, '');
  const corps: unknown = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
  const r = traiterRequeteSimulee(init?.method ?? 'GET', chemin, corps);
  return new Response(JSON.stringify(r.corps), { status: r.statut, headers: { 'Content-Type': 'application/json', ...r.entetes } });
}
