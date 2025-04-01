
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { uploadProjectImage } from '@/utils/supabase/uploadProjectImage';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  category: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  category
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const imageUrl = await uploadProjectImage(selectedFile, category);
      
      if (imageUrl) {
        onImageUploaded(imageUrl);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs text-destructive hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload an image</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
          
          <TooltipButton
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
            tooltipText="Upload the selected image"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </TooltipButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
