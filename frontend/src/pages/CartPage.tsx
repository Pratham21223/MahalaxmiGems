import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Loading, EmptyState } from '@/components/Status'
import type { CartItem } from '@/lib/types'

function CartLine({ item }: { item: CartItem }) {
  const { update, remove } = useCart()
  const image = item.image

  return (
    <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <Link to={`/products/${item.productId}`} className="focus-ring block size-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
        {image?.url ? (
          <img src={image.url} alt={image.altText} className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center px-2 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {item.name}
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/products/${item.productId}`} className="focus-ring block truncate font-medium text-primary hover:text-gold">
          {item.name}
        </Link>
        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">₹{item.unitPrice.toLocaleString('en-IN')} each</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-slate-200">
            <button type="button" aria-label="Decrease quantity" onClick={() => update(item.productId, item.qty - 1)} className="focus-ring rounded-l-full p-2 text-muted-foreground hover:text-primary">
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => update(item.productId, item.qty + 1)} className="focus-ring rounded-r-full p-2 text-muted-foreground hover:text-primary">
              <Plus className="size-3.5" />
            </button>
          </div>
          <button type="button" onClick={() => remove(item.productId)} className="focus-ring inline-flex items-center gap-1 rounded-full p-2 text-xs text-muted-foreground transition hover:text-rose-600">
            <Trash2 className="size-3.5" /> Remove
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-primary">₹{item.lineTotal.toLocaleString('en-IN')}</p>
        {item.qty > 1 && <p className="text-xs text-muted-foreground">{item.qty} × ₹{item.unitPrice.toLocaleString('en-IN')}</p>}
      </div>
    </div>
  )
}

export function CartPage() {
  const { cart, loading, count } = useCart()
  const navigate = useNavigate()

  if (loading) return <div className="page-shell py-8"><Loading /></div>

  return (
    <div className="page-shell section-stack py-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Your selection</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Shopping Cart</h1>
      </div>

      {!cart || cart.items.length === 0 ? (
        <EmptyState message="Your cart is empty. Browse the collection to add gemstones." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {cart.items.map((item) => (
              <CartLine key={item.productId} item={item} />
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-primary">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items ({count})</span>
                <span className="font-medium text-foreground">₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-medium text-foreground">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-primary">
                <span>Total</span>
                <span>₹{cart.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Proceed to Checkout <ArrowRight className="size-4" />
            </button>
            <Link to="/gemstones" className="focus-ring mt-3 block text-center text-sm text-gold underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}