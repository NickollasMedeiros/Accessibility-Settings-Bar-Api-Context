# Implementacao da API de Acessibilidade

Este documento descreve como transformar e integrar este projeto como uma biblioteca reutilizavel de acessibilidade em outros projetos React e Next.js.

O texto foi escrito para duas pessoas diferentes:

- Desenvolvedores que precisam instalar e configurar a biblioteca.
- Agentes de IA que precisam executar a implementacao sem inventar caminhos, exports ou comportamentos.

## 1. Objetivo

A biblioteca concentra preferencias de acessibilidade em um Context API e oferece uma barra visual reutilizavel.

Ela deve permitir que uma aplicacao:

- aumente ou reduza o tamanho global da fonte;
- ative alto contraste;
- ative modo escuro;
- use uma fonte ou espacamento para facilitar a leitura;
- destaque links;
- mostre uma linha de leitura ou uma faixa-guia seguindo o cursor;
- persista preferencias no `localStorage`;
- exponha as mesmas funcoes para controles personalizados;
- reaja aos estados por classes Tailwind e atributos `data-*`.

## 2. Estado atual do repositorio

Este repositorio atualmente contem uma aplicacao Next.js de demonstracao e uma API publica inicial em `src/index.ts`.

Neste momento:

- o projeto esta marcado como privado em `package.json`;
- nao existe um build separado da biblioteca;
- nao existe um diretorio `dist` publicado;
- nao existe um `exports` de pacote configurado;
- os imports documentados como `your-package` sao exemplos futuros, nao imports funcionais deste repositorio;
- a demo pode ser executada localmente com `npm run dev`.

Portanto, ha dois modos de uso:

1. **Uso imediato:** copiar os modulos reutilizaveis para outro projeto.
2. **Uso recomendado:** preparar o empacotamento e consumir uma versao compilada pelo GitHub ou pelo npm.

Nao documente a instalacao direta por GitHub como pronta antes de gerar os artefatos compilados e testar a instalacao em um projeto separado.

## 3. Arquitetura

A biblioteca e formada por estas partes:

```text
src/
├── components/
│   ├── AccessibilityContext.tsx
│   └── AccessibilityWidget.tsx
├── hooks/
│   └── useMousePosition.ts
├── plugin/
│   └── index.ts
└── index.ts
```

### `AccessibilityContext`

Arquivo: `src/components/AccessibilityContext.tsx`

Responsabilidades:

- armazenar o estado das preferencias;
- fornecer valores e funcoes por Context API;
- normalizar configuracoes invalidas;
- limitar `fontSize` entre `40` e `200`;
- salvar e restaurar preferencias do `localStorage`;
- atualizar o tamanho da fonte do elemento `<html>`;
- adicionar e remover os atributos `data-a11y-*`;
- impedir que alto contraste e modo escuro fiquem ativos ao mesmo tempo.

### `AccessibilityWidget`

Arquivo: `src/components/AccessibilityWidget.tsx`

Responsabilidades:

- renderizar o botao flutuante;
- abrir e fechar o painel;
- chamar as funcoes do contexto;
- exibir a linha de leitura e a faixa-guia;
- gerenciar foco ao abrir e fechar;
- fechar o painel com `Escape`;
- fornecer atributos ARIA para os controles.

### `useMousePosition`

Arquivo: `src/hooks/useMousePosition.ts`

Responsabilidade:

- acompanhar a posicao vertical do mouse somente quando uma linha estiver ativa;
- agrupar atualizacoes com `requestAnimationFrame` para evitar renders excessivos.

### `accessibilityPlugin`

Arquivo: `src/plugin/index.ts`

Responsabilidade:

- criar variantes Tailwind que reagem aos atributos colocados no elemento `<html>`.

### `src/index.ts`

E o barrel publico. Ele deve ser a referencia dos exports permitidos pela biblioteca.

## 4. API publica

Os exports atuais sao:

```ts
import {
  AccessibilityProvider,
  AccessibilityWidget,
  defaultAccessibilitySettings,
  normalizeAccessibilitySettings,
  useAccessibility,
  useMousePosition,
  accessibilityPlugin,
} from "your-package";
```

Tambem sao exportados os tipos:

```ts
import type {
  AccessibilityContextProps,
  AccessibilityProviderProps,
  AccessibilitySettings,
  AccessibilityWidgetProps,
  MousePosition,
} from "your-package";
```

