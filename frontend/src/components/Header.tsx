import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ChevronDown, Gem, ArrowRight, MessageCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { GEMSTONE_COLUMNS, RUDRAKSHA_ITEMS, RUDRAKSHA_VIEW_ALL, type NavColumn } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { SearchField, SearchControl } from './SearchControl'
import { NavIcons } from './NavIcons'

const JEWELLERY_COLUMNS = ['Rings', 'Pendant', 'Earrings', 'Astrological Rings']

type MenuName = 'gemstones' | 'jewellery' | 'rudraksha'

// Shared dropdown panel styling so every navbar menu belongs to one design system.
const PANEL = 'rounded-xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] animate-in fade-in-0 zoom-in-95 duration-150'
const MENU_ITEM = 'focus-ring flex min-h-9 items-center rounded-md px-2 py-1.5 text-[15px] leading-5 text-muted-foreground transition duration-150 hover:bg-slate-50 hover:text-primary'
const NAV_LINK = 'relative px-1 py-1 text-[15px] transition hover:text-primary focus-ring'
const VIEW_ALL_LINK = 'focus-ring inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 py-1.5 text-[15px] font-semibold text-gold transition-colors hover:bg-gold/10 hover:text-primary'

function Logo() {
  return (
    <Link to="/" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-full" aria-label="Mahalaxmi Gems home">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-gold shadow-[0_10px_28px_rgba(5,0,64,0.24)] lg:size-10">
        <Gem className="size-5" />
      </span>
      <span className="hidden text-lg font-semibold tracking-tight text-primary sm:inline">
        Mahalaxmi <span className="text-gold">Gems</span>
      </span>
    </Link>
  )
}

