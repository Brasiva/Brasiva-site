import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

const root = resolve('dist')
const port = Number(process.env.PORT || 3000)
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end()
    return
  }

  let pathname
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  } catch {
    response.writeHead(400).end('Bad request')
    return
  }

  let file = resolve(root, `.${pathname}`)
  if (!file.startsWith(`${root}${sep}`) && file !== root) {
    response.writeHead(400).end('Bad request')
    return
  }

  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html')
    const content = await readFile(file)
    response.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(request.method === 'HEAD' ? undefined : content)
  } catch {
    try {
      const index = await readFile(resolve(root, 'index.html'))
      response.writeHead(200, { 'Content-Type': types['.html'] })
      response.end(request.method === 'HEAD' ? undefined : index)
    } catch {
      response.writeHead(503).end('Application is building. Please retry shortly.')
    }
  }
}).listen(port, '0.0.0.0')
