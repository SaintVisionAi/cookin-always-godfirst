import { useState } from 'react';

export const usePromptAndCommand = () => {
  const [prompt, setPrompt] = useState('');
  const [isPromptPickerOpen, setIsPromptPickerOpen] = useState(false);

  const handleSelectAssistant = (assistant: any) => {
    console.log('Assistant selected:', assistant);
  };

  return {
    prompt,
    setPrompt,
    isPromptPickerOpen,
    setIsPromptPickerOpen,
    handleSelectAssistant,
  };
};