function GemstoneColumn({ column }: { column: NavColumn }) {
  return (
    <div className="min-w-0">
      <h3 className="flex items-center gap-2.5 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        {column.title}
      </h3>
      <ul className="mt-2 space-y-0.5">
        {column.items.map((item) => (
          <li key={item.slug}>
            <Link to={`/categories/${item.slug}`} role="menuitem" className={MENU_ITEM}>
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      {column.viewAll && (
        <Link
          to={column.viewAll}
          role="menuitem"
          className={cn(VIEW_ALL_LINK, 'mt-3')}
        >
          View All <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}

function RudrakshaMenu() {
  const half = Math.ceil(RUDRAKSHA_ITEMS.length / 2)
  const columns = [RUDRAKSHA_ITEMS.slice(0, half), RUDRAKSHA_ITEMS.slice(half)]
  return (
    <>
      {columns.map((col, ci) => (
        <ul key={ci} className="space-y-0.5">
          {col.map((item) => (
            <li key={item.slug}>
              <Link to={`/categories/${item.slug}`} role="menuitem" className={cn(MENU_ITEM, 'whitespace-nowrap')}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ))}
      <Link
        to={RUDRAKSHA_VIEW_ALL}
        role="menuitem"
        className={cn(VIEW_ALL_LINK, 'col-span-2 mt-3 border-t border-slate-100 pt-3')}
      >
        View All <ArrowRight className="size-4" />
      </Link>
    </>
  )
}

// Desktop dropdown: optional label link + chevron trigger, unified panel, keyboard nav.
function NavDropdown({
  label,
  to,
  menuName,
  open,
  onOpen,
  onToggle,
  onClose,
  align = 'left',
  children,
}: {
  label: string
  to?: string
  menuName: MenuName
  open: boolean
  onOpen: () => void
  onToggle: () => void
  onClose: () => void
  align?: 'left' | 'right'
  children: React.ReactNode
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const focusFirst = () => {
    panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' && !open) {
      e.preventDefault()
      onOpen()
      requestAnimationFrame(focusFirst)
    }
  }

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') || [])
    if (items.length === 0) return
    const idx = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(idx + 1) % items.length].focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(idx - 1 + items.length) % items.length].focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      triggerRef.current?.focus()
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose()
      }}
    >
      <div className="flex items-center gap-0.5">
        {to ? (
          <NavLink
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(NAV_LINK, isActive && 'text-primary after:absolute after:inset-x-1 after:-bottom-2.5 after:h-0.5 after:bg-gold')
            }
          >
            {label}
          </NavLink>
        ) : null}
        <button
          ref={triggerRef}
          type="button"
          aria-label={to ? `Open ${label} menu` : label}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={`${menuName}-menu`}
          onClick={onToggle}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            'focus-ring flex items-center gap-1 rounded-md transition hover:text-primary',
            to ? 'px-0.5 py-1' : '',
          )}
        >
          {!to && <span>{label}</span>}
          <ChevronDown className={cn('size-4 transition', open ? 'rotate-180' : '')} />
        </button>
      </div>
      {open && (
        <div
          ref={panelRef}
          id={`${menuName}-menu`}
          role="menu"
          aria-label={label}
          onKeyDown={onPanelKeyDown}
          onClick={onClose}
          className={cn('absolute top-full z-50 pt-2', align === 'right' ? 'right-0' : 'left-0')}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null)
  const [mobileOpen, setMobileOpen] = useState<MenuName | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!openMenu) return
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [openMenu])

  const toggle = (m: MenuName) => setOpenMenu((cur) => (cur === m ? null : m))
  const close = () => setOpenMenu(null)

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-xl"
      onMouseLeave={close}
    >
      {/* Top bar — shopping actions */}
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 lg:gap-4 lg:px-6 lg:py-4">
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="focus-ring rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-primary"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 border-r-slate-100 bg-white p-0">
                <SheetHeader className="border-b border-slate-100 p-4">
                  <SheetTitle className="flex items-center gap-2 text-primary">
                    <Gem className="size-5 text-gold" /> Mahalaxmi Gems
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col overflow-y-auto p-4 font-medium">
                  <Link to="/" onClick={() => setSheetOpen(false)} className="focus-ring rounded-lg px-3 py-3 hover:bg-muted">
                    Home
                  </Link>
                  <MobileAccordion
                    title="Gemstones"
                    open={mobileOpen === 'gemstones'}
                    onToggle={() => setMobileOpen(mobileOpen === 'gemstones' ? null : 'gemstones')}
                  >
                    <div className="space-y-4 px-3 pb-2">
                      <Link
                        to="/gemstones"
                        onClick={() => setSheetOpen(false)}
                        className="focus-ring inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-gold hover:text-primary"
                      >
                        View all gemstones <ArrowRight className="size-4" />
                      </Link>
                      {GEMSTONE_COLUMNS.map((col) => (
                        <div key={col.title}>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {col.title}
                          </h4>
                          <ul className="mt-2 space-y-1.5">
                            {col.items.map((item) => (
                              <li key={item.slug}>
                                <Link
                                  to={`/categories/${item.slug}`}
                                  onClick={() => setSheetOpen(false)}
                                  className="focus-ring block rounded-md py-1.5 text-sm text-foreground hover:text-gold"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </MobileAccordion>
                  <MobileAccordion
                    title="Jewellery"
                    open={mobileOpen === 'jewellery'}
                    onToggle={() => setMobileOpen(mobileOpen === 'jewellery' ? null : 'jewellery')}
                  >
                    <div className="px-3 pb-2">
                      {JEWELLERY_COLUMNS.map((c) => (
                        <span key={c} className="block py-1 text-sm text-muted-foreground">
                          {c} enquiries
                        </span>
                      ))}
                    </div>
                  </MobileAccordion>
                  <Link to="/gem-suggestions" onClick={() => setSheetOpen(false)} className="focus-ring rounded-lg px-3 py-3 hover:bg-muted">
                    Gem Suggestions
                  </Link>
                  <MobileAccordion
                    title="Rudraksha"
                    open={mobileOpen === 'rudraksha'}
                    onToggle={() => setMobileOpen(mobileOpen === 'rudraksha' ? null : 'rudraksha')}
                  >
                    <div className="px-3 pb-2">
                      <Link
                        to="/rudraksha"
                        onClick={() => setSheetOpen(false)}
                        className="focus-ring mb-2 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-gold hover:text-primary"
                      >
                        View all rudraksha <ArrowRight className="size-4" />
                      </Link>
                      <ul className="space-y-1.5">
                        {RUDRAKSHA_ITEMS.map((item) => (
                          <li key={item.slug}>
                            <Link
                              to={`/categories/${item.slug}`}
                              onClick={() => setSheetOpen(false)}
                              className="focus-ring block rounded-md py-1.5 text-sm text-foreground hover:text-gold"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={RUDRAKSHA_VIEW_ALL}
                        onClick={() => setSheetOpen(false)}
                        className="focus-ring mt-2 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-gold hover:text-primary"
                      >
                        View All <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </MobileAccordion>
                  <Link to="/about" onClick={() => setSheetOpen(false)} className="focus-ring rounded-lg px-3 py-3 hover:bg-muted">
                    About Us
                  </Link>
                  <Link to="/contact" onClick={() => setSheetOpen(false)} className="focus-ring rounded-lg px-3 py-3 hover:bg-muted">
                    Contact Us
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <Logo />
        </div>

        {/* Desktop global search */}
        <div className="hidden w-full max-w-2xl justify-self-center lg:block">
          <SearchField className="w-full" />
        </div>

        <div className="flex items-center justify-self-end gap-0.5">
          <SearchControl />
          <NavIcons />
          <Link
            to="/contact"
            className="focus-ring ml-1.5 hidden shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_12px_30px_rgba(5,0,64,0.18)] transition hover:-translate-y-0.5 hover:bg-primary/90 lg:inline-flex"
          >
            <MessageCircle className="size-4" />
            Contact
          </Link>
        </div>
      </div>

      {/* Bottom bar — discovery navigation */}
      <nav className="hidden border-t border-slate-100 bg-surface-soft/80 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-2.5 text-[15px] font-medium text-slate-600 xl:gap-9">
          <NavLink to="/" className={({ isActive }) => cn(NAV_LINK, isActive && 'text-primary after:absolute after:inset-x-1 after:-bottom-2.5 after:h-0.5 after:bg-gold')}>
            Home
          </NavLink>

          <NavDropdown
            label="Gemstones"
            to="/gemstones"
            menuName="gemstones"
            open={openMenu === 'gemstones'}
            onOpen={() => setOpenMenu('gemstones')}
            onToggle={() => toggle('gemstones')}
            onClose={close}
          >
            <div className={cn(PANEL, 'grid w-[min(40rem,calc(100vw-2rem))] grid-cols-2 gap-8')}>
              <GemstoneColumn column={GEMSTONE_COLUMNS[0]} />
              <GemstoneColumn column={GEMSTONE_COLUMNS[1]} />
            </div>
          </NavDropdown>

          <NavDropdown
            label="Jewellery"
            menuName="jewellery"
            open={openMenu === 'jewellery'}
            onOpen={() => setOpenMenu('jewellery')}
            onToggle={() => toggle('jewellery')}
            onClose={close}
          >
            <div className={cn(PANEL, 'w-64')}>
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Jewellery</p>
              <ul className="mt-2 space-y-0.5">
                {JEWELLERY_COLUMNS.map((c) => (
                  <li key={c}>
                    <Link to="/contact" role="menuitem" className={cn(MENU_ITEM, 'whitespace-nowrap')}>
                      {c} enquiries
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavDropdown>

          <NavLink to="/gem-suggestions" className={({ isActive }) => cn(NAV_LINK, isActive && 'text-primary after:absolute after:inset-x-1 after:-bottom-2.5 after:h-0.5 after:bg-gold')}>
            Gem Suggestions
          </NavLink>

          <NavDropdown
            label="Rudraksha"
            to="/rudraksha"
            menuName="rudraksha"
            align="right"
            open={openMenu === 'rudraksha'}
            onOpen={() => setOpenMenu('rudraksha')}
            onToggle={() => toggle('rudraksha')}
            onClose={close}
          >
            <div className={cn(PANEL, 'w-72 max-w-[calc(100vw-2rem)]')}>
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Rudraksha</p>
              <div className="mt-2 grid grid-cols-2 gap-x-5">
                <RudrakshaMenu />
              </div>
            </div>
          </NavDropdown>

          <NavLink to="/about" className={({ isActive }) => cn(NAV_LINK, isActive && 'text-primary after:absolute after:inset-x-1 after:-bottom-2.5 after:h-0.5 after:bg-gold')}>
            About Us
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

function MobileAccordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={onToggle}
        className="focus-ring flex w-full items-center justify-between rounded-lg px-3 py-3 font-medium hover:bg-muted"
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={`size-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  )
}
