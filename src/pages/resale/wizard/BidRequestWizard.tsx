
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PROJECT_TYPES, PROJECT_QUESTIONS } from './bid-request-data';
import { WizardProgress } from './components/WizardProgress';
import { useBidRequestWizard } from './hooks/useBidRequestWizard';
import WizardNavigation from './components/WizardNavigation';
import WizardStepRenderer from './components/WizardStepRenderer';

const BidRequestWizard: React.FC = () => {
  const {
    currentStep,
    formData,
    submitting,
    updateFormData,
    handleNext,
    handleBack,
    handleSelectType,
    handleAnswerQuestion,
    handleSelectVendors,
    handleSubmit
  } = useBidRequestWizard();

  // Get questions for the selected project type
  const selectedType = PROJECT_TYPES.find(type => type.id === formData.projectType);
  const questions = selectedType ? PROJECT_QUESTIONS[selectedType.id] || [] : [];

  // Calculate total steps and step states
  const totalSteps = questions.length + 4; // type selection + questions + summary + vendors + details
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === questions.length + 3;
  const disableNext = isFirstStep && !formData.projectType;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Request Bids</h1>
        <p className="text-muted-foreground">
          Complete this form to request bids from vendors for your project
        </p>
      </div>

      <div className="my-6">
        <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <WizardStepRenderer 
            currentStep={currentStep}
            questions={questions}
            formData={formData}
            handleSelectType={handleSelectType}
            handleAnswerQuestion={handleAnswerQuestion}
            handleSelectVendors={handleSelectVendors}
            updateFormData={updateFormData}
          />
        </CardContent>
      </Card>

      <WizardNavigation
        currentStep={currentStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        submitting={submitting}
        disableNext={disableNext}
      />
    </div>
  );
};

export default BidRequestWizard;
