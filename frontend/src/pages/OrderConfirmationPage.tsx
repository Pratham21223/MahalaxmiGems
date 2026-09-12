import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'
import { cancelOrder, getOrder } from '@/lib/api'
import type { Order } from '@/lib/types'
import { ORDER_STATUS_LABELS, formatOrderDate, orderStatusClass } from '@/lib/orderStatus'
import { Loading, ErrorState } from '@/components/Status'
import { cn } from '@/lib/utils'

export function OrderConfirmationPage() {
  const { reference = '' } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    getOrder(reference)
      .then(({ order }) => setOrder(order))
      .catch(() => setError('We could not find this order.'))
      .finally(() => setLoading(false))
  }, [reference])

  useEffect(load, [load])

  if (loading) return <div className="page-shell py-8"><Loading /></div>
  if (error || !order) return <div className="page-shell py-8"><ErrorState message={error || 'Order not found'} /></div>

  const pending = order.status === 'PENDING_PAYMENT'

  const handleCancel = async () => {
    const { order: updated } = await cancelOrder(order.reference)
    setOrder(updated)
  }

  return (
    <div className="page-shell section-stack py-6">
      <div className="premium-panel rounded-3xl p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <PackageCheck className="size-7" />
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-primary">Order confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-medium text-foreground">{order.reference.slice(0, 8)}</span> placed on {formatOrderDate(order.createdAt)}.
        </p>
        <span className={cn('mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium', orderStatusClass(order.status))}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.sku} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-primary">{item.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {item.sku} · {item.qty} × ₹{item.purchasedPrice.toLocaleString('en-IN')}</p>
              </div>
              <p className="font-semibold text-primary">₹{item.itemTotal.toLocaleString('en-IN')}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-sm">
            <h2 className="font-semibold text-primary">Order progress</h2>
            <ol className="mt-3 space-y-2">
              {order.timeline.map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-gold" />
                  {ORDER_STATUS_LABELS[t.status]}
                  <span className="text-xs">· {formatOrderDate(t.at)}</span>
                </li>
              ))}
            </ol>
            {pending && (
              <button type="button" onClick={handleCancel} className="focus-ring mt-4 rounded-full border border-rose-200 px-4 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50">
                Cancel this order
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Details</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-muted-foreground">{order.shippingAddress.name}<br />
              {order.shippingAddress.address}, {order.shippingAddress.city}<br />
              {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}<br />
              {order.shippingAddress.phone}</p>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-primary">
              <span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}