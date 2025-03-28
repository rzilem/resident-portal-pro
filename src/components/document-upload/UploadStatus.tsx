
import React from 'react';

interface UploadStatusProps {
  error: string | null;
  success: boolean;
}

export const UploadStatus: React.FC<UploadStatusProps> = ({ error, success }) => {
  if (!error && !success) return null;
  
  return (
    <>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Upload successful!</p>}
    </>
  );
};
