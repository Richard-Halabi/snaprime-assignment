// Helpers
import { parseWebsite } from '#/parsers/website'
import { renderWebsite } from '#/lib/browser'
// Types
import type { WebsiteContent } from '#/types/project'

/**
 * Extracts structured content from a website URL.
 *
 * The website is rendered using Browserless to ensure JavaScript-generated
 * content is available before being parsed into a structured representation.
 *
 * @param url The website URL to extract.
 * @returns Parsed website content.
 *
 * @throws {Error} If the website cannot be rendered or parsed.
 */
export async function extractWebsite(url: string): Promise<WebsiteContent> {
  try {
    const html = await renderWebsite(url)

    return parseWebsite(html)
  } catch (error) {
    console.error('Failed to extract website content.', {
      url,
      error,
    })

    throw new Error(`Failed to extract website content from "${url}".`, {
      cause: error,
    })
  }
}
