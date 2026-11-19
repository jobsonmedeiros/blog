import { caminhoRevistaValido } from './revistas-modelo.ts';

// O retorno do login só pode apontar para páginas internas do painel.
export function destinoAposLogin(destino: string | null): string {
  if (destino === '/admin' || destino === '/admin/revistas') return destino;
  if (destino === '/admin/livros' || /^\/admin\/livros\/[a-z0-9-]{3,120}(?:\/[a-z0-9-]{3,200})?$/.test(destino ?? '')) return destino!;
  if (destino?.startsWith('/admin/revistas/') && caminhoRevistaValido(destino.slice('/admin/revistas'.length))) return destino;
  return '/admin';
}
