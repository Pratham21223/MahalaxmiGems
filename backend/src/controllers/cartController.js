import { resolveCartOwner, getCart, computeCart, addToCart, updateCartItem, removeFromCart } from '../utils/cart.js'
import { validate } from '../middlewares/validate.js'
import { cartAddSchema, cartUpdateSchema } from '../schemas.js'

export const validateAdd = validate(cartAddSchema)
export const validateUpdate = validate(cartUpdateSchema)

export async function getCartHandler(req, res) {
  const owner = resolveCartOwner(req)
  const cart = await getCart(owner)
  res.json(await computeCart(cart))
}

export async function addItem(req, res) {
  const owner = resolveCartOwner(req)
  const { productId, qty } = res.locals.validated
  const cart = await addToCart(owner, productId, qty)
  res.status(201).json(cart)
}

export async function updateItem(req, res) {
  const owner = resolveCartOwner(req)
  const { productId, qty } = res.locals.validated
  const cart = await updateCartItem(owner, productId, qty)
  res.json(cart)
}

export async function removeItem(req, res) {
  const owner = resolveCartOwner(req)
  const cart = await removeFromCart(owner, req.params.productId)
  res.json(cart)
}
