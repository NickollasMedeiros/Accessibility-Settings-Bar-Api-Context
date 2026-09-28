import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AccessibilityProvider } from "../components/AccessibilityContext";
import { AccessibilityWidget } from "../components/AccessibilityWidget";
import "./globals.css";

// Fontes e metadados pertencem ao layout compartilhado de todas as rotas.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accessibility Settings Bar",
  description: "Reusable accessibility controls for React and Next.js applications.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // O provider e o widget ficam no layout para atender todas as páginas.
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AccessibilityProvider>
          {children}
          <AccessibilityWidget />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
