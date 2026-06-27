import { createServerFn } from '@tanstack/react-start'

import { updateAd } from '#/lib/projects'

import type { Ad } from '#/types/project'

type Request = {
  projectId: string
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
    await updateAd(data.projectId, data.ad)

    return data.ad
  })
