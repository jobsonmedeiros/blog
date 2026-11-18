import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { carregarPaginaRevista, ORIGEM_REVISTAS } from '@/lib/revistas-fonte';
import { caminhoRevistaValido, type PaginaRevista, type TextoRevista } from '@/lib/revistas-modelo';
import { lerTraducaoPublicada } from '@/lib/revistas-repositorio';
import CatalogoRevistas from '@/components/CatalogoRevistas';
import CaminhoRevistas from '@/components/CaminhoRevistas';
import LeitorRevista from '@/components/LeitorRevista';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Leitura de revistas | Conforto das Escrituras' };
export default async function PaginaDaRevista({ params }: { params: Promise<{ caminho: string[] }> }) {
  const caminho = '/' + (await params).caminho.join('/');
  if (!caminhoRevistaValido(caminho)) notFound();
  let pagina: PaginaRevista | null;
  let publicada: TextoRevista | null = null;
  try {
    if (/\/la(?:c)?\d/.test(caminho)) publicada = await lerTraducaoPublicada(caminho);
    pagina = await carregarPaginaRevista(caminho).catch(erro => {
      if (!publicada) throw erro;
      return { caminho, titulo: publicada.tituloOriginal, texto: publicada.textoOriginal, autor: '', anteriores: [], itens: [] };
    });
  } catch { pagina = null; }
  if (!pagina) return <div className="max-w-3xl mx-auto px-4 py-10"><h1 className="text-3xl mb-4">Não foi possível abrir esta revista agora</h1><p className="font-sans mb-5">A biblioteca ou o servidor está temporariamente indisponível. Tente recarregar a página.</p><a href={`${ORIGEM_REVISTAS}${caminho}`} target="_blank" rel="noopener noreferrer" className="underline">Consultar a fonte original ↗</a><Link href="/revistas" className="underline ml-5">Voltar às revistas</Link></div>;
  return <div className="max-w-6xl mx-auto px-4 py-8">
      <CaminhoRevistas anteriores={pagina.anteriores} titulo={pagina.titulo} />
      <header className="mb-6"><h1 className="text-3xl sm:text-4xl mb-3">{publicada?.tituloTraduzido || pagina.titulo}</h1>
        {pagina.autor && <p className="font-sans text-sm text-[var(--ink-light)]">{pagina.autor}</p>}
        <div className="flex flex-wrap gap-5 mt-3 font-sans text-xs text-[var(--gold)]">
          <a href={`${ORIGEM_REVISTAS}${caminho}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Fonte original ↗</a>
          <Link href={`/admin/revistas${caminho}`} className="underline underline-offset-4">Abrir no painel de tradução</Link>
        </div>
      </header>
      {pagina.itens.length ? <CatalogoRevistas itens={pagina.itens} /> : <LeitorRevista pagina={pagina} publicada={publicada} />}
  </div>;
}
