import { useState, useCallback } from 'react'
import { User } from '@/types'
import { USERS } from '@/lib/store'

const TOKEN_KEY = 'rmp_token'
const USER_KEY  = 'rmp_user'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user,  setUser]  = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true); setError(null)
    await new Promise(r => setTimeout(r, 400)) // simulate network
    const entry = USERS[username]
    if (!entry || entry.password !== password) {
      setError('Incorrect username or password')
      setLoading(false)
      return false
    }
    const fakeToken = btoa(`${username}:${Date.now()}`)
    localStorage.setItem(TOKEN_KEY, fakeToken)
    localStorage.setItem(USER_KEY, JSON.stringify(entry.user))
    setToken(fakeToken)
    setUser(entry.user)
    setLoading(false)
    return true
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null); setUser(null)
  }, [])

  return { token, user, loading, error, login, logout, isAdmin: user?.role === 'admin' }
}
