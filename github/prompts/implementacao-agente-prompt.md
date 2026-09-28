# Implementacao Agente de IA

Este documento define como um agente de IA deve integrar esta biblioteca de acessibilidade em um projeto consumidor sem inventar exports, caminhos ou comportamentos. Ele e uma versao operativa da documentacao geral, mas com foco em decisao, seguranca e validacao.

## 1. Objetivo

O agente deve transformar a ideia de acessibilidade em uma integracao real em outro projeto React ou Next.js, preservando o funcionamento do sistema atual e evitando alteracoes destrutivas.

O alvo da integracao e:

- usar `AccessibilityProvider` no ponto mais alto que precisa do estado global;
- incluir `AccessibilityWidget` uma vez no layout ou raiz da aplicacao;
- registrar `accessibilityPlugin` apenas quando o projeto usa Tailwind;
- importar o CSS base necessario para os atributos `data-a11y-*`;
- validar focos, ARIA, persistencia e comportamento em telas reais.

## 2. Fontes de verdade

Antes de qualquer alteracao, o agente deve ler estes arquivos do repositorio atual:

1. `README.md`
2. `documentacao.md`
3. `implementacao.md`
4. `src/index.ts`
5. `src/components/AccessibilityContext.tsx`
6. `src/components/AccessibilityWidget.tsx`
7. `src/plugin/index.ts`
8. `src/app/globals.css`

Se algum arquivo estiver inconsistente com os outros, a fonte de verdade e a implementacao do codigo, nao a descricao.

## 3. Contexto do projeto atual

Este repositorio e uma demo de acessibilidade com estrutura de biblioteca em evolucao. Isso significa que:

- a aplicacao demo funciona localmente;
- o codigo reutilizavel ja existe em `src/components`, `src/hooks`, `src/plugin` e `src/index.ts`;
- o repositorio ainda nao e um pacote publicado e pronto para `npm`/GitHub;
- a integracao em outro projeto deve seguir o padrao de copia local ou instalacao via pacote compilado.

O agente nunca deve afirmar que a instalacao via GitHub ja funciona sem testar `build` e `exports` do pacote final.

## 4. Fluxo operacional do agente

### Etapa 1: mapear o projeto de destino

Antes de alterar arquivos, o agente deve entender:

- se o destino e Next.js App Router, Next.js Pages Router, Vite ou React puro;
- se usa Tailwind ou CSS puro;
- se ja existe alguma estrutura de tema, layout ou provider global;
- se a aplicacao tem rotas protegidas, menus, modais ou layouts compartilhados.

### Etapa 2: decidir o que manter, adaptar, fundir ou remover

A regra e simples:

- manter: `AccessibilityProvider`, `useAccessibility`, `AccessibilityWidget`, `useMousePosition`, `accessibilityPlugin`;
- adaptar: nomes de imports, layout raiz, CSS base, `storageKey`, posicao do widget, classes de cor;
- fundir: estilos do tema do projeto com os estilos acessibilidade do repositorio;
- remover: qualquer codigo da demo que nao seja necessario ao runtime da biblioteca.

Se o projeto de destino ja tiver um sistema de tema, nao substitua por um novo estado paralelo. Integre no existente.

### Etapa 3: localizar o ponto correto da aplicacao

O provider deve entrar no ponto mais alto que necessita do estado global, normalmente:

- `app/layout.tsx` em Next.js App Router;
- algum componente de raiz em Vite/React;
- um componente que envolve todas as rotas ou views do sistema.

O widget deve ser adicionado uma unica vez no mesmo nivel do provider, salvo justificativa visual explicita.

### Etapa 4: seguir a API publica real

O agente deve usar os exports reais do `src/index.ts`, e nao nomes inventados. A referencia oficial atual e:

```ts
import {
  AccessibilityProvider,
  defaultAccessibilitySettings,
  normalizeAccessibilitySettings,
  useAccessibility,
  AccessibilityWidget,
  useMousePosition,
  accessibilityPlugin,
} from "your-package";
```

E tipos relevantes:

```ts
import type {
  AccessibilityContextProps,
  AccessibilityProviderProps,
  AccessibilitySettings,
  AccessibilityWidgetProps,
  MousePosition,
} from "your-package";
```

Se o projeto consumidor ainda nao tiver um pacote com esse nome, o agente deve usar caminho local temporario ou adaptar o import ao nome real do pacote do cliente.

## 5. Regras obrigatorias

O agente deve:

