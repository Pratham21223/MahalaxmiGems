import type { Category } from './types'

// Flatten a category tree to its leaf (purchasable) categories.
export function flattenLeaves(cats: Category[]): Category[] {
  const leaves: Category[] = []
  const walk = (list: Category[]) => {
    for (const c of list) {
      if (c.children && c.children.length > 0) walk(c.children)
      else leaves.push(c)
    }
  }
  walk(cats)
  return leaves
}