import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-white no-underline"
        >
          Snaprime<span className="text-violet-500"> Assignment</span>
        </Link>

        {/* Action */}
        <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-105">
          Generate Ads
        </button>
      </nav>
    </header>
  )
}
