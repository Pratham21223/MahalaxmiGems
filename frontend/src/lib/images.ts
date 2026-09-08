const VIEW_LABELS = ['front view', 'side view', 'close-up', 'certificate']

// Extract the short "view" suffix (e.g. "front view") from an image alt text.
export function viewLabel(altText?: string): string {
  if (!altText) return ''
  const lower = altText.toLowerCase()
  for (const v of VIEW_LABELS) {
    if (lower.endsWith(v)) return v
  }
  return ''
}