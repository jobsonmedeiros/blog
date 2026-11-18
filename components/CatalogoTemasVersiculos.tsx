import { TEMAS_VERSICULOS } from '@/data/temasVersiculos';
import BuscaTemasVersiculos from './BuscaTemasVersiculos';

export default function CatalogoTemasVersiculos() {
  const temas = TEMAS_VERSICULOS.map(({ slug, titulo, letra, resumo, referencia, texto, passagens }) => ({ slug, titulo, letra, resumo, referencia, texto, quantidade: passagens.length }));
  return <section className="mt-8" aria-labelledby="temas-titulo">
    <header className="text-center mb-5">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Escrituras para leitura e meditação</p>
      <h2 id="temas-titulo" className="text-3xl mt-2 font-light">Versículos por tema</h2>
      <p className="font-sans text-sm mt-2 text-[var(--ink-light)]">{temas.length} temas e {TEMAS_VERSICULOS.reduce((soma, tema) => soma + tema.passagens.length, 0)} passagens na Almeida Corrigida Fiel.</p>
    </header>
    <BuscaTemasVersiculos temas={temas} />
  </section>;
}
