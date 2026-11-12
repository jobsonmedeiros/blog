# Conforto das Escrituras 🕊️

Página de leitura e estudo das Sagradas Escrituras, desenvolvida com **Next.js 15** e **Tailwind CSS**.

## Funcionalidades

- 📖 **Bíblias** – Navegação por livros e capítulos com ACF local e ARA via bolls.life, com indicação das fontes
- 🕊️ **Versículo do Dia** – Rotação automática de 31 versículos curados
- ♫ **Música para leitura** – Chuva, floresta, oceano, instrumental contemplativo original e a playlist do [Hinar.io](https://hinar.io), iniciando em `001 — Aba, Pai`, avançando com o botão ou automaticamente ao terminar e retornando ao início depois da última faixa disponível
- 📚 **Espaço de Estudos** – Artigos, reflexões e indicações de leitura
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

## Blog

👉 [confortodasescrituras.blogspot.com](https://confortodasescrituras.blogspot.com)
