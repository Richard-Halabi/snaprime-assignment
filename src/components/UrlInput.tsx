// React
import { useState } from 'react'
// Reusable Components
import Spinner from './Spinner'
// Helpers
import { extractWebsite } from '#/server/extract'

/**
 * URL input form for starting the advertisement generation pipeline.
 *
 * Allows the user to submit a website URL, then triggers the backend
 * extraction workflow which:
 *
 * 1. Renders the website using Browserless.
 * 2. Extracts structured website content.
 * 3. Generates an AI-powered brand profile with Gemini.
 * 4. Persists the project to Firestore.
 *
 * The resulting brand profile is currently logged to the console and will
 * later be displayed in the user interface.
 */
export default function UrlInput() {
  // Local State
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')

  /**
   * Form submit
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log('URL:', url)

    try {
      setIsLoading(true)

      const result = await extractWebsite({
        data: url,
      })

      console.log(result)

      setIsLoading(false)
    } catch (error) {
      console.error('Failed to extract website.', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label
        htmlFor="website-url"
        className="block text-sm font-medium text-white"
      >
        Website URL
      </label>

      <input
        id="website-url"
        disabled={isLoading}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="w-full rounded-lg border border-gray-500 bg-white p-3 text-black"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span className="ml-2">Generating…</span>
          </>
        ) : (
          'Create'
        )}
      </button>
    </form>
  )
}
