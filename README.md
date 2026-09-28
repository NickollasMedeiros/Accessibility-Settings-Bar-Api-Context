# Accessibility Settings Bar

Barra de acessibilidade reutilizável para aplicações React e Next.js com App Router.

## Funcionalidades

- Aumentar e diminuir o tamanho global da fonte.
- Alto contraste e modo escuro.
- Fonte com maior espaçamento para leitura facilitada.
- Destaque visual de links.
- Linha de leitura e linha guia acompanhando o cursor.
- Persistência opcional das preferências em `localStorage`.
- Variantes customizadas do Tailwind baseadas em `data-*`.
- Operação por teclado com foco, `Escape` e atributos ARIA.

## Executar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) para testar a demonstração.

Outros comandos:

```bash
npm run lint
npm run build
npm run start
```

## Uso no Next.js

O provider deve envolver o conteúdo da aplicação, normalmente no layout raiz:

```tsx
import {
  AccessibilityProvider,
  AccessibilityWidget,
} from "your-package";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AccessibilityProvider>
          {children}
          <AccessibilityWidget />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
```

Consulte [documentacao.md](documentacao.md) para conhecer a arquitetura, o fluxo de estado e todas as opções da API. Para implementar a biblioteca em outro projeto, siga o contexto em [implementacao-contexto.md](github/prompts/implementacao-contexto.md). Para orientação executiva para agentes de IA, use [implementacao-agente-prompt.md](github/prompts/implementacao-agente-prompt.md).

## Tailwind CSS

Registre o plugin no `tailwind.config.ts` do projeto consumidor:

```ts
import { accessibilityPlugin } from "your-package";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [accessibilityPlugin],
};
```

Depois, use variantes como `a11y-dark:bg-gray-950`, `a11y-contrast:bg-black` e `a11y-dyslexia:font-sans`.

## Status do projeto

O repositório contém uma aplicação Next.js de demonstração e a API pública inicial da biblioteca em `src/index.ts`. O empacotamento para publicação npm ainda deve ser configurado antes de publicar o pacote.
