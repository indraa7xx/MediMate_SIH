import React, { useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType, ChatMode } from '../types';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ModeSelector from './ModeSelector';

interface ChatHistoryProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  mode: ChatMode;
  onSelectMode: (mode: 'preventive' | 'preliminary') => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading, mode, onSelectMode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-white"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {mode === 'triage' && <ModeSelector onSelectMode={onSelectMode} />}
      {isLoading && <TypingIndicator />}
    </div>
  );
};

export default ChatHistory;