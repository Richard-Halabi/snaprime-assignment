// Server
import { createServerFn } from '@tanstack/react-start'

// AI
import { generateReplacementAd } from '#/lib/gemini'

// Firebase
import { updateAd } from '#/lib/projects'
import type { ProjectResult } from '#/types/project'

type Request = {
  project: ProjectResult
  adId: string
}

/**
 * Regenerates a single advertisement.
 *
 * The existing brand profile is reused so only one advertisement changes.
 * All other advertisements remain untouched.
 */
export const regenerateSingleAd = createServerFn({
  method: 'POST',
})
  .validator((data: Request) => data)
  .handler(async ({ data }) => {
    try {
      const currentAd = data.project.ads.find((ad) => ad.id === data.adId)

      if (!currentAd) {
        throw new Error('Advertisement not found.')
      }

      const updatedAd = await generateReplacementAd(
        data.project.brandProfile,
        currentAd,
      )

      console.log('1. updating db')

      await updateAd(data.project, updatedAd)

      console.log('2. returning new payload')

      return updatedAd
    } catch (error) {
      console.error('regenerateSingleAd failed:', error)

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to regenerate advertisement.',
      )
    }
  })
