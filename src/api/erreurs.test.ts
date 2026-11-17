import { describe, expect, it } from 'vitest';
import { ErreurApi, champsEnRecord, estAccesRefuseSansRole, estConflitModification, messageFrancais } from './erreurs';

describe('messageFrancais', () => {
  it('choisit le message selon le CODE', () => {
    expect(messageFrancais(409, 'E-SYS-07')).toContain('modifié entre-temps');
    expect(messageFrancais(403, 'E-IAM-09')).toBe('Vous n’avez aucun rôle actif dans ce contexte.');
    expect(messageFrancais(401, 'E-IAM-08')).toContain('fermée par sécurité');
  });
  it('retombe sur le statut HTTP pour un code inconnu', () => {
    expect(messageFrancais(404, 'E-XXX-99')).toBe('Élément introuvable.');
    expect(messageFrancais(503, null)).toContain('Réessayez');
    expect(messageFrancais(0, null)).toContain('injoignable');
  });
});

describe('champsEnRecord', () => {
  it('garde le premier message de chaque champ, chemins camelCase compris', () => {
    expect(champsEnRecord([{ field: 'lignes[0].quantite', message: 'Trop grande' }, { field: 'lignes[0].quantite', message: 'autre' }])).toEqual({ 'lignes[0].quantite': 'Trop grande' });
    expect(champsEnRecord(null)).toEqual({});
  });
});

describe('détecteurs', () => {
  it('reconnaît 409 E-SYS-07 et 403 E-IAM-09', () => {
    expect(estConflitModification(new ErreurApi(409, 'E-SYS-07', 'x'))).toBe(true);
    expect(estConflitModification(new ErreurApi(409, 'AUTRE', 'x'))).toBe(false);
    expect(estAccesRefuseSansRole(new ErreurApi(403, 'E-IAM-09', 'x'))).toBe(true);
    expect(estAccesRefuseSansRole(new Error('x'))).toBe(false);
  });
});
