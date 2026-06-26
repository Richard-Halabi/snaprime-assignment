import { GoogleGenAI } from '@google/genai'

import type { BrandProfile, WebsiteContent } from '#/types/project'

let ai: GoogleGenAI | null = null

/**
 * Returns a singleton Gemini client.
 *
 * The client is lazily initialized so importing this module does not
 * immediately require an API key. This keeps the module safe to import
 * while testing other parts of the pipeline.
 *
 * @throws {Error} If the Gemini API key is not configured.
 */
function getGeminiClient(): GoogleGenAI {
  if (ai) {
    return ai
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY')
  }

  ai = new GoogleGenAI({
    apiKey,
  })

  return ai
}

/**
 * Generates a structured brand profile from extracted website content.
 *
 * The model must only use the supplied website information and must never
 * hallucinate facts. If information cannot be inferred from the provided
 * content, the model must return "Not found".
 *
 * @param website Structured website content extracted from Browserless.
 * @returns A structured brand profile.
 *
 * @throws {Error} If the AI request fails or the response cannot be parsed.
 */
export async function generateBrandProfile(
  website: WebsiteContent,
): Promise<BrandProfile> {
  console.log('Generating brand profile...')

  try {
    const prompt = `
You are an expert marketing strategist.

Analyze the following website.

Rules:
- ONLY use the supplied information.
- NEVER invent facts.
- If information cannot be determined, return "Not found".
- Preserve the supplied image URLs.
- Return ONLY valid JSON.
- Do NOT wrap the response in markdown.
- Do NOT include explanations.

Website Title:
${website.title}

Website Description:
${website.description}

Visible Website Text:
${website.text}

Candidate Images:
${website.images.join('\n')}

Return JSON using exactly this schema:

{
  "company": "",
  "description": "",
  "audience": "",
  "valueProposition": "",
  "tone": "",
  "colors": [],
  "images": []
}
`

    const response = await getGeminiClient().models.generateContent({
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

    console.log('Gemini response received.')

    return JSON.parse(json) as BrandProfile
  } catch (error) {
    console.error('Failed to generate brand profile.', {
      error,
    })

    throw new Error('Unable to generate brand profile.', {
      cause: error,
    })
  }
}
