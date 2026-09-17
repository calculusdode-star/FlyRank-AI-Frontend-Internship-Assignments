/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'

/**
 * ProtectedRoute - Gates route content until Firebase authentication is known.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <main aria-labelledby="authentication-loading-title">
        <h1 id="authentication-loading-title">Checking authentication...</h1>
      </main>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        }}
      />
    )
  }

  return children || <Outlet />
}

export default ProtectedRoute
