
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { STEPS } from './constants';
import { WizardProgress } from './components/WizardProgress';
import { WizardNavigation } from './components/WizardNavigation';
import { useResaleWizard } from './hooks/useResaleWizard';
import { useGeneratePdf } from './utils/generatePdf';
import ResaleRbacWrapper from '@/components/resale/ResaleRbacWrapper';

// Import step components
import PropertyDetailsStep from './steps/PropertyDetailsStep';
import ResaleCertificateStep from './steps/ResaleCertificateStep';
import CondoQuestionnaireStep from './steps/CondoQuestionnaireStep';
import PropertyInspectionStep from './steps/PropertyInspectionStep';
import AccountStatementStep from './steps/AccountStatementStep';
import TrecFormsStep from './steps/TrecFormsStep';

const ResaleWizard = () => {
  const {
    currentStep,
    completedSteps,
    isLoading,
    formData,
    handleInputChange,
    handleSelectChange,
    handleNext,
    handlePrevious,
    handleStepClick,
  } = useResaleWizard();
  
  const generatePdf = useGeneratePdf();
  
  const handleGeneratePdf = (documentType: 'certificate' | 'questionnaire' | 'statement') => {
    generatePdf(documentType, formData);
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDetailsStep 
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        );
      case 1:
        return (
          <ResaleCertificateStep 
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onGeneratePdf={handleGeneratePdf}
          />
        );
      case 2:
        return (
          <CondoQuestionnaireStep 
            formData={formData}
            onInputChange={handleInputChange}
            onGeneratePdf={handleGeneratePdf}
          />
        );
      case 3:
        return (
          <PropertyInspectionStep 
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        );
      case 4:
        return (
          <AccountStatementStep 
            formData={formData}
            onInputChange={handleInputChange}
            onGeneratePdf={handleGeneratePdf}
          />
        );
      case 5:
        return (
          <TrecFormsStep 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <ResaleRbacWrapper requiredPermission="create">
      <div className="container p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Resale Process Wizard</h1>
          <p className="text-muted-foreground">
            Complete each step to prepare all required documents for your resale
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <WizardProgress 
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          </div>
          
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{STEPS[currentStep].label}</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {STEPS.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
              <CardFooter>
                <WizardNavigation 
                  currentStep={currentStep}
                  totalSteps={STEPS.length}
                  isLoading={isLoading}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ResaleRbacWrapper>
  );
};

export default ResaleWizard;
