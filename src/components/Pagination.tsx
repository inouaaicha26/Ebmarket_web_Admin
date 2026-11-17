import { Button } from './Button';
import { formaterNombre } from '@/lib/formatage';

type Props = { page: number; taille: number; totalCount: number; onChange: (page: number) => void };

/** Pagination alimentée par les champs page / taille / totalCount de l'enveloppe (guide v4 §2). */
export function Pagination({ page, taille, totalCount, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(totalCount / taille));
  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="muted">{formaterNombre(totalCount)} résultat{totalCount > 1 ? 's' : ''} — page {page} sur {pages}</span>
      <span className="pagination-actions">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Précédent</Button>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Suivant</Button>
      </span>
    </nav>
  );
}
