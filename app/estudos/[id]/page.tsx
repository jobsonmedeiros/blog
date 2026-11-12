import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type FonteExterna = { nome: string; url: string };
type Artigo = {
  titulo: string;
  categoria: string;
  autor: string;
  leitura: string;
  corpo: string[];
  fontes: string[];
  fontesExternas?: FonteExterna[];
};

const FONTES_DARBY: FonteExterna[] = [
  { nome: "SermonIndex — pregações de J. N. Darby", url: "https://sermonindex.net/speakers/john-nelson-darby/" },
  { nome: "SermonIndex — notas de tradução de Darby", url: "https://www.sermonindex.net/commentary/darbynotes/" },
  { nome: "Internet Archive — escritos e Sinopse", url: "https://archive.org/details/DarbysWritingsNewTranslationNewTestamentSynopsisBooksBibleMulti" },
];

const ARTIGOS: Record<string, Artigo> = {
  "sete-dispensacoes": {
    titulo: "As Sete Dispensações: o Plano de Deus Através das Eras",
    categoria: "Dispensações",
    autor: "J. N. Darby",
    leitura: "8 min",
    fontes: ["2 Timóteo 2:15", "Gênesis 1–3; 4–8; 9–11; 12–Êxodo 19", "Romanos 4:3", "Efésios 1:3"],
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
    fontes: ["Efésios 2:19–22; 3:4–6", "1 Coríntios 12:7, 12–13", "Mateus 18:20", "Colossenses 1:18"],
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
    fontes: ["1 Tessalonicenses 4:16–17", "1 Coríntios 15:51–52", "Apocalipse 1:7; 19", "Apocalipse 3:10"],
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
    fontes: ["1 João 2:15", "2 Timóteo 2:22", "1 Coríntios 10–11", "Filipenses 3:20"],
    corpo: [
      "\"Não ameis o mundo nem o que no mundo há.\" — 1 João 2:15. Separação não é isolamento monástico: é pertencer a Cristo de tal modo que o sistema deste mundo — sua cobiça, seu orgulho, sua religião de aparência — perde o domínio sobre o coração.",
      "Os irmãos ensinam dupla separação: do mal moral e doutrinário, e para Deus. \"Aparta-te da injustiça\" e ao mesmo tempo \"segue a justiça, a fé, o amor, com os que, de coração puro, invocam o Senhor\" (2 Tm 2:22). Separar-se PARA a comunhão dos santos, não apenas DO erro.",
      "A Ceia do Senhor (1 Co 10–11) é o centro dessa comunhão: a mesa onde o pão e o cálice proclamam a morte do Senhor \"até que venha\". Participar dignamente exige exame próprio — não perfeição, mas juízo de si mesmo e confissão.",
      "Simplicidade marca o andar: sem ostentação, sem mundanismo na adoração, sem alianças desiguais (2 Co 6:14). O crente espera o Senhor do céu (Fp 3:20) — e quem tem essa esperança \"purifica-se a si mesmo, como ele é puro\" (1 Jo 3:3).",
    ],
  },
  "israel-e-assembleia": {
    titulo: "Israel e a Assembleia: duas esferas no plano de Deus",
    categoria: "Israel e a Assembleia",
    autor: "J. N. Darby",
    leitura: "9 min",
    fontes: ["Gênesis 12:1–3", "Romanos 9–11", "Efésios 2:11–22; 3:1–12", "Colossenses 3:1–4"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "A revelação bíblica apresenta mais de uma esfera de bênção. Israel recebeu promessas ligadas à terra, à descendência e ao governo do Messias; a Assembleia foi revelada como um mistério, formada pela união de judeus e gentios em um só Corpo.",
      "Essa distinção não cria dois caminhos de salvação. Toda bênção repousa na obra de Cristo e é recebida pela fé. O ponto é reconhecer a administração em que cada verdade foi dada: as promessas terrenas não devem ser transferidas automaticamente para a Assembleia, nem a posição celestial da Assembleia para Israel.",
      "Romanos 9–11 mantém as duas linhas em vista. Israel tropeçou, mas não foi rejeitado como objeto das promessas; a Assembleia participa hoje de uma bênção celestial e deve permanecer humilde, aguardando o cumprimento do propósito de Deus.",
      "Ler assim protege o texto de dois erros opostos: substituir Israel pela Igreja ou reduzir a Assembleia a uma versão religiosa de uma nação terrena. Em Cristo, o crente aguarda uma herança celestial e vive como peregrino.",
    ],
  },
  "esperanca-celestial": {
    titulo: "A esperança celestial do cristão",
    categoria: "A Assembleia",
    autor: "C. H. Mackintosh",
    leitura: "8 min",
    fontes: ["João 14:1–3", "Filipenses 3:20–21", "1 Tessalonicenses 1:9–10; 4:13–18", "Tito 2:11–14"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "A esperança cristã não é uma melhoria gradual do sistema presente. O Senhor Jesus virá buscar os Seus, transformará os corpos dos santos e os levará para estar com Ele. A promessa é pessoal: \"voltarei e vos receberei para mim mesmo\" (Jo 14:3).",
      "Essa esperança não produz especulação vazia. Ela orienta o coração para Cristo, livra da ambição mundana e torna o serviço mais urgente. A Igreja espera o Filho dos céus, não sinais para estabelecer o seu próprio reino.",
      "A distinção entre o arrebatamento e a manifestação em glória também preserva a ordem profética: a Assembleia é recebida pelo Senhor, enquanto o juízo público e o Reino aparecem nas profecias relativas à terra.",
      "Esperar o Senhor é viver diante dEle hoje. A esperança bem compreendida gera pureza, perseverança, consolo aos que dormem no Senhor e disposição para servir enquanto ainda é dia.",
    ],
  },
  "lei-e-graca": {
    titulo: "Lei e graça: responsabilidades distintas",
    categoria: "Dispensações",
    autor: "J. N. Darby",
    leitura: "8 min",
    fontes: ["Êxodo 19–20", "Romanos 3:19–26; 6:14", "Gálatas 3:19–25", "Efésios 2:8–10"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "A Lei foi dada a Israel como uma administração santa e justa. Ela revelou o padrão de Deus e tornou manifesto o pecado, mas não podia comunicar vida ao homem caído. Sua função não deve ser confundida com a posição do crente depois da cruz.",
      "Na graça, Deus não reduz Sua santidade: Ele age com base na obra consumada de Cristo. O pecador é justificado pela fé, recebe uma nova posição e aprende a andar pelo poder do Espírito, não para conquistar aceitação, mas porque já foi aceito no Amado.",
      "O dispensacionalismo distingue responsabilidades sem separar a unidade do propósito redentor. A Lei aponta para a necessidade de Cristo; a graça revela o que Deus fez em Cristo; o Reino manifestará publicamente a justiça do Rei.",
      "Aplicar a Lei como fundamento da consciência cristã produz temor servil ou orgulho religioso. Compreender a graça produz santidade por gratidão, obediência filial e dependência do Senhor.",
    ],
  },
  "reino-milenar": {
    titulo: "O Reino milenar e a restauração de Israel",
    categoria: "Profecia",
    autor: "William Kelly",
    leitura: "10 min",
    fontes: ["2 Samuel 7:12–16", "Isaías 11:1–10", "Ezequiel 36:22–28", "Apocalipse 20:1–6"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "As alianças feitas por Deus com Abraão e Davi não são alegorias sem cumprimento. Os profetas descrevem um reino terrestre de justiça, sob o governo do Messias, com Israel restaurado e as nações recebendo bênção.",
      "A Assembleia participa de uma posição celestial e reina com Cristo, mas isso não elimina a esfera terrena prometida a Israel. O futuro bíblico inclui ambas: Cristo é o centro de tudo, nos céus e na terra.",
      "Apocalipse 20 apresenta um período definido em que Satanás é preso e os santos reinam com Cristo. Depois do milênio vem o juízo final e o estado eterno, o que impede confundir o Reino administrado com a eternidade.",
      "A expectativa do Reino não autoriza projetos políticos de domínio cristão. Ela chama o crente a testemunhar com fidelidade e a aguardar o dia em que a justiça será estabelecida pelo próprio Rei.",
    ],
  },
  "remanescente-de-israel": {
    titulo: "O remanescente de Israel nas profecias",
    categoria: "Profecia",
    autor: "F. W. Grant",
    leitura: "8 min",
    fontes: ["Isaías 10:20–22", "Jeremias 30:7–11", "Zacarias 12:10; 13:8–9", "Romanos 11:25–29"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "Os profetas não tratam Israel como uma lembrança encerrada. Em meio ao juízo, Deus preserva um remanescente que reconhecerá o Messias e será preparado para a restauração prometida.",
      "O remanescente não é apresentado como mérito nacional. Ele é fruto da misericórdia soberana de Deus, que purifica, disciplina e conduz o povo ao arrependimento. A tribulação expõe a incredulidade, mas também separa os que esperam no Senhor.",
      "Romanos 11 coloca essa esperança no horizonte da fidelidade divina: os dons e a vocação de Deus são irrevogáveis. A Igreja não deve usar essa verdade para orgulho, mas para adoração e sobriedade.",
      "Ler os profetas com essa chave torna mais clara a diferença entre a presente vocação celestial da Assembleia e o futuro testemunho terreno do remanescente de Israel.",
    ],
  },
  "tipos-e-figuras": {
    titulo: "Tipos e figuras: Cristo no Antigo Testamento",
    categoria: "Interpretação",
    autor: "F. W. Grant",
    leitura: "9 min",
    fontes: ["Lucas 24:27, 44–45", "1 Coríntios 10:1–11", "Hebreus 8:1–6; 10:1", "Colossenses 2:16–17"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "Cristo é o centro da revelação. O próprio Senhor ensinou que Moisés, os Profetas e os Salmos apontavam para Ele. Por isso, personagens e instituições do Antigo Testamento podem funcionar como figuras de verdades maiores, sem que o sentido histórico seja descartado.",
      "Adão, José, Moisés, o cordeiro, o tabernáculo e as festas iluminam aspectos da pessoa e da obra de Cristo. A figura não substitui o cumprimento; ela prepara o leitor para reconhecer a realidade quando ela chega.",
      "A leitura tipológica precisa permanecer governada pelo texto. Não se trata de inventar significados ocultos, mas de seguir as conexões que o Novo Testamento estabelece e observar como a revelação progride.",
      "Esse método também mantém Israel em seu lugar histórico. As figuras nasceram em uma economia terrena, mas apontam para Cristo e, em alguns casos, para a Assembleia e para o Reino que ainda será manifestado.",
    ],
  },
  "casa-de-deus": {
    titulo: "A casa de Deus e a responsabilidade cristã",
    categoria: "A Assembleia",
    autor: "William Kelly",
    leitura: "8 min",
    fontes: ["1 Coríntios 3:9–17", "Efésios 2:19–22", "1 Timóteo 3:15", "1 Pedro 2:4–10"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "A Assembleia é o Corpo de Cristo, mas também é chamada casa de Deus. A primeira figura destaca a união viva com a Cabeça; a segunda traz a responsabilidade de como os homens constroem e se comportam na esfera do testemunho cristão.",
      "Paulo distingue o fundamento, que é Cristo, dos materiais usados na edificação. O exame do Senhor alcançará a qualidade da obra, não apenas sua aparência. Isso chama mestres e congregações a submissão à Palavra.",
      "A casa espiritual não depende de um edifício, de um título clerical ou de uma liturgia inventada. Deus habita pelo Espírito em Seu povo, e a ordem da reunião deve reconhecer a autoridade de Cristo e a ação dos dons.",
      "A doutrina deve produzir reverência prática: pureza, disciplina, cuidado pelos santos e responsabilidade no testemunho público. A liberdade cristã nunca é licença para desordem.",
    ],
  },
  "sete-festas": {
    titulo: "As festas de Jeová e o calendário profético",
    categoria: "Interpretação",
    autor: "C. H. Mackintosh",
    leitura: "9 min",
    fontes: ["Levítico 23", "1 Coríntios 5:7", "Atos 2:1–4", "Zacarias 14:16–19"],
    fontesExternas: FONTES_DARBY,
    corpo: [
      "Levítico 23 não é apenas um calendário cerimonial. As festas formam uma sequência que apresenta a obra de Cristo e os movimentos do propósito de Deus: a Páscoa, os pães sem fermento, as primícias e Pentecostes já encontram seu cumprimento fundamental no Novo Testamento.",
      "As festas do sétimo mês apontam para acontecimentos ligados à restauração profética: o ajuntamento, o arrependimento de Israel e o estabelecimento do Reino. A passagem preserva a diferença entre o que pertence à Assembleia e o que pertence ao calendário de Israel.",
      "A ordem é importante. Ela impede antecipar o Reino como se já fosse sua forma pública e também impede tratar o futuro de Israel como se tivesse sido cancelado pela presente bênção celestial.",
      "O estudo das festas deve terminar em Cristo, não em especulação. A cruz é o fundamento, a ressurreição inaugura uma nova ordem, o Espírito reúne a Assembleia e o Rei ainda será reconhecido publicamente.",
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

      <section className="mt-8 rounded-xl p-5" style={{ background: "var(--parchment-dark)", border: "1px solid rgba(169, 120, 24, 0.35)" }}>
        <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--gold)" }}>
          Fontes bíblicas
        </h2>
        <p className="font-sans text-sm mt-2 leading-relaxed" style={{ color: "var(--ink-light)" }}>
          As afirmações e citações deste estudo devem ser conferidas diretamente nas passagens abaixo. O texto exibido no leitor usa ACF local ou ARA via bolls.life.
        </p>
        <p className="font-sans text-sm mt-3" style={{ color: "var(--ink)" }}>
          {artigo.fontes.join(" · ")}
        </p>
        <a
          href="https://www.sbb.org.br/biblia/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs mt-3 inline-block"
          style={{ color: "var(--gold)", textDecoration: "underline" }}
        >
          Consultar a Sociedade Bíblica do Brasil ↗
        </a>
        {artigo.fontesExternas && (
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(169, 120, 24, 0.3)" }}>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--gold)" }}>
              Fontes históricas e de consulta
            </h3>
            <ul className="mt-2 flex flex-col gap-1">
              {artigo.fontesExternas.map((fonte) => (
                <li key={fonte.url}>
                  <a
                    href={fonte.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm"
                    style={{ color: "var(--ink-light)", textDecoration: "underline" }}
                  >
                    {fonte.nome} ↗
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-sans text-xs mt-3 leading-relaxed" style={{ color: "var(--ink-light)" }}>
              Este site resume e referencia o material; não reproduz integralmente livros ou sermões. Verifique a edição e as condições de uso na fonte original.
            </p>
          </div>
        )}
      </section>

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
