import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { useSearchSuggest } from '@/hooks/useSearchSuggest'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { SuggestionProduct } from '@/lib/types'
import { PlaceholderView } from './ProductImage'

const POPULAR = ['Blue Sapphire', 'Emerald', 'Ruby', 'Pukhraj', 'Rudraksha']
const RECENT_KEY = 'mahalaxmi-recent-searches'
const RECENT_MAX = 5

function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string').slice(0, RECENT_MAX) : []
  } catch {
    return []
  }
}

function saveRecent(term: string) {
  const t = term.trim()
  if (!t) return
  const next = [t, ...getRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, RECENT_MAX)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable — ignore
  }
}

type SuggestionItem =
  | ({ kind: 'product' } & SuggestionProduct)
  | { kind: 'category'; slug: string; name: string }
  | { kind: 'viewall' }

// Desktop / overlay inline search field with live suggestions + keyboard nav.
export function SearchField({
  autoFocus = false,
  onNavigate,
  className = '',
}: {
  autoFocus?: boolean
  onNavigate?: () => void
  className?: string
}) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const { loading, data } = useSearchSuggest(q)
  const navigate = useNavigate()
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const term = q.trim()

  const items: SuggestionItem[] = []
  if (data) {
    for (const p of data.products) items.push({ kind: 'product', ...p })
    for (const c of data.categories) items.push({ kind: 'category', slug: c.slug, name: c.name })
    items.push({ kind: 'viewall' })
  }

  const showPanel = open && term.length > 0
  const activeIndex = active >= 0 && active < items.length ? active : -1

  useEffect(() => {
    const onPop = () => {
      setOpen(false)
      setActive(-1)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActive(-1)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const go = (path: string) => {
    navigate(path)
    onNavigate?.()
    setOpen(false)
    setActive(-1)
  }

  const submit = (t: string) => {
    const trimmed = t.trim()
    if (!trimmed) return
    saveRecent(trimmed)
    go(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const activate = (item: SuggestionItem) => {
    if (item.kind === 'product') go(`/products/${item.id}`)
    else if (item.kind === 'category') go(`/categories/${item.slug}`)
    else submit(term)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPanel) {
      if (e.key === 'Enter') {
        e.preventDefault()
        submit(term)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && items[activeIndex]) activate(items[activeIndex])
      else submit(term)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    }
  }

  const handleChange = (v: string) => {
    setQ(v)
    setActive(-1)
    setOpen(Boolean(v.trim()))
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          submit(term)
        }}
        className="relative flex h-11 w-full items-center gap-2 overflow-hidden rounded-full border border-slate-200/90 bg-white px-2.5 pl-3.5 shadow-[0_8px_24px_rgba(5,0,64,0.08)] transition duration-200 hover:border-slate-300 focus-within:border-gold focus-within:bg-white focus-within:ring-4 focus-within:ring-gold/10"
      >
        <Search className="size-5 shrink-0 text-slate-500" aria-hidden="true" />
        <input
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => term && setOpen(true)}
          placeholder="Search gemstones…"
          aria-label="Search gemstones"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listboxId : undefined}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-slate-400"
        />
        {q && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQ('')
              setOpen(false)
              setActive(-1)
            }}
            className="focus-ring flex size-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-primary"
          >
            <X className="size-4" />
          </button>
        )}
        <button
          type="submit"
          className="focus-ring flex h-8 shrink-0 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/15 transition duration-200 hover:-translate-y-px hover:bg-primary/90 active:translate-y-0 sm:px-5"
        >
          Search
        </button>
      </form>

      {showPanel && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {loading ? (
            <div className="space-y-3 p-4" role="status" aria-label="Loading suggestions">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-3">
                  <div className="size-11 shrink-0 rounded-lg bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto p-2">
              {items.map((item, i) => {
                const isActive = active === i
                const optionId = `${listboxId}-option-${i}`
                if (item.kind === 'product') {
                  return (
                    <li key={`p-${item.id}`} role="option" id={optionId} aria-selected={isActive}>
                      <button
                        type="button"
                        onClick={() => activate(item)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          'focus-ring flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition',
                          isActive ? 'bg-muted' : '',
                        )}
                      >
                        {item.image && item.image.url ? (
                          <img
                            src={item.image.url}
                            alt={item.image.altText || item.name}
                            className="size-11 shrink-0 rounded-lg border border-slate-100 object-cover"
                          />
                        ) : (
                          <PlaceholderView label="" index={i} className="size-11 shrink-0 rounded-lg border border-slate-100" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">{item.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.category ? item.category.name : item.gemstoneType}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-primary">
                          {formatPrice(item.price) || 'Contact for price'}
                        </span>
                      </button>
                    </li>
                  )
                }
                if (item.kind === 'category') {
                  return (
                    <li key={`c-${item.slug}`} role="option" id={optionId} aria-selected={isActive}>
                      <button
                        type="button"
                        onClick={() => activate(item)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          'focus-ring flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition',
                          isActive ? 'bg-muted' : '',
                        )}
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-gold">
                          <TrendingUp className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">{item.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">Category</span>
                        </span>
                      </button>
                    </li>
                  )
                }
                return (
                  <li key="viewall" role="option" id={optionId} aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => activate(item)}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        'focus-ring flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition',
                        isActive ? 'bg-muted' : '',
                      )}
                    >
                      <span className="text-sm font-medium text-gold">View all results for “{term}”</span>
                      <ArrowRight className="ml-auto size-4 text-muted-foreground" />
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">No gemstones match your search.</p>
          )}
        </div>
      )}
    </div>
  )
}

function RecentSearches({ onPick }: { onPick: (term: string) => void }) {
  const [items, setItems] = useState<string[]>(getRecent)
  if (items.length === 0) return null
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Clock className="size-4" /> Recent searches
        </h3>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(RECENT_KEY)
            setItems([])
          }}
          className="focus-ring rounded-full px-2 py-1 text-xs font-medium text-gold hover:bg-gold/10"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-0.5">
        {items.map((t) => (
          <li key={t}>
            <button
              type="button"
              onClick={() => onPick(t)}
              className="focus-ring w-full rounded-lg px-2 py-2 text-left text-sm text-foreground transition hover:bg-muted hover:text-primary"
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PopularSearches({ onPick }: { onPick: (term: string) => void }) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <TrendingUp className="size-4" /> Popular searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {POPULAR.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onPick(t)}
            className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-gold hover:text-primary"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  )
}

// Mobile: search icon trigger + full-screen overlay. Desktop uses <SearchField />.
export function SearchControl({ className = '' }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onPop = () => setMobileOpen(false)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const pick = (term: string) => {
    saveRecent(term)
    setMobileOpen(false)
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setMobileOpen(true)}
        className={cn(
          'focus-ring rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-primary lg:hidden',
          className,
        )}
      >
        <Search className="size-5" />
      </button>

      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex flex-col bg-white lg:hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
              <div className="flex-1">
                <SearchField autoFocus onNavigate={() => setMobileOpen(false)} />
              </div>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setMobileOpen(false)}
                className="focus-ring shrink-0 rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-primary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <RecentSearches onPick={pick} />
              <PopularSearches onPick={pick} />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
