// External Libraries
import { chromium } from 'playwright-core'

/**
 * Renders a website using Browserless and returns the final HTML.
 */
export async function renderWebsite(url: string): Promise<string> {
  const token = process.env.BROWSERLESS_API_KEY

  if (!token) {
    throw new Error('Missing BROWSERLESS_API_KEY')
  }

  const browser = await chromium.connectOverCDP(
    `wss://production-sfo.browserless.io?token=${token}`,
  )

  const page = await browser.newPage()

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    const html = await page.content()

    return html
  } finally {
    await browser.close()
  }
}
