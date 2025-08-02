import React, { createContext, useContext, useState } from 'react';

export interface ChatbotUIContextType {
  selectedAssistant: any;
  setSelectedAssistant: (assistant: any) => void;
  assistants: any[];
  setAssistants: (assistants: any[]) => void;
  assistantImages: any[];
  focusAssistant: any;
  atCommand: string;
  isAssistantPickerOpen: boolean;
  setIsAssistantPickerOpen: (open: boolean) => void;
  assistantCommand: string;
  setAssistantCommand: (command: string) => void;
  newMessageFiles: any[];
  chatFiles: any[];
  slashCommand: string;
  isFilePickerOpen: boolean;
  setIsFilePickerOpen: (open: boolean) => void;
  hashtagCommand: string;
  focusPrompt: () => void;
  focusFile: () => void;
}

const ChatbotUIContext = createContext<ChatbotUIContextType | undefined>(undefined);

export const useChatbotUI = () => {
  const context = useContext(ChatbotUIContext);
  if (!context) {
    throw new Error('useChatbotUI must be used within a ChatbotUIProvider');
  }
  return context;
};

export const ChatbotUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAssistant, setSelectedAssistant] = useState<any>(null);
  const [assistants, setAssistants] = useState<any[]>([]);
  const [assistantImages, setAssistantImages] = useState<any[]>([]);
  const [focusAssistant, setFocusAssistant] = useState<any>(null);
  const [atCommand, setAtCommand] = useState<string>('');
  const [isAssistantPickerOpen, setIsAssistantPickerOpen] = useState<boolean>(false);
  const [assistantCommand, setAssistantCommand] = useState<string>('');
  const [newMessageFiles, setNewMessageFiles] = useState<any[]>([]);
  const [chatFiles, setChatFiles] = useState<any[]>([]);
  const [slashCommand, setSlashCommand] = useState<string>('');
  const [isFilePickerOpen, setIsFilePickerOpen] = useState<boolean>(false);
  const [hashtagCommand, setHashtagCommand] = useState<string>('');

  const focusPrompt = () => {};
  const focusFile = () => {};

  return (
    <ChatbotUIContext.Provider
      value={{
        selectedAssistant,
        setSelectedAssistant,
        assistants,
        setAssistants,
        assistantImages,
        focusAssistant,
        atCommand,
        isAssistantPickerOpen,
        setIsAssistantPickerOpen,
        assistantCommand,
        setAssistantCommand,
        newMessageFiles,
        chatFiles,
        slashCommand,
        isFilePickerOpen,
        setIsFilePickerOpen,
        hashtagCommand,
        focusPrompt,
        focusFile,
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  );
};

export { ChatbotUIContext };
