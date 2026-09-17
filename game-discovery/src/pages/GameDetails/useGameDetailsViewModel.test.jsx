/* eslint-disable react/prop-types */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../context/AuthContext.jsx'
import useGameDetailsViewModel from './useGameDetailsViewModel.js'

const models = vi.hoisted(() => ({
  gameState: {
    game: {
      id: 7,
      name: 'Hades',
    },
    status: 'loaded',
    error: null,
  },
  favouritesState: {
    favourites: [],
    status: 'loaded',
    error: null,
  },
  gameDetailsModel: {
    getState: vi.fn(),
    subscribe: vi.fn(),
    loadGame: vi.fn(),
    resetState: vi.fn(),
  },
  favouritesModel: {
    getState: vi.fn(),
    subscribe: vi.fn(),
    loadFavourites: vi.fn(),
    addFavourite: vi.fn(),
    removeFavourite: vi.fn(),
    resetState: vi.fn(),
  },
}))

vi.mock('react-router-dom', () => ({
  useParams: () => ({ gameId: '7' }),
}))
vi.mock('./GameDetailsModel.js', () => ({ default: models.gameDetailsModel }))
vi.mock('../Favourites/FavouritesModel.js', () => ({
  default: models.favouritesModel,
}))

function wrapperFor(user, loading = false) {
  return function Wrapper({ children }) {
    return (
      <AuthContext.Provider value={{ user, loading }}>
        {children}
      </AuthContext.Provider>
    )
  }
}

describe('useGameDetailsViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    models.gameDetailsModel.getState.mockImplementation(() => models.gameState)
    models.gameDetailsModel.subscribe.mockReturnValue(() => {})
    models.gameDetailsModel.loadGame.mockResolvedValue(undefined)
    models.favouritesModel.getState.mockImplementation(
      () => models.favouritesState,
    )
    models.favouritesModel.subscribe.mockReturnValue(() => {})
    models.favouritesModel.loadFavourites.mockResolvedValue(undefined)
    models.favouritesModel.addFavourite.mockResolvedValue(undefined)
    models.favouritesModel.removeFavourite.mockResolvedValue(undefined)
  })

  it('loads game details and the authenticated user favourites', async () => {
    const { result } = renderHook(() => useGameDetailsViewModel(), {
      wrapper: wrapperFor({ uid: 'user-1' }),
    })

    await waitFor(() => {
      expect(models.gameDetailsModel.loadGame).toHaveBeenCalledWith('7')
      expect(models.favouritesModel.loadFavourites).toHaveBeenCalledWith('user-1')
    })
    expect(result.current.game.name).toBe('Hades')
  })

  it('adds and removes the current game from favourites', async () => {
    const { result } = renderHook(() => useGameDetailsViewModel(), {
      wrapper: wrapperFor({ uid: 'user-1' }),
    })

    await act(async () => {
      await result.current.addToFavourites()
    })
    expect(models.favouritesModel.addFavourite).toHaveBeenCalledWith(
      'user-1',
      models.gameState.game,
    )
    expect(result.current.favouriteSuccess).toBe('Game added to your favourites.')

    await act(async () => {
      await result.current.removeFromFavourites()
    })
    expect(models.favouritesModel.removeFavourite).toHaveBeenCalledWith(
      'user-1',
      7,
    )
    expect(result.current.favouriteSuccess).toBe(
      'Game removed from your favourites.',
    )
  })

  it('derives the already-favourited state from loaded favourites', async () => {
    models.favouritesState = {
      ...models.favouritesState,
      favourites: [{ id: 7, name: 'Hades' }],
    }

    const { result } = renderHook(() => useGameDetailsViewModel(), {
      wrapper: wrapperFor({ uid: 'user-1' }),
    })

    await waitFor(() => expect(result.current.isFavourite).toBe(true))
  })
})
