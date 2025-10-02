
import React, { useState, useCallback, useEffect } from 'react';
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

interface SelectedImage {
  src: string;
  alt: string;
}

// Close icon component for the modal
const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Image Modal component
const ImageModal: React.FC<{ image: SelectedImage; onClose: () => void }> = ({ image, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-alt"
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={image.src} alt={image.alt} className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
        <p id="image-modal-alt" className="text-center text-gray-300 mt-4 text-sm bg-black/30 p-2 rounded-md">{image.alt}</p>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-red-600 transition-colors"
          aria-label="Close image viewer"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<ImageState[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImages(Array.from({ length: 4 }, () => ({ src: null, status: 'loading' })));

    try {
      await generateImagesFromPrompt(
        prompt,
        (imageUrl, index) => {
          setImages(prevImages => {
            const newImages = [...prevImages];
            newImages[index] = { src: imageUrl, status: 'loaded', error: undefined };
            return newImages;
          });
        },
        (err, index) => {
          setImages(prevImages => {
            const newImages = [...prevImages];
            newImages[index] = { src: null, status: 'error', error: err.message };
            return newImages;
          });
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown critical error occurred.';
      setError(errorMessage);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);
  
  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        <ImageGrid images={images} prompt={prompt} onImageClick={handleImageClick} />
      </main>
      {selectedImage && <ImageModal image={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
