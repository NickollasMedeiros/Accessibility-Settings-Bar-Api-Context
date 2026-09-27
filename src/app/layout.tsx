import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AccessibilityProvider } from "../components/AccessibilityContext";
import { AccessibilityWidget } from "../components/AccessibilityWidget";
import "./globals.css";

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
