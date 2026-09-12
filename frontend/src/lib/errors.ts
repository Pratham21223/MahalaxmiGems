// Extract the human-readable error from an API call. Axios wraps the server's
// message in err.response.data.error; without this, users only see the generic
// "Request failed with status code X".
export function apiErrorMessage(err: unknown, fallback = 'Something went wrong, please try again'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const data = (err as { response?: { data?: { error?: string } } }).response?.data
    if (typeof data?.error === 'string' && data.error) return data.error
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}