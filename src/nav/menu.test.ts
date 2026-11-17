import { describe, expect, it } from 'vitest';
import { MENU, cheminElement, menuVisible, trouverElement } from './menu';

const toutVoir = () => true;

describe('menuVisible', () => {
  it('l’administration eBMarket ne voit que l’espace plateforme', () => {
    expect(menuVisible('PLATEFORME', toutVoir).map((g) => g.libelle)).toEqual(['Espace plateforme']);
  });
  it('l’entreprise ne voit pas l’espace plateforme', () => {
    const libelles = menuVisible('ESPACE', toutVoir).map((g) => g.libelle);
    expect(libelles).not.toContain('Espace plateforme');
    expect(libelles).toContain('Paiements');
  });
  it('masque les éléments dont la permission manque, et les groupes devenus vides', () => {
    const menu = [{ libelle: 'G', rubrique: 'r', contextes: ['ESPACE' as const], elements: [{ cle: 'a', libelle: 'A', permission: 'p.a' }] }];
    expect(menuVisible('ESPACE', (p) => p !== 'p.a', menu)).toEqual([]);
    expect(menuVisible('ESPACE', () => true, menu)).toHaveLength(1);
  });
  it('sans contexte, rien n’est visible', () => {
    expect(menuVisible(null, toutVoir)).toEqual([]);
  });
});

describe('MENU (repris de la maquette)', () => {
  it('a 7 groupes et des chemins uniques', () => {
    expect(MENU).toHaveLength(7);
    const chemins = MENU.flatMap((g) => g.elements.map((e) => cheminElement(g, e)));
    expect(new Set(chemins).size).toBe(chemins.length);
  });
  it('retrouve un élément par son chemin', () => {
    expect(trouverElement('/produits-clients/produits')?.element.libelle).toBe('Produits');
    expect(trouverElement('/nimporte/quoi')).toBeUndefined();
  });
});
