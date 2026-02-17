---
name: progressive-web-app-builder
description: Builds Progressive Web Apps (PWAs) with offline support, push notifications, install prompts, and native-like experiences. Covers service workers, caching strategies, and Web APIs. Use when creating installable web apps or adding offline functionality.
---

# Progressive Web App Builder

## Manifest

```json
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

## Register Service Worker

```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

## Service Worker Dasar

```javascript
const CACHE_NAME = 'app-v1';
const urlsToCache = ['/', '/styles.css', '/app.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

## Install Prompt

```typescript
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

async function showInstallPrompt() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
}
```

## Push Notification (Ringkas)

```typescript
const permission = await Notification.requestPermission();
if (permission === 'granted') {
  // subscribe to push di service worker
}
```

## Checklist PWA

- [ ] HTTPS aktif  
- [ ] manifest.json terpasang  
- [ ] service worker jalan  
- [ ] offline fallback page  
- [ ] ikon 192/512px  
- [ ] Lighthouse PWA score hijau
