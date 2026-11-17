import { EmptyState, PageHeader } from '@/components';

export function PageAVenir({ titre }: { titre: string }) {
  return (
    <>
      <PageHeader titre={titre} />
      <div className="card"><EmptyState titre="Écran à venir" indication="Cette rubrique du menu n’a pas encore d’écran. Voir docs/ajouter-un-ecran.md." /></div>
    </>
  );
}
