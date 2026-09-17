import fetchGames from '../../services/gameService.js';

/**
 * Home Model - Contains initial data and business logic for the Home page
 * Following MVVM pattern: Model represents the data and business logic
 */

// Initial home page data (fallback / default categories)
const initialHomeData = {
  welcomeMessage: 'Welcome to Game Discovery!',
  subtitle: 'Your ultimate destination for finding amazing games',
  status: 'loading',
  query: '',
  games: [],
  currentPage: 1,
  hasMore: false,
  loadingMore: false,
  filters: {
    genre: '',
    platform: '',
    ordering: '',
  },
  categories: ['Action', 'Adventure', 'RPG', 'Racing', 'Strategy', 'Puzzle'],
  featuredGames: [],
  error: null
};

/**
 * Home Model class
 * Encapsulates the state and behavior for the Home page
 */
class HomeModel {
  constructor() {
    this.state = { ...initialHomeData };
    this.subscribers = [];
    this.requestId = 0;
  }

  /**
   * Subscribe to state changes
   * @param {Function} listener - Function to call when state changes
   */
  subscribe(listener) {
    this.subscribers.push(listener);
  }

  /**
   * Unsubscribe from state changes
   * @param {Function} listener - Function to remove
   */
  unsubscribe(listener) {
    this.subscribers = this.subscribers.filter((sub) => sub !== listener);
  }

  /**
   * Notify all subscribers of state changes
   */
  notify() {
    this.subscribers.forEach((listener) => listener());
  }

  /**
   * Get current state
   * @returns {Object} Current state copy
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Set state (partial update)
   * @param {Object} newState - State to merge
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  /**
   * Reset state to initial values
   */
  resetState() {
    this.requestId += 1;
    this.state = { ...initialHomeData };
  }

  /**
   * Load initial data from the RAWG API via gameService
   * @returns {Promise<void>}
   */
  async loadGames(query = '', filters = initialHomeData.filters) {
    const searchQuery = query.trim();
    const requestId = ++this.requestId;

    try {
      this.setState({
        status: 'loading',
        error: null,
        currentPage: 1,
        hasMore: false,
        loadingMore: false,
        filters,
      });

      const data = await fetchGames(searchQuery, { page: 1, filters });
      if (requestId !== this.requestId) return;

      // RAWG API returns { results: [...], count: ..., next: ..., previous: ... }
      const games = data.results || [];

      // Determine featured games from the first few results
      const featuredIds = games.slice(0, 2).map((g) => g.id);

      this.setState({
        status: 'loaded',
        games,
        currentPage: 1,
        hasMore: Boolean(data.next),
        loadingMore: false,
        featuredGames: featuredIds,
      });
    } catch (error) {
      if (requestId !== this.requestId) return;
      // Do not expose sensitive/internal error details to the UI
      const message = error instanceof Error ? 'Failed to load games' : 'Unknown error';
      this.setState({
        status: 'error',
        loadingMore: false,
        error: message,
      });
      // Re-throw so callers can handle if needed, but without sensitive info
      throw new Error(message);
    }
  }

  /**
   * Load and append the next page of games.
   * @returns {Promise<void>}
   */
  async loadMoreGames() {
    const { query, currentPage, hasMore, loadingMore, games } = this.state;

    if (loadingMore || !hasMore) {
      return;
    }

    const nextPage = currentPage + 1;
    const requestId = this.requestId;
    this.setState({ loadingMore: true, error: null });

    try {
      const data = await fetchGames(query, {
        page: nextPage,
        filters: this.state.filters,
      });
      if (requestId !== this.requestId) return;
      const nextGames = Array.isArray(data.results) ? data.results : [];

      this.setState({
        status: 'loaded',
        games: [...games, ...nextGames],
        currentPage: nextPage,
        hasMore: Boolean(data.next),
        loadingMore: false,
        error: null,
      });
    } catch {
      if (requestId !== this.requestId) return;
      this.setState({
        loadingMore: false,
        error: 'Failed to load more games.',
      });
    }
  }

  /**
   * Load the default game list.
   * @returns {Promise<void>}
   */
  async loadInitialData() {
    return this.loadGames();
  }

  /**
   * Update the current search query.
   * @param {string} query - Search input value
   */
  setSearchQuery(query) {
    this.setState({ query });
  }

  /**
   * Handle error state
   * @param {Error} error - Error object
   */
  setError(error) {
    this.setState({
      status: 'error',
      error: error.message || 'Unknown error'
    });
  }

  /**
   * Update welcome message
   * @param {string} message - New welcome message
   */
  setWelcomeMessage(message) {
    this.setState({
      welcomeMessage: message
    });
  }
}

// Export singleton instance
const homeModel = new HomeModel();
export default homeModel;