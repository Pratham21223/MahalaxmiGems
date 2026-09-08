import { Link, useSearchParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import { searchProducts } from '@/lib/api'
import type { SearchResult } from '@/lib/types'
import { ProductGrid } from '@/components/ProductGrid'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Loading, EmptyState, ErrorState } from '@/components/Status'

const POPULAR = ['Blue Sapphire', 'Emerald', 'Ruby', 'Pukhraj', 'Rudraksha']

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const { data, loading, error } = useFetch<SearchResult>(() => searchProducts(q, category), [q, category])

  const hasQuery = Boolean(q)

  return (
    <div className="page-shell space-y-6 py-6">
      <Breadcrumbs items={hasQuery ? [{ label: 'Search' }, { label: q }] : [{ label: 'Search' }]} />

      <header className="rounded-3xl border border-slate-100 bg-surface-soft p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Find your stone</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary md:text-4xl">
          {hasQuery ? <>Results for “{q}”</> : 'Search'}
        </h1>
        {category && <p className="mt-3 text-sm text-muted-foreground">Filtered by selected category.</p>}
      </header>

      {!hasQuery && !category ? (
        <div className="premium-panel space-y-4 p-6">
          <p className="text-sm leading-6 text-muted-foreground">Use the search bar above to find gemstones, categories, and Rudraksha selections.</p>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((t) => (
                <Link
                  key={t}
                  to={`/search?q=${encodeURIComponent(t)}`}
                  className="focus-ring rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-muted-foreground transition hover:border-gold hover:text-primary"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : loading ? (
        <Loading />
      ) : error ? (
        <ErrorState />
      ) : data!.items.length === 0 ? (
        <EmptyState message="No gemstones match your search." />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {data!.total} result{data!.total === 1 ? '' : 's'}
          </p>
          <ProductGrid products={data!.items} />
        </>
      )}
    </div>
  )
}
