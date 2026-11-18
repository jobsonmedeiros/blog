import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/server';
import { getDatabase } from '@/lib/db';
import revistas from '@/data/revistas.json';
import CatalogoRevistas from '@/components/CatalogoRevistas';

export const dynamic = 'force-dynamic';
export default async function PainelRevistas() {
  if (!await getAdminUser()) redirect('/login?retorno=%2Fadmin%2Frevistas');
  const trabalhos = await getDatabase()`SELECT caminho, titulo_original, titulo_traduzido, publicado IS NOT NULL AS publicada, atualizado_em FROM revistas_traducoes ORDER BY atualizado_em DESC`;
  return <div className="max-w-5xl mx-auto px-4 py-8">
    <Link href="/admin" className="font-sans text-sm underline">← Painel do autor</Link>
    <h1 className="text-4xl mt-5 mb-3">Tradução de revistas</h1>
    <p className="font-sans text-sm text-[var(--ink-light)] mb-7">Abra uma revista → volume → artigo. Salve partes da tradução como rascunho e publique quando terminar.</p>
    {trabalhos.length > 0 && <section className="card p-5 mb-8"><h2 className="text-2xl mb-4">Continuar meus trabalhos</h2><ul className="font-sans text-sm space-y-3">{trabalhos.map(trabalho => <li key={trabalho.caminho as string}>
      <Link href={`/admin/revistas${trabalho.caminho}`} className="underline underline-offset-4">{(trabalho.titulo_traduzido || trabalho.titulo_original) as string}</Link><span className="text-xs text-[var(--ink-light)] ml-3">{trabalho.publicada ? 'Com versão publicada' : 'Rascunho privado'}</span>
    </li>)}</ul></section>}
    <CatalogoRevistas itens={revistas} editor />
  </div>;
}
