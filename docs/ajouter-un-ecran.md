# Ajouter un écran (moins d'une demi-journée)

Modèle à copier : `src/rubriques/produits-clients/produits/` (liste, recherche, pagination, création).

## 1. Créer le dossier de l'écran
Dans la bonne rubrique : `src/rubriques/<rubrique>/<ecran>/` avec
```
api.ts            les appels de l'écran (copier produits/api.ts)
Page<Nom>.tsx     l'écran, `export default` (copier PageProduits.tsx)
Page<Nom>.test.tsx
```

## 2. Les appels à l'API
- Toujours `appeler(...)` de `@/api/client` : jamais `fetch` directement, jamais d'adresse en dur.
- Route déjà livrée : l'écrire dans `api.ts` de l'écran, avec les types de sa réponse dans `src/api/types-reponses.ts`
  (à partir d'une VRAIE réponse, jamais inventés).
- Route pas encore livrée : l'ajouter dans `src/api/routes-provisoires.ts` et dans `mock/traitement.ts`.
- N'envoyez jamais d'identifiant d'entreprise : elle vient du jeton.

## 3. Les quatre états
```tsx
const { etat, recharger } = useRequete(`${page}`, (signal) => lister(page, signal));
<BlocRequete etat={etat} onRetry={recharger} vide={<EmptyState titre="Aucun …" />}>
  {(donnees) => <DataTable … />}
</BlocRequete>
```
Chargement, erreur (message français + référence) et vide sont gérés ; vous n'écrivez que les données.

## 4. Les formulaires
`FormField` + `TextInput` ; erreurs de l'API affichées à côté du champ via `ErreurApi.erreursChamps` ;
la saisie est conservée après une erreur (voir `FormulaireProduit.tsx`). Un 409 `E-SYS-07` : on prévient, on recharge.

## 5. Actions financières (vente, retrait, approbation, paiement)
```tsx
const { executer, occupe } = useActionFinanciere((cle) => appeler('POST', route, { corps, cleIdempotence: cle }));
<Button disabled={occupe} onClick={() => void executer()}>Approuver</Button>
```
Et n'affichez « Approuver » que si `peutApprouver(operation.preparePar, utilisateur.id)` (`src/lib/securite.ts`).

## 6. Brancher l'écran
Une ligne dans `src/app/ecrans.tsx` :
```ts
'reseau-commercial/contrats': lazy(() => import('@/rubriques/reseau-commercial/contrats/PageContrats')),
```
La rubrique existe déjà dans `src/nav/menu.ts` (menu de la maquette). Sinon, ajoutez-la.

## 7. Formats
Montants : `formaterMontantXAF`. Dates : `formaterDate`, `formaterDateHeure` (heure de Douala). Statuts : `<StatusBadge statut="ACTIVE" />`
(nouveau statut = une ligne dans `STATUTS`). Textes en français.

## 8. Tests
Chaque écran est testé contre le serveur simulé, **y compris ses états vide et erreur** (voir `PageProduits.test.tsx`).
Un test neuf doit avoir été vu en échec au moins une fois.

## 9. Avant la demande de fusion
`npm run verifier`, puis la liste de contrôle du relecteur (guide v4, partie 11) : `.github/pull_request_template.md`.
