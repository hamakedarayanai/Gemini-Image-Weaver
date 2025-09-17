
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ImageGrid } from './components/ImageGrid';
import { generateImagesFromPrompt } from './services/geminiService';

// Define a type for the state of each individual image
export interface ImageState {
  src: string | null;
  status: 'loading' | 'loaded' | 'error';
  error?: string;
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<ImageState[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    // Initialize state for 4 images, each in a 'loading' state
    setImages(Array.from({ length: 4 }, () => ({ src: null, status: 'loading' })));

    try {
      await generateImagesFromPrompt(
        prompt,
        // onImageGenerated callback: fires when an image is ready
        (imageUrl, index) => {
          setImages(prevImages => {
            const newImages = [...prevImages];
            newImages[index] = { src: imageUrl, status: 'loaded', error: undefined };
            return newImages;
          });
        },
        // onImageError callback: fires when an image fails to generate
        (err, index) => {
          setImages(prevImages => {
            const newImages = [...prevImages];
            newImages[index] = { src: null, status: 'error', error: err.message };
            return newImages;
          });
        }
      );
    } catch (err) {
      // This catch is for critical setup errors, not individual image failures
      const errorMessage = err instanceof Error ? err.message : 'An unknown critical error occurred.';
      setError(errorMessage);
      setImages([]); // Clear all images on a critical failure
    } finally {
      setIsLoading(false); // Re-enable the form once all processes are complete
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-lg text-gray-400 mb-8">
            Enter a descriptive prompt below and watch as AI weaves your words into a vibrant tapestry of four unique images.
          </p>
          <PromptForm
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>
        <ImageGrid images={images} prompt={prompt} />
      </main>
    </div>
  );
};

export default App;
