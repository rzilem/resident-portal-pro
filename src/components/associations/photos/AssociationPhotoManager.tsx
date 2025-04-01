
import React, { useState, useRef } from 'react';
import { useAssociationPhotos } from '@/hooks/useAssociationPhotos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Trash2, 
  Star, 
  Image as ImageIcon, 
  MoreVertical, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AssociationPhotoManagerProps {
  associationId: string;
  associationName: string;
}

const AssociationPhotoManager: React.FC<AssociationPhotoManagerProps> = ({ 
  associationId,
  associationName
}) => {
  const { 
    photos, 
    isLoading, 
    isUploading, 
    uploadPhoto, 
    deletePhoto, 
    setPrimary,
    refreshPhotos
  } = useAssociationPhotos(associationId);
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }
    
    setUploadError(null);
    
    try {
      await uploadPhoto(file, description);
      setUploadDialogOpen(false);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file');
    }
  };

  const handlePrimaryClick = async (photoId: string) => {
    await setPrimary(photoId);
  };

  const handleDeleteClick = async (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      await deletePhoto(photoId);
    }
  };

  const openPreview = (photoUrl: string) => {
    // Process URL to ensure it's a valid image URL
    // For demo URLs, use a placeholder instead
    const isDemo = photoUrl.includes('demo-storage.example.com');
    const imageUrl = isDemo 
      ? "https://placehold.co/800x600?text=Demo+Image" 
      : photoUrl;
      
    setSelectedPhoto(imageUrl);
    setPreviewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Association Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading photos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Association Photos
        </CardTitle>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Photo</DialogTitle>
              <DialogDescription>
                Upload a new photo for {associationName}. Images must be less than 5MB.
              </DialogDescription>
            </DialogHeader>
            
            {uploadError && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{uploadError}</p>
              </div>
            )}
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="Photo description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : 'Upload Photo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">No photos yet</p>
            <Button 
              size="sm" 
              onClick={() => setUploadDialogOpen(true)}
              className="gap-1"
            >
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => {
                // Process URL to ensure it's a valid image URL
                // For demo URLs, use a placeholder instead
                const isDemo = photo.url.includes('demo-storage.example.com');
                const imageUrl = isDemo 
                  ? "https://placehold.co/600x400?text=Demo+Image" 
                  : photo.url;
                  
                return (
                  <div 
                    key={photo.id} 
                    className="relative group overflow-hidden rounded-md border"
                  >
                    <div 
                      className="aspect-square relative cursor-pointer"
                      onClick={() => openPreview(photo.url)}
                    >
                      <img 
                        src={imageUrl} 
                        alt={photo.description || 'Association photo'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Failed to load image thumbnail:", imageUrl);
                          e.currentTarget.src = "https://placehold.co/300x300?text=Image+Not+Found";
                        }}
                      />
                      {photo.is_primary && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 left-2 bg-primary/80 hover:bg-primary/80"
                        >
                          <Star className="h-3 w-3 mr-1 fill-primary-foreground" />
                          Primary
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!photo.is_primary && (
                            <DropdownMenuItem onClick={() => handlePrimaryClick(photo.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              Set as primary
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeleteClick(photo.id)}>
                            <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                            <span className="text-destructive">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      
      {/* Photo Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          {selectedPhoto && (
            <img 
              src={selectedPhoto} 
              alt="Association photo preview" 
              className="w-full h-auto rounded-md"
              onError={(e) => {
                console.error("Failed to load preview image:", selectedPhoto);
                e.currentTarget.src = "https://placehold.co/800x600?text=Image+Not+Found";
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AssociationPhotoManager;
