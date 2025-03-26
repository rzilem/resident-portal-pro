
import React from 'react';
import { ResaleCertificateFormValues } from './ResaleCertificateForm';

interface ResaleCertificatePreviewProps {
  formData: ResaleCertificateFormValues;
  onEdit: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

const ResaleCertificatePreview: React.FC<ResaleCertificatePreviewProps> = ({
  formData,
  onEdit,
  onDownload,
  onEmail
}) => {
  return (
    <div className="space-y-6">
      <div className="border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Resale Certificate</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Property Information</h3>
            <p className="text-sm text-muted-foreground">
              {formData.propertyAddress}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Current Owner</h3>
            <p className="text-sm text-muted-foreground">
              {formData.ownerName}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Association</h3>
            <p className="text-sm text-muted-foreground">
              {formData.associationName}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Closing Date</h3>
            <p className="text-sm text-muted-foreground">
              {formData.closingDate}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Account Statement</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Current Regular Assessment:</span> $250.00 monthly</p>
              <p><span className="font-medium">Special Assessment:</span> None</p>
              <p><span className="font-medium">Transfer Fee:</span> $150.00</p>
              <p><span className="font-medium">Outstanding Balance:</span> $0.00</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium">Violations</h3>
            <p className="text-sm text-muted-foreground">
              No open violations found.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Legal Matters</h3>
            <p className="text-sm text-muted-foreground">
              There are no pending legal matters involving this property.
            </p>
          </div>
        </div>
      </div>
      
      <CertificateActions 
        onEdit={onEdit}
        onDownload={onDownload}
        onEmail={onEmail}
      />
    </div>
  );
};

interface CertificateActionsProps {
  onEdit: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

const CertificateActions: React.FC<CertificateActionsProps> = ({ 
  onEdit, 
  onDownload, 
  onEmail 
}) => {
  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={onEdit} className="flex-1">
        Edit
      </Button>
      <Button onClick={onDownload} className="flex-1">
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <Button variant="secondary" onClick={onEmail} className="flex-1">
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';

export default ResaleCertificatePreview;
