# Conforto das Escrituras 🕊

Site dedicado à leitura e ao estudo da Bíblia em um ambiente tranquilo, acolhedor e acessível, desenvolvido com **Next.js 16**, **TypeScript**, **Tailwind CSS** e **Supabase**.

## Funcionalidades

* 📖 **Leitura Bíblica e Temas** – Navegação por livros e capítulos com tradução ACF local e ARA via `bolls.life`, além de busca organizada por temas de versículos.
* 🕊 **Versículo do Dia** – Destaque diário na página inicial com rotação automática de 31 versículos curados para reflexão rápida.
* ♫ **Música para Leitura** – Sons ambientes (chuva, floresta, oceano), instrumental contemplativo original e a playlist do Hinar.io (iniciando em *001 — Aba, Pai*), avançando automaticamente ou por controle manual.
* 📚 **Espaço de Estudos** – Artigos, reflexões e devocionais em Markdown exibidos na página inicial e na seção dedicada de Estudos.
* 🔐 **Painel Administrativo (`/admin`)** – Área restrita protegida com login por e-mail e senha (`/login`), contendo editor Markdown com pré-visualização em tempo real para publicar, editar, salvar rascunhos e excluir artigos.
* 📱 **Design Responsivo** – Interface limpa e adaptada para leitura confortável em celulares, tablets e computadores.

## Tecnologias Utilizadas

* **Next.js 16 & React** – Estrutura das páginas, rotas estáticas/dinâmicas e funcionalidades da aplicação.
* **TypeScript** – Tipagem estática para maior segurança e manutenção do código.
* **Tailwind CSS** – Estilização e layout responsivo.
* **Supabase (Auth & PostgreSQL)** – Autenticação de administradores e banco de dados para artigos com políticas **RLS (Row Level Security)**.
* **React Markdown & remark-gfm** – Renderização e pré-visualização de artigos formatados em Markdown.
* **APIs e Conteúdo Bíblico** – Base local (ACF), `bolls.life` (ARA), `bible-api.com` e referências institucionais da Sociedade Bíblica do Brasil.
* **Hinar.io** – Repertório e catálogo de músicas cristãs instrumentais (`public/hinar-playlist.json`).
* **Vercel** – Hospedagem e deploy contínuo.

## Configuração e Instalação Local

### 1. Clonar e instalar dependências

```bash
git clone https://github.com
cd blog
npm install
```

### 2. Configurar o Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com).
2. Acesse o **SQL Editor** no painel do projeto e execute o script contido em `supabase/schema.sql` para criar a tabela de artigos e as regras de segurança (RLS).
3. Vá em **Authentication → Users** e crie o usuário administrativo (e-mail e senha) que terá acesso ao `/admin`.

### 3. Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com as credenciais do seu projeto Supabase:

```bash
cp .env.example .env.local
```

Preencha as chaves no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` para visualizar o site e `http://localhost:3000/login` para entrar no painel administrativo.

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e importe este repositório do GitHub.
2. Nas configurações do projeto na Vercel, adicione as mesmas variáveis de ambiente definidas no `.env.example` (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Clique em **Deploy** – a Vercel detectará automaticamente o Next.js e publicará o site.

## Blog Oficial

👉 [Blog]([https://://blogspot.com](https://confortodasescrituras.blogspot.com/))
