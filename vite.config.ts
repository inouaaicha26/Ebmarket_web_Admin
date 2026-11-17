import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { pluginServeurSimule } from './mock/plugin';

/**
 * - `npm run dev`      : le navigateur appelle /api sur le port 3000, Vite transmet à la vraie API.
 * - `npm run dev:mock` : le serveur simulé (dossier mock/) répond à la place de l'API.
 * Le port 3000 est celui du lien du mail d'invitation (http://localhost:3000/invitation?jeton=...).
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const simule = mode === 'mock';
  return {
    plugins: [react(), ...(simule ? [pluginServeurSimule()] : [])],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      port: 3000,
      strictPort: true,
      proxy: simule ? undefined : { '/api': { target: env.VITE_API_PROXY_TARGET || 'http://localhost:5122', changeOrigin: true } },
    },
  };
});
