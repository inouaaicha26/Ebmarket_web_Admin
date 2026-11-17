import type { Plugin } from 'vite';
import { traiterRequeteSimulee } from './traitement';

/** Branche le serveur simulé sur /api/v1 pendant `npm run dev:mock` (jamais dans le build de production). */
export function pluginServeurSimule(): Plugin {
  return {
    name: 'ebmarket-serveur-simule',
    apply: 'serve',
    configureServer(serveur) {
      serveur.middlewares.use('/api/v1', (req, res) => {
        let brut = '';
        req.on('data', (morceau: Buffer) => (brut += morceau.toString()));
        req.on('end', () => {
          let corps: unknown;
          try {
            corps = brut ? JSON.parse(brut) : undefined;
          } catch {
            corps = undefined;
          }
          const r = traiterRequeteSimulee(req.method ?? 'GET', req.url ?? '/', corps);
          // Petit délai pour voir l'état « chargement ».
          setTimeout(() => {
            res.statusCode = r.statut;
            res.setHeader('Content-Type', 'application/json');
            for (const [k, v] of Object.entries(r.entetes)) res.setHeader(k, v);
            res.end(JSON.stringify(r.corps));
          }, 350);
        });
      });
    },
  };
}
