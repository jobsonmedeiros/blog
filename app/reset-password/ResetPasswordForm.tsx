"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (!token) { setError("Este link está incompleto. Solicite outro link de redefinição."); return; }
    if (password.length < 8) { setError("A senha precisa ter pelo menos 8 caracteres."); return; }
    if (password !== confirmation) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    try {
      const { error: resetError } = await authClient.resetPassword({ newPassword: password, token });
      if (resetError) { setError("Não foi possível redefinir. O link pode ter expirado; solicite outro."); return; }
      setMessage("Senha atualizada. Agora você pode entrar no painel.");
    } catch { setError("O Neon Auth não respondeu agora. Tente novamente."); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-7 md:p-9">
        <p className="font-sans text-xs uppercase tracking-[0.14em] mb-3" style={{ color: "var(--gold)" }}>Área do autor</p>
        <h1 className="text-4xl mb-2" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>Criar nova senha</h1>
        <p className="font-sans text-sm mb-7" style={{ color: "var(--ink-light)" }}>Escolha uma senha com pelo menos 8 caracteres.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Nova senha<input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }} /></label>
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Confirmar senha<input type="password" required minLength={8} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }} /></label>
          {error && <p className="font-sans text-sm" role="alert" style={{ color: "var(--burgundy)" }}>{error}</p>}
          {message && <p className="font-sans text-sm" role="status" style={{ color: "var(--olive)" }}>{message}</p>}
          {message ? <Link href="/login" className="btn-primary mt-2 text-center">Ir para o login</Link> : <button type="submit" className="btn-primary mt-2" disabled={loading}>{loading ? "Salvando..." : "Salvar nova senha"}</button>}
        </form>
      </div>
    </div>
  );
}