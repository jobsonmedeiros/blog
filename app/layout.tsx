import type { Metadata } from "next";
import "./globals.css";
import MenuPrincipal from "@/components/Navbar";
import ReprodutorAmbiente from "@/components/AmbientPlayer";
import RodapeSite from '@/components/RodapeSite';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Conforto das Escrituras",
  description: "Um espaço de paz para leitura e estudo das Sagradas Escrituras",
  openGraph: {
    title: "Conforto das Escrituras",
    description: "Um espaço de paz para leitura e estudo das Sagradas Escrituras",
  },
};

export default function EstruturaPrincipal({ children }: { children: React.ReactNode }) {
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
      <body className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: "var(--parchment)" }}>
        <MenuPrincipal />
        <main>{children}</main>
        <ReprodutorAmbiente />
        <Analytics />
        <RodapeSite ano={new Date().getFullYear()} />
      </body>
    </html>
  );
}
