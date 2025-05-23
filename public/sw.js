
const CACHE_NAME = 'el-gato-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/src/index.css',
  '/src/main.tsx',
  '/src/App.tsx',
  '/manifest.json'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request for fetch and cache
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache if this is an API request
                if (!event.request.url.includes('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // Fallback for navigation requests if offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // If both cache and network fail, show fallback content
            if (event.request.url.indexOf('/api/') !== -1) {
              // Handle API requests when offline
              return new Response(JSON.stringify({ error: 'You are offline' }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
          });
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients as soon as active
      return self.clients.claim();
    })
  );
});

// Handle connectivity changes
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CONNECTIVITY_CHANGE') {
    // We could update cache strategies based on connectivity
    console.log('Connectivity changed:', event.data.online);
  }
});

// Send a message to all clients when coming back online
self.addEventListener('online', () => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'ONLINE_STATUS',
        online: true
      });
    });
  });
});

// Send a message to all clients when going offline
self.addEventListener('offline', () => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'ONLINE_STATUS',
        online: false
      });
    });
  });
});
