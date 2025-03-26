
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  CircleDashed, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  FileText, 
  ClipboardList,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { id: 'property', label: 'Property Details', icon: Home },
  { id: 'certificate', label: 'Resale Certificate', icon: FileText },
  { id: 'questionnaire', label: 'Condo Questionnaire', icon: ClipboardList },
  { id: 'inspection', label: 'Property Inspection', icon: Calendar },
  { id: 'statement', label: 'Account Statement', icon: DollarSign }
];

const ResaleWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    // Move to next step if not at the end
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish wizard
      toast({
        title: "Resale Process Completed",
        description: "All steps have been completed successfully.",
      });
      navigate('/resale');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepClick = (index: number) => {
    // Only allow clicking on completed steps or the next step
    if (completedSteps.includes(index) || index === 0 || index <= Math.max(...completedSteps) + 1) {
      setCurrentStep(index);
    } else {
      toast({
        title: "Step Locked",
        description: "Please complete the previous steps first.",
        variant: "destructive"
      });
    }
  };
  
  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) {
      return 'completed';
    }
    if (index === currentStep) {
      return 'current';
    }
    if (index <= Math.max(...completedSteps) + 1) {
      return 'available';
    }
    return 'locked';
  };
  
  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Resale Process Wizard</h1>
        <p className="text-muted-foreground">
          Complete each step to prepare all required documents for your resale
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
              <CardDescription>
                {completedSteps.length}/{STEPS.length} steps completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {STEPS.map((step, index) => {
                  const status = getStepStatus(index);
                  const StepIcon = step.icon;
                  
                  return (
                    <Button
                      key={step.id}
                      variant={status === 'current' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleStepClick(index)}
                      disabled={status === 'locked'}
                    >
                      <div className="flex items-center w-full">
                        {status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                        ) : status === 'current' ? (
                          <CircleDashed className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <StepIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                        )}
                        <span>{step.label}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {Math.round((completedSteps.length / STEPS.length) * 100)}% Complete
                </p>
              </div>
            </CardContent>
          </Card>
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
              {/* Property Details Step */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <p>Please enter the property details to begin the resale process.</p>
                  <p>This information will be used to populate your resale documents.</p>
                  
                  {/* Property details form would go here */}
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <p className="text-amber-800">
                      This is a placeholder for the property details form. In a real implementation,
                      this would include fields for property address, current owner, association details, etc.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Resale Certificate Step */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p>Generate a Texas-compliant resale certificate with auto-populated data.</p>
                  
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <p className="text-amber-800">
                      This is a placeholder for the resale certificate generator. 
                      In a real implementation, this would display a form to generate the certificate
                      with data pulled from the property management system.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Condo Questionnaire Step */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <p>Complete the standardized condo questionnaire for lenders.</p>
                  
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <p className="text-amber-800">
                      This is a placeholder for the condo questionnaire form.
                      In a real implementation, this would display the interactive questionnaire
                      with fields for HOA financial health, insurance details, etc.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Property Inspection Step */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <p>Schedule and manage a property inspection with calendar integration.</p>
                  
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <p className="text-amber-800">
                      This is a placeholder for the property inspection scheduler.
                      In a real implementation, this would display a calendar interface to book
                      inspection appointments with available dates and times.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Account Statement Step */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <p>Generate a real-time statement of account showing the seller's current standing.</p>
                  
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <p className="text-amber-800">
                      This is a placeholder for the account statement generator.
                      In a real implementation, this would display a form to generate statements
                      with data pulled from the financial management system.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button onClick={handleNext}>
                {currentStep === STEPS.length - 1 ? (
                  <>Finish</>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResaleWizard;
