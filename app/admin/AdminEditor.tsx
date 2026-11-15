"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { authClient } from "@/lib/auth/client";
import { createSlug, type CmsArticle } from "@/lib/article-utils";

type Props = { initialArticles: CmsArticle[]; email: string };
type FormState = Omit<CmsArticle, "id" | "slug" | "published_at"> & { id?: string; published: boolean };

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
              <div className="min-h-72 rounded-lg border p-4 prose" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || "*Comece a escrever seu artigo...*"}</ReactMarkdown>
              </div>
            ) : (
              <textarea id="content" required rows={18} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder={"# Título do artigo\\n\\nEscreva aqui usando **Markdown**..."} className="w-full rounded-lg border px-3 py-2.5 bg-white font-mono text-sm leading-relaxed" style={{ borderColor: "var(--parchment-dark)" }} />
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
