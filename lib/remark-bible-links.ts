import { findScriptureCitations } from './scripture-citations.ts';

type MarkdownNode = { type: string; value?: string; url?: string; children?: MarkdownNode[]; data?: { hProperties: { className: string } } };

export default function remarkBibleLinks() {
  return (tree: unknown) => {
    const visit = (node: MarkdownNode) => {
      // Preserva destinos existentes, código e HTML, sem criar links aninhados.
      if (['link', 'linkReference', 'code', 'inlineCode', 'html'].includes(node.type) || !node.children) return;
      node.children = node.children.flatMap(child => {
        if (child.type !== 'text' || !child.value) { visit(child); return [child]; }
        const text = child.value;
        const result: MarkdownNode[] = [];
        let position = 0;
        for (const citation of findScriptureCitations(text)) {
          if (citation.start > position) result.push({ type: 'text', value: text.slice(position, citation.start) });
          result.push({ type: 'link', url: citation.href, data: { hProperties: { className: citation.kind === 'quote' ? 'bible-citation-text' : 'bible-citation-reference' } }, children: [{ type: 'text', value: text.slice(citation.start, citation.end) }] });
          position = citation.end;
        }
        if (position < text.length) result.push({ type: 'text', value: text.slice(position) });
        return result;
      });
    };
    visit(tree as MarkdownNode);
  };
}
