/**
 * Circuit Maker-Checker (guide v4 §4) : l'écran ne propose jamais d'approuver
 * une opération que l'utilisateur a lui-même préparée.
 * Ce n'est qu'un confort d'affichage : c'est l'API qui refuse réellement.
 */
export function peutApprouver(idPreparateur: string, idUtilisateurCourant: string): boolean {
  return idPreparateur !== idUtilisateurCourant;
}
