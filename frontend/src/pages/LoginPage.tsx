import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { apiErrorMessage } from '@/lib/errors'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(email, password)
      const redirect = params.get('redirect')
      navigate(redirect && !redirect.startsWith('/login') ? redirect : user.role === 'admin' ? '/admin' : '/account')
    } catch (err) {
      setError(apiErrorMessage(err, 'Unable to sign in'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell py-16">
      <div className="premium-panel mx-auto max-w-md p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to view orders, track your wishlist, and check out faster.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <label className="block text-sm font-medium text-foreground">
            Email
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5"
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Password
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5"
            />
          </label>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted-foreground">
          New here?{' '}
          <Link to="/register" className="focus-ring font-medium text-gold underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}