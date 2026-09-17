import { useEffect, useState } from 'react'
import homeModel from './HomeModel.js'

const initialFilters = {
  genre: '',
  platform: '',
  ordering: '',
}

/**
 * useHomeViewModel - Custom hook that exposes data needed by the Home view
 * Acts as the ViewModel layer in the MVVM architecture
 */
function useHomeViewModel() {
  const [state, setState] = useState(homeModel.getState())
  const [filters, setFilters] = useState(initialFilters)

  /**
   * Subscribe to model state changes
   * @param {Function} listener - Function to call when state changes
   * @returns {Function} Unsubscribe function
   */
  const subscribe = listener => {
    homeModel.subscribe(listener)
    return () => homeModel.unsubscribe(listener)
  }

  /**
   * Load initial games data from the RAWG API via the Home Model.
   * Fetches games when the Home page mounts.
   */
  const loadInitialData = async () => {
    try {
      await homeModel.loadInitialData()
    } catch {
      // The model already sanitizes error messages and stores them in state.
      // We do not re-throw to avoid unhandled promise rejections.
      console.warn('Home page failed to load games.')
    }
  }

  /**
   * Set the welcome message.
   * @param {string} message - New welcome message
   */
  const setWelcomeMessage = message => homeModel.setWelcomeMessage(message)

  /**
   * Reset state to initial values.
   */
  const resetState = () => homeModel.resetState()

  /**
   * Update the search input value.
   * @param {string} query - Search input value
   */
  const setSearchQuery = query => homeModel.setSearchQuery(query)

  /**
   * Search for games using the current query.
   * @returns {Promise<void>}
   */
  const searchGames = async () => {
    const query = homeModel.getState().query

    if (!query.trim()) {
      return
    }

    try {
      await homeModel.loadGames(query, filters)
    } catch {
      // The model already stores a safe, user-facing error message.
      console.warn('Home page search failed.')
    }
  }

  /**
   * Update a filter and reload the first page with the current search.
   * @param {string} name - Filter name.
   * @param {string} value - Selected filter value.
   * @returns {Promise<void>}
   */
  const updateFilter = async (name, value) => {
    const nextFilters = { ...filters, [name]: value }
    setFilters(nextFilters)

    try {
      await homeModel.loadGames(homeModel.getState().query, nextFilters)
    } catch {
      // The model stores a safe, user-facing error message.
      console.warn('Home page filter request failed.')
    }
  }

  /**
   * Load the next page of games and append it to the current results.
   * @returns {Promise<void>}
   */
  const loadMoreGames = async () => {
    await homeModel.loadMoreGames()
  }

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setState(homeModel.getState())
    })

    loadInitialData()

    return unsubscribe
  }, [])

  // Derive games, loading, and error from the model state
  const { games, error, status, query, hasMore, loadingMore } = state
  const loading = status === 'loading'

  return {
    state,
    subscribe,
    loadInitialData,
    setWelcomeMessage,
    resetState,
    query,
    setSearchQuery,
    searchGames,
    filters,
    updateFilter,
    loadMoreGames,
    games,
    loading,
    loadingMore,
    hasMore,
    error
  }
}

export default useHomeViewModel