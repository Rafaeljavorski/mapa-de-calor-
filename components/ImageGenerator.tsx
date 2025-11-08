
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Spinner } from './Spinner';

export const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        try {
            const base64Image = await generateImage(prompt);
            setImageUrl(`data:image/jpeg;base64,${base64Image}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    };


    return (
        <div className="p-6 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg mt-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                AI Image Generator (imagen-4.0)
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., A futuristic city skyline at sunset, cyberpunk style"
                    className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <Spinner /> : 'Generate Image'}
                </button>
            </div>
            {error && <p className="text-red-400 text-center my-2">{error}</p>}
            <div className="mt-4 bg-gray-900 rounded-lg p-4 min-h-[300px] flex items-center justify-center border border-gray-700">
                {isLoading && (
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-2 text-gray-400">Generating your masterpiece...</p>
                    </div>
                )}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt={prompt} className="rounded-lg max-w-full max-h-[512px] shadow-2xl" />
                )}
                {!imageUrl && !isLoading && (
                    <p className="text-gray-500">Your generated image will appear here.</p>
                )}
            </div>
        </div>
    );
};
