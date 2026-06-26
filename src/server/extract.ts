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
 * Complete advertisement generation pipeline.
 *
 * Request Flow
 * ───────────────────────────────────────────────────────────────
 *
 * User
 *   │
 *   ▼
 * Submit Website URL
 *   │
 *   ▼
 * Create Firestore Project
 *   │
 *   ▼
 * Browserless
 * Render Website
 *   │
 *   ▼
 * Parse HTML
 *   │
 *   ▼
 * Gemini
 * Generate Brand Profile
 *   │
 *   ▼
 * Firestore
 * Save Brand Profile
 *   │
 *   ▼
 * Gemini
 * Generate Advertisements
 *   │
 *   ▼
 * Firestore
 * Save Advertisements
 *   │
 *   ▼
 * Mark Project Completed
 *   │
 *   ▼
 * Return Project
 *
 * Throughout the pipeline the project status is updated so the
 * frontend can display progress to the user.
 *
 * Status Flow
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
 * Any failure transitions the project to:
 *
 * failed
 */

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
      // Step 1: Create a new project.
      const projectId = await saveProject(url)

      // Step 2: Render the website with Browserless.
      const html = await renderWebsite(url)

      // Step 3: Extract structured website content.
      const website = parseWebsite(html)

      // Step 4: Generate the AI brand profile.
      const brandProfile = await generateBrandProfile(website)

      // Step 5: Persist the brand profile.
      await updateProject(projectId, {
        brandProfile,
      })

      // Step 6: Generate advertisements.
      const ads = await generateAds(brandProfile)

      // Step 7: Persist advertisements.
      await updateAds(projectId, ads)

      // Step 8: Mark the project as completed.
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
