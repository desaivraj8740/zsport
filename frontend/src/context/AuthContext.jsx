import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check locally first
    const stored = localStorage.getItem('siteUser')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (emailOrUsername, password) => {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: emailOrUsername, password })
      })
      if (resp.headers.get('content-type')?.includes('text/html')) {
        return { success: false, message: 'API Route missing. The proxy is returning HTML instead of JSON data.' }
      }
      const data = await resp.json()
      if (data.success) {
        setUser(data.user)
        localStorage.setItem('siteUser', JSON.stringify(data.user))
      }
      return data
    } catch (err) {
      console.error(err)
      return { success: false, message: `Network error: ${err.message}` }
    }
  }

  const register = async (username, email, password) => {
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      if (resp.headers.get('content-type')?.includes('text/html')) {
        return { success: false, message: 'API Route missing. The proxy is returning HTML instead of JSON data.' }
      }
      const data = await resp.json()
      if (data.success) {
        setUser(data.user)
        localStorage.setItem('siteUser', JSON.stringify(data.user))
      }
      return data
    } catch (err) {
      console.error(err)
      return { success: false, message: 'Server is unreachable. Make sure the backend is running.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('siteUser')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
