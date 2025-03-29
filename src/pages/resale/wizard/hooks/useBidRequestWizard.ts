
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BidRequestFormData } from '../types';
import { bidRequestService } from '@/services/bidRequestService';
import { useAuth } from '@/contexts/AuthContext';

export const useBidRequestWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleAnswerQuestion = (answer: any, questionId: string) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
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
