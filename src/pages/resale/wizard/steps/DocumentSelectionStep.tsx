
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck, FileQuestion, FileSearch, FileText, FileBadge, Clock } from 'lucide-react';

interface DocumentSelectionStepProps {
  formData: {
    resaleCertificate: boolean;
    condoQuestionnaire: boolean;
    propertyInspection: boolean;
    accountStatement: boolean;
    trecForms: boolean;
  };
  onUpdate: (data: any) => void;
  onFeesUpdate: (fees: any) => void;
}

interface DocumentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  required?: boolean;
}

const DocumentSelectionStep: React.FC<DocumentSelectionStepProps> = ({ 
  formData, 
  onUpdate,
  onFeesUpdate 
}) => {
  const [isRush, setIsRush] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState(formData);
  const [fees, setFees] = useState({
    processing: 150,
    rush: 0,
    delivery: 0,
    total: 150
  });

  const documents: DocumentOption[] = [
    {
      id: 'resaleCertificate',
      name: 'Resale Certificate',
      description: 'Required for property transfer',
      icon: <FileCheck className="h-5 w-5 text-blue-500" />,
      price: 150,
      required: true
    },
    {
      id: 'condoQuestionnaire',
      name: 'Condo Questionnaire',
      description: 'For mortgage lender requirements',
      icon: <FileQuestion className="h-5 w-5 text-purple-500" />,
      price: 75
    },
    {
      id: 'propertyInspection',
      name: 'Property Inspection',
      description: 'On-site property condition report',
      icon: <FileSearch className="h-5 w-5 text-green-500" />,
      price: 100
    },
    {
      id: 'accountStatement',
      name: 'Account Statement',
      description: 'Current financial statement',
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      price: 25
    },
    {
      id: 'trecForms',
      name: 'TREC Forms',
      description: 'Standard real estate forms',
      icon: <FileBadge className="h-5 w-5 text-red-500" />,
      price: 50
    }
  ];

  // Update fees whenever selection changes
  useEffect(() => {
    let docFees = 0;
    
    // Calculate document fees
    documents.forEach(doc => {
      if (selectedDocs[doc.id as keyof typeof selectedDocs]) {
        docFees += doc.price;
      }
    });
    
    // Calculate rush fee if applicable (50% of base price)
    const rushFee = isRush ? Math.round(docFees * 0.5) : 0;
    
    const totalFees = docFees + rushFee;
    
    const newFees = {
      processing: docFees,
      rush: rushFee,
      delivery: 0,
      total: totalFees
    };
    
    setFees(newFees);
    onFeesUpdate(newFees);
  }, [selectedDocs, isRush]);

  const handleDocumentToggle = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    
    // Don't allow unchecking required documents
    if (doc?.required && selectedDocs[docId as keyof typeof selectedDocs]) {
      return;
    }
    
    const updatedDocs = {
      ...selectedDocs,
      [docId]: !selectedDocs[docId as keyof typeof selectedDocs]
    };
    
    setSelectedDocs(updatedDocs);
    onUpdate(updatedDocs);
  };

  const handleRushToggle = (checked: boolean) => {
    setIsRush(checked);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Document Selection</h2>
        <p className="text-muted-foreground">Select the documents needed for this resale package</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {documents.map(doc => (
          <div 
            key={doc.id}
            className={`border rounded-md p-4 flex items-start gap-3 ${
              selectedDocs[doc.id as keyof typeof selectedDocs] ? 'bg-primary/5 border-primary/30' : ''
            }`}
          >
            <Checkbox 
              id={doc.id}
              checked={selectedDocs[doc.id as keyof typeof selectedDocs]} 
              onCheckedChange={() => handleDocumentToggle(doc.id)}
              disabled={doc.required}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor={doc.id}
                  className="font-medium flex items-center gap-2 cursor-pointer"
                >
                  {doc.icon}
                  {doc.name}
                  {doc.required && <span className="text-xs text-primary">(Required)</span>}
                </Label>
                <div className="font-semibold">${doc.price}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="rush-processing" className="flex items-center gap-2 cursor-pointer">
            <Clock className="h-5 w-5 text-amber-500" />
            Rush Processing (24-48 hours)
          </Label>
          <Switch 
            id="rush-processing"
            checked={isRush}
            onCheckedChange={handleRushToggle}
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Standard processing time is 3-5 business days. Select rush processing to receive your documents within 24-48 hours
          for an additional fee of 50% of the base price.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Fee Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document Processing:</span>
              <span>${fees.processing.toFixed(2)}</span>
            </div>
            {fees.rush > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rush Fee:</span>
                <span>${fees.rush.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${fees.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentSelectionStep;
