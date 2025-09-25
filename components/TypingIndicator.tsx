import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 py-3 px-4">
       <div className="w-8 h-8 rounded-full p-1.5 bg-gray-200 text-green-500 mr-3 flex-shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 7.5h-9v9h9v-9z" />
            <path fillRule="evenodd" d="M8.25 4.5A3.75 3.75 0 004.5 8.25v7.5a3.75 3.75 0 003.75 3.75h7.5a3.75 3.75 0 003.75-3.75v-7.5A3.75 3.75 0 0015.75 4.5h-7.5zM15 16.5h-6v-9h6v9z" clipRule="evenodd" />
          </svg>
       </div>
      <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;