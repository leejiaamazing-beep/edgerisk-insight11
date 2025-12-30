import { useEffect, useRef } from 'react';
import type { Message } from './types.js';
import ChatBubble from './ChatBubble.js';
import { MessageSquare } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  onExport?: (notebookCode: string) => void;
}

export default function MessageList({ messages, onExport }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-200 mb-2">
                欢迎使用 EdgeRisk Insight
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                上传您的数据文件，开始智能风险分析
              </p>
              <div className="flex flex-col gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>支持 CSV、Excel、JSON 格式</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>AI 驱动的数据洞察</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>自动生成 Jupyter Notebook</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isUser={message.role === 'user'}
                onExport={onExport}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
