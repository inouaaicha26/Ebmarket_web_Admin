import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';

const LIBELLES = {
  ESPACE: { titre: 'Espace entreprise', texte: 'Gérer votre entreprise, vos commerciaux et vos paiements.' },
  PLATEFORME: { titre: 'Administration eBMarket', texte: 'Valider les demandes d’ouverture et administrer la plateforme.' },
} as const;

/** Étape entre la session « COMPTE » et l'entrée dans l'application : choix du contexte. */
export function PageChoixContexte() {
  const { statut, contextes, choisirContexte, fermerSession } = useSession();
  const navigate = useNavigate();
  const [erreur, setErreur] = useState<string | null>(null);

  if (statut === 'deconnecte') return <Navigate to="/connexion" replace />;
  if (statut === 'connecte') return <Navigate to="/" replace />;

  async function choisir(c: (typeof contextes)[number]) {
    setErreur(null);
    try {
      await choisirContexte(c);
      navigate('/', { replace: true });
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Impossible de choisir ce contexte.');
    }
  }

  return (
    <main className="login">
      <section className="login-card card" aria-labelledby="titre-contexte">
        <h1 id="titre-contexte">Où voulez-vous aller ?</h1>
        {erreur && <p className="field-error" role="alert">{erreur}</p>}
        {contextes.map((c) => (
          <Button key={c} variant="secondary" className="bloc" onClick={() => void choisir(c)}>
            <strong>{LIBELLES[c].titre}</strong><br /><span className="muted">{LIBELLES[c].texte}</span>
          </Button>
        ))}
        <Button variant="secondary" size="sm" onClick={() => void fermerSession()}>Annuler</Button>
      </section>
    </main>
  );
}
