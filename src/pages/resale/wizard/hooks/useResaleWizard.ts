
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';
import { STEPS } from '../constants';

export const useResaleWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Property Details
    propertyAddress: '',
    propertyType: '',
    ownerName: '',
    associationName: '',
    closingDate: '',
    
    // Certificate Details
    regularAssessment: '',
    assessmentFrequency: 'monthly',
    specialAssessment: '',
    transferFee: '',
    outstandingBalance: '',
    violations: '',
    litigation: '',
    
    // Questionnaire Details
    condoName: '',
    unitNumber: '',
    managementCompany: '',
    totalUnits: '',
    yearBuilt: '',
    monthlyFee: '',
    reserveBalance: '',
    ownerOccupiedPercentage: '',
    arrearsPercentage: '',
    insuranceCarrier: '',
    policyNumber: '',
    expirationDate: '',
    
    // Account Statement
    accountNumber: '',
    statementDate: '',
    previousBalance: '',
    payments: '',
    newCharges: '',
    currentBalance: '',
    transactions: [
      ['2023-06-01', 'Monthly Assessment', '$250.00', '$250.00'],
      ['2023-06-15', 'Payment Received', '-$250.00', '$0.00'],
      ['2023-07-01', 'Monthly Assessment', '$250.00', '$250.00']
    ],
    
    // TREC Forms
    selectedForms: []
  });

  // Auto-populate data effect - simulates retrieving data from APIs
  useEffect(() => {
    // Only auto-populate if we're moving to steps beyond the initial property details
    if (currentStep === 1 && formData.propertyAddress && formData.associationName) {
      // Simulate fetching data for the certificate
      setFormData(prev => ({
        ...prev,
        regularAssessment: '250.00',
        transferFee: '150.00',
        outstandingBalance: '0.00',
        violations: 'None reported',
        litigation: 'No pending litigation'
      }));
    }
    
    if (currentStep === 2 && formData.propertyAddress) {
      // Simulate fetching data for the questionnaire
      setFormData(prev => ({
        ...prev,
        condoName: formData.associationName,
        unitNumber: formData.propertyAddress.split(' ').pop() || '',
        managementCompany: 'Texas HOA Management LLC',
        totalUnits: '120',
        yearBuilt: '2010',
        monthlyFee: '250.00',
        reserveBalance: '450000.00',
        ownerOccupiedPercentage: '75',
        arrearsPercentage: '5',
        insuranceCarrier: 'Texas Insurance Group',
        policyNumber: 'HOA-12345-TX',
        expirationDate: '2024-12-31'
      }));
    }
    
    if (currentStep === 4 && formData.ownerName) {
      // Simulate fetching data for the account statement
      setFormData(prev => ({
        ...prev,
        accountNumber: '100' + Math.floor(Math.random() * 1000),
        statementDate: new Date().toISOString().split('T')[0],
        previousBalance: '250.00',
        payments: '250.00',
        newCharges: '250.00',
        currentBalance: '250.00'
      }));
    }
  }, [currentStep, formData.propertyAddress, formData.associationName, formData.ownerName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
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
      
      setIsLoading(false);
    }, 1000);
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

  return {
    currentStep,
    completedSteps,
    isLoading,
    formData,
    handleInputChange,
    handleSelectChange,
    handleNext,
    handlePrevious,
    handleStepClick,
  };
};
