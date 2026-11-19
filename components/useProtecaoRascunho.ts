'use client';
import { useEffect } from 'react';

// A navegação interna do Next não dispara beforeunload.
export function useProtecaoRascunho(ativo: boolean, avisar: () => void) {
  useEffect(() => {
    if (!ativo) return;
    const proteger = (evento: MouseEvent) => {
      if (evento.defaultPrevented || evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
      const link = evento.target instanceof Element ? evento.target.closest('a[href]') as HTMLAnchorElement | null : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const destino = new URL(link.href, location.href);
      if (destino.origin !== location.origin || destino.pathname + destino.search === location.pathname + location.search) return;
      evento.preventDefault(); evento.stopPropagation(); avisar();
    };
    document.addEventListener('click', proteger, true);
    return () => document.removeEventListener('click', proteger, true);
  }, [ativo, avisar]);
}
