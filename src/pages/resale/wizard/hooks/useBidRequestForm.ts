
import { useState } from 'react';
import { BidRequestFormData } from '../types';

export const useBidRequestForm = (initialData?: Partial<BidRequestFormData>) => {
  const [formData, setFormData] = useState<BidRequestFormData>({
    projectType: '',
    answers: {},
    vendors: [],
    notes: '',
    dueDate: null,
    ...initialData
  });

  const updateFormData = (key: keyof BidRequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectType = (typeId: string) => {
    updateFormData('projectType', typeId);
  };

  const handleAnswerQuestion = (answer: any, questionId: string) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  const handleSelectVendors = (vendorIds: string[]) => {
    updateFormData('vendors', vendorIds);
  };

  return {
    formData,
    updateFormData,
    handleSelectType,
    handleAnswerQuestion,
    handleSelectVendors
  };
};
