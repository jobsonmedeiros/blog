import 'server-only';
import { getDatabase } from './db.ts';
import { unstable_cache } from 'next/cache';
import type { TextoCapitulo } from './livros-modelo';
export { validarTextoCapitulo } from './livros-modelo';
export type { TextoCapitulo } from './livros-modelo';

export type RascunhoCapitulo = TextoCapitulo & {
  caminho: string;
  tituloOriginal: string;
  textoOriginal: string;
  versao: number;
  atualizadoEm: string;
  publicado: TextoCapitulo | null;
};

export const TAG_LIVROS_PUBLICADOS = 'livros-traducoes-publicadas';

export const listarCapitulosPublicados = unstable_cache(
  async (): Promise<{ caminho: string; tituloRevisado: string }[]> => {
    const linhas = await getDatabase()`
      SELECT caminho, publicado->>'tituloRevisado' AS titulo
      FROM livros_traducoes
      WHERE publicado IS NOT NULL AND length(trim(publicado->>'textoRevisado')) > 0
      ORDER BY caminho
    `;
    return linhas.map(l => ({ caminho: String(l.caminho), tituloRevisado: String(l.titulo) }));
  },
  ['catalogo-livros-publicados'],
  { revalidate: 60, tags: [TAG_LIVROS_PUBLICADOS] }
);

export async function lerCapituloPublicado(caminho: string): Promise<(TextoCapitulo & { tituloOriginal: string; textoOriginal: string }) | null> {
  const linhas = await getDatabase().query(
    'SELECT publicado, titulo_original AS "tituloOriginal", texto_original AS "textoOriginal" FROM livros_traducoes WHERE caminho=$1 AND publicado IS NOT NULL',
    [caminho], { fetchOptions: { signal: AbortSignal.timeout(8000) } },
  );
  if (!linhas[0]) return null;
  return { ...(linhas[0].publicado as TextoCapitulo), tituloOriginal: String(linhas[0].tituloOriginal), textoOriginal: String(linhas[0].textoOriginal) };
}

export async function lerRascunhoCapitulo(caminho: string): Promise<RascunhoCapitulo | null> {
  const linhas = await getDatabase()`
    SELECT caminho, titulo_original AS "tituloOriginal", texto_original AS "textoOriginal",
      titulo_revisado AS "tituloRevisado", texto_revisado AS "textoRevisado",
      publicado, versao, atualizado_em AS "atualizadoEm"
    FROM livros_traducoes WHERE caminho=${caminho}
  `;
  return (linhas[0] as RascunhoCapitulo | undefined) ?? null;
}

export async function salvarCapitulo(
  caminho: string,
  tituloOriginal: string,
  textoOriginal: string,
  texto: TextoCapitulo,
  versao: number,
  publicar: boolean,
  autorId: string
) {
  const sql = getDatabase();
  const publicado = publicar ? JSON.stringify(texto) : null;
  const linhas = versao === 0
    ? await sql`
        INSERT INTO livros_traducoes (caminho, titulo_original, texto_original, titulo_revisado, texto_revisado, publicado, autor_id)
        VALUES (${caminho},${tituloOriginal},${textoOriginal},${texto.tituloRevisado},${texto.textoRevisado},${publicado}::jsonb,${autorId})
        ON CONFLICT (caminho) DO NOTHING
        RETURNING versao, atualizado_em AS "atualizadoEm"
      `
    : await sql`
        UPDATE livros_traducoes
        SET titulo_revisado=${texto.tituloRevisado}, texto_revisado=${texto.textoRevisado},
            publicado=CASE WHEN ${publicar} THEN ${publicado}::jsonb ELSE publicado END,
            versao=versao+1, autor_id=${autorId}, atualizado_em=now()
        WHERE caminho=${caminho} AND versao=${versao}
        RETURNING versao, atualizado_em AS "atualizadoEm"
      `;
  return linhas[0] as { versao: number; atualizadoEm: string } | undefined;
}
