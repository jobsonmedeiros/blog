import LeitorBiblico from "@/components/BibleReader";
import type { Metadata } from "next";
import { parseBiblePassage as interpretarPassagemBiblica } from "@/lib/bible-links";
import { parseBibleTranslation as interpretarVersaoBiblica } from "@/lib/bible-translations";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Bíblias | Conforto das Escrituras",
};

export default async function LeituraPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const consulta = await searchParams;
  const destino = interpretarPassagemBiblica(consulta);
  const versao = interpretarVersaoBiblica(consulta.traducao);
  const portugues = versao === 'DBY' && consulta.idioma === 'pt';
  return (
    <div className="w-full min-w-0 max-w-6xl mx-auto px-3 sm:px-4 pt-3">
      <header className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 mb-2">
        <h1
          className="text-xl sm:text-2xl"
          style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 300 }}
        >
          📖 Bíblias
        </h1>
      <nav aria-label="Ajuda para a leitura" className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
        <Link href="/revistas/como-ler-citacoes-biblicas" className="text-[var(--gold)] underline underline-offset-4">Como ler citações bíblicas</Link>
        <Link href="/revistas/como-traduzir-a-leitura" className="text-[var(--gold)] underline underline-offset-4">Como traduzir a leitura</Link>
      </nav>
      </header>
      <p className="font-sans text-sm sm:text-base leading-relaxed text-[var(--ink-light)] mt-3 mb-4">Clique ou toque em um versículo para compartilhar ou usar o marca-texto. Para selecionar um trecho, arraste sobre o texto.</p>

      <div
        className="rounded-xl border"
        style={{ borderColor: "var(--parchment-dark)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", background: "var(--parchment)" }}
      >
        <LeitorBiblico key={JSON.stringify([destino, versao, portugues])} destino={destino} versao={versao} portugues={portugues} />
      </div>
    </div>
  );
}
