import type { Ad } from '#/types/project'

type AdsGridProps = {
  ads: Ad[]
}

export default function AdsGrid({ ads }: AdsGridProps) {
  return (
    <section className="mt-10">
      <div className="mb-6">
        <p className="mb-2 text-sm uppercase tracking-widest text-violet-400">
          Generated Ads
        </p>

        <h2 className="text-3xl font-bold text-white">Ready to Launch 🚀</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {ads.map((ad) => (
          <article
            key={ad.id}
            className="island-shell flex flex-col rounded-3xl p-6"
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-violet-400">
              {ad.idea}
            </p>

            <h3 className="mb-4 text-2xl font-bold text-white">
              {ad.headline}
            </h3>

            <p className="mb-4 text-gray-300">{ad.primaryText}</p>

            <p className="mb-6 text-sm text-gray-400">{ad.description}</p>

            <div className="mt-auto">
              <button className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500">
                {ad.callToAction}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
