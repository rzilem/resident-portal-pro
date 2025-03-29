
import React from 'react';
import { Question } from '../types';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface QuestionSlideProps {
  question: Question;
  answer: any;
  onAnswer: (value: any) => void;
}

const QuestionSlide: React.FC<QuestionSlideProps> = ({ 
  question, 
  answer, 
  onAnswer 
}) => {
  const handleRadioChange = (value: string) => {
    onAnswer(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onAnswer(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : '';
    onAnswer(value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onAnswer(checked);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>
        {question.required && (
          <p className="text-sm text-muted-foreground">This field is required</p>
        )}
      </div>

      <div className="space-y-4">
        {question.type === 'radio' && question.options && (
          <RadioGroup 
            value={answer || ''} 
            onValueChange={handleRadioChange}
            className="space-y-2"
          >
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem id={option} value={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'text' && (
          <Input
            id={question.id}
            value={answer || ''}
            onChange={handleTextChange}
            className="w-full"
            placeholder="Enter your answer"
          />
        )}

        {question.type === 'textarea' && (
          <Textarea
            id={question.id}
            value={answer || ''}
            onChange={handleTextChange}
            className="w-full min-h-[100px]"
            placeholder="Enter your answer"
          />
        )}

        {question.type === 'number' && (
          <Input
            id={question.id}
            type="number"
            value={answer === 0 ? '0' : answer || ''}
            onChange={handleNumberChange}
            className="w-full"
            placeholder="Enter a number"
          />
        )}

        {question.type === 'checkbox' && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={question.id}
              checked={!!answer}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor={question.id}>
              {question.text}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionSlide;
