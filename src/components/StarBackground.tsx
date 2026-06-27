// React
import { useEffect, useState } from 'react'

interface Star {
  left: number
  top: number
  opacity: number
}

/**
 * Displays a decorative animated star background.
 *
 * Star positions are generated only after the component mounts to avoid
 * server/client hydration mismatches caused by Math.random().
 */
export default function StarBackground() {
  // Local State
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 250 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random(),
      })),
    )
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#090912]">
      {/* Purple glow */}
      <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[180px]" />

      {/* Blue glow */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[180px]" />

      {/* Stars */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute h-[2px] w-[2px] animate-pulse rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  )
}
