
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { VendorInsurance } from '@/types/vendor';

interface DocumentsCardProps {
  insurance: VendorInsurance;
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({ insurance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Insurance Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {!insurance.documents || insurance.documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground text-center">No insurance documents have been uploaded.</p>
            <Button variant="outline" className="mt-4">Upload Documents</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {insurance.documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div className="flex items-center">
                  <FileCheck className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on {format(new Date(doc.uploadDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
