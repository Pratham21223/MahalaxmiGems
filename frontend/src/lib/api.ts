import axios from 'axios'
import type {
  AdminCategory,
  AdminProduct,
  Cart,
  Category,
  CheckoutResult,
  Order,
  Product,
  ProductList,
  ReviewSummary,
  SearchResult,
  ShippingAddress,
  SuggestResult,
  User,
} from './types'

// withCredentials so the HttpOnly session cookie (backend-principles) travels
// with every request.
const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export async function getCategories(): Promise<Category[]> {
  const { data } = await client.get('/categories')
  return data
}

export async function getCategory(slug: string): Promise<Category> {
  const { data } = await client.get(`/categories/${slug}`)
  return data
}

export interface ProductQuery {
  category?: string
  notCategory?: string
  origin?: string
  color?: string
  shape?: string
  treatment?: string
  cut?: string
  gemstoneType?: string
  minPrice?: number | string
  maxPrice?: number | string
  minCarat?: number | string
  maxCarat?: number | string
  sort?: string
  page?: number
  limit?: number
}

export async function getProducts(params: ProductQuery = {}): Promise<ProductList> {
  const { data } = await client.get('/products', { params })
  return data
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await client.get(`/products/${id}`)
  return data
}

export async function searchProducts(q: string, category?: string): Promise<SearchResult> {
  const { data } = await client.get('/search', { params: { q, category } })
  return data
}

export async function searchSuggest(q: string, limit = 6): Promise<SuggestResult> {
  const { data } = await client.get('/search/suggest', { params: { q, limit } })
  return data
}

export async function getReviews(productId: string): Promise<ReviewSummary> {
  const { data } = await client.get('/reviews', { params: { product: productId } })
  return data
}

export interface ReviewInput {
  product: string
  rating: number
  title?: string
  comment: string
}

export async function createReview(input: ReviewInput): Promise<ReviewSummary> {
  const { data } = await client.post('/reviews', input)
  return data
}

// ---- Auth ----------------------------------------------------------------

export async function getMe(): Promise<{ user: User } | null> {
  try {
    const { data } = await client.get('/auth/me')
    return data
  } catch {
    return null
  }
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const { data } = await client.post('/auth/register', input)
  return data as { user: User }
}

export async function loginUser(input: { email: string; password: string }) {
  const { data } = await client.post('/auth/login', input)
  return data as { user: User }
}

export async function logoutUser() {
  await client.post('/auth/logout')
}

// ---- Cart ----------------------------------------------------------------

export async function getCart(): Promise<Cart> {
  const { data } = await client.get('/cart')
  return data
}

export async function addToCart(productId: string, qty = 1): Promise<Cart> {
  const { data } = await client.post('/cart', { productId, qty })
  return data
}

export async function updateCartItem(productId: string, qty: number): Promise<Cart> {
  const { data } = await client.patch(`/cart/${productId}`, { productId, qty })
  return data
}

export async function removeCartItem(productId: string): Promise<Cart> {
  const { data } = await client.delete(`/cart/${productId}`)
  return data
}

// ---- Wishlist ------------------------------------------------------------

export async function getWishlist(): Promise<{ items: Product[] }> {
  const { data } = await client.get('/wishlist')
  return data
}

export async function addWishlist(productId: string): Promise<{ items: string[] }> {
  const { data } = await client.post('/wishlist', { productId })
  return data
}

export async function removeWishlist(productId: string): Promise<{ items: string[] }> {
  const { data } = await client.delete(`/wishlist/${productId}`)
  return data
}

// ---- Orders --------------------------------------------------------------

export async function createCheckout(input: {
  shippingAddress: ShippingAddress
  items?: { productId: string; qty: number }[]
}): Promise<CheckoutResult> {
  const { data } = await client.post('/orders', input)
  return data
}

export async function confirmPayment(
  reference: string,
  payment: { order_id: string; payment_id: string; signature: string },
): Promise<{ order: Order }> {
  const { data } = await client.post(`/orders/${reference}/confirm`, payment)
  return data
}

export async function getOrder(reference: string): Promise<{ order: Order }> {
  const { data } = await client.get(`/orders/${reference}`)
  return data
}

export async function getMyOrders(): Promise<{ orders: Order[] }> {
  const { data } = await client.get('/orders')
  return data
}

export async function cancelOrder(reference: string): Promise<{ order: Order }> {
  const { data } = await client.post(`/orders/${reference}/cancel`)
  return data
}

// ---- Admin ---------------------------------------------------------------

export async function adminGetCategories(): Promise<{ items: AdminCategory[] }> {
  const { data } = await client.get('/admin/categories')
  return data
}

export async function adminCreateCategory(input: Partial<AdminCategory>) {
  const { data } = await client.post('/admin/categories', input)
  return data as { item: AdminCategory }
}

export async function adminUpdateCategory(id: string, input: Partial<AdminCategory>) {
  const { data } = await client.put(`/admin/categories/${id}`, input)
  return data as { item: AdminCategory }
}

export async function adminDeleteCategory(id: string) {
  await client.delete(`/admin/categories/${id}`)
}

export interface AdminProductInput {
  sku: string
  name: string
  slug: string
  category: string
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
  pricingType?: 'FIXED' | 'PER_CARAT'
  priceAmount?: number
  currency?: string
  priceState?: 'PUBLIC_PRICE' | 'CONTACT_FOR_PRICE'
  inventory?: number
  isUnique?: boolean
  status?: 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'SOLD' | 'ARCHIVED'
  seoTitle?: string
  seoDescription?: string
  images?: { url?: string; altText: string }[]
}

export async function adminListProducts(params: {
  status?: string
  q?: string
  page?: number
  limit?: number
} = {}): Promise<{ items: AdminProduct[]; total: number; page: number; limit: number; totalPages: number }> {
  const { data } = await client.get('/admin/products', { params })
  return data
}

export async function adminCreateProduct(input: AdminProductInput) {
  const { data } = await client.post('/admin/products', input)
  return data as { item: AdminProduct }
}

export async function adminUpdateProduct(id: string, input: AdminProductInput) {
  const { data } = await client.put(`/admin/products/${id}`, input)
  return data as { item: AdminProduct }
}

export async function adminDeleteProduct(id: string) {
  await client.delete(`/admin/products/${id}`)
}

export async function adminListOrders(params: {
  status?: string
  page?: number
  limit?: number
} = {}): Promise<{ items: Order[]; total: number; page: number; limit: number; totalPages: number }> {
  const { data } = await client.get('/admin/orders', { params })
  return data
}

export async function adminUpdateOrderStatus(reference: string, status: Order['status']) {
  const { data } = await client.patch(`/admin/orders/${reference}/status`, { status })
  return data as { item: Order }
}