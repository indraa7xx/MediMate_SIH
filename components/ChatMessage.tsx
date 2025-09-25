import React from 'react';
import type { ChatMessage } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.5 7.5h-9v9h9v-9z" />
        <path fillRule="evenodd" d="M8.25 4.5A3.75 3.75 0 004.5 8.25v7.5a3.75 3.75 0 003.75 3.75h7.5a3.75 3.75 0 003.75-3.75v-7.5A3.75 3.75 0 0015.75 4.5h-7.5zM15 16.5h-6v-9h6v9z" clipRule="evenodd" />
    </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const containerClasses = `flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`;
  const bubbleClasses = `max-w-xl px-4 py-3 rounded-2xl shadow-md ${isUser ? 'bg-green-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`;
  const iconClasses = `w-8 h-8 rounded-full p-1.5 flex-shrink-0 ${isUser ? 'bg-green-500 text-white' : 'bg-gray-200 text-green-500'}`;

  // This is a simplified markdown-to-html parser
  const renderText = (text: string) => {
    const parts = text.split(/(\`{3}[\s\S]*?\`{3}|\`[\s\S]*?\`|\*{2}[\s\S]*?\*{2}|\*[\s\S]*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const code = part.substring(3, part.length - 3);
        return <pre key={index} className="bg-gray-100 text-gray-800 p-3 rounded-md my-2 overflow-x-auto text-sm"><code className="font-mono">{code.trim()}</code></pre>;
      }
      if (part.startsWith('`')) {
        return <code key={index} className="bg-gray-200 text-pink-600 rounded px-1.5 py-0.5 font-mono text-sm">{part.substring(1, part.length - 1)}</code>;
      }
      if (part.startsWith('**')) {
        return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
      }
      if (part.startsWith('*')) {
        return <em key={index}>{part.substring(1, part.length - 1)}</em>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={containerClasses}>
      <div className={iconClasses}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
      <div className={`${bubbleClasses} prose prose-sm max-w-none`}>
        {renderText(message.text)}
      </div>
    </div>
  );
};

export default ChatMessage;