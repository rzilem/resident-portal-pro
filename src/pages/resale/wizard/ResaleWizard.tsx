
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper, Step } from '@/components/ui/stepper';
import { ArrowLeft, ArrowRight, Check, Save, FileClock } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { TooltipButton } from '@/components/ui/tooltip-button';

// Import necessary wizard steps
import PropertyDetailsStep from './steps/PropertyDetailsStep';
import OwnerInfoStep from './steps/OwnerInfoStep';
import DocumentSelectionStep from './steps/DocumentSelectionStep';
import PaymentStep from './steps/PaymentStep';
import ReviewStep from './steps/ReviewStep';

const ResaleWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    property: { id: '', name: '', unit: '' },
    owner: { name: '', email: '', phone: '' },
    documents: {
      resaleCertificate: true,
      condoQuestionnaire: false,
      propertyInspection: false,
      accountStatement: true,
      trecForms: false
    },
    paymentMethod: '',
    fees: {
      processing: 150,
      rush: 0,
      delivery: 0,
      total: 150
    },
    notes: '',
    requestedBy: '',
    dueDate: null
  });

  const steps = [
    { id: 'property', label: 'Property Details' },
    { id: 'owner', label: 'Owner Information' },
    { id: 'documents', label: 'Document Selection' },
    { id: 'payment', label: 'Payment Information' },
    { id: 'review', label: 'Review & Submit' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Process submission here
    console.log('Submitting resale request:', formData);
    
    // Show success message and navigate back to dashboard
    navigate('/resale', { 
      state: { 
        success: true, 
        message: 'Resale request created successfully!' 
      } 
    });
  };

  const handleSaveAsDraft = () => {
    // Save as draft functionality
    console.log('Saving as draft:', formData);
    
    navigate('/resale', { 
      state: { 
        success: true, 
        message: 'Resale request saved as draft' 
      } 
    });
  };

  const handleCancel = () => {
    navigate('/resale');
  };

  const handleUpdateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        ...data
      }
    }));
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDetailsStep 
            formData={formData.property} 
            onUpdate={(data) => handleUpdateFormData('property', data)} 
          />
        );
      case 1:
        return (
          <OwnerInfoStep 
            formData={formData.owner} 
            onUpdate={(data) => handleUpdateFormData('owner', data)} 
          />
        );
      case 2:
        return (
          <DocumentSelectionStep 
            formData={formData.documents} 
            onUpdate={(data) => handleUpdateFormData('documents', data)} 
            onFeesUpdate={(fees) => handleUpdateFormData('fees', fees)} 
          />
        );
      case 3:
        return (
          <PaymentStep 
            formData={formData} 
            onUpdate={(data) => handleUpdateFormData('payment', data)} 
          />
        );
      case 4:
        return (
          <ReviewStep 
            formData={formData} 
            onUpdate={(section, data) => handleUpdateFormData(section, data)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">New Resale Request</h1>
        <p className="text-muted-foreground">Complete the wizard to create a new resale documentation request</p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Resale Documentation Request</CardTitle>
          <CardDescription>
            Follow the steps below to submit a resale document request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper currentStep={currentStep}>
            {steps.map((step, index) => (
              <TooltipProvider key={step.id} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Step 
                      label={step.label} 
                      completed={currentStep > index}
                      active={currentStep === index}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>
                      {index === 0 && "Enter property and association details"}
                      {index === 1 && "Enter owner and purchaser information"}
                      {index === 2 && "Select which documents are needed"}
                      {index === 3 && "Add payment details and processing options"}
                      {index === 4 && "Review all information before submission"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </Stepper>
          
          <div className="mt-8">{renderStepContent()}</div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <TooltipButton 
                variant="outline" 
                onClick={handleBack}
                className="gap-2"
                tooltipText="Go back to previous step"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </TooltipButton>
            )}
          </div>
          
          <div className="flex gap-2">
            <TooltipButton 
              variant="outline" 
              onClick={handleCancel}
              tooltipText="Cancel and return to dashboard"
            >
              Cancel
            </TooltipButton>
            
            <TooltipButton 
              variant="outline" 
              onClick={handleSaveAsDraft}
              className="gap-2"
              tooltipText="Save your progress for later completion"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </TooltipButton>
            
            {currentStep < steps.length - 1 ? (
              <TooltipButton 
                onClick={handleNext}
                className="gap-2"
                tooltipText="Continue to next step"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </TooltipButton>
            ) : (
              <TooltipButton 
                onClick={handleSubmit}
                className="gap-2"
                tooltipText="Submit your completed request"
              >
                <Check className="h-4 w-4" />
                Submit Request
              </TooltipButton>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResaleWizard;
