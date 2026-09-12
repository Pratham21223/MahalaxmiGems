import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { addWishlist, getWishlist, removeWishlist } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { apiErrorMessage } from '@/lib/errors'

export function WishlistButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let active = true
    getWishlist()
      .then(({ items }) => {
        if (active) setSaved(items.some((p) => p.id === productId))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user, productId])

  const isSaved = user ? saved : false

  const toggle = async () => {
    setError('')
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`)
      return
    }
    setBusy(true)
    try {
      const { items } = isSaved ? await removeWishlist(productId) : await addWishlist(productId)
      setSaved(items.includes(productId))
    } catch (err) {
      setError(apiErrorMessage(err, 'Unable to update wishlist'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className={`inline-flex flex-col items-end gap-1 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={isSaved}
        aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isSaved
            ? 'border-gold bg-gold/10 text-primary'
            : 'border-slate-200 bg-white text-primary hover:-translate-y-0.5 hover:border-gold hover:text-gold'
        }`}
      >
        <Star className={`size-4 ${isSaved ? 'fill-gold text-gold' : ''}`} />
        {isSaved ? 'Saved' : 'Wishlist'}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  )
}