Os nomes acima precisam continuar sincronizados com `src/index.ts`. Nao adicione nomes apenas na documentacao.

## 5. Modelo de configuracoes

`AccessibilitySettings` possui estas propriedades:

| Propriedade | Tipo | Padrao | Comportamento |
| --- | --- | --- | --- |
| `fontSize` | `number` | `100` | Porcentagem do tamanho da fonte do documento. |
| `highContrast` | `boolean` | `false` | Ativa alto contraste. |
| `darkMode` | `boolean` | `false` | Ativa modo escuro. |
| `dyslexiaFont` | `boolean` | `false` | Ativa fonte e espacamento alternativos. |
| `highlightLinks` | `boolean` | `false` | Destaca links globalmente. |
| `readingLine` | `boolean` | `false` | Mostra uma linha fina na altura do cursor. |
| `markerLine` | `boolean` | `false` | Mostra uma faixa-guia na altura do cursor. |

Regras importantes:

- `fontSize` e limitado entre `40` e `200`.
- Os botoes alteram a fonte em passos de `20` pontos percentuais.
- Alto contraste e modo escuro sao mutuamente exclusivos.
- Valores desconhecidos ou tipos invalidos sao ignorados pela normalizacao.
- `resetAccessibility()` retorna para `initialSettings`, e nao necessariamente para o default global.

## 6. Uso imediato por copia local

Enquanto o empacotamento nao estiver pronto, copie para o projeto consumidor:

```text
src/components/AccessibilityContext.tsx
src/components/AccessibilityWidget.tsx
src/hooks/useMousePosition.ts
src/plugin/index.ts
src/index.ts
```

Instale as dependencias usadas pelos componentes:

```bash
npm install @heroicons/react clsx tailwind-merge
```

O projeto consumidor tambem deve possuir React e React DOM compativeis.

Copie ou adapte as regras de `src/app/globals.css`. O provider controla os atributos, mas o projeto consumidor precisa fornecer os estilos que usam esses atributos.

## 7. Integracao no Next.js App Router

O provider deve ficar em um layout que envolva todas as rotas que precisam da acessibilidade.

Exemplo:

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

`AccessibilityProvider` e `AccessibilityWidget` sao Client Components. O layout pode continuar sendo um Server Component, porque o Next.js permite que ele renderize componentes client-side.

Qualquer componente que use `useAccessibility` deve conter:

```tsx
"use client";
```

Nao acesse `window`, `document` ou `localStorage` durante o render de um Server Component.

## 8. Configuracao inicial e persistencia

```tsx
<AccessibilityProvider
  initialSettings={{
    fontSize: 120,
    dyslexiaFont: true,
  }}
  persist
  storageKey="meu-site-a11y"
>
  {children}
</AccessibilityProvider>
```

Props do provider:

- `children`: componentes que terao acesso ao contexto.
- `initialSettings`: configuracoes iniciais parciais.
- `persist`: habilita ou desabilita o `localStorage`; o padrao e `true`.
- `storageKey`: chave usada no `localStorage`; o padrao e `a11y-settings`.

Ao iniciar no navegador, o provider:

1. le o valor salvo;
2. tenta converter o JSON;
3. normaliza os valores;
4. atualiza o estado;
5. salva alteracoes futuras;
6. sincroniza os atributos do elemento `<html>`.

JSON invalido nao deve quebrar a aplicacao. A entrada invalida e removida quando o navegador permitir.

## 9. Uso do hook

O hook so pode ser usado dentro de `AccessibilityProvider`:

```tsx
"use client";

import { useAccessibility } from "your-package";

export function CustomAccessibilityButton() {
  const { darkMode, toggleDarkMode } = useAccessibility();

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-pressed={darkMode}
    >
      {darkMode ? "Desativar modo escuro" : "Ativar modo escuro"}
    </button>
  );
}
```

Funcoes disponiveis:

```text
increaseFontSize()
decreaseFontSize()
resetFontSize()
toggleHighContrast()
toggleDarkMode()
toggleDyslexiaFont()
toggleHighlightLinks()
toggleReadingLine()
toggleMarkerLine()
resetAccessibility()
```

Fora do provider, `useAccessibility()` lanca um erro explicito. Isso indica que o componente foi montado fora da arvore correta.

## 10. Configuracao do widget

```tsx
<AccessibilityWidget
  position="bottom-left"
  primaryColor="bg-blue-600 hover:bg-blue-700"
  className="print:hidden"
/>
```

