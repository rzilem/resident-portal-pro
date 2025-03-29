
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BidRequestFormData, Question } from '../types';
import { PROJECT_TYPES } from '../bid-request-data';

interface SummarySlideProps {
  formData: BidRequestFormData;
  questions: Question[];
}

const SummarySlide: React.FC<SummarySlideProps> = ({ formData, questions }) => {
  const projectType = PROJECT_TYPES.find(type => type.id === formData.projectType);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Review Your Bid Request</h2>
      <p className="text-muted-foreground mb-6">
        Please review the information below to ensure everything is correct before proceeding.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {projectType && React.createElement(projectType.icon, { className: "mr-2 h-5 w-5" })}
            {projectType?.name} Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question) => {
            const answer = formData.answers[question.id];
            if (!answer) return null;
            
            return (
              <div key={question.id} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
                <div className="font-medium">{question.question}</div>
                <div className="col-span-2">{answer}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      <div className="bg-muted p-4 rounded-md">
        <p className="text-sm">
          Next, you'll select the vendors you want to request bids from. You can select up to 5 vendors.
        </p>
      </div>
    </div>
  );
};

export default SummarySlide;
