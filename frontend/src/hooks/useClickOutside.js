import { useEffect } from 'react';

/**
 * Ferme un menu / panneau quand on clique en dehors de ref.
 */
export function useClickOutside(ref, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isOpen, onClose, ref]);
}
