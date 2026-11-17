import type { ReactNode } from 'react';

export type Colonne<Ligne> = {
  titre: string;
  cellule: (ligne: Ligne) => ReactNode;
  /** Montants et nombres : alignés à droite. */
  alignement?: 'gauche' | 'droite';
};

type Props<Ligne> = {
  colonnes: Colonne<Ligne>[];
  lignes: Ligne[];
  cle: (ligne: Ligne) => string;
  /** Texte lu par les lecteurs d'écran. */
  legende: string;
  onClicLigne?: (ligne: Ligne) => void;
};

export function DataTable<Ligne>({ colonnes, lignes, cle, legende, onClicLigne }: Props<Ligne>) {
  return (
    <div className="table-wrap">
      <table className="table">
        <caption className="sr-only">{legende}</caption>
        <thead>
          <tr>
            {colonnes.map((c) => (
              <th key={c.titre} scope="col" className={c.alignement === 'droite' ? 'right' : undefined}>{c.titre}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr
              key={cle(ligne)}
              className={onClicLigne ? 'clickable' : undefined}
              onClick={onClicLigne ? () => onClicLigne(ligne) : undefined}
              onKeyDown={onClicLigne ? (e) => e.key === 'Enter' && onClicLigne(ligne) : undefined}
              tabIndex={onClicLigne ? 0 : undefined}
            >
              {colonnes.map((c) => (
                <td key={c.titre} className={c.alignement === 'droite' ? 'right' : undefined}>{c.cellule(ligne)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
