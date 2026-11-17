import { useEffect, useRef, type ReactNode } from 'react';

/** Fenêtre de dialogue basée sur <dialog> : focus et touche Échap gérés par le navigateur. */
export function Modal({ ouvert, titre, onFermer, children }: { ouvert: boolean; titre: string; onFermer: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (ouvert && !d.open) {
      if (typeof d.showModal === 'function') d.showModal();
      else d.setAttribute('open', ''); // environnements sans <dialog> complet (tests)
    }
    if (!ouvert && d.open) {
      if (typeof d.close === 'function') d.close();
      else d.removeAttribute('open');
    }
  }, [ouvert]);
  return (
    <dialog ref={ref} className="modal" onClose={onFermer} aria-label={titre}>
      {ouvert && (
        <>
          <header className="modal-head"><b>{titre}</b><button className="btn btn-secondary btn-sm" onClick={onFermer} aria-label="Fermer">✕</button></header>
          <div className="modal-body">{children}</div>
        </>
      )}
    </dialog>
  );
}
