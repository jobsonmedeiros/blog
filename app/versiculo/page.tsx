import VersiculoDoDia from "@/components/VersiculoDoDia";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Versículo do Dia | Conforto das Escrituras",
};

const REFLEXOES = [
  {
    titulo: "A Paz que Excede o Entendimento",
    texto:
      "Em momentos de ansiedade, Deus nos convida a lançar sobre Ele todos os nossos cuidados. Não porque os problemas desapareçam, mas porque na presença d'Ele encontramos uma paz que a razão não consegue explicar — uma paz que guarda o coração e a mente.",
    ref: "Fp 4:6-7",
  },
  {
    titulo: "Força na Fraqueza",
    texto:
      "Há uma paradoxo profundo no evangelho: é justamente em nossa fraqueza que a força de Deus se manifesta com plenitude. Quando reconhecemos nossa limitação e dependência, abrimos espaço para que a graça divina opere poderosamente.",
    ref: "2 Co 12:9",
  },
  {
    titulo: "A Fidelidade de Deus",
    texto:
      "Ao longo de toda a Escritura, Deus demonstra ser fiel às Suas promessas. Mesmo quando o caminho parece incerto e as circunstâncias adversas, podemos ancorar nossa esperança no caráter imutável d'Aquele que não falha.",
    ref: "Lm 3:22-23",
  },
];

export default function VersiculoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1
          className="text-4xl mb-2"
          style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontWeight: 300 }}
        >
          🕊️ Versículo do Dia
        </h1>
        <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
          Uma palavra para cada dia — renovação diária pela Escritura
        </p>
        <hr className="gold-divider w-32 mx-auto" />
      </div>

      <VersiculoDoDia />

      {/* Reflexões */}
      <section className="mt-14">
        <h2
          className="text-2xl mb-6 text-center"
          style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif" }}
        >
          Reflexões Breves
        </h2>
        <div className="flex flex-col gap-6">
          {REFLEXOES.map((r, i) => (
            <article key={i} className="card p-6">
              <h3
                className="text-xl mb-3"
                style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontWeight: 600 }}
              >
                {r.titulo}
              </h3>
              <p
                className="text-lg leading-relaxed mb-3"
                style={{ color: "var(--ink-light)", fontFamily: "'Crimson Pro', serif" }}
              >
                {r.texto}
              </p>
              <span
                className="font-sans text-xs px-3 py-1 rounded-full"
                style={{ background: "var(--parchment-dark)", color: "var(--gold)" }}
              >
                {r.ref}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
