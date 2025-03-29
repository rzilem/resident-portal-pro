
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { BidRequestFormData } from './types';
import ProjectTypeSlide from './slides/ProjectTypeSlide';
import QuestionSlide from './slides/QuestionSlide';
import SummarySlide from './slides/SummarySlide';
import VendorSelectionSlide from './slides/VendorSelectionSlide';
import { PROJECT_QUESTIONS } from './bid-request-data';

const BidRequestWizard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<BidRequestFormData>({
    projectType: '',
    answers: {},
    vendors: [],
  });
  
  // Determine the total number of slides based on the selected project type
  const getCurrentQuestions = () => {
    if (!formData.projectType) return [];
    return PROJECT_QUESTIONS[formData.projectType] || [];
  };
  
  const questions = getCurrentQuestions();
  const totalSlides = formData.projectType ? questions.length + 3 : 1; // ProjectType + Questions + Summary + Vendors
  
  // Handle navigation between slides
  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  // Handle form data updates
  const handleSelectProjectType = (projectType: string) => {
    setFormData({ ...formData, projectType });
    setCurrentSlide(1); // Move to the first question
  };
  
  const handleAnswerQuestion = (questionId: string, value: any) => {
    setFormData({
      ...formData,
      answers: {
        ...formData.answers,
        [questionId]: value
      }
    });
    handleNext();
  };
  
  const handleSelectVendors = (vendors: string[]) => {
    setFormData({ ...formData, vendors });
  };
  
  const handleSubmit = () => {
    // This would normally send data to an API
    console.log('Submitting bid request:', formData);
    
    toast.success('Bid request successfully created!');
    
    // Navigate back to the main page
    setTimeout(() => {
      navigate('/resale');
    }, 2000);
  };
  
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All data will be lost.')) {
      navigate('/resale');
    }
  };
  
  // Determine which slide to render
  const renderCurrentSlide = () => {
    // First slide is always project type selection
    if (currentSlide === 0) {
      return (
        <ProjectTypeSlide
          selectedType={formData.projectType}
          onSelect={handleSelectProjectType}
        />
      );
    }
    
    // Question slides
    if (currentSlide <= questions.length) {
      const questionIndex = currentSlide - 1;
      const question = questions[questionIndex];
      
      return (
        <QuestionSlide
          question={question}
          answer={formData.answers[question.id]}
          onAnswer={(value) => handleAnswerQuestion(question.id, value)}
        />
      );
    }
    
    // Summary slide
    if (currentSlide === questions.length + 1) {
      return (
        <SummarySlide
          formData={formData}
          questions={questions}
        />
      );
    }
    
    // Vendor selection slide
    if (currentSlide === questions.length + 2) {
      return (
        <VendorSelectionSlide
          selectedVendors={formData.vendors}
          onSelectVendors={handleSelectVendors}
        />
      );
    }
    
    return null;
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">New Bid Request</h1>
        <p className="text-muted-foreground">Complete the wizard to create a new vendor bid request</p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bid Request Wizard</CardTitle>
          <CardDescription>
            Follow the steps below to submit a bid request to vendors
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress indicator */}
          <div className="w-full bg-muted h-2 rounded-full mb-8">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSlide / (totalSlides - 1)) * 100}%` }}
            ></div>
            <div className="text-xs text-muted-foreground mt-1">
              Step {currentSlide + 1} of {totalSlides}
            </div>
          </div>
          
          {/* Current slide */}
          <div className="min-h-[300px]">
            {renderCurrentSlide()}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div>
            {currentSlide > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            
            {currentSlide === 0 ? (
              <Button 
                onClick={() => {}} 
                disabled={!formData.projectType}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : currentSlide < totalSlides - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  currentSlide <= questions.length && 
                  questions[currentSlide - 1]?.required && 
                  !formData.answers[questions[currentSlide - 1]?.id]
                }
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={formData.vendors.length === 0}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Submit Request
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BidRequestWizard;
