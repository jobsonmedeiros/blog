import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const ARTIGOS: Record<string, { titulo: string; categoria: string; autor: string; leitura: string; corpo: string[] }> = {
  "sete-dispensacoes": {
    titulo: "As Sete Dispensações: o Plano de Deus Através das Eras",
    categoria: "Dispensações",
    autor: "J. N. Darby",
    leitura: "8 min",
    corpo: [
      "\"Procura apresentar-te a Deus aprovado... que maneja bem a palavra da verdade.\" — 2 Timóteo 2:15. Manejar bem a Palavra exige discernir a quem Deus fala em cada passagem: nem toda ordem dada a Israel se aplica à Assembleia, nem toda promessa feita à Assembleia pertence a Israel.",
      "Os irmãos de Plymouth ensinam sete dispensações — modos distintos pelos quais Deus provou a responsabilidade do homem: (1) Inocência (Gn 1–3): Adão no Éden, cai; (2) Consciência (Gn 4–8): o homem guiado pela consciência, termina no dilúvio; (3) Governo Humano (Gn 9–11): a espada confiada a Noé, termina em Babel; (4) Promessa (Gn 12–Êx 19): Abraão e a descendência, termina na escravidão do Egito; (5) Lei (Êx 20–At 2): Israel sob o pacto do Sinai, termina na cruz; (6) Graça (At 2–Ap 3): a Assembleia reunida pelo Espírito, termina no arrebatamento; (7) Reino (Ap 20): o milênio sob o cetro de Cristo.",
      "Em cada dispensação o homem fracassa — e esse é justamente o ponto: cada era prova que a criatura, deixada a si mesma, não permanece de pé. O fracasso não frustra Deus; revela a necessidade da graça e prepara o Reino onde Cristo mesmo reinará.",
      "A salvação, porém, sempre foi pela fé: Abraão \"creu no Senhor, e isso lhe foi imputado como justiça\" (Gn 15:6) séculos antes da Lei. O que muda entre as dispensações não é o meio da salvação, mas a medida de luz e responsabilidade confiada ao homem.",
      "Quem confunde as dispensações mistura Lei com Graça: exige guarda de sábado da Assembleia ou leva promessas terrenas de Israel (terra, prosperidade) para o Corpo celestial de Cristo, cuja bênção é \"nos lugares celestiais\" (Ef 1:3).",
    ],
  },
  "assembleia-misterio": {
    titulo: "A Assembleia: o Mistério Revelado a Paulo",
    categoria: "A Assembleia",
    autor: "William Kelly",
    leitura: "7 min",
    corpo: [
      "\"O mistério... que em outras gerações não foi dado a conhecer... como agora foi revelado... a saber, que os gentios são coherdeiros, membros do mesmo corpo.\" — Efésios 3:4-6. A Assembleia não foi profetizada no Antigo Testamento: foi um mistério escondido em Deus e revelado ao apóstolo Paulo.",
      "Israel era uma nação terrena, com território, sacerdócio hereditário e bênçãos condicionais. A Assembleia é um organismo celestial: um só Corpo (1 Co 12), uma só Esposa (Ef 5), um só edifício crescendo para morada de Deus no Espírito (Ef 2:22).",
      "Os irmãos rejeitam a divisão entre clero e leigos como invenção humana: \"a vós todos foi dada esta graça\" e cada membro recebe dons do Espírito para a edificação (1 Co 12:7; Ef 4). Nenhum homem preside como cabeça — Cristo é a Cabeça (Cl 1:18), e onde dois ou três se reúnem ao Seu Nome, Ele está no meio (Mt 18:20).",
      "Por isso as assembleias dos irmãos se reúnem com simplicidade: sem títulos, sem liturgia imposta por homens, com a Ceia toda semana como centro, e disciplina segundo Mateus 18. Não porque a forma salve, mas porque a Escritura basta como ordem para a casa de Deus.",
      "\"Edificarei a minha igreja, e as portas do inferno não prevalecerão contra ela.\" — Mateus 16:18",
    ],
  },
  "arrebatamento-vinda": {
    titulo: "O Arrebatamento e a Vinda: Duas Fases Distintas",
    categoria: "Profecia",
    autor: "F. W. Grant",
    leitura: "7 min",
    corpo: [
      "Há dois eventos futuros que muitos confundem num só: Cristo vindo PARA os Seus e Cristo vindo COM os Seus. A primeira é o arrebatamento; a segunda, a manifestação em glória. Entre elas, a tribulação e o juízo sobre este mundo.",
      "No arrebatamento (1 Ts 4:16-17; 1 Co 15:51-52), o Senhor desce até as nuvens e os santos — mortos ressuscitados e vivos transformados — são levados ao encontro dEle nos ares. É um evento de graça, sem juízo, para a Assembleia: \"e assim estaremos sempre com o Senhor.\"",
      "Na vinda em glória (Jd 14; Zc 14; Ap 19), Cristo desce à terra com os Seus santos para julgar as nações, livrar o remanescente de Israel e estabelecer o Reino milenar. \"Todo olho o verá\" (Ap 1:7) — nada de secreto aqui.",
      "Essa distinção protege duas verdades: a Assembleia não passa pela tribulação — é guardada \"da hora da tentação\" (Ap 3:10) — e Israel tem futuro: Deus ainda cumprirá as alianças terrenas com o remanescente (Rm 11:26).",
      "\"Eis que venho sem demora... Amém. Ora vem, Senhor Jesus.\" — Apocalipse 22:20",
    ],
  },
  "separacao-ceia": {
    titulo: "Separação do Mundo e a Ceia do Senhor",
    categoria: "Vida Cristã",
    autor: "C. H. Mackintosh",
    leitura: "6 min",
    corpo: [
      "\"Não ameis o mundo nem o que no mundo há.\" — 1 João 2:15. Separação não é isolamento monástico: é pertencer a Cristo de tal modo que o sistema deste mundo — sua cobiça, seu orgulho, sua religião de aparência — perde o domínio sobre o coração.",
      "Os irmãos ensinam dupla separação: do mal moral e doutrinário, e para Deus. \"Aparta-te da injustiça\" e ao mesmo tempo \"segue a justiça, a fé, o amor, com os que, de coração puro, invocam o Senhor\" (2 Tm 2:22). Separar-se PARA a comunhão dos santos, não apenas DO erro.",
      "A Ceia do Senhor (1 Co 10–11) é o centro dessa comunhão: a mesa onde o pão e o cálice proclamam a morte do Senhor \"até que venha\". Participar dignamente exige exame próprio — não perfeição, mas juízo de si mesmo e confissão.",
      "Simplicidade marca o andar: sem ostentação, sem mundanismo na adoração, sem alianças desiguais (2 Co 6:14). O crente espera o Senhor do céu (Fp 3:20) — e quem tem essa esperança \"purifica-se a si mesmo, como ele é puro\" (1 Jo 3:3).",
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
        style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 600 }}
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
              fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif",
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
