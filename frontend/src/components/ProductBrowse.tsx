import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { getProducts } from '@/lib/api'
import type { ProductList } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ProductGrid } from '@/components/ProductGrid'
import { FilterSidebar, type Filters } from '@/components/FilterSidebar'
import { Loading, EmptyState, ErrorState } from '@/components/Status'

const SORTS = [
  { value: 'default', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
]

const LIMIT = 12

// Filterable, sortable, paginated product grid. Owns sort/filter/page URL state.
export function ProductBrowse({ category, notCategory }: { category?: string; notCategory?: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const sort = searchParams.get('sort') || 'default'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const filters: Filters = {
    origin: searchParams.get('origin') || undefined,
    color: searchParams.get('color') || undefined,
    shape: searchParams.get('shape') || undefined,
    treatment: searchParams.get('treatment') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    minCarat: searchParams.get('minCarat') || undefined,
    maxCarat: searchParams.get('maxCarat') || undefined,
  }

  const list = useFetch<ProductList>(
    () => getProducts({ category, notCategory, ...filters, sort, page, limit: LIMIT }),
    [category, notCategory, sort, page, ...Object.values(filters)],
  )

  const update = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    params.delete('page')
    setSearchParams(params)
  }

  const setSort = (value: string) => update({ sort: value === 'default' ? undefined : value })

  const setPage = (value: number) => {
    const params = new URLSearchParams(searchParams)
    if (value <= 1) params.delete('page')
    else params.set('page', String(value))
    setSearchParams(params)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className={cn('lg:block', filtersOpen ? 'block' : 'hidden')}>
        <FilterSidebar
          filters={filters}
          onChange={(f) => update(f as Record<string, string | undefined>)}
        />
      </div>

      <div>
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-primary transition hover:border-gold lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> Filters
            </button>
            <span className="text-sm text-muted-foreground">
              {list.data ? `${list.data.total} products` : ''}
            </span>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {list.loading ? (
          <Loading />
        ) : list.error ? (
          <ErrorState onRetry={() => list.refetch()} />
        ) : list.data!.items.length === 0 ? (
          <EmptyState message="No gemstones found." />
        ) : (
          <>
            <ProductGrid products={list.data!.items} />
            {list.data!.totalPages > 1 && (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="focus-ring rounded-full border border-slate-200 px-4 py-2 text-sm transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-3 py-2 text-sm text-muted-foreground">
                  Page {list.data!.page} of {list.data!.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= list.data!.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="focus-ring rounded-full border border-slate-200 px-4 py-2 text-sm transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  )
}
