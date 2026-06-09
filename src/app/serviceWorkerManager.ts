/**
 * Service Worker Manager
 * Handles registration and lifecycle of the service worker
 */

const isDev = import.meta.env.DEV;

function log(message: string, data?: unknown) {
  if (isDev || data instanceof Error) {
    if (data instanceof Error) {
      console.error(message, data);
    } else {
      console.log(message, data);
    }
  }
}

export function registerServiceWorker() {
  // Check if service workers are supported
  if (!navigator.serviceWorker) {
    log('Service Workers not supported in this browser');
    return;
  }

  // Register the service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        log('Service Worker registered successfully:', registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New service worker available - ready to be used
              log('New Service Worker available - ready to be activated');
            }
          });
        });
      },
      (error) => {
        console.error('Service Worker registration failed:', error);
      },
    );
  });
}
