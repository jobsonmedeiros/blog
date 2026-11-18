import type { CmsArticle } from './article-utils.ts';

// Modelo usado nas páginas. Os nomes em inglês ficam somente na conversão
// para os contratos já existentes do banco e da API de artigos.
export type ArtigoDoPainel = {
  id: string; slug: string; titulo: string; categoria: string; autor: string;
  tempoLeitura: string; resumo: string; icone: string; conteudo: string;
  publicadoEm: string | null;
};
export type FormularioArtigo = Omit<ArtigoDoPainel, 'id' | 'slug' | 'publicadoEm'> & { id?: string; publicado: boolean };

export function converterArtigoParaPainel(artigo: CmsArticle): ArtigoDoPainel {
  return {
    id: artigo.id, slug: artigo.slug, titulo: artigo.title, categoria: artigo.category,
    autor: artigo.author, tempoLeitura: artigo.reading_time, resumo: artigo.excerpt,
    icone: artigo.emoji, conteudo: artigo.content, publicadoEm: artigo.published_at,
  };
}

export function converterFormularioParaApi(formulario: FormularioArtigo) {
  return {
    title: formulario.titulo, category: formulario.categoria, author: formulario.autor,
    reading_time: formulario.tempoLeitura, excerpt: formulario.resumo, emoji: formulario.icone,
    content: formulario.conteudo, published: formulario.publicado,
  };
}
