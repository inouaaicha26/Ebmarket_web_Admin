import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useSession } from '@/auth/AuthProvider';
import { RequireSession } from '@/auth/RequireSession';
import { PageChoixContexte } from '@/compte/PageChoixContexte';
import { PageConnexion } from '@/compte/PageConnexion';
import { ErrorState, LoadingState } from '@/components';
import { CoqueApplication } from '@/layout/CoqueApplication';
import { MENU, cheminElement, menuVisible } from '@/nav/menu';
import { ECRANS } from './ecrans';
import { PageAVenir } from './PageAVenir';

function Routage() {
  const { contexte, peutVoir } = useSession();
  const visibles = new Set(menuVisible(contexte, peutVoir).flatMap((g) => g.elements.map((e) => cheminElement(g, e))));
  const accueil = [...visibles][0];

  return (
    <Routes>
      <Route path="/connexion" element={<PageConnexion />} />
      <Route path="/contexte" element={<PageChoixContexte />} />
      <Route element={<RequireSession />}>
        <Route element={<CoqueApplication />}>
          <Route index element={accueil ? <Navigate to={accueil} replace /> : <ErrorState message="Aucune rubrique accessible pour votre profil." />} />
          {MENU.flatMap((g) =>
            g.elements.map((e) => {
              const chemin = cheminElement(g, e);
              const Ecran = ECRANS[`${g.rubrique}/${e.cle}`];
              // Rubrique interdite dans ce contexte : message sans révéler le contenu (l'API refuse de toute façon).
              const contenu = !visibles.has(chemin) ? <ErrorState message="Accès non autorisé." /> : Ecran ? <Suspense fallback={<LoadingState />}><Ecran /></Suspense> : <PageAVenir titre={e.libelle} />;
              return <Route key={chemin} path={chemin} element={contenu} />;
            }),
          )}
          <Route path="*" element={<ErrorState message="Page introuvable." />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routage />
      </BrowserRouter>
    </AuthProvider>
  );
}
