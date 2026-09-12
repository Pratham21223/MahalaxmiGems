export interface ProductImage {
  url: string
  altText: string
  order: number
}

export interface Price {
  type: 'FIXED' | 'PER_CARAT'
  amount: number
  currency: string
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  category: CategoryRef | string
  gemstoneType: string
  origin?: string
  treatment?: string
  weightCarat?: number | null
  weightRatti?: number | null
  color?: string
  shape?: string
  clarity?: string
  cut?: string
  dimensions?: string
  priceState: 'PUBLIC_PRICE' | 'CONTACT_FOR_PRICE'
  price: Price | null
  inventory: number
  isUnique: boolean
  images: ProductImage[]
  description?: string
  createdAt?: string
}

export interface CategoryRef {
  _id?: string
  name: string
  slug: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  parent?: string | null
  description?: string
  seoTitle?: string
  seoDescription?: string
  active?: boolean
  order?: number
  children?: Category[]
  ancestors?: CategoryRef[]
}

export interface ProductList {
  items: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchResult {
  items: Product[]
  total: number
}

export interface Review {
  id: string
  name: string
  rating: number
  title?: string
  comment: string
  verified: boolean
  createdAt?: string
}

export interface ReviewSummary {
  reviews: Review[]
  average: number
  count: number
}

export interface SuggestionProduct {
  id: string
  name: string
  sku: string
  gemstoneType: string
  category: { name: string; slug: string } | null
  priceState: 'PUBLIC_PRICE' | 'CONTACT_FOR_PRICE'
  price: Price | null
  image: { url: string; altText: string } | null
}

export interface CategorySuggestion {
  name: string
  slug: string
}

export interface SuggestResult {
  products: SuggestionProduct[]
  categories: CategorySuggestion[]
}

export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
}

export interface CartItem {
  productId: string
  sku: string
  name: string
  qty: number
  unitPrice: number
  lineTotal: number
  currency: string
  inventory: number
  isUnique: boolean
  image: ProductImage | null
}

export interface Cart {
  items: CartItem[]
  count: number
  subtotal: number
  shippingAmount: number
  total: number
  currency: string
}

export interface OrderItem {
  product: string
  sku: string
  name: string
  priceType: 'FIXED' | 'PER_CARAT'
  purchasedPrice: number
  currency: string
  qty: number
  itemTotal: number
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  reference: string
  status: OrderStatus
  timeline: { status: OrderStatus; at: string }[]
  items: OrderItem[]
  subtotal: number
  shippingAmount: number
  total: number
  currency: string
  shippingAddress: ShippingAddress
  payment: { provider: string; razorpayOrderId: string; method: string }
  createdAt: string
  updatedAt: string
}

export interface CheckoutPayment {
  key: string
  orderId: string
  amount: number
  currency: string
}

export interface CheckoutResult {
  order: Order
  payment: CheckoutPayment
}

export interface AdminCategory {
  _id: string
  id?: string
  name: string
  slug: string
  parent?: string | null
  description?: string
  active?: boolean
  order?: number
}

export interface AdminProduct {
  _id: string
  sku: string
  name: string
  slug: string
  category: CategoryRef | string
  description?: string
  gemstoneType?: string
  origin?: string
  treatment?: string
  weightCarat?: number | null
  weightRatti?: number | null
  color?: string
  shape?: string
  clarity?: string
  cut?: string
  dimensions?: string
  pricing: { type: 'FIXED' | 'PER_CARAT'; amount: number; currency: string }
  priceState: 'PUBLIC_PRICE' | 'CONTACT_FOR_PRICE'
  inventory: number
  isUnique: boolean
  status: 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'SOLD' | 'ARCHIVED'
  images: ProductImage[]
  seoTitle?: string
  seoDescription?: string
}
