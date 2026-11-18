import 'server-only';
import { interpretarPaginaRevista } from './revistas-parser';
import { caminhoRevistaValido } from './revistas-modelo';

export const ORIGEM_REVISTAS = 'https://bibletruthpublishers.com';
export async function carregarPaginaRevista(caminho: string) {
  if (caminho !== '/all-library-periodicals/lpa' && !caminhoRevistaValido(caminho)) throw new Error('Endereço de revista inválido.');
  let endereco = `${ORIGEM_REVISTAS}${caminho}`;
  let resposta: Response | undefined;
  for (let tentativa = 0; tentativa < 4; tentativa++) {
    resposta = await fetch(endereco, {
      redirect: 'manual', signal: AbortSignal.timeout(25000), next: { revalidate: 86400 },
    });
    if (![301, 302, 303, 307, 308].includes(resposta.status)) break;
    const local = resposta.headers.get('location');
    if (!local) throw new Error('A biblioteca retornou um redirecionamento inválido.');
    const proximo = new URL(local, endereco);
    if (proximo.origin !== ORIGEM_REVISTAS || proximo.username || proximo.password || proximo.search || !caminhoRevistaValido(proximo.pathname)) throw new Error('O destino não pertence à biblioteca de revistas.');
    endereco = proximo.href;
  }
  if (!resposta?.ok) throw new Error('A biblioteca original está indisponível no momento. Tente novamente.');
  const pagina = interpretarPaginaRevista(await resposta.text(), caminho);
  if (!pagina.itens.length && !pagina.texto) throw new Error('Não foi possível carregar o conteúdo desta página. Consulte a fonte original.');
  return pagina;
}
