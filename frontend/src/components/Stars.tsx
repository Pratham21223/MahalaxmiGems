import { Star } from 'lucide-react'

export function Stars({
  value,
  onChange,
  className = '',
}: {
  value: number
  onChange?: (value: number) => void
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role={onChange ? 'radiogroup' : undefined}
      aria-label={onChange ? 'Select rating' : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value)
        const icon = <Star className={`size-4 ${filled ? 'fill-gold text-gold' : 'text-slate-300'}`} />
        if (!onChange) return <span key={n}>{icon}</span>
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={value === n}
            onClick={() => onChange(n)}
            className="rounded p-0.5 transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold"
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}