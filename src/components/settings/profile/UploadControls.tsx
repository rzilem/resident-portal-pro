
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface UploadControlsProps {
  photoUrl: string | null;
  isUploading: boolean;
  isRemoving: boolean;
  onFileSelected: (file: File) => void;
  onRemovePhoto: () => void;
}

const UploadControls = ({ 
  photoUrl, 
  isUploading, 
  isRemoving, 
  onFileSelected, 
  onRemovePhoto 
}: UploadControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Upload a photo in JPG, PNG or GIF format. Maximum size 2MB.
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading || isRemoving}
      />
      
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleUploadClick}
                disabled={isUploading || isRemoving}
                className="flex items-center gap-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload a new profile photo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {photoUrl && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={onRemovePhoto}
                  disabled={isUploading || isRemoving}
                  className="flex items-center gap-1 text-destructive hover:text-destructive"
                >
                  {isRemoving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove current photo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default UploadControls;
