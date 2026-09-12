import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { apiErrorMessage } from '@/lib/errors'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/account')
    } catch (err) {
      setError(apiErrorMessage(err, 'Unable to create account'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell py-16">
      <div className="premium-panel mx-auto max-w-md p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Create account</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Register</h1>
        <p className="mt-2 text-sm text-muted-foreground">You can browse as a guest — an account lets you track orders and wishlist.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <label className="block text-sm font-medium text-foreground">
            Name
            <Input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="mt-1.5" />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Email
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-1.5" />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Password
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" className="mt-1.5" />
            <span className="mt-1 block text-xs text-muted-foreground">At least 8 characters</span>
          </label>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="focus-ring font-medium text-gold underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}