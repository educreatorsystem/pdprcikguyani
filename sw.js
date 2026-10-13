'use strict';
// Tukar VERSION apabila memuat naik keluaran baharu.
const VERSION = '2026-10-13-v4-pautan-buku';
const CACHE_PREFIX = `super-pdpr-static:${self.registration.scope}:`;
const CACHE_NAME = CACHE_PREFIX + VERSION;
const APP_FILES = [
    './', './index.html', './date-my.js', './pwa.js', './manifest.webmanifest',
    './assets/header-heryani.png', './assets/tailwind.js', './assets/fontawesome.css', './assets/fonts.css',
    './assets/font-0.ttf', './assets/font-1.ttf', './assets/font-2.ttf', './assets/font-3.ttf',
    './assets/webfonts/fa-solid-900.woff2', './assets/webfonts/fa-solid-900.ttf',
    './assets/webfonts/fa-regular-400.woff2', './assets/webfonts/fa-regular-400.ttf',
    './assets/webfonts/fa-brands-400.woff2', './assets/webfonts/fa-brands-400.ttf',
    './assets/webfonts/fa-v4compatibility.woff2', './assets/webfonts/fa-v4compatibility.ttf',
    './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png'
];
const APP_URLS = new Set(APP_FILES.map(file => new URL(file, self.registration.scope).href));
const INDEX_URL = new URL('./index.html', self.registration.scope).href;

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(APP_FILES.map(file => new Request(new URL(file, self.registration.scope), { cache: 'reload' })));
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
        await self.clients.claim();
    })());
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    // POST, API Google, CSV, gambar bukti dan pautan luar melalui rangkaian biasa.
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;
    if (request.mode === 'navigate') {
        if (url.href.split('?')[0] !== self.registration.scope && url.href.split('?')[0] !== INDEX_URL) return;
        event.respondWith((async () => {
            try {
                const response = await fetch(request);
                if (!response.ok) throw new Error('Navigation failed');
                // Dokumen versi semasa kekal dalam cache sehingga worker versi baharu dipasang.
                return response;
            } catch (_) {
                const cache = await caches.open(CACHE_NAME);
                return (await cache.match(INDEX_URL)) || Response.error();
            }
        })());
        return;
    }
    if (!APP_URLS.has(url.href)) return;
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
        return response;
    })());
});
