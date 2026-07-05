const CACHE_NAME = 'tlj-v1'
const STATIC_CACHE = 'tlj-static-v1'
const FONT_CACHE = 'tlj-fonts-v1'

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== FONT_CACHE && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Fonts: cache-first, long TTL
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone())
            return response
          })
        })
      )
    )
    return
  }

  // Google Fonts stylesheets: stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetching = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone())
            return response
          })
          return cached || fetching
        })
      )
    )
    return
  }

  // Google Fonts files: cache-first
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone())
            return response
          })
        })
      )
    )
    return
  }

  // Navigation: network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/'))
        )
    )
    return
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const fetching = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone())
          return response
        })
        return cached || fetching
      })
    )
  )
})
