import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

type ProprietesChamp = { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string };

/**
 * Libellé + message d'erreur À CÔTÉ du champ + accessibilité (guide v4 §5).
 * Usage :
 *   <FormField label="Code" erreur={erreurs.code} requis>{(p) => <TextInput {...p} value={..} onChange={..} />}</FormField>
 */
export function FormField({ label, erreur, aide, requis, children }: {
  label: string; erreur?: string; aide?: string; requis?: boolean; children: (proprietes: ProprietesChamp) => ReactNode;
}) {
  const id = useId();
  const idDescription = erreur || aide ? `${id}-desc` : undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}{requis && <span aria-hidden="true"> *</span>}</label>
      {children({ id, 'aria-invalid': !!erreur, 'aria-describedby': idDescription })}
      {(erreur || aide) && <small id={idDescription} className={erreur ? 'field-error' : 'muted'}>{erreur ?? aide}</small>}
    </div>
  );
}

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => <input className="input" {...props} />;
export const SelectInput = (props: SelectHTMLAttributes<HTMLSelectElement>) => <select className="input" {...props} />;
