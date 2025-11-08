
import React from 'react';

interface HeaderProps {
    onToggleGenerator: () => void;
    showGenerator: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleGenerator, showGenerator }) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm p-4 shadow-lg sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-white tracking-wider">
                        Geo-Activity Dashboard
                    </h1>
                </div>
                 <button 
                    onClick={onToggleGenerator}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                   </svg>
                   <span>{showGenerator ? 'Hide' : 'Show'} AI Image Gen</span>
                </button>
            </div>
        </header>
    );
};
