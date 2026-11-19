-- Tabela de traduções de capítulos de livros de Darby
-- Mesma estrutura de revistas_traducoes, chave = livro_id/slug_capitulo
CREATE TABLE IF NOT EXISTS livros_traducoes (
  caminho text PRIMARY KEY,         -- ex: "sobre-disciplina/introducao-sobre-disciplina-darby-j-n"
  titulo_original text NOT NULL,    -- título do original em inglês ou referência da edição importada
  texto_original text NOT NULL,     -- uma cópia do original, imutável após o primeiro salvamento
  titulo_revisado text NOT NULL DEFAULT '',   -- título revisado/editado pelo autor
  texto_revisado text NOT NULL DEFAULT '',    -- texto revisado/editado pelo autor
  publicado jsonb,                  -- snapshot publicado: { tituloRevisado, textoRevisado }
  versao integer NOT NULL DEFAULT 1,
  autor_id text NOT NULL,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
