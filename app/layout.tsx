import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AmbientPlayer from "@/components/AmbientPlayer";
import DoarPix from "@/components/DoarPix";

export const metadata: Metadata = {
  title: "Conforto das Escrituras",
  description: "Um espaço de paz para leitura e estudo das Sagradas Escrituras",
  openGraph: {
    title: "Conforto das Escrituras",
    description: "Um espaço de paz para leitura e estudo das Sagradas Escrituras",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen" style={{ backgroundColor: "var(--parchment)" }}>
        <Navbar />
        <main>{children}</main>
        <AmbientPlayer />
        <footer className="text-center py-8 mt-12" style={{ borderTop: "1px solid var(--parchment-dark)" }}>
          <p className="font-sans text-sm" style={{ color: "var(--ink-light)", paddingRight: "3.5rem" }}>
            © {new Date().getFullYear()} Conforto das Escrituras •{" "}
            <a
              href="https://confortodasescrituras.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--gold)" }}
            >
              Blog
            </a>{" "}
            • <DoarPix />
          </p>
          <p className="font-sans text-xs mt-1" style={{ color: "var(--gold)" }}>
            ✦ &ldquo;A tua palavra é lâmpada que ilumina os meus passos&rdquo; — Sl 119:105 ✦
          </p>
        </footer>
      </body>
    </html>
  );
}
