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
            className="island-shell flex h-full flex-col rounded-3xl border border-white/10 p-6 transition-all hover:border-violet-500/40 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={ad.image}
                alt={ad.headline}
                className="h-52 w-full object-cover"
              />
            </div>

            {/* Idea */}
            <span className="mb-3 inline-flex w-fit rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-300">
              {ad.idea}
            </span>

            {/* Headline */}
            <h3 className="mb-4 text-2xl font-bold leading-tight text-white">
              {ad.headline}
            </h3>

            {/* Primary Text */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Primary Text
              </p>

              <p className="leading-7 text-gray-300">{ad.primaryText}</p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Description
              </p>

              <p className="text-sm leading-6 text-gray-400">
                {ad.description}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <button className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white transition hover:opacity-90">
                {ad.callToAction}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
