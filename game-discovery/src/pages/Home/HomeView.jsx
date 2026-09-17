import GameCard from '../../components/GameCard/GameCard.jsx'
import GameFilters from '../../components/GameFilters/GameFilters.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import useHomeViewModel from './useHomeViewModel.js'
import './Home.css'

/**
 * HomeView - Presentation layer for the Home page
 * Displays the UI based on data from the ViewModel
 */
function HomeView() {
  const {
    games,
    loading,
    error,
    state,
    loadInitialData,
    query,
    setSearchQuery,
    searchGames,
    filters,
    updateFilter,
    loadMoreGames,
    loadingMore,
    hasMore,
  } = useHomeViewModel()

  const categoryGenreIds = {
    Action: '4',
    Adventure: '3',
    RPG: '5',
    Racing: '1',
    Strategy: '10',
    Puzzle: '7',
  }

  return (
    <main className="home-view">
      <section className="home-view__hero">
        <h1 className="home-view__title">{state.welcomeMessage}</h1>
        <p className="home-view__subtitle">{state.subtitle}</p>
      </section>

      <section
        className="home-view__status"
        aria-label="Game loading status"
        aria-busy={loading}
      >
        {loading && (
          <p className="home-view__status-text" role="status">
            Loading games...
          </p>
        )}
        {!loading && !error && (
          <p className="home-view__status-text" role="status">
            Ready to discover games!
          </p>
        )}
        {error && games.length === 0 && (
          <>
            <p
              className="home-view__status-text home-view__status-text--error"
              role="alert"
            >
              Error: {error}
            </p>
            <button
              type="button"
              className="home-view__category-button"
              onClick={loadInitialData}
              disabled={loading}
            >
              Try again
            </button>
          </>
        )}
      </section>

      {/* Game categories */}
      <section className="home-view__categories" aria-labelledby="categories-title">
        <h2 id="categories-title" className="home-view__section-title">Categories</h2>
        <div className="home-view__category-list">
          {state.categories.map((category) => (
            <button
              key={category}
              type="button"
              className="home-view__category-button"
              onClick={() =>
                updateFilter('genre', categoryGenreIds[category] || '')
              }
              disabled={loading}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <SearchBar
        value={query}
        onChange={(event) => setSearchQuery(event.target.value)}
        onSubmit={searchGames}
      />

      <GameFilters filters={filters} onChange={updateFilter} />

      {/* Featured games */}
      <section className="home-view__featured" aria-labelledby="featured-games-title">
        <h2 id="featured-games-title" className="home-view__section-title">Featured Games</h2>
        <div className="home-view__game-list">
          {state.featuredGames.map((id) => {
            const game = games.find((g) => g.id === id)
            if (!game) return null
            return <GameCard key={game.id} game={game} />
          })}
          {!loading && !error && games.length > 0 && state.featuredGames.length === 0 && (
            <p className="home-view__empty-state">No featured games to show.</p>
          )}
        </div>
      </section>

      {/* All games */}
      <section className="home-view__all-games" aria-labelledby="all-games-title">
        <h2 id="all-games-title" className="home-view__section-title">All Games</h2>
        <div className="home-view__game-list">
          {loading ? (
            <p className="home-view__empty-state">Loading games...</p>
          ) : error && games.length === 0 ? (
            <p className="home-view__empty-state home-view__empty-state--error">
              Error: {error}
            </p>
          ) : games.length === 0 ? (
            <p className="home-view__empty-state">No games found.</p>
          ) : (
            games.map((game) => <GameCard key={game.id} game={game} />)
          )}
        </div>
        {error && games.length > 0 && (
          <p className="home-view__empty-state home-view__empty-state--error" role="alert">
            Error: {error}
          </p>
        )}
        {hasMore && (
          <div className="home-view__pagination">
            <button
              type="button"
              className="home-view__category-button"
              onClick={loadMoreGames}
              disabled={loadingMore || loading}
            >
              {loadingMore ? 'Loading more games...' : 'Load More'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default HomeView