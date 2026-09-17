import { beforeEach, describe, expect, it, vi } from 'vitest'
import homeModel from './HomeModel.js'

const fetchGames = vi.hoisted(() => vi.fn())

vi.mock('../../services/gameService.js', () => ({
  default: fetchGames,
}))

describe('HomeModel pagination behavior', () => {
  beforeEach(() => {
    fetchGames.mockReset()
    homeModel.resetState()
  })

  it('appends the next page of games to the existing results', async () => {
    fetchGames
      .mockResolvedValueOnce({
        results: [{ id: 1, name: 'Hades' }],
        next: 'next-page',
      })
      .mockResolvedValueOnce({
        results: [{ id: 2, name: 'Celeste' }],
        next: null,
      })

    await homeModel.loadGames()
    await homeModel.loadMoreGames()

    expect(homeModel.getState().games).toEqual([
      { id: 1, name: 'Hades' },
      { id: 2, name: 'Celeste' },
    ])
    expect(homeModel.getState().hasMore).toBe(false)
    expect(fetchGames).toHaveBeenNthCalledWith(2, '', {
      page: 2,
      filters: {
        genre: '',
        platform: '',
        ordering: '',
      },
    })
  })

  it('resets pagination when a new search or filter set is loaded', async () => {
    fetchGames
      .mockResolvedValueOnce({
        results: [{ id: 1, name: 'Hades' }],
        next: 'next-page',
      })
      .mockResolvedValueOnce({
        results: [{ id: 3, name: 'Zelda' }],
        next: null,
      })

    await homeModel.loadGames()
    homeModel.setState({ currentPage: 4, hasMore: true })
    await homeModel.loadGames('zelda', { genre: '4', platform: '7', ordering: '-rating' })

    expect(homeModel.getState().currentPage).toBe(1)
    expect(homeModel.getState().games).toEqual([{ id: 3, name: 'Zelda' }])
    expect(fetchGames).toHaveBeenLastCalledWith('zelda', {
      page: 1,
      filters: { genre: '4', platform: '7', ordering: '-rating' },
    })
  })

  it('does not request another page when no more games are available', async () => {
    fetchGames.mockResolvedValueOnce({
      results: [{ id: 1, name: 'Hades' }],
      next: null,
    })

    await homeModel.loadGames()
    await homeModel.loadMoreGames()

    expect(fetchGames).toHaveBeenCalledTimes(1)
    expect(homeModel.getState().games).toEqual([{ id: 1, name: 'Hades' }])
  })

  it('preserves loaded games when pagination fails', async () => {
    fetchGames
      .mockResolvedValueOnce({
        results: [{ id: 1, name: 'Hades' }],
        next: 'next-page',
      })
      .mockRejectedValueOnce(new Error('network failure'))

    await homeModel.loadGames()
    await homeModel.loadMoreGames()

    expect(homeModel.getState()).toMatchObject({
      games: [{ id: 1, name: 'Hades' }],
      loadingMore: false,
      error: 'Failed to load more games.',
    })
  })

  it('stores a safe error when the initial request fails', async () => {
    fetchGames.mockRejectedValue(new Error('RAWG API key secret'))

    await expect(homeModel.loadGames()).rejects.toThrow('Failed to load games')
    expect(homeModel.getState().error).toBe('Failed to load games')
    expect(homeModel.getState().error).not.toContain('RAWG API key secret')
  })
})
