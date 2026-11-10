"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/leitura", label: "Leitura" },
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
        background: "rgba(245, 240, 232, 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--parchment-dark)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span style={{ color: "var(--gold)", fontSize: "1.5rem" }}>✦</span>
          <span
            className="text-xl font-semibold"
            style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif" }}
          >
            Conforto das Escrituras
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 font-sans text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{
                  color: pathname === l.href ? "var(--gold)" : "var(--ink-light)",
                  fontWeight: pathname === l.href ? 600 : 400,
                  borderBottom: pathname === l.href ? "2px solid var(--gold)" : "none",
                  paddingBottom: "2px",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden font-sans text-xl"
          style={{ color: "var(--ink)" }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden px-4 pb-4 flex flex-col gap-3 font-sans text-sm">
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