Props:

- `position`: `bottom-right`, `bottom-left`, `top-right` ou `top-left`.
- `primaryColor`: classes Tailwind do botao principal e dos controles ativos.
- `className`: classes extras do container fixo.

O widget ja fornece:

- `aria-expanded`;
- `aria-controls`;
- `aria-haspopup`;
- `aria-pressed` nos toggles;
- foco no primeiro botao ao abrir;
- retorno do foco ao trigger ao fechar;
- fechamento por `Escape`;
- linhas com `pointer-events-none`.

Nao remova os estilos de foco sem fornecer uma alternativa visivel.

## 11. Integracao com Tailwind CSS

No projeto consumidor, registre o plugin:

```ts
import type { Config } from "tailwindcss";
import { accessibilityPlugin } from "your-package";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [accessibilityPlugin],
};

export default config;
```

Variantes disponiveis:

```text
a11y-contrast
a11y-dark
a11y-dyslexia
a11y-highlight-links
a11y-reading-line
a11y-marker-line
```

Exemplo:

```tsx
<section className="bg-white text-gray-900 a11y-dark:bg-gray-950 a11y-dark:text-white a11y-contrast:bg-black a11y-contrast:text-yellow-300">
  Conteudo adaptavel
</section>
```

As variantes procuram os atributos no elemento `<html>`. O plugin sozinho nao altera o estado: quem escreve os atributos e o `AccessibilityProvider`.

## 12. CSS base obrigatorio

O projeto consumidor precisa possuir estilos para os atributos globais. Exemplo minimo:

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

O tamanho da fonte e aplicado diretamente no `<html>`:

```html
<html style="font-size: 120%;">
```

Evite aplicar outro `font-size` fixo no elemento `<html>` do consumidor, pois isso sobrescreveria a configuracao da biblioteca.

## 13. Uso em React ou Vite

No ponto de entrada da aplicacao:

```tsx
import { createRoot } from "react-dom/client";
import {
  AccessibilityProvider,
  AccessibilityWidget,
} from "your-package";
import "./accessibility.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <AccessibilityProvider>
    <App />
    <AccessibilityWidget />
  </AccessibilityProvider>,
);
```

Nesse caso, o ambiente ja e client-side, mas ainda e necessario importar o CSS e registrar o plugin Tailwind caso o projeto use Tailwind.

## 14. Distribuicao recomendada pelo GitHub

Antes de instalar este repositorio como dependencia Git, a biblioteca precisa ser empacotada.

Checklist de preparacao:

1. Definir um nome de pacote diferente do nome da aplicacao demo.
2. Remover ou separar `next`, fontes e arquivos exclusivos da demo do runtime da biblioteca.
3. Criar um script `build:lib`.
4. Gerar JavaScript compilado e declaracoes TypeScript em `dist`.
5. Configurar `main`, `module`, `types` e `exports`.
6. Declarar `react` e `react-dom` como `peerDependencies`.
7. Incluir `dist`, arquivos CSS e o plugin no pacote publicado.
8. Criar uma tag de versao ou apontar para um commit conhecido.
9. Testar a instalacao em uma aplicacao consumidora limpa.

Depois disso, o consumidor podera usar uma dependencia Git com uma configuracao semelhante a:

```bash
npm install github:ORGANIZACAO/REPOSITORIO#v0.1.0
```

O comando so e valido quando o repositorio tiver os artefatos e os exports compilados esperados pelo `package.json`.

## 15. Plano de empacotamento

A separacao recomendada e:

```text
src/app/                 demo Next.js
src/components/          componentes da biblioteca
src/hooks/               hooks da biblioteca
src/plugin/              plugin Tailwind
src/index.ts             entrada publica
src/styles/              CSS distribuivel, se adotado
```

A ferramenta de build deve:

- compilar `src/index.ts`;
- preservar imports de React como dependencias externas;
- gerar declaracoes TypeScript;
- gerar ESM e, se necessario, CommonJS;
- copiar o CSS distribuivel;
- impedir que arquivos de `src/app` entrem no pacote da biblioteca.

A escolha da ferramenta de build deve ser feita antes de alterar `package.json`. A decisao deve considerar o bundler ja usado pelo projeto e a necessidade de tipos.

## 16. Checklist para agentes de IA

Um agente que implementar esta biblioteca em outro projeto deve seguir esta ordem:

