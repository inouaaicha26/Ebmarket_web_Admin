# Découpage en demandes de fusion

Le guide demande des demandes de fusion de moins de 400 lignes. Le squelette fait environ 2 100 lignes (tests et styles compris) :
on le livre donc en **9 petites demandes, dans cet ordre**, chacune sur sa branche, à partir de la précédente fusionnée.
Chaque branche suit la nomenclature `feat/bo-...` ; chaque commit : `type: phrase en français`.

| N° | Branche | Message de commit | Contenu | Lignes |
|---|---|---|---|---|
| 1 | `feat/bo-socle` | `chore: ajoute le socle Vite, TypeScript strict, ESLint et le serveur simulé` | `package.json`, `tsconfig*.json`, `eslint.config.js`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `.env.example`, `.env.mock`, `.gitignore`, `src/vite-env.d.ts`, `src/test/setup.ts`, `mock/` | 295 |
| 2 | `feat/bo-formatage-securite` | `feat: ajoute le formatage des montants XAF, des dates de Douala et le contrôle Maker-Checker` | `src/lib/` (+ tests) | 116 |
| 3 | `feat/bo-couche-api` | `feat: ajoute la couche d'accès à l'API avec traitement de l'enveloppe et erreurs en français` | `src/api/` sauf `idempotence*`, `src/auth/jetons.ts` (+ tests) | 369 |
| 4 | `feat/bo-idempotence` | `feat: ajoute la clé d'idempotence et la protection du double clic` | `src/api/idempotence.ts` et son test | 109 |
| 5 | `feat/bo-composants-communs` | `feat: ajoute les composants communs et les états chargement, vide et erreur` | `src/components/`, `src/hooks/` (+ tests) | 356 |
| 6 | `feat/bo-session-connexion` | `feat: ajoute la session, la connexion et le choix du contexte` | `src/auth/` (sauf `jetons.ts`), `src/compte/` (+ tests) | 373 |
| 7 | `feat/bo-menu-coque` | `feat: ajoute le menu de la maquette, la coque de l'application et le routage` | `src/nav/`, `src/layout/`, `src/app/`, `src/main.tsx`, `src/styles/` — *dans `src/app/ecrans.tsx`, laisser `ECRANS = {}` pour cette étape* | 328 |
| 8 | `feat/bo-ecran-exemple` | `feat: ajoute l'écran d'exemple des produits sur données simulées` | `src/rubriques/produits-clients/produits/` + la ligne `'produits-clients/produits': lazy(...)` dans `src/app/ecrans.tsx` | 214 |
| 9 | `docs/bo-documentation` | `docs: ajoute le guide pour ajouter un écran et la liste de contrôle de relecture` | `README.md`, `docs/`, `.github/pull_request_template.md` | 195 |

Dossiers vides des autres rubriques (`plateforme`, `entreprise`, `reseau-commercial`, `ventes-commissions`, `paiements`) :
Git ne versionne pas les dossiers vides ; ils apparaissent avec les premiers écrans de chaque rubrique.

## Pour chaque demande
1. `git checkout -b feat/bo-...` (à partir de la branche à jour)
2. copier les fichiers de la ligne du tableau
3. `npm run lint && npm run typecheck && npm test`
4. `git add .` puis `git commit -m "feat: ..."`
5. `git push -u origin feat/bo-...`, ouvrir la demande de fusion, remplir la liste de contrôle, demander une relecture.

Le build complet (`npm run build`) est au vert à partir de la demande 7.
Rien n'est poussé sur la branche principale directement.
