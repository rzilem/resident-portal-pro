
import { supabase } from '@/integrations/supabase/client'; // Updated import path
import { toast } from 'sonner';

export interface VendorDocument {
  id: string;
  vendor_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  expiration_date?: string;
  url?: string;
}

/**
 * Upload a document for a vendor to Supabase storage
 */
export const uploadVendorDocument = async (
  file: File,
  vendorId: string,
  metadata: {
    documentType: string;
    expirationDate?: string;
  }
): Promise<VendorDocument | null> => {
  try {
    // 1. Upload file to Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `vendors/${vendorId}/${fileName}`; // Changed path structure
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents') // Use documents bucket instead of vendor_documents
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // 2. Get the public URL
    const { data: urlData } = supabase.storage
      .from('documents') // Use documents bucket instead of vendor_documents
      .getPublicUrl(filePath);
    
    // 3. Save document metadata to database
    const documentData = {
      vendor_id: vendorId,
      document_name: file.name,
      document_type: metadata.documentType,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      expiration_date: metadata.expirationDate
    };
    
    const { data, error: metadataError } = await supabase
      .from('vendor_insurance_documents')
      .insert(documentData)
      .select()
      .single();
    
    if (metadataError) {
      // Try to delete the uploaded file if metadata save fails
      await supabase.storage
        .from('documents') // Use documents bucket instead of vendor_documents
        .remove([filePath]);
        
      throw metadataError;
    }
    
    return {
      ...data,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error('Error uploading vendor document:', error);
    toast.error(error.message || 'Failed to upload document');
    return null;
  }
};

/**
 * Get all documents for a vendor
 */
export const getVendorDocuments = async (vendorId: string): Promise<VendorDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('vendor_insurance_documents')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('uploaded_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Generate URLs for documents
    const docsWithUrls = await Promise.all(data.map(async (doc) => {
      const { data: urlData } = supabase.storage
        .from('documents') // Use documents bucket instead of vendor_documents
        .getPublicUrl(doc.file_path);
      
      return {
        ...doc,
        url: urlData.publicUrl
      };
    }));
    
    return docsWithUrls;
  } catch (error: any) {
    console.error('Error getting vendor documents:', error);
    toast.error(error.message || 'Failed to load documents');
    return [];
  }
};

/**
 * Delete a vendor document
 */
export const deleteVendorDocument = async (document: VendorDocument): Promise<boolean> => {
  try {
    // 1. Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('documents') // Use documents bucket instead of vendor_documents
      .remove([document.file_path]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue anyway to try to delete the database record
    }
    
    // 2. Delete record from database
    const { error: dbError } = await supabase
      .from('vendor_insurance_documents')
      .delete()
      .eq('id', document.id);
    
    if (dbError) {
      throw dbError;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting vendor document:', error);
    toast.error(error.message || 'Failed to delete document');
    return false;
  }
};
