
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import { useBidRequestWizard } from './hooks/useBidRequestWizard';
import WizardStepRenderer from './components/WizardStepRenderer';
import { useProjectQuestions } from './hooks/useProjectQuestions';
import { TooltipButton } from '@/components/ui/tooltip-button';
import ImageUpload from './components/ImageUpload';
import ProjectImageGallery from './components/ProjectImageGallery';

const BidRequestWizard = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    getVisibleQuestionCount 
  } = useProjectQuestions();

  const { 
    currentStep, 
    formData, 
    submitting,
    uploadedImages,
    handleNext, 
    handleBack, 
    handleSelectType, 
    handleAnswerQuestion, 
    handleSelectVendors,
    handleSubmit,
    updateFormData,
    handleAddImage,
    handleRemoveImage
  } = useBidRequestWizard();

  const totalSteps = getVisibleQuestionCount(formData.answers) + 4; // +4 for project type, summary, vendors, details
  
  const isFirstStep = currentStep === 0;
  const isFinalStep = currentStep === totalSteps;
  
  // Determine the title based on the current step
  const getStepTitle = () => {
    if (currentStep === 0) return "Select Project Type";
    if (currentStep <= getVisibleQuestionCount(formData.answers)) return "Project Details";
    if (currentStep === getVisibleQuestionCount(formData.answers) + 1) return "Summary";
    if (currentStep === getVisibleQuestionCount(formData.answers) + 2) return "Select Vendors";
    if (currentStep === getVisibleQuestionCount(formData.answers) + 3) return "Additional Details";
    return "Upload Images";
  };
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => navigate('/resale/bid-requests')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bid Requests
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {getStepTitle()}
            <span className="text-sm text-muted-foreground ml-2">
              Step {currentStep + 1} of {totalSteps + 1}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isFinalStep ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Upload Project Images</h2>
              <p className="text-muted-foreground mb-6">
                Upload images related to your project to help vendors understand your requirements better.
              </p>
              
              <ProjectImageGallery 
                images={uploadedImages} 
                onDeleteImage={handleRemoveImage} 
              />
              
              <div className="mt-6">
                <ImageUpload 
                  onImageUploaded={handleAddImage} 
                  category={formData.projectType} 
                />
              </div>
            </div>
          ) : (
            <WizardStepRenderer
              currentStep={currentStep}
              questions={questions}
              formData={formData}
              handleSelectType={handleSelectType}
              handleAnswerQuestion={handleAnswerQuestion}
              handleSelectVendors={handleSelectVendors}
              updateFormData={updateFormData}
            />
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {isFinalStep ? (
              <TooltipButton
                onClick={handleSubmit}
                disabled={submitting}
                tooltipText="Submit your bid request"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </TooltipButton>
            ) : (
              <TooltipButton
                onClick={handleNext}
                tooltipText="Proceed to next step"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </TooltipButton>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BidRequestWizard;
