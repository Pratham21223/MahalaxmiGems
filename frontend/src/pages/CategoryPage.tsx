import { useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import { getCategory, getProducts } from '@/lib/api'
import type { Category, ProductList } from '@/lib/types'
import { ProductBrowse } from '@/components/ProductBrowse'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PlaceholderView, ProductImage } from '@/components/ProductImage'
import { Loading, ErrorState } from '@/components/Status'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const cat = useFetch<Category>(() => getCategory(slug), [slug])
  const heroProduct = useFetch<ProductList>(() => getProducts({ category: slug, limit: 1 }), [slug])

  if (cat.loading) return <Loading />
  if (cat.error) return <ErrorState message="Category not found." />

  const crumbs = [
    ...(cat.data?.ancestors || []).map((a) => ({ label: a.name, to: `/categories/${a.slug}` })),
    { label: cat.data?.name || slug },
  ]

  return (
    <div className="page-shell py-6">
      <Breadcrumbs items={crumbs} />
      <header className="mt-4 grid gap-6 rounded-3xl border border-slate-100 bg-surface-soft p-6 md:grid-cols-[1fr_18rem] md:items-center md:p-8 lg:grid-cols-[1fr_24rem]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Collection</p>
          <h1 className="mt-1 text-3xl font-semibold text-primary md:text-4xl">{cat.data?.name}</h1>
          {cat.data?.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {cat.data.description}
            </p>
          )}
        </div>

        <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-2xl bg-white/70 p-3 md:min-h-48">
          {heroProduct.data?.items[0] ? (
            <ProductImage
              product={heroProduct.data.items[0]}
              className="h-full max-h-56 w-full object-contain"
              showLabel={false}
            />
          ) : (
            <PlaceholderView
              label={`${cat.data?.name || 'Stone'} collection image`}
              className="h-full min-h-36 w-full rounded-xl"
              showText={false}
            />
          )}
        </div>
      </header>

      <div className="mt-8">
        <ProductBrowse category={slug} />
      </div>
    </div>
  )
}
