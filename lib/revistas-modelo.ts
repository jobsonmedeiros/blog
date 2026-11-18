export type EntradaRevista = { titulo: string; caminho: string };
export type GrupoRevistas = { id: string; titulo: string; descricao?: string; vazio?: string; itens: EntradaRevista[] };
export type PaginaRevista = {
  caminho: string; titulo: string; texto: string; autor: string;
  itens: EntradaRevista[]; anteriores: EntradaRevista[];
};
export type TextoRevista = {
  tituloOriginal: string; textoOriginal: string;
  tituloTraduzido: string; textoTraduzido: string;
};
export type RascunhoRevista = TextoRevista & {
  caminho: string; versao: number; atualizadoEm: string;
  publicado: TextoRevista | null;
};

// Apenas páginas da biblioteca; nunca aceita um domínio, parâmetros ou redirecionamento externo.
export function caminhoRevistaValido(caminho: unknown): caminho is string {
  return typeof caminho === 'string' && caminho.length <= 600
    && /^\/(?:[a-z0-9-]+\/)*(?:lpvl\d+|lpv\d+-\d+|lac\d+-lpv-\d+-\d+|la\d+)$/.test(caminho);
}

// O mesmo artigo pode aparecer em mais de um volume. Sua tradução é identificada pelo número da fonte.
export function chaveArtigoRevista(caminho: string) {
  const numero = caminho.match(/\/la(?:c)?(\d+)(?:-lpv-\d+-\d+)?$/)?.[1];
  return numero ? `/la${numero}` : caminho;
}

export function artigoRevista(caminho: string) {
  return caminhoRevistaValido(caminho) && /\/la(?:c)?\d+(?:-lpv-\d+-\d+)?$/.test(caminho);
}

// As duas coleções espanholas têm originais próprios; não são traduções portuguesas.
export function idiomaOriginalRevista(caminho: string): 'en' | 'es' {
  return /\/(tu-juventud|palabras-de-edificacion-exhortacion-y-consolacion)\//.test(caminho) ? 'es' : 'en';
}

export function validarTextoRevista(valor: unknown): TextoRevista {
  if (!valor || typeof valor !== 'object') throw new Error('Texto inválido.');
  const dados = valor as Record<string, unknown>;
  for (const campo of ['tituloOriginal', 'textoOriginal', 'tituloTraduzido', 'textoTraduzido']) {
    const limite = campo.startsWith('titulo') ? 500 : 300000;
    if (typeof dados[campo] !== 'string' || (dados[campo] as string).length > limite) throw new Error('Confira o tamanho e o formato dos textos.');
  }
  if (!(dados.tituloOriginal as string).trim() || !(dados.textoOriginal as string).trim()) throw new Error('O título e o texto original são obrigatórios.');
  return {
    tituloOriginal: (dados.tituloOriginal as string).trim(), textoOriginal: (dados.textoOriginal as string).trim(),
    tituloTraduzido: (dados.tituloTraduzido as string).trim(), textoTraduzido: (dados.textoTraduzido as string).trim(),
  };
}
