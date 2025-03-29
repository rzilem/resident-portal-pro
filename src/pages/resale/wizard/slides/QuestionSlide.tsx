
import React, { useState } from 'react';
import { Question } from '../types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface QuestionSlideProps {
  question: Question;
  answer: any;
  onAnswer: (answer: any) => void;
}

const QuestionSlide: React.FC<QuestionSlideProps> = ({ question, answer, onAnswer }) => {
  const [value, setValue] = useState<any>(answer || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>
        {question.required && (
          <p className="text-sm text-muted-foreground">This field is required</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {question.type === 'text' && (
          <div className="space-y-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your answer"
              className="w-full"
            />
          </div>
        )}

        {question.type === 'textarea' && (
          <div className="space-y-2">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your answer"
              className="min-h-[120px] w-full"
            />
          </div>
        )}

        {question.type === 'radio' && question.options && (
          <RadioGroup
            value={value}
            onValueChange={setValue}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div className="flex items-center space-x-2" key={option}>
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'checkbox' && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div className="flex items-center space-x-2" key={option}>
                <Checkbox
                  id={option}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue([...(value || []), option]);
                    } else {
                      setValue((value || []).filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'select' && question.options && (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {question.type === 'date' && (
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={setValue}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {question.type === 'number' && (
          <div className="space-y-2">
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a number"
              className="w-full"
            />
          </div>
        )}

        <Button
          type="submit"
          className="mt-8"
          disabled={question.required && (value === undefined || value === null || value === '')}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default QuestionSlide;
