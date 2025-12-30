import { useState, type KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-sm p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题，例如：分析这份数据的风险趋势..."
              disabled={disabled}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-gray-500"
              rows={1}
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />
            <Sparkles
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl px-5 py-3 transition-all flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:shadow-none"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-4">
          <span>按 Enter 发送，Shift + Enter 换行</span>
          <span className="text-gray-600">•</span>
          <span>由 AI 驱动</span>
        </p>
      </div>
    </div>
  );
}
