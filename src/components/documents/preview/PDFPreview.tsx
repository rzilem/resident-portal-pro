
import React, { useState } from 'react';

interface PDFPreviewProps {
  src: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ src }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError("Failed to load PDF document");
  };

  return (
    <div className="w-full h-full min-h-[500px] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Error Loading PDF</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      )}
      
      <iframe
        src={src}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        title="PDF Preview"
      ></iframe>
    </div>
  );
};

export default PDFPreview;
