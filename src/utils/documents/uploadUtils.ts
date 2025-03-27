
/**
 * Utility functions for document uploads
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { isUserAuthenticated, getCurrentUserId } from './authUtils';
import { ensureDocumentsBucketExists } from './bucketUtils';
import { createDocument } from './documentDbUtils';
import { generateUniqueFileName, isAllowedFileType, isFileSizeValid } from './fileUtils';

/**
 * Upload a document to storage and create database record
 * @param {Object} options - Upload options
 * @param {File} options.file - File to upload
 * @param {string} options.category - Document category
 * @param {string} options.description - Document description
 * @param {string[]} options.tags - Document tags
 * @param {string} options.associationId - Association ID
 * @returns {Promise<boolean>} True if upload succeeded
 */
export const uploadDocument = async ({
  file,
  category = 'uncategorized',
  description = '',
  tags = [],
  associationId
}: {
  file: File;
  category?: string;
  description?: string;
  tags?: string[];
  associationId?: string;
}): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      toast.error('Please log in to upload files');
      return false;
    }
    
    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      toast.error('User identification failed');
      return false;
    }
    
    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'image/jpeg', 'image/png'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    
    if (!isAllowedFileType(file, allowedTypes)) {
      toast.error('File type not allowed. Please upload PDF, Word, Excel, or image files.');
      return false;
    }
    
    if (!isFileSizeValid(file, maxSizeBytes)) {
      toast.error(`File size exceeds maximum allowed (${maxSizeBytes / (1024 * 1024)}MB)`);
      return false;
    }
    
    // Ensure bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      toast.error('Document storage is not available');
      return false;
    }
    
    // Create a unique file name
    const uniqueFileName = generateUniqueFileName(file);
    const filePath = `${category}/${uniqueFileName}`;
    
    console.log(`Uploading file to path: ${filePath}`);
    
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading document:', error);
      
      const errorMessage = error.message || 'Upload failed';
      
      // Provide more specific error messages based on the error
      if (error.message?.includes('duplicate')) {
        toast.error('A file with this name already exists');
      } else if (error.message?.includes('permission')) {
        toast.error('Permission denied. Please check your account access.');
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Upload failed: ${errorMessage}`);
      }
      
      return false;
    }
    
    console.log('Document uploaded successfully to storage');
    
    // Get the URL of the uploaded file
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    // Create document record in database
    const documentRecord = {
      id: uuidv4(),
      name: file.name,
      description,
      fileSize: file.size,
      fileType: file.type,
      url: urlData?.publicUrl || '',
      path: filePath,
      category,
      tags,
      uploadedBy: userId,
      uploadedDate: new Date().toISOString(),
      version: 1,
      isPublic: false,
      isArchived: false,
      associationId: associationId || null
    };
    
    const createdDocument = await createDocument(documentRecord);
    
    if (!createdDocument) {
      console.error('Failed to create document record in database');
      toast.warning('File uploaded but metadata could not be saved');
      return false;
    }
    
    console.log('Document record created in database');
    toast.success('Document uploaded successfully');
    return true;
  } catch (error) {
    console.error('Unexpected upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Upload failed: ${errorMessage}`);
    return false;
  }
};

/**
 * Create a service for uploading documents in background
 */
export class DocumentUploadService {
  private queue: Array<{
    file: File;
    options: {
      category?: string;
      description?: string;
      tags?: string[];
      associationId?: string;
    };
    resolve: (result: boolean) => void;
  }> = [];
  
  private isProcessing = false;
  
  /**
   * Add a document to the upload queue
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise<boolean>} Promise resolving to true if upload succeeded
   */
  public queueUpload(
    file: File,
    options: {
      category?: string;
      description?: string;
      tags?: string[];
      associationId?: string;
    } = {}
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.queue.push({ file, options, resolve });
      this.processQueue();
    });
  }
  
  /**
   * Process the upload queue
   */
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    const { file, options, resolve } = this.queue.shift()!;
    
    try {
      const result = await uploadDocument({
        file,
        ...options
      });
      
      resolve(result);
    } catch (error) {
      console.error('Error in upload queue processing:', error);
      resolve(false);
    } finally {
      this.isProcessing = false;
      this.processQueue();
    }
  }
}

// Export singleton instance
export const documentUploadService = new DocumentUploadService();
