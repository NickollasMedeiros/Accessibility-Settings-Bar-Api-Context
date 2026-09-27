import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/AccessibilityContext";
import { AccessibilityWidget } from "@/components/AccessibilityWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accessibility Settings Bar Example",
  description: "Recreated accessibility settings bar in Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased transition-all duration-300 ease-in-out`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-300 ease-in-out a11y-contrast:bg-black a11y-contrast:text-white a11y-dark:bg-[#121212] a11y-dark:text-[#655b5b] a11y-dyslexia:font-mono">
        <AccessibilityProvider>
          {children}
          <AccessibilityWidget position="bottom-right" />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
