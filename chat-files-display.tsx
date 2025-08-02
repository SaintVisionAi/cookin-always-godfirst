import { FC } from "react"

interface ChatFilesDisplayProps {
  chatFiles: any[]
}

export const ChatFilesDisplay: FC<ChatFilesDisplayProps> = ({ chatFiles = [] }) => {
  if (chatFiles.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {chatFiles.map((file, index) => (
        <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
          <span className="text-sm">{file.name || 'Unnamed file'}</span>
        </div>
      ))}
    </div>
  )
}
