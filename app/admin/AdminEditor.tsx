"use client";

import { FormEvent, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { authClient } from "@/lib/auth/client";
import { createSlug, type CmsArticle } from "@/lib/article-utils";

type Props = { initialArticles: CmsArticle[]; email: string };
type FormState = Omit<CmsArticle, "id" | "slug" | "published_at"> & { id?: string; published: boolean };
type InsertDialog = "link" | "image" | null;

const emptyForm: FormState = {
  title: "", category: "Reflexão", author: "Conforto das Escrituras", reading_time: "5 min",
  excerpt: "", emoji: "📖", content: "", published: true,
};

export default function AdminEditor({ initialArticles, email }: Props) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef({ start: 0, end: 0 });
  const [insertDialog, setInsertDialog] = useState<InsertDialog>(null);
  const [insertUrl, setInsertUrl] = useState("");
  const [insertAlt, setInsertAlt] = useState("Descrição da imagem");
  const [insertError, setInsertError] = useState("");

  function insertAroundSelection(before: string, after: string, fallback: string) {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = form.content.slice(start, end) || fallback;
    const nextContent = `${form.content.slice(0, start)}${before}${selected}${after}${form.content.slice(end)}`;
    setForm((current) => ({ ...current, content: nextContent }));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function insertBlock(prefix: string) {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = form.content.slice(start, end);
    const replacement = selected
      ? selected.split("\n").map((line) => `${prefix}${line}`).join("\n")
      : prefix;
    const lineStart = form.content.lastIndexOf("\n", start - 1) + 1;
    const insertAt = selected ? start : lineStart;
    const nextContent = `${form.content.slice(0, insertAt)}${replacement}${form.content.slice(selected ? end : insertAt)}`;
    setForm((current) => ({ ...current, content: nextContent }));
    requestAnimationFrame(() => {
      textarea.focus();
      const selection = insertAt + prefix.length;
      if (selected) textarea.setSelectionRange(selection, selection + selected.length);
      else textarea.setSelectionRange(selection, selection);
    });
  }

  function continueMarkdownList(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;
    if (event.key !== "Enter" || event.shiftKey || textarea.selectionStart !== textarea.selectionEnd) return;
    const cursor = textarea.selectionStart;
    const lineStart = form.content.lastIndexOf("\n", cursor - 1) + 1;
    const beforeCursor = form.content.slice(lineStart, cursor);
    const match = beforeCursor.match(/^(\s*)([-*+]|(\d+)\.)\s+(.*)$/);
    if (!match) return;

    event.preventDefault();
    const [, indent, bullet, orderedNumber, itemText] = match;
    if (!itemText.trim()) {
      const nextContent = `${form.content.slice(0, lineStart)}${form.content.slice(cursor)}`;
      setForm((current) => ({ ...current, content: nextContent }));
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(lineStart, lineStart);
      });
      return;
    }

    const nextMarker = orderedNumber ? `${Number(orderedNumber) + 1}.` : bullet;
    const insertion = `\n${indent}${nextMarker} `;
    const nextContent = `${form.content.slice(0, cursor)}${insertion}${form.content.slice(cursor)}`;
    setForm((current) => ({ ...current, content: nextContent }));
    requestAnimationFrame(() => {
      textarea.focus();
      const nextCursor = cursor + insertion.length;
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function openInsertDialog(kind: Exclude<InsertDialog, null>) {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    pendingSelection.current = { start, end };
    setInsertUrl("https://");
    setInsertError("");
    setInsertDialog(kind);
  }

  function closeInsertDialog() {
    setInsertDialog(null);
    setInsertError("");
  }

  function applyInsert() {
    if (!insertDialog) return;
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(insertUrl.trim());
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new Error("URL inválida");
    } catch {
      setInsertError("Informe um endereço válido começando com https://.");
      return;
    }
    const textarea = contentRef.current;
    if (!textarea) return;
    const { start, end } = pendingSelection.current;
    const selectedText = form.content.slice(start, end);
    const markdown = insertDialog === "link"
      ? `[${selectedText || "texto do link"}](${parsedUrl.href})`
      : `![${insertAlt.trim() || "Descrição da imagem"}](${parsedUrl.href})`;
    const nextContent = `${form.content.slice(0, start)}${markdown}${form.content.slice(end)}`;
    setForm((current) => ({ ...current, content: nextContent }));
    closeInsertDialog();
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + markdown.length, start + markdown.length);
    });
  }

  function editArticle(article: CmsArticle) {
    setForm({ ...article, published: Boolean(article.published_at) });
    setPreview(false);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function newArticle() {
    setForm(emptyForm);
    setPreview(false);
    setMessage("");
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(form.id ? `/api/articles/${form.id}` : "/api/articles", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) router.push("/login");
        setMessage(result.error || "Não foi possível salvar o artigo.");
        return;
      }

      const article = result as CmsArticle;
      setArticles((current) => form.id ? current.map((item) => item.id === form.id ? article : item) : [article, ...current]);
      setForm({ ...article, published: Boolean(article.published_at) });
      setMessage("Artigo salvo com sucesso.");
      router.refresh();
    } catch {
      setMessage("Não foi possível salvar o artigo. Verifique sua conexão e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(id: string) {
    if (!window.confirm("Excluir este artigo? Essa ação não pode ser desfeita.")) return;
    try {
      const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) router.push("/login");
        setMessage(result.error || "Não foi possível excluir o artigo.");
        return;
      }
      setArticles((current) => current.filter((article) => article.id !== id));
      if (form.id === id) newArticle();
      setMessage("Artigo excluído.");
    } catch {
      setMessage("Não foi possível excluir o artigo. Verifique sua conexão e tente novamente.");
    }
  }

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.14em]" style={{ color: "var(--gold)" }}>Painel do autor</p>
          <h1 className="text-4xl mt-2" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>Novo artigo</h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--ink-light)" }}>{email}</p>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/estudos" className="font-sans text-sm" style={{ color: "var(--gold)" }}>Ver estudos ↗</Link>
          <button onClick={signOut} className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Sair</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] gap-8">
        <form onSubmit={saveArticle} className="card p-6 md:p-8 flex flex-col gap-4">
          <div className="grid sm:grid-cols-[1fr_auto] gap-4">
            <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
              Título
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
            </label>
            <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
              Ícone
              <input required value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="mt-1 w-20 rounded-lg border px-3 py-2.5 bg-white text-center" style={{ borderColor: "var(--parchment-dark)" }} />
            </label>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {([["category", "Categoria"], ["author", "Autor"], ["reading_time", "Leitura"]] as const).map(([field, label]) => (
              <label key={field} className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
                {label}
                <input required value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
              </label>
            ))}
          </div>
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
            Resumo
            <textarea required rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
          </label>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="content" className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Conteúdo em Markdown</label>
              <button type="button" onClick={() => setPreview(!preview)} className="font-sans text-xs" style={{ color: "var(--gold)" }}>{preview ? "Editar" : "Pré-visualizar"}</button>
            </div>
            {preview ? (
              <div className="article-content min-h-72 rounded-lg border p-5" style={{ borderColor: "var(--parchment-dark)" }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || "*Comece a escrever seu artigo...*"}</ReactMarkdown>
              </div>
            ) : (
              <div className="relative">
                <div role="toolbar" aria-label="Formatação do artigo" className="flex flex-nowrap gap-1 overflow-x-auto rounded-t-lg border border-b-0 p-1.5 bg-[#f7f3eb]" style={{ borderColor: "var(--parchment-dark)", scrollbarWidth: "none" }}>
                  <ToolbarButton label="Negrito" onClick={() => insertAroundSelection("**", "**", "texto em negrito")}><strong>B</strong></ToolbarButton>
                  <ToolbarButton label="Itálico" onClick={() => insertAroundSelection("*", "*", "texto em itálico")}><em>I</em></ToolbarButton>
                  <ToolbarButton label="Título" onClick={() => insertBlock("## ")}>H2</ToolbarButton>
                  <ToolbarButton label="Link" onClick={() => openInsertDialog("link")}>Link</ToolbarButton>
                  <ToolbarButton label="Imagem por endereço" onClick={() => openInsertDialog("image")}>Imagem</ToolbarButton>
                  <ToolbarButton label="Citação" onClick={() => insertBlock("> ")}>❝</ToolbarButton>
                  <ToolbarButton label="Lista" onClick={() => insertBlock("- ")}>Lista</ToolbarButton>
                </div>
                {insertDialog && (
                  <div role="group" aria-label={insertDialog === "link" ? "Inserir link" : "Inserir imagem"} onKeyDown={(event) => { if (event.key === "Escape") closeInsertDialog(); }} className="absolute left-2 right-2 top-12 z-20 grid gap-3 rounded-lg border p-3 bg-white shadow-xl sm:grid-cols-[1fr_auto]" style={{ borderColor: "var(--parchment-dark)" }}>
                    <div className="flex justify-end sm:col-span-2">
                      <button type="button" aria-label="Fechar painel" title="Fechar" onClick={closeInsertDialog} className="h-8 w-8 rounded-md font-sans text-lg hover:bg-[#f7f3eb]" style={{ color: "var(--ink-light)" }}>×</button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-1">
                      <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
                        Endereço da {insertDialog === "link" ? "página" : "imagem"}
                        <input type="url" required autoFocus value={insertUrl} onChange={(event) => { setInsertUrl(event.target.value); setInsertError(""); }} placeholder="https://..." className="mt-1 w-full rounded-lg border px-3 py-2 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
                      </label>
                      {insertDialog === "image" && (
                        <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
                          Descrição da imagem
                          <input value={insertAlt} onChange={(event) => setInsertAlt(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
                        </label>
                      )}
                      {insertError && <p role="alert" className="font-sans text-sm" style={{ color: "var(--burgundy)" }}>{insertError}</p>}
                    </div>
                    <div className="flex gap-2 sm:items-end">
                      <button type="button" onClick={closeInsertDialog} className="font-sans text-sm px-3 py-2" style={{ color: "var(--ink-light)" }}>Cancelar</button>
                      <button type="button" onClick={applyInsert} className="btn-primary">Inserir {insertDialog === "link" ? "link" : "imagem"}</button>
                    </div>
                  </div>
                )}
                <textarea ref={contentRef} id="content" required rows={18} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} onKeyDown={continueMarkdownList} placeholder={"# Título do artigo\\n\\nEscreva aqui; selecione um trecho e use os botões de formatação."} className="w-full rounded-b-lg border px-3 py-2.5 bg-white font-mono text-sm leading-relaxed" style={{ borderColor: "var(--parchment-dark)" }} />
                <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-light)" }}>Para inserir uma imagem, use o endereço público dela (URL).</p>
              </div>
            )}
          </div>
          <label className="font-sans text-sm flex items-center gap-2" style={{ color: "var(--ink-light)" }}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Publicar imediatamente na página de Estudos
          </label>
          {message && <p className="font-sans text-sm" role="status" style={{ color: message.includes("sucesso") || message.includes("excluído") ? "var(--olive)" : "var(--burgundy)" }}>{message}</p>}
          <div className="flex gap-3 flex-wrap">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Salvando..." : form.id ? "Atualizar artigo" : "Publicar artigo"}</button>
            {form.id && <button type="button" onClick={newArticle} className="font-sans text-sm px-4" style={{ color: "var(--ink-light)" }}>Novo artigo</button>}
          </div>
        </form>

        <aside>
          <h2 className="text-2xl mb-4" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>Seus artigos</h2>
          <div className="flex flex-col gap-3">
            {articles.length === 0 && <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Você ainda não publicou nenhum artigo.</p>}
            {articles.map((article) => (
              <div key={article.id} className="card p-4">
                <div className="flex gap-2 items-start">
                  <span>{article.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight" style={{ color: "var(--ink)" }}>{article.title}</h3>
                    <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-light)" }}>{article.published_at ? "Publicado" : "Rascunho"}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 font-sans text-xs">
                  <button onClick={() => editArticle(article)} style={{ color: "var(--gold)" }}>Editar</button>
                  <button onClick={() => deleteArticle(article.id)} style={{ color: "var(--burgundy)" }}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className="min-w-8 h-8 shrink-0 px-1.5 rounded-md border bg-white font-sans text-sm hover:bg-[#fffaf0]" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }}>
      {children}
    </button>
  );
}
