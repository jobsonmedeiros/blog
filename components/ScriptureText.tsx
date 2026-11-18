import Link from 'next/link';
import { Fragment } from 'react';
import { findScriptureCitations as encontrarCitacoesBiblicas } from '@/lib/scripture-citations';

export default function TextoBiblicoComLinks({ texto }: { texto: string }) {
  const citacoes = encontrarCitacoesBiblicas(texto);
  return <>{citacoes.map((citacao, indice) => (
    <Fragment key={`${citacao.start}:${citacao.end}`}>
      {texto.slice(citacoes[indice - 1]?.end ?? 0, citacao.start)}
      <Link href={citacao.href} title="Abrir este trecho na Bíblia" className={citacao.kind === 'quote' ? 'bible-citation-text' : 'bible-citation-reference'}>{texto.slice(citacao.start, citacao.end)}</Link>
    </Fragment>
  ))}{texto.slice(citacoes.at(-1)?.end ?? 0)}</>;
}
