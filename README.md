# ebmarket-web-admin

Squelette du back-office web eBMarket : React 18, TypeScript strict, Vite, ESLint (aucun `any`), Vitest.
Conforme au guide de développement v4 (parties 2 à 6 et 9). Référence visuelle : `08_MAQUETTE/ebmarket.html`.

## Démarrage

```bash
npm install
npm run dev:mock     # serveur simulé : aucune API nécessaire  → http://localhost:3000
npm run dev          # vraie API : /api est transmis à http://localhost:5122 (proxy de Vite)
```

Le port **3000** est celui du lien du mail d'invitation (`http://localhost:3000/invitation?jeton=...`).

Connexion en mode simulé (comptes de test en `.test` uniquement, mot de passe au choix, `mauvais` = refus) :

| Identifiant | Résultat |
|---|---|
| `awa@assurplus.test` | espace entreprise |
| `admin.plateforme@ebmarket.test` | administration eBMarket |
| `double@ebmarket.test` | écran de choix entre les deux |

## Commandes

| Commande | Effet |
|---|---|
| `npm run verifier` | tout ce que la CI exécute : lint, typecheck, tests, build |
| `npm run lint` · `typecheck` · `test` · `build` | chaque étape séparément |

## Structure

```
mock/                  serveur simulé (mêmes enveloppes que la vraie API)
src/api/               couche d'accès UNIQUE : client (enveloppe), erreurs en français, idempotence,
                       routes-provisoires.ts, types-reponses.ts
src/auth/              session, jetons (en mémoire), session simulée / session API
src/compte/            connexion, choix du contexte (invitation et MFA : sprint 2)
src/components/        tableau, pagination, formulaire, badge de statut, états, fenêtre
src/hooks/             useRequete (chargement / erreur / données)
src/layout/            coque : menu, bandeau, déconnexion
src/lib/               formatage (XAF, dates de Douala), sécurité (Maker-Checker)
src/nav/menu.ts        menu repris de la maquette, filtré par contexte et permissions
src/app/               routeur et registre des écrans (ecrans.tsx)
src/rubriques/         UN DOSSIER PAR RUBRIQUE de la maquette, un sous-dossier par écran
docs/                  ajouter-un-ecran, decisions, connexion-reelle, decoupage-pr
```

## Les règles, là où elles sont appliquées

| Règle du guide | Où |
|---|---|
| Adresse de l'API depuis la configuration | `src/api/config.ts`, `.env.example` |
| Une seule couche d'accès, enveloppe traitée une fois | `src/api/client.ts` |
| Erreurs lues par leur code, message français, `correlationId` gardé | `src/api/erreurs.ts`, `ErrorState` |
| Types écrits à la main, un seul fichier | `src/api/types-reponses.ts` |
| Routes provisoires dans un seul fichier | `src/api/routes-provisoires.ts` |
| Pas d'identifiant d'entreprise envoyé | aucun paramètre d'entreprise dans `appeler` : elle vient du jeton |
| Idempotency-Key, bouton désactivé au 1er clic | `src/api/idempotence.ts` (`useActionFinanciere`) |
| 401 → connexion ; 403 E-IAM-09 sans déconnexion | `client.ts`, `AuthProvider.tsx` |
| Jetons jamais en clair ni dans localStorage | `src/auth/jetons.ts` (mémoire) |
| Aucune donnée personnelle dans la console | ESLint : `no-console` |
| Quatre états par écran | `useRequete` + `BlocRequete` |
| XAF sans décimale, dates jj/mm/aaaa à Douala | `src/lib/formatage.ts` |
| Maker ≠ Checker | `src/lib/securite.ts` (confort : l'API refuse) |
| Aucun `any` | ESLint : `no-explicit-any` |

## Git

Une branche par tâche, nommée `feat/bo-...` (`fix/`, `chore/`, `docs/` pour les autres types).
Commits : `feat: ajoute ...` (type, deux-points, une phrase en français). Demandes de fusion de moins de 400 lignes,
relues par un autre membre. Voir `docs/decoupage-pr.md`.
