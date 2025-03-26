
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';
import ResaleCertificateForm, { ResaleCertificateFormValues } from './certificate/ResaleCertificateForm';
import ResaleCertificatePreview from './certificate/ResaleCertificatePreview';
import { PdfGenerator, ResaleCertificateData } from '@/utils/pdfGenerator';

const ResaleCertificate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<ResaleCertificateFormValues>({
    propertyAddress: '',
    ownerName: '',
    associationName: '',
    closingDate: '',
  });

  const onSubmit = async (data: ResaleCertificateFormValues) => {
    setIsLoading(true);
    
    // Save form data for preview mode
    setFormData(data);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPreviewMode(true);
      toast({
        title: "Certificate Generated",
        description: "Resale certificate has been generated successfully.",
      });
    }, 1500);
  };

  const handleDownload = () => {
    // Generate PDF using utility
    const pdfData: ResaleCertificateData = {
      propertyAddress: formData.propertyAddress,
      ownerName: formData.ownerName,
      associationName: formData.associationName,
      closingDate: formData.closingDate,
      regularAssessment: '250.00',
      assessmentFrequency: 'monthly',
      specialAssessment: 'None',
      transferFee: '150.00',
      outstandingBalance: '0.00',
      violations: 'No open violations found',
      litigation: 'No pending litigation',
    };
    
    const pdf = PdfGenerator.createResaleCertificate(pdfData);
    pdf.save();
    
    toast({
      title: "Certificate Downloaded",
      description: "Your resale certificate has been downloaded as a PDF.",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Certificate Sent",
      description: "Your resale certificate has been emailed to the recipients.",
    });
  };

  const handleEdit = () => {
    setPreviewMode(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resale Certificate Generator</CardTitle>
        <CardDescription>
          Create Texas-compliant resale certificates with property and seller information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!previewMode ? (
          <ResaleCertificateForm 
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        ) : (
          <ResaleCertificatePreview 
            formData={formData}
            onEdit={handleEdit}
            onDownload={handleDownload}
            onEmail={handleEmail}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ResaleCertificate;
