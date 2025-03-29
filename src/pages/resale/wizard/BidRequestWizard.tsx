
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BidRequestFormData, ProjectType, Question } from './types';
import { PROJECT_TYPES, PROJECT_QUESTIONS } from './bid-request-data';
import ProjectTypeSlide from './slides/ProjectTypeSlide';
import QuestionSlide from './slides/QuestionSlide';
import SummarySlide from './slides/SummarySlide';
import VendorSelectionSlide from './slides/VendorSelectionSlide';
import { WizardProgress } from './components/WizardProgress';
import { CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { bidRequestService } from '@/services/bidRequestService';
import { useAuth } from '@/contexts/AuthContext';

const BidRequestWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BidRequestFormData>({
    projectType: '',
    answers: {},
    vendors: [],
    notes: '',
    dueDate: null
  });
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (key: keyof BidRequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

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

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSelectType = (typeId: string) => {
    updateFormData('projectType', typeId);
    handleNext();
  };

  const handleAnswerQuestion = (answer: any) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer
      }
    }));
    handleNext();
  };

  const handleSelectVendors = (vendorIds: string[]) => {
    updateFormData('vendors', vendorIds);
    handleNext();
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a bid request');
      return;
    }

    setSubmitting(true);
    try {
      const bidRequestId = await bidRequestService.createBidRequest(formData);
      
      if (bidRequestId) {
        toast.success('Bid request submitted successfully!');
        // Redirect to bid requests overview or detail page
        navigate('/resale/bid-requests');
      }
    } catch (error) {
      console.error('Error submitting bid request:', error);
      toast.error('Failed to submit bid request');
    } finally {
      setSubmitting(false);
    }
  };

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
              onAnswer={handleAnswerQuestion} 
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
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Additional Details</h2>
              <p className="text-muted-foreground mb-6">
                Provide any additional information and set a deadline for receiving bids.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dueDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate || undefined}
                        onSelect={(date) => updateFormData('dueDate', date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional details about your project..."
                    className="min-h-[120px] mt-1"
                    value={formData.notes || ''}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        {!isFirstStep && (
          <Button 
            onClick={handleBack} 
            variant="outline"
          >
            Back
          </Button>
        )}
        
        {!isLastStep ? (
          <Button 
            onClick={handleNext}
            className="ml-auto"
            disabled={isFirstStep && !formData.projectType}
          >
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="ml-auto"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BidRequestWizard;
