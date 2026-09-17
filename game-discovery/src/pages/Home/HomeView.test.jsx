import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HomeView from './HomeView.jsx'

const mocks = vi.hoisted(() => ({
  useHomeViewModel: vi.fn(),
}))

vi.mock('./useHomeViewModel.js', () => ({
  default: mocks.useHomeViewModel,
}))

const games = [
  {
    id: 1,
    name: 'Hades',
    background_image: 'https://example.test/hades.jpg',
  },
  {
    id: 2,
    name: 'Celeste',
    background_image: 'https://example.test/celeste.jpg',
  },
]

const baseState = {
  welcomeMessage: 'Welcome',
  subtitle: 'Discover games',
  categories: [],
  featuredGames: [1],
}

function renderView(overrides = {}) {
  mocks.useHomeViewModel.mockReturnValue({
    games,
    loading: false,
    error: null,
    state: baseState,
    query: '',
    setSearchQuery: vi.fn(),
    searchGames: vi.fn(),
    filters: { genre: '', platform: '', ordering: '' },
    updateFilter: vi.fn(),
    loadMoreGames: vi.fn(),
    loadingMore: false,
    hasMore: false,
    ...overrides,
  })

  return render(
    <MemoryRouter>
      <HomeView />
    </MemoryRouter>,
  )
}

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the loading state', () => {
    renderView({ loading: true, games: [] })

    expect(screen.getAllByText('Loading games...').length).toBeGreaterThan(0)
    expect(screen.getByRole('status')).toHaveTextContent('Loading games...')
  })

  it('shows successfully loaded games and search results', () => {
    renderView({ query: 'hades' })

    expect(screen.getAllByText('Hades').length).toBeGreaterThan(0)
    expect(screen.getByText('Celeste')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('hades')
  })

  it('shows an error state without exposing configuration secrets', () => {
    renderView({
      games: [],
      error: 'Failed to load games',
      state: { ...baseState, featuredGames: [] },
    })

    expect(screen.getAllByText(/Failed to load games/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/VITE_RAWG_API_KEY|api\.rawg\.io|key=/i)).not.toBeInTheDocument()
  })

  it('shows the empty state when no games are available', () => {
    renderView({ games: [], state: { ...baseState, featuredGames: [] } })

    expect(screen.getByText('No games found.')).toBeInTheDocument()
  })

  it('requests more games when Load More is selected', () => {
    const loadMoreGames = vi.fn()
    renderView({ loadMoreGames, hasMore: true })

    fireEvent.click(screen.getByRole('button', { name: 'Load More' }))

    expect(loadMoreGames).toHaveBeenCalledTimes(1)
  })

  it('shows additional loading feedback while appending games', () => {
    renderView({ hasMore: true, loadingMore: true })

    const button = screen.getByRole('button', { name: 'Loading more games...' })
    expect(button).toBeDisabled()
  })

  it('passes search and filter changes to the ViewModel', () => {
    const setSearchQuery = vi.fn()
    const searchGames = vi.fn()
    const updateFilter = vi.fn()
    renderView({ setSearchQuery, searchGames, updateFilter })

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'zelda' },
    })
    fireEvent.submit(screen.getByRole('searchbox').closest('form'))
    fireEvent.change(screen.getByLabelText('Genre'), {
      target: { value: '4' },
    })

    expect(setSearchQuery).toHaveBeenCalledWith('zelda')
    expect(searchGames).toHaveBeenCalledTimes(1)
    expect(updateFilter).toHaveBeenCalledWith('genre', '4')
  })

  it('links each GameCard to its Game Details route', () => {
    renderView()

    expect(
      screen.getAllByRole('link', { name: 'View details for Hades' })[0],
    ).toHaveAttribute('href', '/games/1')
  })
})
