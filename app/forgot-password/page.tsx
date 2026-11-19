"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function PaginaRecuperacaoSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, definirMensagem] = useState("");
  const [erroCapturado, definirErroCapturado] = useState("");
  const [carregando, definirCarregando] = useState(false);

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    definirErroCapturado(""); definirMensagem(""); definirCarregando(true);
    try {
      const { error: erroRedefinicao } = await authClient.requestPasswordReset({ email: email.trim(), redirectTo: `${window.location.origin}/reset-password` });
      if (erroRedefinicao) { definirErroCapturado("Não foi possível solicitar o link. Tente novamente em instantes."); return; }
      definirMensagem("Se esse e-mail estiver cadastrado, enviaremos um link para redefinir a senha. Verifique também o spam.");
    } catch { definirErroCapturado("O Neon Auth não respondeu agora. Tente novamente."); }
    finally { definirCarregando(false); }
  }

  return (
    <div className="site-container py-16">
      <div className="card max-w-md mx-auto p-7 md:p-9">
        <p className="font-sans text-xs uppercase tracking-[0.14em] mb-3" style={{ color: "var(--gold)" }}>Área do autor</p>
        <h1 className="text-4xl mb-2" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>Redefinir senha</h1>
        <p className="font-sans text-sm mb-7" style={{ color: "var(--ink-light)" }}>Enviaremos um link para o e-mail da sua conta.</p>
        <form onSubmit={enviarFormulario} className="flex flex-col gap-4">
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>E-mail<input type="email" required autoComplete="email" value={email} onChange={(evento) => setEmail(evento.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }} /></label>
          {erroCapturado && <p className="font-sans text-sm" role="alert" style={{ color: "var(--burgundy)" }}>{erroCapturado}</p>}
          {mensagem && <p className="font-sans text-sm" role="status" style={{ color: "var(--olive)" }}>{mensagem}</p>}
          <button type="submit" className="btn-primary mt-2" disabled={carregando}>{carregando ? "Enviando..." : "Enviar link"}</button>
        </form>
        <p className="font-sans text-sm mt-6"><Link href="/login" style={{ color: "var(--gold)" }}>Voltar para o login</Link></p>
      </div>
    </div>
  );
}