import { useEffect, useState } from 'react';
import { usePwaInstall, useOnlineStatus } from '../hooks/usePwa';

const DISMISS_KEY = 'promptvault_install_dismissed';
const DISMISS_DAYS = 7; // Re-prompt after this many days

/**
 * Subtle install banner shown to first-time visitors. We auto-dismiss the
 * prompt for a week after the user dismisses it to avoid being annoying.
 */
export default function InstallPrompt() {
  const { canInstall, prompt } = usePwaInstall();
  const online = useOnlineStatus();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canInstall) return;

    let dismissedAt: number | null = null;
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw) dismissedAt = parseInt(raw, 10);
    } catch {
      /* ignore */
    }

    const oneWeek = DISMISS_DAYS * 24 * 60 * 60 * 1000;
    if (dismissedAt && Date.now() - dismissedAt < oneWeek) return;

    // Small delay so the banner doesn't fight the splash
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [canInstall]);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  const handleInstall = async () => {
    const accepted = await prompt();
    if (accepted) setVisible(false);
  };

  if (!visible || !online) return null;

  return (
    <div
      role="dialog"
      aria-label="Install PromptVault"
      className="fixed left-3 right-3 bottom-24 z-[55]
                 bg-surface-900 border border-surface-700
                 rounded-2xl p-4 shadow-2xl
                 flex items-start gap-3 animate-slide-up
                 sm:left-auto sm:right-4 sm:max-w-sm"
    >
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
        }}
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-surface-50 text-sm">Install PromptVault</p>
        <p className="text-xs text-surface-400 mt-0.5 leading-snug">
          Add to your home screen for one-tap access — works offline.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleInstall}
            className="bg-accent text-white text-xs font-semibold rounded-lg px-3 py-2 min-h-touch active:scale-95"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-surface-400 text-xs font-medium px-3 py-2 min-h-touch active:bg-surface-800 rounded-lg"
          >
            Not now
          </button>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="text-surface-500 hover:text-surface-300 p-1 -mt-1 -mr-1 min-h-touch min-w-touch flex items-center justify-center"
        aria-label="Close"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
