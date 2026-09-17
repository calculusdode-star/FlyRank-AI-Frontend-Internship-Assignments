import { Link } from 'react-router-dom'
import useGameDetailsViewModel from './useGameDetailsViewModel.js'
import './GameDetails.css'

function formatReleaseDate(releaseDate) {
  if (!releaseDate) return null

  const date = new Date(releaseDate)
  return Number.isNaN(date.getTime())
    ? releaseDate
    : date.toLocaleDateString()
}

/**
 * GameDetailsView - Presents details for the game selected by the route.
 */
function GameDetailsView() {
  const {
    game,
    loading,
    error,
    empty,
    user,
    authLoading,
    isFavourite,
    addToFavourites,
    removeFromFavourites,
    favouriteLoading,
    favouriteError,
    favouriteSuccess,
  } = useGameDetailsViewModel()

  return (
    <main className="game-details">
      {loading && (
        <p className="game-details__state" role="status">
          Loading game details...
        </p>
      )}

      {error && (
        <p className="game-details__state game-details__state--error" role="alert">
          {error}
        </p>
      )}

      {empty && !loading && !error && (
        <p className="game-details__state" role="status">No game selected.</p>
      )}

      {game && !loading && !error && (
        <article className="game-details__content">
          <header className="game-details__header">
            <h1 className="game-details__title">{game.name}</h1>
            {authLoading && (
              <p className="game-details__favourite-status" role="status">
                Checking favourite status...
              </p>
            )}

            {!authLoading && !user && (
              <Link
                className="game-details__favourite-button"
                to="/login"
                state={{ from: `/games/${game.id}` }}
              >
                Log in to add to favourites
              </Link>
            )}

            {!authLoading && user && !isFavourite && (
              <button
                type="button"
                className="game-details__favourite-button"
                aria-label={`Add ${game.name} to favourites`}
                onClick={addToFavourites}
                disabled={favouriteLoading}
              >
                {favouriteLoading ? 'Adding...' : 'Add to Favourites'}
              </button>
            )}

            {!authLoading && user && isFavourite && (
              <button
                type="button"
                className="game-details__favourite-button"
                aria-label={`Remove ${game.name} from favourites`}
                onClick={removeFromFavourites}
                disabled={favouriteLoading}
              >
                {favouriteLoading
                  ? 'Removing...'
                  : 'Remove from Favourites'}
              </button>
            )}
          </header>

          {favouriteError && (
            <p className="game-details__state game-details__state--error" role="alert">
              {favouriteError}
            </p>
          )}

          {favouriteSuccess && (
            <p className="game-details__favourite-status" role="status">
              {favouriteSuccess}
            </p>
          )}

          <div className="game-details__layout">
            {game.background_image && (
              <img
                className="game-details__image"
                src={game.background_image}
                alt={`${game.name} cover art`}
              />
            )}

            <div className="game-details__information">
              {(game.description_raw || game.description) && (
                <section className="game-details__section">
                  <h2>Description</h2>
                  <p>{game.description_raw || game.description}</p>
                </section>
              )}

              <dl className="game-details__metadata">
                {game.released && (
                  <div>
                    <dt>Release date</dt>
                    <dd>{formatReleaseDate(game.released)}</dd>
                  </div>
                )}
                {game.rating !== undefined && game.rating !== null && (
                  <div>
                    <dt>Rating</dt>
                    <dd>{game.rating} / 5</dd>
                  </div>
                )}
                {Array.isArray(game.genres) && game.genres.length > 0 && (
                  <div>
                    <dt>Genres</dt>
                    <dd>{game.genres.map((genre) => genre.name).join(', ')}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </article>
      )}
    </main>
  )
}

export default GameDetailsView
