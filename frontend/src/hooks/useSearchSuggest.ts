import { useEffect, useState } from 'react'
import { searchSuggest } from '@/lib/api'
import type { SuggestResult } from '@/lib/types'

interface SuggestState {
  status: 'idle' | 'loading' | 'success' | 'error'
  query: string
  data: SuggestResult | null
}

// Debounced live-search suggestions with request cancellation.
export function useSearchSuggest(q: string, delay = 400) {
  const [state, setState] = useState<SuggestState>({ status: 'idle', query: '', data: null })

  useEffect(() => {
    const term = q.trim()
    if (!term) return

    const controller = new AbortController()
    const id = setTimeout(() => {
      setState({ status: 'loading', query: term, data: null })
      searchSuggest(term)
        .then((data) => {
          if (!controller.signal.aborted) setState({ status: 'success', query: term, data })
        })
        .catch(() => {
          if (!controller.signal.aborted) setState({ status: 'error', query: term, data: null })
        })
    }, delay)

    return () => {
      clearTimeout(id)
      controller.abort()
    }
  }, [q, delay])

  const term = q.trim()
  const isCurrent = Boolean(term) && state.query === term

  return {
    status: term ? (isCurrent ? state.status : 'loading') : 'idle',
    query: term,
    data: isCurrent ? state.data : null,
    loading: Boolean(term) && (!isCurrent || state.status === 'loading'),
  }
}