1. Identificar se o projeto usa Next.js App Router, Next.js Pages Router, React/Vite ou outro bundler React.
2. Ler `package.json` do consumidor e verificar versoes de React, React DOM e Tailwind.
3. Confirmar se a biblioteca esta publicada ou se ainda exige copia local.
4. Nao importar `your-package` se o consumidor nao tiver um pacote com esse nome instalado.
5. Instalar apenas as dependencias necessarias.
6. Adicionar `AccessibilityProvider` no ponto mais alto que precisa das preferencias.
7. Adicionar `AccessibilityWidget` uma unica vez, salvo se houver uma decisao visual diferente.
8. Marcar com `use client` os componentes que usam `useAccessibility`.
9. Registrar `accessibilityPlugin` somente se Tailwind estiver sendo usado.
10. Importar ou copiar o CSS base.
11. Verificar que o provider escreve atributos no `<html>`.
12. Testar contraste, modo escuro, fonte, links e linhas de leitura.
13. Testar foco, `Escape`, `aria-pressed` e retorno do foco.
14. Testar reload com persistencia ativa.
15. Testar `persist={false}` e uma chave customizada.
16. Executar lint, typecheck, build e testes do consumidor.
17. Relatar qualquer diferenca entre a API instalada e este documento.

Um agente nao deve:

- inventar um export que nao existe;
- acessar `window` ou `document` em Server Components;
- substituir o provider por estado local sem justificativa;
- registrar o plugin em um projeto que nao usa Tailwind;
- afirmar que a instalacao por GitHub funciona sem testar o pacote compilado;
- remover estilos de foco ou atributos ARIA sem alternativa equivalente.

## 17. Troubleshooting

### `useAccessibility must be used within an AccessibilityProvider`

O componente esta fora do provider. Mova o provider para o layout, root ou componente pai que engloba o controle.

### As classes `a11y-*` nao funcionam

Confirme:

- o plugin foi registrado no Tailwind do consumidor;
- o arquivo do componente esta incluido em `content`;
- o provider esta ativo;
- o atributo correspondente existe no elemento `<html>`.

### As preferencias somem ao recarregar

Confirme que `persist` nao esta como `false`, que a origem permite `localStorage` e que a aplicacao nao esta usando uma `storageKey` diferente da esperada.

### O modo escuro e o alto contraste entram em conflito

A implementacao atual desativa automaticamente o outro modo quando um deles e ativado. Nao trate os dois como estados independentes no consumidor.

### O pacote instalado pelo GitHub nao encontra o modulo

O repositorio provavelmente ainda nao possui `dist`, `exports` ou o arquivo de entrada compilado. Use a copia local temporariamente ou finalize o empacotamento antes de publicar a versao.

## 18. Criterios de aceite

A biblioteca estara pronta para reutilizacao quando:

- um projeto Next.js conseguir instalar e importar o pacote;
- um projeto React/Vite conseguir montar o provider;
- os tipos forem resolvidos sem imports internos;
- o widget funcionar sem duplicar listeners globais;
- `fontSize` respeitar os limites;
- alto contraste e modo escuro permanecerem exclusivos;
- o `localStorage` puder ser desativado;
- JSON invalido nao quebrar a aplicacao;
- todas as variantes Tailwind forem geradas;
- foco, teclado e ARIA forem preservados;
- lint, typecheck, build e testes passarem;
- a instalacao via GitHub for testada em um projeto consumidor limpo.

## 19. Comandos de validacao

Na demo atual:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Na biblioteca empacotada, adicionar comandos equivalentes para:

```bash
npm run build:lib
npm run typecheck
npm test
```

O documento e a API devem ser atualizados juntos. Sempre que um export, prop, nome de atributo, comando ou caminho mudar, atualizar este arquivo e validar novamente a instalacao.

## 20. Evolucao futura

Depois da primeira versao distribuivel, as evolucoes recomendadas sao:

- testes unitarios para normalizacao e persistencia;
- testes de componentes para foco, Escape e ARIA;
- testes de integracao com Next.js e Vite;
- CSS base exportado como subpath do pacote;
- suporte a temas configuraveis sem depender de cores fixas;
- controle de idioma dos labels do widget;
- documentacao gerada a partir dos tipos;
- pipeline CI para lint, typecheck, build e testes;
- releases versionadas no GitHub;
- validacao automatizada de acessibilidade com axe ou ferramenta equivalente.
