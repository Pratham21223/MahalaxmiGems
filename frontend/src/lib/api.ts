import axios from 'axios'
import type {
  Category,
  Product,
  ProductList,
  ReviewSummary,
  SearchResult,
  SuggestResult,
} from './types'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
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
  name: string
  rating: number
  title?: string
  comment: string
}

export async function createReview(input: ReviewInput): Promise<ReviewSummary> {
  const { data } = await client.post('/reviews', input)
  return data
}
