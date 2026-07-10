import { memo, useCallback } from 'react';
import { usePromptStore } from '../stores/usePromptStore';
import PromptForm from './PromptForm';

function AddPageBase() {
  const setActiveTab = usePromptStore((s) => s.setActiveTab);

  const handleDone = useCallback(() => {
    setActiveTab('browse');
  }, [setActiveTab]);

  return (
    <div className="px-3 pt-2 pb-24 space-y-2">
      <h1 className="text-lg font-bold text-surface-50 leading-none">Add Prompt</h1>
      <PromptForm onDone={handleDone} />
    </div>
  );
}

export default memo(AddPageBase);
