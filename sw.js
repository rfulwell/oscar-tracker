// Service Worker for Awards Tracker PWA
//
// SW_VERSION is replaced with the commit SHA by the deploy workflow, so every
// deploy changes this file's bytes. That is what makes installed clients pick
// up a new service worker - never rely on bumping it by hand.
//
// This file must stay at /sw.js: every installed client checks that exact URL
// for updates. Caches only hold copies of app files; user data lives in
// localStorage and is never touched here.
const SW_VERSION = 'dev';

// Every cache this worker owns starts with this prefix. PR previews run on the
// same origin as the live site and share its caches, so the preview build
// rewrites it (.github/scripts/build_previews.py) to keep them apart.
const CACHE_PREFIX = 'awards-tracker-';
const CACHE_NAME = `${CACHE_PREFIX}v${SW_VERSION}`;

// Google Fonts never change at a given URL, so they live in their own cache
// that survives app updates.
const FONT_CACHE = `${CACHE_PREFIX}fonts`;

// How long to wait for the network before falling back to a cached copy
const NETWORK_TIMEOUT_MS = 3000;

const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'style.css',
    'app.js',
    'manifest.json',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/netflix.svg',
    'icons/max.svg',
    'icons/appletv.svg',
    'icons/peacock.svg',
    'icons/hulu.svg',
    'icons/disneyplus.svg'
];

// Respond to version queries from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_VERSION') {
        const port = event.ports[0];
        if (port) {
            port.postMessage({ type: 'SW_VERSION', version: SW_VERSION });
        }
    }
});

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app assets');
                // Bypass the HTTP cache so a new version never precaches stale files
                return cache.addAll(ASSETS_TO_CACHE.map((url) => new Request(url, { cache: 'reload' })));
            })
            .then(() => {
                // Activate immediately
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up this worker's old versions. Other caches on the
// origin (a PR preview's, or the live site's when this is a preview) are left alone.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith(`${CACHE_PREFIX}v`) && name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => {
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Cache key ignores the query string, so every share link (/?p=...&name=...)
// is served from the single cached copy of the app.
function cacheKeyFor(url) {
    return url.origin + url.pathname;
}

// Pages, scripts, styles and data change with every deploy
function isAppFile(request, url) {
    return request.mode === 'navigate' || /\.(html|js|css|json)$/.test(url.pathname);
}

function isCacheable(response) {
    return response && response.ok && response.type === 'basic' && !response.redirected;
}

// Network first, falling back to the cache when offline or slow.
// A slow response that loses the race still updates the cache.
function networkFirst(event, cacheKey) {
    const request = event.request;
    // Navigation requests can't be re-created with options; revalidate everything else
    const networkRequest = request.mode === 'navigate' ? request : new Request(request, { cache: 'no-cache' });

    const network = fetch(networkRequest).then((response) => {
        if (isCacheable(response)) {
            const responseToCache = response.clone();
            event.waitUntil(
                caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, responseToCache))
            );
        }
        return response;
    });
    event.waitUntil(network.catch(() => {}));

    const cached = () => caches.match(cacheKey)
        .then((response) => response || (request.mode === 'navigate' ? caches.match('index.html') : undefined));

    return new Promise((resolve, reject) => {
        let settled = false;
        const settle = (response) => {
            if (!settled && response) {
                settled = true;
                resolve(response);
            }
        };

        const timer = setTimeout(() => cached().then(settle), NETWORK_TIMEOUT_MS);

        network
            .then((response) => {
                clearTimeout(timer);
                settle(response);
            })
            .catch((error) => {
                clearTimeout(timer);
                cached().then((response) => {
                    if (response) {
                        settle(response);
                    } else if (!settled) {
                        settled = true;
                        reject(error);
                    }
                });
            });
    });
}

// Cache first, for files that rarely change (icons, splash screens)
function cacheFirst(event, cacheKey) {
    return caches.match(cacheKey).then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse;
        }
        return fetch(event.request).then((response) => {
            if (isCacheable(response)) {
                const responseToCache = response.clone();
                event.waitUntil(
                    caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, responseToCache))
                );
            }
            return response;
        });
    });
}

// Google Fonts: serve from cache when present, refresh in the background
function fontCache(event) {
    return caches.open(FONT_CACHE).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
            const network = fetch(event.request).then((response) => {
                // The stylesheet is loaded without CORS, so its response is opaque
                if (response && (response.ok || response.type === 'opaque')) {
                    event.waitUntil(cache.put(event.request, response.clone()));
                }
                return response;
            });
            if (cachedResponse) {
                event.waitUntil(network.catch(() => {}));
                return cachedResponse;
            }
            return network;
        })
    );
}

self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(fontCache(event));
        return;
    }

    // Leave all other cross-origin requests (streaming links, etc.) to the browser
    if (url.origin !== self.location.origin) {
        return;
    }

    const cacheKey = cacheKeyFor(url);
    if (isAppFile(event.request, url)) {
        event.respondWith(networkFirst(event, cacheKey));
    } else {
        event.respondWith(cacheFirst(event, cacheKey));
    }
});
