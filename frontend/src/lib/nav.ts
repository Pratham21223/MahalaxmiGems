export interface NavLinkItem {
  label: string
  slug: string
}

export interface NavColumn {
  title: string
  items: NavLinkItem[]
  viewAll?: string
}

// Curated Gemstones mega-menu columns (from the owner's UI prompt).
// Slugs must match the seeded category slugs — do not invent new routes here.
export const GEMSTONE_COLUMNS: NavColumn[] = [
  {
    title: 'Navratna',
    items: [
      { label: 'Blue Sapphire (Neelam)', slug: 'blue-sapphire' },
      { label: 'Yellow Sapphire (Pukhraj)', slug: 'yellow-sapphire' },
      { label: 'Ruby (Manik)', slug: 'ruby' },
      { label: 'Emerald (Panna)', slug: 'emerald' },
      { label: 'Diamond (Heera)', slug: 'diamond' },
      { label: 'Pearl (Moti)', slug: 'pearl' },
      { label: "Cat's Eye (Lehsunia)", slug: 'cats-eye' },
      { label: 'Hessonite (Gomed)', slug: 'hessonite' },
      { label: 'Coral (Moonga)', slug: 'coral' },
    ],
  },
  {
    title: 'More Vedic Ratna (Upratna)',
    items: [
      { label: 'Amethyst', slug: 'amethyst' },
      { label: 'Aquamarine', slug: 'aquamarine' },
      { label: 'Blue Topaz', slug: 'blue-topaz' },
      { label: 'Citrine Stone (Sunela)', slug: 'citrine' },
      { label: 'Tourmaline', slug: 'tourmaline' },
      { label: 'Opal', slug: 'opal' },
      { label: 'Tanzanite', slug: 'tanzanite' },
      { label: 'Iolite (Neeli)', slug: 'iolite' },
      { label: 'Jasper (Mahe Mariyam)', slug: 'jasper' },
      { label: 'Lapis', slug: 'lapis' },
    ],
    viewAll: '/gemstones',
  },
]

// Rudraksha dropdown (1–14 Mukhi), matching the seeded category slugs.
export const RUDRAKSHA_ITEMS: NavLinkItem[] = Array.from({ length: 14 }, (_, i) => ({
  label: `${i + 1} Mukhi`,
  slug: `${i + 1}-mukhi`,
}))

export const RUDRAKSHA_VIEW_ALL = '/rudraksha'
