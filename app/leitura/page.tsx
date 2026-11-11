import LeitorBiblico from "@/components/LeitorBiblico";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leitura Bíblica | Conforto das Escrituras",
};

export default function LeituraPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1
          className="text-4xl mb-2"
          style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 300 }}
        >
          📖 Leitura das Escrituras
        </h1>
        <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
          Escolha o livro e capítulo no painel ao lado • Use o botão ♫ para som ambiente
        </p>
        <hr className="gold-divider w-32 mx-auto" />
      </div>

      <div
        className="rounded-xl border"
        style={{ borderColor: "var(--parchment-dark)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", background: "var(--parchment)" }}
      >
        <LeitorBiblico />
      </div>
    </div>
  );
}
