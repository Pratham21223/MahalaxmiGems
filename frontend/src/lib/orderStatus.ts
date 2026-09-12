import type { OrderStatus } from './types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pending payment',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
}

export function formatOrderDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function orderStatusClass(status: OrderStatus) {
  switch (status) {
    case 'PAID':
      return 'bg-emerald-50 text-emerald-700'
    case 'PROCESSING':
    case 'SHIPPED':
      return 'bg-sky-50 text-sky-700'
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700'
    case 'CANCELLED':
    case 'REFUNDED':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'bg-amber-50 text-amber-700'
  }
}