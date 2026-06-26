import { useState } from 'react'

export default function UrlInput() {
  const [url, setUrl] = useState('')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    console.log('URL:', url)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">Website URL</label>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="w-full rounded-lg border p-3"
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
