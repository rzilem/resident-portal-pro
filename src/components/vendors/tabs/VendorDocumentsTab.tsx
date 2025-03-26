
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VendorDocumentsTabProps {
  vendorId: string;
}

const VendorDocumentsTab: React.FC<VendorDocumentsTabProps> = ({ vendorId }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <Button size="sm" className="gap-1">
          <UploadCloud className="h-4 w-4" />
          Upload Document
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/30 rounded-full p-6 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No documents yet</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Upload contracts, insurance certificates, W-9 forms, or other important vendor documentation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorDocumentsTab;
