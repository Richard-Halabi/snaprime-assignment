import { GoogleGenAI } from '@google/genai'

import type { Ad, BrandProfile, WebsiteContent } from '#/types/project'

let ai: GoogleGenAI | null = null

/**
 * Lazily creates a singleton Gemini client.
 */
function getGeminiClient(): GoogleGenAI {
  if (ai) return ai

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY')
  }

  ai = new GoogleGenAI({ apiKey })

  return ai
}

/**
 * Parses a Gemini JSON response.
 */
function parseJson<T>(text: string): T {
  const json = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  return JSON.parse(json) as T
}

/**
 * Generates a structured brand profile from extracted website content.
 */
export async function generateBrandProfile(
  website: WebsiteContent,
): Promise<BrandProfile> {
  console.log('Generating brand profile...')

  const prompt = `
You are an expert marketing strategist.

Analyze the following website.

Rules

- ONLY use supplied information.
- NEVER hallucinate.
- If unknown return "Not found".
- Preserve image URLs.
- Return ONLY JSON.

Website Title

${website.title}

Website Description

${website.description}

Website Text

${website.text}

Images

${website.images.join('\n')}

Return

{
  "company":"",
  "description":"",
  "audience":"",
  "valueProposition":"",
  "tone":"",
  "colors":[],
  "images":[]
}
`

  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  if (!response.text) {
    throw new Error('Gemini returned an empty response.')
  }

  return parseJson<BrandProfile>(response.text)
}

/**
 * Generates three advertisements from a brand profile.
 */
export async function generateAds(brandProfile: BrandProfile): Promise<Ad[]> {
  console.log('Generating advertisements...')

  const prompt = `
You are an expert Meta advertiser.

Generate THREE different advertisements.

Brand Profile

${JSON.stringify(brandProfile, null, 2)}

Rules

- Different creative idea for each ad.
- No hallucinations.
- Same audience.
- Same tone.
- Use one image from the supplied image list.
- Return ONLY JSON.

[
  {
    "id":"",
    "idea":"",
    "headline":"",
    "primaryText":"",
    "description":"",
    "callToAction":"",
    "image":""
  }
]
`

  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  if (!response.text) {
    throw new Error('Gemini returned an empty response.')
  }

  return parseJson<Ad[]>(response.text)
}

/**
 * Regenerates a single advertisement.
 *
 * Keeps the same image and advertisement id while producing
 * completely new copy.
 */
export async function generateReplacementAd(
  brandProfile: BrandProfile,
  currentAd: Ad,
): Promise<Ad> {
  console.log('Regenerating advertisement...')

  const prompt = `
You are an expert Meta advertiser.

Generate ONE alternative advertisement.

Brand Profile

${JSON.stringify(brandProfile, null, 2)}

Current Advertisement

${JSON.stringify(currentAd, null, 2)}

Rules

- New creative idea.
- Same audience.
- Same tone.
- No hallucinations.
- Keep the same image.
- Return ONLY JSON.

{
  "idea":"",
  "headline":"",
  "primaryText":"",
  "description":"",
  "callToAction":""
}
`

  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  if (!response.text) {
    throw new Error('Gemini returned an empty response.')
  }

  const regenerated = parseJson<Omit<Ad, 'id' | 'image'>>(response.text)

  return {
    ...currentAd,
    ...regenerated,
  }
}
