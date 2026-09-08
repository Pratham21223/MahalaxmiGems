export interface Filters {
  origin?: string
  color?: string
  shape?: string
  treatment?: string
  minPrice?: string
  maxPrice?: string
  minCarat?: string
  maxCarat?: string
}

const ORIGINS = ['Ceylon', 'Burma', 'Kashmir', 'Colombia', 'Madagascar', 'Thailand', 'Tanzania', 'Mozambique']
const COLORS = ['Blue', 'Red', 'Green', 'Yellow', 'Pink', 'White', 'Honey', 'Orange']
const SHAPES = ['Oval', 'Round', 'Cushion', 'Emerald Cut', 'Cabochon', 'Pear']
const TREATMENTS = ['Unheated', 'Heated', 'Natural', 'Minor Oil', 'No Oil']

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value?: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export function FilterSidebar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (f: Filters) => void
}) {
  const set = (key: keyof Filters) => (v: string) => onChange({ ...filters, [key]: v || undefined })

  const clear = () =>
    onChange({ origin: undefined, color: undefined, shape: undefined, treatment: undefined, minPrice: undefined, maxPrice: undefined, minCarat: undefined, maxCarat: undefined })

  return (
    <aside className="premium-panel space-y-5 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-primary">Filters</h2>
        <button type="button" onClick={clear} className="focus-ring rounded-full px-2 py-1 text-xs font-medium text-gold hover:bg-gold/10">
          Clear all
        </button>
      </div>

      <Select label="Origin" value={filters.origin} options={ORIGINS} onChange={set('origin')} />
      <Select label="Color" value={filters.color} options={COLORS} onChange={set('color')} />
      <Select label="Shape" value={filters.shape} options={SHAPES} onChange={set('shape')} />
      <Select label="Treatment" value={filters.treatment} options={TREATMENTS} onChange={set('treatment')} />

      <fieldset className="space-y-2">
        <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Price (₹)
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.minPrice || ''}
            placeholder="Min"
            onChange={(e) => set('minPrice')(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="number"
            min={0}
            value={filters.maxPrice || ''}
            placeholder="Max"
            onChange={(e) => set('maxPrice')(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Weight (carat)
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step="0.1"
            value={filters.minCarat || ''}
            placeholder="Min"
            onChange={(e) => set('minCarat')(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="number"
            min={0}
            step="0.1"
            value={filters.maxCarat || ''}
            placeholder="Max"
            onChange={(e) => set('maxCarat')(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
          />
        </div>
      </fieldset>
    </aside>
  )
}
