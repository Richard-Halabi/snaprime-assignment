// React
import { useState } from 'react'
// Server
import { saveAd } from '#/server/update-ad'
// Types
import type { Ad } from '#/types/project'
// Helpers
import { regenerateSingleAd } from '#/lib/regenerate-ad'

type AdCardProps = {
  projectId: string
  ad: Ad
}

export default function AdCard({ projectId, ad }: AdCardProps) {
  const [draft, setDraft] = useState(ad)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  /**
   * Persists user edits.
   */
  const handleSave = async () => {
    try {
      setIsSaving(true)

      const updated = await saveAd({
        data: {
          projectId,
          ad: draft,
        },
      })

      setDraft(updated)

      console.log('✅ Advertisement saved.')
    } catch (error) {
      console.error('Failed to save advertisement.', error)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Regenerates only this advertisement.
   */
  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true)

      const updated = await regenerateSingleAd({
        data: {
          projectId,
          adId: draft.id,
        },
      })

      setDraft(updated)

      console.log('✅ Advertisement regenerated.')
    } catch (error) {
      console.error('Failed to regenerate advertisement.', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <article className="island-shell flex h-full flex-col rounded-3xl border border-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:border-violet-500/40">
      {/* Image */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <img
          src={draft.image}
          alt={draft.headline}
          className="h-56 w-full object-cover"
        />
      </div>

      {/* Creative Idea */}
      <label className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
        Creative Idea
      </label>

      <textarea
        rows={3}
        value={draft.idea}
        onChange={(e) =>
          setDraft({
            ...draft,
            idea: e.target.value,
          })
        }
        className="mb-6 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-violet-500"
      />

      {/* Headline */}
      <label className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
        Headline
      </label>

      <input
        value={draft.headline}
        onChange={(e) =>
          setDraft({
            ...draft,
            headline: e.target.value,
          })
        }
        className="mb-6 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-lg font-semibold text-white outline-none transition focus:border-violet-500"
      />

      {/* Primary Text */}
      <label className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
        Primary Text
      </label>

      <textarea
        rows={6}
        value={draft.primaryText}
        onChange={(e) =>
          setDraft({
            ...draft,
            primaryText: e.target.value,
          })
        }
        className="mb-6 w-full rounded-xl border border-white/10 bg-white/5 p-3 leading-7 text-gray-300 outline-none transition focus:border-violet-500"
      />

      {/* Description */}
      <label className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
        Description
      </label>

      <textarea
        rows={3}
        value={draft.description}
        onChange={(e) =>
          setDraft({
            ...draft,
            description: e.target.value,
          })
        }
        className="mb-6 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-gray-400 outline-none transition focus:border-violet-500"
      />

      {/* CTA */}
      <label className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
        Call To Action
      </label>

      <input
        value={draft.callToAction}
        onChange={(e) =>
          setDraft({
            ...draft,
            callToAction: e.target.value,
          })
        }
        className="mb-8 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition focus:border-violet-500"
      />

      {/* Actions */}
      <div className="mt-auto flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isRegenerating}
          className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : '💾 Save'}
        </button>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isSaving || isRegenerating}
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRegenerating ? 'Generating...' : '♻️ Regenerate'}
        </button>
      </div>
    </article>
  )
}
