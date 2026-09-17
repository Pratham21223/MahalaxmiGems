// Laboratory report choices offered at checkout. Owner-editable: add or remove a
// lab here and the public API, Zod validation, and checkout follow automatically.
// All options are currently free; the fee field is kept for future paid labs.
export const LAB_REPORTS = [
  { id: 'GIA', label: 'GIA', fee: 0 },
  { id: 'IGI', label: 'IGI', fee: 0 },
  { id: 'GII', label: 'GII (Gemmological Institute of India)', fee: 0 },
  { id: 'IIGJ', label: 'IIGJ (GJEPC)', fee: 0 },
]

export const LAB_IDS = LAB_REPORTS.map((lab) => lab.id)

export function getLab(id) {
  return LAB_REPORTS.find((lab) => lab.id === id) || null
}
