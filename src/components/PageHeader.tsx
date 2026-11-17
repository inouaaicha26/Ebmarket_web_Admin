import type { ReactNode } from 'react';

export function PageHeader({ titre, sousTitre, actions }: { titre: string; sousTitre?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{titre}</h1>
        {sousTitre && <p className="muted">{sousTitre}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
