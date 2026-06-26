import { useState } from 'react'

export default function UrlInput() {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log('URL:', url)
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
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="w-full rounded-lg border border-gray-500 bg-white p-3 text-black"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Create
      </button>
    </form>
  )
}
