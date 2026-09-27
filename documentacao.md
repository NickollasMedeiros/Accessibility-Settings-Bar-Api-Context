# Documentação técnica

## 1. Visão geral

O projeto transforma uma barra de acessibilidade tradicional em componentes React reutilizáveis para aplicações Next.js com App Router.

A solução é formada por quatro partes:

1. `AccessibilityProvider`: armazena o estado e expõe as ações pelo Context API.
2. `useAccessibility`: hook usado pelos componentes que precisam ler ou alterar as preferências.
3. `AccessibilityWidget`: interface flutuante com os controles visuais.
4. `accessibilityPlugin`: plugin Tailwind que cria variantes baseadas nos atributos do elemento `<html>`.

A página em `src/app` é somente uma demonstração. A API reutilizável fica nos componentes, hooks, plugin e no barrel `src/index.ts`.

## 2. Arquitetura de renderização

O `AccessibilityProvider` e o `AccessibilityWidget` são Client Components porque usam estado, efeitos e APIs do navegador. O layout do Next.js continua sendo um Server Component e pode renderizar esses componentes client-side.

A composição recomendada é:

```text
RootLayout (Server Component)
└── AccessibilityProvider (Client Component)
    ├── conteúdo da aplicação
    └── AccessibilityWidget (Client Component)
```

O provider deve ficar no layout raiz quando a barra precisa funcionar em todas as rotas. Colocá-lo somente em uma página limita o estado e o widget àquela rota.

## 3. Estado das preferências

O estado público é representado por `AccessibilitySettings`:

| Propriedade | Tipo | Padrão | Efeito |
| --- | --- | ---: | --- |
| `fontSize` | `number` | `100` | Define o tamanho da fonte do documento em porcentagem. |
| `highContrast` | `boolean` | `false` | Ativa o atributo de alto contraste. |
| `darkMode` | `boolean` | `false` | Ativa o atributo de modo escuro. |
| `dyslexiaFont` | `boolean` | `false` | Ativa o atributo da fonte para dislexia. |
| `highlightLinks` | `boolean` | `false` | Ativa o destaque global de links. |
| `readingLine` | `boolean` | `false` | Exibe uma linha horizontal na posição do cursor. |
| `markerLine` | `boolean` | `false` | Exibe uma faixa-guia na posição do cursor. |

O tamanho da fonte é limitado pela normalização entre `40` e `200`. Os controles visuais alteram o tamanho em passos de `20` pontos percentuais.

Alto contraste e modo escuro são mutuamente exclusivos. Ativar um desativa o outro.

## 4. Provider e persistência

Exemplo de configuração:

```tsx
<AccessibilityProvider
  initialSettings={{ fontSize: 120, dyslexiaFont: true }}
  storageKey="meu-app-a11y"
  persist
>
  {children}
</AccessibilityProvider>
```

### Propriedades do provider

- `children`: conteúdo React que terá acesso ao contexto.
- `initialSettings`: valores iniciais parciais. Valores inválidos são substituídos pelos defaults.
- `persist`: controla o uso do `localStorage`. O padrão é `true`.
- `storageKey`: chave usada no `localStorage`. O padrão é `a11y-settings`.

### Fluxo de inicialização

1. O primeiro render usa somente valores determinísticos e não acessa `window` nem `localStorage`.
2. Após a montagem no navegador, o provider lê o storage configurado.
3. O JSON é validado e normalizado.
4. A preferência carregada atualiza o estado.
5. O estado final é persistido quando `persist` está ativo.
6. Outro efeito sincroniza o estado com o elemento `<html>`.

Esse fluxo evita que preferências salvas produzam HTML diferente entre servidor e cliente durante a hidratação do Next.js.

Se o storage contiver JSON inválido ou estiver indisponível, o provider remove a entrada inválida quando possível e continua usando os valores atuais.

## 5. API do hook

Use o hook somente dentro de `AccessibilityProvider`:

```tsx
"use client";

import { useAccessibility } from "your-package";

export function CustomControl() {
  const { darkMode, toggleDarkMode } = useAccessibility();

  return (
    <button type="button" onClick={toggleDarkMode} aria-pressed={darkMode}>
      Modo escuro
    </button>
  );
}
```

O hook expõe o estado e as seguintes ações:

