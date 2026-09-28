// Página de demonstração usada para visualizar as alterações de acessibilidade.
export default function Home() {
  return (
    <main className="min-h-[100dvh] w-full flex-1 bg-white text-gray-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-12">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Accessibility settings bar
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            Teste os recursos de acessibilidade
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-gray-700">
            Use o botão no canto da tela para ativar a fonte para dislexia,
            destacar links ou acompanhar a linha de leitura.
          </p>
        </header>

        <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">Área de teste</h2>
            <p className="mt-3 leading-7 text-gray-700">
              Este texto ajuda a perceber as alterações visuais. Acesse também
              o <a className="font-semibold text-red-700 underline" href="#recursos">resumo dos recursos</a>.
            </p>
          </div>
          <div id="recursos" className="space-y-2 text-gray-700">
            <p>Fonte para dislexia</p>
            <p>Links destacados</p>
            <p>Linha guia de leitura</p>
          </div>
        </section>
      </div>
    </main>
  );
}
