'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import { artigoRevista, caminhoRevistaValido, type EntradaRevista } from '@/lib/revistas-modelo';

type Subnivel = { titulo: string; itens: EntradaRevista[] };
const carregamentos = new Map<string, Promise<Subnivel>>();
function carregarSubnivel(caminho: string) {
  let pedido = carregamentos.get(caminho);
  if (!pedido) {
    pedido = fetch(`/api/revistas/catalogo?caminho=${encodeURIComponent(caminho)}`)
      .then(async resposta => {
        if (!resposta.ok) throw new Error('Falha ao carregar.');
        const dados = await resposta.json();
        if (!Array.isArray(dados.itens)) throw new Error('Lista inválida.');
        return { titulo: String(dados.titulo || ''), itens: dados.itens.filter((item: EntradaRevista) => item && typeof item.titulo === 'string' && caminhoRevistaValido(item.caminho)) };
      }).catch(erro => { carregamentos.delete(caminho); throw erro; });
    carregamentos.set(caminho, pedido);
  }
  return pedido;
}

function RamoRevista({ item, editor, anteriores }: { item: EntradaRevista; editor: boolean; anteriores: string[] }) {
  const [aberto, definirAberto] = useState(false);
  const [pagina, definirPagina] = useState<Subnivel | null>(null);
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState(false);
  const identificador = useId();
  const href = `${editor ? '/admin' : ''}/revistas${item.caminho}`;
  const linha = 'flex w-full min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm sm:text-base transition-colors hover:bg-[var(--parchment-dark)]';
  if (artigoRevista(item.caminho) || anteriores.includes(item.caminho)) {
    return <li><Link href={href} className={`${linha} no-underline`}><span className="min-w-0 break-words">{item.titulo}</span><span aria-hidden="true" className="shrink-0 text-[var(--gold)]">→</span></Link></li>;
  }
  const buscar = async () => {
    if (pagina || carregando) return;
    definirCarregando(true); definirErro(false);
    try { definirPagina(await carregarSubnivel(item.caminho)); }
    catch { definirErro(true); }
    finally { definirCarregando(false); }
  };
  const alternar = () => {
    if (aberto) { definirAberto(false); return; }
    definirAberto(true); void buscar();
  };
  return <li>
    <button type="button" onClick={alternar} aria-expanded={aberto} aria-controls={identificador} className={`${linha} ${aberto ? 'bg-[var(--parchment-dark)]/50 font-medium' : ''}`}>
      <span className="min-w-0 break-words">{item.titulo}</span>
      <span aria-hidden="true" className="shrink-0 text-[var(--gold)]">{aberto ? '▾' : '▸'}</span>
    </button>
    <div id={identificador} hidden={!aberto} className="arvore-revistas-filhos">
      {carregando && <p role="status" className="px-3 py-3 text-xs text-[var(--ink-light)]">Carregando títulos…</p>}
      {erro && <div className="px-3 py-3 text-sm"><p role="alert">Não foi possível abrir esta parte.</p><button type="button" className="mt-2 min-h-9 underline text-[var(--gold)]" onClick={() => { void buscar(); }}>Tentar novamente</button></div>}
      {pagina && (pagina.itens.length ? <ArvoreRevistas itens={pagina.itens.filter(filho => filho.caminho !== item.caminho && !anteriores.includes(filho.caminho))} editor={editor} anteriores={[...anteriores, item.caminho]} /> : <Link href={href} className={`${linha} text-[var(--gold)]`}>Abrir leitura →</Link>)}
    </div>
  </li>;
}

export default function ArvoreRevistas({ itens, editor = false, anteriores = [] }: { itens: EntradaRevista[]; editor?: boolean; anteriores?: string[] }) {
  return <ul className="arvore-revistas">
    {itens.map(item => <RamoRevista key={item.caminho} item={item} editor={editor} anteriores={anteriores} />)}
  </ul>;
}
