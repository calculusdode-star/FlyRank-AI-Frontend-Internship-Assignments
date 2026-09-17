import GameCard from '../../components/GameCard/GameCard.jsx'
import useFavouritesViewModel from './useFavouritesViewModel.js'
import './Favourites.css'

/**
 * FavouritesView - Presents the authenticated user's favourite games.
 */
function FavouritesView() {
  const { favourites, loading, error, removeFavourite } = useFavouritesViewModel()

  return (
    <main className="favourites">
      <header className="favourites__header">
        <h1 className="favourites__title">Favourites</h1>
        <p className="favourites__subtitle">
          Your saved games will appear here.
        </p>
      </header>

      {loading && (
        <p className="favourites__state" role="status">
          Loading favourites...
        </p>
      )}

      {error && (
        <p className="favourites__state favourites__state--error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && favourites.length === 0 && (
        <p className="favourites__state" role="status">
          You have not added any favourite games yet.
        </p>
      )}

      {!loading && !error && favourites.length > 0 && (
        <section aria-labelledby="favourites-list-title">
          <h2 id="favourites-list-title" className="favourites__list-title">
            Saved games
          </h2>
          <div className="favourites__game-list">
            {favourites.map((game) => (
              <article className="favourites__game-item" key={game.id}>
                <GameCard game={game} />
                <button
                  type="button"
                  className="favourites__remove-button"
                  onClick={() => removeFavourite(game.id)}
                  disabled={loading}
                  aria-label={`Remove ${game.name} from favourites`}
                >
                  {loading ? 'Removing...' : 'Remove from Favourites'}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default FavouritesView
