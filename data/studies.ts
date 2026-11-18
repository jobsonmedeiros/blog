import { REFLEXOES_BREVES } from './reflexoesBreves.ts';

export const ARTIGOS = [
  ...REFLEXOES_BREVES.map(reflexao => ({
    id: `reflexao-${reflexao.slug}`, categoria: 'Reflexões Breves', titulo: reflexao.titulo,
    resumo: reflexao.resumo, autor: 'Conforto das Escrituras', leitura: '2 min', emoji: '🕊️',
  })),
  {
    id: 'como-traduzir-a-leitura',
    categoria: 'Como ler a Bíblia',
    titulo: 'Como traduzir a leitura',
    resumo: 'Veja como ler Darby em português, voltar ao original inglês e usar a tradução do navegador como auxílio de leitura.',
    autor: 'Conforto das Escrituras',
    leitura: '3 min',
    emoji: '🌐',
  },
  {
    id: 'como-ler-citacoes-biblicas',
    categoria: 'Como ler a Bíblia',
    titulo: 'Como ler citações bíblicas',
    resumo: 'Aprenda a encontrar livro, capítulo e versículo e a entender abreviações, sinais de pontuação, letras e notas nas referências bíblicas, com exemplos para praticar no leitor.',
    autor: 'Conforto das Escrituras',
    leitura: '6 min',
    emoji: '📖',
  },
  {
    id: "sete-dispensacoes",
    categoria: "Dispensações",
    titulo: "As Sete Dispensações: o Plano de Deus Através das Eras",
    resumo:
      "Deus trata com o homem de modos distintos em cada era — Inocência, Consciência, Governo, Promessa, Lei, Graça e Reino. Entender essa divisão (2 Tm 2:15) desfaz confusões e mostra que a salvação sempre foi pela fé, mas a responsabilidade do homem muda em cada dispensação.",
    autor: "J. N. Darby",
    leitura: "8 min",
    emoji: "📜",
  },
  {
    id: "assembleia-misterio",
    categoria: "A Assembleia",
    titulo: "A Assembleia: o Mistério Revelado a Paulo",
    resumo:
      "A Assembleia (o Corpo de Cristo) não existia no Antigo Testamento: foi um mistério escondido e revelado a Paulo (Ef 3). Não é organização humana nem clero e leigos — é um organismo vivo, reunido só ao Nome do Senhor, com Cristo no meio.",
    autor: "William Kelly",
    leitura: "7 min",
    emoji: "⛪",
  },
  {
    id: "arrebatamento-vinda",
    categoria: "Profecia",
    titulo: "O Arrebatamento e a Vinda: Duas Fases Distintas",
    resumo:
      "Os irmãos ensinam a distinção entre Cristo vindo PARA os Seus (arrebatamento, 1 Ts 4) e vindo COM os Seus (manifestação em glória, Jd 14). Confundir as duas fases embaralha Israel com a Assembleia e a Graça com o Reino.",
    autor: "F. W. Grant",
    leitura: "7 min",
    emoji: "🎺",
  },
  {
    id: "separacao-ceia",
    categoria: "Vida Cristã",
    titulo: "Separação do Mundo e a Ceia do Senhor",
    resumo:
      "Separados do mal e separados para Deus: a mesa do Senhor (1 Co 10–11) é o centro da comunhão dos santos. Exame próprio, simplicidade e santidade — sem mundanismo — marcam o andar de quem espera o Senhor.",
    autor: "C. H. Mackintosh",
    leitura: "6 min",
    emoji: "🍞",
  },
  {
    id: "israel-e-assembleia",
    categoria: "Israel e a Assembleia",
    titulo: "Israel e a Assembleia: duas esferas no plano de Deus",
    resumo:
      "A profecia apresenta Israel como povo terreno, enquanto as epístolas revelam a Assembleia como Corpo de Cristo e povo celestial. Distinguir essas esferas preserva o sentido das promessas e evita aplicar à Igreja o calendário profético de Israel.",
    autor: "J. N. Darby",
    leitura: "9 min",
    emoji: "🕎",
  },
  {
    id: "esperanca-celestial",
    categoria: "A Assembleia",
    titulo: "A esperança celestial do cristão",
    resumo:
      "A vocação da Assembleia não é conquistar um reino terreno, mas aguardar o Senhor vindo do céu. A esperança do arrebatamento molda o andar presente: sobriedade, separação do mundo e serviço enquanto o Noivo é esperado.",
    autor: "C. H. Mackintosh",
    leitura: "8 min",
    emoji: "✨",
  },
  {
    id: "lei-e-graca",
    categoria: "Dispensações",
    titulo: "Lei e graça: responsabilidades distintas",
    resumo:
      "A Lei revelou o pecado e provou a responsabilidade de Israel; a graça anuncia uma obra consumada e uma posição em Cristo. O dispensacionalismo não diminui a santidade: ele coloca cada verdade no contexto em que Deus a revelou.",
    autor: "J. N. Darby",
    leitura: "8 min",
    emoji: "⚖️",
  },
  {
    id: "reino-milenar",
    categoria: "Profecia",
    titulo: "O Reino milenar e a restauração de Israel",
    resumo:
      "As promessas feitas aos patriarcas não são absorvidas pela Igreja. Depois do juízo, Cristo reinará em justiça, Israel será restaurado e as nações serão abençoadas sob o governo do Messias, antes da consumação final.",
    autor: "William Kelly",
    leitura: "10 min",
    emoji: "👑",
  },
  {
    id: "remanescente-de-israel",
    categoria: "Profecia",
    titulo: "O remanescente de Israel nas profecias",
    resumo:
      "A Escritura distingue a incredulidade nacional do remanescente que será preservado. Essa linha profética atravessa os Salmos, os Profetas e o Apocalipse e demonstra que Deus não abandona Suas promessas a Israel.",
    autor: "F. W. Grant",
    leitura: "8 min",
    emoji: "🌿",
  },
  {
    id: "tipos-e-figuras",
    categoria: "Interpretação",
    titulo: "Tipos e figuras: Cristo no Antigo Testamento",
    resumo:
      "Adão, José, Moisés, o tabernáculo e as festas apontam para Cristo sem apagar o sentido histórico das passagens. A leitura tipológica dos irmãos une a revelação progressiva à distinção entre Israel e a Assembleia.",
    autor: "F. W. Grant",
    leitura: "9 min",
    emoji: "🕯️",
  },
  {
    id: "casa-de-deus",
    categoria: "A Assembleia",
    titulo: "A casa de Deus e a responsabilidade cristã",
    resumo:
      "A Assembleia é vista como Corpo, casa e templo do Espírito. Essas figuras mostram tanto a união vital com Cristo quanto a responsabilidade de edificar com materiais que resistam ao exame do Senhor.",
    autor: "William Kelly",
    leitura: "8 min",
    emoji: "🏛️",
  },
  {
    id: "sete-festas",
    categoria: "Interpretação",
    titulo: "As festas de Jeová e o calendário profético",
    resumo:
      "As festas de Levítico 23 formam uma sequência profética: cruz, ressurreição, formação da Assembleia e os acontecimentos ligados à restauração de Israel. A ordem bíblica ajuda a distinguir o que já se cumpriu do que ainda aguarda cumprimento.",
    autor: "C. H. Mackintosh",
    leitura: "9 min",
    emoji: "🌾",
  },
];
