/* eslint-disable react/prop-types */
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../context/AuthContext.jsx'
import useFavouritesViewModel from './useFavouritesViewModel.js'

const model = vi.hoisted(() => ({
  state: { favourites: [], status: 'idle', error: null },
  getState: vi.fn(),
  subscribe: vi.fn(),
  resetState: vi.fn(),
  loadFavourites: vi.fn(),
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
  setState: vi.fn(),
}))

vi.mock('./FavouritesModel.js', () => ({ default: model }))

function wrapperFor(user) {
  return function Wrapper({ children }) {
    return (
      <AuthContext.Provider value={{ user, loading: false }}>
        {children}
      </AuthContext.Provider>
    )
  }
}

describe('useFavouritesViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    model.state = { favourites: [], status: 'idle', error: null }
    model.getState.mockImplementation(() => model.state)
    model.subscribe.mockReturnValue(() => {})
    model.loadFavourites.mockResolvedValue(undefined)
    model.addFavourite.mockResolvedValue(undefined)
    model.removeFavourite.mockResolvedValue(undefined)
  })

  it('resets favourites and does not query Firebase without a user', async () => {
    renderHook(() => useFavouritesViewModel(), { wrapper: wrapperFor(null) })

    await waitFor(() => expect(model.resetState).toHaveBeenCalled())
    expect(model.loadFavourites).not.toHaveBeenCalled()
  })

  it('loads the authenticated user favourites', async () => {
    renderHook(() => useFavouritesViewModel(), {
      wrapper: wrapperFor({ uid: 'user-1' }),
    })

    await waitFor(() => expect(model.loadFavourites).toHaveBeenCalledWith('user-1'))
  })

  it('removes a favourite for the authenticated user', async () => {
    const { result } = renderHook(() => useFavouritesViewModel(), {
      wrapper: wrapperFor({ uid: 'user-1' }),
    })

    await result.current.removeFavourite(42)

    expect(model.removeFavourite).toHaveBeenCalledWith('user-1', 42)
  })
})
