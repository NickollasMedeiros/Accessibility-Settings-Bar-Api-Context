export default function Home() {
  return (
    <main className="min-h-[100dvh] w-full flex-1 bg-white text-gray-950 a11y-dark:bg-gray-950 a11y-dark:text-gray-100 a11y-contrast:bg-black a11y-contrast:text-yellow-300">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-12">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700 a11y-dark:text-red-300 a11y-contrast:text-yellow-300">
            Accessibility settings bar
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 a11y-dark:text-gray-100 a11y-contrast:text-yellow-300 sm:text-5xl">
            Teste os recursos de acessibilidade
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-gray-700 a11y-dark:text-gray-300 a11y-contrast:text-white">
            Use o botão no canto da tela para ajustar fonte, contraste, modo
            escuro, destaque de links e guias de leitura.
          </p>
        </header>

        <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm a11y-dark:border-gray-700 a11y-dark:bg-gray-900 a11y-contrast:border-yellow-300 a11y-contrast:bg-black sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-950 a11y-dark:text-gray-100 a11y-contrast:text-yellow-300">Área de teste</h2>
            <p className="mt-3 leading-7 text-gray-700 a11y-dark:text-gray-300 a11y-contrast:text-white">
              Este texto ajuda a perceber as alterações visuais. Acesse também
              o <a className="font-semibold text-red-700 underline a11y-dark:text-red-300 a11y-contrast:text-yellow-300" href="#recursos">resumo dos recursos</a>.
            </p>
          </div>
          <div id="recursos" className="space-y-2 text-gray-700 a11y-dark:text-gray-300 a11y-contrast:text-white">
            <p>Texto redimensionável</p>
            <p>Contraste alto e modo escuro</p>
            <p>Fonte para dislexia</p>
            <p>Linhas de leitura e guia</p>
          </div>
        </section>
      </div>
    </main>
  );
}
