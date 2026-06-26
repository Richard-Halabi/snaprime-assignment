// React
import { createServerFn } from '@tanstack/react-start'
// Helpers
import { renderWebsite } from '#/lib/browser'
import { parseWebsite } from '#/parsers/website'
import { generateBrandProfile } from '#/lib/gemini'
import {
  saveProject,
  updateAds,
  updateProject,
  updateStatus,
} from '#/lib/projects'
import { generateAds } from '#/lib/ads'

/**
 * Renders a website using Browserless and extracts structured content
 * from the resulting HTML.
 *
 * Pipeline:
 * 1. Render the website with Browserless.
 * 2. Parse the rendered HTML into structured website content.
 *
 * @param url The website URL to extract.
 * @returns Structured website content.
 *
 * Renders a website, extracts structured content and generates
 * an AI-powered brand profile.
 */
export const extractWebsite = createServerFn({
  method: 'POST',
})
  .validator((url: string) => url)
  .handler(async ({ data: url }) => {
    const projectId = await saveProject(url)

    try {
      await updateStatus(projectId, 'extracting')

      const html = await renderWebsite(url)

      const website = parseWebsite(html)

      await updateStatus(projectId, 'generating-brand')

      const brandProfile = await generateBrandProfile(website)

      await updateProject(projectId, {
        brandProfile,
      })

      await updateStatus(projectId, 'generating-ads')

      const ads = await generateAds(brandProfile)

      await updateAds(projectId, ads)

      await updateStatus(projectId, 'completed')

      return {
        projectId,
        brandProfile,
        ads,
      }
    } catch (error) {
      await updateStatus(projectId, 'failed')
      throw error
    }
  })
