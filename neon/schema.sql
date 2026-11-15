create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id text not null,
  slug text not null unique,
  title text not null,
  category text not null default 'Reflexão',
  author text not null default 'Conforto das Escrituras',
  reading_time text not null default '5 min',
  excerpt text not null,
  emoji text not null default '📖',
  content text not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);