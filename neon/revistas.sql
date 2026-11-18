CREATE TABLE IF NOT EXISTS revistas_traducoes (
  caminho text PRIMARY KEY,
  titulo_original text NOT NULL,
  texto_original text NOT NULL,
  titulo_traduzido text NOT NULL DEFAULT '',
  texto_traduzido text NOT NULL DEFAULT '',
  publicado jsonb,
  versao integer NOT NULL DEFAULT 1,
  autor_id text NOT NULL,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
