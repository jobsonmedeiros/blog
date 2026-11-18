"use client";
import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react';

export function useFechamentoPainel(aberto: boolean, recipiente: RefObject<HTMLElement | null>, definirAberto: Dispatch<SetStateAction<boolean>>) {
  useEffect(() => {
    if (!aberto) return;
    const fecharPainel = () => definirAberto(false);
    const aoInteragirFora = (evento: Event) => {
      const painelAberto = recipiente.current;
      if (painelAberto && !evento.composedPath().includes(painelAberto) && !painelAberto.contains(evento.target as Node | null)) fecharPainel();
    };
    const aoPressionarEsc = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') fecharPainel();
    };
    const aoOcultarPagina = () => { if (document.hidden) fecharPainel(); };
    // Captura também cliques em áreas sem foco e toques, sem bloquear a ação
    // do elemento externo. Movimentar o foco dentro do painel não o fecha.
    document.addEventListener('pointerdown', aoInteragirFora, true);
    document.addEventListener('focusin', aoInteragirFora, true);
    document.addEventListener('keydown', aoPressionarEsc);
    document.addEventListener('visibilitychange', aoOcultarPagina);
    window.addEventListener('blur', fecharPainel);
    return () => {
      document.removeEventListener('pointerdown', aoInteragirFora, true);
      document.removeEventListener('focusin', aoInteragirFora, true);
      document.removeEventListener('keydown', aoPressionarEsc);
      document.removeEventListener('visibilitychange', aoOcultarPagina);
      window.removeEventListener('blur', fecharPainel);
    };
  }, [aberto, recipiente, definirAberto]);
}
