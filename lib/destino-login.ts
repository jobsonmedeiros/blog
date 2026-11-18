import { caminhoRevistaValido } from './revistas-modelo.ts';

// O retorno do login só pode apontar para páginas internas do painel.
export function destinoAposLogin(destino: string | null): string {
  if (destino === '/admin' || destino === '/admin/revistas') return destino;
  if (destino?.startsWith('/admin/revistas/') && caminhoRevistaValido(destino.slice('/admin/revistas'.length))) return destino;
  return '/admin';
}
