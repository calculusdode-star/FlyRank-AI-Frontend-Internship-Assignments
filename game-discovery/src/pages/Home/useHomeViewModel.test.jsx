import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useHomeViewModel from './useHomeViewModel.js'

const model = vi.hoisted(() => ({
  state: {
    games: [],
    error: null,
    status: 'loaded',
    query: '',
    hasMore: true,
    loadingMore: false,
  },
  getState: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  loadInitialData: vi.fn(),
  loadGames: vi.fn(),
  loadMoreGames: vi.fn(),
  setSearchQuery: vi.fn(),
  resetState: vi.fn(),
  setWelcomeMessage: vi.fn(),
}))

vi.mock('./HomeModel.js', () => ({ default: model }))

describe('useHomeViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    model.getState.mockImplementation(() => model.state)
    model.subscribe.mockReturnValue(() => {})
    model.loadInitialData.mockResolvedValue(undefined)
    model.loadGames.mockResolvedValue(undefined)
    model.loadMoreGames.mockResolvedValue(undefined)
  })

  it('loads initial data and exposes model loading state', async () => {
    model.state = { ...model.state, status: 'loading' }
    const { result } = renderHook(() => useHomeViewModel())

    await waitFor(() => expect(model.loadInitialData).toHaveBeenCalled())
    expect(result.current.loading).toBe(true)
  })

  it('loads more games through the model', async () => {
    const { result } = renderHook(() => useHomeViewModel())

    await act(async () => {
      await result.current.loadMoreGames()
    })

    expect(model.loadMoreGames).toHaveBeenCalledTimes(1)
  })

  it('resets the model pagination through a new search request', async () => {
    model.state = { ...model.state, query: 'zelda' }
    const { result } = renderHook(() => useHomeViewModel())

    await act(async () => {
      await result.current.searchGames()
    })

    expect(model.loadGames).toHaveBeenCalledWith('zelda', {
      genre: '',
      platform: '',
      ordering: '',
    })
  })

  it('resets the model pagination when a filter changes', async () => {
    model.state = { ...model.state, query: 'zelda' }
    const { result } = renderHook(() => useHomeViewModel())

    await act(async () => {
      await result.current.updateFilter('platform', '4')
    })

    expect(model.loadGames).toHaveBeenCalledWith('zelda', {
      genre: '',
      platform: '4',
      ordering: '',
    })
    expect(result.current.filters.platform).toBe('4')
  })

  it('does not search for an empty or whitespace-only query', async () => {
    model.state = { ...model.state, query: '   ' }
    const { result } = renderHook(() => useHomeViewModel())

    await act(async () => {
      await result.current.searchGames()
    })

    expect(model.loadGames).not.toHaveBeenCalled()
  })
})
