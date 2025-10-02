
import React from 'react';
import { Spinner } from './Spinner';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const MagicWandIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.293 2.293a1 1 0 011.414 1.414l-1.586 1.586a1 1 0 01-1.414 0l-1-1a1 1 0 010-1.414l1.586-1.586zM9 13a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-5 4a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zM5 7a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm-3 4a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm10-8a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
    <path fillRule="evenodd" d="M5 2.293V2a1 1 0 011-1h8a1 1 0 011 1v.293l-2 2a1 1 0 01-1.414 0L10 2.586 7.414 4.293a1 1 0 01-1.414 0l-2-2z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M2 9.414V14a1 1 0 001 1h8a1 1 0 001-1V9.414l-2 2a1 1 0 01-1.414 0L7 9.707l-2.293 2.293a1 1 0 01-1.414 0l-2-2z" clipRule="evenodd" />
  </svg>
);

const samplePrompts = [
  'A whimsical bookstore in a giant, hollowed-out tree, lit by glowing mushrooms, detailed digital painting.',
  'A retro-futuristic cityscape at sunset with flying cars and neon signs, synthwave aesthetic.',
  'A majestic phoenix rising from ashes, surrounded by swirling embers and smoke, cinematic fantasy art.',
  'A close-up portrait of a robot with intricate gears and glowing blue eyes, hyperrealistic.',
  'An underwater coral reef teeming with bioluminescent creatures, otherworldly and vibrant.',
  'A serene Japanese garden in spring with cherry blossoms and a tranquil koi pond, watercolor style.',
];

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };
  
  const handleSurpriseMe = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A majestic lion wearing a crown, cinematic fantasy painting..."
          rows={3}
          className="w-full p-4 pr-12 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleSurpriseMe}
          disabled={isLoading}
          className="absolute top-3 right-3 text-gray-400 hover:text-purple-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Surprise me with a random prompt"
        >
          <MagicWandIcon />
        </button>
      </div>
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Weaving magic...</span>
          </>
        ) : (
          <span>Generate Images</span>
        )}
      </button>
    </form>
  );
};
