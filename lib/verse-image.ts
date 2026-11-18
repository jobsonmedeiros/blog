// Cartão gerado inteiramente no navegador, sem enviar o texto a outro serviço.
export async function createVerseImage(text: string, reference: string, translation: string, message = ''): Promise<File> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Não foi possível preparar a imagem neste navegador.');
  const width = 1080;
  const fontSize = text.length > 500 ? 40 : 48;
  const wrap = (content: string, size: number) => {
    context.font = `${size}px Georgia`;
    const result: string[] = [];
    for (const paragraph of content.split(/\r?\n/)) {
      let line = '';
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        if (context.measureText(word).width <= width - 180) {
          const next = line ? `${line} ${word}` : word;
          if (line && context.measureText(next).width > width - 180) {
            result.push(line);
            line = word;
          } else line = next;
        } else {
          // Dividir apenas palavras maiores que a linha evita cortar mensagens.
          if (line) result.push(line);
          line = '';
          for (const character of Array.from(word)) {
            if (context.measureText(line + character).width > width - 180 && line) {
              result.push(line);
              line = '';
            }
            line += character;
          }
        }
      }
      result.push(line.trim());
    }
    return result;
  };
  const lines = wrap(`“${text}”`, fontSize);
  const messageLines = message.trim() ? wrap(message.trim(), 36) : [];
  const lineHeight = Math.ceil(fontSize * 1.4);
  const contentHeight = lines.length * lineHeight + 80 + (messageLines.length ? 100 + messageLines.length * 52 : 0);
  const height = Math.max(1080, contentHeight + 360);
  if (height > 8192) throw new Error('Para criar uma imagem, selecione um trecho menor.');
  canvas.width = width;
  canvas.height = height;
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#182124');
  gradient.addColorStop(1, '#34413c');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#d9b866';
  context.lineWidth = 2;
  context.strokeRect(40, 40, width - 80, height - 80);
  context.textAlign = 'center';
  context.fillStyle = '#d9b866';
  context.font = '26px Georgia';
  context.fillText('CONFORTO DAS ESCRITURAS', width / 2, 115);
  context.fillStyle = '#f7f3eb';
  context.font = `${fontSize}px Georgia`;
  const firstY = Math.max(230, (height - contentHeight) / 2);
  lines.forEach((textLine, index) => context.fillText(textLine, width / 2, firstY + index * lineHeight));
  context.fillStyle = '#d9b866';
  context.font = '30px Georgia';
  const referenceY = firstY + lines.length * lineHeight + 25;
  context.fillText(`${reference} · ${translation}`, width / 2, referenceY);
  if (messageLines.length) {
    context.font = '22px Georgia';
    context.fillText('MENSAGEM PESSOAL', width / 2, referenceY + 85);
    context.fillStyle = '#f7f3eb';
    context.font = '36px Georgia';
    messageLines.forEach((messageLine, index) => context.fillText(messageLine, width / 2, referenceY + 140 + index * 52));
  }
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Não foi possível criar a imagem.')), 'image/png'));
  return new File([blob], `versiculo-${reference.replace(/[^a-zA-Z0-9]+/g, '-')}.png`, { type: 'image/png' });
}
