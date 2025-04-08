
import React, { useState, useEffect } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { format } from 'date-fns';
import { Shield, Calendar, DollarSign, FileText, RefreshCw, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PolicyInfoCard from './insurance/PolicyInfoCard';
import CoverageDetailsCard from './insurance/CoverageDetailsCard';
import AgentInfoCard from './insurance/AgentInfoCard';
import DocumentsCard from './insurance/DocumentsCard';
import InsuranceStatusBadge from './insurance/InsuranceStatusBadge';
import InsuranceDocumentUploader from './insurance/InsuranceDocumentUploader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VendorInsuranceTabProps {
  vendor: Vendor;
}

interface InsuranceDocument {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  uploaded_at: string;
  expiration_date: string | null;
  is_verified: boolean;
  url?: string;
}

const VendorInsuranceTab: React.FC<VendorInsuranceTabProps> = ({ vendor }) => {
  const [documents, setDocuments] = useState<InsuranceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [expiringDocuments, setExpiringDocuments] = useState<InsuranceDocument[]>([]);
  
  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendor_insurance_documents')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('uploaded_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Generate URLs for documents
      const docsWithUrls = await Promise.all(data.map(async (doc) => {
        try {
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(doc.file_path);
          
          return {
            ...doc,
            url: urlData.publicUrl
          };
        } catch (err) {
          console.error(`Error getting URL for document ${doc.id}:`, err);
          return {
            ...doc,
            url: undefined
          };
        }
      }));
      
      setDocuments(docsWithUrls);
      
      // Check for documents expiring in the next 30 days
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      
      const expiring = docsWithUrls.filter(doc => {
        if (!doc.expiration_date) return false;
        const expirationDate = new Date(doc.expiration_date);
        return expirationDate > now && expirationDate <= thirtyDaysFromNow;
      });
      
      setExpiringDocuments(expiring);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load insurance documents');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadDocuments();
  }, [vendor.id]);
  
  const formatDocumentsForDisplay = () => {
    return documents.map(doc => ({
      id: doc.id,
      name: doc.document_name,
      url: doc.url,
      uploadDate: doc.uploaded_at,
      expirationDate: doc.expiration_date,
      isVerified: doc.is_verified
    }));
  };
  
  const hasExpiredInsurance = () => {
    if (vendor.insurance?.expirationDate) {
      return new Date(vendor.insurance.expirationDate) < new Date();
    }
    
    // If no main insurance record, check if any documents are expired
    if (documents.length > 0) {
      const insuranceCertificates = documents.filter(
        doc => doc.document_type === 'insurance_certificate' && doc.expiration_date
      );
      
      if (insuranceCertificates.length > 0) {
        return insuranceCertificates.some(
          doc => doc.expiration_date && new Date(doc.expiration_date) < new Date()
        );
      }
    }
    
    return false;
  };
  
  if (!vendor.insurance && documents.length === 0) {
    return (
      <CardContent className="p-6 text-center">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No Insurance Information</h3>
        <p className="mt-2 text-muted-foreground">
          No insurance details have been added for this vendor.
        </p>
        <Button 
          className="mt-4" 
          onClick={() => setShowUploader(!showUploader)}
        >
          {showUploader ? 'Cancel' : 'Add Insurance Document'}
        </Button>
        
        {showUploader && (
          <div className="mt-4">
            <InsuranceDocumentUploader 
              vendor={vendor} 
              onDocumentUploaded={() => {
                loadDocuments();
                setShowUploader(false);
                toast.success("Insurance document uploaded successfully");
              }} 
            />
          </div>
        )}
      </CardContent>
    );
  }
  
  const isExpired = hasExpiredInsurance();
  
  return (
    <>
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Insurance Information</CardTitle>
            <CardDescription>Details about vendor's insurance coverage</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <InsuranceStatusBadge isExpired={isExpired} />
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => loadDocuments()}
            >
              <RefreshCw className="h-3 w-3" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {expiringDocuments.length > 0 && (
          <Alert className="mb-4" variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Insurance documents expiring soon</AlertTitle>
            <AlertDescription>
              {expiringDocuments.length === 1 
                ? `1 document will expire in the next 30 days` 
                : `${expiringDocuments.length} documents will expire in the next 30 days`}. Please review the documents.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowUploader(!showUploader)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showUploader ? 'Cancel' : 'Add Insurance Document'}
          </Button>
        </div>
        
        {showUploader && (
          <div className="mb-6">
            <InsuranceDocumentUploader 
              vendor={vendor} 
              onDocumentUploaded={() => {
                loadDocuments();
                setShowUploader(false);
                toast.success("Insurance document uploaded successfully");
              }} 
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PolicyInfoCard insurance={vendor.insurance} />
          <CoverageDetailsCard insurance={vendor.insurance} />
          <AgentInfoCard insurance={vendor.insurance} />
          <DocumentsCard 
            documents={[
              ...formatDocumentsForDisplay(),
              ...(vendor.insurance?.documents || [])
            ]} 
            isLoading={isLoading}
            onRefresh={loadDocuments}
          />
        </div>
      </CardContent>
    </>
  );
};

export default VendorInsuranceTab;
