# Brancher la connexion réelle (sprint 1, 2e tâche)

Le squelette fournit : page de connexion, choix du contexte, jetons en mémoire, déconnexion, expiration (401).
`src/auth/sessionApi.ts` est volontairement incomplet : on n'invente aucun champ.

## Ce qu'il faut recueillir (vraie réponse ou Swagger)
1. Réponse de `POST /api/v1/public/sessions` : nom du champ « statut » (CONNECTE / MFA_REQUISE), `jetonMfa`,
   jeton d'accès, jeton de rafraîchissement, liste des contextes, `mfaAConfigurer`.
2. Corps et réponse de `POST /api/v1/public/sessions/mfa` (méthode TOTP / SMS / CODE_SECOURS, code).
3. Corps et réponse de `POST /api/v1/public/sessions/jeton` (jeton de rafraîchissement, contexte, espace).
4. Corps de `POST /api/v1/compte/deconnexion`.

## Où coder
- Types : `src/api/types-reponses.ts` (à partir de réponses RÉELLES).
- Appels : `src/auth/sessionApi.ts` (`ouvrir`, `choisirContexte`) ; mémoriser les jetons avec `memoriserJetons`,
  en gardant toujours le DERNIER jeton de rafraîchissement (un ancien ferme la session, E-IAM-08).
- Étape MFA : ajouter une page `src/compte/PageMfa.tsx` et une étape dans `AuthProvider`.
- Ne jamais écrire un jeton ou un mot de passe dans la console ni dans le code.

## Pour tester sur la vraie API
Lancer l'API (guide, partie 12), puis `npm run dev`. Comptes de test en `.test` uniquement.
Laisser `SmtpSettings__Server` vide côté API pour que les e-mails soient déposés en fichiers.
