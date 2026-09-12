import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { addToCart, getCart, removeCartItem, updateCartItem } from '@/lib/api'
import type { Cart } from '@/lib/types'

interface CartContextValue {
  cart: Cart | null
  loading: boolean
  count: number
  refresh: () => Promise<void>
  add: (productId: string, qty?: number) => Promise<void>
  update: (productId: string, qty: number) => Promise<void>
  remove: (productId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await getCart()
      setCart(data)
    } catch {
      setCart(null)
    }
  }, [])

  useEffect(() => {
    let active = true
    getCart()
      .then((data) => {
        if (active) setCart(data)
      })
      .catch(() => {
        if (active) setCart(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [refresh])

  const add = useCallback(
    async (productId: string, qty = 1) => {
      setCart(await addToCart(productId, qty))
    },
    [],
  )

  const update = useCallback(
    async (productId: string, qty: number) => {
      setCart(await updateCartItem(productId, qty))
    },
    [],
  )

  const remove = useCallback(
    async (productId: string) => {
      setCart(await removeCartItem(productId))
    },
    [],
  )

  return (
    <CartContext.Provider
      value={{ cart, loading, count: cart?.count ?? 0, refresh, add, update, remove }}
    >
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}