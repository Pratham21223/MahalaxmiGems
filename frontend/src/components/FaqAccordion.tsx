import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  q: string
  a: ReactNode
}

// Accessible accordion built on native <details>/<summary> — keyboard and
// screen-reader friendly with no extra dependency.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.q} className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-sm font-medium text-primary marker:content-none">
            <span>{item.q}</span>
            <ChevronDown
              className="size-4 shrink-0 text-gold transition group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-muted-foreground">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  )
}
