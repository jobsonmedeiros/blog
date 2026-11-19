import VersiculoDoDia from "@/components/VersiculoDoDia";
import CatalogoTemasVersiculos from "@/components/CatalogoTemasVersiculos";
import type { Metadata } from "next";
import ReflexoesBreves from "@/components/ReflexoesBreves";
import { REFLEXOES_BREVES } from "@/data/reflexoesBreves";

export const metadata: Metadata = {
  title: "Versículo do Dia | Conforto das Escrituras",
};

export default function VersiculoPage() {
  return (
    <div className="site-container pt-4 md:pt-6 pb-10">
      <VersiculoDoDia tituloDaPagina />

      <ReflexoesBreves reflexoes={REFLEXOES_BREVES.map(({ slug, titulo, tema, resumo, referencias }) => ({ slug, titulo, tema, resumo, referencia: referencias[0] }))} />

      <CatalogoTemasVersiculos />
    </div>
  );
}
