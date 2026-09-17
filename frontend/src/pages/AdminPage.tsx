import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  adminCreateCategory,
  adminCreateProduct,
  adminDeleteCategory,
  adminDeleteProduct,
  adminGetCategories,
  adminListContactMessages,
  adminListOrders,
  adminListProducts,
  adminUpdateCategory,
  adminUpdateContactStatus,
  adminUpdateOrderLabStatus,
  adminUpdateOrderStatus,
  adminUpdateProduct,
} from '@/lib/api'
import type { AdminCategory, AdminProduct, ContactMessage, LabReportStatus, Order } from '@/lib/types'
import type { AdminProductInput } from '@/lib/api'
import { ORDER_STATUS_LABELS, formatOrderDate, orderStatusClass } from '@/lib/orderStatus'
import { Loading } from '@/components/Status'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Tab = 'orders' | 'categories' | 'products' | 'messages'

const PRODUCT_STATUSES = ['DRAFT', 'ACTIVE', 'ON_HOLD', 'SOLD', 'ARCHIVED'] as const

const LAB_STATUS_LABELS: Record<LabReportStatus, string> = {
  NONE: 'No report',
  REQUESTED: 'Requested',
  SENT_TO_LAB: 'Sent to lab',
  REPORT_RECEIVED: 'Report received',
}

