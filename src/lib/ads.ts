import type { Ad, BrandProfile } from '#/types/project'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

/**
 * Generates multiple advertisements from a brand profile.
 *
 * The generated advertisements should each represent a different
 * marketing angle while remaining consistent with the company's
 * brand identity, audience, and tone.
 *
 * @param brandProfile AI-generated understanding of the company.
 * @returns A collection of generated advertisements.
 *
 * @throws {Error} If advertisement generation fails or the returned
 * response cannot be parsed.
 */
export async function generateAds(brandProfile: BrandProfile): Promise<Ad[]> {
  try {
    const prompt = `
You are an expert performance marketer.

Generate THREE unique advertisements using ONLY the supplied brand profile.

Requirements:

- Each advertisement must use a different marketing angle.
- Keep the tone consistent with the brand.
- Do not invent products or services.
- Return ONLY valid JSON.
- Do not wrap the response in markdown.

Brand Profile

Company:
${brandProfile.company}

Description:
${brandProfile.description}

Audience:
${brandProfile.audience}

Value Proposition:
${brandProfile.valueProposition}

Tone:
${brandProfile.tone}

Available Images:
${brandProfile.images.join('\n')}

Return JSON exactly like this:

[
  {
    "id": "",
    "idea": "",
    "headline": "",
    "primaryText": "",
    "description": "",
    "callToAction": "",
    "image": ""
  }
]
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    const text = response.text

    if (!text) {
      throw new Error('Gemini returned an empty response.')
    }

    const json = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    return JSON.parse(json) as Ad[]
  } catch (error) {
    console.error('Failed to generate advertisements.', error)

    throw new Error('Unable to generate advertisements.', {
      cause: error,
    })
  }
}
