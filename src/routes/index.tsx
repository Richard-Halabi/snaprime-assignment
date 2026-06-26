// React
import { createFileRoute } from '@tanstack/react-router'
// Reusable Components
import UrlInput from '#/components/UrlInput'
import StarBackground from '#/components/StarBackground'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="page-wrap flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
      <StarBackground />

      <section className="island-shell w-full max-w-2xl rounded-3xl p-10">
        <h1 className="mb-3 text-4xl font-bold">
          🚀 Turn Your Website into High-Converting Ads
        </h1>

        <p className="mb-8 text-lg text-gray-400">
          🌐 Paste any website URL and let AI extract the brand, analyze the
          business, and generate ready-to-launch advertisements in seconds.
        </p>

        <UrlInput />
      </section>
    </main>
  )
}
