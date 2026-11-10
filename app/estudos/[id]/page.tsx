import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const ARTIGOS: Record<string, { titulo: string; categoria: string; autor: string; leitura: string; corpo: string[] }> = {
  "introducao-salmos": {
    titulo: "Introdução ao Livro dos Salmos",
    categoria: "Poesia Bíblica",
    autor: "Equipe Editorial",
    leitura: "5 min",
    corpo: [
      "O livro dos Salmos é a maior coleção de poesia e hinos do Antigo Testamento. Com 150 salmos organizados em cinco livros, expressa toda a amplitude de emoções humanas diante de Deus — louvor, lamento, gratidão, arrependimento e esperança.",
      "Autores como Davi, Asafe, os filhos de Coré e Moisés contribuíram para essa coleção ao longo de séculos. A variedade de gêneros — salmos de louvor, de lamento, reais, sapienciais e de peregrinação — reflete a riqueza da espiritualidade do Israel antigo.",
      "O lamento, em especial, ocupa uma parte significativa do saltério. Longe de ser uma ausência de fé, o lamento bíblico é uma expressão corajosa e honesta de fé — trazer diante de Deus as dores mais profundas, confiando que Ele ouve.",
      "Para o leitor cristão, os Salmos ganham uma dimensão adicional: Jesus os citou frequentemente, e os primeiros cristãos enxergavam nos salmos a voz do Messias. Ler os Salmos é entrar numa conversa que atravessa séculos e chega até nós.",
      "\"Louvarei o Senhor enquanto eu viver; cantarei louvores ao meu Deus enquanto eu existir.\" — Salmos 146:2",
    ],
  },
  "sermao-monte": {
    titulo: "O Sermão do Monte: Uma Vida Transformada",
    categoria: "Ensino de Jesus",
    autor: "Equipe Editorial",
    leitura: "7 min",
    corpo: [
      "Em Mateus 5–7, Jesus apresenta o manifesto do Reino de Deus. As Bem-aventuranças não são meros conselhos morais, mas uma descrição do caráter formado em quem vive sob o reinado de Cristo.",
      "Jesus começa com uma inversão radical dos valores do mundo: 'Bem-aventurados os pobres em espírito' (Mt 5:3). Essa pobreza não é ausência de recursos, mas a consciência profunda da própria dependência de Deus — condição necessária para receber o Reino.",
      "O discurso avança para temas como a ira, o adultério, o divórcio, os juramentos, a retaliação e o amor aos inimigos. Em cada caso, Jesus vai além da letra da Lei para tocar a intenção do coração.",
      "Na oração, no jejum e na esmola, Jesus alerta contra a religiosidade performática — atos praticados para a aprovação humana. A autenticidade espiritual é cultivada na intimidade com o Pai.",
      "O sermão termina com a parábola dos dois construtores (Mt 7:24-27): a vida sobre a Rocha é aquela que não apenas ouve, mas pratica as palavras de Jesus.",
    ],
  },
  "fe-obras": {
    titulo: "Fé e Obras: A Tensão em Tiago e Paulo",
    categoria: "Teologia Prática",
    autor: "Equipe Editorial",
    leitura: "8 min",
    corpo: [
      "À primeira vista, Paulo e Tiago parecem contradizer-se sobre o papel da fé e das obras na salvação. Uma leitura contextual, porém, revela duas perspectivas complementares.",
      "Paulo, em Romanos e Gálatas, combate o legalismo — a ideia de que se ganha mérito diante de Deus pela prática de rituais ou pela observância da Lei. Para ele, a justificação é pela fé em Cristo, não pelas obras da Lei.",
      "Tiago, por outro lado, enfrenta um problema diferente: um antinomismo descuidado — a ideia de que, por sermos salvos pela graça, nossas ações não importam. Para ele, 'a fé sem obras é morta' (Tg 2:17) — uma fé que não transforma a conduta não é fé genuína.",
      "Ambos os apóstolos apontam para a mesma realidade: quem genuinamente confia em Cristo é transformado por essa confiança. As obras não são o meio da salvação, mas o fruto inevitável de uma fé viva.",
      "A resolução da tensão está em perceber que Paulo e Tiago falam de coisas diferentes quando usam a palavra 'obras' — e que, no fundo, ambos apontam para uma fé que é real, viva e transformadora.",
    ],
  },
  "oracao-senhor": {
    titulo: "A Oração do Senhor: Modelo de Comunhão",
    categoria: "Vida de Oração",
    autor: "Equipe Editorial",
    leitura: "6 min",
    corpo: [
      "O Pai-Nosso (Mt 6:9-13) não é uma fórmula mágica a ser repetida mecanicamente, mas um modelo de como nos aproximarmos de Deus. Cada petição revela uma dimensão da relação do crente com o Pai.",
      "'Pai nosso que estás nos céus' — a oração começa afirmando uma relação. Não nos dirigimos a um Deus distante e impessoal, mas ao Pai que nos adotou em Cristo.",
      "'Santificado seja o teu nome' — antes de pedir qualquer coisa para nós, a oração coloca a glória de Deus no centro. A santificação do nome divino é o horizonte de toda a vida cristã.",
      "'Venha o teu reino, seja feita a tua vontade' — uma oração de submissão radical. Reconhecemos que nossos planos e desejos precisam curvar-se à vontade perfeita do Pai.",
      "'O pão nosso de cada dia nos dá hoje' — dependência cotidiana. A oração nos ensina a buscar a Deus não apenas nas grandes crises, mas nos momentos ordinários do dia a dia.",
      "'Perdoa as nossas dívidas, assim como nós perdoamos' — a conexão entre receber e conceder perdão é inescapável no ensino de Jesus. Quem foi muito perdoado tem muito a perdoar.",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const artigo = ARTIGOS[id];
  return { title: artigo ? `${artigo.titulo} | Estudos` : "Artigo não encontrado" };
}

export default async function ArtigoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artigo = ARTIGOS[id];
  if (!artigo) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/estudos"
        className="font-sans text-sm mb-6 inline-block"
        style={{ color: "var(--gold)" }}
      >
        ← Voltar aos Estudos
      </Link>

      <div
        className="inline-block font-sans text-xs px-3 py-1 rounded-full mb-4"
        style={{ background: "var(--parchment-dark)", color: "var(--gold)" }}
      >
        {artigo.categoria}
      </div>

      <h1
        className="text-4xl mb-3 leading-tight"
        style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontWeight: 600 }}
      >
        {artigo.titulo}
      </h1>

      <p className="font-sans text-sm mb-6" style={{ color: "var(--ink-light)" }}>
        {artigo.autor} • {artigo.leitura} de leitura
      </p>

      <hr className="gold-divider" />

      <div className="mt-6 flex flex-col gap-5">
        {artigo.corpo.map((paragrafo, i) => (
          <p
            key={i}
            className="text-xl leading-relaxed"
            style={{
              color: "var(--ink)",
              fontFamily: "'Crimson Pro', serif",
              fontStyle: paragrafo.startsWith('"') ? "italic" : "normal",
            }}
          >
            {paragrafo}
          </p>
        ))}
      </div>

      <hr className="gold-divider mt-10" />

      <div className="flex justify-between mt-4">
        <Link href="/estudos" className="font-sans text-sm" style={{ color: "var(--gold)" }}>
          ← Mais artigos
        </Link>
        <Link href="/leitura" className="font-sans text-sm" style={{ color: "var(--gold)" }}>
          Ir para leitura →
        </Link>
      </div>
    </div>
  );
}
