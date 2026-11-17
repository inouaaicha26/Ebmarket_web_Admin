# Décisions à confirmer

## 1. Stockage des jetons (sécurité — à valider avec David)
Règle du guide : « la méthode retenue par le squelette », jamais localStorage.
**Choix actuel : mémoire uniquement** (`src/auth/jetons.ts`). Aucun stockage navigateur, rien dans l'URL.
- Avantage : un script malveillant ne trouve aucun jeton dans le stockage du navigateur.
- Inconvénient : recharger la page (F5) oblige à se reconnecter.
- Alternative moins sûre : jeton de rafraîchissement dans `sessionStorage` (lisible par tout script de la page).
- Alternative la plus robuste : cookie `HttpOnly` posé par l'API (demande côté backend, hors de notre périmètre).
Changer de méthode ne modifie que `src/auth/jetons.ts`.

## 2. Où va « Espace structure » ?
Présent dans la maquette (plans de redistribution, redistributions), absent de la liste des rubriques.
Placé provisoirement dans `ventes-commissions` (`src/nav/menu.ts`).

## 3. Bibliothèques
Le projet n'utilise que : react, react-dom, react-router-dom (routage) ; en développement : vite, typescript,
eslint, typescript-eslint, eslint-plugin-react-hooks, vitest, jsdom, @testing-library/*.
Aucune autre. Pas de bibliothèque de requêtes ni de style : `useRequete` et le CSS maison suffisent pour l'instant.
Playwright (parcours de démonstration) viendra avec l'accord de l'équipe.

## 4. Format des erreurs
Le contexte collé dans l'IA parle d'erreurs `problem+json` ; le guide v4 (17/11) décrit l'enveloppe commune
avec `errors: [{ field, message }]`. Le squelette suit le guide v4. À confirmer avec Boris.

## 5. Champs de l'enveloppe en succès
Le type `Enveloppe` est tolérant (`code`, `message`… peuvent être null). À resserrer avec une vraie réponse.
