import { load } from 'cheerio';

// Os trechos de um mesmo versículo podem estar separados por itálico e links.
// Os espaços de cada trecho precisam ser preservados antes da concatenação.
export function extrairCapituloReferencia(html: string, versao: string, livroOsis: string, capitulo: number) {
  const $ = load(html);
  const raiz = $(`[data-fragment-id="${versao}:${livroOsis}.${capitulo}"]`).first();
  if (!raiz.length) throw new Error('A página não contém o capítulo solicitado.');
  const versos = new Map<number, string[]>();
  type NoHtml = { type: string; name?: string; data?: string; attribs?: Record<string, string>; children?: NoHtml[] };
  let ultimoVersiculo = 0;
  const adicionar = (numero: number, texto: string) => {
    if (!numero || !texto) return;
    const partes = versos.get(numero) ?? [];
    partes.push(texto); versos.set(numero, partes);
    if (texto.trim()) ultimoVersiculo = numero;
  };
  const visitar = (no: NoHtml, herdado = 0, dentroTexto = false) => {
    const atributos = no.attribs ?? {};
    if (['button', 'sup', 'script', 'style'].includes(no.name ?? '') || atributos['data-s'] === 'sp' || ['data-section', 'data-ref', 'data-note', 'data-vn', 'data-vb'].some(chave => chave in atributos)) return;
    const informado = Number(atributos['data-v']?.match(/^\.(\d+)\.$/)?.[1]);
    const numero = Number.isInteger(informado) && informado > 0 ? informado : herdado;
    const textoBiblico = dentroTexto || atributos.role === 'text';
    if (no.type === 'text') {
      if (textoBiblico || /^\s+$/.test(no.data ?? '')) adicionar(numero, no.data ?? '');
      return;
    }
    const quebra = ['p', 'div', 'br'].includes(no.name ?? '');
    if (quebra) adicionar(numero || ultimoVersiculo, ' ');
    for (const filho of no.children ?? []) visitar(filho, numero, textoBiblico);
    if (quebra) adicionar(numero || ultimoVersiculo, ' ');
  };
  visitar(raiz.get(0)!);
  if (!versos.size) throw new Error('Não foram encontrados versículos na página.');
  return [...versos].sort((a,b) => a[0]-b[0]).map(([verse, textos]) => ({ verse, text: textos.join('').normalize('NFC').replace(/\s+/g, ' ').trim() })).filter(verso => verso.text);
}
