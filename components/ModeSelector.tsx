import React from 'react';

interface ModeSelectorProps {
    onSelectMode: (mode: 'preventive' | 'preliminary') => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
    return (
        <div className="flex justify-center items-center gap-4 my-4">
            <button
                onClick={() => onSelectMode('preventive')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
                aria-label="Select preventive mode for tips on staying healthy"
            >
                Get Wellness Tips
            </button>
            <button
                onClick={() => onSelectMode('preliminary')}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
                aria-label="Select preliminary mode to talk about symptoms"
            >
                Check My Symptoms
            </button>
        </div>
    );
};

export default ModeSelector;