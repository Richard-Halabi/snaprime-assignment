type ErrorBannerProps = {
  message: string | null
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) {
    return null
  }

  return (
    <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
      <p className="font-semibold">Something went wrong</p>

      <p className="mt-1">{message}</p>
    </div>
  )
}
