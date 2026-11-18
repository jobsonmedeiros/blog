"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { destinoAposLogin } from '@/lib/destino-login';

export default function PaginaLogin() {
  const navegador = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erroCapturado, definirErroCapturado] = useState("");
  const [carregando, definirCarregando] = useState(false);

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    definirErroCapturado("");
    definirCarregando(true);
    try {
      const { error: erroEntrada } = await authClient.signIn.email({ email: email.trim(), password });
      if (erroEntrada) {
        definirErroCapturado("E-mail ou senha inválidos. Tente novamente.");
        return;
      }
      const destino = destinoAposLogin(new URLSearchParams(window.location.search).get('retorno'));
      navegador.replace(destino);
      navegador.refresh();
    } catch {
      definirErroCapturado("Não foi possível entrar agora. Verifique sua conexão e tente novamente.");
    } finally {
      definirCarregando(false);
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

        <form onSubmit={enviarFormulario} className="flex flex-col gap-4">
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
            E-mail
            <input
              type="email"
              required
              autoComplete="email"
              disabled={carregando}
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value);
                if (erroCapturado) definirErroCapturado("");
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
              disabled={carregando}
              value={password}
              onChange={(evento) => {
                setPassword(evento.target.value);
                if (erroCapturado) definirErroCapturado("");
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white"
              style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }}
            />
          </label>
          <div className="-mt-2 text-right"><Link href="/forgot-password" className="font-sans text-sm" style={{ color: "var(--gold)" }}>Esqueci minha senha</Link></div>
          {erroCapturado && <p className="font-sans text-sm" role="alert" style={{ color: "var(--burgundy)" }}>{erroCapturado}</p>}
          <button type="submit" className="btn-primary mt-2" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
