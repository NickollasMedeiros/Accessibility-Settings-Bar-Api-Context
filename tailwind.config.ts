import type { Config } from "tailwindcss";
import { accessibilityPlugin } from "./src/plugin";

// Configuração da demonstração: informa ao Tailwind onde buscar classes e
// registra as variantes a11y-* fornecidas pelo plugin local.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [accessibilityPlugin],
};

export default config;
