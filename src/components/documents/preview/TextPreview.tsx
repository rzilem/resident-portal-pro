
import React, { useState, useEffect } from 'react';

interface TextPreviewProps {
  src: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({ src }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchText = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to fetch text: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err: any) {
        console.error("Error fetching text content:", err);
        setError(err.message || "Failed to load text content");
      } finally {
        setLoading(false);
      }
    };
    
    fetchText();
  }, [src]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading text content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Error Loading Text</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <pre className="whitespace-pre-wrap break-words text-sm">{content}</pre>
    </div>
  );
};

export default TextPreview;
