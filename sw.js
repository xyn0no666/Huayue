// Service Worker for 华悦园林 — offline cache
const CACHE_NAME = 'huayue-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/product-detail.html',
  '/brand.html',
  '/support.html',
  '/contact.html',
  '/dealer.html',
  '/checkout.html',
  '/privacy.html',
  '/404.html',
  '/guide-1.html',
  '/guide-2.html',
  '/guide-3.html',
  '/guide-4.html',
  '/blower-3d.html',
  '/chainsaw-3d.html',
  '/css/base.css',
  '/css/components.css',
  '/css/products.css',
  '/css/product-detail.css',
  '/css/brand.css',
  '/css/support.css',
  '/css/guide.css',
  '/css/dealer.css',
  '/css/checkout.css',
  '/js/i18n.js',
  '/js/i18n-data.js',
  '/js/core.js',
  '/js/data.js',
  '/js/cart.js',
  '/js/products.js',
  '/js/product-detail.js',
  '/js/brand.js',
  '/js/support.js',
  '/js/guide.js',
  '/js/dealer.js',
  '/js/checkout.js',
  '/js/contact.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];

// Install — precache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        // Don't fail if some assets are unavailable
        console.warn('SW precache partial failure:', err.message);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — network-first for HTML, cache-first for static assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return;

  // HTML pages — Network-first, fallback to cache
  if (request.headers.get('Accept') && request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => {
        return caches.match(request).then(cached => cached || caches.match('/404.html'));
      })
    );
    return;
  }

  // Static assets (CSS, JS, images, fonts) — Cache-first, network update
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)$/i) ||
      url.hostname === 'fonts.googleapis.com' ||
      url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => null);
        return cached || fetchPromise;
      })
    );
    return;
  }
});
