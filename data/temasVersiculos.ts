export type TemaVersiculo = {
  slug: string;
  titulo: string;
  letra: string;
  texto: string;
  referencia: string;
  imagem: string;
  resumo: string;
};

export const TEMAS_VERSICULOS: TemaVersiculo[] = [
  {
    slug: "adoracao",
    titulo: "Adoração",
    letra: "A",
    texto: "Ó Senhor, tu és o meu Deus; exaltar-te-ei e louvarei o teu nome.",
    referencia: "Isaías 25:1",
    imagem: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    resumo: "Reconheça a grandeza de Deus e responda a ela com louvor.",
  },
  {
    slug: "alegria",
    titulo: "Alegria",
    letra: "A",
    texto: "Alegrem-se sempre no Senhor! Repito: alegrem-se!",
    referencia: "Filipenses 4:4",
    imagem: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
    resumo: "A alegria cristã nasce da presença de Deus, mesmo em dias difíceis.",
  },
  {
    slug: "amor",
    titulo: "Amor",
    letra: "A",
    texto: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.",
    referencia: "1 Coríntios 13:4",
    imagem: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
    resumo: "O amor revela o caráter de Deus nas relações e nas escolhas diárias.",
  },
  {
    slug: "ansiedade",
    titulo: "Ansiedade",
    letra: "A",
    texto: "Não andem ansiosos por coisa alguma, mas em tudo apresentem seus pedidos a Deus.",
    referencia: "Filipenses 4:6",
    imagem: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    resumo: "Leve suas preocupações a Deus em oração e confiança.",
  },
  {
    slug: "coragem",
    titulo: "Coragem",
    letra: "C",
    texto: "Sejam fortes e corajosos. Não se apavorem nem desanimem, pois o Senhor estará com vocês.",
    referencia: "Josué 1:9",
    imagem: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    resumo: "A presença de Deus sustenta passos firmes diante dos desafios.",
  },
  {
    slug: "esperanca",
    titulo: "Esperança",
    letra: "E",
    texto: "As misericórdias do Senhor são a causa de não sermos consumidos; renovam-se cada manhã.",
    referencia: "Lamentações 3:22-23",
    imagem: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    resumo: "A fidelidade de Deus abre um novo começo a cada manhã.",
  },
  {
    slug: "familia",
    titulo: "Família",
    letra: "F",
    texto: "Eu e a minha família serviremos ao Senhor.",
    referencia: "Josué 24:15",
    imagem: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    resumo: "A fé também é cultivada no cuidado e no serviço dentro de casa.",
  },
  {
    slug: "fe",
    titulo: "Fé",
    letra: "F",
    texto: "A fé é o firme fundamento das coisas que se esperam e a prova das coisas que não se veem.",
    referencia: "Hebreus 11:1",
    imagem: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    resumo: "Crer é descansar nas promessas de Deus antes de enxergar o resultado.",
  },
  {
    slug: "forca",
    titulo: "Força",
    letra: "F",
    texto: "Os que esperam no Senhor renovam as suas forças.",
    referencia: "Isaías 40:31",
    imagem: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    resumo: "A espera em Deus não é passividade: é fonte de renovação.",
  },
  {
    slug: "gratidao",
    titulo: "Gratidão",
    letra: "G",
    texto: "Deem graças em todas as circunstâncias, pois esta é a vontade de Deus.",
    referencia: "1 Tessalonicenses 5:18",
    imagem: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    resumo: "A gratidão muda o olhar e reconhece a bondade de Deus no caminho.",
  },
  {
    slug: "luz",
    titulo: "Luz",
    letra: "L",
    texto: "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.",
    referencia: "Salmos 119:105",
    imagem: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    resumo: "A Palavra orienta decisões e ilumina o próximo passo.",
  },
  {
    slug: "paz",
    titulo: "Paz",
    letra: "P",
    texto: "A paz de Deus, que excede todo o entendimento, guardará os vossos corações.",
    referencia: "Filipenses 4:7",
    imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    resumo: "A paz de Deus guarda o coração mesmo quando as circunstâncias não mudam.",
  },
  {
    slug: "perdao",
    titulo: "Perdão",
    letra: "P",
    texto: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente.",
    referencia: "Efésios 4:32",
    imagem: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    resumo: "O perdão recebido de Deus se transforma em graça oferecida ao próximo.",
  },
  {
    slug: "proposito",
    titulo: "Propósito",
    letra: "P",
    texto: "Eu é que sei que pensamentos tenho a vosso respeito, pensamentos de paz e não de mal.",
    referencia: "Jeremias 29:11",
    imagem: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    resumo: "Deus conduz a história com esperança, mesmo quando o futuro parece incerto.",
  },
  {
    slug: "protecao",
    titulo: "Proteção",
    letra: "P",
    texto: "O Senhor guardará a tua saída e a tua entrada, desde agora e para sempre.",
    referencia: "Salmos 121:8",
    imagem: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    resumo: "A presença do Senhor acompanha cada saída, chegada e recomeço.",
  },
  {
    slug: "oracao",
    titulo: "Oração",
    letra: "O",
    texto: "Pedi e dar-se-vos-á; buscai e encontrareis; batei e abrir-se-vos-á.",
    referencia: "Mateus 7:7",
    imagem: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    resumo: "A oração aproxima o coração de Deus e nos ensina a buscar sua vontade.",
  },
  {
    slug: "refugio",
    titulo: "Refúgio",
    letra: "R",
    texto: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
    referencia: "Salmos 46:1",
    imagem: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    resumo: "Em Deus encontramos abrigo, força e companhia no tempo da angústia.",
  },
  {
    slug: "salvacao",
    titulo: "Salvação",
    letra: "S",
    texto: "Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
    referencia: "João 3:16",
    imagem: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    resumo: "A salvação é a expressão maior do amor de Deus em Cristo.",
  },
  {
    slug: "sabedoria",
    titulo: "Sabedoria",
    letra: "S",
    texto: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
    referencia: "Provérbios 3:5",
    imagem: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    resumo: "A sabedoria começa quando entregamos nossos caminhos ao Senhor.",
  },
];

