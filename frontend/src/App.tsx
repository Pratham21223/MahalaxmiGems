import { lazy, Suspense } from 'react'
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Loading } from '@/components/Status'

const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })))
const CategoryPage = lazy(() => import('@/pages/CategoryPage').then((m) => ({ default: m.CategoryPage })))
const ProductPage = lazy(() => import('@/pages/ProductPage').then((m) => ({ default: m.ProductPage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const GemSuggestionsPage = lazy(() => import('@/pages/GemSuggestionsPage').then((m) => ({ default: m.GemSuggestionsPage })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const GemstonesPage = lazy(() => import('@/pages/GemstonesPage').then((m) => ({ default: m.GemstonesPage })))
const RudrakshaPage = lazy(() => import('@/pages/RudrakshaPage').then((m) => ({ default: m.RudrakshaPage })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const AccountPage = lazy(() => import('@/pages/AccountPage').then((m) => ({ default: m.AccountPage })))
const CartPage = lazy(() => import('@/pages/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })))
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))

function CategoryRoute() {
  const { slug } = useParams()
  return <CategoryPage key={slug} />
}

function ProductRoute() {
  const { id } = useParams()
  return <ProductPage key={id} />
}

function SearchRoute() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  return <SearchPage key={`${q}:${category}`} />
}

export default function App() {
  return (
    <Suspense fallback={<div className="page-shell py-8"><Loading /></div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories/:slug" element={<CategoryRoute />} />
          <Route path="/products/:id" element={<ProductRoute />} />
          <Route path="/search" element={<SearchRoute />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gem-suggestions" element={<GemSuggestionsPage />} />
          <Route path="/gemstones" element={<GemstonesPage />} />
          <Route path="/rudraksha" element={<RudrakshaPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:reference" element={<OrderConfirmationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
