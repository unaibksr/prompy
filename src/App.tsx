import { lazy, Suspense, useEffect } from 'react';
import { usePromptStore } from './stores/usePromptStore';
import TabBar from './components/TabBar';
import LoadingScreen from './components/LoadingScreen';

// Code-split pages — each route is loaded on demand so the initial bundle
// only contains App, TabBar, and the active page's chunk.
const BrowsePage = lazy(() => import('./components/BrowsePage'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const FavoritesPage = lazy(() => import('./components/FavoritesPage'));
const AddPage = lazy(() => import('./components/AddPage'));
const ShareHandler = lazy(() => import('./components/ShareHandler'));
const UpdatePrompt = lazy(() => import('./components/UpdatePrompt'));
const InstallPrompt = lazy(() => import('./components/InstallPrompt'));

export default function App() {
  const activeTab = usePromptStore((s) => s.activeTab);
  const loadPrompts = usePromptStore((s) => s.loadPrompts);

  // Kick off initial data load once on mount
  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  return (
    <div className="min-h-screen min-h-[100dvh] relative">
      <Suspense fallback={null}>
        <ShareHandler />
      </Suspense>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <Suspense fallback={<LoadingScreen />}>
          {activeTab === 'browse' && <BrowsePage />}
          {activeTab === 'search' && <SearchPage />}
          {activeTab === 'favorites' && <FavoritesPage />}
          {activeTab === 'add' && <AddPage />}
        </Suspense>
      </main>

      <TabBar />

      <Suspense fallback={null}>
        <UpdatePrompt />
        <InstallPrompt />
      </Suspense>
    </div>
  );
}
