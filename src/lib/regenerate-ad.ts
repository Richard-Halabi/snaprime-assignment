import { createServerFn } from '@tanstack/react-start'

// AI
import { regenerateAd } from '#/lib/gemini'

// Firebase
import { getProject, updateAd } from '#/lib/projects'

type Request = {
  projectId: string
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
    const project = await getProject(data.projectId)

    if (!project) {
      throw new Error('Project not found.')
    }

    if (!project.brandProfile) {
      throw new Error('Brand profile not found.')
    }

    const currentAd = project.ads.find((ad) => ad.id === data.adId)

    if (!currentAd) {
      throw new Error('Advertisement not found.')
    }

    const updatedAd = await regenerateAd(project.brandProfile, currentAd)

    await updateAd(project.id, updatedAd)

    return updatedAd
  })
