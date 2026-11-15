"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: signInError } = await authClient.signIn.email({ email: email.trim(), password });
      if (signInError) {
        setError("E-mail ou senha inválidos. Tente novamente.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Não foi possível entrar agora. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-7 md:p-9">
        <p className="font-sans text-xs uppercase tracking-[0.14em] mb-3" style={{ color: "var(--gold)" }}>
          Área do autor
        </p>
        <h1 className="text-4xl mb-2" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>
          Entrar
        </h1>
        <p className="font-sans text-sm mb-7" style={{ color: "var(--ink-light)" }}>
          Publique seus estudos de qualquer lugar.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
            E-mail
            <input
              type="email"
              required
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError("");
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white"
              style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }}
            />
          </label>
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
            Senha
            <input
              type="password"
              required
              autoComplete="current-password"
              disabled={loading}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError("");
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white"
              style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }}
            />
          </label>
          <div className="-mt-2 text-right"><Link href="/forgot-password" className="font-sans text-sm" style={{ color: "var(--gold)" }}>Esqueci minha senha</Link></div>
          {error && <p className="font-sans text-sm" role="alert" style={{ color: "var(--burgundy)" }}>{error}</p>}
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
