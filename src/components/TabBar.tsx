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
      className="fixed bottom-0 inset-x-0 z-30 bg-surface-950/80 backdrop-blur-2xl border-t border-surface-800/30 px-2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around py-1">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-0.5 min-w-touch min-h-touch py-1.5 px-4 rounded-2xl transition-all duration-200 relative"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" />
              )}
              <Icon
                size={22}
                className={`transition-all duration-200 ${
                  isActive ? 'text-accent scale-110' : 'text-surface-500'
                }`}
                {...(id === 'favorites' && isActive ? { fill: 'currentColor' } : {})}
              />
              <span
                className={`text-[9px] font-medium transition-all duration-200 ${
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