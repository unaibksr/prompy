import { memo, useEffect } from 'react';
import { usePromptStore } from '../stores/usePromptStore';

/**
 * Handles the Share Target API.
 * When the app is launched via a share action, query params contain
 * title, text, and/or url from the shared content.
 */
function ShareHandlerBase() {
  const setActiveTab = usePromptStore((s) => s.setActiveTab);
  const setShareText = usePromptStore((s) => s.setShareText);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedTitle = params.get('title');
    const sharedText = params.get('text');
    const sharedUrl = params.get('url');

    if (sharedText || sharedUrl) {
      // Build the share content
      let body = sharedText || '';
      if (sharedUrl) {
        body += body ? '\n\n' : '';
        body += sharedUrl;
      }
      if (sharedTitle) {
        body = `# ${sharedTitle}\n\n${body}`;
      }

      // Set share text in store and switch to Add tab
      setShareText(body);
      setActiveTab('add');

      // Clean the URL
      window.history.replaceState({}, document.title, '/');
    }
  }, [setActiveTab, setShareText]);

  return null;
}

export default memo(ShareHandlerBase);
