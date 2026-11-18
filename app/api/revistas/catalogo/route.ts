import { NextResponse } from 'next/server';
import { carregarPaginaRevista } from '@/lib/revistas-fonte';
import { caminhoRevistaValido } from '@/lib/revistas-modelo';

export async function GET(pedido: Request) {
  const caminho = new URL(pedido.url).searchParams.get('caminho');
  if (!caminhoRevistaValido(caminho)) return NextResponse.json({ error: 'Endereço de revista inválido.' }, { status: 400 });
  try {
    const pagina = await carregarPaginaRevista(caminho);
    // Somente a hierarquia pública da fonte. Nunca consulta rascunhos ou traduções privadas.
    return NextResponse.json({ caminho, titulo: pagina.titulo, itens: pagina.itens }, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Não foi possível carregar esta parte da revista. Tente novamente.' }, { status: 503 });
  }
}
