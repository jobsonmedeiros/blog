import { load } from 'cheerio';
import { caminhoRevistaValido, type EntradaRevista, type PaginaRevista } from './revistas-modelo.ts';

export function interpretarPaginaRevista(html: string, caminho: string): PaginaRevista {
  const $ = load(html);
  const limpar = (texto: string) => texto.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
  const titulo = limpar($('h1').first().text());
  if (!titulo) throw new Error('A fonte não retornou um título reconhecível.');
  const itens: EntradaRevista[] = [];
  $('[id$="lnkTitle"]').each((_, elemento) => {
    const endereco = $(elemento).attr('href');
    if (caminhoRevistaValido(endereco) && !itens.some(item => item.caminho === endereco)) itens.push({ caminho: endereco, titulo: limpar($(elemento).text()) });
  });
  const anteriores: EntradaRevista[] = [];
  $('#breadcrumbs a').each((_, elemento) => {
    const endereco = $(elemento).attr('href')?.replace(/\/lc(\d+)$/, '/lpvl$1').replace(/\/lb(\d+-\d+)$/, '/lpv$1');
    if (caminhoRevistaValido(endereco) && endereco !== caminho) anteriores.push({ caminho: endereco, titulo: limpar($(elemento).text()) });
  });
  const corpo = $('[id$="pnlArticleXML"]').first().clone();
  corpo.find('script, style, .show-all-cont, .verse-rollover-link > span, .article-index-tooltip').remove();
  corpo.find('br').replaceWith('\n');
  corpo.find('div, p, h2, h3, h4, li, blockquote, tr').append('\n\n');
  const texto = limpar(corpo.text()).replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n');
  const autor = limpar($('[id$="pnlAuthor"]').first().text()).replace(/^By:\s*/i, '');
  return { caminho, titulo, texto, autor, itens, anteriores };
}
