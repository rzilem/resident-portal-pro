
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Question } from '../types';

interface QuestionSlideProps {
  question: Question;
  answer: any;
  onAnswer: (answer: any) => void;
}

const QuestionSlide: React.FC<QuestionSlideProps> = ({ 
  question, 
  answer, 
  onAnswer 
}) => {
  const [currentAnswer, setCurrentAnswer] = useState<any>(answer || '');
  
  const handleSubmit = () => {
    onAnswer(currentAnswer);
  };
  
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup 
            value={currentAnswer} 
            onValueChange={setCurrentAnswer}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="font-normal text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'text':
        return (
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter your answer here..."
            className="min-h-[100px]"
          />
        );
        
      case 'number':
        return (
          <Input
            type="number"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter a number"
            className="max-w-xs"
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{question.question}</h2>
      
      <div className="py-4">
        {renderQuestionInput()}
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleSubmit}
          disabled={question.required && !currentAnswer}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default QuestionSlide;
