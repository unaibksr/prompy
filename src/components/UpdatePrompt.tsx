import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/usePwa';

/**
 * In-app notification that a new service worker has been downloaded.
 */
export default function UpdatePrompt() {
  const online = useOnlineStatus();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, reg) {
      if (reg && online) {
        setInterval(() => {
          reg.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
      void swUrl;
    },
    onRegisterError() {},
  });

  const [dismissedOffline, setDismissedOffline] = useState(false);

  useEffect(() => {
    if (offlineReady) {
      const t = setTimeout(() => setOfflineReady(false), 6000);
      return () => clearTimeout(t);
    }
  }, [offlineReady, setOfflineReady]);

  if (needRefresh) {
    return (
      <div
        role="alert"
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60]
                   bg-accent/90 text-white border border-accent-400/30
                   rounded-xl px-4 py-3 shadow-soft
                   flex items-center gap-3 text-sm font-medium
                   animate-slide-up max-w-[92vw] backdrop-blur-xl"
      >
        <span>New version available</span>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-white text-accent font-semibold rounded-lg px-3 py-1.5 min-h-touch active:scale-95 transition-all"
        >
          Reload
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-white/70 hover:text-white min-h-touch px-2 transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    );
  }

  if (offlineReady && !dismissedOffline) {
    return (
      <div
        role="status"
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60]
                   bg-surface-800/90 text-surface-100 border border-surface-700/50
                   rounded-xl px-4 py-3 shadow-soft
                   flex items-center gap-3 text-sm font-medium
                   animate-slide-up max-w-[92vw] backdrop-blur-xl"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Ready to work offline</span>
        <button
          onClick={() => {
            setOfflineReady(false);
            setDismissedOffline(true);
          }}
          className="text-surface-400 hover:text-surface-100 ml-2 min-h-touch px-2 transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
}