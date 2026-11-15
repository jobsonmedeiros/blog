# Conforto das Escrituras 🕊️

Página de leitura e estudo das Sagradas Escrituras, desenvolvida com **Next.js 15** e **Tailwind CSS**.

## Funcionalidades

- 📖 **Bíblias** – Navegação por livros e capítulos com ACF local e ARA via bolls.life, com indicação das fontes
- 🕊️ **Versículo do Dia** – Rotação automática de 31 versículos curados
- ♫ **Música para leitura** – Chuva, floresta, oceano, instrumental contemplativo original e a playlist do [Hinar.io](https://hinar.io), iniciando em `001 — Aba, Pai`, avançando com o botão ou automaticamente ao terminar e retornando ao início depois da última faixa disponível
- 📚 **Espaço de Estudos** – Artigos, reflexões e indicações de leitura
- ✍️ **Área do autor** – Login protegido para publicar artigos em Markdown pelo celular ou computador
- 📱 **Responsivo** – Funciona em celular e desktop

## Tecnologias

- [Next.js 15](https://nextjs.org/) – Framework React
- [Tailwind CSS](https://tailwindcss.com/) – Estilos
- [bible-api.com](https://bible-api.com/) – API bíblica gratuita
- [Sociedade Bíblica do Brasil](https://www.sbb.org.br/biblia/) – referência institucional para as traduções bíblicas
- [Hinar.io](https://hinar.io) – repertório e player de músicas cristãs

As faixas do player são catalogadas a partir das páginas oficiais do Hinar.io. O arquivo [public/hinar-playlist.json](./public/hinar-playlist.json) preserva o título, a página de origem e o endereço do áudio instrumental de cada faixa disponível no catálogo, incluindo `001 — Aba, Pai` e `212 — Deus Cuidará de Ti`.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

## Deploy no Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) (gratuito)
2. Conecte seu repositório GitHub
3. Clique em **Deploy** – Vercel detecta Next.js automaticamente

### Publicação de artigos

1. Configure o projeto Neon e habilite Managed Auth com `neon.ts` (`neon deploy`).
2. Execute o SQL de [neon/schema.sql](./neon/schema.sql) no banco Neon.
3. Copie `.env.example` para `.env.local` e preencha `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` e `NEON_ADMIN_EMAIL`.
4. Configure as mesmas variáveis no Vercel e adicione o domínio do site aos trusted domains do Neon Auth.
5. Crie a conta administradora pelo fluxo de cadastro do Neon Auth e entre em `/login`.

As consultas ao banco passam por rotas do servidor. A senha do banco nunca deve receber o prefixo `NEXT_PUBLIC_`.

## Blog

👉 [confortodasescrituras.blogspot.com](https://confortodasescrituras.blogspot.com)
