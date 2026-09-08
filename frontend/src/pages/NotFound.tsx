import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="page-shell py-16">
      <section className="premium-panel mx-auto max-w-3xl p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-primary md:text-4xl">Page not found</h1>
      <p className="mt-4 text-muted-foreground">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90"
      >
        Back to home
      </Link>
      </section>
    </div>
  )
}
