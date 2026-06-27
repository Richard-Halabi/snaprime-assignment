// React
import { useState } from 'react'
// React Router
import { createFileRoute } from '@tanstack/react-router'
// Reusable Components
import UrlInput from '#/components/UrlInput'
import StarBackground from '#/components/StarBackground'
import BrandProfileCard from '#/components/BrandProfileCard'
import AdsGrid from '#/components/AdsCard'
// Types
import type { ProjectResult } from '#/types/project'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  // Local state
  const [project, setProject] = useState<ProjectResult | null>(null)

  return (
    <main className="page-wrap px-4 py-16 min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
      {/*************************************************/}
      {/***************** StarBackground ****************/}
      {/*************************************************/}
      <StarBackground />
      {/*************************************************/}
      {/******************* Section *********************/}
      {/*************************************************/}
      <section className="mx-auto max-w-3xl island-shell w-full max-w-2xl rounded-3xl p-10">
        <h1 className="mb-3 text-4xl font-bold">
          🚀 Turn Your Website into High-Converting Ads
        </h1>

        <p className="mb-8 text-lg text-gray-400">
          🌐 Paste any website URL and let AI extract the brand, analyze the
          business, and generate ready-to-launch advertisements in seconds.
        </p>
        {/*************************************************/}
        {/***************** Url Input *********************/}
        {/*************************************************/}
        <UrlInput onComplete={setProject} />
      </section>
      {project && (
        <section className="page-wrap mt-16 space-y-12">
          {/*************************************************/}
          {/***************** Brand Profile *****************/}
          {/*************************************************/}
          <BrandProfileCard profile={project.brandProfile} />
          {/*************************************************/}
          {/******************** Ads ************************/}
          {/*************************************************/}
          <AdsGrid project={project} />
        </section>
      )}
    </main>
  )
}
