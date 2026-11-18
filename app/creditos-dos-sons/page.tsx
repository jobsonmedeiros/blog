import type { Metadata } from 'next';
import Link from 'next/link';
import catalogo from '@/public/ambientes/catalogo.json';

export const metadata: Metadata = { title: 'Créditos dos sons | Conforto das Escrituras' };
const nomes: Record<string, string> = { chuva: 'Chuva suave', floresta: 'Floresta', oceano: 'Oceano', instrumental: 'Instrumental suave' };

export default function CreditosDosSons() {
  return <article className="max-w-3xl mx-auto px-4 py-8">
    <Link href="/leitura" className="font-sans text-sm text-[var(--gold)] underline">← Voltar à leitura</Link>
    <h1 className="text-3xl mt-5 mb-3">Créditos dos sons</h1>
    <p className="font-sans text-sm leading-relaxed text-[var(--ink-light)]">As faixas do player usam gravações compartilhadas pelos autores sob as licenças abaixo. Foram preparadas para leitura com volume equilibrado e repetição contínua.</p>
    <div className="mt-6 divide-y divide-[var(--parchment-dark)]">
      {catalogo.map(trilha => <section id={trilha.id} key={trilha.id} className="py-6 scroll-mt-36">
        <h2 className="text-2xl mb-3">{nomes[trilha.id]}</h2>
        <ul className="space-y-3 font-sans text-sm">
          {trilha.fontes.map(fonte => <li key={fonte.url}>
            <a href={fonte.url} target="_blank" rel="noopener noreferrer" className="underline text-[var(--gold)]">{fonte.titulo}</a>
            <p className="mt-1">Por {fonte.autor} · <a href={fonte.urlLicenca} target="_blank" rel="noopener noreferrer" className="underline">{fonte.licenca}</a></p>
          </li>)}
        </ul>
        <p className="font-sans text-xs text-[var(--ink-light)] mt-4 leading-relaxed">Alterações: {trilha.adaptacoes}</p>
      </section>)}
    </div>
  </article>;
}
