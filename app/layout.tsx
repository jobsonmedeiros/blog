import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AmbientPlayer from "@/components/AmbientPlayer";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hinar.io" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Source+Sans+3:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap"
        />
      </head>
      <body className="min-h-screen" style={{ backgroundColor: "var(--parchment)" }}>
        <Navbar />
        <main>{children}</main>
        <AmbientPlayer />
        <footer className="text-center py-8 mt-12" style={{ borderTop: "1px solid var(--parchment-dark)" }}>
          <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
            © {new Date().getFullYear()} Conforto das Escrituras •{" "}
            <a
              href="https://confortodasescrituras.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--gold)" }}
            >
              Blog
            </a>
          </p>
          <p className="font-sans text-xs mt-1" style={{ color: "var(--gold)" }}>
            ✦ &ldquo;A tua palavra é lâmpada que ilumina os meus passos&rdquo; — Sl 119:105 ✦
          </p>
        </footer>
      </body>
    </html>
  );
}
