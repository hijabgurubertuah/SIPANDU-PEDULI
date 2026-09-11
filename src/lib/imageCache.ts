// Utility for ultra-fast local caching of uploaded logos and images (CacheStorage + LocalStorage)
// and dynamic updating of Favicon and PWA Web App Manifest icons.

const LOCAL_STORAGE_IMG_PREFIX = 'sipandu_img_cache_';
const CACHE_NAME = 'sipandu-img-cache-v1';

/**
 * Cache an image URL locally in CacheStorage and LocalStorage (as Base64 Data URL)
 */
export async function cacheImageLocally(url: string): Promise<string> {
  if (!url) return '';
  if (url.startsWith('data:')) {
    return url;
  }

  // 1. Check LocalStorage cache first
  const cacheKey = LOCAL_STORAGE_IMG_PREFIX + url;
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // 2. Fetch and convert to base64
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return url;

    const blob = await response.blob();
    
    // Save to CacheStorage API
    if ('caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(url, new Response(blob.slice(0), { headers: response.headers }));
      } catch (_) {}
    }

    // Convert to Base64 and store in LocalStorage for 0ms instant loading
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        try {
          // If smaller than 1.5MB, store in localStorage for instant synchronous recall
          if (base64data.length < 1500000) {
            localStorage.setItem(cacheKey, base64data);
          }
        } catch (e) {
          console.warn('LocalStorage image cache limit reached:', e);
        }
        resolve(base64data);
      };
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Could not cache image locally:', url, err);
    return url;
  }
}

/**
 * Get synchronously cached image if available, else returns the original URL
 */
export function getSyncCachedImage(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_IMG_PREFIX + url);
    if (cached) return cached;
  } catch (_) {}
  return url;
}

/**
 * Dynamically updates document favicon, apple-touch-icon, and PWA manifest with the uploaded logo
 */
export function updateDynamicFaviconAndPwa(logoUrl: string, appName: string = 'SIPANDU PEDULI') {
  if (!logoUrl) return;

  try {
    const resolvedUrl = getSyncCachedImage(logoUrl) || logoUrl;

    // 1. Update <link rel="icon">
    let linkIcon: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!linkIcon) {
      linkIcon = document.createElement('link');
      linkIcon.rel = 'icon';
      document.head.appendChild(linkIcon);
    }
    linkIcon.href = resolvedUrl;

    // 2. Update <link rel="apple-touch-icon">
    let appleIcon: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = resolvedUrl;

    // 3. Dynamically inject/update Web App Manifest with uploaded logo icons
    const dynamicManifest = {
      id: '/',
      name: `${appName} - Puskesmas Kepanjen`,
      short_name: 'SIPANDU',
      description: 'Portal Digital Puskesmas Kepanjen - Sistem Pantau Data Dukung Pelaksanaan, Dokumentasi, dan Evaluasi',
      theme_color: '#047857',
      background_color: '#047857',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: resolvedUrl,
          sizes: '192x192',
          type: resolvedUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
          purpose: 'any'
        },
        {
          src: resolvedUrl,
          sizes: '512x512',
          type: resolvedUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
          purpose: 'any'
        },
        {
          src: resolvedUrl,
          sizes: '512x512',
          type: resolvedUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
          purpose: 'maskable'
        }
      ]
    };

    const manifestBlob = new Blob([JSON.stringify(dynamicManifest)], { type: 'application/json' });
    const manifestBlobUrl = URL.createObjectURL(manifestBlob);

    let manifestLink: HTMLLinkElement | null = document.querySelector("link[rel='manifest']");
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestBlobUrl;
  } catch (e) {
    console.warn('Failed to update dynamic favicon/manifest:', e);
  }
}
