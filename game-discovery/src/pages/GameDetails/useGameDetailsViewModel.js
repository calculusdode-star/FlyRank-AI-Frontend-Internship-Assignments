import { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import favouritesModel from '../Favourites/FavouritesModel.js'
import gameDetailsModel from './GameDetailsModel.js'

/**
 * useGameDetailsViewModel - Exposes one game's details to the View.
 */
function useGameDetailsViewModel() {
  const { gameId } = useParams()
  const { user, loading: authLoading } = useContext(AuthContext)
  const userId = user?.uid
  const [state, setState] = useState(gameDetailsModel.getState())
  const [favouritesState, setFavouritesState] = useState(
    favouritesModel.getState(),
  )
  const [favouriteAction, setFavouriteAction] = useState({
    loading: false,
    error: null,
    success: null,
  })

  useEffect(() => {
    const unsubscribe = gameDetailsModel.subscribe(() => {
      setState(gameDetailsModel.getState())
    })

    if (gameId && gameId.trim()) {
      gameDetailsModel.loadGame(gameId)
    } else {
      gameDetailsModel.resetState()
    }

    return unsubscribe
  }, [gameId])

  useEffect(() => {
    const unsubscribe = favouritesModel.subscribe(() => {
      setFavouritesState(favouritesModel.getState())
    })

    if (!authLoading && userId) {
      favouritesModel.loadFavourites(userId).catch(() => {
        setFavouriteAction({
          loading: false,
          error: 'Unable to load favourite status.',
          success: null,
        })
      })
    } else if (!authLoading) {
      favouritesModel.resetState()
    }

    return unsubscribe
  }, [authLoading, userId])

  const addToFavourites = useCallback(async () => {
    if (!userId || !state.game) {
      return
    }

    setFavouriteAction({ loading: true, error: null, success: null })

    try {
      await favouritesModel.addFavourite(userId, state.game)
      setFavouriteAction({
        loading: false,
        error: null,
        success: 'Game added to your favourites.',
      })
    } catch {
      setFavouriteAction({
        loading: false,
        error: 'Unable to add game to favourites.',
        success: null,
      })
    }
  }, [state.game, userId])

  const removeFromFavourites = useCallback(async () => {
    if (!userId || !state.game) {
      return
    }

    setFavouriteAction({ loading: true, error: null, success: null })

    try {
      await favouritesModel.removeFavourite(userId, state.game.id)
      setFavouriteAction({
        loading: false,
        error: null,
        success: 'Game removed from your favourites.',
      })
    } catch {
      setFavouriteAction({
        loading: false,
        error: 'Unable to remove game from favourites.',
        success: null,
      })
    }
  }, [state.game, userId])

  const { game, status, error } = state
  const isFavourite = Boolean(
    game &&
      favouritesState.favourites.some(
        (favourite) => String(favourite.id) === String(game.id),
      ),
  )

  return {
    game,
    loading: status === 'loading',
    error,
    empty: status === 'idle' || (status === 'loaded' && !game),
    user,
    authLoading,
    isFavourite,
    addToFavourites,
    removeFromFavourites,
    favouriteLoading: favouriteAction.loading,
    favouriteError: favouriteAction.error,
    favouriteSuccess: favouriteAction.success,
  }
}

export default useGameDetailsViewModel
