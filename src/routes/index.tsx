import { createFileRoute } from '@tanstack/react-router'
import UrlInput from '#/components/UrlInput'
import StarBackground from '#/components/StarBackground'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="page-wrap flex min-h-screen items-center justify-center px-4">
      <StarBackground />
      <section className="island-shell w-full max-w-2xl rounded-3xl p-10">
        <h1 className="mb-3 text-4xl font-bold">URL →→→ Ready-to-launch Ad</h1>

        <p className="mb-8 text-gray-500">
          Paste a website URL and generate a brand profile and ready-to-edit
          ads.
        </p>

        <UrlInput />
      </section>
    </main>
  )
}
