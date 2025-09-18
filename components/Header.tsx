
import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="py-8 text-center border-b border-gray-700/50">
      <Logo />
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Gemini Image Weaver
        </span>
      </h1>
      <p className="mt-2 text-lg text-gray-500">AI-Powered Text-to-Image Generation</p>
    </header>
  );
};
