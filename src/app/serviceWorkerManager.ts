/**
 * Service Worker Manager
 * Handles registration and lifecycle of the service worker
 */

export function registerServiceWorker() {
  // Check if service workers are supported
  if (!navigator.serviceWorker) {
    console.log('Service Workers not supported in this browser');
    return;
  }

  // Register the service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker registered successfully:', registration);

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
              console.log(
                'New Service Worker available - ready to be activated',
              );
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
