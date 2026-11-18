import 'server-only';
import { getDatabase } from './db.ts';
import type { RascunhoRevista, TextoRevista } from './revistas-modelo';
import { chaveArtigoRevista } from './revistas-modelo.ts';
import { unstable_cache } from 'next/cache';
import type { EntradaRevista } from './revistas-modelo';

export const TAG_TRADUCOES_PUBLICADAS = 'revistas-traducoes-publicadas';
export const listarTraducoesPublicadas = unstable_cache(async (): Promise<EntradaRevista[]> => {
  const linhas = await getDatabase()`SELECT caminho, publicado->>'tituloTraduzido' AS titulo
    FROM revistas_traducoes
    WHERE publicado IS NOT NULL AND length(trim(publicado->>'textoTraduzido')) > 0
      AND length(trim(publicado->>'tituloTraduzido')) > 0
    ORDER BY publicado->>'tituloTraduzido'`;
  return linhas.map(linha => ({ caminho: String(linha.caminho), titulo: String(linha.titulo) }));
}, ['catalogo-traducoes-publicadas'], { revalidate: 60, tags: [TAG_TRADUCOES_PUBLICADAS] });

export async function lerTraducaoPublicada(caminho: string): Promise<TextoRevista | null> {
  caminho = chaveArtigoRevista(caminho);
  const linhas = await getDatabase()`SELECT publicado FROM revistas_traducoes WHERE caminho=${caminho}`;
  return (linhas[0]?.publicado as TextoRevista | null) ?? null;
}
export async function lerRascunhoRevista(caminho: string): Promise<RascunhoRevista | null> {
  caminho = chaveArtigoRevista(caminho);
  const linhas = await getDatabase()`SELECT caminho, titulo_original AS "tituloOriginal", texto_original AS "textoOriginal",
    titulo_traduzido AS "tituloTraduzido", texto_traduzido AS "textoTraduzido", publicado, versao, atualizado_em AS "atualizadoEm"
    FROM revistas_traducoes WHERE caminho=${caminho}`;
  return (linhas[0] as RascunhoRevista | undefined) ?? null;
}
export async function salvarTraducaoRevista(caminho: string, texto: TextoRevista, versao: number, publicar: boolean, autorId: string) {
  caminho = chaveArtigoRevista(caminho);
  const sql = getDatabase();
  const publicado = publicar ? JSON.stringify(texto) : null;
  const linhas = versao === 0
    ? await sql`INSERT INTO revistas_traducoes (caminho, titulo_original, texto_original, titulo_traduzido, texto_traduzido, publicado, autor_id)
      VALUES (${caminho},${texto.tituloOriginal},${texto.textoOriginal},${texto.tituloTraduzido},${texto.textoTraduzido},${publicado}::jsonb,${autorId})
      ON CONFLICT (caminho) DO NOTHING RETURNING versao, atualizado_em AS "atualizadoEm"`
    : await sql`UPDATE revistas_traducoes SET titulo_original=${texto.tituloOriginal}, texto_original=${texto.textoOriginal},
      titulo_traduzido=${texto.tituloTraduzido}, texto_traduzido=${texto.textoTraduzido},
      publicado=CASE WHEN ${publicar} THEN ${publicado}::jsonb ELSE publicado END,
      versao=versao+1, autor_id=${autorId}, atualizado_em=now()
      WHERE caminho=${caminho} AND versao=${versao} RETURNING versao, atualizado_em AS "atualizadoEm"`;
  return linhas[0] as { versao: number; atualizadoEm: string } | undefined;
}
