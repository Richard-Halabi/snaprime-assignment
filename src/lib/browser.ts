/**
 * Renders a website using the Browserless REST API and returns the rendered HTML.
 *
 * This implementation is compatible with Cloudflare Workers because it uses
 * the standard Fetch API instead of Playwright.
 *
 * @param url The website URL to render.
 * @returns The rendered HTML document.
 *
 * @throws {Error} If Browserless fails to render the page.
 */
export async function renderWebsite(url: string): Promise<string> {
  const token = process.env.BROWSERLESS_API_KEY

  if (!token) {
    throw new Error('Missing BROWSERLESS_API_KEY')
  }

  const response = await fetch(
    `https://production-sfo.browserless.io/chromium/content?token=${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return await response.text()
}
