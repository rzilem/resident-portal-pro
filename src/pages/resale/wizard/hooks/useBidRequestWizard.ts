
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { bidRequestService } from '@/services/bid-request';
import { useAuth } from '@/contexts/AuthContext';
import { useBidRequestForm } from './useBidRequestForm';

export const useBidRequestWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  // Use the extracted form state hook
  const { 
    formData, 
    updateFormData, 
    handleSelectType, 
    handleAnswerQuestion, 
    handleSelectVendors 
  } = useBidRequestForm();

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
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

  return {
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
  };
};
