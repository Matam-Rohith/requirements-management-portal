import { useState, useCallback } from 'react'
import { User } from '@/types'

const TOKEN_KEY = 'rmp_token'
const USER_KEY  = 'rmp_user'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser]   = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true); setError(null)
    try {
      const form = new URLSearchParams({ username, password })
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({ detail: 'Server error — API not reachable' }))
        throw new Error(e.detail)
      }
      const data = await res.json()
      localStorage.setItem(TOKEN_KEY, data.access_token)
      const u: User = { username, full_name: data.full_name, role: data.role }
      localStorage.setItem(USER_KEY, JSON.stringify(u))
      setToken(data.access_token); setUser(u)
      return true
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed')
      return false
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY)
    setToken(null); setUser(null)
  }, [])

  return { token, user, loading, error, login, logout, isAdmin: user?.role === 'admin' }
}
