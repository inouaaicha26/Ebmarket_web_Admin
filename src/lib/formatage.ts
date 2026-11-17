/** Formatage d'affichage (guide v4 §5) : XAF sans décimale, dates jj/mm/aaaa à l'heure de Douala. */

const ESPACE_INSECABLE = ' ';
const FUSEAU_DOUALA = 'Africa/Douala';
const ABSENT = '—';

/** 1000000 → « 1 000 000 » (séparateur de milliers = espace insécable, sans décimale). */
export function formaterNombre(valeur: number): string {
  if (!Number.isFinite(valeur)) return ABSENT;
  const entier = Math.round(valeur);
  const chiffres = String(Math.abs(entier)).replace(/\B(?=(\d{3})+(?!\d))/g, ESPACE_INSECABLE);
  return entier < 0 ? `-${chiffres}` : chiffres;
}

/** 1000000 → « 1 000 000 XAF ». Le franc CFA n'a pas de décimales. */
export function formaterMontantXAF(montant: number): string {
  if (!Number.isFinite(montant)) return ABSENT;
  return `${formaterNombre(montant)}${ESPACE_INSECABLE}XAF`;
}

function partiesDate(iso: string): Record<string, string> | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const formateur = new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU_DOUALA,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parties: Record<string, string> = {};
  for (const p of formateur.formatToParts(date)) parties[p.type] = p.value;
  return parties;
}

/** « 2026-12-17T10:00:00Z » → « 17/12/2026 » (jour calculé à l'heure de Douala). */
export function formaterDate(iso: string | null | undefined): string {
  const p = iso ? partiesDate(iso) : null;
  return p ? `${p.day}/${p.month}/${p.year}` : ABSENT;
}

/** « 2026-12-17T10:00:00Z » → « 17/12/2026 11:00 » (heure de Douala, UTC+1). */
export function formaterDateHeure(iso: string | null | undefined): string {
  const p = iso ? partiesDate(iso) : null;
  return p ? `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}` : ABSENT;
}
