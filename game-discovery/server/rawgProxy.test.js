import { describe, expect, it, vi } from 'vitest'
import { createRawgProxy, getRawgApiKey } from './rawgProxy.js'

function responseRecorder() {
  return {
    status: null,
    body: null,
    writeHead(status) {
      this.status = status
    },
    end(body) {
      this.body = JSON.parse(body)
    },
  }
}

describe('RAWG server boundary', () => {
  it('reads only the server-side RAWG_API_KEY setting', () => {
    expect(getRawgApiKey({ RAWG_API_KEY: 'server-key' })).toBe('server-key')
    expect(getRawgApiKey({ VITE_RAWG_API_KEY: 'client-key' })).toBe(null)
  })

  it('supports spaced and quoted local environment values', async () => {
    expect(getRawgApiKey({ RAWG_API_KEY: '  "server-key"  ' })).toBe('server-key')
  })

  it('does not forward a client-provided key and keeps the server key private', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 1 }] }),
    })
    const response = responseRecorder()
    const proxy = createRawgProxy({
      environment: { RAWG_API_KEY: 'server-key' },
      fetchImpl,
    })

    await proxy(
      {
        method: 'GET',
        url: '/api/games?page_size=1&key=client-key',
      },
      response,
    )

    const requestedUrl = fetchImpl.mock.calls[0][0]
    expect(requestedUrl).toContain('key=server-key')
    expect(requestedUrl).not.toContain('client-key')
    expect(response.status).toBe(200)
    expect(JSON.stringify(response.body)).not.toContain('server-key')
  })

  it('removes API keys from upstream pagination URLs', async () => {
    const response = responseRecorder()
    const proxy = createRawgProxy({
      environment: { RAWG_API_KEY: 'server-key' },
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          next: 'https://api.rawg.io/api/games?page=2&key=server-key',
          results: [],
        }),
      }),
    })

    await proxy({ method: 'GET', url: '/api/games' }, response)

    expect(response.status).toBe(200)
    expect(response.body.next).toBe('https://api.rawg.io/api/games?page=2')
    expect(JSON.stringify(response.body)).not.toContain('server-key')
  })

  it('returns a safe configuration error when the server key is missing', async () => {
    const response = responseRecorder()
    const fetchImpl = vi.fn()
    const proxy = createRawgProxy({
      environment: {},
      fetchImpl,
    })

    await proxy({ method: 'GET', url: '/api/games' }, response)

    expect(response.status).toBe(503)
    expect(response.body).toEqual({
      code: 'MISSING_CONFIGURATION',
      message: 'The game service is not configured. Please try again later.',
    })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('rejects unsupported and excessive upstream query parameters', async () => {
    const response = responseRecorder()
    const fetchImpl = vi.fn()
    const proxy = createRawgProxy({
      environment: { RAWG_API_KEY: 'server-key' },
      fetchImpl,
    })

    await proxy(
      {
        method: 'GET',
        url: '/api/games?page_size=1000&url=https://example.test',
      },
      response,
    )

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      code: 'INVALID_REQUEST',
      message: 'The game request contains invalid search or filter parameters.',
    })
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})