- usar `use client` em componentes que chamam `useAccessibility`;
- verificar antes de tocar em `window`, `document` ou `localStorage` em Server Components;
- preservar atributos `data-a11y-*` e estilos visuais de foco;
- manter `highContrast` e `darkMode` como estados mutuamente exclusivos;
- respeitar limites de `fontSize` em `40` a `200`;
- manter persistencia opcional com `persist={false}` quando solicitado;
- validar que o Tailwind plugin esta registrado apenas em projetos com Tailwind;
- testar `Escape`, foco, `aria-*` e retorno do foco do widget;
- rodar lint, build e validacao do projeto consumidor ao final.

O agente nao deve:

- inventar exports ou props inexistentes;
- remover estilos de foco sem oferecer substituicao visivel;
- usar `window` em render de servidor;
- duplica o widget em varios lugares sem necessidade;
- afirmar que a integracao foi concluida sem verificar o build;
- instalar dependencias sem necessidade.

## 6. Decisao por situacao

### Quando o projeto usa Next.js App Router

A integracao deve seguir o padrao:

```tsx
import {
  AccessibilityProvider,
  AccessibilityWidget,
} from "your-package";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

O layout pode continuar como Server Component. O provider e o widget sao client components renderizados dentro da arvore.

### Quando o projeto usa Vite ou React puro

A integracao deve acontecer no ponto de entrada da aplicacao:

```tsx
import { createRoot } from "react-dom/client";
import { AccessibilityProvider, AccessibilityWidget } from "your-package";
import "./accessibility.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <AccessibilityProvider>
    <App />
    <AccessibilityWidget />
  </AccessibilityProvider>,
);
```

### Quando o projeto usa Tailwind

Registrar o plugin:

```ts
import type { Config } from "tailwindcss";
import { accessibilityPlugin } from "your-package";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [accessibilityPlugin],
};

export default config;
```

### Quando o projeto nao usa Tailwind

O agente deve usar apenas o CSS base manual e evitar importacoes desnecessarias do plugin.

## 7. CSS base obrigatorio

O projeto consumidor precisa de regras minimas para reagir aos atributos do provider:

```css
html[data-a11y-dark="true"] body {
  background: #030712;
  color: #f3f4f6;
}

html[data-a11y-contrast="true"] body {
  background: #000;
  color: #fde047;
}

html[data-a11y-dyslexia="true"] body {
  font-family: Verdana, sans-serif;
  letter-spacing: 0.04em;
}

html[data-a11y-highlight-links="true"] a {
  outline: 3px solid currentColor;
  outline-offset: 3px;
}
```

O agente deve evitar qualquer `font-size` fixo em `html` no projeto consumidor, porque o provider ja aplica a escala global.

## 8. Checklist de validacao final

O agente deve validar todos estes itens antes de encerrar:

1. O provider envolve o scope correto.
2. O widget aparece uma unica vez.
3. O estado persiste ou nao conforme configuracao.
4. `fontSize` respeita limite e incrementos.
5. `darkMode` e `highContrast` nao ficam ativos juntos.
6. Os atributos do `html` sao atualizados corretamente.
7. As classes `a11y-*` reagem a aplicaçao.
8. O foco e o teclado funcionam.
9. O `Escape` fecha o painel.
10. O `localStorage` e recuperado sem quebrar JSON invalido.
11. O projeto compila sem erros.
12. O lint termina sem avisos relevantes.

## 9. Processo recomendado para um agente em um projeto real

Use a seguinte ordem:

1. Ler a documentacao do repositorio atual.
2. Ler a estrutura do projeto destino.
3. Identificar o layout raiz e o bundler.
4. Confirmar se Tailwind e React estao ativos.
5. Escolher `copy local` ou `package installed`.
6. Integrar `AccessibilityProvider` e `AccessibilityWidget`.
7. Ajustar CSS e estilos.
8. Registrar plugin, se aplicavel.
9. Validar com build e lint.
10. Relatar diferencas e conclusoes.

## 10. Saida esperada do agente

Ao final da implementacao, o agente deve fornecer um resumo objetivo contendo:

- arquivos alterados;
- onde o provider foi posicionado;
- como o widget foi integrado;
- se Tailwind foi usado;
- se o CSS base foi adicionado;
- validacoes executadas;
- impedimentos, se houverem;
- observacoes sobre o que ainda precisa ser empacotado para publicacao.

O agente nao deve encerra a tarefa dizendo que o problema foi resolvido sem evidencias reais de build, lint ou execucao do projeto consumidor.

## 11. Regra final

Esta implementacao deve ser tratada como uma integracao cuidadosa, governada por API real, contexto do projeto e validacao concreta. O agente e responsavel por reduzir risco, manter compatibilidade e documentar qualquer divergencia encontrada entre este repositorio e o projeto de destino.
