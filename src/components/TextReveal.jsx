export default function TextReveal({ text, className = '' }) {
  return (
    <span className={`group inline-flex ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="relative inline-block overflow-hidden"
        >
          {/* current letter — slides up and out */}
          <span
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 10}ms` }}
          >
            {char === ' ' ? ' ' : char}
          </span>
          {/* duplicate letter — starts below, slides up into view */}
          <span
            className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 10}ms` }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </span>
  )
}
