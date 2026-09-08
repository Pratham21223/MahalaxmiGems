import { useFetch } from '@/hooks/useFetch'
import { getCategories, getProducts } from '@/lib/api'
import type { Category, ProductList } from '@/lib/types'
import { Hero } from '@/components/Hero'
import { SectionHeading } from '@/components/SectionHeading'
import { CategoryCard } from '@/components/CategoryCard'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductScroller } from '@/components/ProductScroller'
import { WhyUs } from '@/components/WhyUs'
import { WhatsAppCta } from '@/components/WhatsAppCta'
import { Loading, ErrorState } from '@/components/Status'

export function Home() {
  const cats = useFetch<Category[]>(() => getCategories())
  const arrivals = useFetch<ProductList>(() =>
    getProducts({ notCategory: 'rudraksha', limit: 12, sort: 'newest' }),
  )
  const all = useFetch<ProductList>(() => getProducts({ notCategory: 'rudraksha', limit: 20 }))
  const rudraksha = useFetch<ProductList>(() => getProducts({ category: 'rudraksha', limit: 4 }))

  const unique = (all.data?.items || []).filter((p) => p.isUnique).slice(0, 8)
  const bestSellers = unique.length >= 4 ? unique : all.data?.items || []

  return (
    <div>
      <Hero />

      <div className="page-shell section-stack py-12">
        <section>
          <SectionHeading
            eyebrow="Collection"
            title="Shop by Category"
            action={{ label: 'Browse all gemstones', to: '/gemstones' }}
          />
          {cats.loading ? (
            <Loading />
          ) : cats.error ? (
            <ErrorState />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(cats.data || []).map((c) => (
                <CategoryCard key={c.slug} category={c} />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-8 rounded-3xl border border-slate-100 bg-surface-soft p-5 md:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">New</p>
            <h2 className="mt-1 text-2xl font-semibold text-primary md:text-3xl">New arrivals</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Fresh arrivals with useful details for comparing stones before you enquire or buy.
            </p>
          </div>
          <div className="min-w-0">
            {arrivals.loading ? (
              <Loading />
            ) : arrivals.error ? (
              <ErrorState />
            ) : (
              <ProductScroller products={arrivals.data?.items || []} />
            )}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Popular"
            title="Distinct pieces to compare"
            action={{ label: 'Browse gemstones', to: '/gemstones' }}
          />
          {all.loading ? (
            <Loading />
          ) : all.error ? (
            <ErrorState />
          ) : (
            <ProductGrid products={bestSellers} />
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Sacred</p>
            <h2 className="mt-1 text-2xl font-semibold text-primary md:text-3xl">Rudraksha collection</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Browse Mukhi categories and available Rudraksha selections with the same clear product details.
            </p>
          </div>
          <div>
            {rudraksha.loading ? (
              <Loading />
            ) : rudraksha.error ? (
              <ErrorState />
            ) : (
              <ProductGrid products={rudraksha.data?.items || []} />
            )}
          </div>
        </section>

        <WhyUs />

        <section>
          <SectionHeading
            eyebrow="Jewellery"
            title="Exclusive jewellery"
            action={{ label: 'Ask about jewellery', to: '/contact' }}
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['Rings', 'Pendant', 'Earrings', 'Bracelet'].map((j) => (
              <div
                key={j}
                className="premium-card flex aspect-[4/5] flex-col items-center justify-center p-4 text-center"
              >
                <span className="font-medium text-primary">{j}</span>
                <span className="mt-1 text-xs text-muted-foreground">Enquire</span>
              </div>
            ))}
          </div>
        </section>

        <WhatsAppCta />
      </div>
    </div>
  )
}
