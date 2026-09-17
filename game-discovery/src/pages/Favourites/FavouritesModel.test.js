import { beforeEach, describe, expect, it, vi } from 'vitest'
import favouritesModel from './FavouritesModel.js'

const service = vi.hoisted(() => ({
  getFavourites: vi.fn(),
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}))

vi.mock('../../services/favouritesService.js', () => service)

describe('FavouritesModel failure handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    favouritesModel.resetState()
  })

  it('stores a safe error when favourites retrieval fails', async () => {
    service.getFavourites.mockRejectedValue(new Error('Firebase credential'))

    await expect(favouritesModel.loadFavourites('user-1')).rejects.toThrow(
      'Unable to load favourites.',
    )
    expect(favouritesModel.getState()).toMatchObject({
      status: 'error',
      error: 'Unable to load favourites.',
      favourites: [],
    })
  })

  it('stores a safe error when adding a favourite fails', async () => {
    service.addFavourite.mockRejectedValue(new Error('permission denied'))

    await expect(
      favouritesModel.addFavourite('user-1', { id: 1, name: 'Hades' }),
    ).rejects.toThrow('Unable to add favourite.')
    expect(favouritesModel.getState().error).toBe('Unable to add favourite.')
  })

  it('stores a safe error when removing a favourite fails', async () => {
    service.removeFavourite.mockRejectedValue(new Error('permission denied'))

    await expect(
      favouritesModel.removeFavourite('user-1', 1),
    ).rejects.toThrow('Unable to remove favourite.')
    expect(favouritesModel.getState().error).toBe('Unable to remove favourite.')
  })
})
