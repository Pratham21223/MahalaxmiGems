import { useFetch } from '@/hooks/useFetch'
import { getCategories, getProducts } from '@/lib/api'
import type { Category, ProductList } from '@/lib/types'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { SectionHeading } from '@/components/SectionHeading'
import { CategoryCard } from '@/components/CategoryCard'
import { ProductScroller } from '@/components/ProductScroller'
import { ProductBrowse } from '@/components/ProductBrowse'
import { Loading, ErrorState } from '@/components/Status'

export function RudrakshaPage() {
  const cats = useFetch<Category[]>(() => getCategories())
  const featured = useFetch<ProductList>(() =>
    getProducts({ category: 'rudraksha', limit: 12, sort: 'newest' }),
  )

  const rudrakshaRoot = (cats.data || []).find((c) => c.slug === 'rudraksha')
  const mukhi = rudrakshaRoot?.children || []

  return (
    <div className="page-shell section-stack py-6">
      <Breadcrumbs items={[{ label: 'Rudraksha' }]} />

      <header className="rounded-3xl border border-slate-100 bg-surface-soft p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Sacred collection</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary md:text-4xl">Rudraksha Collection</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Explore our collection of sacred rudraksha beads, organised by Mukhi.
        </p>
      </header>

      <section className="premium-panel p-6 md:p-8">
        <SectionHeading eyebrow="Learn" title="About Rudraksha" />
        <p className="max-w-3xl text-sm text-muted-foreground">
          Browse Rudraksha by Mukhi and compare available product details.
          Please reach out on WhatsApp for personal guidance.
        </p>
      </section>

      <section>
        <SectionHeading eyebrow="Browse" title="Shop by Mukhi" />
        {cats.loading ? (
          <Loading />
        ) : cats.error ? (
          <ErrorState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mukhi.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 md:p-8">
        <SectionHeading eyebrow="Curated" title="Featured Rudraksha" />
        {featured.loading ? (
          <Loading />
        ) : featured.error ? (
          <ErrorState />
        ) : (
          <ProductScroller products={featured.data?.items || []} />
        )}
      </section>

      <section>
        <SectionHeading eyebrow="All" title="Browse All Rudraksha" />
        <ProductBrowse category="rudraksha" />
      </section>
    </div>
  )
}
