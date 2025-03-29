
import React from 'react';
import { BidRequestFormData, Question } from '../types';
import { Card, CardContent } from '@/components/ui/card';

interface SummarySlideProps {
  formData: BidRequestFormData;
  questions: Question[];
}

const SummarySlide: React.FC<SummarySlideProps> = ({ formData, questions }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Project Summary</h2>
        <p className="text-muted-foreground mb-6">
          Review your project details before proceeding
        </p>
      </div>
      
      <Card className="bg-muted/30">
        <CardContent className="p-6 space-y-4">
          {questions.map(question => (
            <div key={question.id} className="space-y-1">
              <h3 className="font-medium">{question.text}</h3>
              <p>
                {typeof formData.answers[question.id] === 'string'
                  ? formData.answers[question.id]
                  : Array.isArray(formData.answers[question.id])
                  ? formData.answers[question.id].join(', ')
                  : JSON.stringify(formData.answers[question.id])}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
        <p className="text-sm">
          In the next steps, you'll select vendors to receive this request and 
          add any additional details before submitting.
        </p>
      </div>
    </div>
  );
};

export default SummarySlide;
