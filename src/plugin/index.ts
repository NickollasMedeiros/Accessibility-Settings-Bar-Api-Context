import plugin from "tailwindcss/plugin";

/**
 * Cria variantes Tailwind que ativam estilos quando o provider coloca o
 * atributo correspondente no elemento raiz <html>.
 */
export const accessibilityPlugin = plugin(({ addVariant }) => {
  addVariant("a11y-dyslexia", ":is(html[data-a11y-dyslexia=\"true\"]) &");
  addVariant("a11y-highlight-links", ":is(html[data-a11y-highlight-links=\"true\"]) &");
});
