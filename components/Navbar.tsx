"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/leitura", label: "Bíblias" },
  { href: "/versiculo", label: "Versículo do Dia" },
  { href: "/estudos", label: "Estudos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "var(--parchment)",
        isolation: "isolate",
        borderBottom: "1px solid var(--parchment-dark)",
        boxShadow: "0 2px 12px rgba(67, 45, 28, 0.05)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--gold)" }} aria-hidden />
          <span
            className="text-lg md:text-xl font-semibold tracking-[-0.02em]"
            style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
          >
            Conforto das Escrituras
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-7 font-sans text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{
                  color: pathname === l.href ? "var(--gold)" : "var(--ink-light)",
                  fontWeight: pathname === l.href ? 600 : 400,
                  borderBottom: pathname === l.href ? "1px solid var(--gold)" : "1px solid transparent",
                  paddingBottom: "5px",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden font-sans text-lg"
          style={{ color: "var(--ink)" }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden max-w-5xl mx-auto px-4 pb-4 pt-1 flex flex-col gap-3 font-sans text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ color: pathname === l.href ? "var(--gold)" : "var(--ink-light)", fontWeight: 500 }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
