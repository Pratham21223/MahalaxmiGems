import { useFetch } from '@/hooks/useFetch'
import { getCategories, getProducts } from '@/lib/api'
import type { Category, ProductList } from '@/lib/types'
import { flattenLeaves } from '@/lib/categories'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { SectionHeading } from '@/components/SectionHeading'
import { CategoryCard } from '@/components/CategoryCard'
import { ProductScroller } from '@/components/ProductScroller'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductBrowse } from '@/components/ProductBrowse'
import { Loading, ErrorState } from '@/components/Status'

export function GemstonesPage() {
  const cats = useFetch<Category[]>(() => getCategories())
  const featured = useFetch<ProductList>(() =>
    getProducts({ notCategory: 'rudraksha', limit: 12, sort: 'newest' }),
  )
  const all = useFetch<ProductList>(() => getProducts({ notCategory: 'rudraksha', limit: 20 }))

  const gemstoneLeaves = flattenLeaves((cats.data || []).filter((c) => c.slug !== 'rudraksha'))
  const unique = (all.data?.items || []).filter((p) => p.isUnique).slice(0, 8)
  const bestSellers = unique.length >= 4 ? unique : all.data?.items || []

  return (
    <div className="page-shell section-stack py-6">
      <Breadcrumbs items={[{ label: 'Gemstones' }]} />

      <header className="rounded-3xl border border-slate-100 bg-surface-soft p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Shop gemstones</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary md:text-4xl">Gemstone Collection</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Discover our curated collection of natural gemstones across every major variety.
        </p>
      </header>

      <section>
        <SectionHeading eyebrow="Browse" title="Shop by Gemstone" />
        {cats.loading ? (
          <Loading />
        ) : cats.error ? (
          <ErrorState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gemstoneLeaves.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 md:p-8">
        <SectionHeading eyebrow="Curated" title="Featured Gemstones" />
        {featured.loading ? (
          <Loading />
        ) : featured.error ? (
          <ErrorState />
        ) : (
          <ProductScroller products={featured.data?.items || []} />
        )}
      </section>

      <section>
        <SectionHeading eyebrow="Popular" title="Best-Selling Gemstones" />
        {all.loading ? (
          <Loading />
        ) : all.error ? (
          <ErrorState />
        ) : (
          <ProductGrid products={bestSellers} />
        )}
      </section>

      <section>
        <SectionHeading eyebrow="All" title="Browse All Gemstones" />
        <ProductBrowse notCategory="rudraksha" />
      </section>
    </div>
  )
}
