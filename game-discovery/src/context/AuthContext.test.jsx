import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, AuthProvider } from './AuthContext.jsx'

const authMocks = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('../services/firebase.js', () => ({ auth: {} }))
vi.mock('firebase/auth', () => authMocks)

function AuthStateConsumer() {
  const { user, loading } = React.useContext(AuthContext)

  return (
    <output>
      {loading ? 'loading' : user ? `signed in as ${user.uid}` : 'signed out'}
    </output>
  )
}

import React from 'react'

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMocks.onAuthStateChanged.mockImplementation(() => () => {})
  })

  it('keeps authentication loading until Firebase reports a user state', () => {
    let onChange
    authMocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      onChange = callback
      return () => {}
    })

    render(
      <AuthProvider>
        <AuthStateConsumer />
      </AuthProvider>,
    )

    expect(screen.getByText('loading')).toBeInTheDocument()

    act(() => onChange({ uid: 'user-1' }))

    expect(screen.getByText('signed in as user-1')).toBeInTheDocument()
  })

  it('reports an unauthenticated state when Firebase returns no user', () => {
    authMocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null)
      return () => {}
    })

    render(
      <AuthProvider>
        <AuthStateConsumer />
      </AuthProvider>,
    )

    expect(screen.getByText('signed out')).toBeInTheDocument()
  })
})
