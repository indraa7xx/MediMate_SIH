import React, { useState, useEffect } from 'react';

interface SummaryReportProps {
    content: string;
    onClose: () => void;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.5 3A2.25 2.25 0 008.25 5.25v13.5A2.25 2.25 0 0010.5 21h3a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0013.5 3h-3zm-2.625 2.25c.392 0 .75.14 1.04.375v13.125c-.29.235-.648.375-1.04.375a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
);


const SummaryReport: React.FC<SummaryReportProps> = ({ content, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    // Simple markdown-to-HTML
    const renderContent = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold text-green-600 mt-6 mb-2">{line.substring(4)}</h3>;
            }
            if (line.startsWith('**')) {
                const parts = line.split('**');
                return (
                    <p key={index} className="my-1">
                        <strong className="font-semibold text-gray-700">{parts[1]}</strong>
                        <span className="text-gray-600">{parts[2]}</span>
                    </p>
                );
            }
            if (line.startsWith('- ')) {
                return <p key={index} className="my-1 pl-4 text-gray-700">{line}</p>
            }
            if (line.trim() === '---') {
                return <hr key={index} className="border-gray-200 my-4" />
            }
            return <p key={index} className="my-1 text-gray-600">{line}</p>;
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-report-title"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                    <h2 id="summary-report-title" className="text-lg font-semibold text-gray-900">Patient Summary Report</h2>
                    <div className="flex items-center gap-4">
                         <button onClick={handleCopy} className={`flex items-center gap-2 text-sm py-2 px-3 rounded-md transition-colors ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                            {isCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                            {isCopied ? 'Copied!' : 'Copy'}
                         </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-light leading-none">&times;</button>
                    </div>
                </header>
                <main className="p-6 overflow-y-auto bg-gray-50/50">
                    <div className="prose prose-sm max-w-none">
                        {renderContent(content)}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SummaryReport;