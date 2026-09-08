import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items = [] }: { items?: Crumb[] }) {
  if (items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="focus-ring rounded-md hover:text-primary">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span aria-hidden="true" className="text-gold">
              ›
            </span>
            {item.to ? (
              <Link to={item.to} className="focus-ring rounded-md hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
