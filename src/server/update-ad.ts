import { createServerFn } from '@tanstack/react-start'

import { updateAd } from '#/lib/projects'

import type { Ad } from '#/types/project'

type UpdateAdRequest = {
  projectId: string
  ad: Ad
}

/**
 * Persists user edits for a single advertisement.
 *
 * Unlike regeneration, this endpoint never calls Gemini.
 * It simply saves the user's edits.
 */
export const saveAd = createServerFn({
  method: 'POST',
})
  .validator((data: UpdateAdRequest) => data)
  .handler(async ({ data }) => {
    await updateAd(data.projectId, data.ad)

    return data.ad
  })
