import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { initializeDocumentsBucket } from '@/utils/documents/bucketUtils';
import { validateFileSize, validateFileType } from '@/utils/documents/fileUtils';

interface DocumentUploadDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  associationId: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ open, setOpen, onSuccess, associationId }) => {
  const { user, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>(''); // For title input
  const [category, setCategory] = useState<string>('GENERAL'); // For category input
  const [description, setDescription] = useState<string>(''); // For description input
  const [isPreparing, setIsPreparing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    if (!open) return; // Only run when dialog is open
    const prepareStorage = async () => {
      if (authLoading || !user) return; // Wait for auth to load
      if (isPreparing) return; // Prevent multiple calls
      setIsPreparing(true);
      try {
        const success = await initializeDocumentsBucket();
        if (success) {
          setIsStorageReady(true);
          console.log("Storage initialized successfully");
        } else {
          toast.error("Failed to initialize document storage");
          console.error("Storage initialization failed");
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Storage initialization error:", message);
        toast.error("Document storage is not available");
      } finally {
        setIsPreparing(false);
      }
    };
    prepareStorage();
  }, [authLoading, user, open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name); // Auto-fill title with file name
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error("Please log in to upload documents");
      console.error("User not authenticated");
      return;
    }
    if (!file) {
      toast.error("Please select a file to upload");
      console.error("No file selected");
      return;
    }
    if (!isStorageReady) {
      toast.error("Document storage is not ready");
      console.error("Storage not ready");
      return;
    }

    setIsUploading(true);
    try {
      // Validate file
      console.log("Validating file:", file.name);
      validateFileSize(file, 5); // 5MB limit
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
      ];
      validateFileType(file, allowedTypes);

      // Upload file
      console.log("Starting upload for file:", file.name);
      const filePath = `${associationId}/uploads/${Date.now()}_${file.name}`; // Use associationId in path
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`);
        console.error("Upload error:", JSON.stringify(uploadError, null, 2));
        return;
      }

      // Get public URL
      console.log("Getting public URL for file:", filePath);
      const { data: { publicUrl } } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      toast.success("Document uploaded successfully");
      console.log("Uploaded file URL:", publicUrl);
      // Reset form and close dialog
      setFile(null);
      setTitle('');
      setCategory('GENERAL');
      setDescription('');
      setOpen(false);
      onSuccess(); // Call onSuccess to refresh parent component
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Upload failed: ${message}`);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div>
      <h2>Upload Document</h2>
      <p>Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.</p>
      {authLoading ? (
        <p>Loading authentication...</p>
      ) : !user ? (
        <p>Please log in to upload documents</p>
      ) : isPreparing ? (
        <div>
          <p>Preparing document storage...</p>
          <p>Almost ready! Checking storage accessibility...</p>
        </div>
      ) : !isStorageReady ? (
        <div>
          <p style={{ color: 'red' }}>Document storage is not available</p>
          <p>Authentication required to use document storage</p>
          <p>The system is having trouble accessing the document storage in Supabase.</p>
        </div>
      ) : (
        <>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>
          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isUploading}
            >
              <option value="GENERAL">General</option>
              <option value="FINANCIAL">Financial</option>
              <option value="LEGAL">Legal</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
            />
          </div>
          <div>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          <button
            onClick={() => {
              setFile(null);
              setTitle('');
              setCategory('GENERAL');
              setDescription('');
              setOpen(false);
            }}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </>
      )}
    </div>
  );
};

export default DocumentUploadDialog;
