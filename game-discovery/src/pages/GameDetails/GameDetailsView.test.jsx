import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GameDetailsView from './GameDetailsView.jsx'

const mocks = vi.hoisted(() => ({
  useGameDetailsViewModel: vi.fn(),
}))

vi.mock('./useGameDetailsViewModel.js', () => ({
  default: mocks.useGameDetailsViewModel,
}))

const game = {
  id: 7,
  name: 'Hades',
  background_image: 'https://example.test/hades.jpg',
  description_raw: 'Defy the god of the dead.',
  released: '2020-09-17',
  rating: 4.5,
  genres: [{ name: 'Action' }, { name: 'RPG' }],
}

function renderView() {
  return render(
    <MemoryRouter>
      <GameDetailsView />
    </MemoryRouter>,
  )
}

describe('GameDetailsView', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the loading state', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game: null,
      loading: true,
      error: null,
      empty: false,
    })

    renderView()

    expect(screen.getByRole('status')).toHaveTextContent('Loading game details...')
  })

  it('shows an error state', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game: null,
      loading: false,
      error: 'Failed to load game details.',
      empty: false,
    })

    renderView()

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load game details.')
  })

  it('renders optional details safely when image and metadata are missing', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game: { id: 7, name: 'Minimal Game' },
      loading: false,
      error: null,
      empty: false,
      user: null,
      authLoading: false,
      isFavourite: false,
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      favouriteLoading: false,
      favouriteError: null,
      favouriteSuccess: null,
    })

    renderView()

    expect(screen.getByRole('heading', { name: 'Minimal Game' })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByText('Description')).not.toBeInTheDocument()
    expect(screen.queryByText(/Rating/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Genres/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Release date/)).not.toBeInTheDocument()
  })

  it('shows the empty state for an invalid or missing game', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game: null,
      loading: false,
      error: null,
      empty: true,
    })

    renderView()

    expect(screen.getByText('No game selected.')).toBeInTheDocument()
  })

  it('displays the selected game details when available', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game,
      loading: false,
      error: null,
      empty: false,
      user: null,
      authLoading: false,
      isFavourite: false,
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      favouriteLoading: false,
      favouriteError: null,
      favouriteSuccess: null,
    })

    renderView()

    expect(screen.getByRole('heading', { name: 'Hades' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Hades cover art' })).toHaveAttribute(
      'src',
      game.background_image,
    )
    expect(screen.getByText(game.description_raw)).toBeInTheDocument()
    expect(
      screen.getByText(new Date(game.released).toLocaleDateString()),
    ).toBeInTheDocument()
    expect(screen.getByText('4.5 / 5')).toBeInTheDocument()
    expect(screen.getByText('Action, RPG')).toBeInTheDocument()
  })

  it('offers login instead of favourites controls to an unauthenticated user', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game,
      loading: false,
      error: null,
      empty: false,
      user: null,
      authLoading: false,
      isFavourite: false,
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      favouriteLoading: false,
      favouriteError: null,
      favouriteSuccess: null,
    })

    renderView()

    expect(
      screen.getByRole('link', { name: /log in to add to favourites/i }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add to favourites/i })).not.toBeInTheDocument()
  })

  it('handles authentication loading while checking favourite status', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game,
      loading: false,
      error: null,
      empty: false,
      user: null,
      authLoading: true,
      isFavourite: false,
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      favouriteLoading: false,
      favouriteError: null,
      favouriteSuccess: null,
    })

    renderView()

    expect(screen.getByText('Checking favourite status...')).toBeInTheDocument()
  })

  it('adds a game to favourites and disables duplicate actions while processing', () => {
    const addToFavourites = vi.fn()
    mocks.useGameDetailsViewModel.mockReturnValue({
      game,
      loading: false,
      error: null,
      empty: false,
      user: { uid: 'user-1' },
      authLoading: false,
      isFavourite: false,
      addToFavourites,
      removeFromFavourites: vi.fn(),
      favouriteLoading: true,
      favouriteError: null,
      favouriteSuccess: null,
    })

    renderView()

    const button = screen.getByRole('button', { name: /add hades to favourites/i })
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Adding...')
    fireEvent.click(button)
    expect(addToFavourites).not.toHaveBeenCalled()
  })

  it('shows the remove action when the game is already favourited', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game,
      loading: false,
      error: null,
      empty: false,
      user: { uid: 'user-1' },
      authLoading: false,
      isFavourite: true,
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      favouriteLoading: false,
      favouriteError: null,
      favouriteSuccess: null,
    })

    renderView()

    expect(
      screen.getByRole('button', { name: /remove hades from favourites/i }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add hades to favourites/i })).not.toBeInTheDocument()
  })

  it('shows favourite success and error feedback safely', () => {
    mocks.useGameDetailsViewModel.mockReturnValue({
      game,
      loading: false,
      error: null,
      empty: false,
      user: { uid: 'user-1' },
      authLoading: false,
      isFavourite: false,
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      favouriteLoading: false,
      favouriteError: null,
      favouriteSuccess: 'Game added to your favourites.',
    })

    renderView()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Game added to your favourites.',
    )
    expect(screen.queryByText(/VITE_RAWG_API_KEY|api\.rawg\.io|key=/i)).not.toBeInTheDocument()
  })
})
