
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X, FileText, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Vendor } from '@/types/vendor';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InsuranceDocumentUploaderProps {
  vendor: Vendor;
  onDocumentUploaded: () => void;
}

const InsuranceDocumentUploader: React.FC<InsuranceDocumentUploaderProps> = ({ 
  vendor, 
  onDocumentUploaded 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('insurance_certificate');
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      // Reset error if previously set
      setError(null);
      setFile(selectedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      // Reset error if previously set
      setError(null);
      setFile(droppedFile);
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setError(null);
  };
  
  const uploadDocument = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!expirationDate) {
      toast.error('Please select an expiration date');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // 1. Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `vendors/${vendor.id}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // 2. Save document metadata to database using our new table
      const { error: metadataError } = await supabase
        .from('vendor_insurance_documents')
        .insert({
          vendor_id: vendor.id,
          document_name: file.name,
          document_type: documentType,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          expiration_date: expirationDate.toISOString(),
          is_verified: false
        });
      
      if (metadataError) {
        throw metadataError;
      }
      
      // 3. Update vendor insurance information if needed
      if (documentType === 'insurance_certificate' && vendor.insurance) {
        // Get the URL for the document
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
        
        const { error: vendorUpdateError } = await supabase
          .from('vendors')
          .update({
            insurance: {
              ...vendor.insurance,
              expirationDate: expirationDate.toISOString(),
              documents: [
                ...(vendor.insurance.documents || []),
                {
                  id: Math.random().toString(36).substring(2, 15),
                  name: file.name,
                  url: urlData.publicUrl,
                  uploadDate: new Date().toISOString()
                }
              ]
            }
          })
          .eq('id', vendor.id);
        
        if (vendorUpdateError) {
          console.error('Error updating vendor:', vendorUpdateError);
          // Continue anyway since the document was uploaded
        }
      }
      
      toast.success('Document uploaded successfully');
      setFile(null);
      setExpirationDate(undefined);
      onDocumentUploaded();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      setError(error.message || 'Failed to upload document');
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };
  
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upload Insurance Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="document-type">Document Type</Label>
          <select 
            id="document-type" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <option value="insurance_certificate">Insurance Certificate</option>
            <option value="proof_of_insurance">Proof of Insurance</option>
            <option value="policy_document">Policy Document</option>
            <option value="endorsement">Endorsement</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="expiration-date">Expiration Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expirationDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expirationDate}
                onSelect={setExpirationDate}
                initialFocus
                fromDate={new Date()} // Can only select today or future dates
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {!file ? (
          <div 
            className="border-2 border-dashed rounded-md py-10 px-4 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop your document here, or click to browse
              </p>
              <Label 
                htmlFor="document-upload" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md cursor-pointer"
              >
                Browse files
              </Label>
              <Input 
                id="document-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3 inline mr-1" />
                Max file size: 10MB
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full" 
          onClick={uploadDocument} 
          disabled={!file || !expirationDate || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Uploaded documents will require verification by an administrator before they are considered valid.
        </p>
      </CardContent>
    </Card>
  );
};

export default InsuranceDocumentUploader;
