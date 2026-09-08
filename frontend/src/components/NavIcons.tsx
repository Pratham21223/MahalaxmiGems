import { User, Heart, ShoppingBag } from 'lucide-react'

// Account / Wishlist / Cart are not implemented yet — rendered as inert
// placeholders (no counts, no fake behavior) until those features exist.
export function NavIcons() {
  const btn = 'focus-ring rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-primary'
  return (
    <div className="flex items-center gap-0.5">
      <button type="button" aria-label="Account" aria-disabled="true" title="Account coming later" className={btn}>
        <User className="size-5" />
      </button>
      <button type="button" aria-label="Wishlist" aria-disabled="true" title="Wishlist coming later" className={btn}>
        <Heart className="size-5" />
      </button>
      <button type="button" aria-label="Cart" aria-disabled="true" title="Cart coming later" className={btn}>
        <ShoppingBag className="size-5" />
      </button>
    </div>
  )
}
