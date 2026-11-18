import Link from 'next/link';
import type { EntradaRevista } from '@/lib/revistas-modelo';

export default function CaminhoRevistas({ anteriores = [], titulo, editor = false }: { anteriores?: EntradaRevista[]; titulo: string; editor?: boolean }) {
  return <nav aria-label="Caminho da revista" className="sticky top-[var(--site-nav-height,4rem)] z-30 -mx-4 px-4 py-3 mb-6 border-b border-[var(--parchment-dark)] bg-[var(--parchment)] font-sans text-xs shadow-[0_3px_8px_rgba(45,33,27,0.04)]">
    <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1 text-[var(--ink-light)]">
      <li className="shrink-0"><Link href={editor ? '/admin/revistas' : '/revistas'} className="underline underline-offset-4">Revistas</Link></li>
      {anteriores.map(item => <li key={item.caminho} className="flex shrink-0 items-center gap-2"><span aria-hidden="true">→</span><Link href={`${editor ? '/admin' : ''}/revistas${item.caminho}`} title={item.titulo} className="max-w-40 sm:max-w-64 truncate underline underline-offset-4">{item.titulo}</Link></li>)}
      <li className="flex shrink-0 items-center gap-2"><span aria-hidden="true">→</span><span aria-current="page" title={titulo} className="max-w-48 sm:max-w-80 truncate">{titulo}</span></li>
    </ol>
  </nav>;
}
