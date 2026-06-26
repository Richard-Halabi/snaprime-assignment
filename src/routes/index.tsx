import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap flex min-h-screen items-center justify-center px-4">
      <section className="island-shell w-full max-w-2xl rounded-3xl p-10">
        <h1 className="mb-3 text-4xl font-bold">URL → Ready-to-launch Ad</h1>

        <p className="mb-8 text-gray-500">
          Paste a website URL and generate a brand profile and ready-to-edit
          ads.
        </p>

        <form className="space-y-4">
          <label className="block text-sm font-medium">Website URL</label>

          <input
            type="url"
            placeholder="https://example.com"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Create
          </button>
        </form>
      </section>
    </main>
  )
}
