import type { Ad } from '#/types/project'
import AdCard from './AdCard'

type AdsGridProps = {
  projectId: string
  ads: Ad[]
}

export default function AdsGrid({ projectId, ads }: AdsGridProps) {
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
        {ads.map((ad) => (
          <AdCard projectId={projectId} key={ad.id} ad={ad} />
        ))}
      </div>
    </section>
  )
}
