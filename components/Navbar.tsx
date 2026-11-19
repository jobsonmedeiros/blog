"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFechamentoPainel } from '@/components/useDismissiblePanel';
import { bibleReferenceHref as criarLinkReferencia } from '@/lib/bible-links';
import { authClient } from '@/lib/auth/client';

type ItemNavegacao = { href: string; rotulo: string };
const enderecos: ItemNavegacao[] = [
  { href: "/", rotulo: "Início" },
  { href: "/leitura", rotulo: "Bíblias" },
  { href: "/versiculo", rotulo: "Versículo do Dia" },
  { href: "/estudos", rotulo: "Estudos" },
  { href: "/livros", rotulo: "Livros" },
  { href: "/revistas", rotulo: "Revistas" },
  { href: "/admin", rotulo: "Área do autor" },
];

export default function MenuPrincipal() {
  const caminhoAtual = usePathname();
  const secaoAtiva = (endereco: string) => caminhoAtual === endereco || (endereco !== '/' && caminhoAtual.startsWith(`${endereco}/`));
  const indicarLocalAtual = (endereco: string) => caminhoAtual === endereco ? 'page' as const : secaoAtiva(endereco) ? 'location' as const : undefined;
  const navegador = useRouter();
  const { data: sessao } = authClient.useSession();
  const [saindo, definirSaindo] = useState(false);
  const [erroSaida, definirErroSaida] = useState('');
  const [aberto, definirAberto] = useState(false);
  const referenciaMenu = useRef<HTMLElement | null>(null);
  useFechamentoPainel(aberto, referenciaMenu, definirAberto);
  const sairDaConta = async () => {
    if (saindo) return;
    if (!window.dispatchEvent(new Event('ce-antes-sair', { cancelable: true }))) return;
    definirSaindo(true); definirErroSaida('');
    try {
      const resultado = await authClient.signOut();
      if (resultado.error) throw new Error('signout');
      definirAberto(false);
      navegador.replace('/login'); navegador.refresh();
    } catch { definirErroSaida('Não foi possível sair agora. Tente novamente.'); }
    finally { definirSaindo(false); }
  };
  useEffect(() => {
    const menu = referenciaMenu.current;
    if (!menu) return;
    const medirAltura = () => document.documentElement.style.setProperty('--site-nav-height', `${menu.getBoundingClientRect().height}px`);
    medirAltura();
    const observadorAltura = new ResizeObserver(medirAltura);
    observadorAltura.observe(menu);
    return () => { observadorAltura.disconnect(); document.documentElement.style.removeProperty('--site-nav-height'); };
  }, []);

  return (
    <nav
      ref={referenciaMenu}
      className="sticky top-0 z-50"
      style={{
        background: "var(--parchment)",
        isolation: "isolate",
        borderBottom: "1px solid var(--parchment-dark)",
        boxShadow: "0 2px 12px rgba(67, 45, 28, 0.05)",
      }}
    >
      <div className="site-container py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <span className="h-2 w-2 mt-2.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} aria-hidden />
          <div className="min-w-0 max-w-md break-words">
          <Link href="/" onClick={() => definirAberto(false)}
            className="text-[22px] sm:text-[26px] leading-tight font-semibold tracking-[-0.02em]"
            style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
          >
            Conforto das Escrituras
          </Link>
          <p className="mt-1 font-sans text-xs sm:text-[13px] leading-snug italic" style={{ color: 'var(--ink-light)' }}>
            <Link href={criarLinkReferencia('Marcos 6:31')} onClick={() => definirAberto(false)} className="no-underline transition-colors duration-200 hover:text-[var(--gold)] focus-visible:text-[var(--gold)]" title="Ler Marcos 6:31 na Bíblia">
              &ldquo;E ele [o Senhor Jesus] disse-lhes: Vinde vós, aqui à parte, a um lugar deserto, e repousai um pouco...&rdquo;
            </Link>{' '}
            <Link href={criarLinkReferencia('Marcos 6:31')} onClick={() => definirAberto(false)} className="underline underline-offset-4 whitespace-nowrap" style={{ color: 'var(--gold)' }}>Marcos 6:31a | ACF</Link>
          </p>
          </div>
        </div>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center shrink-0 gap-1 font-sans text-sm">
          {enderecos.map((itemNavegacao) => (
            <li key={itemNavegacao.href}>
              <Link
                href={itemNavegacao.href}
                className="menu-link"
                aria-current={indicarLocalAtual(itemNavegacao.href)}
              >
                {itemNavegacao.rotulo}
              </Link>
            </li>
          ))}
          {sessao?.user && <li className="border-l border-[var(--parchment-dark)] pl-4">
            <button type="button" onClick={sairDaConta} disabled={saindo} className="min-h-9 min-w-10 text-[var(--ink-light)] hover:text-[var(--gold)] disabled:opacity-50">{saindo ? 'Saindo…' : 'Sair'}</button>
          </li>}
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden min-h-11 shrink-0 font-sans text-lg"
          style={{ color: "var(--ink)" }}
          onClick={() => definirAberto(!aberto)}
          aria-label="Menu"
          aria-expanded={aberto}
        >
          {aberto ? "Fechar" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {aberto && (
        <ul className="lg:hidden site-container pb-4 pt-1 flex flex-col gap-1 font-sans text-sm">
          {enderecos.map((itemNavegacao) => (
            <li key={itemNavegacao.href}>
              <Link
                href={itemNavegacao.href}
                onClick={() => definirAberto(false)}
                className="menu-link w-full"
                aria-current={indicarLocalAtual(itemNavegacao.href)}
              >
                {itemNavegacao.rotulo}
              </Link>
            </li>
          ))}
          {sessao?.user && <li className="border-t border-[var(--parchment-dark)] pt-2">
            <button type="button" onClick={sairDaConta} disabled={saindo} className="min-h-10 text-[var(--ink-light)] hover:text-[var(--gold)] disabled:opacity-50">{saindo ? 'Saindo…' : 'Sair'}</button>
          </li>}
        </ul>
      )}
      {erroSaida && <p role="alert" className="site-container pb-2 font-sans text-xs text-red-700">{erroSaida}</p>}
    </nav>
  );
}
