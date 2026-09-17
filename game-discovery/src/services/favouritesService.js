import { get, ref, remove, set } from 'firebase/database'
import { database } from './firebase.js'

function requireIdentifier(value, label) {
  const identifier = String(value ?? '').trim()

  if (!identifier || !/^[A-Za-z0-9_-]+$/.test(identifier)) {
    throw new Error(`${label} is required.`)
  }

  return identifier
}

function favouritesPath(userId) {
  return `favourites/${requireIdentifier(userId, 'User ID')}`
}

function handleDatabaseError(operation) {
  return new Error(`Unable to ${operation} favourites. Please try again.`)
}

/**
 * Retrieve all favourites for a Firebase user.
 *
 * @param {string} userId - Authenticated Firebase UID.
 * @returns {Promise<Object>} Favourites keyed by game ID.
 */
export async function getFavourites(userId) {
  const path = favouritesPath(userId)

  try {
    const snapshot = await get(ref(database, path))
    return snapshot.val() || {}
  } catch {
    throw handleDatabaseError('load')
  }
}

/**
 * Add a game to a Firebase user's favourites.
 *
 * @param {string} userId - Authenticated Firebase UID.
 * @param {Object} game - Game data to store.
 * @returns {Promise<void>}
 */
export async function addFavourite(userId, game) {
  if (!game || typeof game !== 'object') {
    throw new Error('Game is required.')
  }

  const path = favouritesPath(userId)
  const gameId = requireIdentifier(game?.id, 'Game ID')

  const favourite = {
    id: gameId,
    name: typeof game.name === 'string' ? game.name : '',
    background_image:
      typeof game.background_image === 'string' ? game.background_image : '',
  }

  try {
    await set(ref(database, `${path}/${gameId}`), favourite)
  } catch {
    throw handleDatabaseError('save')
  }
}

/**
 * Remove a game from a Firebase user's favourites.
 *
 * @param {string} userId - Authenticated Firebase UID.
 * @param {string|number} gameId - Game identifier.
 * @returns {Promise<void>}
 */
export async function removeFavourite(userId, gameId) {
  const path = favouritesPath(userId)
  const identifier = requireIdentifier(gameId, 'Game ID')

  try {
    await remove(ref(database, `${path}/${identifier}`))
  } catch {
    throw handleDatabaseError('remove')
  }
}
