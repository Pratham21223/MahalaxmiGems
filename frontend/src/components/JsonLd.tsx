// Emits page-specific JSON-LD. Only pass data that is actually visible and
// true on the page (no invented addresses, ratings, or reviews).
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[]
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
