// Server
import { createServerFn } from '@tanstack/react-start'

import { updateAd } from '#/lib/projects'

import type { Ad, ProjectResult } from '#/types/project'

type Request = {
  project: ProjectResult
  ad: Ad
}

/**
 * Persists edits to a single advertisement.
 */
export const saveAd = createServerFn({
  method: 'POST',
})
  .validator((data: Request) => data)
  .handler(async ({ data }) => {
    try {
      await updateAd(data.project, data.ad)

      return data.ad
    } catch (error) {
      throw new Error('Failed to save advertisement.')
    }
  })
