import { useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { Heart, Package, User as UserIcon, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getMyOrders, getWishlist, removeWishlist } from '@/lib/api'
import type { Order, Product } from '@/lib/types'
import { ORDER_STATUS_LABELS, formatOrderDate, orderStatusClass } from '@/lib/orderStatus'
import { Loading, EmptyState } from '@/components/Status'
import { PriceDisplay } from '@/components/PriceDisplay'
import { cn } from '@/lib/utils'

type Tab = 'profile' | 'orders' | 'wishlist'

export function AccountPage() {
  const { user, loading, logout } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'profile'
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    if (user) {
      Promise.all([getMyOrders(), getWishlist()])
        .then(([o, w]) => {
          setOrders(o.orders)
          setWishlist(w.items)
        })
        .finally(() => setBusy(false))
    }
  }, [user])

  if (loading) return <div className="page-shell py-8"><Loading /></div>
  if (!user) return <Navigate to="/login?redirect=/account" replace />

  const setTab = (t: Tab) => setParams({ tab: t })

  return (
    <div className="page-shell section-stack py-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">My account</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Account</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="flex gap-2 overflow-x-auto lg:flex-col">
          {(
            [
              { key: 'profile', label: 'Profile', icon: UserIcon },
              { key: 'orders', label: 'Orders', icon: Package },
              { key: 'wishlist', label: 'Wishlist', icon: Heart },
            ] as { key: Tab; label: string; icon: typeof UserIcon }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'focus-ring flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                tab === key
                  ? 'border-gold bg-gold/10 text-primary'
                  : 'border-slate-200 bg-white text-muted-foreground hover:text-primary',
              )}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => logout()}
            className="focus-ring flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </aside>

        <div>
          {tab === 'profile' && (
            <div className="premium-panel rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-primary">Profile</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex gap-3"><dt className="w-20 text-muted-foreground">Name</dt><dd className="font-medium text-foreground">{user.name}</dd></div>
                <div className="flex gap-3"><dt className="w-20 text-muted-foreground">Email</dt><dd className="font-medium text-foreground">{user.email}</dd></div>
              </dl>
              {user.role === 'admin' && (
                <Link to="/admin" className="focus-ring mt-5 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
                  Admin dashboard
                </Link>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              {busy ? (
                <Loading />
              ) : orders.length === 0 ? (
                <EmptyState message="You haven't placed any orders yet." />
              ) : (
                orders.map((order) => (
                  <Link
                    key={order.reference}
                    to={`/order/${order.reference}`}
                    className="focus-ring block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-gold/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-primary">Order {order.reference.slice(0, 8)}</p>
                      <span className={cn('rounded-full px-3 py-1 text-xs font-medium', orderStatusClass(order.status))}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatOrderDate(order.createdAt)} · {order.items.length} item(s)</p>
                    <p className="mt-2 font-semibold text-primary">₹{order.total.toLocaleString('en-IN')}</p>
                  </Link>
                ))
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="space-y-3">
              {busy ? (
                <Loading />
              ) : wishlist.length === 0 ? (
                <EmptyState message="Your wishlist is empty. Tap the star on any product to save it." />
              ) : (
                wishlist.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="min-w-0">
                      <Link to={`/products/${p.id}`} className="focus-ring font-medium text-primary hover:text-gold">{p.name}</Link>
                      <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                      <PriceDisplay priceState={p.priceState} price={p.price} className="mt-1 text-sm" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWishlist(p.id).then(({ items }) => setWishlist(wishlist.filter((x) => items.includes(x.id))))}
                      className="focus-ring shrink-0 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-muted-foreground transition hover:text-primary"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}