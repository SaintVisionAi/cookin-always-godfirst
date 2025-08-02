import { ChatbotUIContext } from "@/context/context"
import { FC } from "react"
import { AssistantPicker } from "./assistant-picker"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"
import { FilePicker } from "./file-picker"
import { PromptPicker } from "./prompt-picker"
import { ToolPicker } from "./tool-picker"

interface ChatCommandInputProps {}

export const ChatCommandInput: FC<ChatCommandInputProps> = ({}) => {
  // Provide default values to prevent errors
  const newMessageFiles: any[] = []
  const chatFiles: any[] = []
  const slashCommand = ''
  const isFilePickerOpen = false
  const setIsFilePickerOpen = () => {}
  const hashtagCommand = ''
  const focusPrompt = () => {}
  const focusFile = () => {}

  const { 
    handleSelectAssistant 
  } = usePromptAndCommand()

  return (
    <div className="flex items-center space-x-2">
      <AssistantPicker />
      <PromptPicker />
      <ToolPicker />
      <FilePicker 
        isOpen={isFilePickerOpen}
        searchQuery=""
        onOpenChange={setIsFilePickerOpen}
        selectedFileIds={[]}
        selectedCollectionIds={[]}
        onSelectFile={() => {}}
        onSelectCollection={() => {}}
        isFocused={false}
      />
    </div>
  )
}
