import { memo, useCallback } from 'react';
import { usePromptStore } from '../stores/usePromptStore';
import PromptForm from './PromptForm';

function AddPageBase() {
  const setActiveTab = usePromptStore((s) => s.setActiveTab);

  const handleDone = useCallback(() => {
    setActiveTab('browse');
  }, [setActiveTab]);

  return (
    <div className="px-3 sm:px-4 pt-3 pb-28 space-y-3 animate-fade-in">
      <h1 className="text-xl font-semibold text-surface-50 tracking-tight px-1">Add Prompt</h1>
      <PromptForm onDone={handleDone} />
    </div>
  );
}

export default memo(AddPageBase);