- `increaseFontSize()` e `decreaseFontSize()`.
- `resetFontSize()`.
- `toggleHighContrast()`.
- `toggleDarkMode()`.
- `toggleDyslexiaFont()`.
- `toggleHighlightLinks()`.
- `toggleReadingLine()`.
- `toggleMarkerLine()`.
- `resetAccessibility()`.

Fora do provider, `useAccessibility` lança um erro explícito para indicar configuração incorreta.

## 6. Injeção no DOM

A sincronização ocorre exclusivamente em `document.documentElement`.

A única propriedade inline usada é:

```html
<html style="font-size: 120%;">
```

As outras preferências usam atributos:

| Preferência | Atributo quando ativa |
| --- | --- |
| Alto contraste | `data-a11y-contrast="true"` |
| Modo escuro | `data-a11y-dark="true"` |
| Fonte para dislexia | `data-a11y-dyslexia="true"` |
| Destaque de links | `data-a11y-highlight-links="true"` |
| Linha de leitura | `data-a11y-reading-line="true"` |
| Linha guia | `data-a11y-marker-line="true"` |

Quando uma opção é desativada, seu atributo é removido. Isso mantém o DOM previsível e permite que CSS comum ou Tailwind reaja aos estados.

## 7. Widget visual

O widget pode ser configurado por propriedades:

```tsx
<AccessibilityWidget
  position="bottom-left"
  primaryColor="bg-blue-600 hover:bg-blue-700"
  className="print:hidden"
/>
```

### Propriedades

- `position`: `bottom-right`, `bottom-left`, `top-right` ou `top-left`. O padrão é `bottom-right`.
- `primaryColor`: classes Tailwind usadas no botão principal e nos controles ativos.
- `className`: classes adicionais no container fixo.

O widget inclui:

- Botão flutuante com `aria-expanded`, `aria-controls` e label dinâmico.
- Painel identificado com `role="dialog"` e título acessível.
- Foco no primeiro controle quando o painel abre.
- Fechamento com `Escape`.
- Retorno do foco ao botão principal quando o painel fecha.
- `aria-pressed` nos controles booleanos.
- Linhas de leitura com `pointer-events-none` para não bloquear a interação da página.

## 8. Plugin Tailwind

O plugin está em `src/plugin/index.ts` e é exportado por `src/index.ts`.

```ts
import { accessibilityPlugin } from "your-package";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [accessibilityPlugin],
};
```

Variantes disponíveis:

- `a11y-contrast`
- `a11y-dark`
- `a11y-dyslexia`
- `a11y-highlight-links`
- `a11y-reading-line`
- `a11y-marker-line`

Exemplos:

```tsx
<section className="bg-white text-gray-900 a11y-dark:bg-gray-950 a11y-dark:text-white a11y-contrast:bg-black a11y-contrast:text-yellow-300">
  Conteúdo adaptável
</section>
```

As variantes procuram os atributos no elemento `<html>`. O plugin precisa ser registrado no Tailwind do projeto consumidor para que as classes sejam geradas.

## 9. Estrutura do projeto

```text
src/
├── app/
│   ├── globals.css       # estilos globais e estados da demonstração
│   ├── layout.tsx        # provider e widget globais da demo
│   └── page.tsx          # página de teste
├── components/
│   ├── AccessibilityContext.tsx
│   └── AccessibilityWidget.tsx
├── hooks/
│   └── useMousePosition.ts
├── plugin/
│   └── index.ts
└── index.ts              # API pública da biblioteca
```

## 10. Desenvolvimento e validação

```bash
npm run lint
npm run build
npm run dev
```

Durante os testes manuais, verifique:

1. A aplicação inicia em `http://localhost:3000`.
2. O widget abre e fecha por mouse e teclado.
3. `Escape` fecha o painel e devolve o foco ao trigger.
4. Preferências sobrevivem a um reload quando `persist` está ativo.
5. JSON inválido no storage não quebra a aplicação.
6. Aumentar a fonte altera o `font-size` do `<html>`.
7. Os demais estados alteram somente os atributos `data-a11y-*`.
8. Alto contraste e modo escuro não ficam ativos simultaneamente.
9. As variantes do Tailwind respondem aos atributos.
10. O layout ocupa toda a largura em desktop e mobile.

## 11. Estado atual do pacote

O projeto possui uma API pública inicial em `src/index.ts`, mas ainda está configurado como uma aplicação Next.js privada (`"private": true`). Antes de publicar no npm, será necessário adicionar um processo de empacotamento, gerar declarações TypeScript e separar as dependências de runtime da aplicação de demonstração.
