
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadProjectImage } from '@/utils/supabase/uploadProjectImage';

interface ImageUploaderProps {
  onUploadComplete: (imageUrl: string) => void;
  category?: string;
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  category = 'fencing',
  maxSizeMB = 2
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image.');
      return;
    }
    
    setSelectedFile(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const imageUrl = await uploadProjectImage(selectedFile, category);
      
      if (imageUrl) {
        onUploadComplete(imageUrl);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full shadow-sm">
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
            
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            
            {selectedFile ? (
              <div className="mt-2">
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
                <p className="text-sm font-medium">Click to upload an image</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF up to {maxSizeMB}MB
                </p>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
