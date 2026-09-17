import { useParams } from 'react-router-dom'
import { MessageCircle, PackageCheck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { getProduct, getProducts } from '@/lib/api'
import type { Product } from '@/lib/types'
import { ProductGallery } from '@/components/ProductGallery'
import { PriceDisplay } from '@/components/PriceDisplay'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductGrid } from '@/components/ProductGrid'
import { ReviewSection } from '@/components/ReviewSection'
import { WishlistButton } from '@/components/WishlistButton'
import { Loading, ErrorState } from '@/components/Status'
import { AddToCartButton, BuyNowButton } from '@/components/PurchaseActions'
import { waLink } from '@/lib/businessInfo'

function SpecRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-3 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}

export function ProductPage() {
  const { id = '' } = useParams()
  const { data: product, loading, error } = useFetch<Product>(() => getProduct(id), [id])

  const categorySlug =
    typeof product?.category === 'object' ? product.category.slug : undefined
  const related = useFetch(() => getProducts({ category: categorySlug, limit: 5 }), [categorySlug])

  if (loading) return <div className="page-shell py-8"><Loading /></div>
  if (error || !product) return <div className="page-shell py-8"><ErrorState message="This gemstone is currently unavailable." /></div>

  const crumbs = [
    ...(typeof product.category === 'object'
      ? [{ label: product.category.name, to: `/categories/${product.category.slug}` }]
      : []),
    { label: product.name },
  ]

  const message = `I'm interested in ${product.name} (SKU: ${product.sku}${product.weightCarat ? `, ${product.weightCarat} carat` : ''}) — ${window.location.href}`
  const whatsappUrl = waLink(message)
  const inStock = product.inventory > 0
  const relatedItems = (related.data?.items || []).filter((p) => p.id !== product.id)
  const description = (product.description || '').trim()
  const visibleDescription = /^DEMO DATA/i.test(description) ? '' : description

  return (
    <div className="page-shell section-stack py-6">
      <Breadcrumbs items={crumbs} />

      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <ProductGallery product={product} />

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {product.gemstoneType || 'Product detail'}
              </p>
              <h1 className="text-balance mt-2 text-3xl font-semibold text-primary md:text-4xl">{product.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>
            <WishlistButton productId={product.id} className="shrink-0" />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 text-2xl shadow-sm">
            <PriceDisplay priceState={product.priceState} price={product.price} />
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                <PackageCheck className="size-3.5" />
                {inStock ? 'Available inventory' : 'Currently unavailable'}
              </span>
            </div>

            {product.priceState === 'PUBLIC_PRICE' && inStock && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <AddToCartButton product={product} />
                <BuyNowButton product={product} />
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw className="size-3.5 text-gold" /> Easy returns
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-gold" /> Secure payments
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="size-3.5 text-gold" /> WhatsApp support
              </span>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={`focus-ring inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:brightness-105 ${product.priceState === 'PUBLIC_PRICE' ? 'bg-[#25D366]/90' : ''}`}
          >
            <MessageCircle className="size-5" /> Ask on WhatsApp
          </a>

          {visibleDescription && (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{visibleDescription}</p>
          )}
        </div>
      </div>

      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Details</p>
        <h2 className="mt-1 text-2xl font-semibold text-primary">Specifications</h2>
        <div className="mt-4 grid gap-x-8 rounded-2xl border border-slate-100 bg-white px-5 py-2 shadow-sm md:grid-cols-2">
          <SpecRow label="Gemstone" value={product.gemstoneType} />
          <SpecRow label="Weight (Carat)" value={product.weightCarat} />
          <SpecRow label="Weight (Ratti)" value={product.weightRatti} />
          <SpecRow label="Origin" value={product.origin} />
          <SpecRow label="Treatment" value={product.treatment} />
          <SpecRow label="Color" value={product.color} />
          <SpecRow label="Shape" value={product.shape} />
          <SpecRow label="Clarity" value={product.clarity} />
          <SpecRow label="Cut" value={product.cut} />
          <SpecRow label="Dimensions" value={product.dimensions} />
        </div>
      </section>

      {relatedItems.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">More to view</p>
          <h2 className="mb-4 mt-1 text-2xl font-semibold text-primary">Related Products</h2>
          <ProductGrid products={relatedItems} />
        </section>
      )}

      <ReviewSection productId={product.id} />
    </div>
  )
}
