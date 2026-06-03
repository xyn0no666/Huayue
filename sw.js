// Service Worker for 华悦园林 — offline cache
const CACHE_NAME = 'huayue-v1';
const STATIC_ASSETS = [
  '/Huayue/',
  '/Huayue/index.html',
  '/Huayue/products.html',
  '/Huayue/product-detail.html',
  '/Huayue/brand.html',
  '/Huayue/support.html',
  '/Huayue/contact.html',
  '/Huayue/dealer.html',
  '/Huayue/checkout.html',
  '/Huayue/privacy.html',
  '/Huayue/404.html',
  '/Huayue/guide-1.html',
  '/Huayue/guide-2.html',
  '/Huayue/guide-3.html',
  '/Huayue/guide-4.html',
  '/Huayue/blower-3d.html',
  '/Huayue/chainsaw-3d.html',
  '/Huayue/css/base.css',
  '/Huayue/css/components.css',
  '/Huayue/css/products.css',
  '/Huayue/css/product-detail.css',
  '/Huayue/css/brand.css',
  '/Huayue/css/support.css',
  '/Huayue/css/guide.css',
  '/Huayue/css/dealer.css',
  '/Huayue/css/checkout.css',
  '/Huayue/js/i18n.js',
  '/Huayue/js/i18n-data.js',
  '/Huayue/js/core.js',
  '/Huayue/js/data.js',
  '/Huayue/js/cart.js',
  '/Huayue/js/products.js',
  '/Huayue/js/product-detail.js',
  '/Huayue/js/brand.js',
  '/Huayue/js/support.js',
  '/Huayue/js/guide.js',
  '/Huayue/js/dealer.js',
  '/Huayue/js/checkout.js',
  '/Huayue/js/contact.js',
  '/Huayue/assets/icons/icon-192.png',
  '/Huayue/assets/icons/icon-512.png',
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
        return caches.match(request).then(cached => cached || caches.match('/Huayue/404.html'));
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
