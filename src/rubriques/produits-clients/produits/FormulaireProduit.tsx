import { useState, type FormEvent } from 'react';
import { ErreurApi, estConflitModification } from '@/api/erreurs';
import { Button, FormField, Modal, TextInput } from '@/components';
import { creerProduit } from './api';

type Props = { ouvert: boolean; onFermer: () => void; onCree: () => void };

/**
 * Formulaire en fenêtre : modèle pour tout formulaire d'écran.
 * - contrôle de confort côté écran (l'API reste l'autorité) ;
 * - erreurs de l'API affichées à côté des champs (errors[].field) ;
 * - la saisie est CONSERVÉE après une erreur (les états vivent dans ce composant, pas dans la requête).
 */
export function FormulaireProduit({ ouvert, onFermer, onCree }: Props) {
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [prix, setPrix] = useState('');
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [erreurGenerale, setErreurGenerale] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  function fermer() {
    setCode(''); setLibelle(''); setPrix(''); setErreurs({}); setErreurGenerale(null);
    onFermer();
  }

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setErreurGenerale(null);
    const locales: Record<string, string> = {};
    if (!code.trim()) locales.code = 'Le code est requis.';
    if (!libelle.trim()) locales.libelle = 'Le libellé est requis.';
    if (!/^\d+$/.test(prix) || Number(prix) <= 0) locales.prixUnitaire = 'Saisissez un entier positif, sans décimale.';
    setErreurs(locales);
    if (Object.keys(locales).length) return;

    setOccupe(true);
    try {
      await creerProduit({ code: code.trim(), libelle: libelle.trim(), prixUnitaire: Number(prix) });
      fermer();
      onCree();
    } catch (err) {
      if (err instanceof ErreurApi) {
        setErreurs(err.erreursChamps);
        // 409 E-SYS-07 : l'objet a changé entre-temps → on prévient, l'appelant recharge sans écraser.
        if (!Object.keys(err.erreursChamps).length || estConflitModification(err)) setErreurGenerale(err.message);
        if (estConflitModification(err)) onCree();
      } else setErreurGenerale('Une erreur est survenue.');
    } finally {
      setOccupe(false);
    }
  }

  return (
    <Modal ouvert={ouvert} titre="Nouveau produit" onFermer={fermer}>
      <form onSubmit={(e) => void soumettre(e)} noValidate>
        {erreurGenerale && <p className="field-error" role="alert">{erreurGenerale}</p>}
        <FormField label="Code" erreur={erreurs.code} requis aide="Majuscules, chiffres, tirets. Exemple : SANTE-STD">
          {(p) => <TextInput {...p} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />}
        </FormField>
        <FormField label="Libellé" erreur={erreurs.libelle} requis>
          {(p) => <TextInput {...p} value={libelle} onChange={(e) => setLibelle(e.target.value)} />}
        </FormField>
        <FormField label="Prix unitaire (XAF)" erreur={erreurs.prixUnitaire} requis>
          {(p) => <TextInput {...p} inputMode="numeric" value={prix} onChange={(e) => setPrix(e.target.value)} />}
        </FormField>
        <div className="modal-foot">
          <Button variant="secondary" onClick={fermer}>Annuler</Button>
          <Button type="submit" disabled={occupe}>{occupe ? 'Création…' : 'Créer'}</Button>
        </div>
      </form>
    </Modal>
  );
}
