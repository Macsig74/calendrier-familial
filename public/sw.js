const CACHE_NAME = 'famille-v1'

const STATIC_ASSETS = [
  '/manifest.json',
  '/icon.svg',
]

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

  // Skip Next.js internals and API routes
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) {
    return
  }

  // Network-first for pages, cache-first for static assets
  const isStatic = url.pathname.match(/\.(png|svg|ico|woff2?|css|js)$/)

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached
        return fetch(event.request).then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          return response
        })
      })
    )
  } else {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request))
    )
  }
})

self.addEventListener('push', event => {
  if (!event.data) return
  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'Famille', body: event.data.text() }
  }

  const options = {
    body: data.body || '',
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: { url: data.url || '/taches' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: data.tag || 'famille-notif',
    renotify: true,
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Famille', options)
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/taches'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
