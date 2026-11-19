import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ObraAcervo } from './acervo-obras.ts';
import originais from '../data/darby/originais/indice.json' with { type: 'json' };

export type CapituloLivro = { slug: string; titulo: string; url: string; idioma?: 'en' | 'pt-BR' };
export type IndiceCapitulos = CapituloLivro[];

/** Caminho-chave de um capítulo: "livro-id/slug-capitulo" */
export function chaveCapitulo(livroId: string, capSlug: string) {
  return `${livroId}/${capSlug}`;
}

/** Lê o índice de capítulos de um livro do arquivo local. */
export function lerIndiceCapitulos(livroId: string): IndiceCapitulos {
  if (!livroIdValido(livroId)) return [];
  const original = originais.find(item => item.livroId === livroId);
  if (original) return [{ slug: 'original', titulo: original.titulo, url: original.url, idioma: 'en' }];
  const caminho = join(process.cwd(), 'data/darby/livros', livroId, 'indice.json');
  if (!existsSync(caminho)) return [];
  try {
    return JSON.parse(readFileSync(caminho, 'utf8')) as IndiceCapitulos;
  } catch {
    return [];
  }
}

/** Lê o texto português local de um capítulo. */
export function lerTextoCapitulo(livroId: string, capSlug: string): string | null {
  if (!livroIdValido(livroId) || !capituloSlugValido(capSlug)) return null;
  if (capSlug === 'original' && originais.some(item => item.livroId === livroId)) {
    const arquivo = join(process.cwd(), 'data/darby/originais', `${livroId}.txt`);
    return existsSync(arquivo) ? readFileSync(arquivo, 'utf8').trim() : null;
  }
  const caminho = join(process.cwd(), 'data/darby/livros', livroId, `${capSlug}.txt`);
  if (!existsSync(caminho)) return null;
  try {
    return readFileSync(caminho, 'utf8').trim();
  } catch {
    return null;
  }
}

/** Lê o texto português local de um artigo. */
export function lerTextoArtigo(artigoId: string): string | null {
  if (!capituloSlugValido(artigoId)) return null;
  const caminho = join(process.cwd(), 'data/darby/artigos', `${artigoId}.txt`);
  if (!existsSync(caminho)) return null;
  try {
    return readFileSync(caminho, 'utf8').trim();
  } catch {
    return null;
  }
}

/** Encontra o capítulo anterior e próximo no índice. */
export function navegacaoCapitulo(indice: IndiceCapitulos, capSlug: string) {
  const idx = indice.findIndex(c => c.slug === capSlug);
  return {
    anterior: idx > 0 ? indice[idx - 1] : null,
    proximo: idx >= 0 && idx < indice.length - 1 ? indice[idx + 1] : null,
    atual: idx >= 0 ? indice[idx] : null,
    posicao: idx + 1,
    total: indice.length,
  };
}

/** Verifica se um livroId é válido (apenas letras, números e hífens). */
export function livroIdValido(id: unknown): id is string {
  return typeof id === 'string' && /^[a-z0-9-]{3,120}$/.test(id);
}

/** Verifica se um slug de capítulo é válido. */
export function capituloSlugValido(slug: unknown): slug is string {
  return typeof slug === 'string' && /^[a-z0-9-]{3,200}$/.test(slug);
}

/** Encontra a obra no acervo pelo ID. */
export function encontrarLivro(acervo: ObraAcervo[], livroId: string): ObraAcervo | undefined {
  return acervo.find(o => o.id === livroId && o.tipo === 'livro');
}

export type TextoCapitulo = { tituloRevisado: string; textoRevisado: string };
export function validarTextoCapitulo(valor: unknown): TextoCapitulo {
  if (!valor || typeof valor !== 'object') throw new Error('Texto inválido.');
  const dados = valor as Record<string, unknown>;
  for (const campo of ['tituloRevisado', 'textoRevisado']) {
    const limite = campo === 'tituloRevisado' ? 500 : 300000;
    if (typeof dados[campo] !== 'string' || (dados[campo] as string).length > limite) throw new Error('Confira o tamanho e o formato dos textos.');
  }
  return { tituloRevisado: (dados.tituloRevisado as string).trim(), textoRevisado: (dados.textoRevisado as string).trim() };
}
