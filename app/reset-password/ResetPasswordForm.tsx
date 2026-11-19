"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function FormularioRedefinicaoSenha({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [mensagem, definirMensagem] = useState("");
  const [erroCapturado, definirErroCapturado] = useState("");
  const [carregando, definirCarregando] = useState(false);

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); definirErroCapturado(""); definirMensagem("");
    if (!token) { definirErroCapturado("Este link está incompleto. Solicite outro link de redefinição."); return; }
    if (password.length < 8) { definirErroCapturado("A senha precisa ter pelo menos 8 caracteres."); return; }
    if (password !== confirmation) { definirErroCapturado("As senhas não coincidem."); return; }
    definirCarregando(true);
    try {
      const { error: erroRedefinicao } = await authClient.resetPassword({ newPassword: password, token });
      if (erroRedefinicao) { definirErroCapturado("Não foi possível redefinir. O link pode ter expirado; solicite outro."); return; }
      definirMensagem("Senha atualizada. Agora você pode entrar no painel.");
    } catch { definirErroCapturado("O Neon Auth não respondeu agora. Tente novamente."); }
    finally { definirCarregando(false); }
  }

  return (
    <div className="site-container py-16">
      <div className="card max-w-md mx-auto p-7 md:p-9">
        <p className="font-sans text-xs uppercase tracking-[0.14em] mb-3" style={{ color: "var(--gold)" }}>Área do autor</p>
        <h1 className="text-4xl mb-2" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>Criar nova senha</h1>
        <p className="font-sans text-sm mb-7" style={{ color: "var(--ink-light)" }}>Escolha uma senha com pelo menos 8 caracteres.</p>
        <form onSubmit={enviarFormulario} className="flex flex-col gap-4">
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Nova senha<input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(evento) => setPassword(evento.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }} /></label>
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Confirmar senha<input type="password" required minLength={8} autoComplete="new-password" value={confirmation} onChange={(evento) => setConfirmation(evento.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }} /></label>
          {erroCapturado && <p className="font-sans text-sm" role="alert" style={{ color: "var(--burgundy)" }}>{erroCapturado}</p>}
          {mensagem && <p className="font-sans text-sm" role="status" style={{ color: "var(--olive)" }}>{mensagem}</p>}
          {mensagem ? <Link href="/login" className="btn-primary mt-2 text-center">Ir para o login</Link> : <button type="submit" className="btn-primary mt-2" disabled={carregando}>{carregando ? "Salvando..." : "Salvar nova senha"}</button>}
        </form>
      </div>
    </div>
  );
}