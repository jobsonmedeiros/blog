import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Como traduzir a leitura | Revistas | Conforto das Escrituras',
  description: 'Como ler Darby em português e usar a tradução do navegador como auxílio, mantendo o acesso ao original.',
};

export default function PostComoTraduzirLeitura() {
  return (
    <article className="site-container py-8 md:py-10">
      <Link href="/revistas" className="font-sans text-sm text-[var(--gold)]">← Revistas</Link>
      <p className="font-sans text-xs uppercase tracking-wider mt-6 mb-2 text-[var(--gold)]">Como ler a Bíblia</p>
      <h1 className="text-3xl sm:text-4xl leading-tight mb-3">Como traduzir a leitura</h1>
      <p className="font-sans text-base text-[var(--ink-light)]">Use o português como auxílio e mantenha o texto original disponível para conferir o contexto.</p>
      <p className="font-sans text-xs mt-3 text-[var(--ink-light)]">Conforto das Escrituras · 3 min de leitura</p>
      <hr className="gold-divider" />
      <div className="font-sans text-base leading-relaxed text-[var(--ink-light)] space-y-6">
        <section>
          <h2 className="font-semibold text-lg text-[var(--ink)] mb-2">Darby: português dentro do próprio leitor</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Abra <Link href="/leitura" className="underline underline-offset-4 text-[var(--gold)]">Bíblias</Link> e escolha a versão <strong>Darby</strong>.</li>
            <li>No controle de idioma, toque em <strong>Ler em português</strong>. Os versículos são traduzidos conforme o serviço responde.</li>
            <li>Para conferir o inglês, use <strong>Original em inglês</strong>. O texto original continua disponível.</li>
          </ol>
          <p className="mt-3">Trechos com revisão e fonte verificadas têm prioridade quando estiverem disponíveis. Na ausência deles, o leitor usa tradução automática, identificada com <strong>“auto”</strong>. Esse auxílio pode conter imprecisões e não é uma edição portuguesa oficial de Darby.</p>
          <p className="mt-3">O serviço recebe somente o texto bíblico e tem limite diário. Se a tradução não estiver disponível, o leitor mantém o inglês e oferece a opção de tentar novamente. As versões ACF e ARA já apresentam o texto em português.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg text-[var(--ink)] mb-2">Traduzir uma página pelo navegador</h2>
          <p>Se você estiver lendo uma página em outro idioma, o navegador também pode oferecer tradução. Essa opção altera a exibição da página; não muda a versão bíblica escolhida no site.</p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li><strong>No Chrome no computador:</strong> procure a opção de tradução na barra de endereço ou clique com o botão direito na página e escolha traduzir para português.</li>
            <li><strong>No Chrome no celular:</strong> abra o menu do navegador e procure <strong>Traduzir</strong>. As opções podem variar conforme o aparelho e a versão do navegador.</li>
          </ul>
          <p className="mt-3">Quando disponível, você também pode selecionar um trecho e usar a tradução da seleção. Para estudar uma expressão, compare o resultado com o texto original e leia o contexto.</p>
          <a href="https://support.google.com/chrome/answer/173424?hl=pt-BR" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm underline underline-offset-4 text-[var(--gold)]">Consultar as instruções oficiais do Chrome ↗</a>
        </section>
      </div>
      <div className="mt-8 pt-5 border-t border-[var(--parchment-dark)] flex flex-wrap items-center justify-between gap-4 font-sans text-sm">
        <Link href="/leitura" className="btn-primary">Voltar à leitura da Bíblia →</Link>
        <Link href="/revistas" className="text-[var(--gold)]">Ver revistas</Link>
      </div>
    </article>
  );
}
