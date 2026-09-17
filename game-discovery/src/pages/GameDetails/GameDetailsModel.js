import { fetchGameById } from '../../services/gameService.js'

const initialGameDetailsState = {
  game: null,
  status: 'idle',
  error: null,
}

/**
 * GameDetailsModel - Retrieves and stores details for one game.
 */
class GameDetailsModel {
  constructor() {
    this.state = { ...initialGameDetailsState }
    this.subscribers = []
    this.requestId = 0
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

  async loadGame(gameId) {
    if (gameId === undefined || gameId === null || String(gameId).trim() === '') {
      this.requestId += 1
      this.setState({ status: 'idle', game: null, error: null })
      return
    }

    const requestId = ++this.requestId

    try {
      this.setState({ status: 'loading', game: null, error: null })
      const game = await fetchGameById(gameId)

      if (requestId !== this.requestId) return

      this.setState({
        status: 'loaded',
        game,
        error: null,
      })
    } catch {
      if (requestId !== this.requestId) return

      this.setState({
        status: 'error',
        game: null,
        error: 'Failed to load game details.',
      })
    }
  }

  resetState() {
    this.state = { ...initialGameDetailsState }
    this.notify()
  }
}

const gameDetailsModel = new GameDetailsModel()
export default gameDetailsModel