export function AdminPage() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('orders')

  if (loading) return <div className="page-shell py-8"><Loading /></div>
  if (!user) return <Navigate to="/login?redirect=/admin" replace />
  if (user.role !== 'admin') return <div className="page-shell py-16 text-center text-muted-foreground">Access denied.</div>

  return (
    <div className="page-shell section-stack py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-primary">Dashboard</h1>
        </div>
        <Link to="/" className="focus-ring text-sm text-gold underline">View storefront</Link>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-100 pb-3">
        {(['orders', 'categories', 'products', 'messages'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'focus-ring shrink-0 rounded-full px-5 py-2 text-sm font-medium capitalize transition',
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground hover:text-primary',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'orders' && <OrdersTab />}
      {tab === 'categories' && <CategoriesTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'messages' && <MessagesTab />}
    </div>
  )
}

// ---- Orders ---------------------------------------------------------------

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(() => {
    adminListOrders(statusFilter ? { status: statusFilter, limit: 50 } : { limit: 50 }).then(({ items }) =>
      setOrders(items),
    )
  }, [statusFilter])

  useEffect(() => {
    let active = true
    adminListOrders(statusFilter ? { status: statusFilter, limit: 50 } : { limit: 50 })
      .then(({ items }) => {
        if (active) setOrders(items)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [statusFilter])

  const advance = async (order: Order, status: Order['status']) => {
    await adminUpdateOrderStatus(order.reference, status)
    fetchOrders()
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-muted-foreground">Filter:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:border-gold focus:ring-2 focus:ring-gold/15 focus:outline-none">
          <option value="">All statuses</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {orders.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No orders found.</p>}

      {orders.map((order) => (
        <div key={order.reference} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-primary">Order {order.reference.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">
                {formatOrderDate(order.createdAt)} · {order.shippingAddress.name} · ₹{order.total.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {order.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
              </p>
              {order.labReport?.lab && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-primary">
                    {order.labReport.label}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    Lab status
                    <select
                      value={order.labReport.status}
                      onChange={async (e) => {
                        await adminUpdateOrderLabStatus(order.reference, e.target.value as LabReportStatus)
                        fetchOrders()
                      }}
                      aria-label={`Lab report status for order ${order.reference.slice(0, 8)}`}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs focus:border-gold focus:ring-2 focus:ring-gold/15 focus:outline-none"
                    >
                      <option value="REQUESTED">{LAB_STATUS_LABELS.REQUESTED}</option>
                      <option value="SENT_TO_LAB">{LAB_STATUS_LABELS.SENT_TO_LAB}</option>
                      <option value="REPORT_RECEIVED">{LAB_STATUS_LABELS.REPORT_RECEIVED}</option>
                    </select>
                  </label>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('rounded-full px-3 py-1 text-xs font-medium', orderStatusClass(order.status))}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
              {order.status === 'PAID' && (
                <button type="button" onClick={() => advance(order, 'PROCESSING')} className="focus-ring rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Start processing</button>
              )}
              {order.status === 'PROCESSING' && (
                <button type="button" onClick={() => advance(order, 'SHIPPED')} className="focus-ring rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Mark shipped</button>
              )}
              {order.status === 'SHIPPED' && (
                <button type="button" onClick={() => advance(order, 'DELIVERED')} className="focus-ring rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Mark delivered</button>
              )}
              {order.status === 'PENDING_PAYMENT' && (
                <button type="button" onClick={() => advance(order, 'CANCELLED')} className="focus-ring rounded-full border border-rose-200 px-4 py-2 text-xs font-medium text-rose-600">Cancel</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- Messages -------------------------------------------------------------

function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState('')

  useEffect(() => {
    let active = true
    adminListContactMessages({ limit: 50 })
      .then(({ items }) => {
        if (active) setMessages(items)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const toggleStatus = async (message: ContactMessage) => {
    const next = message.status === 'NEW' ? 'READ' : 'NEW'
    const { item } = await adminUpdateContactStatus(message._id, next)
    setMessages((list) => list.map((m) => (m._id === item._id ? item : m)))
  }

  if (loading) return <Loading />

  if (messages.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">No contact messages yet.</p>
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const open = openId === message._id
        return (
          <div key={message._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-primary">{message.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {message.name} · {message.email}
                  {message.phone ? ` · ${message.phone}` : ''} · {formatOrderDate(message.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    message.status === 'NEW' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
                  )}
                >
                  {message.status === 'NEW' ? 'New' : 'Read'}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? '' : message._id)}
                  className="focus-ring rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-primary"
                >
                  {open ? 'Hide' : 'View'}
                </button>
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                  className="focus-ring rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                >
                  Reply
                </a>
                <button
                  type="button"
                  onClick={() => toggleStatus(message)}
                  className="focus-ring rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  Mark {message.status === 'NEW' ? 'read' : 'unread'}
                </button>
              </div>
            </div>
            {open && (
              <p className="mt-3 whitespace-pre-wrap border-t border-slate-100 pt-3 text-sm leading-6 text-muted-foreground">
                {message.message}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---- Categories -----------------------------------------------------------

const EMPTY_CATEGORY = { name: '', slug: '', order: 0, active: true, parent: '' }

function CategoriesTab() {
  const [cats, setCats] = useState<AdminCategory[]>([])
  const [form, setForm] = useState<{ name: string; slug: string; order: number; active: boolean; parent: string }>(EMPTY_CATEGORY)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => adminGetCategories().then(({ items }) => setCats(items)), [])
  useEffect(() => { load() }, [load])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, parent: form.parent || null }
      if (editingId) await adminUpdateCategory(editingId, payload)
      else await adminCreateCategory(payload)
      setForm(EMPTY_CATEGORY)
      setEditingId('')
      load()
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to save category')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <form onSubmit={submit} className="premium-panel h-fit rounded-2xl p-6">
        <h2 className="font-semibold text-primary">{editingId ? 'Edit category' : 'New category'}</h2>
        <div className="mt-4 space-y-3 text-sm">
          <label className="block font-medium">Name
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
          </label>
          <label className="block font-medium">Slug
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required pattern="[a-z0-9-]+" className="mt-1" />
          </label>
          <label className="block font-medium">Parent
            <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 focus:border-ring focus:ring-[3px] focus:ring-ring/50 focus:outline-none">
              <option value="">None (top level)</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block font-medium">Order
            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="mt-1" />
          </label>
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="size-4" />
            Active
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" className="focus-ring rounded-full bg-primary px-5 py-2 font-medium text-primary-foreground">
              {editingId ? 'Save changes' : 'Add category'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(''); setForm(EMPTY_CATEGORY) }} className="focus-ring rounded-full border border-slate-200 px-4 py-2 text-muted-foreground">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="space-y-2">
        {cats.map((c) => (
          <div key={c._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm shadow-sm">
            <div className="min-w-0">
              <p className="truncate font-medium text-primary">{c.name}</p>
              <p className="text-xs text-muted-foreground">/{c.slug} · order {c.order} · {c.active ? 'active' : 'inactive'}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => { setEditingId(c._id); setForm({ name: c.name, slug: c.slug, order: c.order ?? 0, active: c.active ?? true, parent: c.parent ? String(c.parent) : '' }) }} className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-xs text-muted-foreground hover:text-primary">
                Edit
              </button>
              <button type="button" onClick={() => { if (confirm(`Delete "${c.name}"? Its products will be archived.`)) adminDeleteCategory(c._id).then(load) }} className="focus-ring rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Products -------------------------------------------------------------

const EMPTY_PRODUCT: AdminProductInput = {
  sku: '',
  name: '',
  slug: '',
  category: '',
  pricingType: 'FIXED',
  priceAmount: 0,
  currency: 'INR',
  priceState: 'PUBLIC_PRICE',
  inventory: 0,
  isUnique: false,
  status: 'DRAFT',
}

function ProductsTab() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [cats, setCats] = useState<AdminCategory[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [form, setForm] = useState<AdminProductInput>(EMPTY_PRODUCT)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => {
    adminListProducts(statusFilter ? { status: statusFilter, limit: 50 } : { limit: 50 }).then(({ items }) => setProducts(items))
  }, [statusFilter])

  useEffect(() => {
    load()
    adminGetCategories().then(({ items }) => setCats(items))
  }, [load])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await adminUpdateProduct(editingId, form)
      else await adminCreateProduct(form)
      setForm(EMPTY_PRODUCT)
      setEditingId('')
      load()
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to save product')
    }
  }

  const setField = (field: keyof AdminProductInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value })

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="premium-panel h-fit rounded-2xl p-6">
        <h2 className="font-semibold text-primary">{editingId ? 'Edit product' : 'New product'}</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <label className="block font-medium sm:col-span-2">Name
            <Input value={form.name} onChange={setField('name')} required className="mt-1" />
          </label>
          <label className="block font-medium">SKU
            <Input value={form.sku} onChange={setField('sku')} required className="mt-1" />
          </label>
          <label className="block font-medium">Slug
            <Input value={form.slug} onChange={setField('slug')} required className="mt-1" />
          </label>
          <label className="block font-medium sm:col-span-2">Category
            <select value={String(form.category ?? '')} onChange={setField('category')} required className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 focus:border-ring focus:ring-[3px] focus:ring-ring/50 focus:outline-none">
              <option value="">Select…</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block font-medium">Price state
            <select value={form.priceState} onChange={setField('priceState')} className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 focus:border-ring focus:ring-[3px] focus:ring-ring/50 focus:outline-none">
              <option value="PUBLIC_PRICE">Public price</option>
              <option value="CONTACT_FOR_PRICE">Contact for price</option>
            </select>
          </label>
          <label className="block font-medium">Price type
            <select value={form.pricingType} onChange={setField('pricingType')} className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 focus:border-ring focus:ring-[3px] focus:ring-ring/50 focus:outline-none">
              <option value="FIXED">Fixed</option>
              <option value="PER_CARAT">Per carat</option>
            </select>
          </label>
          <label className="block font-medium">Price (INR)
            <Input type="number" min="0" step="0.01" value={form.priceAmount ?? 0} onChange={(e) => setForm({ ...form, priceAmount: Number(e.target.value) })} className="mt-1" />
          </label>
          <label className="block font-medium">Inventory
            <Input type="number" min="0" value={form.inventory ?? 0} onChange={(e) => setForm({ ...form, inventory: Number(e.target.value) })} className="mt-1" />
          </label>
          <label className="block font-medium">Status
            <select value={form.status} onChange={setField('status')} className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 focus:border-ring focus:ring-[3px] focus:ring-ring/50 focus:outline-none">
              {PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block font-medium">Gemstone type
            <Input value={form.gemstoneType ?? ''} onChange={setField('gemstoneType')} className="mt-1" />
          </label>
          <label className="block font-medium">Origin
            <Input value={form.origin ?? ''} onChange={setField('origin')} className="mt-1" />
          </label>
          <label className="block font-medium">Weight (carat)
            <Input type="number" step="0.01" value={form.weightCarat ?? ''} onChange={(e) => setForm({ ...form, weightCarat: e.target.value === '' ? null : Number(e.target.value) })} className="mt-1" />
          </label>
          <label className="block font-medium">Treatment
            <Input value={form.treatment ?? ''} onChange={setField('treatment')} className="mt-1" />
          </label>
          <label className="flex items-center gap-2 font-medium sm:col-span-2">
            <input type="checkbox" checked={form.isUnique ?? false} onChange={(e) => setForm({ ...form, isUnique: e.target.checked })} className="size-4" />
            Unique stone (quantity limited to 1)
          </label>
          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="focus-ring rounded-full bg-primary px-5 py-2 font-medium text-primary-foreground">
              {editingId ? 'Save changes' : 'Add product'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(''); setForm(EMPTY_PRODUCT) }} className="focus-ring rounded-full border border-slate-200 px-4 py-2 text-muted-foreground">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="text-sm text-muted-foreground">Filter:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:border-gold focus:ring-2 focus:ring-gold/15 focus:outline-none">
            <option value="">All statuses</option>
            {PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm shadow-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-primary">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.sku} · ₹{p.pricing?.amount?.toLocaleString('en-IN') ?? '—'} · stock {p.inventory}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={cn('rounded-full px-3 py-1 text-xs font-medium', p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')}>
                  {p.status}
                </span>
                <button type="button" onClick={() => { setEditingId(p._id); setForm(productToForm(p)) }} className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-xs text-muted-foreground hover:text-primary">
                  Edit
                </button>
                <button type="button" onClick={() => { if (confirm(`Delete "${p.name}"?`)) adminDeleteProduct(p._id).then(load) }} className="focus-ring rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function productToForm(p: AdminProduct): AdminProductInput {
  const category = typeof p.category === 'object' && p.category ? String(p.category._id) : String(p.category ?? '')
  return {
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    category,
    description: p.description,
    gemstoneType: p.gemstoneType,
    origin: p.origin,
    treatment: p.treatment,
    weightCarat: p.weightCarat ?? null,
    weightRatti: p.weightRatti ?? null,
    color: p.color,
    shape: p.shape,
    clarity: p.clarity,
    cut: p.cut,
    dimensions: p.dimensions,
    pricingType: p.pricing?.type ?? 'FIXED',
    priceAmount: p.pricing?.amount ?? 0,
    currency: p.pricing?.currency ?? 'INR',
    priceState: p.priceState,
    inventory: p.inventory,
    isUnique: p.isUnique,
    status: p.status,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    images: p.images,
  }
}