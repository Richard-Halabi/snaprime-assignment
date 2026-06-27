// React
import { useState } from 'react'
// Server
import { saveAd } from '#/server/update-ad'
// Types
import type { Ad, ProjectResult } from '#/types/project'
// Helpers
import { regenerateSingleAd } from '#/server/regenerate-ad'
import ErrorBanner from './ErrorBanner'

type AdCardProps = {
  project: ProjectResult
  ad: Ad
}

export default function AdCard({ project, ad }: AdCardProps) {
  // Local State
  const [draft, setDraft] = useState<Ad>(ad)
  const [isPosting, setIsPosting] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Persists user edits.
   */
  const handleSave = async () => {
    setError(null)
    setIsPosting(true)
    try {
      await saveAd({
        data: {
          project,
          ad: draft,
        },
      })

      console.log('✅ Advertisement Saved.')
    } catch (error) {
      setError('Unable to save advertisement.')
    } finally {
      setIsPosting(false)
    }
  }

  /**
   * Regenerates only this advertisement.
   */
  const handleRegenerate = async (): Promise<void> => {
    setError(null)
    setIsPosting(true)
    try {
      await regenerateSingleAd({
        data: {
          project: project,
          adId: draft.id,
        },
      })

      console.log('✅ Advertisement Regenerated.')
    } catch (error) {
      setError('Unable to regenerate advertisement.')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <article className="island-shell flex h-full flex-col rounded-3xl border border-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:border-violet-500/40">
      {/* Current Image */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <img
          src={draft.image}
          alt={draft.headline}
          className="h-56 w-full object-cover"
        />
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowImages((value) => !value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:border-violet-500"
        >
          {showImages ? 'Hide Images' : '🖼 Swap Image'}
        </button>
      </div>

      {showImages && (
        <div className="mb-6">
          <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-violet-400">
            Available Images
          </label>

          <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-white/10 p-2">
            {project.brandProfile.images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => {
                  setDraft({
                    ...draft,
                    image,
                  })

                  setShowImages(false)
                }}
                className={`relative overflow-hidden rounded-xl border-2 transition ${
                  draft.image === image
                    ? 'border-violet-500'
                    : 'border-transparent hover:border-white/30'
                }`}
              >
                <img src={image} alt="" className="h-20 w-full object-cover" />

                {draft.image === image && (
                  <div className="absolute right-2 top-2 rounded-full bg-violet-600 px-2 py-1 text-xs font-bold text-white">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

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
          disabled={isPosting}
          className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPosting ? 'Saving...' : '💾 Save'}
        </button>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isPosting}
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPosting ? 'Generating...' : '♻️ Regenerate'}
        </button>
      </div>

      {/*****************************************************/}
      {/********************** error ************************/}
      {/*****************************************************/}
      {error && <ErrorBanner message={error} />}
    </article>
  )
}
