import { Category } from '../models/Category.js'

// Resolve a category slug to its own id plus all active descendant category ids.
export async function getCategoryAndDescendantIds(slug) {
  const root = await Category.findOne({ slug, active: true }).select('_id').lean()
  if (!root) return []
  const ids = [root._id]
  let frontier = [root._id]
  while (frontier.length) {
    const children = await Category.find({ parent: { $in: frontier }, active: true })
      .select('_id')
      .lean()
    frontier = children.map((c) => c._id)
    ids.push(...frontier)
  }
  return ids
}