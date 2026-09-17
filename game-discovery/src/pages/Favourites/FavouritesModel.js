import {
  addFavourite as addFavouriteToService,
  getFavourites,
  removeFavourite as removeFavouriteFromService,
} from '../../services/favouritesService.js'

const initialFavouritesState = {
  favourites: [],
  status: 'idle',
  error: null,
}

/**
 * FavouritesModel - Holds favourite games and coordinates page data operations.
 */
class FavouritesModel {
  constructor() {
    this.state = { ...initialFavouritesState }
    this.subscribers = []
  }

  subscribe(listener) {
    this.subscribers.push(listener)
    return () => this.unsubscribe(listener)
  }

  unsubscribe(listener) {
    this.subscribers = this.subscribers.filter((subscriber) => subscriber !== listener)
  }

  notify() {
    this.subscribers.forEach((listener) => listener())
  }

  getState() {
    return { ...this.state }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState }
    this.notify()
  }

  async loadFavourites(userId) {
    this.setState({ status: 'loading', error: null })

    try {
      const favourites = await getFavourites(userId)

      this.setState({
        status: 'loaded',
        favourites: Object.values(favourites),
        error: null,
      })
    } catch {
      const error = 'Unable to load favourites.'
      this.setState({ status: 'error', error })
      throw new Error(error)
    }
  }

  async addFavourite(userId, game) {
    try {
      await addFavouriteToService(userId, game)
      const favourites = await getFavourites(userId)

      this.setState({
        status: 'loaded',
        favourites: Object.values(favourites),
        error: null,
      })
    } catch {
      const error = 'Unable to add favourite.'
      this.setState({ error })
      throw new Error(error)
    }
  }

  async removeFavourite(userId, gameId) {
    try {
      await removeFavouriteFromService(userId, gameId)
      const favourites = await getFavourites(userId)

      this.setState({
        status: 'loaded',
        favourites: Object.values(favourites),
        error: null,
      })
    } catch {
      const error = 'Unable to remove favourite.'
      this.setState({ error })
      throw new Error(error)
    }
  }

  resetState() {
    this.state = { ...initialFavouritesState }
    this.notify()
  }
}

const favouritesModel = new FavouritesModel()
export default favouritesModel
