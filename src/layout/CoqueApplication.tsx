import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/auth/AuthProvider';
import { cheminElement, menuVisible, trouverElement } from '@/nav/menu';
import { Button } from '@/components/Button';

/** Barre latérale (menu), bandeau du haut (fil d'Ariane, utilisateur, déconnexion) et zone de contenu. */
export function CoqueApplication() {
  const { nom, contexte, fermerSession, peutVoir } = useSession();
  const [ouvert, setOuvert] = useState(false);
  const { pathname } = useLocation();
  const groupes = menuVisible(contexte, peutVoir);
  const courant = trouverElement(pathname);

  return (
    <div className="app">
      <aside className={`sidebar ${ouvert ? 'on' : ''}`} aria-label="Navigation principale">
        <div className="brand">eBMarket</div>
        <nav>
          {groupes.map((g) => (
            <div key={g.libelle}>
              <div className="nav-group">{g.libelle}</div>
              {g.elements.map((e) => (
                <NavLink key={e.cle} to={cheminElement(g, e)} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setOuvert(false)}>
                  <span className="dot" aria-hidden="true" />{e.libelle}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="burger" onClick={() => setOuvert((v) => !v)} aria-label="Menu" aria-expanded={ouvert}>☰</button>
          <div className="crumb">{courant ? `${courant.groupe.libelle} › ${courant.element.libelle}` : 'Détail'}</div>
          <span className="avatar" aria-hidden="true">{nom.charAt(0)}</span>
          <span className="user-name">{nom}{contexte ? ` · ${contexte === 'PLATEFORME' ? 'Plateforme' : 'Entreprise'}` : ''}</span>
          <Button variant="secondary" size="sm" onClick={() => void fermerSession()}>Déconnexion</Button>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
