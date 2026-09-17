import { beforeEach, describe, expect, it, vi } from 'vitest'
import fetchGames, { fetchGameById } from './gameService.js'

describe('gameService error handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('maps failed HTTP responses to a safe API error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          code: 'API_ERROR',
          message: 'RAWG API request limit reached. Please try again later.',
        }),
      }),
    )

    await expect(fetchGames()).rejects.toMatchObject({
      code: 'API_ERROR',
      message: 'RAWG API request limit reached. Please try again later.',
    })
  })

  it('maps request failures to a safe network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('socket secret')))

    await expect(fetchGames()).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      message: expect.stringContaining('Unable to connect to RAWG'),
    })
    await expect(fetchGames()).rejects.not.toThrow('socket secret')
  })

  it('reports invalid game IDs without making a request', async () => {
    const request = vi.fn()
    vi.stubGlobal('fetch', request)

    await expect(fetchGameById('  ')).rejects.toMatchObject({
      code: 'INVALID_GAME_ID',
    })
    expect(request).not.toHaveBeenCalled()
  })
})

describe('gameService RAWG boundary requests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loads games with search, pagination, filters, and ordering', async () => {
    const response = {
      count: 1,
      next: null,
      results: [{ id: 3498, name: 'Grand Theft Auto V' }],
    }
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => response,
    })
    vi.stubGlobal('fetch', request)

    await expect(
      fetchGames(' mario ', {
        page: 2,
        pageSize: 24,
        filters: {
          genre: '4',
          platform: '18',
          ordering: '-rating',
        },
      }),
    ).resolves.toEqual(response)

    expect(request).toHaveBeenCalledWith(
      '/api/games?page_size=24&page=2&search=mario&genres=4&platforms=18&ordering=-rating',
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      },
    )
  })

  it('loads game details through the server boundary', async () => {
    const response = { id: 3498, name: 'Grand Theft Auto V' }
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => response,
    })
    vi.stubGlobal('fetch', request)

    await expect(fetchGameById(3498)).resolves.toEqual(response)
    expect(request).toHaveBeenCalledWith('/api/games/3498', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
  })
})
