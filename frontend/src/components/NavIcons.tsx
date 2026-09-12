import { Link } from 'react-router-dom'
import { User, Heart, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

const btn = 'focus-ring relative inline-flex items-center rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-primary'

export function NavIcons() {
  const { user } = useAuth()
  const { count } = useCart()

  const accountTo = user ? '/account' : '/login'

  return (
    <div className="flex items-center gap-0.5">
      <Link to={accountTo} aria-label={user ? 'Account' : 'Sign in'} className={btn}>
        <User className="size-5" />
      </Link>
      <Link to={user ? '/account?tab=wishlist' : '/login'} aria-label="Wishlist" className={btn}>
        <Heart className="size-5" />
      </Link>
      <Link to="/cart" aria-label={`Cart, ${count} items`} className={btn}>
        <ShoppingBag className="size-5" />
        {count > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Link>
    </div>
  )
}