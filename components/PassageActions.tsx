"use client";
import { useEffect, useId, useState } from 'react';
import { biblePassageHref as criarLinkPassagem, type BiblePassage as PassagemBiblica } from '@/lib/bible-links';
import { verseShareText as montarTextoCompartilhamento, verseSocialLinks as criarLinksCompartilhamento } from '@/lib/verse-sharing';
import { createVerseImage as criarImagemVersiculo } from '@/lib/verse-image';

type Propriedades = {
  passagem: PassagemBiblica; referencia: string; texto: string; traducao: string;
  marcado: boolean; aoMarcar: () => void; aoLimpar: () => void;
  versaoLeitura?: string; idiomaLeitura?: string;
};

export default function AcoesDaPassagem({ passagem, referencia, texto, traducao, marcado, aoMarcar, aoLimpar, versaoLeitura, idiomaLeitura }: Propriedades) {
  const [aberto, definirAberto] = useState(false);
  const [situacao, definirSituacao] = useState('');
  const [avisoCopia, definirAvisoCopia] = useState('');
  const [mensagem, definirMensagem] = useState('');
  const identificadorMensagem = useId();
  const [imagemPreparada, definirImagemPreparada] = useState<{ chave: string; arquivo: File } | null>(null);
  const [falhaImagem, definirFalhaImagem] = useState<{ chave: string; mensagem: string } | null>(null);
  const chaveImagem = JSON.stringify([texto, referencia, traducao, mensagem]);
  const imagem = imagemPreparada?.chave === chaveImagem ? imagemPreparada.arquivo : null;
  const erroImagem = falhaImagem?.chave === chaveImagem ? falhaImagem.mensagem : '';
  const url = new URL(criarLinkPassagem(passagem, versaoLeitura, idiomaLeitura), window.location.origin).href;
  const textoCompartilhado = montarTextoCompartilhamento(texto, referencia, traducao, mensagem);
  const enderecos = criarLinksCompartilhamento(textoCompartilhado, url);

  useEffect(() => {
    if (!aberto) return;
    let cancelado = false;
    const temporizador = setTimeout(() => {
      criarImagemVersiculo(texto, referencia, traducao, mensagem)
        .then(arquivo => { if (!cancelado) definirImagemPreparada({ chave: chaveImagem, arquivo }); })
        .catch(erroCapturado => { if (!cancelado) definirFalhaImagem({ chave: chaveImagem, mensagem: erroCapturado instanceof Error ? erroCapturado.message : 'Imagem indisponível.' }); });
    }, 250);
    return () => { cancelado = true; clearTimeout(temporizador); };
  }, [aberto, texto, referencia, traducao, mensagem, chaveImagem]);

  const copiarVersiculo = async () => {
    try {
      await navigator.clipboard.writeText(montarTextoCompartilhamento(texto, referencia, traducao));
      definirAvisoCopia('Versículo copiado!');
    } catch {
      definirAvisoCopia('Não foi possível copiar. Selecione o texto e use a opção Copiar do dispositivo.');
    }
  };
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`${textoCompartilhado}\n\n${url}`);
      definirSituacao('Mensagem, versículo e link copiados.');
    } catch { definirSituacao('Não foi possível copiar. Use as opções de compartilhamento.'); }
  };
  const baixarImagem = () => {
    if (!imagem) return;
    const enderecoArquivo = URL.createObjectURL(imagem);
    const elementoLink = document.createElement('a');
    elementoLink.href = enderecoArquivo;
    elementoLink.download = imagem.name;
    elementoLink.click();
    setTimeout(() => URL.revokeObjectURL(enderecoArquivo), 1000);
    definirSituacao('Imagem baixada. Sua mensagem, se preenchida, está incluída na própria imagem.');
  };
  const instagram = async () => {
    if (!imagem) return;
    if (!navigator.canShare?.({ files: [imagem] })) { baixarImagem(); return; }
    try {
      // A mensagem já faz parte da imagem; o envio não depende de uma legenda.
      await navigator.share({ files: [imagem], title: referencia });
      definirSituacao('');
    } catch (erroCapturado) {
      if (erroCapturado instanceof Error && erroCapturado.name === 'AbortError') return;
      baixarImagem();
    }
  };
  const compartilharNoDispositivo = async () => {
    if (!navigator.share) { await copiar(); return; }
    try { await navigator.share({ title: referencia, text: textoCompartilhado, url }); }
    catch (erroCapturado) {
      if (erroCapturado instanceof Error && erroCapturado.name === 'AbortError') return;
      definirSituacao('Não foi possível abrir o compartilhamento. Use uma das redes abaixo.');
    }
  };
  const classeBotao = 'min-h-10 rounded-full border border-[var(--parchment-dark)] px-3 py-2 hover:bg-[var(--parchment-dark)] transition-colors';

  return (
    <aside aria-label={`Ações para ${referencia}`} className="rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-3 font-sans text-xs shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <strong className="mr-auto text-[var(--ink-light)]">{referencia}</strong>
        <button type="button" onClick={aoMarcar} aria-pressed={marcado} className={classeBotao} title={marcado ? 'Remover marca-texto desta passagem' : 'Salvar marca-texto nesta passagem'}>
          <svg aria-hidden="true" className="inline-block mr-1.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m13 3 8 8-9 9-8-8 9-9Z"/><path d="m4 12-2 6 4 4 6-2M2 22h14"/></svg>
          {marcado ? 'Desmarcar' : 'Marca-texto'}
        </button>
        <button type="button" onClick={copiarVersiculo} className={classeBotao} title="Copiar versículo com referência e tradução">Copiar</button>
        <button type="button" onClick={() => definirAberto(valor => !valor)} aria-expanded={aberto} className={classeBotao}>Compartilhar</button>
        <button type="button" onClick={aoLimpar} aria-label="Fechar seleção" className="min-h-10 min-w-10 rounded-full hover:bg-[var(--parchment-dark)]">✕</button>
      </div>
      {avisoCopia && <p className="mt-2 text-[var(--ink-light)]" role="status">{avisoCopia}</p>}
      {aberto && (
        <div className="mt-3 border-t border-[var(--parchment-dark)] pt-3">
          <label htmlFor={identificadorMensagem} className="block mb-1 font-medium">Sua mensagem (opcional)</label>
          <textarea id={identificadorMensagem} value={mensagem} onChange={evento => { definirMensagem(evento.target.value); definirSituacao(''); }} rows={2} maxLength={2000} placeholder="Escreva uma mensagem para acompanhar o versículo…" className="block w-full mb-3 rounded-lg border border-[var(--parchment-dark)] bg-[var(--surface)] p-2 text-sm resize-y" />
          <div className="flex flex-wrap gap-2">
            <a href={enderecos.whatsapp} target="_blank" rel="noopener noreferrer" className={classeBotao}>WhatsApp · texto e link</a>
            <a href={enderecos.facebook} target="_blank" rel="noopener noreferrer" className={classeBotao}>Facebook</a>
            <a href={enderecos.x} target="_blank" rel="noopener noreferrer" className={classeBotao}>X</a>
            <button type="button" onClick={instagram} disabled={!imagem} className={classeBotao}>Instagram / imagem</button>
            <button type="button" onClick={compartilharNoDispositivo} className={classeBotao}>Mais opções · texto</button>
            <button type="button" onClick={copiar} className={classeBotao}>Copiar texto e link</button>
          </div>
          <p className="mt-2 text-[var(--ink-light)]">WhatsApp envia sua mensagem, o versículo e o link como texto. Em “Instagram / imagem”, sua mensagem é incluída na própria imagem.</p>
          {['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) && (
            <p className="mt-1 text-[var(--ink-light)]">Para outras pessoas abrirem os links, use o endereço publicado do site.</p>
          )}
          <p className="mt-1 text-[var(--ink-light)]" role="status">{situacao || erroImagem || (!imagem ? 'Preparando imagem…' : '')}</p>
        </div>
      )}
    </aside>
  );
}
