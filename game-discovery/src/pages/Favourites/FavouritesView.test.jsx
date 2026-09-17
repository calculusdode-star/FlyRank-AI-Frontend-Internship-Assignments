import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FavouritesView from './FavouritesView.jsx'

const mocks = vi.hoisted(() => ({
  useFavouritesViewModel: vi.fn(),
}))

vi.mock('./useFavouritesViewModel.js', () => ({
  default: mocks.useFavouritesViewModel,
}))

vi.mock('../../components/GameCard/GameCard.jsx', () => ({
  default: ({ game }) => <div>{game.name}</div>,
}))

describe('FavouritesView', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders the empty favourites state', () => {
    mocks.useFavouritesViewModel.mockReturnValue({
      favourites: [],
      loading: false,
      error: null,
      removeFavourite: vi.fn(),
    })

    render(<FavouritesView />)

    expect(
      screen.getByText('You have not added any favourite games yet.'),
    ).toBeInTheDocument()
  })

  it('displays available favourites and removes the selected game', () => {
    const removeFavourite = vi.fn()
    mocks.useFavouritesViewModel.mockReturnValue({
      favourites: [{ id: 1, name: 'Celeste' }],
      loading: false,
      error: null,
      removeFavourite,
    })

    render(<FavouritesView />)

    expect(screen.getByText('Celeste')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /remove celeste/i }))

    expect(removeFavourite).toHaveBeenCalledWith(1)
  })

  it('shows a loading state while a favourite operation is processing', () => {
    const removeFavourite = vi.fn()
    mocks.useFavouritesViewModel.mockReturnValue({
      favourites: [{ id: 1, name: 'Celeste' }],
      loading: true,
      error: null,
      removeFavourite,
    })
    render(<FavouritesView />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading favourites...')
    expect(screen.queryByRole('button', { name: /remove celeste/i })).not.toBeInTheDocument()
    expect(removeFavourite).not.toHaveBeenCalled()
  })
})
