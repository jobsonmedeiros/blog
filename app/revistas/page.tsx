import type { Metadata } from 'next';
import Link from 'next/link';
import revistas from '@/data/revistas.json';
import CatalogoRevistas from '@/components/CatalogoRevistas';
import { idiomaOriginalRevista, type EntradaRevista, type GrupoRevistas } from '@/lib/revistas-modelo';
import { listarTraducoesPublicadas } from '@/lib/revistas-repositorio';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Revistas | Conforto das Escrituras' };
export default async function PaginaRevistas() {
  let portugues: EntradaRevista[] = [];
  let indisponivel = false;
  try { portugues = await listarTraducoesPublicadas(); } catch { indisponivel = true; }
  const grupos: GrupoRevistas[] = [
    { id: 'portugues', titulo: 'Português', descricao: 'Artigos traduzidos e publicados em português.', vazio: indisponivel ? 'Não foi possível consultar as traduções agora. Os originais continuam disponíveis nas outras seções.' : 'Ainda não há traduções publicadas em português. Elas aparecerão aqui quando forem publicadas.', itens: portugues },
    { id: 'ingles', titulo: 'Inglês', descricao: 'Originais em inglês. Expanda os títulos para encontrar os artigos.', itens: revistas.filter(revista => idiomaOriginalRevista(revista.caminho) === 'en') },
    { id: 'espanhol', titulo: 'Espanhol', descricao: 'Originais em espanhol. Expanda os títulos para encontrar os artigos.', itens: revistas.filter(revista => idiomaOriginalRevista(revista.caminho) === 'es') },
  ];
  return <div className="max-w-5xl mx-auto px-4 py-5">
    <CatalogoRevistas itens={revistas} grupos={grupos} rotuloBusca="Buscar nesta seção" cabecalho={
      <header className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl leading-tight" style={{ fontFamily: "'Artifakt Element Book', 'Crimson Pro', serif" }}>Revistas</h1>
          <Link href="/admin/revistas" className="inline-flex min-h-10 items-center rounded-lg border border-[var(--parchment-dark)] px-2 sm:px-3 py-2 text-[11px] sm:text-xs text-[var(--gold)] transition-colors hover:bg-[var(--parchment-dark)]">Painel de tradução →</Link>
        </div>
        <p className="mt-2 text-[13px] sm:text-sm leading-relaxed text-[var(--ink-light)]">Expanda a revista e os volumes abaixo. Abra a leitura somente ao chegar ao artigo.</p>
        <nav aria-label="Guias de leitura" className="mt-3 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--parchment-dark)] pt-3 text-[13px] sm:text-sm text-[var(--gold)]">
          <span className="col-span-2 text-xs font-semibold text-[var(--ink-light)]">Guias de leitura</span>
          <Link href="/revistas/como-traduzir-a-leitura" className="underline underline-offset-4">Como traduzir a leitura</Link>
          <Link href="/revistas/como-ler-citacoes-biblicas" className="underline underline-offset-4">Como ler citações bíblicas</Link>
        </nav>
      </header>
    } />
    <p className="mt-8 font-sans text-xs text-[var(--ink-light)]">Fonte: <a href="https://bibletruthpublishers.com/all-library-periodicals/lpa" target="_blank" rel="noopener noreferrer" className="underline">Bible Truth Publishers</a>. Os textos mantêm sua autoria e os avisos da fonte.</p>
  </div>;
}
