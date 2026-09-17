import { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import favouritesModel from './FavouritesModel.js'

/**
 * useFavouritesViewModel - Exposes favourite games and request state.
 */
function useFavouritesViewModel() {
  const { user } = useContext(AuthContext)
  const [state, setState] = useState(favouritesModel.getState())
  const userId = user?.uid

  const refreshFavourites = useCallback(async () => {
    if (!userId) {
      favouritesModel.resetState()
      return
    }

    try {
      await favouritesModel.loadFavourites(userId)
    } catch {
      // The Model stores a safe user-facing error.
    }
  }, [userId])

  useEffect(() => {
    const unsubscribe = favouritesModel.subscribe(() => {
      setState(favouritesModel.getState())
    })

    void refreshFavourites()

    return unsubscribe
  }, [refreshFavourites])

  const addFavourite = useCallback(
    async (game) => {
      if (!userId) {
        favouritesModel.setState({
          status: 'error',
          error: 'You must be signed in to manage favourites.',
        })
        return
      }

      favouritesModel.setState({ status: 'loading', error: null })

      try {
        await favouritesModel.addFavourite(userId, game)
        await refreshFavourites()
      } catch {
        favouritesModel.setState({
          status: 'error',
          error: 'Unable to add favourite.',
        })
      }
    },
    [refreshFavourites, userId],
  )

  const removeFavourite = useCallback(
    async (gameId) => {
      if (!userId) {
        favouritesModel.setState({
          status: 'error',
          error: 'You must be signed in to manage favourites.',
        })
        return
      }

      favouritesModel.setState({ status: 'loading', error: null })

      try {
        await favouritesModel.removeFavourite(userId, gameId)
        await refreshFavourites()
      } catch {
        favouritesModel.setState({
          status: 'error',
          error: 'Unable to remove favourite.',
        })
      }
    },
    [refreshFavourites, userId],
  )

  return {
    favourites: state.favourites,
    loading: state.status === 'loading',
    error: state.error,
    addFavourite,
    removeFavourite,
    refreshFavourites,
  }
}

export default useFavouritesViewModel
