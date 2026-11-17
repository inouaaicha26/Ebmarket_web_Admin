import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from './AuthProvider';

/** Protège les écrans : sans session → /connexion ; session sans contexte choisi → /contexte. */
export function RequireSession() {
  const { statut } = useSession();
  const lieu = useLocation();
  if (statut === 'deconnecte') return <Navigate to="/connexion" replace state={{ depuis: lieu.pathname }} />;
  if (statut === 'choix-contexte') return <Navigate to="/contexte" replace />;
  return <Outlet />;
}
