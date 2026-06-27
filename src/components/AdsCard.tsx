// Types
import type { ProjectResult } from '#/types/project'
// Reusable Components
import AdCard from './AdCard'

type AdsGridProps = {
  project: ProjectResult
}

export default function AdsGrid({ project }: AdsGridProps) {
  return (
    <section className="mt-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Generated Ads
        </p>

        <h2 className="mt-2 text-4xl font-bold text-white">
          Ready to Launch 🚀
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {project.ads.map((ad) => (
          <AdCard project={project} key={ad.id} ad={ad} />
        ))}
      </div>
    </section>
  )
}