export const LETRAS_TEMAS = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode("A".charCodeAt(0) + index)
);

const NOMES_TEMAS = [
  "Admiração", "Adoração", "Alegria", "Aliança", "Alimento", "Alma", "Amizade", "Amor", "Anjos",
  "Aprender", "Arrependimento", "Ascensão", "Autocontrole",
  "Batismo", "Beleza", "Bem", "Benção", "Busca",
  "Canto", "Casamento", "Céu", "Chamada", "Colheita", "Compaixão", "Compreensão", "Comunidade",
  "Confiabilidade", "Confiança", "Confissão", "Consolador", "Contentamento", "Conversão", "Coração",
  "Coragem", "Corpo", "Criação", "Crianças", "Crucificação", "Cura",
  "Dar", "Dependência", "Desejos", "Deus", "Diabo", "Dinheiro", "Dívidas", "Doença",
  "Egoísmo", "Encorajamento", "Equipamentos", "Escravidão", "Esperança", "Espírito",
  "Espírito Santo", "Evangelização",
  "Falar", "Família", "Fé", "Fiel", "Fim dos tempos", "Fofoca", "Força", "Fraqueza", "Frutos",
  "Ganância", "Generosidade", "Gentileza", "Graça", "Gratidão", "Guerra espiritual",
  "Honestidade", "Humildade",
  "Ídolos", "Igreja", "Inferno", "Irrepreensível",
  "Jejum", "Jesus", "Julgamento", "Justiça",
  "Lei", "Liberdade", "Louvor", "Luz",
  "Mal", "Materialismo", "Mediador", "Medo", "Mente", "Mentir", "Messias", "Milagres",
  "Misericórdia", "Morte", "Mundo",
  "Natal",
  "Obediência", "Oração", "Órfãos", "Orgulho", "Ouvir",
  "Paciência", "Pai", "Palavra de Deus", "Pão", "Páscoa", "Paz", "Pecado", "Pensamentos",
  "Pentecostes", "Perdão", "Perseguição", "Planejamento", "Pobreza", "Preocupação", "Profecia",
  "Promessas", "Proteção", "Proximidade", "Punição", "Purificação",
  "Raiva", "Recebimento", "Recompensa", "Reconciliação", "Reconhecer", "Redentor", "Reino",
  "Relacionamentos", "Renascimento", "Ressurreição", "Resto", "Roupas",
  "Sábado", "Sabedoria", "Sacrifício", "Salvação", "Salvador", "Sangue", "Santidade", "Saúde",
  "Seguir", "Segunda vinda", "Segurança", "Servir", "Sexualidade", "Sofrimento", "Superação",
  "Tentação", "Todo-Poderoso", "Trabalho", "Transformação", "Tristeza",
  "Valioso", "Verdade", "Vício", "Vida", "Vida eterna", "Vinho", "Viúvas", "Vizinho",
];

function slugificar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const TEMAS_INDICE = NOMES_TEMAS.map((titulo) => {
  const slug = slugificar(titulo);
  const letra = slug.charAt(0).toUpperCase();
  return {
    slug,
    titulo,
    letra,
    fonteUrl: `https://dailyverses.net/pt/${slug}`,
  };
});

export function encontrarTema(slug: string) {
  return TEMAS_VERSICULOS.find((tema) => tema.slug === slug);
}
