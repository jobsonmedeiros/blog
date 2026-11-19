import type { Metadata } from 'next';
import Link from 'next/link';
import CatalogoObras from '@/components/CatalogoObras';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';

export const metadata: Metadata = { title: 'Artigos de J. N. Darby | Conforto das Escrituras' };

export default function ArtigosDarby() {
  const artigos = (acervo.obras as ObraAcervo[]).filter(obra => obra.tipo === 'artigo');
  const ingles = artigos.filter(obra => obra.originais.length > 0).length;
  return <div className="site-container py-8 sm:py-10">
    <Link href="/estudos" className="font-sans text-sm text-[var(--gold)]">← Estudos</Link>
    <header className="mt-5 mb-7">
      <h1 className="text-3xl sm:text-4xl">Artigos de J. N. Darby</h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--ink-light)]">{artigos.length} entradas do índice da Verdades Vivas, com acesso às edições em português e {ingles} referências em inglês já identificadas.</p>
      <p className="font-sans mt-3 text-sm leading-relaxed text-[var(--ink-light)]">Alguns textos são excertos, resumos ou adaptações. Títulos repetidos foram preservados com a indicação da publicação, pois podem corresponder a edições diferentes.</p>
      <Link href="/livros" className="font-sans inline-flex min-h-11 items-center text-sm text-[var(--gold)] underline mt-2">Ver os livros de Darby →</Link>
    </header>
    <CatalogoObras obras={artigos} tipo="artigo" />
    <aside className="font-sans mt-8 border-t border-[var(--parchment-dark)] pt-5 text-xs leading-relaxed text-[var(--ink-light)]">
      <p>Os links abrem a leitura na biblioteca responsável. Uma referência em inglês pode conter o texto completo do qual foi extraído o artigo em português; as edições não são necessariamente idênticas.</p>
      <p className="mt-2"><a href={acervo.fonte} target="_blank" rel="noopener noreferrer" className="underline">Índice da Verdades Vivas ↗</a>{' · '}<a href="https://stempublishing.com/authors/darby/" target="_blank" rel="noopener noreferrer" className="underline">Biblioteca de Darby em inglês na STEM ↗</a></p>
    </aside>
  </div>;
}
