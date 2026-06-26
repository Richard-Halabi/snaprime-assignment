import type { BrandProfile } from '#/types/project'

type BrandProfileCardProps = {
  profile: BrandProfile
}

export default function BrandProfileCard({ profile }: BrandProfileCardProps) {
  return (
    <section className="island-shell mt-10 rounded-3xl p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-widest text-violet-400">
          Brand Profile
        </p>

        <h2 className="text-3xl font-bold text-white">{profile.company}</h2>
      </div>

      <div className="grid gap-6">
        <div>
          <h3 className="mb-2 font-semibold text-white">Description</h3>

          <p className="text-gray-300">{profile.description}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-white">Target Audience</h3>

          <p className="text-gray-300">{profile.audience}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-white">Value Proposition</h3>

          <p className="text-gray-300">{profile.valueProposition}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-white">Brand Tone</h3>

          <span className="inline-flex rounded-full bg-violet-600/20 px-3 py-1 text-sm text-violet-300">
            {profile.tone}
          </span>
        </div>
      </div>
    </section>
  )
}
