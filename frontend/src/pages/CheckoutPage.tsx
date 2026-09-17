import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createCheckout, confirmPayment, cancelOrder, getProduct, getLabs } from '@/lib/api'
import type { CheckoutResult, LabOption, ShippingAddress } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/Status'
import { apiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    Razorpay?: RazorpayCtor
  }
}

type RazorpayCtor = new (options: Record<string, unknown>) => { open: () => void }

const EMPTY_ADDRESS: ShippingAddress = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
}

function loadRazorpay(): Promise<RazorpayCtor> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Payment gateway failed to load')))
    script.onerror = () => reject(new Error('Payment gateway failed to load'))
    document.body.appendChild(script)
  })
}

export function CheckoutPage() {
  const { cart, loading: cartLoading, refresh } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const buyId = params.get('buy') ?? ''
  const buyQty = Number(params.get('qty') || 1)

  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS)
  const [buyProduct, setBuyProduct] = useState<{ id: string; name: string; unit: number | null } | null>(null)
  const [labs, setLabs] = useState<LabOption[]>([])
  const [lab, setLab] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (buyId) {
      getProduct(buyId)
        .then((p) => {
          // PER_CARAT pricing is a rate; multiply by the stone's carat weight so
          // the displayed estimate matches the server's authoritative unit price.
          const unit = p.price
            ? p.price.type === 'PER_CARAT'
              ? p.price.amount * (p.weightCarat || 0)
              : p.price.amount
            : null
          setBuyProduct({ id: p.id, name: p.name, unit })
        })
        .catch(() => setError('Product is no longer available'))
    }
  }, [buyId])

  useEffect(() => {
    getLabs()
      .then(({ items }) => setLabs(items))
      .catch(() => setLabs([]))
  }, [])

  // Logged-in users only need to fill the address — name/email come from the account.
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill from async auth
      setAddress((a) => ({ ...a, name: a.name || user.name, email: a.email || user.email }))
    }
  }, [user])

  const isBuyNow = buyId !== ''
  const items = isBuyNow ? [{ productId: buyId, qty: buyQty }] : (cart?.items ?? []).map((i) => ({ productId: i.productId, qty: i.qty }))
  const estimatedTotal = isBuyNow
    ? (buyProduct?.unit ?? 0) * buyQty
    : cart?.total ?? 0

  const set = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [field]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result: CheckoutResult = await createCheckout({
        shippingAddress: address,
        items,
        ...(lab ? { labReport: { lab } } : {}),
      })
      await runPayment(result)
      await refresh()
    } catch (err) {
      setError(apiErrorMessage(err, 'Unable to start checkout'))
      setSubmitting(false)
    }
  }

  const runPayment = async ({ order, payment }: CheckoutResult) => {
    // If the payment modal is dismissed (abandoned) or never opens, release the
    // reserved inventory so the stone isn't locked forever.
    let paid = false
    const releaseReservation = async () => {
      try {
        await cancelOrder(order.reference)
      } catch {
        /* already paid / expired */
      }
      setSubmitting(false)
    }

    let Razorpay
    try {
      Razorpay = await loadRazorpay()
    } catch (err) {
      await releaseReservation()
      throw err
    }

    const rzp = new Razorpay({
      key: payment.key,
      amount: payment.amount,
      currency: payment.currency,
      name: 'Mahalaxmi Gems',
      description: `Order ${order.reference.slice(0, 8)}`,
      order_id: payment.orderId,
      prefill: { name: address.name, email: address.email, contact: address.phone },
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        paid = true
        try {
          await confirmPayment(order.reference, {
            order_id: resp.razorpay_order_id,
            payment_id: resp.razorpay_payment_id,
            signature: resp.razorpay_signature,
          })
          await refresh()
        } catch {
          /* webhook may still settle it — navigate to the order page anyway */
        }
        navigate(`/order/${order.reference}`)
      },
      modal: {
        ondismiss: () => {
          if (!paid) void releaseReservation()
        },
      },
    })
    rzp.open()
  }

  if (cartLoading) return <div className="page-shell py-8"><Loading /></div>
  if (!isBuyNow && (!cart || cart.items.length === 0)) {
    navigate('/cart', { replace: true })
    return null
  }

  return (
    <div className="page-shell section-stack py-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Almost there</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Checkout</h1>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]" noValidate>
        <div className="space-y-6">
          <div className="premium-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-primary">Shipping details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-foreground sm:col-span-2">
              Full name <Input value={address.name} onChange={set('name')} required autoComplete="name" className="mt-1.5" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Email <Input type="email" value={address.email} onChange={set('email')} required autoComplete="email" className="mt-1.5" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Phone <Input type="tel" value={address.phone} onChange={set('phone')} required autoComplete="tel" className="mt-1.5" />
            </label>
            <label className="block text-sm font-medium text-foreground sm:col-span-2">
              Address <Input value={address.address} onChange={set('address')} required autoComplete="street-address" className="mt-1.5" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              City <Input value={address.city} onChange={set('city')} required autoComplete="address-level2" className="mt-1.5" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              State <Input value={address.state} onChange={set('state')} required autoComplete="address-level1" className="mt-1.5" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Postal code <Input value={address.postalCode} onChange={set('postalCode')} required autoComplete="postal-code" className="mt-1.5" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Country <Input value={address.country} onChange={set('country')} required autoComplete="country-name" className="mt-1.5" />
            </label>
            </div>
          </div>

          <div className="premium-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-primary">Lab report (optional)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a laboratory and the report is provided with your delivered order. Any one
              laboratory is free.
            </p>
            <div className="mt-4 space-y-2">
              <label
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition',
                  lab === ''
                    ? 'border-gold bg-gold/5 text-primary'
                    : 'border-slate-200 bg-white text-foreground hover:border-gold/50',
                )}
              >
                <input
                  type="radio"
                  name="lab-report"
                  value=""
                  checked={lab === ''}
                  onChange={() => setLab('')}
                  className="size-4 accent-[#c9a24b]"
                />
                <span className="font-medium">No laboratory report</span>
              </label>
              {labs.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition',
                    lab === option.id
                      ? 'border-gold bg-gold/5 text-primary'
                      : 'border-slate-200 bg-white text-foreground hover:border-gold/50',
                  )}
                >
                  <input
                    type="radio"
                    name="lab-report"
                    value={option.id}
                    checked={lab === option.id}
                    onChange={() => setLab(option.id)}
                    className="size-4 accent-[#c9a24b]"
                  />
                  <span className="font-medium">{option.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Included</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              If a requested laboratory report needs additional time, we will contact you before
              dispatch.
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-primary">Order summary</h2>
          <div className="mt-3 space-y-2">
            {isBuyNow ? (
              buyProduct ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{buyProduct.name} × {buyQty}</span>
                  <span className="font-medium text-foreground">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading product…</p>
              )
            ) : (
              (cart?.items ?? []).map((i) => (
                <div key={i.productId} className="flex justify-between gap-2 text-sm">
                  <span className="truncate text-muted-foreground">{i.name} × {i.qty}</span>
                  <span className="font-medium text-foreground">₹{i.lineTotal.toLocaleString('en-IN')}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span><span className="font-medium text-foreground">Free</span>
            </div>
            {lab && (
              <div className="flex justify-between text-muted-foreground">
                <span>Lab report</span><span className="font-medium text-foreground">Included</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-primary">
              <span>Total</span><span>₹{estimatedTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? 'Starting secure checkout…' : 'Pay securely'}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" /> Payments processed securely via Razorpay
          </p>
        </aside>
      </form>
    </div>
  )
}