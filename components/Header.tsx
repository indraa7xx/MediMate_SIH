import React from 'react';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zM12.75 8.663a.75.75 0 00-1.06 1.06l2.122 2.121a.75.75 0 001.06-1.06L12.75 8.663zM4.5 9a.75.75 0 01.75-.75h3.546a.75.75 0 010 1.5H5.25A.75.75 0 014.5 9zM8.663 12.75a.75.75 0 00-1.06 1.06l2.121 2.122a.75.75 0 001.06-1.06l-2.121-2.122zM9 15a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V15.75A.75.75 0 019 15zM12.75 15.337a.75.75 0 00-1.06-1.06l-2.122 2.121a.75.75 0 001.06 1.06l2.122-2.121zM15 9a.75.75 0 01.75-.75h3.546a.75.75 0 010 1.5H15.75A.75.75 0 0115 9zM15.337 12.75a.75.75 0 00-1.06 1.06l2.121 2.122a.75.75 0 001.06-1.06l-2.12-2.121z"
      clipRule="evenodd"
    />
    <path d="M10.5 1.5a.75.75 0 01.75.75V3a.75.75 0 01-1.5 0V2.25a.75.75 0 01.75-.75zM14.25 3.75a.75.75 0 00-1.06-1.06l-1.062 1.06a.75.75 0 001.061 1.061L14.25 3.75zM3.75 14.25a.75.75 0 00-1.06-1.06L1.628 14.25a.75.75 0 001.06 1.061L3.75 14.25zM1.5 10.5a.75.75 0 01.75-.75H3a.75.75 0 010 1.5H2.25A.75.75 0 011.5 10.5zM10.5 19.5a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zM14.25 20.25a.75.75 0 00-1.06-1.06l-1.062 1.06a.75.75 0 101.061 1.061L14.25 20.25zM20.25 14.25a.75.75 0 00-1.06-1.06l-1.062 1.06a.75.75 0 001.06 1.061L20.25 14.25zM19.5 10.5a.75.75 0 01.75-.75H21a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75z" />
  </svg>
);

const NewChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);


interface HeaderProps {
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 shadow-sm sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-28"></div> {/* Spacer for centering title */}
        <div className="flex items-center justify-center flex-1">
          <SparkleIcon className="w-7 h-7 text-green-500 mr-3" />
          <h1 className="text-xl font-bold tracking-wider text-gray-800">
            MediMate
          </h1>
        </div>
        <div className="w-28 flex justify-end">
            <button 
              onClick={onNewChat}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md transition-colors"
              aria-label="Start new chat"
            >
              <NewChatIcon className="w-5 h-5" />
              New Chat
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;