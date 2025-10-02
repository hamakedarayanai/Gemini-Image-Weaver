
import React from 'react';

interface ImageCardProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ src, alt, onClick }) => {
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent modal from opening when downloading
        const link = document.createElement('a');
        link.href = src;
        // Sanitize the alt text to create a valid filename
        const fileName = alt.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        link.download = `${fileName || 'generated-image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div 
      className="group relative overflow-hidden rounded-lg shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-purple-500/30 cursor-pointer fade-in"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={`View larger version of ${alt}`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover aspect-square" />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
          aria-label={`Download image: ${alt}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          Download
        </button>
      </div>
    </div>
  );
};
