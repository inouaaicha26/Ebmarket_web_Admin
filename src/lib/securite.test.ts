import { describe, expect, it } from 'vitest';
import { peutApprouver } from './securite';

describe('peutApprouver (Maker-Checker)', () => {
  it('refuse d’approuver sa propre opération', () => {
    expect(peutApprouver('awa', 'awa')).toBe(false);
  });
  it('autorise un autre utilisateur', () => {
    expect(peutApprouver('awa', 'paul')).toBe(true);
  });
});
