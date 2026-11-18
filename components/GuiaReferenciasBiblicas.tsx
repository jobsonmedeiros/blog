import Link from 'next/link';
import { bibleReferenceHref as criarLinkReferencia } from '@/lib/bible-links';

function ExemploBiblico({ referencia, texto = referencia }: { referencia: string; texto?: string }) {
  return <Link href={criarLinkReferencia(referencia)} className="underline underline-offset-4 text-[var(--gold)]" title={`Abrir ${referencia} no leitor`}>{texto}</Link>;
}

export default function GuiaReferenciasBiblicas() {
  return (
    <div id="guia-referencias-biblicas" className="font-sans text-base leading-relaxed text-[var(--ink-light)] space-y-6">
        <p>A referência bíblica funciona como um endereço. Em vez de procurar pelo número da página, que muda de uma edição para outra, procure três informações: <strong>livro, capítulo e versículo</strong>.</p>

        <section aria-labelledby="guia-endereco-biblico">
          <h2 id="guia-endereco-biblico" className="font-semibold text-base text-[var(--ink)] mb-2">1. A estrutura básica: livro, capítulo e versículo</h2>
          <p className="mb-3">A ordem é <strong>nome do livro → capítulo → versículo</strong>. Você pode encontrar a referência escrita como <ExemploBiblico referencia="João 3:16" texto="Jo 3,16" /> ou <ExemploBiblico referencia="João 3:16" texto="Jo 3:16" />.</p>
          <dl className="grid grid-cols-3 gap-2 rounded-lg bg-[var(--parchment)] border border-[var(--parchment-dark)] p-3 text-center">
            <div><dt className="text-xs">Livro</dt><dd className="text-xl font-semibold text-[var(--ink)]">João</dd></div>
            <div><dt className="text-xs">Capítulo</dt><dd className="text-xl font-semibold text-[var(--ink)]">3</dd></div>
            <div><dt className="text-xs">Versículo</dt><dd className="text-xl font-semibold text-[var(--ink)]">16</dd></div>
          </dl>
          <p className="mt-2">Leia assim: <em>“Evangelho de João, capítulo três, versículo dezesseis.”</em> O livro reúne os capítulos; cada capítulo é dividido em trechos numerados chamados versículos.</p>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li><strong>Jo</strong> é a abreviação do livro de João.</li>
            <li><strong>3</strong> indica o capítulo. Em muitas Bíblias impressas, o início do capítulo aparece com um número grande; aqui no site, ele aparece no título “João 3”.</li>
            <li><strong>16</strong> indica o versículo. É o número pequeno junto ao trecho do texto bíblico.</li>
          </ul>
          <p className="mt-2"><ExemploBiblico referencia="João 3:16" texto="Abrir João 3:16 para experimentar →" /></p>
        </section>

        <section aria-labelledby="guia-como-usar-leitor">
          <h2 id="guia-como-usar-leitor" className="font-semibold text-base text-[var(--ink)] mb-2">Como procurar aqui no site</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Escolha o livro.</strong> No celular, toque em <strong>Livros e capítulos</strong>. Na aba <strong>Livros</strong>, use a busca ou a lista e escolha João.</li>
            <li><strong>Escolha o capítulo.</strong> Na aba <strong>Capítulos</strong>, toque em 3. No celular, reabra o painel de livros e capítulos se ele tiver sido recolhido.</li>
            <li><strong>Encontre o versículo.</strong> No texto, procure o número pequeno 16. O título “João 3” informa o livro e o capítulo que você está lendo.</li>
          </ol>
          <p className="mt-3">Você também pode clicar nas citações do site: o leitor abre o trecho e destaca o versículo. Um toque seleciona o texto para marcar ou compartilhar; outro toque remove a seleção.</p>
        </section>

        <section aria-labelledby="guia-abreviacoes">
          <h2 id="guia-abreviacoes" className="font-semibold text-base text-[var(--ink)] mb-2">E quando o nome está abreviado?</h2>
          <p><strong>Jo</strong> significa João, <strong>Gn</strong> significa Gênesis e <strong>Sl</strong> significa Salmos. Assim, <ExemploBiblico referencia="João 3:16" texto="Jo 3:16" /> aponta para a mesma passagem de João 3:16.</p>
          <p className="mt-2">Um número <strong>antes do nome do livro</strong> faz parte do nome: <strong>1Co</strong> é a Primeira Carta aos Coríntios; <strong>2Rs</strong> é o Segundo Livro dos Reis. Da mesma forma, <strong>João</strong> e <strong>1 João</strong> são livros diferentes. Esse número inicial não é o capítulo.</p>
        </section>

        <section className="border-t border-[var(--parchment-dark)] pt-4" aria-labelledby="guia-pontuacao">
          <h2 id="guia-pontuacao" className="font-semibold text-lg text-[var(--ink)]">2. O que significam os sinais de pontuação?</h2>
          <div className="mt-3 space-y-3">
            <p>As convenções variam entre publicações. <strong>Neste site, usamos dois-pontos para separar capítulo e versículo</strong>, como em João 3:16.</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Vírgula ( , ) ou dois-pontos ( : ):</strong> podem separar o capítulo do versículo, conforme o padrão da publicação. <ExemploBiblico referencia="Salmos 23:1" texto="Sl 23,1" /> e <ExemploBiblico referencia="Salmos 23:1" texto="Sl 23:1" /> indicam Salmos, capítulo 23, versículo 1.</li>
              <li><strong>Hífen ou traço ( - ) significa “até”:</strong> <ExemploBiblico referencia="Mateus 5:1-4" texto="Mt 5,1-4" /> ou <ExemploBiblico referencia="Mateus 5:1-4" texto="Mt 5:1–4" /> indica Mateus, capítulo 5, do versículo 1 até o 4 — ou seja, 1, 2, 3 e 4. Leia o trecho inteiro, incluindo o primeiro e o último número.</li>
              <li><strong>Ponto pode separar versículos que não são consecutivos:</strong> <strong>Mc 1,1.5</strong> indica Marcos 1, versículo <ExemploBiblico referencia="Marcos 1:1" texto="1" /> e versículo <ExemploBiblico referencia="Marcos 1:5" texto="5" />. Os versículos 2 a 4 não estão incluídos nessa referência. Algumas publicações usam uma lista como <strong>Mc 1:1, 5</strong> para indicar os mesmos dois versículos.</li>
              <li><strong>Ponto e vírgula ( ; ) separa referências:</strong> <strong>Gn 1,1; 2,4</strong>, também escrito <strong>Gn 1:1; 2:4</strong>, manda consultar <ExemploBiblico referencia="Gênesis 1:1" /> e <ExemploBiblico referencia="Gênesis 2:4" />. Pode separar trechos de capítulos ou livros diferentes. Quando o nome do livro não se repete, ele continua sendo o mesmo; se aparecer outro nome, mude de livro.</li>
            </ul>
          </div>
        </section>

        <section className="border-t border-[var(--parchment-dark)] pt-4" aria-labelledby="guia-letras-notas">
          <h2 id="guia-letras-notas" className="font-semibold text-lg text-[var(--ink)]">3. O que significam as letras e as notas?</h2>
          <ul className="mt-3 list-disc pl-5 space-y-3">
            <li><strong>a, b ou c depois do número</strong> indica uma parte do versículo: a primeira, a segunda ou a terceira parte. Por exemplo, <ExemploBiblico referencia="Romanos 8:28" texto="Rm 8,28a" /> ou <ExemploBiblico referencia="Romanos 8:28" texto="Rm 8:28a" /> indica apenas a primeira parte de Romanos 8:28. A divisão pode variar conforme a citação. Nosso leitor abre o versículo completo para você conferir o contexto. O subtítulo do site usa a mesma ideia em <ExemploBiblico referencia="Marcos 6:31" texto="Marcos 6:31a" />.</li>
            <li><strong>s</strong> significa “e o seguinte”: <ExemploBiblico referencia="Lucas 2:1-2" texto="Lc 2,1s" /> ou <ExemploBiblico referencia="Lucas 2:1-2" texto="Lc 2:1s" /> inclui o versículo 1 e o seguinte, o versículo 2.</li>
            <li><strong>ss</strong> significa “e os seguintes”: <strong>Lc 2,1ss</strong> ou <strong>Lc 2:1ss</strong> começa no versículo 1 e continua nos próximos, como 2, 3 e 4. A indicação não determina um último versículo; observe o contexto da citação.</li>
            <li><strong>Letras pequenas elevadas</strong>, como em “amor<sup>a</sup>”, normalmente remetem a notas explicativas ou referências da edição. Elas não fazem parte do endereço bíblico e não são o número do versículo. Em uma Bíblia impressa, procure a nota de rodapé indicada na parte inferior da página; em uma edição digital, use a ferramenta de notas correspondente.</li>
          </ul>
          <div className="mt-4 rounded-lg border border-[var(--parchment-dark)] bg-[var(--parchment)] p-3">
            <h2 className="font-semibold text-[var(--ink)]">Um exemplo com várias indicações</h2>
            <p className="mt-2 font-semibold text-[var(--ink)]">1Jo 4,7-8.16a; Jo 3,16</p>
            <p className="mt-2">No padrão com dois-pontos usado no site, a mesma referência fica:</p>
            <p className="mt-2"><ExemploBiblico referencia="1 João 4:7-8" texto="1Jo 4:7–8" />.<ExemploBiblico referencia="1 João 4:16" texto="16a" />; <ExemploBiblico referencia="João 3:16" texto="Jo 3:16" /></p>
            <p className="mt-2">Leia: “Primeira Carta de João, capítulo 4, versículos 7 e 8, e também a primeira parte do versículo 16. Depois, Evangelho de João, capítulo 3, versículo 16.”</p>
          </div>
        </section>

        <p className="border-t border-[var(--parchment-dark)] pt-3"><strong>Uma boa prática:</strong> depois de encontrar o versículo, leia também o que vem antes e depois. Isso ajuda a compreender o contexto da passagem.</p>
    </div>
  );
}
