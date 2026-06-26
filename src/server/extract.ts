// React
import { createServerFn } from '@tanstack/react-start'
// Helpers
import { generateAds } from '#/lib/ads'
import { renderWebsite } from '#/lib/browser'
import { generateBrandProfile } from '#/lib/gemini'
import {
  getProjectByUrl,
  saveProject,
  updateAds,
  updateProject,
  updateStatus,
} from '#/lib/projects'
import { parseWebsite } from '#/parsers/website'

/**
 * Extracts a website and generates AI-powered advertisements.
 *
 * This server function orchestrates the complete advertisement generation
 * pipeline from a single website URL.
 *
 * Pipeline
 * ───────────────────────────────────────────────────────────────
 *
 * 1. Create a new Firestore project.
 * 2. Render the website using Browserless.
 * 3. Parse the rendered HTML into structured website data.
 * 4. Generate a brand profile using Gemini.
 * 5. Persist the generated brand profile.
 * 6. Generate multiple advertisements from the brand profile.
 * 7. Persist the generated advertisements.
 * 8. Mark the project as completed.
 *
 * Project Status Flow
 * ───────────────────────────────────────────────────────────────
 *
 * processing
 *      │
 *      ▼
 * extracting
 *      │
 *      ▼
 * generating-brand
 *      │
 *      ▼
 * generating-ads
 *      │
 *      ▼
 * completed
 *
 * Any error transitions the project to:
 *
 * failed
 *
 * Every stage is persisted to Firestore so the frontend can monitor
 * long-running progress and recover from failures.
 *
 * @param url Website URL submitted by the user.
 *
 * @returns An object containing:
 * - projectId: Firestore project identifier.
 * - brandProfile: AI-generated understanding of the company.
 * - ads: Collection of generated advertisements.
 *
 * @throws {Error}
 * Propagates any Browserless, Gemini, Firestore or parsing errors after
 * updating the project's status to "failed".
 */
export const extractWebsite = createServerFn({
  method: 'POST',
})
  .validator((url: string) => url)
  .handler(async ({ data: url }) => {
    console.log('🔍 Checking cache...')

    const existingProject = await getProjectByUrl(url)

    // 1. project found create a new generation

    if (existingProject) {
      console.log('✅ Existing project found.')

      return {
        projectId: existingProject.id,
        brandProfile: existingProject.brandProfile,
        ads: existingProject.ads,
      }
    }

    // 2. Not project found create a new generation

    console.log('🚀 STEP 1: Creating project...')
    const projectId = await saveProject(url)

    try {
      console.log('🚀 STEP 2: Rendering website...')
      await updateStatus(projectId, 'extracting')

      const html = await renderWebsite(url)
      console.log('✅ Website rendered.')

      console.log('🚀 STEP 3: Parsing website...')
      const website = parseWebsite(html)
      console.log('✅ Website parsed.')

      console.log('🚀 STEP 4: Generating brand profile...')
      await updateStatus(projectId, 'generating-brand')

      const brandProfile = await generateBrandProfile(website)
      console.log('✅ Brand profile generated.')

      console.log('🚀 STEP 5: Saving brand profile...')
      await updateProject(projectId, {
        brandProfile,
      })
      console.log('✅ Brand profile saved.')

      console.log('🚀 STEP 6: Generating advertisements...')
      await updateStatus(projectId, 'generating-ads')

      const ads = await generateAds(brandProfile)
      console.log(`✅ Generated ${ads.length} advertisements.`)

      console.log('🚀 STEP 7: Saving advertisements...')
      await updateAds(projectId, ads)
      console.log('✅ Advertisements saved.')

      console.log('🚀 STEP 8: Completing project...')
      await updateStatus(projectId, 'completed')
      console.log('🎉 Pipeline completed.')

      return {
        projectId,
        brandProfile,
        ads,
      }
    } catch (error) {
      console.error('❌ Pipeline failed.', error)

      await updateStatus(projectId, 'failed')

      throw error
    }
  })
