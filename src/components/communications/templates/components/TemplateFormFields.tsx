
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon } from 'lucide-react';
import { CategoryOptions } from '../types';

interface TemplateFormFieldsProps {
  name: string;
  description: string;
  subject: string;
  category: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMergeTagsClick: () => void;
}

const TemplateFormFields: React.FC<TemplateFormFieldsProps> = ({
  name,
  description,
  subject,
  category,
  onNameChange,
  onDescriptionChange,
  onSubjectChange,
  onCategoryChange,
  onMergeTagsClick
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name*</Label>
          <Input 
            id="template-name" 
            value={name} 
            onChange={(e) => onNameChange(e.target.value)} 
            placeholder="e.g., Welcome New Resident"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="template-category">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="template-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CategoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-description">Description</Label>
        <Textarea 
          id="template-description" 
          value={description} 
          onChange={(e) => onDescriptionChange(e.target.value)} 
          placeholder="Brief description of when to use this template"
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="template-subject">Subject Line*</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onMergeTagsClick}
          >
            <TagIcon className="mr-2 h-4 w-4" />
            Insert Merge Tag
          </Button>
        </div>
        <Input 
          id="template-subject" 
          value={subject} 
          onChange={(e) => onSubjectChange(e.target.value)} 
          placeholder="e.g., Welcome to {{association.name}}"
        />
      </div>
    </>
  );
};

export default TemplateFormFields;
