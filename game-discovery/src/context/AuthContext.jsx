/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../services/firebase.js'

export const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
})

/**
 * AuthProvider - Shares Firebase authentication state with the application.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logoutError, setLogoutError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    setLogoutError(null)

    try {
      await signOut(auth)
    } catch {
      const error = new Error('Unable to log out. Please try again.')
      setLogoutError(error.message)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, logoutError }}>
      {children}
    </AuthContext.Provider>
  )
}
