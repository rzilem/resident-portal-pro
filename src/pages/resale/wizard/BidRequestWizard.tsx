
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PROJECT_TYPES, PROJECT_QUESTIONS } from './bid-request-data';
import ProjectTypeSlide from './slides/ProjectTypeSlide';
import QuestionSlide from './slides/QuestionSlide';
import SummarySlide from './slides/SummarySlide';
import VendorSelectionSlide from './slides/VendorSelectionSlide';
import { WizardProgress } from './components/WizardProgress';
import { useBidRequestWizard } from './hooks/useBidRequestWizard';
import WizardNavigation from './components/WizardNavigation';
import BidRequestDetails from './components/BidRequestDetails';

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

  const selectedType = PROJECT_TYPES.find(type => type.id === formData.projectType);
  const questions = selectedType ? PROJECT_QUESTIONS[selectedType.id] || [] : [];

  // Current question based on the step
  const currentQuestion = questions[currentStep - 1];

  const isFirstStep = currentStep === 0;
  const isQuestionStep = currentStep > 0 && currentStep <= questions.length;
  const isSummaryStep = currentStep === questions.length + 1;
  const isVendorStep = currentStep === questions.length + 2;
  const isDetailsStep = currentStep === questions.length + 3;
  const isLastStep = currentStep === questions.length + 3;

  const totalSteps = questions.length + 4; // type selection + questions + summary + vendors + details

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
          {isFirstStep && (
            <ProjectTypeSlide 
              selectedType={formData.projectType} 
              onSelect={handleSelectType} 
            />
          )}

          {isQuestionStep && currentQuestion && (
            <QuestionSlide 
              question={currentQuestion} 
              answer={formData.answers[currentQuestion.id]} 
              onAnswer={(answer) => handleAnswerQuestion(answer, currentQuestion.id)} 
            />
          )}

          {isSummaryStep && (
            <SummarySlide 
              formData={formData} 
              questions={questions} 
            />
          )}

          {isVendorStep && (
            <VendorSelectionSlide 
              selectedVendors={formData.vendors} 
              onSelectVendors={handleSelectVendors} 
            />
          )}

          {isDetailsStep && (
            <BidRequestDetails
              dueDate={formData.dueDate}
              notes={formData.notes}
              onUpdateDueDate={(date) => updateFormData('dueDate', date)}
              onUpdateNotes={(notes) => updateFormData('notes', notes)}
            />
          )}
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
        disableNext={isFirstStep && !formData.projectType}
      />
    </div>
  );
};

export default BidRequestWizard;
