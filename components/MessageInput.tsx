import React from 'react';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  isLoading: boolean;
  onGenerateSummary?: () => void;
  isGeneratingSummary?: boolean;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const SummaryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 3.75A.75.75 0 015.25 3h13.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V3.75zM8.25 6a.75.75 0 01.75.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6zM7.5 15a.75.75 0 01.75.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);


const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend, isLoading, onGenerateSummary, isGeneratingSummary }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  const placeholderText = isLoading 
    ? (isGeneratingSummary ? "Generating summary..." : "Waiting for response...") 
    : "Type your message...";

  return (
    <div className="bg-gray-50 p-4 border-t border-gray-200">
      <div className="container mx-auto max-w-4xl flex items-center gap-3">
        {onGenerateSummary && (
            <button
                onClick={onGenerateSummary}
                disabled={isLoading}
                className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 flex-shrink-0"
                aria-label="Generate Summary Report"
            >
                <SummaryIcon className="w-6 h-6" />
            </button>
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          disabled={isLoading}
          className="flex-1 bg-white text-gray-800 border border-gray-300 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 disabled:opacity-50"
          autoFocus
        />
        <button
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
      <p className="text-center text-xs text-gray-500 mt-3 px-4">
        Reminder: Don’t rely solely on this chatbot for medical advice. Always consult a doctor.
      </p>
    </div>
  );
};

export default MessageInput;