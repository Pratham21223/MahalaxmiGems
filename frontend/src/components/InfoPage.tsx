import type { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { JsonLd } from './JsonLd'
import { usePageMeta } from '@/hooks/usePageMeta'

// Shared shell for information, company, and policy pages. Uses only the
// existing design tokens/utilities so these pages match the rest of the site.
export function InfoPage({
  eyebrow,
  title,
  intro,
  metaTitle,
  metaDescription,
  path,
  children,
}: {
  eyebrow: string
  title: string
  intro?: ReactNode
  metaTitle: string
  metaDescription: string
  path: string
  children: ReactNode
}) {
  usePageMeta({ title: metaTitle, description: metaDescription, path })

  return (
    <div className="page-shell section-stack py-6">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          url: `${window.location.origin}${path}`,
          description: metaDescription,
        }}
      />
      <Breadcrumbs items={[{ label: title }]} />

      <header className="rounded-3xl border border-slate-100 bg-surface-soft p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary md:text-4xl">{title}</h1>
        {intro && (
          <div className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
            {intro}
          </div>
        )}
      </header>

      {children}
    </div>
  )
}

export function InfoSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children: ReactNode
}) {
  return (
    <section>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-2xl font-semibold text-primary">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  )
}

// Small framed callout used for key conditions on policy pages.
export function InfoCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm leading-6 text-foreground">
      {children}
    </div>
  )
}
