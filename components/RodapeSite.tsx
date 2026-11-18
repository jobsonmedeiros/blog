"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { bibleReferenceHref as criarLinkReferencia } from '@/lib/bible-links';

export default function RodapeSite({ ano }: { ano: number }) {
  const caminhoAtual = usePathname();
  const naPaginaDeLeitura = caminhoAtual === '/leitura';
  const referenciaRodape = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const rodape = referenciaRodape.current;
    if (!naPaginaDeLeitura || !rodape) return;
    const medirAltura = () => document.documentElement.style.setProperty('--altura-rodape-leitura', `${rodape.getBoundingClientRect().height}px`);
    medirAltura();
    const observador = new ResizeObserver(medirAltura);
    observador.observe(rodape);
    return () => {
      observador.disconnect();
      document.documentElement.style.removeProperty('--altura-rodape-leitura');
    };
  }, [naPaginaDeLeitura]);

  return (
    <>
      {naPaginaDeLeitura && <div aria-hidden="true" style={{ height: 'var(--altura-rodape-leitura, 4.5rem)' }} />}
      <footer ref={referenciaRodape} className={naPaginaDeLeitura ? 'fixed inset-x-0 bottom-0 z-30 text-center px-3 pt-2 shadow-[0_-3px_12px_rgba(45,33,27,0.05)]' : 'text-center px-4 py-4 mt-4'} style={{ borderTop: '1px solid var(--parchment-dark)', background: 'var(--parchment)', ...(naPaginaDeLeitura ? { paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' } : {}) }}>
        <p className={`font-sans ${naPaginaDeLeitura ? 'text-[10px] sm:text-xs' : 'text-sm'}`} style={{ color: 'var(--ink-light)' }}>
          © {ano} Conforto das Escrituras •{' '}
          <a href="https://confortodasescrituras.blogspot.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>Blog</a>
        </p>
        <p className={`font-sans mt-1 ${naPaginaDeLeitura ? 'text-[10px] sm:text-[11px] leading-snug' : 'text-xs'}`} style={{ color: 'var(--gold)' }}>
          <Link href={criarLinkReferencia('Salmos 119:105')} className="no-underline transition-colors duration-200 hover:text-[var(--ink)] focus-visible:text-[var(--ink)]" aria-label="Ler Salmos 119:105 na Bíblia">
            ✦ &ldquo;A tua palavra é lâmpada que ilumina os meus passos&rdquo; — <span className="underline underline-offset-4">Sl 119:105</span> ✦
          </Link>
        </p>
      </footer>
    </>
  );
}
