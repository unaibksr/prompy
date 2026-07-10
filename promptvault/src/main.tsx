import React, { startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootEl);

// Use startTransition for the initial render so it doesn't block user
// input on slow devices while React reconciles the tree.
startTransition(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

// Mark the document as ready ASAP so we can use CSS for any post-hydration
// styles (also helps the inline splash to fade smoothly).
requestAnimationFrame(() => {
  document.documentElement.dataset.appReady = 'true';
});
