export class RawgApiError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'RawgApiError'
    this.code = code
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

async function request(path, searchParams, resourceName) {
  let response
  try {
    const params = new URLSearchParams(searchParams)
    const query = params.toString()
    response = await fetch(`${API_BASE_URL}/api${path}${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
  } catch {
    throw new RawgApiError(
      `Unable to connect to RAWG while loading ${resourceName}. Check your network connection and try again.`,
      'NETWORK_ERROR',
    )
  }

  if (!response || typeof response.ok !== 'boolean') {
    throw new RawgApiError(
      `The game service returned an invalid response while loading ${resourceName}.`,
      'INVALID_RESPONSE',
    )
  }

  if (!response.ok) {
    let errorBody
    try {
      errorBody = await response.json()
    } catch {
      errorBody = null
    }

    throw new RawgApiError(
      typeof errorBody?.message === 'string'
        ? errorBody.message
        : `Unable to load ${resourceName}. Please try again.`,
      errorBody?.code || 'API_ERROR',
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new RawgApiError(
      `The game service returned an invalid response while loading ${resourceName}.`,
      'INVALID_RESPONSE',
    )
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new RawgApiError(
      `The game service returned an invalid response while loading ${resourceName}.`,
      'INVALID_RESPONSE',
    )
  }

  return data
}

function addFilterParams(searchParams, filters = {}) {
  const { genre, platform, ordering } = filters

  if (genre) {
    searchParams.genres = String(genre)
  }

  if (platform) {
    searchParams.platforms = String(platform)
  }

  if (ordering) {
    searchParams.ordering = String(ordering)
  }
}

/**
 * Fetches games from the RAWG Video Games Database API.
 *
 * @param {string} query - Search query used to filter games.
 * @param {Object} options - Additional request options.
 * @returns {Promise<Object>} RAWG response data.
 */
async function fetchGames(query = '', options = {}) {
  const { page = 1, pageSize = 12, filters = {} } = options
  const searchParams = {
    page_size: String(pageSize),
  }

  if (page > 1) {
    searchParams.page = String(page)
  }

  if (query && query.trim()) {
    searchParams.search = query.trim()
  }

  addFilterParams(searchParams, filters)

  return request('/games', searchParams, 'games')
}

/**
 * Fetches one game from the RAWG Video Games Database API.
 *
 * @param {string|number} gameId - RAWG game identifier.
 * @returns {Promise<Object>} RAWG game details.
 */
export async function fetchGameById(gameId) {
  const normalizedGameId = String(gameId ?? '').trim()

  if (!normalizedGameId) {
    throw new RawgApiError('A game ID is required.', 'INVALID_GAME_ID')
  }

  return request(
    `/games/${encodeURIComponent(normalizedGameId)}`,
    {},
    'game details',
  )
}

export default fetchGames
