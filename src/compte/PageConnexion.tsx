import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { FormField, TextInput } from '@/components/Form';

/** Écran de connexion. La saisie est conservée après une erreur (guide v4 §5). */
export function PageConnexion() {
  const { statut, motif, ouvrirSession } = useSession();
  const navigate = useNavigate();
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreurs, setErreurs] = useState<{ identifiant?: string; motDePasse?: string }>({});
  const [erreurGenerale, setErreurGenerale] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  if (statut === 'connecte') return <Navigate to="/" replace />;

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setErreurGenerale(null);
    const prochaines: typeof erreurs = {};
    if (!identifiant.trim()) prochaines.identifiant = 'Saisissez votre e-mail ou votre téléphone.';
    if (!motDePasse) prochaines.motDePasse = 'Saisissez votre mot de passe.';
    setErreurs(prochaines);
    if (Object.keys(prochaines).length) return;
    setOccupe(true);
    try {
      await ouvrirSession(identifiant.trim(), motDePasse);
      navigate('/', { replace: true });
    } catch (err) {
      setErreurGenerale(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setOccupe(false);
    }
  }

  return (
    <main className="login">
      <form className="login-card card" onSubmit={(e) => void soumettre(e)} noValidate>
        <h1>eBMarket</h1>
        <p className="muted">Back-office — connexion</p>
        {motif === 'expiree' && <p className="banner-warn" role="status">Votre session a expiré. Reconnectez-vous.</p>}
        {erreurGenerale && <p className="field-error" role="alert">{erreurGenerale}</p>}
        <FormField label="E-mail ou téléphone" erreur={erreurs.identifiant} requis>
          {(p) => <TextInput {...p} autoComplete="username" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />}
        </FormField>
        <FormField label="Mot de passe" erreur={erreurs.motDePasse} requis>
          {(p) => <TextInput {...p} type="password" autoComplete="current-password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />}
        </FormField>
        <Button type="submit" disabled={occupe}>{occupe ? 'Connexion…' : 'Se connecter'}</Button>
      </form>
    </main>
  );
}
