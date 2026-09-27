"use client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-100 p-6 shadow-sm a11y-contrast:bg-black a11y-contrast:border-b a11y-contrast:border-white a11y-dark:bg-[#121212] a11y-dark:border-b a11y-dark:border-[#191414]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 a11y-contrast:text-white a11y-dark:text-[#655b5b]">
            Accessibility Demo
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:underline a11y-contrast:text-yellow-400 a11y-dark:text-[#8d8080] a11y-highlight-links:bg-yellow-300 a11y-highlight-links:text-black a11y-highlight-links:px-1"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:underline a11y-contrast:text-yellow-400 a11y-dark:text-[#8d8080] a11y-highlight-links:bg-yellow-300 a11y-highlight-links:text-black a11y-highlight-links:px-1"
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6 space-y-8 w-full">
        <section>
          <h2 className="text-xl font-semibold mb-4 a11y-contrast:text-white a11y-dark:text-[#655b5b]">
            Welcome to the Accessibility Component Test
          </h2>
          <p className="text-gray-700 leading-relaxed a11y-contrast:text-white a11y-dark:text-[#655b5b]">
            This page demonstrates the usage of the custom Next.js accessibility widget. You can use the floating button to change font sizes, toggle high contrast, activate dark mode, and use reading/marker lines.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed a11y-contrast:text-white a11y-dark:text-[#655b5b]">
            Observe how the utility classes react immediately to the states managed by the AccessibilityContext.
            <a href="#" className="ml-1 text-blue-600 underline a11y-highlight-links:bg-yellow-300 a11y-highlight-links:text-black a11y-highlight-links:px-1">Check this link highlight!</a>
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow border border-gray-200 a11y-contrast:bg-black a11y-contrast:border-white a11y-dark:bg-[#121212] a11y-dark:border-[#191414]">
          <h3 className="text-lg font-medium mb-3 a11y-contrast:text-white a11y-dark:text-[#655b5b]">Sample Form</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1 a11y-contrast:text-white a11y-dark:text-[#655b5b]"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 a11y-contrast:bg-black a11y-contrast:border-white a11y-contrast:text-white a11y-dark:bg-[#191414] a11y-dark:border-[#292323] a11y-dark:text-[#655b5b]"
                placeholder="Enter your name"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 a11y-contrast:bg-yellow-400 a11y-contrast:text-black a11y-contrast:font-bold a11y-dark:bg-[#292323] a11y-dark:text-[#655b5b] a11y-dark:border a11y-dark:border-[#191414]"
            >
              Submit
            </button>
          </form>
        </section>

        <section>
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 a11y-contrast:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">Image placeholder</span>
          </div>
          <p className="text-sm mt-2 text-gray-500 a11y-contrast:text-white a11y-dark:text-[#655b5b]">
            Images can also respond to accessibility states (e.g., adding grayscale or modifying contrast).
          </p>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-6 mt-8 a11y-contrast:bg-black a11y-contrast:border-t a11y-contrast:border-white a11y-dark:bg-[#121212] a11y-dark:border-t a11y-dark:border-[#191414] a11y-dark:text-[#655b5b]">
         <div className="max-w-4xl mx-auto text-center">
            <p>&copy; 2024 Accessibility Demo. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
