import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import adicionarLinksBiblicosMarkdown from '@/lib/remark-bible-links';
export default function ConteudoArtigo({ conteudo }: { conteudo: string }) {
  return <div className="article-content"><ReactMarkdown remarkPlugins={[remarkGfm, adicionarLinksBiblicosMarkdown]}>{conteudo}</ReactMarkdown></div>;
}
