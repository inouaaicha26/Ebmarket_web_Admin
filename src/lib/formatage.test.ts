import { describe, expect, it } from 'vitest';
import { formaterDate, formaterDateHeure, formaterMontantXAF, formaterNombre } from './formatage';

// On remplace l'espace insécable par une espace normale pour que les attendus restent lisibles.
const lisible = (s: string) => s.replace(/\u00A0/g, ' ');

describe('formaterNombre', () => {
  it('sépare les milliers sans décimale', () => {
    expect(lisible(formaterNombre(1000000))).toBe('1 000 000');
    expect(lisible(formaterNombre(47000))).toBe('47 000');
    expect(formaterNombre(999)).toBe('999');
    expect(formaterNombre(0)).toBe('0');
  });
  it('arrondit : le franc CFA n’a pas de décimales', () => {
    expect(formaterNombre(2500.4)).toBe('2' + '\u00A0' + '500');
  });
  it('gère les négatifs et les valeurs invalides', () => {
    expect(lisible(formaterNombre(-12500))).toBe('-12 500');
    expect(formaterNombre(Number.NaN)).toBe('—');
  });
});

describe('formaterMontantXAF', () => {
  it('reprend les montants de démonstration du brief', () => {
    expect(lisible(formaterMontantXAF(1000000))).toBe('1 000 000 XAF');
    expect(lisible(formaterMontantXAF(50000))).toBe('50 000 XAF');
    expect(lisible(formaterMontantXAF(2500))).toBe('2 500 XAF');
    expect(lisible(formaterMontantXAF(500))).toBe('500 XAF');
    expect(lisible(formaterMontantXAF(47000))).toBe('47 000 XAF');
  });
});

describe('dates à l’heure de Douala (UTC+1)', () => {
  it('affiche jour/mois/année', () => {
    expect(formaterDate('2026-12-17T10:00:00Z')).toBe('17/12/2026');
  });
  it('passe au jour suivant quand Douala a déjà changé de jour', () => {
    expect(formaterDate('2026-12-17T23:30:00Z')).toBe('18/12/2026');
    expect(formaterDateHeure('2026-12-17T23:30:00Z')).toBe('18/12/2026 00:30');
  });
  it('ajoute l’heure de Douala', () => {
    expect(formaterDateHeure('2026-12-17T10:00:00Z')).toBe('17/12/2026 11:00');
  });
  it('affiche un tiret si la date est absente ou invalide', () => {
    expect(formaterDate(null)).toBe('—');
    expect(formaterDate('pas une date')).toBe('—');
    expect(formaterDateHeure(undefined)).toBe('—');
  });
});
