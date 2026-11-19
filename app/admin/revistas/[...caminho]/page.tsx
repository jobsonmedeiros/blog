import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminUser } from '@/lib/auth/server';
import { caminhoRevistaValido } from '@/lib/revistas-modelo';
import { carregarPaginaRevista, ORIGEM_REVISTAS } from '@/lib/revistas-fonte';
import { lerRascunhoRevista } from '@/lib/revistas-repositorio';
import CaminhoRevistas from '@/components/CaminhoRevistas';
import CatalogoRevistas from '@/components/CatalogoRevistas';
import EditorRevista from '@/components/EditorRevista';

export const dynamic = 'force-dynamic';
export default async function EditarRevista({ params }: { params: Promise<{ caminho: string[] }> }) {
  const caminho = '/' + (await params).caminho.join('/');
  if (!caminhoRevistaValido(caminho)) notFound();
  if (!await getAdminUser()) redirect(`/login?retorno=${encodeURIComponent(`/admin/revistas${caminho}`)}`);
  const rascunho = await lerRascunhoRevista(caminho);
  const pagina = await carregarPaginaRevista(caminho).catch(erro => {
    if (!rascunho) throw erro;
    return { caminho, titulo: rascunho.tituloOriginal, texto: rascunho.textoOriginal, autor: '', anteriores: [], itens: [] };
  });
  return <div className="site-container pt-4 pb-8">
    <CaminhoRevistas anteriores={pagina.anteriores} titulo={pagina.titulo} editor />
    <header className="mb-4"><h1 className="text-2xl sm:text-3xl leading-tight mb-2">{pagina.titulo}</h1><div className="flex gap-5 font-sans text-xs text-[var(--ink-light)]"><Link href="/admin/revistas" className="underline">Meus trabalhos</Link><a href={`${ORIGEM_REVISTAS}${caminho}`} target="_blank" rel="noopener noreferrer" className="underline">Fonte original ↗</a></div></header>
    {pagina.itens.length ? <CatalogoRevistas itens={pagina.itens} editor /> : <EditorRevista pagina={pagina} rascunho={rascunho} />}
  </div>;
}
