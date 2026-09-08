export interface Certificate {
  labName?: string
  reportNumber?: string
  issueDate?: string
  verificationUrl?: string
  verificationStatus?: string
  documentRef?: string
}

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
  certificates: Certificate[]
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
