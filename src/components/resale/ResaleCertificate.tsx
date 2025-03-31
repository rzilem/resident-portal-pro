
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer, FilePenLine } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ResaleCertificateData } from '@/utils/pdfGenerator';

interface ResaleCertificateProps {
  data?: ResaleCertificateData;
  onPrint?: () => void;
  onDownload?: () => void;
}

const ResaleCertificate: React.FC<ResaleCertificateProps> = ({ 
  data,
  onPrint,
  onDownload
}) => {
  const navigate = useNavigate();
  
  // Mock data if none provided
  const certificateData = data || {
    propertyAddress: '123 Main Street',
    unitNumber: 'A101',
    associationName: 'Oakwood Heights Community Association',
    ownerName: 'John Smith',
    purchaserName: 'Jane Doe',
    closingDate: '10/15/2023',
    assessmentAmount: '$350.00',
    outstandingDues: '$0.00',
    specialAssessments: 'None',
    certifiedBy: 'Michael Johnson, Association Manager',
    certificationDate: '09/15/2023'
  };
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      toast.info('Print functionality would open this certificate for printing');
    }
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast.info('Download functionality would save this certificate as a PDF');
    }
  };
  
  const handleCreateNew = () => {
    navigate('/resale/wizard');
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Resale Certificate</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button size="sm" onClick={handleCreateNew}>
            <FileText className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Property Address</p>
                <p>{certificateData.propertyAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit Number</p>
                <p>{certificateData.unitNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Association</p>
                <p>{certificateData.associationName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Owner</p>
                <p>{certificateData.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purchaser</p>
                <p>{certificateData.purchaserName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closing Date</p>
                <p>{certificateData.closingDate}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Assessment</p>
                <p>{certificateData.assessmentAmount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Dues</p>
                <p>{certificateData.outstandingDues}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Special Assessments</p>
                <p>{certificateData.specialAssessments}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Certification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Certified By</p>
                <p>{certificateData.certifiedBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p>{certificateData.certificationDate}</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground pt-4 border-t">
            <p>This certificate is valid for 30 days from the certification date. For questions, please contact the association office.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResaleCertificate;
