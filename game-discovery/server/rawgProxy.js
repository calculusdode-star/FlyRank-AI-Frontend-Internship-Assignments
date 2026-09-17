import { readFileSync } from 'node:fs'
import { URL } from 'node:url'

const RAWG_API_BASE_URL = 'https://api.rawg.io/api'
const SAFE_PATH = /^\/games(?:\/[^/]+)?$/
const REQUEST_TIMEOUT_MS = 10000
const ALLOWED_QUERY_PARAMETERS = new Set([
  'genres',
  'ordering',
  'page',
  'page_size',
  'platforms',
  'search',
])
const ALLOWED_ORDERING = new Set([
  '-rating',
  '-released',
  'name',
  'released',
])

function getRawgPath(requestPathname) {
  if (requestPathname.startsWith('/api/rawg/')) {
    return requestPathname.replace(/^\/api\/rawg/, '')
  }

  if (requestPathname.startsWith('/api/')) {
    return requestPathname.replace(/^\/api/, '')
  }

  return requestPathname
}

function readLocalEnvironment() {
  try {
    return readFileSync(new URL('../.env', import.meta.url), 'utf8')
  } catch {
    return ''
  }
}

function getFileEnvironmentValue(name) {
  const line = readLocalEnvironment()
    .split(/\r?\n/)
    .map((entry) => entry.replace(/^\uFEFF/, '').trim())
    .find((entry) => {
      if (!entry || entry.startsWith('#')) return false
      const separatorIndex = entry.indexOf('=')
      return separatorIndex > 0 && entry.slice(0, separatorIndex).trim() === name
    })

  if (!line) return ''

  const value = line.slice(line.indexOf('=') + 1).trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

export function getRawgApiKey(environment = process.env) {
  const configuredKey =
    typeof environment.RAWG_API_KEY === 'string'
      ? environment.RAWG_API_KEY
      : getFileEnvironmentValue('RAWG_API_KEY')
  const normalizedKey = configuredKey.trim().replace(
    /^(["'])(.*)\1$/,
    '$2',
  )

  if (
    !normalizedKey ||
    /^(your([_ -].*)?|replace([_ -].*)?|placeholder|change[-_ ]?me)$/i.test(
      normalizedKey,
    )
  ) {
    return null
  }

  return normalizedKey
}

function getSafeApiError(status) {
  if (status === 401 || status === 403) {
    return {
      code: 'API_ERROR',
      message: 'RAWG API authentication failed. Check the server configuration.',
    }
  }

  if (status === 404) {
    return {
      code: 'API_ERROR',
      message: 'The requested game could not be found.',
    }
  }

  if (status === 429) {
    return {
      code: 'API_ERROR',
      message: 'RAWG API request limit reached. Please try again later.',
    }
  }

  if (status >= 500) {
    return {
      code: 'API_ERROR',
      message: 'RAWG API is temporarily unavailable. Please try again later.',
    }
  }

  return {
    code: 'API_ERROR',
    message: 'RAWG API request failed. Please try again.',
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

function getValidatedParameters(requestUrl) {
  const params = new URLSearchParams()

  for (const [name, value] of requestUrl.searchParams) {
    if (!ALLOWED_QUERY_PARAMETERS.has(name)) {
      continue
    }

    if (name === 'search') {
      const search = value.trim()
      if (search.length > 100) return null
      if (search) params.set(name, search)
      continue
    }

    if (name === 'page' || name === 'page_size') {
      if (!/^\d+$/.test(value)) return null
      const numericValue = Number(value)
      const maximum = name === 'page_size' ? 40 : 500
      if (numericValue < 1 || numericValue > maximum) return null
      params.set(name, String(numericValue))
      continue
    }

    if (name === 'genres' || name === 'platforms') {
      if (!/^\d+(,\d+)*$/.test(value)) return null
      params.set(name, value)
      continue
    }

    if (name === 'ordering') {
      if (!ALLOWED_ORDERING.has(value)) return null
      params.set(name, value)
    }
  }

  return params
}

function removeApiKeysFromUrls(value) {
  if (Array.isArray(value)) {
    return value.map(removeApiKeysFromUrls)
  }

  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && value.includes('key=')) {
      try {
        const url = new URL(value)
        url.searchParams.delete('key')
        return url.toString()
      } catch {
        return value
      }
    }
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      removeApiKeysFromUrls(entryValue),
    ]),
  )
}

export function createRawgProxy({ environment = process.env, fetchImpl = fetch } = {}) {
  return async function rawgProxy(request, response) {
    const requestUrl = new URL(request.url || '/', 'http://localhost')
    const rawgPath = getRawgPath(requestUrl.pathname)

    if (request.method !== 'GET' || !SAFE_PATH.test(rawgPath)) {
      sendJson(response, 404, {
        code: 'NOT_FOUND',
        message: 'The requested game service endpoint was not found.',
      })
      return
    }

    const apiKey = getRawgApiKey(environment)
    if (!apiKey) {
      sendJson(response, 503, {
        code: 'MISSING_CONFIGURATION',
        message: 'The game service is not configured. Please try again later.',
      })
      return
    }

    const params = getValidatedParameters(requestUrl)
    if (!params) {
      sendJson(response, 400, {
        code: 'INVALID_REQUEST',
        message: 'The game request contains invalid search or filter parameters.',
      })
      return
    }

    params.set('key', apiKey)

    let rawgResponse
    const abortController = new AbortController()
    const timeout = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS)
    try {
      rawgResponse = await fetchImpl(
        `${RAWG_API_BASE_URL}${rawgPath}?${params.toString()}`,
        {
          headers: { Accept: 'application/json' },
          signal: abortController.signal,
        },
      )
    } catch {
      sendJson(response, 503, {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to RAWG. Please try again later.',
      })
      return
    } finally {
      clearTimeout(timeout)
    }

    if (!rawgResponse.ok) {
      sendJson(response, rawgResponse.status, getSafeApiError(rawgResponse.status))
      return
    }

    try {
      const data = await rawgResponse.json()
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Invalid response')
      }
      sendJson(response, 200, removeApiKeysFromUrls(data))
    } catch {
      sendJson(response, 502, {
        code: 'INVALID_RESPONSE',
        message: 'RAWG returned an invalid response. Please try again later.',
      })
    }
  }
}
