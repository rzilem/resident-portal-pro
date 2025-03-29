
import React from 'react';
import ProjectTypeSlide from '../slides/ProjectTypeSlide';
import QuestionSlide from '../slides/QuestionSlide';
import SummarySlide from '../slides/SummarySlide';
import VendorSelectionSlide from '../slides/VendorSelectionSlide';
import BidRequestDetails from './BidRequestDetails';
import { Question } from '../types';

interface WizardStepRendererProps {
  currentStep: number;
  questions: Question[];
  formData: any;
  handleSelectType: (typeId: string) => void;
  handleAnswerQuestion: (answer: any, questionId: string) => void;
  handleSelectVendors: (vendors: string[]) => void;
  updateFormData: (key: string, value: any) => void;
}

const WizardStepRenderer: React.FC<WizardStepRendererProps> = ({
  currentStep,
  questions,
  formData,
  handleSelectType,
  handleAnswerQuestion,
  handleSelectVendors,
  updateFormData,
}) => {
  // Type selection step
  if (currentStep === 0) {
    return (
      <ProjectTypeSlide 
        selectedType={formData.projectType} 
        onSelect={handleSelectType} 
      />
    );
  }
  
  // Question steps
  if (currentStep > 0 && currentStep <= questions.length) {
    const currentQuestion = questions[currentStep - 1];
    return (
      <QuestionSlide 
        question={currentQuestion} 
        answer={formData.answers[currentQuestion.id]} 
        onAnswer={(answer) => handleAnswerQuestion(answer, currentQuestion.id)} 
      />
    );
  }
  
  // Summary step
  if (currentStep === questions.length + 1) {
    return (
      <SummarySlide 
        formData={formData} 
        questions={questions} 
      />
    );
  }
  
  // Vendor selection step
  if (currentStep === questions.length + 2) {
    return (
      <VendorSelectionSlide 
        selectedVendors={formData.vendors} 
        onSelectVendors={handleSelectVendors} 
      />
    );
  }
  
  // Details step
  if (currentStep === questions.length + 3) {
    return (
      <BidRequestDetails
        dueDate={formData.dueDate}
        notes={formData.notes}
        onUpdateDueDate={(date) => updateFormData('dueDate', date)}
        onUpdateNotes={(notes) => updateFormData('notes', notes)}
      />
    );
  }
  
  return null;
};

export default WizardStepRenderer;
