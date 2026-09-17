import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRawgProxy } from './rawgProxy.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const isProduction = process.argv.includes('--preview')
const preferredPort = Number(process.env.PORT || (isProduction ? 4173 : 5173))
const host = process.env.HOST || (isProduction ? '0.0.0.0' : '127.0.0.1')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function serveStatic(request, response) {
  const distRoot = join(root, 'dist')
  let requestedPath

  try {
    requestedPath = resolve(
      join(distRoot, decodeURIComponent(new URL(request.url, 'http://localhost').pathname)),
    )
  } catch {
    response.writeHead(400)
    response.end('Invalid request path.')
    return
  }

  const relativePath = relative(distRoot, requestedPath)
  const isInsideDist =
    relativePath === '' ||
    (!relativePath.startsWith('..') && !relativePath.includes(`..${resolve('/')}`))
  const filePath =
    isInsideDist &&
    existsSync(requestedPath) &&
    statSync(requestedPath).isFile()
      ? requestedPath
      : join(distRoot, 'index.html')

  if (!existsSync(filePath)) {
    response.writeHead(404)
    response.end('Application build not found. Run npm run build first.')
    return
  }

  const contentType =
    contentTypes[extname(filePath).toLowerCase()] ||
    'application/octet-stream'

  response.writeHead(200, {
    'Content-Type': contentType,
  })
  createReadStream(filePath).pipe(response)
}

function listenWithFallback(server, port, host) {
  return new Promise((resolve, reject) => {
    const tries = 20

    const tryListen = (candidatePort, attempt = 0) => {
      const onListening = () => {
        server.removeListener('error', onError)
        resolve(candidatePort)
      }

      const onError = (error) => {
        server.removeListener('listening', onListening)

        if (error.code === 'EADDRINUSE' && attempt < tries) {
          console.warn(
            `Port ${candidatePort} is in use. Retrying on port ${candidatePort + 1}.`,
          )
          tryListen(candidatePort + 1, attempt + 1)
          return
        }

        reject(error)
      }

      server.once('error', onError)
      server.once('listening', onListening)
      server.listen(candidatePort, host)
    }

    tryListen(port)
  })
}

function setSecurityHeaders(response) {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Frame-Options', 'DENY')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.setHeader(
    'Permissions-Policy',
    'camera=(), geolocation=(), microphone=()',
  )
}

function setCorsHeaders(request, response) {
  const configuredOrigin = process.env.FRONTEND_ORIGIN
  const requestOrigin = request.headers.origin

  if (configuredOrigin && requestOrigin === configuredOrigin) {
    response.setHeader('Access-Control-Allow-Origin', configuredOrigin)
    response.setHeader('Vary', 'Origin')
  }
}

async function start() {
  const rawgProxy = createRawgProxy()
  let vite

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    })
  }

  const server = createServer((request, response) => {
    setSecurityHeaders(response)
    setCorsHeaders(request, response)

    if (request.url?.startsWith('/api/')) {
      rawgProxy(request, response)
      return
    }

    if (vite) {
      vite.middlewares(request, response, () => {})
    } else {
      serveStatic(request, response)
    }
  })

  const port = await listenWithFallback(server, preferredPort, host)
  const displayHost = host === '0.0.0.0' ? 'localhost' : host
  console.log(`Game Discovery server running at http://${displayHost}:${port}`)
}

start().catch(() => {
  console.error('Unable to start the application server.')
  process.exitCode = 1
})
