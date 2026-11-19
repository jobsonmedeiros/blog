import type { Metadata } from 'next';
import Link from 'next/link';
import CatalogoObras from '@/components/CatalogoObras';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';

export const metadata: Metadata = { title: 'Livros | Conforto das Escrituras' };

export default function PaginaLivros() {
  const livros = (acervo.obras as ObraAcervo[]).filter(obra => obra.tipo === 'livro');
  return <div className="site-container py-8 sm:py-10">
    <header className="mb-7">
      <p className="font-sans text-xs uppercase tracking-widest text-[var(--gold)] mb-2">Biblioteca</p>
      <h1 className="text-3xl sm:text-4xl">Livros</h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--ink-light)]">Livros e livretos para aprofundar a leitura das Escrituras. O acervo começa com as publicações de J. N. Darby reunidas pela Verdades Vivas.</p>
      <Link href="/estudos/darby" className="font-sans inline-flex min-h-11 items-center text-sm text-[var(--gold)] underline mt-2">Consultar também os {acervo.obras.filter(obra => obra.tipo === 'artigo').length} artigos de Darby →</Link>
    </header>
    <CatalogoObras obras={livros} tipo="livro" />
    <p className="font-sans text-xs leading-relaxed mt-8 text-[var(--ink-light)]">Os originais em inglês identificados podem ser lidos e traduzidos aqui, em texto simples. As edições em português da Verdades Vivas continuam referenciadas na fonte. <a href={acervo.fonte} target="_blank" rel="noopener noreferrer" className="underline">Consultar o índice da fonte ↗</a></p>
  </div>;
}
