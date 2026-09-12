import { Types } from 'mongoose'
import { User } from '../models/User.js'
import { validate } from '../middlewares/validate.js'
import { wishlistSchema } from '../schemas.js'
import { toPublicProduct } from '../utils/serialize.js'

export const validateWishlist = validate(wishlistSchema)

export async function listWishlist(req, res) {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: { status: 'ACTIVE' },
    populate: { path: 'category', select: 'name slug' },
  })
  // Public product shape so consumers get `id`/`price` (not raw `_id`/`pricing`).
  res.json({ items: user.wishlist.map((p) => toPublicProduct(p)) })
}

export async function addWishlist(req, res) {
  const { productId } = res.locals.validated
  if (!Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product' })
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true },
  )
  res.status(201).json({ items: user.wishlist })
}

export async function removeWishlist(req, res) {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.productId } },
    { new: true },
  )
  res.json({ items: user.wishlist })
}
