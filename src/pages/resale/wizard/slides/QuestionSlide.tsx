
import React from 'react';
import { Question } from '../types';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface QuestionSlideProps {
  question: Question;
  answer: any;
  onAnswer: (value: any) => void;
}

interface ImageOption {
  label: string;
  value: string;
  image: string;
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

  const handleDateChange = (date: Date | undefined) => {
    onAnswer(date);
  };

  // Check if options are in the format of {label, value, image}
  const hasImageOptions = question.options && 
    typeof question.options[0] === 'object' && 
    'image' in question.options[0];

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
          <>
            {hasImageOptions ? (
              <RadioGroup 
                value={answer || ''} 
                onValueChange={handleRadioChange}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {(question.options as unknown as ImageOption[]).map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      id={option.value}
                      value={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-col items-center justify-between cursor-pointer rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all"
                    >
                      <div className="w-full h-48 overflow-hidden rounded-md mb-3">
                        <img 
                          src={option.image} 
                          alt={option.label}
                          className="w-full h-full object-cover transition-all duration-300 hover:scale-105" 
                        />
                      </div>
                      <span className="text-center font-medium mt-1">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
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
          </>
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

        {question.type === 'date' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !answer && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {answer ? format(answer, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={answer}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default QuestionSlide;
