// External Libraries
import * as cheerio from 'cheerio'
// Types
import type { WebsiteContent } from '#/types/project'

/**
 * Parses rendered HTML into structured website content.
 */
export function parseWebsite(html: string): WebsiteContent {
  const $ = cheerio.load(html)

  const title = $('title').text().trim()

  const description =
    $('meta[name="description"]').attr('content')?.trim() ?? ''

  const text = $('body').text().replace(/\s+/g, ' ').trim()

  const images = $('img')
    .map((_, img) => $(img).attr('src'))
    .get()
    .filter(Boolean) as string[]

  return {
    title,
    description,
    text,
    images,
  }
}
