
import React from 'react';
import { ImageCard } from './ImageCard';

// This type should match the one in App.tsx
interface ImageState {
  src: string | null;
  status: 'loading' | 'loaded' | 'error';
  error?: string;
}

interface ImageGridProps {
  images: ImageState[];
  prompt: string;
}

// A simple skeleton loader for image placeholders
const SkeletonLoader: React.FC = () => (
  <div className="bg-gray-800 rounded-lg shadow-lg animate-pulse aspect-square"></div>
);

// A component to display an error message for a failed image
const ErrorCard: React.FC<{ message?: string }> = ({ message = "Failed to load image." }) => {
  return (
    <div className="bg-red-900/40 border border-red-800/60 rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center text-center p-4" aria-live="polite">
      <div className="text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="mt-3 text-sm font-semibold text-red-300">Generation Failed</p>
      <p className="mt-1 text-xs text-red-400">{message}</p>
    </div>
  );
};


export const ImageGrid: React.FC<ImageGridProps> = ({ images, prompt }) => {
  // The top-level isLoading prop is removed; component now reacts to the state of individual images.
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {images.map((imageState, index) => {
          switch (imageState.status) {
            case 'loading':
              return <SkeletonLoader key={index} />;
            case 'loaded':
              // Ensure src is not null before rendering ImageCard
              return imageState.src ? (
                <ImageCard key={index} src={imageState.src} alt={`${prompt} - result ${index + 1}`} />
              ) : (
                <ErrorCard key={index} message="Image data is missing." />
              );
            case 'error':
              return <ErrorCard key={index} message={imageState.error} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};
