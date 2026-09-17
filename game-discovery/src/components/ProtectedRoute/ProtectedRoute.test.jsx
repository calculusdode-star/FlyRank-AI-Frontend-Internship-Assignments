import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../../context/AuthContext.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function renderProtectedRoute(authValue) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/favourites']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/favourites" element={<h1>Favourites content</h1>} />
          </Route>
          <Route path="/login" element={<h1>Login page</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('shows authentication loading before deciding access', () => {
    renderProtectedRoute({ user: null, loading: true })

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
  })

  it('redirects unauthenticated users away from protected favourites content', () => {
    renderProtectedRoute({ user: null, loading: false })

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Favourites content')).not.toBeInTheDocument()
  })

  it('allows authenticated users to access protected favourites content', () => {
    renderProtectedRoute({ user: { uid: 'user-1' }, loading: false })

    expect(screen.getByText('Favourites content')).toBeInTheDocument()
  })
})
