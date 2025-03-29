
import React, { useState } from 'react';
import { Question } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      
      <div className="py-4">
        {question.type === 'text' && (
          <Input 
            value={currentAnswer || ''}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
        )}
        
        {question.type === 'textarea' && (
          <Textarea 
            value={currentAnswer || ''}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="min-h-[120px]"
          />
        )}
        
        {question.type === 'radio' && question.options && (
          <RadioGroup
            value={currentAnswer}
            onValueChange={setCurrentAnswer}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        
        {question.type === 'checkbox' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`option-${index}`}
                  checked={Array.isArray(currentAnswer) ? currentAnswer.includes(option) : false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCurrentAnswer(prev => Array.isArray(prev) ? [...prev, option] : [option]);
                    } else {
                      setCurrentAnswer(prev => Array.isArray(prev) ? prev.filter(item => item !== option) : []);
                    }
                  }}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={
            (question.required && !currentAnswer) || 
            (question.required && Array.isArray(currentAnswer) && currentAnswer.length === 0)
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default QuestionSlide;
