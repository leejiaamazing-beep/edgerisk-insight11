import { User, Bot, Download } from 'lucide-react';
import type { Message } from './types.js';

interface ChatBubbleProps {
  message: Message;
  isUser: boolean;
  onExport?: (notebookCode: string) => void;
}

export default function ChatBubble({ message, isUser, onExport }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-5 py-3 shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-md'
              : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-tl-md border border-gray-700/50'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        <span className="text-xs text-gray-500 mt-1.5 px-2">{formatTime(message.timestamp)}</span>

        {!isUser && message.notebookCode && onExport && (
          <button
            onClick={() => onExport(message.notebookCode!)}
            className="mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors bg-gray-800/50 hover:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700/50"
          >
            <Download size={14} />
            <span>导出 Jupyter Notebook</span>
          </button>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gray-700 flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
}
