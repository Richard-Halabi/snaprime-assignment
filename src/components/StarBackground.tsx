/**
 * Use a background similar to the original website to demonstrate our dedication to the project.
 */
export default function StarBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#090912]">
      {/* Purple glow */}
      <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[180px]" />

      {/* Blue glow */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[180px]" />

      {/* Stars */}
      {Array.from({ length: 250 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-white animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random(),
          }}
        />
      ))}
    </div>
  )
}
