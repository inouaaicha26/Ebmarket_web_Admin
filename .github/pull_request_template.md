## Tâche et fiche
Tâche du tableau : <lien>
Fiche de spécification : SF-xxx

## Ce que fait cette demande
<une ou deux phrases>

## Liste de contrôle du relecteur (guide v4, partie 11)
- [ ] La demande cite la tâche du tableau et la fiche de spécification
- [ ] Les appels passent par `appeler` ; les types écrits à la main sont dans `api/types-reponses.ts`
- [ ] Aucun secret, jeton ou donnée personnelle (code, configuration, journaux)
- [ ] Aucun identifiant d'entreprise envoyé pour choisir les données
- [ ] Actions financières : clé d'idempotence et bouton désactivé au premier clic
- [ ] Erreurs lues par leur code, affichées en français, `correlationId` conservé
- [ ] Chargement, vide et erreur gérés
- [ ] L'écran ressemble à la maquette
- [ ] CI au vert (`npm run verifier`)
- [ ] Le relecteur a compris ce que fait le code
