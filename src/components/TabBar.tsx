import { memo, type ComponentType, type SVGProps } from 'react';
import { usePromptStore } from '../stores/usePromptStore';
import type { TabId } from '../types';
import { GridIcon, SearchIcon, HeartIcon, PlusIcon } from './icons';

type AnyIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const tabs: { id: TabId; label: string; Icon: AnyIcon }[] = [
  { id: 'browse', label: 'Browse', Icon: GridIcon as AnyIcon },
  { id: 'search', label: 'Search', Icon: SearchIcon as AnyIcon },
  { id: 'favorites', label: 'Favorites', Icon: HeartIcon as AnyIcon },
  { id: 'add', label: 'Add', Icon: PlusIcon as AnyIcon },
];

function TabBarBase() {
  const activeTab = usePromptStore((s) => s.activeTab);
  const setActiveTab = usePromptStore((s) => s.setActiveTab);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-surface-950/90 backdrop-blur-lg border-t border-surface-800 px-2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around py-1">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-0.5 min-w-touch min-h-touch py-1 px-3 rounded-xl transition-colors duration-150 active:bg-surface-800/60"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={24}
                className={isActive ? 'text-accent' : 'text-surface-500'}
                {...(id === 'favorites' && isActive ? { fill: 'currentColor' } : {})}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-accent' : 'text-surface-500'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(TabBarBase);
